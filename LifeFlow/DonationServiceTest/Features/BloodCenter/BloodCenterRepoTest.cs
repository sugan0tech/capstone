using DonationService.Commons;
using DonationService.Features.BloodCenter;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;

namespace DonationServiceTest.Features.BloodCenter;

[TestFixture]
public class BloodCenterRepoTests
{
    private DbContextOptions<DonationServiceContext> _dbContextOptions;
    private DonationServiceContext _context;
    private BloodCenterRepo _bloodCenterRepo;

    [SetUp]
    public void Setup()
    {
        _dbContextOptions = new DbContextOptionsBuilder<DonationServiceContext>()
            .UseInMemoryDatabase("LifeFlowTestDb")
            .Options;

        _context = new DonationServiceContext(_dbContextOptions);
        _bloodCenterRepo = new BloodCenterRepo(_context);
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
        var bloodCenter = new DonationService.Entities.BloodCenter
        {
            Id = 1,
            Name = "Center1",
            Latitude = 40.7128,
            Longitude = -74.0060,
            UnitsCapacity = 100,
            RBCUnits = 50,
            PlateletsUnits = 30,
            PlasmaUnits = 20,
            IsCentralReserve = false,
            SlotsCapacity = 10,
            AddressId = 1,
            OpenByTime = new TimeSpan(9, 0, 0),
            CloseByTime = new TimeSpan(21, 0, 0)
        };
        await _context.BloodCenters.AddAsync(bloodCenter);
        await _context.SaveChangesAsync();

        // Act
        var result = await _bloodCenterRepo.GetById(1);

        // Assert
        ClassicAssert.NotNull(result);
        ClassicAssert.AreEqual("Center1", result.Name);
    }

    [Test]
    public void GetById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _bloodCenterRepo.GetById(99));
        ClassicAssert.AreEqual("BloodCenter with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        // Arrange
        await _context.BloodCenters.AddRangeAsync(
            new DonationService.Entities.BloodCenter
            {
                Id = 1,
                Name = "Center1",
                Latitude = 40.7128,
                Longitude = -74.0060,
                UnitsCapacity = 100,
                RBCUnits = 50,
                PlateletsUnits = 30,
                PlasmaUnits = 20,
                IsCentralReserve = false,
                SlotsCapacity = 10,
                AddressId = 1,
                OpenByTime = new TimeSpan(9, 0, 0),
                CloseByTime = new TimeSpan(21, 0, 0)
            },
            new DonationService.Entities.BloodCenter
            {
                Id = 2,
                Name = "Center2",
                Latitude = 34.0522,
                Longitude = -118.2437,
                UnitsCapacity = 200,
                RBCUnits = 100,
                PlateletsUnits = 60,
                PlasmaUnits = 40,
                IsCentralReserve = true,
                SlotsCapacity = 20,
                AddressId = 2,
                OpenByTime = new TimeSpan(9, 0, 0),
                CloseByTime = new TimeSpan(21, 0, 0)
            }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _bloodCenterRepo.GetAll();

        // Assert
        ClassicAssert.AreEqual(2, result.Count);
    }

    [Test]
    public async Task Add_ShouldAddEntity()
    {
        // Arrange
        var bloodCenter = new DonationService.Entities.BloodCenter
        {
            Id = 1,
            Name = "Center1",
            Latitude = 40.7128,
            Longitude = -74.0060,
            UnitsCapacity = 100,
            RBCUnits = 50,
            PlateletsUnits = 30,
            PlasmaUnits = 20,
            IsCentralReserve = false,
            SlotsCapacity = 10,
            AddressId = 1,
            OpenByTime = new TimeSpan(9, 0, 0),
            CloseByTime = new TimeSpan(21, 0, 0)
        };

        // Act
        var result = await _bloodCenterRepo.Add(bloodCenter);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("Center1", result.Name);
        ClassicAssert.AreEqual(1, await _context.BloodCenters.CountAsync());
    }

    [Test]
    public void Add_ShouldThrowArgumentNullException_WhenEntityIsNull()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _bloodCenterRepo.Add(null));
        ClassicAssert.AreEqual("BloodCenter cannot be null. (Parameter 'entity')", ex.Message);
    }

    [Test]
    public async Task Update_ShouldUpdateEntity()
    {
        // Arrange
        var bloodCenter = new DonationService.Entities.BloodCenter
        {
            Id = 1,
            Name = "Center1",
            Latitude = 40.7128,
            Longitude = -74.0060,
            UnitsCapacity = 100,
            RBCUnits = 50,
            PlateletsUnits = 30,
            PlasmaUnits = 20,
            IsCentralReserve = false,
            SlotsCapacity = 10,
            AddressId = 1,
            OpenByTime = new TimeSpan(9, 0, 0),
            CloseByTime = new TimeSpan(21, 0, 0)
        };
        await _context.BloodCenters.AddAsync(bloodCenter);
        await _context.SaveChangesAsync();

        bloodCenter.Name = "NewCenter1";

        // Act
        var result = await _bloodCenterRepo.Update(bloodCenter);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("NewCenter1", result.Name);
    }

    [Test]
    public void Update_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange
        var updateBloodCenter = new DonationService.Entities.BloodCenter
        {
            Id = 99,
            Name = "Center99",
            Latitude = 35.6895,
            Longitude = 139.6917,
            UnitsCapacity = 300,
            RBCUnits = 150,
            PlateletsUnits = 90,
            PlasmaUnits = 60,
            IsCentralReserve = true,
            SlotsCapacity = 30,
            AddressId = 99,
            OpenByTime = new TimeSpan(9, 0, 0),
            CloseByTime = new TimeSpan(21, 0, 0)
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _bloodCenterRepo.Update(updateBloodCenter));
        ClassicAssert.AreEqual("BloodCenter with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task DeleteById_ShouldDeleteEntity()
    {
        // Arrange
        var bloodCenter = new DonationService.Entities.BloodCenter
        {
            Id = 1,
            Name = "Center1",
            Latitude = 40.7128,
            Longitude = -74.0060,
            UnitsCapacity = 100,
            RBCUnits = 50,
            PlateletsUnits = 30,
            PlasmaUnits = 20,
            IsCentralReserve = false,
            SlotsCapacity = 10,
            AddressId = 1,
            OpenByTime = new TimeSpan(9, 0, 0),
            CloseByTime = new TimeSpan(21, 0, 0)
        };
        await _context.BloodCenters.AddAsync(bloodCenter);
        await _context.SaveChangesAsync();

        // Act
        await _bloodCenterRepo.DeleteById(1);

        // Assert
        ClassicAssert.AreEqual(0, await _context.BloodCenters.CountAsync());
    }

    [Test]
    public void DeleteById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _bloodCenterRepo.DeleteById(99));
        ClassicAssert.AreEqual("BloodCenter with key 99 not found!!!", ex.Message);
    }
}
