import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { BsCheck2All } from 'react-icons/bs'
import { PiCheck } from 'react-icons/pi'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { IoMdSend } from 'react-icons/io'
import DefaultChatPage from '../../common/DefaultChatPage'
import { createChatConnection } from '../../../signalr/chatConnection'
import { MESSAGES_URL } from '../../../api/routes_urls'
import { axiosPrivate } from '../../../api/api'

const Landing = ({ selectedFriendProfileId }) => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [connection, setConnection] = useState(null)
  const [connected, setConnected] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)

  const bottomRef = useRef(null)

  /* ---------------- Load current user ---------------- */
  useEffect(() => {
    ;(async () => {
      const id = await window.store.get('userId')
      setCurrentUserId(id)
    })()
  }, [])

  /* ---------------- Load previous chat ---------------- */
  useEffect(() => {
    if (!currentUserId || !selectedFriendProfileId) return


    const fetchMessages = async () => {
      try {
        const res = await axiosPrivate.get(`${MESSAGES_URL}/${currentUserId}/${selectedFriendProfileId}`);
        setMessages(res.data || [])
        // console.log(res?.data)
      } catch (err) {
        console.error('Failed to load messages:', err)
      }
    }

    fetchMessages()
  }, [currentUserId, selectedFriendProfileId])

  /* ---------------- SignalR connection ---------------- */
  useEffect(() => {
    if (!currentUserId || !selectedFriendProfileId) return

    const conn = createChatConnection(currentUserId)

    conn
      .start()
      .then(() => setConnected(true))
      .catch(() => setConnected(false))

    conn.on('ReceiveMessage', (msg) => {
      const normalized = {
        senderId: msg.senderId ?? msg.sender_id,
        receiverId: msg.receiverId ?? msg.receiver_id,
        messageText: msg.messageText ?? msg.message_text,
        createdAt: msg.createdAt ?? msg.created_at,
        isRead: msg.isRead ?? false
      }

      if (
        normalized.senderId === selectedFriendProfileId ||
        normalized.receiverId === selectedFriendProfileId
      ) {
        setMessages((prev) => [...prev, normalized])
      }
    })

    setConnection(conn)

    return () => {
      conn.stop()
    }
  }, [currentUserId, selectedFriendProfileId])

  /* ---------------- Auto scroll (NO smooth) ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages])

  /* ---------------- Send message ---------------- */
  const sendMessage = async () => {
    if (!text.trim() || !connected) return

    await connection.invoke('SendMessage', currentUserId, selectedFriendProfileId, text)

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      {
        senderId: currentUserId,
        receiverId: selectedFriendProfileId,
        messageText: text,
        createdAt: new Date(),
        isRead: false
      }
    ])

    setText('')
  }

  /* ---------------- Status Icon ---------------- */
  const renderStatus = (status) => {
    if (status === 'read') return <BsCheck2All size={16} className="text-blue-400" />
    if (status === 'delivered') return <BsCheck2All size={16} className="text-slate-400" />
    return <PiCheck size={16} className="text-slate-400" />
  }

  if (!selectedFriendProfileId) return <DefaultChatPage />

  return (
    <div className="max-h-[88vh] w-full flex flex-col overflow-hidden ps-10 pt-7">
      {/* ================= MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto custom-scroll">
        {messages?.map((msg, i) => {
         const fromMe = msg.senderId === currentUserId;

          return (
            <div key={i} className={`flex ${fromMe ? 'justify-end' : 'justify-start'} mb-2 pe-10`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow
                  ${
                    fromMe
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}
              >
                <p>{msg?.messageText}</p>

                <span
                  className={`text-xs flex justify-end items-center gap-1 mt-1
                    ${fromMe ? 'text-green-100' : 'text-slate-400'}
                  `}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {fromMe && renderStatus(msg.isRead)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT BAR ================= */}
      <div className="mt-3 flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow">
        <AiOutlinePaperClip size={22} className="text-slate-500 cursor-pointer" />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 outline-none text-slate-700 placeholder-slate-400"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />

        <button onClick={sendMessage}>
          <IoMdSend size={26} className="text-primary" />
        </button>
      </div>
    </div>
  )
}

export default Landing
