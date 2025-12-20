namespace OfficeConnectServer.Helpers
{
    public static class FileNameHelper
    {
        public static string GenerateSafeFileName(
            string originalFileName,
            string extension)
        {
            var nameWithoutExt = Path.GetFileNameWithoutExtension(originalFileName);

            // remove spaces & unsafe chars
            nameWithoutExt = nameWithoutExt
                .Replace(" ", "_")
                .Replace(".", "_");

            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss_fff");
            var random = Guid.NewGuid().ToString("N")[..6];

            return $"{nameWithoutExt}_{timestamp}_{random}{extension}";
        }
    }
}
