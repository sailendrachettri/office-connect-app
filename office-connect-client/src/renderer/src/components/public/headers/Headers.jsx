import  { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import profilePic from '../../../assets/peoples/default_user.jpg'
import QuickProfile from '../../common/QuickProfile'

const Headers = () => {
   const [toggleQuickProfile, setToggleQuickProfile] = useState(false)

  return (
    <>
      <div className="w-full h-full flex items-center justify-between px-4 bg-white ">
        {/* LEFT: Profile & User Info */}
        <div className="flex items-center gap-3">
          {/* Profile Image */}
          <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full object-cover" />

          {/* Chat Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Sailendra</h3>
            <p className="text-sm text-green-600">Online</p>
          </div>
        </div>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-5 text-slate-600 text-xl">
          <button className="hover:text-slate-900 transition">
            <IoSearch />
          </button>

          <button className="hover:text-slate-900 transition cursor-pointer">
            <IoInformationCircleOutline
              size={22}
              onClick={() => {
                setToggleQuickProfile((prev) => !prev)
              }}
            />
          </button>

          <button className="hover:text-slate-900 transition">
            <HiOutlineDotsVertical />
          </button>
        </div>
      </div>

      <QuickProfile toggleQuickProfile={toggleQuickProfile} setToggleQuickProfile={setToggleQuickProfile}  />
    </>
  )
}

export default Headers
