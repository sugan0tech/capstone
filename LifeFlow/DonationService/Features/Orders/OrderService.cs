using AutoMapper;
using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Entities;
using DonationService.Exceptions;
using DonationService.Features.Address.Request;
using DonationService.Features.BloodCenter;
using DonationService.Features.Client;
using DonationService.Features.Notification;
using DonationService.Features.Payment;
using DonationService.Features.UnitBag;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WatchDog;

namespace DonationService.Features.Orders;

public class OrderService(
    IBaseRepo<Order> repo,
    IMapper mapper,
    UnitBagService unitBagService,
    ClientService clientService,
    BloodCenterService bloodCenterService,
    PaymentService paymentService,
    NotificationService notificationService,
    DonationServiceContext context,
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
            using var transaction = await repo.BeginTransactionAsync();
            try
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

                        fetchedBags = await ProcessForEmergency(nearbyCenters, request);
                        if (fetchedBags.Count == 0)
                        {
                            await notificationService.SendNotification(new NotificationDto
                            {
                                receiverId = request.ClientId,
                                receiverKind = "Client",
                                Message =
                                    $"We are out of stock for {request.AntigenTypes.First().ToString()}, please look out for donors instead"
                            });
                            throw new OutOfServiceException(
                                "Sorry we are out of stock right now, please search for donors directly!!!");
                        }

                        order = await MakeOrder(fetchedBags, request.OrderType, client.Type, request);
                        break;
                    case OrderType.RecurringTransfusion:
                        fetchedBags = await ProcessForRecurringTransfusion(nearbyCenters, request);
                        order = await MakeOrder(fetchedBags, request.OrderType, client.Type, request);
                        break;
                    case OrderType.HospitalStockUpdate:
                        if (request.Subtypes.Contains(BloodSubtype.Ro))
                            throw new InvalidOperationException("Ro is a rare blood, not meant for Stock updates");
                        fetchedBags = await ProcessForHospitalStockUpdate(nearbyCenters, request);
                        order = await MakeOrder(fetchedBags, request.OrderType, client.Type, request);
                        break;
                    case OrderType.RecurringAPI:
                        fetchedBags = await ProcessForRecurringApi(nearbyCenters, request);
                        order = await MakeOrder(fetchedBags, request.OrderType, client.Type, request);
                        break;
                }

                if (order == null)
                    throw new InvalidOperationException("Some error occured");

                WatchLogger.Log(order.ToString());
                var updatedPayment = await paymentService.CreatePayment(order.Id, order.TotalPrice, "InAppPayment");
                order.PaymentId = updatedPayment.Id;
                await repo.Update(order);

                await transaction.CommitAsync();
                return mapper.Map<OrderDto>(order);
            }
            catch (Exception e)
            {
                WatchLogger.LogError(e.Message);
                await transaction.RollbackAsync();
                throw;
            }
        }

        throw new InvalidOperationException("Client Must have defined address");
    }

    public async Task<List<OrderDto>> CenterOrders(string centerName)
    {
        var orders = await repo.GetAll();
        return mapper.Map<List<OrderDto>>(orders).ToList();
    }

    public async Task<List<OrderDto>> ClientOrders(int clientId)
    {
        var orders = await repo.GetAll();
        return mapper.Map<List<OrderDto>>(orders.Where(order => order.ClientId.Equals(clientId))).ToList();
    }

    public async Task<List<UnitBagDto>> ProcessForEmergency(List<BloodCenterFetchDto> centers, OrderRequestDto request)
    {
        var bags = new List<UnitBagDto>();
        foreach (var center in centers)
        {
            var unitBags = await unitBagService.GetAll();
            var unitBagDtos = unitBags.Where(bag =>
                bag.CenterId.Equals(center.Id) && !bag.IsSold && Equals(request.AntigenTypes.First())).ToList();
            foreach (var unitbag in unitBagDtos)
            {
                if (request.MaxQuantity == 0) continue;
                // For emergency only RBC needed & subtype should be Rhd, Ro not needed for emergency transfussion
                if (unitbag.BloodType.Equals(BloodType.RBC) && unitbag.BloodSubtype.Equals(BloodSubtype.Rhd))
                {
                    bags.Add(await bloodCenterService.GetUnitBag(unitbag.Id));
                    request.MaxQuantity--;
                }
            }
        }

        return bags;
    }

    public async Task<List<UnitBagDto>> ProcessForRecurringTransfusion(List<BloodCenterFetchDto> centers,
        OrderRequestDto request)
    {
        var bags = new List<UnitBagDto>();
        // looping through each antigen & type and stock piling it
        foreach (var type in request.types)
        foreach (var antigen in request.AntigenTypes)
        {
            var quantity = request.MaxQuantity;
            foreach (var center in centers)
            {
                var unitBags = await unitBagService.GetAll();
                var unitBagDtos = unitBags.Where(bag =>
                    bag.CenterId.Equals(center.Id) && !bag.IsSold && bag.Type.Equals(antigen)).ToList();
                foreach (var unitbag in unitBagDtos)
                {
                    if (quantity == 0) continue;
                    if (unitbag.BloodType.Equals(type))
                    {
                        bags.Add(await bloodCenterService.GetUnitBag(unitbag.Id));
                        quantity--;
                    }
                }
            }
        }

        return bags;
    }

    public async Task<List<UnitBagDto>> ProcessForHospitalStockUpdate(List<BloodCenterFetchDto> centers,
        OrderRequestDto request)
    {
        var bags = new List<UnitBagDto>();
        // looping through each antigen & type and stock piling it & filling will be based on weightage
        foreach (var type in request.types)
        foreach (var antigen in request.AntigenTypes)
        foreach (var center in centers)
        {
            var unitBags = await unitBagService.GetAll();
            var unitBagDtos = unitBags.Where(bag =>
                bag.CenterId.Equals(center.Id) && !bag.IsSold && bag.Type.Equals(antigen)).ToList();
            // 1/8 of priority for stock updates
            var availableQuantity = unitBagDtos.Count / 8;
            var quantity = request.MaxQuantity <= availableQuantity ? request.MaxQuantity : availableQuantity;
            foreach (var unitbag in unitBagDtos)
            {
                if (quantity <= 0) continue;
                // Ro type is only for Recurring Transfusion
                if (unitbag.BloodType.Equals(type) && unitbag.BloodSubtype.Equals(BloodSubtype.Rhd))
                {
                    bags.Add(await bloodCenterService.GetUnitBag(unitbag.Id));
                    quantity--;
                }
            }
        }

        return bags;
    }

    public async Task<List<UnitBagDto>> ProcessForRecurringApi(List<BloodCenterFetchDto> centers,
        OrderRequestDto request)
    {
        var bags = new List<UnitBagDto>();
        foreach (var center in centers)
        {
            var unitBags = await unitBagService.GetAll();
            var unitBagDtos = unitBags.Where(bag =>
                bag.CenterId.Equals(center.Id) && !bag.IsSold && Equals(request.AntigenTypes.First())).ToList();
            foreach (var unitbag in unitBagDtos)
            {
                if (request.MaxQuantity == 0) continue;
                // For emergency only Plasma needed for API ( active pharmaceutical ingredient
                if (unitbag.BloodType.Equals(BloodType.Plasma))
                {
                    var unitBag = await bloodCenterService.GetUnitBag(unitbag.Id);
                    bags.Add(unitBag);
                    request.MaxQuantity--;
                }
            }
        }

        return bags;
    }

    public Task<Order> MakeOrder(List<UnitBagDto> bags, OrderType type, ClientType clientType, OrderRequestDto request)
    {
        if (bags.Count == 0)
        {
            WatchLogger.LogError("Invalid No Blood Found with Given types");
            throw new OutOfServiceException("Wfff!! We are out of service, there is not stock left near by you");
        }

        var order = new Order();
        double totalPrice = 0;
        order.Quantity = bags.Count;
        order.Items = mapper.Map<List<Entities.UnitBag>>(bags);
        order.OrderDate = DateTime.UtcNow;
        order.Status = OrderStatus.Pending;
        order.Description = request.Description;
        order.ClientId = request.ClientId;

        // Set the state of existing UnitBags to Unchanged
        foreach (var bag in order.Items) context.Entry(bag).State = EntityState.Unchanged;

        switch (type)
        {
            case OrderType.Emergency:
                totalPrice = clientType.Equals(ClientType.GovtHospital) ? 1100 : 1550;
                break;
            case OrderType.RecurringTransfusion:
            case OrderType.HospitalStockUpdate:
                foreach (var bag in bags)
                {
                    WatchLogger.Log(totalPrice.ToString());
                    WatchLogger.Log(bag.Type.ToString());
                    if (bag.BloodType.Equals(BloodType.RBC))
                        totalPrice += clientType.Equals(ClientType.GovtHospital) ? 1100 : 1550;
                    if (bag.BloodType.Equals(BloodType.Plasma))
                        totalPrice += clientType.Equals(ClientType.GovtHospital) ? 300 : 400;
                    if (bag.BloodType.Equals(BloodType.Platelet))
                        totalPrice += clientType.Equals(ClientType.GovtHospital) ? 300 : 400;
                    WatchLogger.Log(totalPrice.ToString());
                }

                break;
            case OrderType.RecurringAPI:
                totalPrice += bags.Count * 2000;
                break;
        }

        order.TotalPrice = totalPrice;

        return repo.Add(order);
    }
}