import { useEffect, useRef, useState } from 'react'
import DefaultChatPage from '../../common/DefaultChatPage'
import { MESSAGES_URL } from '../../../api/routes_urls'
import { axiosPrivate } from '../../../api/api'
import UserInputMessage from './UserInputMessage'
import MessageBubble from './MessageBubble'
import { useChat } from '../../../context/ChatContext'
import toast from 'react-hot-toast'

const Landing = () => {
  const [text, setText] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [oldestMessageId, setOldestMessageId] = useState(null)
  const [selectedMedia, setSelectedMedia] = useState(null)

  const observerRef = useRef(null)
  const unreadMessageIdsRef = useRef(new Set())
  const bottomRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const restoreMessageIdRef = useRef(null)
  const isLoadingRef = useRef(false)
  const initialLoadDoneRef = useRef(false)

  const { connection, selectedFriendProfileId, getFriendList, messages, setMessages } = useChat()

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

  /* ---------------- Load older messages when scrolling up ---------------- */
  const loadOlderMessages = async () => {
    if (!hasMore || isLoadingRef.current || !oldestMessageId || !initialLoadDoneRef.current) return

    isLoadingRef.current = true
    setLoading(true)

    // Save scroll position
    const container = scrollContainerRef.current
    const oldScrollHeight = container.scrollHeight
    const oldScrollTop = container.scrollTop

    isLoadingRef.current = true
    setLoading(true)
    restoreMessageIdRef.current = messages[0]?.messageId

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
      getFriendList()
    } catch (err) {
      console.error('Failed to mark messages as read', err)
    }
  }

  /* ---------------- Send message ---------------- */
  const sendMessage = async () => {
    if (!text.trim() || !connection) return

    connection.invoke('UserStoppedTyping', selectedFriendProfileId)

    setMessages((prev) => [...prev])
    setText('')

    try {
      const safeFileId = null;

      await connection.invoke(
        'SendMessage',
        currentUserId,
        selectedFriendProfileId,
        text,
        safeFileId
      )

    } catch (err) {
      toast.error('Failed to send message')
      console.error('Failed to send message', err)
    }
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

    fetchInitialMessages()
  }, [currentUserId, selectedFriendProfileId])

  useEffect(() => {
    const onFocus = () => markMessagesAsRead()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  /* ---------------- Auto scroll to bottom for new messages ---------------- */
  useEffect(() => {
    if (initialLoadDoneRef.current) {
      bottomRef.current?.scrollIntoView()
    }
  }, [messages.length])

  if (!selectedFriendProfileId) return <DefaultChatPage />

  return (
    <div className="max-h-[84vh] w-full flex flex-col overflow-hidden ps-10 pt-0.5">
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

        {messages?.map((msg, i) => {
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

              <MessageBubble
                text={msg?.messageText}
                isRead={msg?.isRead}
                msgDate={msgDate}
                fromMe={fromMe}
                senderId={msg?.senderId}
                messageId={msg?.messageId}
                observerRef={observerRef}
                currentUserId={currentUserId}
                messageType={msg?.messageType}
                fullChat={msg}
              />
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT BAR ================= */}

      <UserInputMessage
        sendMessage={sendMessage}
        setText={setText}
        text={text}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
      />
    </div>
  )
}

export default Landing
