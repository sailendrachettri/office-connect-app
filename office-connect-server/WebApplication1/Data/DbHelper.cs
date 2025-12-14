using Npgsql;
using OfficeConnectServer.Data;

public class DbHelper
{
    private readonly DbConnectionFactory _factory;

    public DbHelper(DbConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task<T> ExecuteScalarAsync<T>(
        string query,
        Action<NpgsqlCommand>? parameters = null
    )
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new NpgsqlCommand(query, conn);

        parameters?.Invoke(cmd);

        await conn.OpenAsync();
        var result = await cmd.ExecuteScalarAsync();

        if (result == null || result == DBNull.Value)
            return default!;

        return (T)result;
    }

    public async Task<int> ExecuteNonQueryAsync(
        string query,
        Action<NpgsqlCommand>? parameters = null
    )
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new NpgsqlCommand(query, conn);

        parameters?.Invoke(cmd);

        await conn.OpenAsync();
        return await cmd.ExecuteNonQueryAsync();
    }
}
