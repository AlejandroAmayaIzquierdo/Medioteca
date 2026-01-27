using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace medioteca.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "Description",
                value: "Regular user that can view and create media");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "PasswordHash", "ProfilePicId", "ProfilePicLink", "UserName" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "admin@gmail.com", "$argon2id$v=19$m=65536,t=3,p=1$YJWOX/HegOyik3549zUWxw$Xr+95M2c54e3QnfdrYtD+R2KtD+R4GBOtFeLVnX2Xno", null, null, "admin" });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "Id", "RoleId", "UserId" },
                values: new object[] { -1, 1, new Guid("11111111-1111-1111-1111-111111111111") });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumn: "Id",
                keyValue: -1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "Description",
                value: "Regular user that can play daily challenges");
        }
    }
}
