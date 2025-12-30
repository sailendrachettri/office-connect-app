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

    public async Task<FileModel?> GetByIdAsync(Guid fileId)
    {
        const string sql = @"
        SELECT
            file_id            AS FileId,
            uploaded_by        AS UploadedBy,
            original_file_name AS OriginalFileName,
            stored_file_name   AS StoredFileName,
            file_extension     AS FileExtension,
            file_type          AS FileType,
            mime_type          AS MimeType,
            file_size          AS FileSize,
            file_path          AS FilePath,
            thumbnail_path     AS ThumbnailPath,
            created_at         AS CreatedAt
        FROM utbl_files
        WHERE file_id = @FileId
        LIMIT 1;
    ";

        using var conn = _dbFactory.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<FileModel>(
            sql,
            new { FileId = fileId }
        );
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
