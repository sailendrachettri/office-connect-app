namespace OfficeConnectServer.Models.Admins
{
    public class AddAvatarRequest
    {
        public string AvatarUrl { get; set; } = string.Empty;
    }

    public class AvatarDto
    {
        public long AvatarId { get; set; }
        public string AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AdminCmsModel
    {
    }
}
