import { getMediaType } from '../../../utils/file-upload-to-server/getMediaType'
import { AiOutlineFile } from 'react-icons/ai'
import { MdClose } from 'react-icons/md'

const MediaPreview = ({ file, onRemove }) => {
  const type = getMediaType(file)
  const previewUrl = URL.createObjectURL(file)

  return (
    <div className="flex items-center w-[93%] gap-4 p-4 bg-green-50 rounded-lg border-2 border-dashed border-green-300 shadow-sm mb-3 relative">
      {/* Media preview */}
      <div className="flex-shrink-0">
        {type === 'image' && (
          <img
            src={previewUrl}
            alt="preview"
            className="w-24 h-24 object-cover rounded-md border border-slate-200"
          />
        )}

        {type === 'video' && (
          <video
            src={previewUrl}
            controls
            className="w-32 h-24 rounded-md border border-slate-200"
          />
        )}

        {type === 'audio' && (
          <div className="flex flex-col items-center justify-center w-32 h-20 bg-slate-100 rounded-md border border-slate-200 p-2">
            <audio src={previewUrl} controls className="w-full" />
          </div>
        )}

        {type === 'document' && (
          <div className="flex items-center gap-2 w-32 h-20 bg-slate-100 rounded-md border border-slate-200 p-2">
            <AiOutlineFile size={24} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700 truncate">{file?.name}</span>
          </div>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-600"
        title="Remove"
      >
        <MdClose size={20} />
      </button>
    </div>
  )
}

export default MediaPreview
