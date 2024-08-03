using DonationService.Commons;
using DonationService.Features.Payment;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;

namespace DonationServiceTest.Features.Payment;

[TestFixture]
public class PaymentRepoTests
{
    private DbContextOptions<DonationServiceContext> _dbContextOptions;
    private DonationServiceContext _context;
    private PaymentRepo _paymentRepo;

    [SetUp]
    public void Setup()
    {
        _dbContextOptions = new DbContextOptionsBuilder<DonationServiceContext>()
            .UseInMemoryDatabase("LifeFlowTestDb")
            .Options;

        _context = new DonationServiceContext(_dbContextOptions);
        _paymentRepo = new PaymentRepo(_context);
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
        var payment = new DonationService.Entities.Payment
        {
            Id = 1,
            OrderId = 1,
            Amount = 100.0,
            PaymentDate = DateTime.UtcNow,
            PaymentMethod = "NetBanking",
            TransactionId = "TXN123456"
        };
        await _context.Payments.AddAsync(payment);
        await _context.SaveChangesAsync();

        // Act
        var result = await _paymentRepo.GetById(1);

        // Assert
        ClassicAssert.NotNull(result);
        ClassicAssert.AreEqual("NetBanking", result.PaymentMethod);
    }

    [Test]
    public void GetById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _paymentRepo.GetById(99));
        ClassicAssert.AreEqual("Payment with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        // Arrange
        await _context.Payments.AddRangeAsync(
            new DonationService.Entities.Payment
            {
                Id = 1,
                OrderId = 1,
                Amount = 100.0,
                PaymentDate = DateTime.UtcNow,
                PaymentMethod = "NetBanking",
                TransactionId = "TXN123456"
            },
            new DonationService.Entities.Payment
            {
                Id = 2,
                OrderId = 2,
                Amount = 200.0,
                PaymentDate = DateTime.UtcNow,
                PaymentMethod = "CreditCard",
                TransactionId = "TXN654321"
            }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _paymentRepo.GetAll();

        // Assert
        ClassicAssert.AreEqual(2, result.Count);
    }

    [Test]
    public async Task Add_ShouldAddEntity()
    {
        // Arrange
        var payment = new DonationService.Entities.Payment
        {
            Id = 1,
            OrderId = 1,
            Amount = 100.0,
            PaymentDate = DateTime.UtcNow,
            PaymentMethod = "NetBanking",
            TransactionId = "TXN123456"
        };

        // Act
        var result = await _paymentRepo.Add(payment);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("NetBanking", result.PaymentMethod);
        ClassicAssert.AreEqual(1, await _context.Payments.CountAsync());
    }

    [Test]
    public void Add_ShouldThrowArgumentNullException_WhenEntityIsNull()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _paymentRepo.Add(null));
        ClassicAssert.AreEqual("Payment cannot be null. (Parameter 'entity')", ex.Message);
    }

    [Test]
    public async Task Update_ShouldUpdateEntity()
    {
        // Arrange
        var payment = new DonationService.Entities.Payment
        {
            Id = 1,
            OrderId = 1,
            Amount = 100.0,
            PaymentDate = DateTime.UtcNow,
            PaymentMethod = "NetBanking",
            TransactionId = "TXN123456"
        };
        await _context.Payments.AddAsync(payment);
        await _context.SaveChangesAsync();

        payment.PaymentMethod = "CreditCard";

        // Act
        var result = await _paymentRepo.Update(payment);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("CreditCard", result.PaymentMethod);
    }

    [Test]
    public void Update_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange
        var updatePayment = new DonationService.Entities.Payment
        {
            Id = 99,
            OrderId = 99,
            Amount = 100.0,
            PaymentDate = DateTime.UtcNow,
            PaymentMethod = "NetBanking",
            TransactionId = "Nonexistent"
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _paymentRepo.Update(updatePayment));
        ClassicAssert.AreEqual("Payment with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task DeleteById_ShouldDeleteEntity()
    {
        // Arrange
        var payment = new DonationService.Entities.Payment
        {
            Id = 1,
            OrderId = 1,
            Amount = 100.0,
            PaymentDate = DateTime.UtcNow,
            PaymentMethod = "NetBanking",
            TransactionId = "TXN123456"
        };
        await _context.Payments.AddAsync(payment);
        await _context.SaveChangesAsync();

        // Act
        await _paymentRepo.DeleteById(1);

        // Assert
        ClassicAssert.AreEqual(0, await _context.Payments.CountAsync());
    }

    [Test]
    public void DeleteById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _paymentRepo.DeleteById(99));
        ClassicAssert.AreEqual("Payment with key 99 not found!!!", ex.Message);
    }
}
