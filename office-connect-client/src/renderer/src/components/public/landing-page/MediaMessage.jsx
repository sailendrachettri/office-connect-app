import { viewUploadedFile } from '../../../utils/file-upload-to-server/uploadFile'
import {
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiArchive,
  FiTerminal,
  FiCpu,
  FiFile,
  FiDownload
} from 'react-icons/fi'

const FILE_ICONS = {
  image: FiImage,
  video: FiVideo,
  audio: FiMusic,
  document: FiFileText,
  sheet: FiFileText,
  archive: FiArchive,
  executable: FiCpu,
  code: FiTerminal,
  other: FiFile
}


const getFileCategory = (msg) => {
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



const formatSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const MediaMessage = ({ msg }) => {
  const fileUrl = viewUploadedFile(msg.filePath)
  const thumbUrl = msg.thumbnailPath
    ? viewUploadedFile(msg.thumbnailPath)
    : null

  const category = getFileCategory(msg)
  const Icon = FILE_ICONS[category]

  const downloadFile = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = msg.originalFileName
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /* ---------------- IMAGE ---------------- */
  if (category === 'image') {
    return (
      <div className="space-y-1">
        <img
          src={thumbUrl}
          alt={msg.originalFileName}
          loading="lazy"
          className="rounded-lg max-w-55 cursor-pointer"
          onClick={() => window.open(fileUrl, '_blank')}
        />
        {msg.messageText && (
          <div className="text-sm text-white whitespace-pre-wrap">
            {msg.messageText}
          </div>
        )}
      </div>
    )
  }

  /* ---------------- VIDEO ---------------- */
  if (category === 'video') {
    return (
      <div className="space-y-1 max-w-65">
        <video
          controls
          preload="metadata"
          poster={thumbUrl ?? undefined}
          className="rounded-lg w-full"
        >
          <source src={fileUrl} type={msg.mimeType} />
        </video>
        {msg.messageText && (
          <div className="text-sm text-slate-700 whitespace-pre-wrap">
            {msg.messageText}
          </div>
        )}
      </div>
    )
  }

  /* ---------------- AUDIO ---------------- */
  if (category === 'audio') {
    return (
      <div className="space-y-1 max-w-[260px]">
        <audio controls preload="none" className="w-full">
          <source src={fileUrl} type={msg.mimeType} />
        </audio>
        {msg.messageText && (
          <div className="text-sm text-slate-700 whitespace-pre-wrap">
            {msg.messageText}
          </div>
        )}
      </div>
    )
  }

  /* ---------------- DOCUMENT / OTHER ---------------- */
  return (
    <>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 max-w-72">
        <Icon className="text-slate-500 shrink-0" size={22} />

        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-medium truncate text-slate-700">
            {msg.originalFileName}
          </div>
          <div className="text-xs text-slate-500">
            {formatSize(msg.fileSize)}
          </div>
        </div>

        <button
          onClick={downloadFile}
          className="p-2 rounded-full bg-slate-500 hover:bg-slate-600 text-white"
          title="Download"
        >
          <FiDownload />
        </button>
      </div>

      {msg.messageText && (
        <div className="text-sm text-white mt-1 whitespace-pre-wrap">
          {msg.messageText}
        </div>
      )}
    </>
  )
}

export default MediaMessage
