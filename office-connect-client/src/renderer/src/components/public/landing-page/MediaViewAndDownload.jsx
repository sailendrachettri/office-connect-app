import { useEffect, useState } from 'react'
import { FiDownload } from 'react-icons/fi'

const MediaViewAndDownload = ({ previewImage, setPreviewImage, handleDownload }) => {
  const [closing, setClosing] = useState(false)

  const closePreview = () => {
    setClosing(true)
    setTimeout(() => {
      setPreviewImage(null)
      setClosing(false)
    }, 250)
  }

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && closePreview()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  if (!previewImage) return null

  return (
    <div
      className={`
        fixed inset-0 z-50
        bg-black/20 backdrop-blur-sm
        flex items-center justify-center
        ${closing ? 'animate-fadeOut' : 'animate-fadeIn'}
      `}
      onClick={closePreview}
    >
      {/* Buttons */}
      <div className="absolute top-4 right-4 flex gap-3 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
          className="p-2 rounded-full cursor-pointer bg-white/20 hover:bg-white/30 text-white"
        >
          <FiDownload size={18} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            closePreview()
          }}
          className="py-2 px-3 cursor-pointer rounded-full bg-white/20 hover:bg-white/30 text-white"
        >
          ✕
        </button>
      </div>

      <img
        src={previewImage}
        alt="Preview"
        onClick={(e) => e.stopPropagation()}
        className={`
          max-w-[80vw] max-h-[80vh]
          object-contain rounded-lg shadow-2xl
          ${closing ? 'animate-zoomOut' : 'animate-zoomIn'}
        `}
      />
    </div>
  )
}

export default MediaViewAndDownload
