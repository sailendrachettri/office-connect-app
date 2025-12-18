import React, { useEffect, useState } from 'react'
import Menu from '../menu/Menu'
import Sidebar from '../sidebars/Sidebar'
import Headers from '../headers/Headers'
import Landing from '../landing-page/Landing'
import UserRegister from '../../common/UserRegister'
import LoginUser from '../../common/LoginUser'
import UserProfile from '../../common/UserProfile'
import { axiosInstance, axiosPrivate } from '../../../api/api'
import { GET_FRIEND_LIST_URL, GET_USER_DETAILS_URL, ME_URL } from '../../../api/routes_urls'
import { IoChatbubblesOutline } from 'react-icons/io5'
import TopHelpMenu from '../menu/helper-menu/TopHelpMenu'
import { useSelector } from 'react-redux'
import { setConnected, setDisconnected } from '../../../store/connectionSlice'
import { createChatConnection } from '../../../signalr/chatConnection'
import { store } from '../../../store'

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [selectedFriendProfileId, setSelectedFriendProfileId] = useState(null)
  const [userFullDetails, setUserFullDetails] = useState({})
  const [selectedTab, setSelectedTab] = useState('chat')
  const [loading, setLoading] = useState(true)
  const [pendingFriendReq, setPendingFriendReq] = useState(null)
  const [friendList, setFriendList] = useState([])

  const getFriendList = async () => {
    const userId = await window.store.get('userId')

    if (userId) {
      try {
        const res = await axiosPrivate.get(GET_FRIEND_LIST_URL)

        if (res?.data?.success == true) {
          const data = res?.data?.data
          const filteredList = data.filter((item) => item.relation_status === 'FRIEND')
          const countPendingFriendReq = data.filter(
            (item) => item.relation_status === 'PENDING_RECEIVED'
          ).length
          setPendingFriendReq(countPendingFriendReq || null)
          setFriendList(filteredList || [])
        }
      } catch (error) {
        console.error('not able to get the friend list', error)
      }
    }
  }

  const isConnected = useSelector((state) => state.connection.isConnected)
  console.log({ isConnected })

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await axiosPrivate.get(ME_URL)
        console.log('Logged In user details')
        // console.table(res?.data?.data)
        if (res?.data?.success == true) {
          const email = res?.data?.data?.email
          const full_name = res?.data?.data?.full_Name
          const pic = res?.data?.data?.profile_Image
          // const username = res?.data?.data?.username
          const user_Id = res?.data?.data?.user_Id

          await window.store.set('userId', user_Id)
          await window.store.set('user', {
            user_Id,
            full_name,
            email,
            pic
          })
          await getFriendList()

          setIsLoggedIn(true)
        }

        const connection = createChatConnection(res?.data?.data?.user_Id)
  

        connection
          .start()
          .then(() => {
            store.dispatch(setConnected('signalr'))
          })
          .catch(() => {
            store.dispatch(setDisconnected())
          })
      } catch (err) {
        console.error("not able to register", err);
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [showLogin, loading])

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

    ;(async () => {
      await getFriendList()
    })()
  }, [selectedFriendProfileId, isLoggedIn])

  return (
    <>
      {loading ? (
        <section>
          <div className="min-h-screen w-full flex items-center justify-center">
            <div class="loader"></div>
          </div>
        </section>
      ) : (
        <section>
          {/* Icons to minimize, fullscreen and close */}

          {isLoggedIn && (
            <section>
              <div className="w-full h-7 bg-slate-200 text-slate-700 flex items-center px-6 select-none drag-region">
                <div className="flex items-center justify-start gap-x-3 no-drag">
                  <div className={`${isConnected ? 'text-green-500' : 'text-red-400'} flex items-center justify-center gap-x-1`}>
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
                        />
                      </div>

                      {/* CHAT AREA */}
                      <div className="flex-1 flex flex-col">
                        {/* HEADER */}
                        <div className="h-17.5 bg-linear-to-t from-slate-50 to-slate-100">
                          <Headers
                            selectedFriendProfileId={selectedFriendProfileId}
                            userFullDetails={userFullDetails}
                          />
                        </div>

                        {/* BODY */}
                        <div className="flex-1 flex">
                          <Landing
                            selectedFriendProfileId={selectedFriendProfileId}
                            userFullDetails={userFullDetails}
                            getFriendList={getFriendList}
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

          <>
            {!isLoggedIn && (
              <>
                {showLogin ? (
                  <LoginUser setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />
                ) : (
                  <UserRegister setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />
                )}
              </>
            )}
          </>
        </section>
      )}
    </>
  )
}

export default Home
