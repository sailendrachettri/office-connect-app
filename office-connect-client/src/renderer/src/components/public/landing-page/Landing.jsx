import { useEffect, useRef, useState } from 'react'
import { BsCheck2All } from 'react-icons/bs'
import { PiCheck } from 'react-icons/pi'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { IoMdSend } from 'react-icons/io'
import DefaultChatPage from '../../common/DefaultChatPage'
import { createChatConnection } from '../../../signalr/chatConnection'
import { MESSAGES_URL } from '../../../api/routes_urls'
import { axiosPrivate } from '../../../api/api'
import { getTime24FromDate } from '../../../utils/dates/getTime24FromDate'

const Landing = ({ selectedFriendProfileId, getFriendList }) => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [connection, setConnection] = useState(null)
  const [connected, setConnected] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)

  const observerRef = useRef(null)
  const unreadMessageIdsRef = useRef(new Set())

  // Pagination states
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [oldestMessageId, setOldestMessageId] = useState(null)

  const bottomRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const isLoadingRef = useRef(false)
  const initialLoadDoneRef = useRef(false)

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  const formatDateLabel = (date) => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (isSameDay(date, today)) return 'Today'
    if (isSameDay(date, yesterday)) return 'Yesterday'

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  /* --------------View message--------------------- */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = Number(entry.target.dataset.messageId)
            if (!Number.isNaN(messageId)) {
              unreadMessageIdsRef.current.add(messageId)
            }
            const senderId = entry.target.dataset.senderId

            // Only mark messages NOT sent by me
            if (senderId !== currentUserId && messageId) {
              unreadMessageIdsRef.current.add(messageId)
            }
          }
        })
      },
      { threshold: 0.6 } // 60% visible
    )

    return () => observerRef.current?.disconnect()
  }, [currentUserId])

  useEffect(() => {
    if (!messages.length) return

    const timer = setTimeout(() => {
      markMessagesAsRead()
    }, 500) // wait for observer to trigger

    return () => clearTimeout(timer)
  }, [messages.length])

  /* ---------------- Load current user ---------------- */
  useEffect(() => {
    ;(async () => {
      const id = await window.store.get('userId')
      setCurrentUserId(id)
    })()
  }, [])

  /* ---------------- Load initial messages (paginated) ---------------- */
  useEffect(() => {
    if (!currentUserId || !selectedFriendProfileId) return

    // Reset state for new chat
    setMessages([])
    setHasMore(true)
    setOldestMessageId(null)
    initialLoadDoneRef.current = false

    const fetchInitialMessages = async () => {
      setLoading(true)
      try {
        const res = await axiosPrivate.get(
          `${MESSAGES_URL}/${currentUserId}/${selectedFriendProfileId}?pageSize=50`
        )

        const data = res.data
        setMessages(data || [])
        setHasMore(data.hasMore)
        setOldestMessageId(data.oldestMessageId)
        initialLoadDoneRef.current = true

        // Scroll to bottom after initial load
        setTimeout(() => {
          bottomRef.current?.scrollIntoView()
        }, 100)
      } catch (err) {
        console.error('Failed to load messages:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialMessages()
  }, [currentUserId, selectedFriendProfileId])

  /* ---------------- Load older messages when scrolling up ---------------- */
  const loadOlderMessages = async () => {
    if (!hasMore || isLoadingRef.current || !oldestMessageId || !initialLoadDoneRef.current) return

    isLoadingRef.current = true
    setLoading(true)

    // Save scroll position
    const container = scrollContainerRef.current
    const oldScrollHeight = container.scrollHeight
    const oldScrollTop = container.scrollTop

    try {
      const res = await axiosPrivate.get(
        `${MESSAGES_URL}/paginated/${currentUserId}/${selectedFriendProfileId}?beforeMessageId=${oldestMessageId}&pageSize=50`
      )

      const data = res.data

      if (data.messages && data.messages.length > 0) {
        // Prepend older messages
        setMessages((prev) => [...data.messages, ...prev])
        setHasMore(data.hasMore)
        setOldestMessageId(data.oldestMessageId)

        // Restore scroll position (maintain visual position)
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight
          container.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight)
        }, 0)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load older messages:', err)
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }

  /* ---------------- Handle scroll events ---------------- */
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container || !initialLoadDoneRef.current) return

    // Check if scrolled near top (within 150px)
    if (container.scrollTop < 150 && hasMore && !isLoadingRef.current) {
      loadOlderMessages()
    }
  }

  const markMessagesAsRead = async () => {
    if (!connection || unreadMessageIdsRef.current.size === 0) return

    const ids = Array.from(unreadMessageIdsRef.current)
    unreadMessageIdsRef.current.clear()

    try {
      await connection.invoke('MarkMessagesAsRead', ids, selectedFriendProfileId)
    } catch (err) {
      console.error('Failed to mark messages as read', err)
    } finally {
      getFriendList()
    }
  }

  useEffect(() => {
    const onFocus = () => markMessagesAsRead()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

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
        messageId: msg?.messageId ?? msg?.message_id,
        senderId: msg?.senderId ?? msg?.sender_id,
        receiverId: msg?.receiverId ?? msg?.receiver_id,
        messageText: msg?.messageText ?? msg?.message_text,
        createdAt: msg?.createdAt ?? msg?.created_at,
        isRead: msg?.isRead ?? false
      }

      if (
        normalized.senderId === selectedFriendProfileId ||
        normalized.receiverId === selectedFriendProfileId
      ) {
        setMessages((prev) => [...prev, normalized])
      }
    })

    conn.on('MessagesRead', (ids) => {
      setMessages((prev) =>
        prev.map((m) => (ids.includes(m.messageId) ? { ...m, isRead: true } : m))
      )
    })

    setConnection(conn)

    return () => {
      conn.stop()
    }
  }, [currentUserId, selectedFriendProfileId])

  /* ---------------- Auto scroll to bottom for new messages ---------------- */
  useEffect(() => {
    if (initialLoadDoneRef.current) {
      bottomRef.current?.scrollIntoView()
    }
  }, [messages.length])

  /* ---------------- Send message ---------------- */
  const sendMessage = async () => {
    if (!text.trim() || !connected) return

    const optimisticMessage = {
      messageId: Date.now(), // Temporary ID
      senderId: currentUserId,
      receiverId: selectedFriendProfileId,
      messageText: text,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    // Optimistic UI update
    setMessages((prev) => [...prev, optimisticMessage])
    setText('')

    try {
      await connection.invoke('SendMessage', currentUserId, selectedFriendProfileId, text)
    } catch (err) {
      console.error('Failed to send message', err)
    }
  }

  /* ---------------- Status Icon ---------------- */
  const renderStatus = (status) => {
    if (status == true) return <BsCheck2All size={16} className="text-green-400" />
    // if (status === 'delivered') return <BsCheck2All size={16} className="text-slate-400" />
    return <PiCheck size={16} className="text-slate-400" />
  }

  if (!selectedFriendProfileId) return <DefaultChatPage />

  return (
    <div className="max-h-[84vh] w-full flex flex-col overflow-hidden ps-10 pt-7">
      {/* ================= MESSAGES ================= */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scroll"
      >
        {/* Loading indicator at top */}
        {loading && hasMore && (
          <div className="flex justify-center py-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* No more messages indicator */}
        {!hasMore && messages.length > 0 && (
          <div className="text-center py-2 text-slate-400 text-xs">No more messages</div>
        )}

        {messages.map((msg, i) => {
          const fromMe = msg?.senderId === currentUserId
          const msgDate = new Date(msg?.createdAt)
          const prevMsg = messages[i - 1]
          const showDate = !prevMsg || !isSameDay(new Date(prevMsg?.createdAt), msgDate)

          return (
            <div key={msg?.messageId || i}>
              {/* DATE SEPARATOR */}
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-slate-200 text-slate-600">
                    {formatDateLabel(msgDate)}
                  </span>
                </div>
              )}

              {/* MESSAGE BUBBLE */}
              <div
                data-message-id={msg?.messageId}
                data-sender-id={msg?.senderId}
                ref={(el) => {
                  if (
                    el &&
                    !msg?.isRead &&
                    msg?.senderId !== currentUserId &&
                    typeof msg?.messageId === 'number'
                  ) {
                    observerRef.current.observe(el)
                  }
                }}
                className={`flex ${fromMe ? 'justify-end' : 'justify-start'} mb-2 pe-10`}
              >
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
                    {msgDate && getTime24FromDate(msgDate)}
                    {fromMe && renderStatus(msg?.isRead)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT BAR ================= */}
      <div className="mt-3 flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow me-10">
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
