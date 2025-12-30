namespace OfficeConnectServer.Models;

public class FileModel
{
    public Guid UploadedBy { get; set; }
    public string OriginalFileName { get; set; } = null!;
    public string StoredFileName { get; set; } = null!;
    public string FileExtension { get; set; } = null!;
    public string FileType { get; set; } = null!;
    public string MimeType { get; set; } = null!;
    public long FileSize { get; set; }
    public string FilePath { get; set; } = null!;
    public string? ThumbnailPath { get; set; }
}

public class ChatMessageDto
{
    public long MessageId { get; set; }
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public string MessageText { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }

    public string MessageType { get; set; }

    // 🔽 Flat media fields
    public Guid? FileId { get; set; }
    public string? FilePath { get; set; }
    public string? ThumbnailPath { get; set; }
    public string? FileType { get; set; }
    public string? MimeType { get; set; }
    public long? FileSize { get; set; }
    public string? OriginalFileName { get; set; }
    public string? StoredFileName { get; set; }
    public string? FileExtension { get; set; }
}

