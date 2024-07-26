﻿using Microsoft.EntityFrameworkCore;

namespace DonationService.Commons;

public class DonationServiceContext(DbContextOptions<DonationServiceContext> options) : DbContext(options)
{
    public DbSet<DonationService.User.User> Users { get; set; }
    public DbSet<DonationService.Address.Address> Addresses { get; set; }
    public DbSet<Donor.Donor> Donors { get; set; }
    public DbSet<BloodCenter.BloodCenter> BloodCenters { get; set; }
    public DbSet<DonationSlot.DonationSlot> DonationSlots { get; set; }
    public DbSet<UnitBag.UnitBag> UnitBags { get; set; }
    public DbSet<UserSession.UserSession> UserSessions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        #region Address

        modelBuilder.Entity<Address.Address>(entity =>
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

        modelBuilder.Entity<DonationService.User.User>();

        #endregion

        #region Donors

        modelBuilder.Entity<Donor.Donor>().HasIndex(donor => donor.UserId).IsUnique();

        #endregion

        #region UserSession

        modelBuilder.Entity<UserSession.UserSession>();

        #endregion

        #region BloodCenter

        modelBuilder.Entity<BloodCenter.BloodCenter>().HasIndex(center => center.Name).IsUnique();

        #endregion

        #region DonationSlot

        modelBuilder.Entity<DonationSlot.DonationSlot>();

        #endregion

        #region UnitBags

        modelBuilder.Entity<UnitBag.UnitBag>();

        #endregion

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var enumProperties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType.IsEnum);

            foreach (var property in enumProperties)
            {
                modelBuilder.Entity(entityType.Name)
                    .Property(property.Name)
                    .HasConversion<string>();
            }
        }
    }
}