import React from 'react'
import { viewUploadedFile } from '../../../utils/file-upload-to-server/uploadFile'
import { downloadChatFile } from '../../../utils/file-downloads-from-server/downloadChatFile'
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

const formatSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const MediaMessage = ({ msg }) => {
  if (!msg) return null

  const previewUrl =
    msg.fileType === 'image' || msg.fileType === 'video' || msg.fileType === 'audio'
      ? viewUploadedFile(msg.filePath)
      : null

  const downloadUrl = downloadChatFile(msg.fileId)
  const thumbUrl = msg.thumbnailPath ? viewUploadedFile(msg.thumbnailPath) : null
  const category = getFileCategory(msg)
  const Icon = FILE_ICONS[category] || FiFile

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = msg.originalFileName || 'file'
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // IMAGE
  if (category === 'image') {
    return (
      <div className="space-y-1" onClick={handleDownload}>
        <img
          src={thumbUrl || previewUrl}
          alt={msg.originalFileName}
          loading="lazy"
          className="rounded-lg max-w-55 cursor-pointer"
          // onClick={() => window.open(previewUrl)} // preview in new tab
        />
        {msg.messageText && (
          <div className="text-sm text-white whitespace-pre-wrap">
            {msg.messageText}
          </div>
        )}
       
      </div>
    )
  }

  // VIDEO
  if (category === 'video') {
    return (
      <div className="space-y-1 max-w-65">
        <video
          controls
          preload="metadata"
          poster={thumbUrl ?? undefined}
          className="rounded-lg w-full"
        >
          <source src={previewUrl} type={msg.mimeType} />
        </video>
        {msg.messageText && (
          <div className="text-sm text-slate-700 whitespace-pre-wrap">
            {msg.messageText}
          </div>
        )}
        <button
          onClick={handleDownload}
          className="mt-1 px-3 py-1 rounded bg-slate-500 hover:bg-slate-600 text-white text-sm"
        >
          Download
        </button>
      </div>
    )
  }

  // AUDIO
  if (category === 'audio') {
    return (
      <div className="space-y-1 max-w-[260px]">
        <audio controls preload="none" className="w-full">
          <source src={previewUrl} type={msg.mimeType} />
        </audio>
        {msg.messageText && (
          <div className="text-sm text-slate-700 whitespace-pre-wrap">
            {msg.messageText}
          </div>
        )}
        <button
          onClick={handleDownload}
          className="mt-1 px-3 py-1 rounded bg-slate-500 hover:bg-slate-600 text-white text-sm"
        >
          Download
        </button>
      </div>
    )
  }

  // DOCUMENT / OTHER FILES
  return (
    <>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 max-w-72">
        <Icon className="text-slate-500 shrink-0" size={22} />

        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-medium truncate text-wrap text-slate-700">
            {msg.originalFileName}
          </div>
          <div className="text-xs text-white">{formatSize(msg.fileSize)}</div>
        </div>

        <button
          onClick={handleDownload}
          className="p-2 rounded-full bg-slate-500 hover:bg-slate-600 text-white"
          title="Download"
        >
          <FiDownload />
        </button>
      </div>

      {msg.messageText && (
        <div className="text-sm text-white mt-1 text-wrap whitespace-pre-wrap">
          {msg.messageText}
        </div>
      )}
    </>
  )
}

export default MediaMessage
