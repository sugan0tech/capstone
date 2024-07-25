using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DonationService.Migrations
{
    /// <inheritdoc />
    public partial class AddDonorServiceBaseEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BloodCenters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    UnitsCapacity = table.Column<int>(type: "int", nullable: false),
                    RBCUnits = table.Column<int>(type: "int", nullable: false),
                    PlateletsUnits = table.Column<int>(type: "int", nullable: false),
                    PlasmaUnits = table.Column<int>(type: "int", nullable: false),
                    IsCentralReserve = table.Column<bool>(type: "bit", nullable: false),
                    AddressId = table.Column<int>(type: "int", nullable: true),
                    OpenByTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    CloseByTime = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodCenters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DonationSlots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SlotTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    SlotStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DonorId = table.Column<int>(type: "int", nullable: false),
                    CenterId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationSlots", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UnitBags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BloodSubtype = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BloodType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Expiry = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DonorId = table.Column<int>(type: "int", nullable: false),
                    CenterId = table.Column<int>(type: "int", nullable: false),
                    IsRare = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnitBags", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BloodCenters_Name",
                table: "BloodCenters",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BloodCenters");

            migrationBuilder.DropTable(
                name: "DonationSlots");

            migrationBuilder.DropTable(
                name: "UnitBags");
        }
    }
}
