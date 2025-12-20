using Microsoft.AspNetCore.SignalR;
using OfficeConnectServer.Data;
using System.Text.RegularExpressions;

public class ChatHub : Hub
{
    private readonly MessageRepository _repo;

    public ChatHub(MessageRepository repo)
    {
        _repo = repo;
    }

    public async Task MarkMessagesAsRead(
    List<long> messageIds,
    Guid senderId
)
    {
        var userId = Guid.Parse(
            Context.GetHttpContext()!.Request.Query["userId"]!
        );

        await _repo.MarkMessagesReadAsync(messageIds, userId);

        await Clients.Group(senderId.ToString())
            .SendAsync("MessagesRead", messageIds);
    }


    public override async Task OnConnectedAsync()
    {
        var var_userId = Context.GetHttpContext()?.Request.Query["userId"].ToString();

        if (!string.IsNullOrEmpty(var_userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, var_userId);
        }

        await base.OnConnectedAsync();
    }

    public async Task SendMessage(Guid sender_id_i, Guid receiver_id_i, string message_text_i)
    {
        try
        {
            // Save to DB
            var messageId = await _repo.AddMessageAsync(sender_id_i, receiver_id_i, message_text_i);

            // Send to receiver
            await Clients.Groups(
     sender_id_i.ToString(),
     receiver_id_i.ToString()
 ).SendAsync("ReceiveMessage", new
 {
     message_id = messageId,
     sender_id = sender_id_i,
     receiver_id = receiver_id_i,
     message_text = message_text_i,
     created_at = DateTime.UtcNow
 });

        }
        catch (Exception ex)
        {
            Console.WriteLine("SendMessage error: " + ex.Message);
            throw;
        }
    }
}
