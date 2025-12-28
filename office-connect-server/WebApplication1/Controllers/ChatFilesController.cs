using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeConnectServer.Data;
using OfficeConnectServer.Models;
using System.IO;

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
    [FromForm] Guid receiverId,
    [FromForm] string? caption)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File missing");

        var senderId = (Guid)HttpContext.Items["UserId"]!;

        var ext = Path.GetExtension(file.FileName).ToLower();
        var fileType = GetFileType(ext);

        var storedName = $"{Guid.NewGuid()}{ext}";
        var folder = Path.Combine("Uploads", fileType, "original");
        var fullPath = Path.Combine(_env.ContentRootPath, folder);

        Directory.CreateDirectory(fullPath);

        var filePath = Path.Combine(fullPath, storedName);

        using (var stream = System.IO.File.Create(filePath))
            await file.CopyToAsync(stream);

        var fileModel = new FileModel
        {
            UploadedBy = senderId,
            OriginalFileName = file.FileName,
            StoredFileName = storedName,
            FileExtension = ext,
            FileType = fileType,
            MimeType = file.ContentType,
            FileSize = file.Length,
            FilePath = $"/{folder}/{storedName}"
        };

        var fileId = await _fileRepo.AddFileAsync(fileModel);

        // ✅ message_text = caption OR fallback text
        var messageText = string.IsNullOrWhiteSpace(caption)
            ? file.FileName
            : caption;

        var messageId = await _messageRepo.AddMessageAsync(
            senderId,
            receiverId,
            messageText,
            fileId
        );

        return Ok(new
        {
            messageId,
            fileId
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
