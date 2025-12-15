import { useState } from 'react'
import { BsChatLeftDots } from 'react-icons/bs'
import { IoSettingsOutline } from 'react-icons/io5'
import { IoPowerOutline } from 'react-icons/io5'
import { FaRegUser } from 'react-icons/fa6'
import { axiosInstance } from '../../../api/api'
import { LOGOUT_URL } from '../../../api/routes_urls'
import toast from 'react-hot-toast'

const Menu = ({ setShowLogin, setIsLoggedIn, selectedTab, setSelectedTab, pendingFriendReq }) => {
  const [open, setOpen] = useState(false)

 const handleLogout = async () => {
  try {
    const refreshToken = await window.store.get('refreshToken');
    const payload = { RefreshToken: refreshToken };

    const res = await axiosInstance.post(LOGOUT_URL, payload);

    if (res?.data?.success) {
      toast.success(res?.data?.message || 'Logged out!');
    }

    await window.store.clear();
    setShowLogin(true);
    setIsLoggedIn(false);
  } catch (error) {
    console.error('Not able to logout', error);
  }
}


  // console.log(selectedTab)

  return (
    <div className="fixed left-2 top-10 bottom-5 flex flex-col justify-between">
      <div>
        {/* Chats */}
        <div
          onClick={() => {
            setSelectedTab('chat')
          }}
          className={`${selectedTab == 'chat' ? 'bg-ternary' : 'bg-slate-100'} rounded-full  p-2 text-slate-600 cursor-pointer hover:bg-ternary transition`}
        >
          <BsChatLeftDots size={17} />
        </div>

        {/* User profile */}
        <div onClick={() => setSelectedTab('profile')} className="relative mt-6 cursor-pointer">
          {/* Notification badge */}
          {pendingFriendReq > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-semibold text-white bg-red-500 rounded-full">
              {pendingFriendReq}
            </span>
          )}

          {/* Circle with icon */}
          <div
            className={`rounded-full p-2 text-slate-600 transition ${
              selectedTab === 'profile' ? 'bg-ternary' : 'bg-slate-100'
            } hover:bg-ternary`}
          >
            <FaRegUser size={17} />
          </div>
        </div>
      </div>

      {/* Bottom-left section (settings + popup modal) */}
      <div className="relative">
        {/* Settings icon */}
        <div
          onClick={() => {
            setOpen(!open)
          }}
          className={`rounded-full p-2 mt-6  text-slate-600 cursor-pointer hover:bg-ternary transition`}
        >
          <IoSettingsOutline size={17} />
        </div>

        {/* Popup menu */}
        {open && (
          <div className="absolute bottom-16 left-3 bg-white shadow-lg border border-slate-200 rounded-lg w-40 p-2">
            <ul className="text-slate-700">
              <li
                onClick={() => handleLogout()}
                className="p-2 hover:bg-slate-100 rounded cursor-pointer text-red-500 flex items-center  gap-x-1 flex-nowrap"
              >
                <IoPowerOutline size={17} /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu
