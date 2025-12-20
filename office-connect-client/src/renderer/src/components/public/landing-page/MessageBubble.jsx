import { useState } from 'react'
import { IoCopyOutline, IoCheckmarkDoneOutline } from 'react-icons/io5'
import { MdOutlineCheck } from 'react-icons/md'

const MessageBubble = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  return (
    <div className="relative group max-w-full">
      {/* Message text */}
      <div className="whitespace-pre-wrap wrap-break-word pr-8">
        {text}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="
          absolute top-1 right-1
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          p-1 rounded-md
          bg-white/80 hover:bg-white
          shadow
          text-slate-600 hover:text-slate-900
        "
      >
        {copied ? (
          <MdOutlineCheck size={16} className="text-secondary" />
        ) : (
          <IoCopyOutline size={16} className='cursor-pointer'/>
        )}
      </button>

      {/* Copied tooltip */}
      {copied && (
        <span className="absolute -top-6 right-1 text-xs bg-secondary text-white px-2 py-0.5 rounded">
          Copied
        </span>
      )}
    </div>
  )
}

export default MessageBubble
