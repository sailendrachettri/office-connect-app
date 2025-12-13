namespace OfficeConnectServer.Models
{
    public class UserCreateRequest
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? ProfileImage { get; set; }
    }
}
