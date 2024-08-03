using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Features.Donor;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;

namespace DonationServiceTest.Features.Donor;

[TestFixture]
public class DonorRepoTests
{
    private DbContextOptions<DonationServiceContext> _dbContextOptions;
    private DonationServiceContext _context;
    private DonorRepo _donorRepo;

    [SetUp]
    public void Setup()
    {
        _dbContextOptions = new DbContextOptionsBuilder<DonationServiceContext>()
            .UseInMemoryDatabase("LifeFlowTestDb")
            .Options;

        _context = new DonationServiceContext(_dbContextOptions);
        _donorRepo = new DonorRepo(_context);
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
        var donor = new DonationService.Entities.Donor
        {
            Id = 1,
            UserId = 1,
            BloodAntigenType = AntigenType.APositive,
            BloodSubtype = BloodSubtype.Rhd,
            LastDonationTime = DateTime.UtcNow.AddMonths(-3),
            AddressId = 1
        };
        await _context.Donors.AddAsync(donor);
        await _context.SaveChangesAsync();

        // Act
        var result = await _donorRepo.GetById(1);

        // Assert
        ClassicAssert.NotNull(result);
        ClassicAssert.AreEqual(AntigenType.APositive, result.BloodAntigenType);
    }

    [Test]
    public void GetById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _donorRepo.GetById(99));
        ClassicAssert.AreEqual("Donor with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        // Arrange
        await _context.Donors.AddRangeAsync(
            new DonationService.Entities.Donor
            {
                Id = 1,
                UserId = 1,
                BloodAntigenType = AntigenType.APositive,
                BloodSubtype = BloodSubtype.Rhd,
                LastDonationTime = DateTime.UtcNow.AddMonths(-3),
                AddressId = 1
            },
            new DonationService.Entities.Donor
            {
                Id = 2,
                UserId = 2,
                BloodAntigenType = AntigenType.BNegative,
                BloodSubtype = BloodSubtype.Ro,
                LastDonationTime = DateTime.UtcNow.AddMonths(-6),
                AddressId = 2
            }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _donorRepo.GetAll();

        // Assert
        ClassicAssert.AreEqual(2, result.Count);
    }

    [Test]
    public async Task Add_ShouldAddEntity()
    {
        // Arrange
        var donor = new DonationService.Entities.Donor
        {
            Id = 1,
            UserId = 1,
            BloodAntigenType = AntigenType.APositive,
            BloodSubtype = BloodSubtype.Rhd,
            LastDonationTime = DateTime.UtcNow.AddMonths(-3),
            AddressId = 1
        };

        // Act
        var result = await _donorRepo.Add(donor);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual(AntigenType.APositive, result.BloodAntigenType);
        ClassicAssert.AreEqual(1, await _context.Donors.CountAsync());
    }

    [Test]
    public void Add_ShouldThrowArgumentNullException_WhenEntityIsNull()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _donorRepo.Add(null));
        ClassicAssert.AreEqual("Donor cannot be null. (Parameter 'entity')", ex.Message);
    }

    [Test]
    public async Task Update_ShouldUpdateEntity()
    {
        // Arrange
        var donor = new DonationService.Entities.Donor
        {
            Id = 1,
            UserId = 1,
            BloodAntigenType = AntigenType.APositive,
            BloodSubtype = BloodSubtype.Rhd,
            LastDonationTime = DateTime.UtcNow.AddMonths(-3),
            AddressId = 1
        };
        await _context.Donors.AddAsync(donor);
        await _context.SaveChangesAsync();

        donor.BloodAntigenType = AntigenType.BNegative;

        // Act
        var result = await _donorRepo.Update(donor);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual(AntigenType.BNegative, result.BloodAntigenType);
    }

    [Test]
    public void Update_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange
        var updateDonor = new DonationService.Entities.Donor
        {
            Id = 99,
            UserId = 99,
            BloodAntigenType = AntigenType.ABPositive,
            BloodSubtype = BloodSubtype.Ro,
            LastDonationTime = DateTime.UtcNow.AddMonths(-3),
            AddressId = 99
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _donorRepo.Update(updateDonor));
        ClassicAssert.AreEqual("Donor with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task DeleteById_ShouldDeleteEntity()
    {
        // Arrange
        var donor = new DonationService.Entities.Donor
        {
            Id = 1,
            UserId = 1,
            BloodAntigenType = AntigenType.APositive,
            BloodSubtype = BloodSubtype.Rhd,
            LastDonationTime = DateTime.UtcNow.AddMonths(-3),
            AddressId = 1
        };
        await _context.Donors.AddAsync(donor);
        await _context.SaveChangesAsync();

        // Act
        await _donorRepo.DeleteById(1);

        // Assert
        ClassicAssert.AreEqual(0, await _context.Donors.CountAsync());
    }

    [Test]
    public void DeleteById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _donorRepo.DeleteById(99));
        ClassicAssert.AreEqual("Donor with key 99 not found!!!", ex.Message);
    }
}
