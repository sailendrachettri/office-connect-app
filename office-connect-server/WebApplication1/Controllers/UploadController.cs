using Microsoft.AspNetCore.Mvc;
using OfficeConnectServer.Helpers;
using ImageMagick;

[ApiController]
[Route("api/v1/upload")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost]
    [RequestSizeLimit(50_000_000)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is empty");

        var root = Path.Combine(_env.ContentRootPath, "Uploads");
        Directory.CreateDirectory(root);

        if (file.ContentType.StartsWith("image/"))
            return await SaveImageAsAvif(file, root);

        return await SaveOriginalFile(file, root);
    }

    // ---------------- IMAGE → AVIF ----------------
    private async Task<IActionResult> SaveImageAsAvif(IFormFile file, string root)
    {
        var imageDir = Path.Combine(root, "images");
        Directory.CreateDirectory(imageDir);

        var fileName = FileNameHelper.GenerateSafeFileName(
            file.FileName,
            ".webp"
        );

        var filePath = Path.Combine(imageDir, fileName);

        await using var stream = file.OpenReadStream();
        using var image = new MagickImage(stream);

        image.Resize(1920, 1080);
        image.Quality = 45;
        image.Format = MagickFormat.WebP;

        await image.WriteAsync(filePath, MagickFormat.WebP);


        var url = $"/uploads/images/{fileName}";

        return Ok(new
        {
            success = true,
            type = "image",
            url
        });
    }

    // ---------------- OTHER FILES ----------------
    private async Task<IActionResult> SaveOriginalFile(IFormFile file, string root)
    {
        var filesDir = Path.Combine(root, "files");
        Directory.CreateDirectory(filesDir);

        var ext = Path.GetExtension(file.FileName);

        var fileName = FileNameHelper.GenerateSafeFileName(
            file.FileName,
            ext
        );

        var filePath = Path.Combine(filesDir, fileName);

        await using var fs = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(fs);

        var url = $"/uploads/files/{fileName}";

        return Ok(new
        {
            success = true,
            type = "file",
            url
        });
    }
}
