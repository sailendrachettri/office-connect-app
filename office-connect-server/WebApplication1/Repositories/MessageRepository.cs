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
                    ORDER BY created_at ASC
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
}
