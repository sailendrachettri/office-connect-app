import { useRef } from 'react'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { IoMdSend } from 'react-icons/io'

const UserInputMessage = ({ text, setText, sendMessage, connection, selectedFriendProfileId }) => {
  const typingTimeoutRef = useRef(null)
  const isTypingRef = useRef(false)

  const handleTyping = (e) => {
    const value = e.target.value
    setText(value)

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
    }
  }

  return (
    <>
      <div className="mt-3 flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow me-10">
        <AiOutlinePaperClip size={22} className="text-slate-500 cursor-pointer" />

        <input
          value={text}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="flex-1 outline-none text-slate-700 placeholder-slate-400"
          onBlur={() => {
            isTypingRef.current = false
            connection?.invoke('UserStoppedTyping', selectedFriendProfileId)
          }}
        />

        <button onClick={sendMessage}>
          <IoMdSend size={26} className="text-primary" />
        </button>
      </div>
    </>
  )
}

export default UserInputMessage
