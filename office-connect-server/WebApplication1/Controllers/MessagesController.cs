using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql.Replication.PgOutput.Messages;
using OfficeConnectServer.Data;
using OfficeConnectServer.Models;
using OfficeConnectServer.Responses;

[ApiController]
[Route("api/messages")]
public class MessagesController : ControllerBase
{
    private readonly MessageRepository _repo;

    public MessagesController(MessageRepository repo)
    {
        _repo = repo;
    }

    [HttpGet("{user1}/{user2}")]
    public async Task<IActionResult> GetChat(Guid user1, Guid user2)
    {
        var messages = await _repo.GetChatAsync(user1, user2);
        return Ok(messages);
    }

    [Authorize]
    [HttpPost("delete-message")]
    public async Task<IActionResult> DeleteMessage([FromBody] DeleteMessageRequest req)
    {
        if (req == null || req.MessageId <= 0)
        {
            return BadRequest(new ApiResponse<bool>(
                false,
                "Invalid message id",
                false
            ));
        }

        var response = await _repo.DeleteMessageAsync(req.MessageId);

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }



    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] MessageSendRequest request)
    {
        var id = await _repo.AddMessageAsync(request.SenderId, request.ReceiverId, request.MessageText, request.FileId);
        return Ok(new { message_id = id });
    }
}


