using Microsoft.AspNetCore.Mvc;
using Npgsql;
using OfficeConnectServer.Data;
using OfficeConnectServer.Models;
using OfficeConnectServer.Responses;
using System.Text.Json;
using OfficeConnectServer.Helpers;

namespace OfficeConnectServer.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly DbHelper _db;

        public UsersController(DbHelper db)
        {
            _db = db;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserCreateRequest req)
        {
            string hashedPassword = PasswordHelper.HashPassword(req.Password);

            try
            {
                const string sql = @"
                    SELECT add_user_create(
                        @user_name_i,
                        @full_name_i,
                        @mobile_i,
                        @email_i,
                        @password_hash_i,
                        @profile_image_i
                    );
                ";

                var json = await _db.ExecuteScalarAsync<string>(
         sql,
         cmd =>
         {
             cmd.Parameters.AddWithValue("user_name_i", req.UserName);
             cmd.Parameters.AddWithValue("full_name_i", req.FullName);
             cmd.Parameters.AddWithValue("mobile_i", req.Mobile);
             cmd.Parameters.AddWithValue("email_i", req.Email);
             cmd.Parameters.AddWithValue("password_hash_i", hashedPassword);
             cmd.Parameters.AddWithValue("profile_image_i", (object?)req.ProfileImage ?? DBNull.Value);
         }
     );

                var result = JsonSerializer.Deserialize<JsonElement>(json);

                bool success = result.GetProperty("success").GetBoolean();
                string message = result.GetProperty("message").GetString()!;

                if (!success)
                    return BadRequest(new ApiResponse<string>(false, message, null!));

                Guid userId = result.GetProperty("user_id").GetGuid();

                return Ok(new ApiResponse<Guid>(true, message, userId));
            }
            catch (PostgresException ex)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }
    }
}
