import { useEffect, useRef } from 'react'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { IoMdSend } from 'react-icons/io'
import { useChat } from '../../../context/ChatContext'

const MAX_HEIGHT = 120

const UserInputMessage = ({ text, setText, sendMessage  }) => {
  const typingTimeoutRef = useRef(null)
  const isTypingRef = useRef(false)
  const textareaRef = useRef(null)

  const {selectedFriendProfileId, connection} = useChat();

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
      setText('')
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
    <div className="mt-3 flex items-end gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow me-10">
      <AiOutlinePaperClip size={22} className="text-slate-500 cursor-pointer mb-1" />

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
  )
}

export default UserInputMessage
