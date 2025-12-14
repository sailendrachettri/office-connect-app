namespace OfficeConnectServer.Models
{
    // DTOs

    


    public class LoginResponseDto
    {
        public Guid UserId { get; set; }
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class UserDetailsDto
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string MobileNo { get; set; }
        public string Email { get; set; }
        public string ProfileImage { get; set; }
        public string Status { get; set; }
        public DateTime? LastSeen { get; set; }
        public short UserRole { get; set; }
        public DateTime CreatedAt { get; set; }
    }


    // Requests

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
    public class GetUserDetailsRequest
    {
        public Guid UserId { get; set; }
    }

    public class UserCreateModel
    {
        public string FullName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? ProfileImage { get; set; }
    }

    public class UserLoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
