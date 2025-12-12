import React from 'react'
import Menu from '../menu/Menu'
import Sidebar from '../sidebars/Sidebar'
import Headers from '../headers/Headers'
import Landing from '../landing-page/Landing'

const Home = () => {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden bg-gray-100 flex">
        {/* LEFT VERTICAL MENU */}
        <div className="w-[70px] bg-gray-900 text-white flex flex-col items-center py-4 gap-6">
          <Menu />
        </div>

        {/* LEFT SIDEBAR (CHAT LIST) */}
        <div className="w-[420px] bg-white border-r border-gray-200">
          <Sidebar />
        </div>

        {/* RIGHT MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col">
          {/* TOP HEADER */}
          <div className="h-[70px] bg-white border-b border-gray-200 shadow-sm px-4 flex items-center">
            <Headers />
          </div>

          {/* CHAT BODY */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <Landing />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
