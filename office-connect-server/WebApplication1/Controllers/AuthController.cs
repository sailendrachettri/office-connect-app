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

        [HttpPost("refresh")]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequest req)
        {
            if (string.IsNullOrEmpty(req.RefreshToken))
                return Unauthorized();

            var principal = _jwtHelper.ValidateToken(req.RefreshToken);
            if (principal == null)
                return Unauthorized();

            var userIdClaim = principal.FindFirst("userId")?.Value;
            var userId = Guid.Parse(userIdClaim);

            var newAccessToken = _jwtHelper.GenerateToken(userId, 60);

            return Ok(new { success = true, accessToken = newAccessToken });
        }
    }
}
