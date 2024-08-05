using DonationService.Commons;
using DonationService.Features.Notification;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;

namespace DonationServiceTest.Features.Notification;

[TestFixture]
public class NotificationRepoTests
{
    [SetUp]
    public void Setup()
    {
        _dbContextOptions = new DbContextOptionsBuilder<DonationServiceContext>()
            .UseInMemoryDatabase("LifeFlowTestDb")
            .Options;

        _context = new DonationServiceContext(_dbContextOptions);
        _notificationRepo = new NotificationRepo(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    private DbContextOptions<DonationServiceContext> _dbContextOptions;
    private DonationServiceContext _context;
    private NotificationRepo _notificationRepo;

    [Test]
    public async Task GetById_ShouldReturnEntity_WhenEntityExists()
    {
        // Arrange
        var notification = new DonationService.Entities.Notification
        {
            Id = 1,
            Message = "Test Message",
            receiverId = 1,
            receiverKind = "User",
            CreatedAt = DateTime.UtcNow,
            IsSent = false,
            IsViewed = false
        };
        await _context.Notification.AddAsync(notification);
        await _context.SaveChangesAsync();

        // Act
        var result = await _notificationRepo.GetById(1);

        // Assert
        ClassicAssert.NotNull(result);
        ClassicAssert.AreEqual("Test Message", result.Message);
    }

    [Test]
    public void GetById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _notificationRepo.GetById(99));
        ClassicAssert.AreEqual("Notification with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        // Arrange
        await _context.Notification.AddRangeAsync(
            new DonationService.Entities.Notification
            {
                Id = 1,
                Message = "Test Message 1",
                receiverId = 1,
                receiverKind = "User",
                CreatedAt = DateTime.UtcNow,
                IsSent = false,
                IsViewed = false
            },
            new DonationService.Entities.Notification
            {
                Id = 2,
                Message = "Test Message 2",
                receiverId = 2,
                receiverKind = "Center",
                CreatedAt = DateTime.UtcNow,
                IsSent = true,
                IsViewed = true
            }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _notificationRepo.GetAll();

        // Assert
        ClassicAssert.AreEqual(2, result.Count);
    }

    [Test]
    public async Task Add_ShouldAddEntity()
    {
        // Arrange
        var notification = new DonationService.Entities.Notification
        {
            Id = 1,
            Message = "Test Message",
            receiverId = 1,
            receiverKind = "User",
            CreatedAt = DateTime.UtcNow,
            IsSent = false,
            IsViewed = false
        };

        // Act
        var result = await _notificationRepo.Add(notification);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("Test Message", result.Message);
        ClassicAssert.AreEqual(1, await _context.Notification.CountAsync());
    }

    [Test]
    public void Add_ShouldThrowArgumentNullException_WhenEntityIsNull()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _notificationRepo.Add(null));
        ClassicAssert.AreEqual("Notification cannot be null. (Parameter 'entity')", ex.Message);
    }

    [Test]
    public async Task Update_ShouldUpdateEntity()
    {
        // Arrange
        var notification = new DonationService.Entities.Notification
        {
            Id = 1,
            Message = "Test Message",
            receiverId = 1,
            receiverKind = "User",
            CreatedAt = DateTime.UtcNow,
            IsSent = false,
            IsViewed = false
        };
        await _context.Notification.AddAsync(notification);
        await _context.SaveChangesAsync();

        notification.Message = "Updated Test Message";

        // Act
        var result = await _notificationRepo.Update(notification);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("Updated Test Message", result.Message);
    }

    [Test]
    public void Update_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange
        var updateNotification = new DonationService.Entities.Notification
        {
            Id = 99,
            Message = "Nonexistent Message",
            receiverId = 99,
            receiverKind = "Client",
            CreatedAt = DateTime.UtcNow,
            IsSent = false,
            IsViewed = false
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(
            async () => await _notificationRepo.Update(updateNotification));
        ClassicAssert.AreEqual("Notification with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task DeleteById_ShouldDeleteEntity()
    {
        // Arrange
        var notification = new DonationService.Entities.Notification
        {
            Id = 1,
            Message = "Test Message",
            receiverId = 1,
            receiverKind = "User",
            CreatedAt = DateTime.UtcNow,
            IsSent = false,
            IsViewed = false
        };
        await _context.Notification.AddAsync(notification);
        await _context.SaveChangesAsync();

        // Act
        await _notificationRepo.DeleteById(1);

        // Assert
        ClassicAssert.AreEqual(0, await _context.Notification.CountAsync());
    }

    [Test]
    public void DeleteById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _notificationRepo.DeleteById(99));
        ClassicAssert.AreEqual("Notification with key 99 not found!!!", ex.Message);
    }
}