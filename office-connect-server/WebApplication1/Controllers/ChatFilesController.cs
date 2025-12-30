using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeConnectServer.Data;
using OfficeConnectServer.Models;

[Authorize]
[ApiController]
[Route("api/chat-files")]
public class ChatFilesController : ControllerBase
{
    private readonly FileRepository _fileRepo;
    private readonly MessageRepository _messageRepo;
    private readonly IWebHostEnvironment _env;

    public ChatFilesController(
        FileRepository fileRepo,
        MessageRepository messageRepo,
        IWebHostEnvironment env)
    {
        _fileRepo = fileRepo;
        _messageRepo = messageRepo;
        _env = env;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(50_000_000)] // 50MB
    public async Task<IActionResult> UploadFile(
        IFormFile file,
        IFormFile? thumbnail,
        [FromForm] Guid receiverId,
        [FromForm] string? caption)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File missing");

        var senderId = (Guid)HttpContext.Items["UserId"]!;

        var ext = Path.GetExtension(file.FileName).ToLower();
        var fileType = GetFileType(ext);

        // ===============================
        // 1️⃣ Save ORIGINAL file
        // ===============================
        var storedName = $"{Guid.NewGuid()}{ext}";
        var originalFolder = Path.Combine("Uploads", fileType, "original");
        var originalPathRoot = Path.Combine(_env.ContentRootPath, originalFolder);

        Directory.CreateDirectory(originalPathRoot);

        var originalPath = Path.Combine(originalPathRoot, storedName);

        using (var stream = System.IO.File.Create(originalPath))
            await file.CopyToAsync(stream);

        // ===============================
        // 2️⃣ Save THUMBNAIL (if exists)
        // ===============================
        string? thumbnailPath = null;

        if (thumbnail != null)
        {
            var thumbFolder = Path.Combine("Uploads", fileType, "thumb");
            var thumbRoot = Path.Combine(_env.ContentRootPath, thumbFolder);

            Directory.CreateDirectory(thumbRoot);

            var thumbName = $"{Guid.NewGuid()}.jpg";
            var thumbFullPath = Path.Combine(thumbRoot, thumbName);

            using (var stream = System.IO.File.Create(thumbFullPath))
                await thumbnail.CopyToAsync(stream);

            thumbnailPath = $"/{thumbFolder}/{thumbName}";
        }

        // ===============================
        // 3️⃣ Save FILE record
        // ===============================
        var fileModel = new FileModel
        {
            UploadedBy = senderId,
            OriginalFileName = file.FileName,
            StoredFileName = storedName,
            FileExtension = ext,
            FileType = fileType,
            MimeType = file.ContentType,
            FileSize = file.Length,
            FilePath = $"/{originalFolder}/{storedName}",
            ThumbnailPath = thumbnailPath
        };

        var fileId = await _fileRepo.AddFileAsync(fileModel);

        // ===============================
        // 4️⃣ Save MESSAGE
        // ===============================
        var messageText = string.IsNullOrWhiteSpace(caption)
            ? file.FileName
            : caption;

        var messageId = await _messageRepo.AddMessageAsync(
            senderId,
            receiverId,
            messageText,
            fileId
        );

        return Ok(new ChatMessageDto
        {
            MessageId = messageId,
            SenderId = senderId,
            ReceiverId = receiverId,
            MessageText = messageText,
            CreatedAt = DateTime.UtcNow,

            MessageType = fileId != null ? "media" : "text",

            FileId = fileId,
            FileType = fileType,
            FilePath = fileModel?.FilePath,
            ThumbnailPath = fileModel?.ThumbnailPath,
            MimeType = fileModel?.MimeType,
            FileSize = fileModel?.FileSize,
            OriginalFileName = fileModel?.OriginalFileName,
            StoredFileName = fileModel?.StoredFileName,
            FileExtension = fileModel?.FileExtension
        });



    }

    private static string GetFileType(string ext) =>
        ext switch
        {
            ".jpg" or ".jpeg" or ".png" or ".webp" => "image",
            ".mp4" or ".mov" => "video",
            ".mp3" or ".wav" => "audio",
            ".pdf" or ".doc" or ".docx" => "document",
            _ => "document"
        };
}
