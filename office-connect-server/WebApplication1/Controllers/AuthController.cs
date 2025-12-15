using Microsoft.AspNetCore.Mvc;
using OfficeConnectServer.Helpers;
using OfficeConnectServer.Models;
using OfficeConnectServer.Responses;
using System;

namespace OfficeConnectServer.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly DbHelper _db;
        private readonly JwtTokenHelper _jwtHelper;

        public AuthController(DbHelper db, JwtTokenHelper jwtHelper)
        {
            _db = db;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest req)
        {
            const string sql = "DELETE FROM utbl_user_refresh_tokens WHERE refresh_token = @token";
            await _db.ExecuteNonQueryAsync(sql, cmd =>
            {
                cmd.Parameters.AddWithValue("token", req.RefreshToken);
            });

            return Ok(new ApiResponse<string>(true, "Logged out", null!));
        }


        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest req)
        {
            var userId = await _db.ExecuteScalarAsync<Guid?>(
                @"SELECT user_id FROM utbl_user_refresh_tokens
          WHERE refresh_token = @token AND expires_at > NOW()",
                cmd => cmd.Parameters.AddWithValue("token", req.RefreshToken)
            );

            if (userId == null)
                return Unauthorized();

            // DELETE OLD TOKEN
            await _db.ExecuteNonQueryAsync(
                "DELETE FROM utbl_user_refresh_tokens WHERE refresh_token = @token",
                cmd => cmd.Parameters.AddWithValue("token", req.RefreshToken)
            );

            // ROTATE
            var newRefreshToken = RefreshTokenHelper.Generate();
            var accessToken = _jwtHelper.GenerateToken(userId.Value, 15);

            await _db.ExecuteNonQueryAsync(
                @"INSERT INTO utbl_user_refresh_tokens
          (user_id, refresh_token, expires_at)
          VALUES (@uid, @token, NOW() + INTERVAL '7 days')",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("uid", userId);
                    cmd.Parameters.AddWithValue("token", newRefreshToken);
                }
            );

            return Ok(new
            {
                accessToken,
                refreshToken = newRefreshToken
            });
        }

    }
}
