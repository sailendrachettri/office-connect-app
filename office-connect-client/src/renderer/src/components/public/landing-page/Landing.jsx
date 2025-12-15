import React, { useEffect, useState } from 'react'
import { BsCheck2All } from 'react-icons/bs'
import { PiCheck } from 'react-icons/pi'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { IoMdSend } from 'react-icons/io'
import DefaultChatPage from '../../common/DefaultChatPage'

const Landing = ({ selectedFriendProfileId, userFullDetails }) => {
  // console.log({ userFullDetails })
  const [message, setMessage] = useState('')

  const generateConversation = (userId) =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      fromMe: i % 2 === 0,
      text: `Message ${i + 1} with user ${userId}`,
      time: `10:${i < 10 ? '0' : ''}${i} AM`,
      status: i % 3 === 0 ? 'read' : i % 3 === 1 ? 'delivered' : 'sent'
    }))

  const conversations = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [i + 1, generateConversation(i + 1)])
  )

  if (!selectedFriendProfileId) {
    return <DefaultChatPage />
  }



  const messages = conversations[selectedFriendProfileId] || []

  const renderStatus = (status) => {
    if (!status) return null

    if (status === 'read') {
      return (
        <span className="text-green-300 ml-1 text-xs">
          <BsCheck2All size={18} />
        </span>
      )
    }

    if (status === 'delivered') {
      return (
        <span className="text-slate-200 ml-1 text-xs">
          <BsCheck2All size={18} />
        </span>
      )
    }

    if (status === 'sent') {
      return (
        <span className="text-slate-200 ml-1 text-xs">
          <PiCheck size={18} />
        </span>
      )
    }

    return null
  }

  return (
    <div className="h-full w-full  p-4 flex flex-col justify-between">
      {/* CHAT AREA */}
      <div className="flex flex-col gap-3 overflow-y-auto custom-scroll mb-4 h-[85vh] pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-xl shadow-sm text-sm ${
                msg.fromMe
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`text-xs flex justify-end items-center gap-1 mt-1 ${
                  msg.fromMe ? 'text-green-100' : 'text-slate-500'
                }`}
              >
                {msg.time}
                {msg.fromMe && renderStatus(msg.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT FIELD */}
      <div className="w-full flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
        {/* File Upload */}
        <button className="text-slate-600 hover:text-slate-800 transition">
          <AiOutlinePaperClip size={22} />
        </button>

        {/* Input */}
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 outline-none text-slate-700 placeholder-slate-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Send button */}
        <button className="text-primary hover:text-slate-800 transition p-1 rounded">
          <IoMdSend size={26} />
        </button>
      </div>
    </div>
  )
}

export default Landing
