namespace OfficeConnectServer.Models
{

    public class RejectFriendRequest
    {
        public Guid ReqId { get; set; }
        public Guid ReceiverId { get; set; }
    }
    public class CancelFriendRequestModel
    {
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
    }

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
