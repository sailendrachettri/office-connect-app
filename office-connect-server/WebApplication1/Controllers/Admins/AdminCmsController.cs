using Microsoft.AspNetCore.Mvc;

using OfficeConnectServer.Models.Admins;
using OfficeConnectServer.Responses;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using OfficeConnectServer.Models;
using OfficeConnectServer.Responses;
using System.Text.Json;
using OfficeConnectServer.Helpers;

[ApiController]
[Route("api/v1/admin/cms")]
public class AdminCmsController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbHelper _db;

    public AdminCmsController(IConfiguration configuration, DbHelper db)
    {
        _configuration = configuration;
        _db = db;
    }

    [HttpPost("add-avatar")]
    public async Task<IActionResult> AddAvatar([FromBody] AddAvatarRequest req)
    {
       

        try
        {
            const string sql = @"
            SELECT public.add_avatars(
                @avatar_url_i
            );
        ";

            var json = await _db.ExecuteScalarAsync<string>(
                sql,
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "avatar_url_i",
                        (object?)req.AvatarUrl ?? DBNull.Value
                    );
                }
            );

            var result = JsonSerializer.Deserialize<JsonElement>(json);

            bool success = result.GetProperty("status").GetString() == "true";
            string message = result.GetProperty("message").GetString()!;

            if (!success)
            {
                return BadRequest(new ApiResponse<JsonElement>(
                    false,
                    message,
                    result
                ));
            }

            return Ok(new ApiResponse<JsonElement>(
                true,
                message,
                result
            ));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<string>(
                false,
                ex.Message,
                null
            ));
        }
    }

}
