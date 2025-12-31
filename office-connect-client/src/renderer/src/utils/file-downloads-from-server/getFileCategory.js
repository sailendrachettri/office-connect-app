export const getFileCategory = (msg) => {
 

  if (!msg) return 'other'
  if (msg.fileType === 'image') return 'image'
  if (msg.fileType === 'video') return 'video'
  if (msg.fileType === 'audio') return 'audio'

  const ext = msg.fileExtension?.toLowerCase()

  if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) return 'document'
  if (['.xls', '.xlsx', '.csv'].includes(ext)) return 'sheet'
  if (['.zip', '.rar', '.7z'].includes(ext)) return 'archive'
  if (['.exe', '.msi'].includes(ext)) return 'executable'
  if (['.js', '.ts', '.html', '.css', '.json'].includes(ext)) return 'code'

  return 'other'
}

export const formatSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}