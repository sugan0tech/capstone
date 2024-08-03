using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Features.UnitBag;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;

namespace DonationServiceTest.Features.UnitBag;

[TestFixture]
public class UnitBagRepoTests
{
    private DbContextOptions<DonationServiceContext> _dbContextOptions;
    private DonationServiceContext _context;
    private UnitBagRepo _unitBagRepo;

    [SetUp]
    public void Setup()
    {
        _dbContextOptions = new DbContextOptionsBuilder<DonationServiceContext>()
            .UseInMemoryDatabase("LifeFlowTestDb")
            .Options;

        _context = new DonationServiceContext(_dbContextOptions);
        _unitBagRepo = new UnitBagRepo(_context);
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
        var unitBag = new DonationService.Entities.UnitBag
        {
            Id = 1,
            Type = AntigenType.APositive,
            BloodSubtype = BloodSubtype.Rhd,
            BloodType = BloodType.Platelet,
            Expiry = DateTime.UtcNow.AddDays(30),
            DonorId = 1,
            CenterId = 1,
            OrderId = null,
            IsRare = false,
            IsSold = false
        };
        await _context.UnitBags.AddAsync(unitBag);
        await _context.SaveChangesAsync();

        // Act
        var result = await _unitBagRepo.GetById(1);

        // Assert
        ClassicAssert.NotNull(result);
        ClassicAssert.AreEqual(AntigenType.APositive, result.Type);
    }

    [Test]
    public void GetById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _unitBagRepo.GetById(99));
        ClassicAssert.AreEqual("UnitBag with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        // Arrange
        await _context.UnitBags.AddRangeAsync(
            new DonationService.Entities.UnitBag
            {
                Id = 1,
                Type = AntigenType.APositive,
                BloodSubtype = BloodSubtype.Rhd,
                BloodType = BloodType.Platelet,
                Expiry = DateTime.UtcNow.AddDays(30),
                DonorId = 1,
                CenterId = 1,
                OrderId = null,
                IsRare = false,
                IsSold = false
            },
            new DonationService.Entities.UnitBag
            {
                Id = 2,
                Type = AntigenType.BNegative,
                BloodSubtype = BloodSubtype.Ro,
                BloodType = BloodType.RBC,
                Expiry = DateTime.UtcNow.AddDays(45),
                DonorId = 2,
                CenterId = 2,
                OrderId = null,
                IsRare = true,
                IsSold = true
            }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _unitBagRepo.GetAll();

        // Assert
        ClassicAssert.AreEqual(2, result.Count);
    }

    [Test]
    public async Task Add_ShouldAddEntity()
    {
        // Arrange
        var unitBag = new DonationService.Entities.UnitBag
        {
            Id = 1,
            Type = AntigenType.APositive,
            BloodSubtype = BloodSubtype.Rhd,
            BloodType = BloodType.Platelet,
            Expiry = DateTime.UtcNow.AddDays(30),
            DonorId = 1,
            CenterId = 1,
            OrderId = null,
            IsRare = false,
            IsSold = false
        };

        // Act
        var result = await _unitBagRepo.Add(unitBag);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual(AntigenType.APositive, result.Type);
        ClassicAssert.AreEqual(1, await _context.UnitBags.CountAsync());
    }

    [Test]
    public void Add_ShouldThrowArgumentNullException_WhenEntityIsNull()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _unitBagRepo.Add(null));
        ClassicAssert.AreEqual("UnitBag cannot be null. (Parameter 'entity')", ex.Message);
    }

    [Test]
    public async Task Update_ShouldUpdateEntity()
    {
        // Arrange
        var unitBag = new DonationService.Entities.UnitBag
        {
            Id = 1,
            Type = AntigenType.APositive,
            BloodSubtype = BloodSubtype.Rhd,
            BloodType = BloodType.Platelet,
            Expiry = DateTime.UtcNow.AddDays(30),
            DonorId = 1,
            CenterId = 1,
            OrderId = null,
            IsRare = false,
            IsSold = false
        };
        await _context.UnitBags.AddAsync(unitBag);
        await _context.SaveChangesAsync();

        unitBag.Type = AntigenType.ABNegative;

        // Act
        var result = await _unitBagRepo.Update(unitBag);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual(AntigenType.ABNegative, result.Type);
    }

    [Test]
    public void Update_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange
        var updateUnitBag = new DonationService.Entities.UnitBag
        {
            Id = 99,
            Type = AntigenType.APositive,
            BloodSubtype = BloodSubtype.Rhd,
            BloodType = BloodType.Platelet,
            Expiry = DateTime.UtcNow.AddDays(30),
            DonorId = 1,
            CenterId = 1,
            OrderId = null,
            IsRare = false,
            IsSold = false
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _unitBagRepo.Update(updateUnitBag));
        ClassicAssert.AreEqual("UnitBag with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task DeleteById_ShouldDeleteEntity()
    {
        // Arrange
        var unitBag = new DonationService.Entities.UnitBag
        {
            Id = 1,
            Type = AntigenType.APositive,
            BloodSubtype = BloodSubtype.Rhd,
            BloodType = BloodType.Platelet,
            Expiry = DateTime.UtcNow.AddDays(30),
            DonorId = 1,
            CenterId = 1,
            OrderId = null,
            IsRare = false,
            IsSold = false
        };
        await _context.UnitBags.AddAsync(unitBag);
        await _context.SaveChangesAsync();

        // Act
        await _unitBagRepo.DeleteById(1);

        // Assert
        ClassicAssert.AreEqual(0, await _context.UnitBags.CountAsync());
    }

    [Test]
    public void DeleteById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _unitBagRepo.DeleteById(99));
        ClassicAssert.AreEqual("UnitBag with key 99 not found!!!", ex.Message);
    }
}
