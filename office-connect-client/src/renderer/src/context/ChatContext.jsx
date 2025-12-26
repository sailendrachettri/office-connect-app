import { createContext, useContext, useEffect, useState } from 'react'
import { showSystemNotification } from '../utils/notifications/showSystemNotification'

const ChatContext = createContext(null)

export const ChatProvider = ({
  connection,
  getFriendList,
  restoreSession,
  children
}) => {
  const [selectedFriendProfileId, setSelectedFriendProfileId] = useState(null)
  const [isFriendTyping, setIsFriendTyping] = useState(false)
  const [incomingMessage, setIncomingMessage] = useState(null)
  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(()=>{
    restoreSession();
    getFriendList();
  }, [refresh]);

  useEffect(() => {
    if (!connection) return

    const handleUserTyping = (senderId) => {
      if (String(senderId) === String(selectedFriendProfileId)) {
        setIsFriendTyping(true) 
      }
    }

    const handleUserStoppedTyping = (senderId) => {
      if (String(senderId) === String(selectedFriendProfileId)) {
        setIsFriendTyping(false)
      }
    }

    const handleReceiveMessage = (msg) => {
      getFriendList?.()

      const normalized = {
        messageId: msg?.messageId ?? msg?.message_id,
        senderId: msg?.senderId ?? msg?.sender_id,
        receiverId: msg?.receiverId ?? msg?.receiver_id,
        messageText: msg?.messageText ?? msg?.message_text,
        createdAt: msg?.createdAt ?? msg?.created_at,
        isRead: msg?.isRead ?? false
      }

      showSystemNotification(normalized)
      window.electron.notifyNewMessage()

      // push into current chat only if relevant
      if (
        normalized.senderId === selectedFriendProfileId ||
        normalized.receiverId === selectedFriendProfileId
      ) {
        setIncomingMessage(normalized)
        setMessages((prev) => [...prev, normalized])
      }
    }

    const handleMessagesRead = (ids) => {
      setMessages((prev) =>
        prev.map((m) =>
          ids.includes(m.messageId) ? { ...m, isRead: true } : m
        )
      )
      window.electron.clearUnread()
    }

    connection.on('UserTyping', handleUserTyping)
    connection.on('UserStoppedTyping', handleUserStoppedTyping)
    connection.on('ReceiveMessage', handleReceiveMessage)
    connection.on('MessagesRead', handleMessagesRead)

    return () => {
      connection.off('UserTyping', handleUserTyping)
      connection.off('UserStoppedTyping', handleUserStoppedTyping)
      connection.off('ReceiveMessage', handleReceiveMessage)
      connection.off('MessagesRead', handleMessagesRead)
    }
  }, [connection, selectedFriendProfileId, getFriendList])

  return (
    <ChatContext.Provider
      value={{
        connection,
        selectedFriendProfileId,
        setSelectedFriendProfileId,
        isFriendTyping,
        incomingMessage,
        messages,
        setMessages,
        setRefresh,
        getFriendList
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChat must be used inside ChatProvider')
  }
  return ctx
}
