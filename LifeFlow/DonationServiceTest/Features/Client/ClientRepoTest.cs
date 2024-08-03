using DonationService.Commons;
using DonationService.Entities;
using DonationService.Commons.Enums;
using DonationService.Features.Client;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework.Legacy;

namespace DonationServiceTest.Features.Client;

[TestFixture]
public class ClientRepoTests
{
    private DbContextOptions<DonationServiceContext> _dbContextOptions;
    private DonationServiceContext _context;
    private ClientRepo _clientRepo;

    [SetUp]
    public void Setup()
    {
        _dbContextOptions = new DbContextOptionsBuilder<DonationServiceContext>()
            .UseInMemoryDatabase("LifeFlowTestDb")
            .Options;

        _context = new DonationServiceContext(_dbContextOptions);
        _clientRepo = new ClientRepo(_context);
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
        var client = new DonationService.Entities.Client
        {
            Id = 1,
            ManagedById = 1,
            Type = ClientType.Hospital,
            Name = "Client1",
            AddressId = 1,
            Orders = new List<DonationService.Entities.Order>()
        };
        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();

        // Act
        var result = await _clientRepo.GetById(1);

        // Assert
        ClassicAssert.NotNull(result);
        ClassicAssert.AreEqual("Client1", result.Name);
    }

    [Test]
    public void GetById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _clientRepo.GetById(99));
        ClassicAssert.AreEqual("Client with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task GetAll_ShouldReturnAllEntities()
    {
        // Arrange
        await _context.Clients.AddRangeAsync(
            new DonationService.Entities.Client
            {
                Id = 1,
                ManagedById = 1,
                Type = ClientType.Hospital,
                Name = "Client1",
                AddressId = 1,
                Orders = new List<DonationService.Entities.Order>()
            },
            new DonationService.Entities.Client
            {
                Id = 2,
                ManagedById = 2,
                Type = ClientType.GovtHospital,
                Name = "Client2",
                AddressId = 2,
                Orders = new List<DonationService.Entities.Order>()
            }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _clientRepo.GetAll();

        // Assert
        ClassicAssert.AreEqual(2, result.Count);
    }

    [Test]
    public async Task Add_ShouldAddEntity()
    {
        // Arrange
        var client = new DonationService.Entities.Client
        {
            Id = 1,
            ManagedById = 1,
            Type = ClientType.Hospital,
            Name = "Client1",
            AddressId = 1,
            Orders = new List<DonationService.Entities.Order>()
        };

        // Act
        var result = await _clientRepo.Add(client);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("Client1", result.Name);
        ClassicAssert.AreEqual(1, await _context.Clients.CountAsync());
    }

    [Test]
    public void Add_ShouldThrowArgumentNullException_WhenEntityIsNull()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentNullException>(async () => await _clientRepo.Add(null));
        ClassicAssert.AreEqual("Client cannot be null. (Parameter 'entity')", ex.Message);
    }

    [Test]
    public async Task Update_ShouldUpdateEntity()
    {
        // Arrange
        var client = new DonationService.Entities.Client
        {
            Id = 1,
            ManagedById = 1,
            Type = ClientType.Hospital,
            Name = "Client1",
            AddressId = 1,
            Orders = new List<DonationService.Entities.Order>()
        };
        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();

        client.Name = "NewClient1";

        // Act
        var result = await _clientRepo.Update(client);

        // Assert
        ClassicAssert.IsNotNull(result);
        ClassicAssert.AreEqual("NewClient1", result.Name);
    }

    [Test]
    public void Update_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Arrange
        var updateClient = new DonationService.Entities.Client
        {
            Id = 99,
            ManagedById = 99,
            Type = ClientType.Hospital,
            Name = "Client99",
            AddressId = 99,
            Orders = new List<DonationService.Entities.Order>()
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _clientRepo.Update(updateClient));
        ClassicAssert.AreEqual("Client with key 99 not found!!!", ex.Message);
    }

    [Test]
    public async Task DeleteById_ShouldDeleteEntity()
    {
        // Arrange
        var client = new DonationService.Entities.Client
        {
            Id = 1,
            ManagedById = 1,
            Type = ClientType.Hospital,
            Name = "Client1",
            AddressId = 1,
            Orders = new List<DonationService.Entities.Order>()
        };
        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();

        // Act
        await _clientRepo.DeleteById(1);

        // Assert
        ClassicAssert.AreEqual(0, await _context.Clients.CountAsync());
    }

    [Test]
    public void DeleteById_ShouldThrowKeyNotFoundException_WhenEntityDoesNotExist()
    {
        // Act & Assert
        var ex = Assert.ThrowsAsync<KeyNotFoundException>(async () => await _clientRepo.DeleteById(99));
        ClassicAssert.AreEqual("Client with key 99 not found!!!", ex.Message);
    }
}
