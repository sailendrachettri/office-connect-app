import { useEffect, useState } from 'react'
import Menu from '../menu/Menu'
import Sidebar from '../sidebars/Sidebar'
import Headers from '../headers/Headers'
import Landing from '../landing-page/Landing'
import UserProfile from '../../common/UserProfile'
import { axiosInstance } from '../../../api/api'
import { GET_USER_DETAILS_URL } from '../../../api/routes_urls'
import { IoChatbubblesOutline } from 'react-icons/io5'
import TopHelpMenu from '../menu/helper-menu/TopHelpMenu'
import { useSelector } from 'react-redux'

const Home = ({
  isLoggedIn,
  setIsLoggedIn,
  setShowLogin,
  friendList,
  getFriendList
}) => {
  const [selectedFriendProfileId, setSelectedFriendProfileId] = useState(null)
  const [userFullDetails, setUserFullDetails] = useState({})
  const [selectedTab, setSelectedTab] = useState('chat')
  const [pendingFriendReq, setPendingFriendReq] = useState(null)
  const [isFriendTyping, setIsFriendTyping] = useState(false)

  useState(() => {
    const countPendingFriendReq = friendList?.filter(
      (item) => item.relation_status === 'PENDING_RECEIVED'
    ).length
    setPendingFriendReq(countPendingFriendReq || null)
  }, [friendList])

  

  const isConnected = useSelector((state) => state.connection.isConnected)

 

  useEffect(() => {
    if (selectedFriendProfileId) {
      ;(async () => {
        try {
          const payload = {
            UserId: selectedFriendProfileId
          }
          const res = await axiosInstance.post(GET_USER_DETAILS_URL, payload)

          setUserFullDetails(res?.data?.data || {})
        } catch (error) {}
      })()
    }
  }, [selectedFriendProfileId, isLoggedIn])

  return (
    <>
     
        <section>
          {/* Icons to minimize, fullscreen and close */}

          {isLoggedIn && (
            <section>
              <div className="w-full h-7 bg-slate-200 text-slate-700 flex items-center px-6 select-none drag-region">
                <div className="flex items-center justify-start gap-x-3 no-drag">
                  <div
                    className={`${isConnected ? 'text-green-500' : 'text-red-400'} flex items-center justify-center gap-x-1`}
                  >
                    <IoChatbubblesOutline />
                    <small>{isConnected ? 'Connected' : 'Disconnected'}</small>
                  </div>
                  <TopHelpMenu />
                </div>

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

              <section className="w-screen h-[calc(100vh-28px)] overflow-hidden bg-gray-100 flex">
                {/* LEFT VERTICAL MENU — COMMON */}
                <div className="w-12.5 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 gap-6">
                  <Menu
                    setShowLogin={setShowLogin}
                    setIsLoggedIn={setIsLoggedIn}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    pendingFriendReq={pendingFriendReq}
                    setSelectedFriendProfileId={setSelectedFriendProfileId}
                  />
                </div>

                {/* RIGHT SIDE — CHANGES BASED ON TAB */}
                <div className="flex-1 flex">
                  {/*  CHAT TAB  */}
                  {selectedTab === 'chat' && (
                    <>
                      {/* CHAT LIST */}
                      <div className="w-105 bg-white border-r border-slate-200 p-1">
                        <Sidebar
                          setShowLogin={setShowLogin}
                          setIsLoggedIn={setIsLoggedIn}
                          setSelectedFriendProfileId={setSelectedFriendProfileId}
                          selectedFriendProfileId={selectedFriendProfileId}
                          friendList={friendList}
                          isFriendTyping={isFriendTyping}
                        />
                      </div>

                      {/* CHAT AREA */}
                      <div className="flex-1 flex flex-col">
                        {/* HEADER */}
                        <div className="h-17.5 bg-linear-to-t from-slate-50 to-slate-100">
                          <Headers
                            selectedFriendProfileId={selectedFriendProfileId}
                            userFullDetails={userFullDetails}
                            isFriendTyping={isFriendTyping}
                          />
                        </div>

                        {/* BODY */}
                        <div className="flex-1 flex">
                          <Landing
                            selectedFriendProfileId={selectedFriendProfileId}
                            userFullDetails={userFullDetails}
                            getFriendList={getFriendList}
                            setIsFriendTyping={setIsFriendTyping}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/*  PROFILE TAB  */}
                  {selectedTab === 'profile' && (
                    <div className="flex-1 flex flex-col">
                      {/* HEADER */}
                      <div className="h-17.5 bg-white border-b border-slate-200 shadow-sm px-4 flex items-center">
                        Profile
                      </div>

                      {/* BODY */}
                      <div className="flex-1 overflow-y-auto bg-white">
                        <UserProfile getFriendList={getFriendList} />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </section>
          )}

          
        </section>
      
    </>
  )
}

export default Home
