namespace OfficeConnectServer.Models
{

    public class MessageModelDto
    {
        public long MessageId { get; set; }        // maps to message_id
        public Guid SenderId { get; set; }         // maps to sender_id
        public Guid ReceiverId { get; set; }       // maps to receiver_id
        public string MessageText { get; set; }    // maps to message_text
        public bool IsRead { get; set; }           // maps to is_read
        public DateTime CreatedAt { get; set; }    // maps to created_at
    }
    public class MessageSendRequest
    {
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public string MessageText { get; set; }
    }
}
