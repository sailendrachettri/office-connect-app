import React from 'react'
import svgBanner from '../../assets/svgs/comm.svg'
import { BsChatDots } from 'react-icons/bs'
import { FiPaperclip } from 'react-icons/fi'
import { RiShieldCheckLine } from 'react-icons/ri'
import { IoShieldCheckmarkOutline } from 'react-icons/io5'

const DefaultChatPage = () => {
  return (
    <div className="flex-1 h-full flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-xl text-center px-6">
        {/* SVG / Illustration Placeholder */}
        <div className="mb-6 flex justify-center">
          <div className="w-64 h-64  rounded-xl flex items-center justify-center ">
            <img src={svgBanner} alt="" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-slate-700 mb-3">Welcome to Office Connect</h2>

        {/* Subtitle */}
        <p className="text-slate-500 mb-6 leading-relaxed">
          A secure local messaging platform for your organization. Chat, share files, and
          collaborate seamlessly within your office network.
        </p>

        {/* Features */}
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 mx-auto">
          <div
            className="flex items-center gap-3 bg-white border border-slate-200 
                  rounded-lg px-3 py-2 text-xs"
          >
            <BsChatDots className="text-primary" size={20} />
            <span className="text-slate-600 text-nowrap">One-one Chat</span>
          </div>

          <div
            className="flex items-center gap-3 bg-white border border-slate-200 
                  rounded-lg px-3 py-2 text-xs"
          >
            <IoShieldCheckmarkOutline  className="text-emerald-600 text-nowrap" size={20} />
            <span className="text-slate-600">Secure & easy</span>
          </div>

          <div
            className="flex items-center gap-3 bg-white border border-slate-200 
                  rounded-lg px-3 py-2 text-xs"
          >
            <RiShieldCheckLine className="text-indigo-600 text-nowrap" size={20} />
            <span className="text-slate-600">Local Network</span>
          </div>
        </div>

        {/* Footer Hint */}
        <p className="text-slate-400 text-sm">
          Select a conversation from the sidebar to start messaging
        </p>
      </div>
    </div>
  )
}

export default DefaultChatPage
