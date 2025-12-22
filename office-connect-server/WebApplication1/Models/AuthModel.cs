namespace OfficeConnectServer.Models
{

    public class LogoutRequest
    {
        public string RefreshToken {get; set; }
    }
    public class AuthUserModel
    {
        public Guid User_Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Full_Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Profile_Image { get; set; }
        public long RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
