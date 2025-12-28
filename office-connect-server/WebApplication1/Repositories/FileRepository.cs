using Dapper;
using OfficeConnectServer.Models;
using System.IO;

namespace OfficeConnectServer.Data;

public class FileRepository
{
    private readonly DbConnectionFactory _dbFactory;

    public FileRepository(DbConnectionFactory dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<Guid> AddFileAsync(FileModel file)
    {
        const string sql = @"
            INSERT INTO utbl_files (
                uploaded_by,
                original_file_name,
                stored_file_name,
                file_extension,
                file_type,
                mime_type,
                file_size,
                file_path,
                thumbnail_path
            )
            VALUES (
                @UploadedBy,
                @OriginalFileName,
                @StoredFileName,
                @FileExtension,
                @FileType,
                @MimeType,
                @FileSize,
                @FilePath,
                @ThumbnailPath
            )
            RETURNING file_id;
        ";

        using var conn = _dbFactory.CreateConnection();
        return await conn.ExecuteScalarAsync<Guid>(sql, file);
    }
}
