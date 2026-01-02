using Microsoft.AspNetCore.SignalR;
using OfficeConnectServer.Data;
using OfficeConnectServer.Models;
using System.Text.RegularExpressions;

public class ChatHub : Hub
{
    private readonly MessageRepository _repo;

    public ChatHub(MessageRepository repo)
    {
        _repo = repo;
    }

    public async Task DeleteMessage(long messageId, Guid receiverId)
    {
        var deletedBy = Guid.Parse(
            Context.GetHttpContext()!.Request.Query["userId"]!
        );

        // Delete from DB
        var result = await _repo.DeleteMessageAsync(messageId);

        if (!result.Success)
            return;

        // Notify BOTH users
        await Clients.Groups(
            deletedBy.ToString(),
            receiverId.ToString()
        ).SendAsync("MessageDeleted", new
        {
            messageId = messageId,
            deletedBy = deletedBy
        });
    }


    public async Task UserTyping(Guid receiverId)
    {
        var senderId = Guid.Parse(
            Context.GetHttpContext()!.Request.Query["userId"]!
        );

        await Clients.Group(receiverId.ToString())
            .SendAsync("UserTyping", senderId);
    }

    public async Task UserStoppedTyping(Guid receiverId)
    {
        var senderId = Guid.Parse(
            Context.GetHttpContext()!.Request.Query["userId"]!
        );

        await Clients.Group(receiverId.ToString())
            .SendAsync("UserStoppedTyping", senderId);
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

    public async Task BroadcastUploadedMessage(ChatMessageDto message)
    {
        var senderId = Guid.Parse(
            Context.GetHttpContext()!.Request.Query["userId"]!
        );

        // Receiver
        await Clients.Group(message.ReceiverId.ToString())
            .SendAsync("ReceiveMessage", message);

        // Sender (echo)
        await Clients.Group(senderId.ToString())
            .SendAsync("ReceiveMessage", message);
    }



    public async Task SendMessage(Guid sender_id_i, Guid receiver_id_i, string message_text_i, Guid? file_id_i)
    {
        try
        {
            // Save to DB
            var messageId = await _repo.AddMessageAsync(sender_id_i, receiver_id_i, message_text_i, file_id_i);

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
             created_at = DateTime.UtcNow,
             file_id = file_id_i
         });

        }
        catch (Exception ex)
        {
            Console.WriteLine("SendMessage error: " + ex.Message);
            throw;
        }
    }
}
