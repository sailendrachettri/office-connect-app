import { FiDownload, FiFileText, FiVideo, FiMusic, FiImage } from 'react-icons/fi'
import { viewUploadedFile } from '../../../utils/file-upload-to-server/uploadFile'

const formatSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const MediaMessage = ({ msg }) => {
  const fileUrl = viewUploadedFile(msg.filePath)
  const downloadFile = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = msg.originalFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  console.log({ msg })

  // IMAGE
  if (msg.fileType === 'image') {
    return (
      <div className="space-y-1">
        <img
          src={viewUploadedFile(msg?.thumbnailPath)}
          alt={msg.originalFileName}
          className="rounded-lg max-w-55 cursor-pointer"
          onClick={() => window.open(fileUrl)}
        />
        {msg.messageText && (
          <div className="text-sm text-white whitespace-pre-wrap">{msg.messageText}</div>
        )}
      </div>
    )
  }

  // VIDEO
  if (msg.fileType === 'video') {
    return (
      <div className="space-y-1 max-w-65">
        <video controls className="rounded-lg w-full">
          <source src={fileUrl} type={msg.mimeType} />
        </video>
        {msg.messageText && (
          <div className="text-sm text-slate-700 whitespace-pre-wrap">{msg.messageText}</div>
        )}
      </div>
    )
  }

  // AUDIO
  if (msg.fileType === 'audio') {
    return (
      <div className="space-y-1 max-w-[260px]">
        <audio controls className="w-full">
          <source src={fileUrl} type={msg.mimeType} />
        </audio>
        {msg.messageText && (
          <div className="text-sm text-slate-700 whitespace-pre-wrap">{msg.messageText}</div>
        )}
      </div>
    )
  }

  // DOCUMENT (PDF, DOC, SQL, etc.)
  return (
    <>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 max-w-70">
        <FiFileText className="text-slate-500" size={24} />

        <div className="flex-1 overflow-hidden text-slate-700">
          <div className="text-sm font-medium truncate">{msg.originalFileName}</div>
          <div className="text-xs text-slate-500">{formatSize(msg.fileSize)}</div>
        </div>

        <button
          onClick={downloadFile}
          className="p-2 rounded-full bg-slate-500 hover:bg-slate-600 cursor-pointer"
          title="Download"
        >
          <FiDownload />
        </button>
      </div>
      {msg.messageText && (
        <div className="text-sm text-white mt-1 whitespace-pre-wrap">{msg.messageText}</div>
      )}
    </>
  )
}

export default MediaMessage
