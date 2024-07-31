using AutoMapper;
using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Entities;
using DonationService.Features.Address.Request;
using DonationService.Features.BloodCenter;
using DonationService.Features.Client;
using DonationService.Features.Notification;
using DonationService.Features.Payment;
using DonationService.Features.UnitBag;
using MediatR;

namespace DonationService.Features.Orders;

public class OrderService(
    IBaseRepo<Order> repo,
    IMapper mapper,
    IBaseService<Entities.UnitBag, UnitBagDto> unitBagService,
    ClientService clientService,
    BloodCenterService bloodCenterService,
    PaymentService paymentService,
    NotificationService notificationService,
    IMediator mediator)
    : BaseService<Order, OrderDto>(repo, mapper), IOrderService
{
    public async Task<OrderDto> MakeOrder(OrderRequestDto request)
    {
        // verifies client
        var client = await clientService.GetById(request.ClientId);
        var addressId = client.AddressId ?? 0;
        if (addressId != 0)
        {
            var address = await mediator.Send(new GetAddressByIdRequest { AddressId = addressId });
            var nearbyCenters = await bloodCenterService.GetNearByCenters(address.Latitude, address.Longitude);
            Order order = null;

            // since recurring API don't require blood type
            if (!request.OrderType.Equals(OrderType.RecurringAPI) && request.types.Count == 0)
                throw new InvalidOperationException("No specified Blood type found");

            // since recurring API don't require antigen types
            if (!request.OrderType.Equals(OrderType.RecurringAPI) && request.AntigenTypes.Count == 0)
                throw new InvalidOperationException("At least you have to select a antigen type");

            List<UnitBagDto> fetchedBags;
            switch (request.OrderType)
            {
                case OrderType.Emergency:
                    if (request.MaxQuantity > 5)
                        throw new InvalidOperationException(
                            "For Emergency request, only 5 units can be allowed. Make separate order for other patients");
                    if (request.types.Count > 1 || request.AntigenTypes.Count > 1 ||
                        request.types.Contains(BloodType.Plasma))
                        throw new InvalidOperationException(
                            "Only RBC of specified type permitted for Emergency orders");

                    fetchedBags = ProcessForEmergency(nearbyCenters, request);
                    order = MakeOrder(fetchedBags, request.OrderType, client.Type);
                    break;
                case OrderType.RecurringTransfusion:
                    fetchedBags = ProcessForRecurringTransfusion(nearbyCenters, request);
                    order = MakeOrder(fetchedBags, request.OrderType, client.Type);
                    break;
                case OrderType.HospitalStockUpdate:
                    if (request.Subtypes.Contains(BloodSubtype.Ro))
                        throw new InvalidOperationException("Ro is a rare blood, not meant for Stock updates");
                    fetchedBags = ProcessForHospitalStockUpdate(nearbyCenters, request);
                    order = MakeOrder(fetchedBags, request.OrderType, client.Type);
                    break;
                case OrderType.RecurringAPI:
                    fetchedBags = ProcessForRecurringApi(nearbyCenters, request);
                    order = MakeOrder(fetchedBags, request.OrderType, client.Type);
                    break;
            }

            if (order == null)
                throw new InvalidOperationException("Some error occured");

            var payment = new PaymentDto
            {
                OrderId = order.Id,
                Amount = (decimal)order.TotalPrice,
                PaymentDate = DateTime.UtcNow
            };
            var updatedPayment = await paymentService.Add(payment);
            order.PaymentId = updatedPayment.Id;
            await repo.Update(order);

            return mapper.Map<OrderDto>(order);
        }

        throw new InvalidOperationException("Client Must have defined address");
    }

    public List<OrderDto> PendingOrders(string centerName)
    {
        var orders = repo.GetAll().Result.Where(order => order.Status.Equals(OrderStatus.Pending)).ToList();
        return mapper.Map<List<OrderDto>>(orders);
    }

    public List<UnitBagDto> ProcessForEmergency(List<BloodCenterFetchDto> centers, OrderRequestDto request)
    {
        var bags = new List<UnitBagDto>();
        centers.ForEach(center =>
        {
            var unitBagDtos = unitBagService.GetAll().Result.Where(bag =>
                bag.CenterId.Equals(center.Id) && !bag.IsSold && Equals(request.AntigenTypes.First())).ToList();
            unitBagDtos.ForEach(unitbag =>
            {
                if (request.MaxQuantity == 0) return;
                // For emergency only RBC needed & subtype should be Rhd, Ro not needed for emergency transfussion
                if (unitbag.BloodType.Equals(BloodType.RBC) && unitbag.BloodSubtype.Equals(BloodSubtype.Rhd))
                {
                    bags.Add(bloodCenterService.GetUnitBag(unitbag.Id).Result);
                    request.MaxQuantity--;
                }
            });
        });

        return bags;
    }

    public List<UnitBagDto> ProcessForRecurringTransfusion(List<BloodCenterFetchDto> centers, OrderRequestDto request)
    {
        var bags = new List<UnitBagDto>();
        // looping through each antigen & type and stock piling it
        request.types.ForEach(type =>
        {
            request.AntigenTypes.ForEach(antigen =>
            {
                var quantity = request.MaxQuantity;
                centers.ForEach(center =>
                {
                    var unitBagDtos = unitBagService.GetAll().Result.Where(bag =>
                        bag.CenterId.Equals(center.Id) && !bag.IsSold && bag.Type.Equals(antigen)).ToList();
                    unitBagDtos.ForEach(unitbag =>
                    {
                        if (quantity == 0) return;
                        if (unitbag.BloodType.Equals(type))
                        {
                            bags.Add(bloodCenterService.GetUnitBag(unitbag.Id).Result);
                            quantity--;
                        }
                    });
                });
            });
        });

        return bags;
    }

    public List<UnitBagDto> ProcessForHospitalStockUpdate(List<BloodCenterFetchDto> centers, OrderRequestDto request)
    {
        var bags = new List<UnitBagDto>();
        // looping through each antigen & type and stock piling it & filling will be based on weightage
        request.types.ForEach(type =>
        {
            request.AntigenTypes.ForEach(antigen =>
            {
                centers.ForEach(center =>
                {
                    var unitBagDtos = unitBagService.GetAll().Result.Where(bag =>
                        bag.CenterId.Equals(center.Id) && !bag.IsSold && bag.Type.Equals(antigen)).ToList();
                    // 1/8 of priority for stock updates
                    var availableQuantity = unitBagDtos.Count / 8;
                    var quantity = request.MaxQuantity <= availableQuantity ? request.MaxQuantity : availableQuantity;
                    unitBagDtos.ForEach(unitbag =>
                    {
                        if (quantity <= 0) return;
                        // Ro type is only for Recurring Transfusion
                        if (unitbag.BloodType.Equals(type) && unitbag.BloodSubtype.Equals(BloodSubtype.Rhd))
                        {
                            bags.Add(bloodCenterService.GetUnitBag(unitbag.Id).Result);
                            quantity--;
                        }
                    });
                });
            });
        });

        return bags;
    }

    public List<UnitBagDto> ProcessForRecurringApi(List<BloodCenterFetchDto> centers, OrderRequestDto request)
    {
        var bags = new List<UnitBagDto>();
        centers.ForEach(center =>
        {
            var unitBagDtos = unitBagService.GetAll().Result.Where(bag =>
                bag.CenterId.Equals(center.Id) && !bag.IsSold && Equals(request.AntigenTypes.First())).ToList();
            unitBagDtos.ForEach(unitbag =>
            {
                if (request.MaxQuantity == 0) return;
                // For emergency only Plasma needed for API ( active pharmaceutical ingredient
                if (unitbag.BloodType.Equals(BloodType.Plasma))
                {
                    bags.Add(bloodCenterService.GetUnitBag(unitbag.Id).Result);
                    request.MaxQuantity--;
                }
            });
        });

        return bags;
    }

    public Order MakeOrder(List<UnitBagDto> bags, OrderType type, ClientType clientType)
    {
        var order = new Order();
        double totalPrice = 0;
        order.Quantity = bags.Count;
        order.Items = mapper.Map<List<Entities.UnitBag>>(bags);
        order.OrderDate = DateTime.UtcNow;
        order.Status = OrderStatus.Pending;
        switch (type)
        {
            case OrderType.Emergency:
                totalPrice = clientType.Equals(ClientType.GovtHospital) ? 1100 : 1550;
                break;
            case OrderType.RecurringTransfusion:
            case OrderType.HospitalStockUpdate:
                bags.ForEach(bag =>
                {
                    if (bag.Type.Equals(BloodType.RBC))
                        totalPrice += clientType.Equals(ClientType.GovtHospital) ? 1100 : 1550;
                    if (bag.Type.Equals(BloodType.Plasma))
                        totalPrice += clientType.Equals(ClientType.GovtHospital) ? 300 : 400;
                    if (bag.Type.Equals(BloodType.Platelet))
                        totalPrice += clientType.Equals(ClientType.GovtHospital) ? 300 : 400;
                });
                break;
            case OrderType.RecurringAPI:
                totalPrice += bags.Count * 2000;
                break;
        }

        order.TotalPrice = totalPrice;

        repo.Add(order);
        return order;
    }
}