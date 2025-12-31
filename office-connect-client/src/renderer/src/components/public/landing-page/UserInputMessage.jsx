import { useEffect, useRef } from 'react'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { IoMdSend } from 'react-icons/io'
import { useChat } from '../../../context/ChatContext'
import MediaPreview from './MediaPreview'
import { uploadMediaChat } from '../../../utils/file-upload-to-server/uploadMediaChat'

const MAX_HEIGHT = 120

const UserInputMessage = ({
  text,
  setText,
  sendMessage,
  setFileId,
  selectedMedia,
  setSelectedMedia,
  setRefreshChat
}) => {
  const typingTimeoutRef = useRef(null)
  const isTypingRef = useRef(false)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const { selectedFriendProfileId, connection } = useChat()

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedMedia(file)
  }

  const handleTyping = (e) => {
    const value = e.target.value
    setText(value)

    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, MAX_HEIGHT) + 'px'
      textarea.style.overflowY = textarea.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden'
    }

    if (!connection || connection.state !== 'Connected') return

    if (!isTypingRef.current) {
      isTypingRef.current = true
      connection.invoke('UserTyping', selectedFriendProfileId)
    }

    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
      connection.invoke('UserStoppedTyping', selectedFriendProfileId)
    }, 800)
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      // Send the medias with text in chat
      if (selectedMedia) {
        const res = await uploadMediaChat(selectedMedia, text, selectedFriendProfileId)
        console.log(res)
        if (res?.data) {
          const msg = res.data

          // 🔥 BROADCAST VIA SIGNALR
          await connection.invoke('BroadcastUploadedMessage', msg)
        }

        setRefreshChat((prev) => !prev)
      }else{
        sendMessage();
      }

      setText('')
      setSelectedMedia(null)
      textareaRef.current.style.height = 'auto'
    }
  }

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) {
        return
      }

      if (e.key === '/') {
        e.preventDefault()
        textareaRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  return (
    <>
      {selectedMedia && (
        <MediaPreview file={selectedMedia} onRemove={() => setSelectedMedia(null)} />
      )}
      <div className="mt-3 flex items-end gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow me-10">
        {/* <IoChatbubblesOutline  size={22} className="text-slate-500 mb-1" /> */}
        <input type="file" hidden ref={fileInputRef} onChange={handleFileSelect} />

        <button onClick={() => fileInputRef.current.click()}>
          <AiOutlinePaperClip size={22} className="text-slate-500 cursor-pointer" />
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Press / to start typing"
          className="flex-1 resize-none outline-none text-slate-700 placeholder-slate-400 leading-6 pb-1 custom-scroll"
          onBlur={() => {
            isTypingRef.current = false
            connection?.invoke('UserStoppedTyping', selectedFriendProfileId)
          }}
        />

        <button onClick={sendMessage} className="mb-1">
          <IoMdSend size={26} className="text-primary" />
        </button>
      </div>
    </>
  )
}

export default UserInputMessage
