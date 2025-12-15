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
        [HttpPost("reject")]
        public async Task<IActionResult> RejectFriendRequest(
    [FromBody] RejectFriendRequest req
)
        {
            if (req.ReqId == Guid.Empty)
            {
                return BadRequest(new ApiResponse<string>(
                    false,
                    "Invalid request data",
                    null!
                ));
            }

            // ✅ Get receiverId from JWT
            var receiverId = (Guid)HttpContext.Items["UserId"];

            try
            {
                const string sql = @"
            SELECT reject_friend_request(
                @req_id_i,
                @receiver_id_i
            );
        ";

                var result = await _db.ExecuteScalarAsync<string>(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("req_id_i", req.ReqId);
                        cmd.Parameters.AddWithValue("receiver_id_i", receiverId);
                    }
                );

                if (result.Contains("not found"))
                {
                    return BadRequest(new ApiResponse<string>(
                        false,
                        result,
                        null!
                    ));
                }

                return Ok(new ApiResponse<string>(
                    true,
                    result,
                    null!
                ));
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


        [Authorize]
        [HttpPost("cancel-request")]
        public async Task<IActionResult> CancelFriendRequest(
    [FromBody] CancelFriendRequestModel req
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
            SELECT cancel_friend_request(
                @sender_id_i,
                @receiver_id_i
            );
        ";

                var result = await _db.ExecuteScalarAsync<string>(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("sender_id_i", senderId);
                        cmd.Parameters.AddWithValue("receiver_id_i", req.ReceiverId);
                    }
                );

                bool success = result == "Friend request cancelled";

                return Ok(new ApiResponse<string>(
                    success,
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


        [Authorize]
        [HttpGet("list")]
        public async Task<IActionResult> GetFriendsAndRequests()
        {
            var senderObj = HttpContext.Items["UserId"];
            if (senderObj == null)
            {
                return Unauthorized(new ApiResponse<string>(
                    false,
                    "Unauthorized",
                    null!
                ));
            }

            var userId = (Guid)senderObj;

            try
            {
                const string sql = @"
                    SELECT get_user_friends_and_requests_list(
                        @user_id_i
                    );
                ";

                var json = await _db.ExecuteScalarAsync<string>(
                    sql,
                    cmd =>
                    {
                        cmd.Parameters.AddWithValue("user_id_i", userId);
                    }
                );

                var result = JsonSerializer.Deserialize<JsonElement>(json);

                bool success = result.GetProperty("success").GetBoolean();
                string message = result.GetProperty("message").GetString()!;

                if (!success)
                {
                    return BadRequest(new ApiResponse<string>(
                        false,
                        message,
                        null!
                    ));
                }

                var data = result.GetProperty("data");

                return Ok(new ApiResponse<JsonElement>(
                    true,
                    message,
                    data
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
