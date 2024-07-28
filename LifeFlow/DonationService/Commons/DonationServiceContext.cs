using DonationService.Entities;
using DonationService.Features.Client;
using DonationService.Features.Orders;
using DonationService.Features.Payment;
using Microsoft.EntityFrameworkCore;

namespace DonationService.Commons;

public class DonationServiceContext(DbContextOptions<DonationServiceContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Donor> Donors { get; set; }
    public DbSet<BloodCenter> BloodCenters { get; set; }
    public DbSet<DonationSlot> DonationSlots { get; set; }
    public DbSet<UnitBag> UnitBags { get; set; }
    public DbSet<UserSession> UserSessions { get; set; }

    #region OrderService

    public DbSet<Client> Clients { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Payment> Payments { get; set; }

    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        #region Address

        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Street).IsRequired().HasMaxLength(255);
            entity.Property(a => a.City).IsRequired().HasMaxLength(100);
            entity.Property(a => a.State).IsRequired().HasMaxLength(100);
            entity.Property(a => a.Country).IsRequired().HasMaxLength(100);
            entity.Property(a => a.ZipCode).IsRequired().HasMaxLength(20);
            entity.Property(a => a.EntityId).IsRequired();
            entity.Property(a => a.EntityType).IsRequired().HasMaxLength(50);

            entity.HasIndex(a => new { a.EntityId, a.EntityType }).IsUnique();
        });

        #endregion

        #region User

        modelBuilder.Entity<User>();

        #endregion

        #region Donors

        modelBuilder.Entity<Donor>().HasIndex(donor => donor.UserId).IsUnique();

        #endregion

        #region UserSession

        modelBuilder.Entity<UserSession>();

        #endregion

        #region BloodCenter

        modelBuilder.Entity<BloodCenter>().HasIndex(center => center.Name).IsUnique();

        #endregion

        #region DonationSlot

        modelBuilder.Entity<DonationSlot>();

        #endregion

        #region UnitBags

        modelBuilder.Entity<UnitBag>();

        #endregion


        #region OrderService

        #region Clients

        modelBuilder.Entity<Client>().HasIndex(client => client.Name).IsUnique();
        modelBuilder.Entity<Client>().HasOne<User>(client => client.User);
        modelBuilder.Entity<Client>().HasIndex(client => client.ManagedById).IsUnique();

        #endregion

        #region Orders

        modelBuilder.Entity<Order>().HasOne<Client>(order => order.Client).WithMany(client => client.Orders)
            .HasForeignKey(order => order.ClientId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Order>().HasMany<UnitBag>(order => order.Items);
        modelBuilder.Entity<Order>().HasOne<Payment>(order => order.Payment).WithOne(payment => payment.Order);

        #endregion

        #region Payment

        modelBuilder.Entity<Payment>()
            .HasOne<Order>(payment => payment.Order)
            .WithOne(order => order.Payment)
            .HasForeignKey<Payment>(payment => payment.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        #endregion

        #endregion

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var enumProperties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType.IsEnum);

            foreach (var property in enumProperties)
                modelBuilder.Entity(entityType.Name)
                    .Property(property.Name)
                    .HasConversion<string>();
        }
    }
}