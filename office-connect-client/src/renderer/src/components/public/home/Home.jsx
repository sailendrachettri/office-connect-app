import React, { useState } from 'react'
import Menu from '../menu/Menu'
import Sidebar from '../sidebars/Sidebar'
import Headers from '../headers/Headers'
import Landing from '../landing-page/Landing'
import UserRegister from '../../common/UserRegister'
import LoginUser from '../../common/LoginUser'

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [showLogin, setShowLogin] = useState(true)

  return (
    <>
      <div className="w-full h-7 bg-slate-200 text-slate-700 flex items-center px-4 select-none drag-region">
        {/* <div className="text-sm font-medium">Office Connect</div> */}

        <div className="ml-auto flex gap-3 no-drag">
          <button onClick={() => window.api.minimize()} className="px-3 cursor-pointer hover:bg-slate-50 rounded-sm">
            —
          </button>
          <button onClick={() => window.api.maximize()} className="px-3 cursor-pointer hover:bg-slate-50 rounded-sm">
            ▢
          </button>
          <button onClick={() => window.api.close()} className="px-3 hover:bg-red-600 hover:text-slate-300 cursor-pointer rounded-sm">
            ✕
          </button>
        </div>
      </div>

      {isLoggedIn ? (
        <div className="w-screen h-screen overflow-hidden bg-gray-100 flex">
          {/* LEFT VERTICAL MENU */}
          <div className="w-[70px] bg-slate-50 border border-slate-200 flex flex-col items-center py-4 gap-6 p-1">
            <Menu />
          </div>

          {/* LEFT SIDEBAR (CHAT LIST) */}
          <div className="w-[420px] bg-white border-r border-slate-200 p-1">
            <Sidebar />
          </div>

          {/* RIGHT MAIN CHAT AREA */}
          <div className="flex-1 flex flex-col">
            {/* TOP HEADER */}
            <div className="h-[70px] bg-white border-b border-slate-200 shadow-sm px-4 flex items-center p-1">
              <Headers />
            </div>

            {/* CHAT BODY */}
            <div className="flex-1 max-h-[88vh] overflow-y-auto ">
              <Landing />
            </div>
          </div>
        </div>
      ) : (
        <>
          {showLogin ? (
            <LoginUser setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <UserRegister setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />
          )}
        </>
      )}
    </>
  )
}

export default Home
