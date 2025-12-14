namespace OfficeConnectServer.Models
{
    public class SearchFriendRequestModel
    {
        public Guid UserId { get; set; }
        public string SearchText { get; set; } = string.Empty;
    }
}
