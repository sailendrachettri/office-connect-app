import { getMediaType } from '../../../utils/file-upload-to-server/getMediaType'
import { AiOutlineFile } from 'react-icons/ai'
import { MdClose } from 'react-icons/md'

const formatSize = (bytes) => {
  if (!bytes) return ''
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const MediaPreview = ({ file, onRemove }) => {
  const type = getMediaType(file)
  const previewUrl = URL.createObjectURL(file)

  return (
    <div className="flex items-center w-[93%] gap-4 p-4 bg-green-50 rounded-lg border-2 border-dashed border-green-300 shadow-sm mb-3 relative">
      {/* Thumbnail / Icon */}
      <div className="shrink-0">
        {type === 'image' && (
          <img
            src={previewUrl}
            alt="preview"
            className="w-20 h-20 object-cover rounded-lg border border-slate-200"
          />
        )}

        {type === 'video' && (
          <video src={previewUrl} className="w-20 h-20 rounded-lg border border-slate-200 object-cover" muted />
        )}

        {type === 'audio' && (
          <div className="w-20 h-20 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
            🎵
          </div>
        )}

        {type === 'document' && (
          <div className="w-20 h-20 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
            <AiOutlineFile size={28} className="text-slate-500" />
          </div>
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800">
          {file?.name?.length > 90 ? `${file.name.substring(0, 90)}...` : file?.name}
        </p>

        <p className="text-xs text-slate-500 mt-1">{formatSize(file?.size)}</p>

        {type === 'audio' && <audio src={previewUrl} controls className="mt-2 w-full h-8" />}

        {type === 'video' && <p className="text-xs text-slate-400 mt-2">Video attached</p>}
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-300 transition"
        title="Remove"
      >
        <MdClose size={16} />
      </button>
    </div>
  )
}

export default MediaPreview
