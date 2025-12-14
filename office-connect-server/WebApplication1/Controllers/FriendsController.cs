using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeConnectServer.Models;
using OfficeConnectServer.Responses;
using System.Text.Json;

namespace OfficeConnectServer.Controllers
{
    [ApiController]
    [Route("api/v1/friends")]
    public class FriendsController : ControllerBase
    {
        private readonly DbHelper _db;

        public FriendsController(DbHelper db)
        {
            _db = db;
        }


        [Authorize]
        [HttpPost("send-request")]
        public async Task<IActionResult> SendFriendRequest(
            [FromBody] SendFriendRequestModel req
        )
        {
            if (req.ReceiverId == Guid.Empty)
            {
                return BadRequest(new ApiResponse<string>(
                    false,
                    "Invalid receiver",
                    null!
                ));
            }

            var senderObj = HttpContext.Items["UserId"];
            if (senderObj == null)
            {
                return Unauthorized(new ApiResponse<string>(
                    false,
                    "Unauthorized",
                    null!
                ));
            }

            var senderId = (Guid)senderObj;

            try
            {
                const string sql = @"
                    SELECT send_friend_request(
                        @sender_id,
                        @receiver_id
                    );
                ";

                var result = await _db.ExecuteScalarAsync<string>(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("sender_id", senderId);
                        cmd.Parameters.AddWithValue("receiver_id", req.ReceiverId);
                    }
                );

                return Ok(new ApiResponse<string>(
                    true,
                    result,
                    null!
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(
                    false,
                    ex.Message,
                    null!
                ));
            }
        }
    

        [HttpPost("search")]
        public async Task<IActionResult> SearchUsersForFriend(
    [FromBody] SearchFriendRequestModel req
)
        {
            if (req.UserId == Guid.Empty || string.IsNullOrWhiteSpace(req.SearchText))
            {
                return BadRequest(new ApiResponse<string>(
                    false,
                    "Invalid request",
                    null!
                ));
            }

            try
            {
                const string sql = @"
            SELECT search_users_for_friend(
                @user_id_i,
                @search_text_i
            );
        ";

                var json = await _db.ExecuteScalarAsync<string>(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("user_id_i", req.UserId);
                        cmd.Parameters.AddWithValue("search_text_i", req.SearchText);
                    }
                );

                var result = JsonSerializer.Deserialize<JsonElement>(json);

                return Ok(new ApiResponse<JsonElement>(
                    true,
                    "Search result",
                    result.GetProperty("data")
                ));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(
                    false,
                    ex.Message,
                    null!
                ));
            }
        }

    }
}
