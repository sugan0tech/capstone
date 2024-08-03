using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Entities;
using DonationService.Features.Orders;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;

namespace DonationServiceTest.Features.Order;

[TestFixture]
public class OrderRepoTests
{
    private DbContextOptions<DonationServiceContext> _dbContextOptions;
    private DonationServiceContext _context;
    private OrderRepo _orderRepo;

    [SetUp]
    public void Setup()
    {
        _dbContextOptions = new DbContextOptionsBuilder<DonationServiceContext>()
            .UseInMemoryDatabase("LifeFlowTestDb")
            .Options;

        _context = new DonationServiceContext(_dbContextOptions);
        _orderRepo = new OrderRepo(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Test]
    public async Task GetById_ShouldReturnEntity_WhenEntityExists()
    {
        // Arrange
        var order = new DonationService.Entities.Order
        {
            Id = 1,
            ClientId = 1,
            Status = OrderStatus.Pending,
            Quantity = 10,
            TotalPrice = 100.0,
            Description = "Test Order",
            OrderType = OrderType.HospitalStockUpdate,
            OrderDate = DateTime.UtcNow,
            DeliveryDate = DateTime.UtcNow.AddDays(1),
            PaymentId = 1,
            Items = new List<DonationService.Entities.UnitBag>()
        };
        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();

        // Act
        var result = await _orderRepo.GetById(1);

        // Assert
        ClassicAssert.NotNull(result);
        ClassicAssert.AreEqual("Test Order", result.Description);
    }

    [Test]
    public void GetById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _orderRepo.GetById(99));
        ClassicAssert.AreEqual("Order with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        // Arrange
        await _context.Orders.AddRangeAsync(
            new DonationService.Entities.Order
            {
                Id = 1,
                ClientId = 1,
                Status = OrderStatus.Pending,
                Quantity = 10,
                TotalPrice = 100.0,
                Description = "Test Order 1",
                OrderType = OrderType.HospitalStockUpdate,
                OrderDate = DateTime.UtcNow,
                DeliveryDate = DateTime.UtcNow.AddDays(1),
                PaymentId = 1,
                Items = new List<DonationService.Entities.UnitBag>()
            },
            new DonationService.Entities.Order
            {
                Id = 2,
                ClientId = 2,
                Status = OrderStatus.Approved,
                Quantity = 20,
                TotalPrice = 200.0,
                Description = "Test Order 2",
                OrderType = OrderType.RecurringTransfusion,
                OrderDate = DateTime.UtcNow,
                DeliveryDate = DateTime.UtcNow.AddDays(2),
                PaymentId = 2,
                Items = new List<DonationService.Entities.UnitBag>()
            }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _orderRepo.GetAll();

        // Assert
        ClassicAssert.AreEqual(2, result.Count);
    }

    [Test]
    public async Task Add_ShouldAddEntity()
    {
        // Arrange
        var order = new DonationService.Entities.Order
        {
            Id = 1,
            ClientId = 1,
            Status = OrderStatus.Pending,
            Quantity = 10,
            TotalPrice = 100.0,
            Description = "Test Order",
            OrderType = OrderType.HospitalStockUpdate,
            OrderDate = DateTime.UtcNow,
            DeliveryDate = DateTime.UtcNow.AddDays(1),
            PaymentId = 1,
            Items = new List<DonationService.Entities.UnitBag>()
        };

        // Act
        var result = await _orderRepo.Add(order);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("Test Order", result.Description);
        ClassicAssert.AreEqual(1, await _context.Orders.CountAsync());
    }

    [Test]
    public void Add_ShouldThrowArgumentNullException_WhenEntityIsNull()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _orderRepo.Add(null));
        ClassicAssert.AreEqual("Order cannot be null. (Parameter 'entity')", ex.Message);
    }

    [Test]
    public async Task Update_ShouldUpdateEntity()
    {
        // Arrange
        var order = new DonationService.Entities.Order
        {
            Id = 1,
            ClientId = 1,
            Status = OrderStatus.Pending,
            Quantity = 10,
            TotalPrice = 100.0,
            Description = "Test Order",
            OrderType = OrderType.HospitalStockUpdate,
            OrderDate = DateTime.UtcNow,
            DeliveryDate = DateTime.UtcNow.AddDays(1),
            PaymentId = 1,
            Items = new List<DonationService.Entities.UnitBag>()
        };
        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();

        order.Description = "Updated Test Order";

        // Act
        var result = await _orderRepo.Update(order);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("Updated Test Order", result.Description);
    }

    [Test]
    public void Update_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange
        var updateOrder = new DonationService.Entities.Order
        {
            Id = 99,
            ClientId = 99,
            Status = OrderStatus.Pending,
            Quantity = 10,
            TotalPrice = 100.0,
            Description = "Nonexistent Order",
            OrderType = OrderType.HospitalStockUpdate,
            OrderDate = DateTime.UtcNow,
            DeliveryDate = DateTime.UtcNow.AddDays(1),
            PaymentId = 99,
            Items = new List<DonationService.Entities.UnitBag>()
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _orderRepo.Update(updateOrder));
        ClassicAssert.AreEqual("Order with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task DeleteById_ShouldDeleteEntity()
    {
        // Arrange
        var order = new DonationService.Entities.Order
        {
            Id = 1,
            ClientId = 1,
            Status = OrderStatus.Pending,
            Quantity = 10,
            TotalPrice = 100.0,
            Description = "Test Order",
            OrderType = OrderType.HospitalStockUpdate,
            OrderDate = DateTime.UtcNow,
            DeliveryDate = DateTime.UtcNow.AddDays(1),
            PaymentId = 1,
            Items = new List<DonationService.Entities.UnitBag>()
        };
        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();

        // Act
        await _orderRepo.DeleteById(1);

        // Assert
        ClassicAssert.AreEqual(0, await _context.Orders.CountAsync());
    }

    [Test]
    public void DeleteById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _orderRepo.DeleteById(99));
        ClassicAssert.AreEqual("Order with key 99 not found!!!", ex.Message);
    }
}
