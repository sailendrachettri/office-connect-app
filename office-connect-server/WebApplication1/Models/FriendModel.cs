namespace OfficeConnectServer.Models
{

    public class SendFriendRequestModel
    {
        public Guid ReceiverId { get; set; }
    }

    public class SearchFriendRequestModel
    {
        public Guid UserId { get; set; }
        public string SearchText { get; set; } = string.Empty;
    }
}
