import { useEffect, useState } from 'react'
import Menu from '../menu/Menu'
import Sidebar from '../sidebars/Sidebar'
import Headers from '../headers/Headers'
import Landing from '../landing-page/Landing'
import UserProfile from '../../common/UserProfile'
import { axiosInstance } from '../../../api/api'
import { GET_USER_DETAILS_URL } from '../../../api/routes_urls'
import { useChat } from '../../../context/ChatContext'
import AdminCms from '../../admins/admin-cms/AdminCms'

const Home = ({ isLoggedIn, setIsLoggedIn, setShowLogin, friendList, getFriendList, pendingFriendReq }) => {
  const [userFullDetails, setUserFullDetails] = useState({})
  const [selectedTab, setSelectedTab] = useState('chat')

  const { selectedFriendProfileId } = useChat()

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
            <section className="w-screen h-[calc(100vh-28px)] overflow-hidden bg-gray-100 flex">
              {/* LEFT VERTICAL MENU — COMMON */}
              <div className="w-12.5 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 gap-6">
                <Menu
                  setShowLogin={setShowLogin}
                  setIsLoggedIn={setIsLoggedIn}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  pendingFriendReq={pendingFriendReq}
                />
              </div>

              {/* RIGHT SIDE — CHANGES BASED ON TAB */}
              <div className="flex-1 flex">
                {/*  CHAT TAB  */}
                {selectedTab === 'chat' && (
                  <>
                    {/* CHAT LIST */}
                    <div className="w-105 bg-white border-r border-slate-200 p-1">
                      <Sidebar friendList={friendList} />
                    </div>

                    {/* CHAT AREA */}
                    <div className="flex-1 flex flex-col">
                      {/* HEADER */}
                      <div className="h-17.5 bg-linear-to-t from-slate-50 to-slate-100">
                        <Headers  userFullDetails={userFullDetails} />
                      </div>

                      {/* BODY */}
                      <div className="flex-1 flex">
                        <Landing />
                      </div>
                    </div>
                  </>
                )}

                {/*  PROFILE TAB  */}
                {selectedTab === 'profile' && (
                  <div className="flex-1 flex flex-col ">
                    {/* HEADER */}
                    <div className="h-17.5 bg-white border-b border-slate-200 shadow-sm px-4 flex items-center">
                      Profile
                    </div>

                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto bg-white custom-scroll">
                      <UserProfile getFriendList={getFriendList} />
                    </div>
                  </div>
                )}

                {/*  ADMIN CMS  */}
                {selectedTab === 'admin-cms' && (
                  <div className="flex-1 flex flex-col ">
                    {/* HEADER */}
                    <div className="h-17.5 bg-white border-b border-slate-200 shadow-sm px-4 flex items-center">
                      Admin - Content Management System
                    </div>

                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto bg-white custom-scroll">
                     <AdminCms />
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
