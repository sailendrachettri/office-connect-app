using Microsoft.AspNetCore.Mvc;
using OfficeConnectServer.Data;
using OfficeConnectServer.Models;

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

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] MessageSendRequest request)
    {
        var id = await _repo.AddMessageAsync(request.SenderId, request.ReceiverId, request.MessageText);
        return Ok(new { message_id = id });
    }
}


