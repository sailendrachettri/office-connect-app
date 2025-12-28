namespace OfficeConnectServer.Models
{

    public class MessageModelDto
    {
        public long MessageId { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public string MessageText { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }

        // ✅ New (safe additions)
        public string MessageType { get; set; }   // text | image | video | audio | document

        // File-related (nullable for text messages)
        public Guid? FileId { get; set; }
        public string ThumbnailPath { get; set; }
        public string FilePath { get; set; }
        public string OriginalFileName { get; set; }
        public string StoredFileName { get; set; }
        public string FileExtension { get; set; }
        public string FileType { get; set; }
        public string MimeType { get; set; }
        public long? FileSize { get; set; }
    }


    // Result model for paginated queries
    public class MessagePageResult
    {
        public List<MessageModelDto> Messages { get; set; }
        public bool HasMore { get; set; }
        public long? OldestMessageId { get; set; }
    }
    public class MessageSendRequest
    {
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public string MessageText { get; set; }
        public Guid? FileId { get; set; }
    }
}
