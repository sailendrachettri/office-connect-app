import React, { useEffect, useState } from 'react'
import Menu from '../menu/Menu'
import Sidebar from '../sidebars/Sidebar'
import Headers from '../headers/Headers'
import Landing from '../landing-page/Landing'
import UserRegister from '../../common/UserRegister'
import LoginUser from '../../common/LoginUser'
import UserProfile from '../../common/UserProfile'
import { axiosInstance } from '../../../api/api'
import { GET_USER_DETAILS_URL } from '../../../api/routes_urls'

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [selectedUsersProfileId, setSelectedUsersProfileId] = useState(null)
  const [selectedFriendProfileId, setSelectedFriendProfileId] = useState(null)
  const [userFullDetails, setUserFullDetails] = useState({});
  const [selectedTab, setSelectedTab] = useState('chat')

  

  useEffect(() => {
  async function restoreSession() {
    const token = await window.store.get('accessToken');

    if (token) {
      setIsLoggedIn(true);
    }
  }

  restoreSession();
}, []);




  useEffect(() => {

    if (selectedUsersProfileId) {
      ;(async () => {
        try {
          const payload = {
            UserId : selectedUsersProfileId
          }
          const res = await axiosInstance.post(GET_USER_DETAILS_URL, payload);
          setUserFullDetails(res?.data?.data || {})
        } catch (error) {}
      })()
    }
  }, [selectedUsersProfileId])

  
  console.log({selectedFriendProfileId})

  return (
    <>
      {/* Icons to minimize, fullscreen and close */}
      <div className="w-full h-7 bg-slate-200 text-slate-700 flex items-center px-4 select-none drag-region">
        {/* <div className="text-sm font-medium">Office Connect</div> */}

        <div className="ml-auto flex gap-3 no-drag">
          <button
            onClick={() => window.api.minimize()}
            className="px-3 cursor-pointer hover:bg-slate-50 rounded-sm"
          >
            —
          </button>
          <button
            onClick={() => window.api.maximize()}
            className="px-3 cursor-pointer hover:bg-slate-50 rounded-sm"
          >
            ▢
          </button>
          <button
            onClick={() => window.api.close()}
            className="px-3 hover:bg-red-600 hover:text-slate-300 cursor-pointer rounded-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {isLoggedIn ? (
        <section className="w-screen h-screen overflow-hidden bg-gray-100 flex">
          {/* LEFT VERTICAL MENU — COMMON */}
          <div className="w-[70px] bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 gap-6">
            <Menu
              setShowLogin={setShowLogin}
              setIsLoggedIn={setIsLoggedIn}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </div>

          {/* RIGHT SIDE — CHANGES BASED ON TAB */}
          <div className="flex-1 flex">
            {/*  CHAT TAB  */}
            {selectedTab === 'chat' && (
              <>
                {/* CHAT LIST */}
                <div className="w-[420px] bg-white border-r border-slate-200 p-1">
                  <Sidebar
                    setShowLogin={setShowLogin}
                    setIsLoggedIn={setIsLoggedIn}
                    setSelectedFriendProfileId={setSelectedFriendProfileId}
                  />
                </div>

                {/* CHAT AREA */}
                <div className="flex-1 flex flex-col">
                  {/* HEADER */}
                  <div className="h-[70px] bg-linear-to-t from-slate-50 to-slate-100">
                    <Headers selectedFriendProfileId={selectedFriendProfileId} />
                  </div>

                  {/* BODY */}
                  <div className="flex-1 overflow-y-auto">
                    <Landing selectedFriendProfileId={selectedFriendProfileId} userFullDetails={userFullDetails} />
                  </div>
                </div>
              </>
            )}

            {/*  PROFILE TAB  */}
            {selectedTab === 'profile' && (
              <div className="flex-1 flex flex-col">
                {/* HEADER */}
                <div className="h-[70px] bg-white border-b border-slate-200 shadow-sm px-4 flex items-center">
                  Profile
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto bg-white">
                  <UserProfile />
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {showLogin ? (
            <LoginUser
              setShowLogin={setShowLogin}
              setIsLoggedIn ={setIsLoggedIn}
            />
          ) : (
            <UserRegister setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />
          )}
        </>
      )}
    </>
  )
}

export default Home
