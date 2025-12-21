import { useState } from 'react'
import { IoCopyOutline } from 'react-icons/io5'
import { MdOutlineCheck } from 'react-icons/md'
import { getTime24FromDate } from '../../../utils/dates/getTime24FromDate'
import { BsCheck2All } from 'react-icons/bs'
import { PiCheck } from 'react-icons/pi'

const MessageBubble = ({
  text,
  fromMe,
  isRead,
  msgDate,
  senderId,
  messageId,
  observerRef,
  currentUserId
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderStatus = (status) =>
    status ? (
      <BsCheck2All size={16} className="text-green-400" />
    ) : (
      <PiCheck size={16} className="text-slate-400" />
    )

  return (
    <div
      data-message-id={messageId}
      data-sender-id={senderId}
      ref={(el) => {
        if (el && !isRead && senderId !== currentUserId && typeof messageId === 'number') {
          observerRef?.current?.observe(el)
        }
      }}
      className={`flex mb-2 ${fromMe ? 'justify-end' : 'justify-start'} group`}
    >
      {/* LEFT MESSAGE → copy on left */}
      {!fromMe && (
        <button
          onClick={handleCopy}
          className="
            mr-2 self-start mt-2
            opacity-0 group-hover:opacity-100
            transition-opacity
            p-1 rounded-md
            bg-white shadow
            text-slate-600 hover:text-slate-900
          "
        >
          {copied ? (
            <MdOutlineCheck size={16} className="text-secondary" />
          ) : (
            <IoCopyOutline size={16} className='cursor-pointer' />
          )}
        </button>
      )}

      {/* MESSAGE BUBBLE */}
      <div
        className={`max-w-xs px-6 py-3 rounded-xl text-sm shadow
          ${
            fromMe
              ? 'bg-primary text-white rounded-br-none'
              : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
          }
        `}
      >
        <div className="whitespace-pre-wrap break-words">{text}</div>

        <span
          className={`text-xs flex justify-end items-center gap-1 mt-1
            ${fromMe ? 'text-slate-100' : 'text-slate-400'}
          `}
        >
          {msgDate && getTime24FromDate(msgDate)}
          {fromMe && renderStatus(isRead)}
        </span>
      </div>

      {/* RIGHT MESSAGE → copy on right */}
      {fromMe && (
        <button
          onClick={handleCopy}
          className="
            ml-2 self-start mt-2
            opacity-0 group-hover:opacity-100
            transition-opacity
            p-1 rounded-md
            bg-white shadow
            text-slate-600 hover:text-slate-900
          "
        >
          {copied ? (
            <MdOutlineCheck size={16} className="text-secondary" />
          ) : (
            <IoCopyOutline size={16} className='cursor-pointer' />
          )}
        </button>
      )}
    </div>
  )
}

export default MessageBubble
