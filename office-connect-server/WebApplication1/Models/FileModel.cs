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
