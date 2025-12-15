using System.Security.Cryptography;

namespace OfficeConnectServer.Helpers
{
    public static class RefreshTokenHelper
    {
        public static string Generate()
        {
            return Convert.ToBase64String(
                RandomNumberGenerator.GetBytes(64)
            );
        }
    }
}
