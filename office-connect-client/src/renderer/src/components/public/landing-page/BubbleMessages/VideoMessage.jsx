import { useState } from 'react'
import { FiDownload, FiPlay } from 'react-icons/fi'
import { viewUploadedFile } from '../../../../utils/file-upload-to-server/uploadFile'

const VideoMessage = ({
  thumbUrl,
  msg,
  handleDownload,
  formatSize
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const previewUrl = viewUploadedFile(msg?.filePath);

  return (
    <>
      <div className="bg-slate-100 rounded-lg max-w-72 overflow-hidden">
        {/* VIDEO / THUMB AREA */}
        <div className="relative w-full aspect-video bg-black">
          {!isPlaying ? (
            <>
              {/* Thumbnail */}
              <img
                src={thumbUrl}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />

              {/* Play Button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
              >
                <div className="p-4 rounded-full bg-white/90">
                  <FiPlay size={28} className="text-black ml-1" />
                </div>
              </button>
            </>
          ) : (
            <video
              controls
              autoPlay
              preload="metadata"
              className="w-full h-full object-cover"
            >
              <source src={previewUrl} type={msg.mimeType} />
            </video>
          )}
        </div>

        {/* INFO BAR */}
        <div className="flex items-center gap-3 p-3">
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium truncate text-slate-700">
              {msg.originalFileName}
            </div>
            <div className="text-xs text-slate-500">
              {formatSize(msg.fileSize)}
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-slate-500 hover:bg-slate-600 text-white"
            title="Download"
          >
            <FiDownload />
          </button>
        </div>
      </div>

      {/* MESSAGE TEXT */}
      {msg.messageText && (
        <div className="text-sm text-white mt-1 whitespace-pre-wrap">
          {msg.messageText}
        </div>
      )}
    </>
  )
}

export default VideoMessage
