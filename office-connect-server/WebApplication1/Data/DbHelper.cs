using Npgsql;
using OfficeConnectServer.Data;
using System.Data;

namespace OfficeConnectServer.Data
{
    public class DbHelper
    {
        private readonly DbConnectionFactory _factory;

        public DbHelper(DbConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<T> ExecuteScalarAsync<T>(
            string query,
            Action<NpgsqlCommand> parameters
        )
        {
            using var conn = _factory.CreateConnection();
            using var cmd = new NpgsqlCommand(query, conn);

            parameters(cmd);

            await conn.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();

            return (T)result;
        }
    }
}
