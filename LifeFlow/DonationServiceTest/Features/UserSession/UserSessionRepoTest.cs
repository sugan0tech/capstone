using DonationService.Commons;
using DonationService.Features.UserSession;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;

namespace DonationServiceTest.Features.UserSession;

[TestFixture]
public class UserSessionRepoTests
{
    private DbContextOptions<DonationServiceContext> _dbContextOptions;
    private DonationServiceContext _context;
    private UserSessionRepo _userSessionRepo;

    [SetUp]
    public void Setup()
    {
        _dbContextOptions = new DbContextOptionsBuilder<DonationServiceContext>()
            .UseInMemoryDatabase("LifeFlowTestDb")
            .Options;

        _context = new DonationServiceContext(_dbContextOptions);
        _userSessionRepo = new UserSessionRepo(_context);
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
        var userSession = new DonationService.Entities.UserSession
        {
            Id = 1,
            UserId = 1,
            RefreshToken = "refreshToken1",
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            IsValid = true,
            IpAddress = "127.0.0.1",
            UserAgent = "Mozilla/5.0",
            DeviceType = "Desktop"
        };
        await _context.UserSessions.AddAsync(userSession);
        await _context.SaveChangesAsync();

        // Act
        var result = await _userSessionRepo.GetById(1);

        // Assert
        ClassicAssert.NotNull(result);
        ClassicAssert.AreEqual("refreshToken1", result.RefreshToken);
    }

    [Test]
    public void GetById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _userSessionRepo.GetById(99));
        ClassicAssert.AreEqual("UserSession with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        // Arrange
        await _context.UserSessions.AddRangeAsync(
            new DonationService.Entities.UserSession
            {
                Id = 1,
                UserId = 1,
                RefreshToken = "refreshToken1",
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                IsValid = true,
                IpAddress = "127.0.0.1",
                UserAgent = "Mozilla/5.0",
                DeviceType = "Desktop"
            },
            new DonationService.Entities.UserSession
            {
                Id = 2,
                UserId = 2,
                RefreshToken = "refreshToken2",
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(2),
                IsValid = false,
                IpAddress = "192.168.0.1",
                UserAgent = "Chrome/90.0",
                DeviceType = "Mobile"
            }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _userSessionRepo.GetAll();

        // Assert
        ClassicAssert.AreEqual(2, result.Count);
    }

    [Test]
    public async Task Add_ShouldAddEntity()
    {
        // Arrange
        var userSession = new DonationService.Entities.UserSession
        {
            Id = 1,
            UserId = 1,
            RefreshToken = "refreshToken1",
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            IsValid = true,
            IpAddress = "127.0.0.1",
            UserAgent = "Mozilla/5.0",
            DeviceType = "Desktop"
        };

        // Act
        var result = await _userSessionRepo.Add(userSession);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("refreshToken1", result.RefreshToken);
        ClassicAssert.AreEqual(1, await _context.UserSessions.CountAsync());
    }

    [Test]
    public void Add_ShouldThrowArgumentNullException_WhenEntityIsNull()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _userSessionRepo.Add(null));
        ClassicAssert.AreEqual("UserSession cannot be null. (Parameter 'entity')", ex.Message);
    }

    [Test]
    public async Task Update_ShouldUpdateEntity()
    {
        // Arrange
        var userSession = new DonationService.Entities.UserSession
        {
            Id = 1,
            UserId = 1,
            RefreshToken = "refreshToken1",
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            IsValid = true,
            IpAddress = "127.0.0.1",
            UserAgent = "Mozilla/5.0",
            DeviceType = "Desktop"
        };
        await _context.UserSessions.AddAsync(userSession);
        await _context.SaveChangesAsync();

        userSession.RefreshToken = "newRefreshToken";

        // Act
        var result = await _userSessionRepo.Update(userSession);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("newRefreshToken", result.RefreshToken);
    }

    [Test]
    public void Update_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange
        var updateUserSession = new DonationService.Entities.UserSession
        {
            Id = 99,
            UserId = 1,
            RefreshToken = "refreshToken99",
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            IsValid = true,
            IpAddress = "127.0.0.1",
            UserAgent = "Mozilla/5.0",
            DeviceType = "Desktop"
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _userSessionRepo.Update(updateUserSession));
        ClassicAssert.AreEqual("UserSession with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task DeleteById_ShouldDeleteEntity()
    {
        // Arrange
        var userSession = new DonationService.Entities.UserSession
        {
            Id = 1,
            UserId = 1,
            RefreshToken = "refreshToken1",
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            IsValid = true,
            IpAddress = "127.0.0.1",
            UserAgent = "Mozilla/5.0",
            DeviceType = "Desktop"
        };
        await _context.UserSessions.AddAsync(userSession);
        await _context.SaveChangesAsync();

        // Act
        await _userSessionRepo.DeleteById(1);

        // Assert
        ClassicAssert.AreEqual(0, await _context.UserSessions.CountAsync());
    }

    [Test]
    public void DeleteById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _userSessionRepo.DeleteById(99));
        ClassicAssert.AreEqual("UserSession with key 99 not found!!!", ex.Message);
    }
}
