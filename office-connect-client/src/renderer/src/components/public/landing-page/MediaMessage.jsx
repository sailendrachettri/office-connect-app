import React, { useState } from 'react'
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
import {
  formatSize,
  getFileCategory
} from '../../../utils/file-downloads-from-server/getFileCategory'
import VideoMessage from './BubbleMessages/VideoMessage'
import PhotosViewAndDownload from './BubbleMessages/MediaViewAndDownload'
import MusicPlayAndDownload from './BubbleMessages/MusicPlayAndDownload'

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

const MediaMessage = ({ msg, decryptedMsg }) => {
  const [previewImage, setPreviewImage] = useState(null)

  if (!msg) return null

  const previewUrl =
    msg.fileType === 'image' || msg.fileType === 'video' || msg.fileType === 'audio'
      ? viewUploadedFile(msg.filePath)
      : null

  const thumbUrl = msg.thumbnailPath ? viewUploadedFile(msg.thumbnailPath) : null
  const category = getFileCategory(msg)
  const Icon = FILE_ICONS[category] || FiFile

  const handleDownload = () => {
    downloadChatFile(msg.fileId, msg?.originalFileName)
  }

  // IMAGE
  if (category === 'image') {
    return (
      <>
        <PhotosViewAndDownload
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          handleDownload={handleDownload}
        />
        <div className="space-y-1">
          <img
            src={thumbUrl || previewUrl}
            alt={msg.originalFileName}
            loading="lazy"
            className="rounded-lg max-w-55 cursor-pointer"
            onClick={() => {
              setPreviewImage(viewUploadedFile(msg.filePath))
            }}
          />
          {decryptedMsg && (
            <div className="text-sm text-white whitespace-pre-wrap">{decryptedMsg}</div>
          )}
        </div>
      </>
    )
  }

  // VIDEO
  if (category === 'video') {
    return (
      <VideoMessage decryptedMsg={decryptedMsg} formatSize={formatSize} handleDownload={handleDownload} msg={msg} thumbUrl={thumbUrl} />
    )
  }

  // AUDIO
  if (category === 'audio') {
    return (
     
      <>
      <MusicPlayAndDownload decryptedMsg={decryptedMsg} handleDownload={handleDownload} msg={msg} formatSize={formatSize} />
      </>
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
          <div className="text-xs text-slate-700">{formatSize(msg.fileSize)}</div>
        </div>

        <button
          onClick={() => {
            handleDownload()
          }}
          className="p-2 rounded-full cursor-pointer bg-slate-500 hover:bg-slate-600 text-white"
          title="Download"
        >
          <FiDownload />
        </button>
      </div>

      {decryptedMsg && (
        <div className="text-sm text-white mt-1 text-wrap whitespace-pre-wrap">
          {decryptedMsg}
        </div>
      )}
    </>
  )
}

export default MediaMessage
