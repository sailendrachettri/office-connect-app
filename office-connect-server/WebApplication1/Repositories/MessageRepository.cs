using Dapper;
using Npgsql;
using OfficeConnectServer.Models;

namespace OfficeConnectServer.Data
{
    public class MessageRepository
    {
        private readonly DbConnectionFactory _dbFactory;

        public MessageRepository(DbConnectionFactory dbFactory)
        {
            _dbFactory = dbFactory;
        }

        public async Task MarkMessagesReadAsync(
    List<long> messageIds,
    Guid userId
)
        {
            const string sql = @"
        UPDATE utbl_messages
        SET is_read = true
        WHERE message_id = ANY(@message_ids)
          AND receiver_id = @user_id
          AND is_read = false;
    ";

            using var conn = _dbFactory.CreateConnection();
            await conn.OpenAsync();

            await conn.ExecuteAsync(sql, new
            {
                message_ids = messageIds,
                user_id = userId
            });
        }




        // NEW: Paginated method for loading messages in chunks
        public async Task<MessagePageResult> GetChatPaginatedAsync(
            Guid user1_id,
            Guid user2_id,
            long? beforeMessageId = null,
            int pageSize = 50)
        {
            using var conn = _dbFactory.CreateConnection();
            await conn.OpenAsync();

            string sql;
            object parameters;

            if (beforeMessageId.HasValue)
            {
                // Load older messages (when scrolling up)
                sql = @"
                    SELECT
                        message_id  AS ""MessageId"",
                        sender_id   AS ""SenderId"",
                        receiver_id AS ""ReceiverId"",
                        message_text AS ""MessageText"",
                        is_read     AS ""IsRead"",
                        created_at  AS ""CreatedAt""
                    FROM utbl_messages
                    WHERE (
                        (sender_id=@user1 AND receiver_id=@user2)
                        OR (sender_id=@user2 AND receiver_id=@user1)
                    )
                    AND message_id < @beforeMessageId
                    ORDER BY message_id DESC
                    LIMIT @pageSize
                ";

                parameters = new
                {
                    user1 = user1_id,
                    user2 = user2_id,
                    beforeMessageId = beforeMessageId.Value,
                    pageSize = pageSize
                };
            }
            else
            {
                // Initial load - get most recent messages
                sql = @"
                    SELECT
                        message_id  AS ""MessageId"",
                        sender_id   AS ""SenderId"",
                        receiver_id AS ""ReceiverId"",
                        message_text AS ""MessageText"",
                        is_read     AS ""IsRead"",
                        created_at  AS ""CreatedAt""
                    FROM utbl_messages
                    WHERE (sender_id=@user1 AND receiver_id=@user2)
                       OR (sender_id=@user2 AND receiver_id=@user1)
                    ORDER BY message_id DESC
                    LIMIT @pageSize
                ";

                parameters = new
                {
                    user1 = user1_id,
                    user2 = user2_id,
                    pageSize = pageSize
                };
            }

            var messages = (await conn.QueryAsync<MessageModelDto>(sql, parameters)).ToList();

            // Check if there are more older messages
            bool hasMore = false;
            if (messages.Count == pageSize)
            {
                var oldestMessageId = messages[messages.Count - 1].MessageId;
                var countSql = @"
                    SELECT COUNT(*)
                    FROM utbl_messages
                    WHERE (
                        (sender_id=@user1 AND receiver_id=@user2)
                        OR (sender_id=@user2 AND receiver_id=@user1)
                    )
                    AND message_id < @oldestMessageId
                ";

                var olderCount = await conn.ExecuteScalarAsync<int>(countSql, new
                {
                    user1 = user1_id,
                    user2 = user2_id,
                    oldestMessageId = oldestMessageId
                });

                hasMore = olderCount > 0;
            }

            // Reverse to chronological order (oldest to newest)
            messages.Reverse();

            return new MessagePageResult
            {
                Messages = messages,
                HasMore = hasMore,
                OldestMessageId = messages.Count > 0 ? messages[0].MessageId : null
            };
        }

        // Keep original method for backward compatibility
        public async Task<IEnumerable<MessageModelDto>> GetChatAsync(Guid user1_id_i, Guid user2_id_i)
        {
            using var conn = _dbFactory.CreateConnection();
            await conn.OpenAsync();

            string sql = @"
                    SELECT
                        message_id  AS ""MessageId"",
                        sender_id   AS ""SenderId"",
                        receiver_id AS ""ReceiverId"",
                        message_text AS ""MessageText"",
                        is_read     AS ""IsRead"",
                        created_at  AS ""CreatedAt""
                    FROM utbl_messages
                    WHERE (sender_id=@user1 AND receiver_id=@user2)
                       OR (sender_id=@user2 AND receiver_id=@user1)
                    ORDER BY message_id DESC
                ";

            return await conn.QueryAsync<MessageModelDto>(sql, new
            {
                user1 = user1_id_i,
                user2 = user2_id_i
            });
        }

        public async Task<long> AddMessageAsync(Guid sender_id_i, Guid receiver_id_i, string message_text_i)
        {
            using var conn = _dbFactory.CreateConnection();
            await conn.OpenAsync();

            string sql = @"
                INSERT INTO utbl_messages(sender_id, receiver_id, message_text)
                VALUES(@sender, @receiver, @text)
                RETURNING message_id
            ";

            return await conn.ExecuteScalarAsync<long>(sql, new
            {
                sender = sender_id_i,
                receiver = receiver_id_i,
                text = message_text_i
            });
        }
    }

    // Result model for paginated queries
    public class MessagePageResult
    {
        public List<MessageModelDto> Messages { get; set; }
        public bool HasMore { get; set; }
        public long? OldestMessageId { get; set; }
    }
}