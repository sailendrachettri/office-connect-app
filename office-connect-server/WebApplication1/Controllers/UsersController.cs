using Microsoft.AspNetCore.Mvc;
using Npgsql;
using OfficeConnectServer.Models;
using OfficeConnectServer.Responses;
using System.Text.Json;
using OfficeConnectServer.Helpers;

namespace OfficeConnectServer.Controllers
{
    [ApiController]
    [Route("api/v1/users")]
    public class UsersController : ControllerBase
    {
        private readonly DbHelper _db;
        private readonly JwtTokenHelper _jwt;

        public UsersController(DbHelper db, JwtTokenHelper jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest req)
        {
            const string sql = @"
        SELECT user_id FROM utbl_user_refresh_tokens 
        WHERE refresh_token = @refresh_token AND expires_at > NOW();
    ";

            var userId = await _db.ExecuteScalarAsync<Guid?>(sql, cmd =>
            {
                cmd.Parameters.AddWithValue("refresh_token", req.RefreshToken);
            });

            if (userId == null)
                return Unauthorized(new ApiResponse<string>(false, "Invalid refresh token", null!));

            string newAccessToken = _jwt.GenerateToken(userId.Value, 60);

            return Ok(new ApiResponse<object>(
                true,
                "Token refreshed",
                new { accessToken = newAccessToken }
            ));
        }




        [HttpPost("details-by-id")]
        public async Task<IActionResult> GetUserDetails(
    [FromBody] GetUserDetailsRequest req
)
        {
            if (req.UserId == Guid.Empty)
            {
                return BadRequest(new ApiResponse<string>(
                    false,
                    "Invalid user id",
                    null!
                ));
            }

            try
            {
                const string sql = @"SELECT get_user_details(@user_id_i);";

                var json = await _db.ExecuteScalarAsync<string>(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("user_id_i", req.UserId);
                    }
                );

                var result = JsonSerializer.Deserialize<JsonElement>(json);

                bool success = result.GetProperty("success").GetBoolean();
                string message = result.GetProperty("message").GetString()!;

                if (!success)
                    return BadRequest(new ApiResponse<string>(false, message, null!));

                var data = result.GetProperty("data");

                return Ok(new ApiResponse<JsonElement>(true, message, data));
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<string>(
                    false,
                    "Internal server error",
                    null!
                ));
            }
        }



        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] UserLoginRequest req)
        {
            try
            {
                const string sql = @"SELECT user_login(@email_i);";

                var json = await _db.ExecuteScalarAsync<string>(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("email_i", req.Email);
                    }
                );

                var result = JsonSerializer.Deserialize<JsonElement>(json);

                bool success = result.GetProperty("success").GetBoolean();
                string message = result.GetProperty("message").GetString()!;

                if (!success)
                    return Unauthorized(new ApiResponse<string>(false, message, null!));

                string storedHash = result.GetProperty("password_hash").GetString()!;
                bool isPasswordValid = PasswordHelper.VerifyPassword(req.Password, storedHash);

                if (!isPasswordValid)
                    return Unauthorized(new ApiResponse<string>(false, "Invalid password", null!));

                Guid userId = result.GetProperty("user_id").GetGuid();

                string accessToken = _jwt.GenerateToken(userId, 60);
                string refreshToken = _jwt.GenerateToken(userId, 1440);

                var data = new LoginResponseDto
                {
                    UserId = userId,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };

                return Ok(new ApiResponse<LoginResponseDto>(
                    true,
                    "Login successful",
                   data

                ));
            }
            catch (PostgresException ex)
            {
                return BadRequest(new ApiResponse<string>(false, ex.Message, null!));
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<string>(
                    false,
                    "Internal server error",
                    null!
                ));
            }
        }


        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserCreateModel req)
        {
            string hashedPassword = PasswordHelper.HashPassword(req.Password);

            try
            {
                const string sql = @"
            SELECT add_user_create(
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

                string accessToken = _jwt.GenerateToken(userId, 60);
                string refreshToken = _jwt.GenerateToken(userId, 1440);

                // Store refresh token in DB
                const string insertTokenSql = @"
            INSERT INTO utbl_user_refresh_tokens(user_id, refresh_token, expires_at)
            VALUES(@user_id, @refresh_token, NOW() + INTERVAL '1 day')
        ";
                await _db.ExecuteNonQueryAsync(insertTokenSql, cmd =>
                {
                    cmd.Parameters.AddWithValue("user_id", userId);
                    cmd.Parameters.AddWithValue("refresh_token", refreshToken);
                });

                var data = new LoginResponseDto
                {
                    UserId = userId,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };

                return Ok(new ApiResponse<LoginResponseDto>(true, "User registered successfully", data));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

    }
}
