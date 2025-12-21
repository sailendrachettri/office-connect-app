using Npgsql;
using OfficeConnectServer.Data;
using System.Reflection;
using OfficeConnectServer.Extensions;

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

    public async Task<List<T>> ExecuteQueryListAsync<T>(
    string query,
    Action<NpgsqlCommand>? parameters = null
) where T : new()
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new NpgsqlCommand(query, conn);

        parameters?.Invoke(cmd);

        await conn.OpenAsync();

        using var reader = await cmd.ExecuteReaderAsync();

        var list = new List<T>();
        var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

        while (await reader.ReadAsync())
        {
            var obj = new T();

            foreach (var prop in props)
            {
                var colName = prop.Name;

                if (!reader.HasColumn(colName))
                    continue;

                var val = reader[colName];
                if (val == DBNull.Value) continue;

                prop.SetValue(obj, val);
            }

            list.Add(obj);
        }

        return list;
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

    public async Task<T?> ExecuteQuerySingleAsync<T>(
        string query,
        Action<NpgsqlCommand>? parameters = null
    ) where T : new()
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new NpgsqlCommand(query, conn);

        parameters?.Invoke(cmd);

        await conn.OpenAsync();

        using var reader = await cmd.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
            return default;

        var obj = new T();
        var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

        foreach (var prop in props)
        {
            var colName = prop.Name;

            if (!reader.HasColumn(colName))
                continue;

            var val = reader[colName];
            if (val == DBNull.Value) continue;

            prop.SetValue(obj, val);
        }

        return obj;
    }
}
