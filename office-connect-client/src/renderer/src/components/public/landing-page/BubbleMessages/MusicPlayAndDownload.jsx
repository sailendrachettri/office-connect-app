import { useState } from 'react'
import { FiDownload, FiPlay, FiMusic } from 'react-icons/fi'
import { viewUploadedFile } from '../../../../utils/file-upload-to-server/uploadFile'

const MusicPlayAndDownload = ({ msg, handleDownload, formatSize, decryptedMsg }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioUrl = viewUploadedFile(msg?.filePath)

  return (
    <>
      <div className="bg-slate-100 rounded-lg max-w-72 overflow-hidden">
        {/* AUDIO AREA */}
        <div className="relative w-full h-20 bg-slate-200 flex items-center justify-center">
          {!isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow hover:bg-slate-50 transition"
            >
              <div className="p-2 rounded-full bg-slate-500 text-white">
                <FiPlay size={16} className="ml-0.5" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Play audio
              </span>
            </button>
          ) : (
            <audio
              controls
              autoPlay
              preload="none"
              className="w-full px-3"
            >
              <source src={audioUrl} type={msg.mimeType} />
            </audio>
          )}
        </div>

        {/* INFO BAR (same as video) */}
        <div className="flex items-center gap-3 p-3">
          <div className="p-2 rounded-full bg-slate-200">
            <FiMusic className="text-slate-600" />
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium truncate text-slate-700">
              {msg.originalFileName || 'Audio file'}
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
      {decryptedMsg && (
        <div className="text-sm text-white mt-1 whitespace-pre-wrap max-w-72">
          {decryptedMsg}
        </div>
      )}
    </>
  )
}

export default MusicPlayAndDownload
