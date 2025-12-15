using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    // userId -> connection mapping
    public override async Task OnConnectedAsync()
    {
        var var_userId = Context.GetHttpContext()?.Request.Query["userId"].ToString();

        if (!string.IsNullOrEmpty(var_userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, var_userId);
        }

        await base.OnConnectedAsync();
    }

    public async Task SendMessage(
        Guid sender_id_i,
        Guid receiver_id_i,
        string message_text_i)
    {
        // Send to receiver
        await Clients.Group(receiver_id_i.ToString())
            .SendAsync("ReceiveMessage", new
            {
                sender_id = sender_id_i,
                receiver_id = receiver_id_i,
                message_text = message_text_i,
                created_at = DateTime.UtcNow
            });
    }
}
