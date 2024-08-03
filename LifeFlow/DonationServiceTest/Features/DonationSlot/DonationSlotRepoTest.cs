using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Features.DonationSlot;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;

namespace DonationServiceTest.Features.DonationSlot;

[TestFixture]
public class DonationSlotRepoTests
{
    private DbContextOptions<DonationServiceContext> _dbContextOptions;
    private DonationServiceContext _context;
    private DonationSlotRepo _donationSlotRepo;

    [SetUp]
    public void Setup()
    {
        _dbContextOptions = new DbContextOptionsBuilder<DonationServiceContext>()
            .UseInMemoryDatabase("LifeFlowTestDb")
            .Options;

        _context = new DonationServiceContext(_dbContextOptions);
        _donationSlotRepo = new DonationSlotRepo(_context);
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
        var donationSlot = new DonationService.Entities.DonationSlot
        {
            Id = 1,
            SlotTime = DateTime.UtcNow,
            SlotStatus = SlotStatus.Pending,
            DonorId = 1,
            CenterId = 1
        };
        await _context.DonationSlots.AddAsync(donationSlot);
        await _context.SaveChangesAsync();

        // Act
        var result = await _donationSlotRepo.GetById(1);

        // Assert
        ClassicAssert.NotNull(result);
        ClassicAssert.AreEqual(SlotStatus.Pending, result.SlotStatus);
    }

    [Test]
    public void GetById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _donationSlotRepo.GetById(99));
        ClassicAssert.AreEqual("DonationSlot with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        // Arrange
        await _context.DonationSlots.AddRangeAsync(
            new DonationService.Entities.DonationSlot
            {
                Id = 1,
                SlotTime = DateTime.UtcNow,
                SlotStatus = SlotStatus.Pending,
                DonorId = 1,
                CenterId = 1
            },
            new DonationService.Entities.DonationSlot
            {
                Id = 2,
                SlotTime = DateTime.UtcNow.AddHours(1),
                SlotStatus = SlotStatus.BloodReceived,
                DonorId = 2,
                CenterId = 2
            }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _donationSlotRepo.GetAll();

        // Assert
        ClassicAssert.AreEqual(2, result.Count);
    }

    [Test]
    public async Task Add_ShouldAddEntity()
    {
        // Arrange
        var donationSlot = new DonationService.Entities.DonationSlot
        {
            Id = 1,
            SlotTime = DateTime.UtcNow,
            SlotStatus = SlotStatus.Pending,
            DonorId = 1,
            CenterId = 1
        };

        // Act
        var result = await _donationSlotRepo.Add(donationSlot);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual(SlotStatus.Pending, result.SlotStatus);
        ClassicAssert.AreEqual(1, await _context.DonationSlots.CountAsync());
    }

    [Test]
    public void Add_ShouldThrowArgumentNullException_WhenEntityIsNull()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _donationSlotRepo.Add(null));
        ClassicAssert.AreEqual("DonationSlot cannot be null. (Parameter 'entity')", ex.Message);
    }

    [Test]
    public async Task Update_ShouldUpdateEntity()
    {
        // Arrange
        var donationSlot = new DonationService.Entities.DonationSlot
        {
            Id = 1,
            SlotTime = DateTime.UtcNow,
            SlotStatus = SlotStatus.Pending,
            DonorId = 1,
            CenterId = 1
        };
        await _context.DonationSlots.AddAsync(donationSlot);
        await _context.SaveChangesAsync();

        donationSlot.SlotStatus = SlotStatus.BloodReceived;

        // Act
        var result = await _donationSlotRepo.Update(donationSlot);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual(SlotStatus.BloodReceived, result.SlotStatus);
    }

    [Test]
    public void Update_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange
        var updateDonationSlot = new DonationService.Entities.DonationSlot
        {
            Id = 99,
            SlotTime = DateTime.UtcNow,
            SlotStatus = SlotStatus.BloodReceived,
            DonorId = 99,
            CenterId = 99
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _donationSlotRepo.Update(updateDonationSlot));
        ClassicAssert.AreEqual("DonationSlot with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task DeleteById_ShouldDeleteEntity()
    {
        // Arrange
        var donationSlot = new DonationService.Entities.DonationSlot
        {
            Id = 1,
            SlotTime = DateTime.UtcNow,
            SlotStatus = SlotStatus.Pending,
            DonorId = 1,
            CenterId = 1
        };
        await _context.DonationSlots.AddAsync(donationSlot);
        await _context.SaveChangesAsync();

        // Act
        await _donationSlotRepo.DeleteById(1);

        // Assert
        ClassicAssert.AreEqual(0, await _context.DonationSlots.CountAsync());
    }

    [Test]
    public void DeleteById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _donationSlotRepo.DeleteById(99));
        ClassicAssert.AreEqual("DonationSlot with key 99 not found!!!", ex.Message);
    }
}
