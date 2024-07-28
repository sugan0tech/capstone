using DonationService.Commons;
using DonationService.Entities;

namespace DonationService.Features.Orders;

public class OrderRepo(DonationServiceContext context) : BaseRepo<Order>(context);