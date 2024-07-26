using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DonationService.Migrations
{
    /// <inheritdoc />
    public partial class UpdateConstrains : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Addresses_EntityId_EntityType",
                table: "Addresses");

            migrationBuilder.CreateIndex(
                name: "IX_Donors_UserId",
                table: "Donors",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_EntityId_EntityType",
                table: "Addresses",
                columns: new[] { "EntityId", "EntityType" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Donors_UserId",
                table: "Donors");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_EntityId_EntityType",
                table: "Addresses");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_EntityId_EntityType",
                table: "Addresses",
                columns: new[] { "EntityId", "EntityType" });
        }
    }
}
