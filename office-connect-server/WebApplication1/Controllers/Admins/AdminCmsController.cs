using Microsoft.AspNetCore.Mvc;

using OfficeConnectServer.Models.Admins;
using OfficeConnectServer.Responses;
using System.Text.Json;

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

    [HttpGet("get-avatars")]
    public async Task<IActionResult> GetAvatars()
    {
        try
        {
            const string sql = @"
            SELECT
            avatar_id  AS ""AvatarId"",
            avatar_url AS ""AvatarUrl"",
            created_at AS ""CreatedAt""
        FROM public.utbl_avatars
        ORDER BY created_at DESC;

        ";

            var avatars = await _db.ExecuteQueryListAsync<AvatarDto>(sql);

            return Ok(new ApiResponse<List<AvatarDto>>(
                true,
                "Avatars fetched successfully",
                avatars
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
