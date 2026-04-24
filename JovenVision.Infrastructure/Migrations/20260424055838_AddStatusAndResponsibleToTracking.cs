using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JovenVision.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusAndResponsibleToTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ResponsibleId",
                table: "Tracking",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Tracking",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Tracking_MemberId",
                table: "Tracking",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Tracking_ResponsibleId",
                table: "Tracking",
                column: "ResponsibleId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_EventId",
                table: "Attendances",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_MemberId",
                table: "Attendances",
                column: "MemberId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Events_EventId",
                table: "Attendances",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Members_MemberId",
                table: "Attendances",
                column: "MemberId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tracking_Members_MemberId",
                table: "Tracking",
                column: "MemberId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tracking_Users_ResponsibleId",
                table: "Tracking",
                column: "ResponsibleId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Events_EventId",
                table: "Attendances");

            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Members_MemberId",
                table: "Attendances");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracking_Members_MemberId",
                table: "Tracking");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracking_Users_ResponsibleId",
                table: "Tracking");

            migrationBuilder.DropIndex(
                name: "IX_Tracking_MemberId",
                table: "Tracking");

            migrationBuilder.DropIndex(
                name: "IX_Tracking_ResponsibleId",
                table: "Tracking");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_EventId",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_MemberId",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "ResponsibleId",
                table: "Tracking");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Tracking");
        }
    }
}
