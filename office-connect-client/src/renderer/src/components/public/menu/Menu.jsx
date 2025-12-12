import { useState } from 'react'
import { BsChatLeftDots } from 'react-icons/bs'
import { IoSettingsOutline } from 'react-icons/io5'
import { IoPowerOutline } from 'react-icons/io5'

const Menu = ({setShowLogin, setIsLoggedIn}) => {
  const [open, setOpen] = useState(false);

  const handleLogout = ()=>{
    setShowLogin(true);
    setIsLoggedIn(false);
  }

  return (
    <div className="fixed left-1 top-10 bottom-5 flex flex-col justify-between">
      {/* Chat icon (top-left) */}
      <div className="rounded-full bg-slate-100 p-4 text-slate-600 cursor-pointer hover:bg-slate-200 transition">
        <BsChatLeftDots size={22} />
      </div>

      {/* Bottom-left section (settings + popup modal) */}
      <div className="relative">
        {/* Settings icon */}
        <div
          onClick={() => setOpen(!open)}
          className="rounded-full bg-slate-100 p-4 text-slate-600 cursor-pointer hover:bg-slate-200 transition"
        >
          <IoSettingsOutline size={22} />
        </div>

        {/* Popup menu */}
        {open && (
          <div className="absolute bottom-16 left-3 bg-white shadow-lg border border-slate-200 rounded-lg w-40 p-2">
            <ul className="text-slate-700">
              <li onClick={()=> handleLogout()} className="p-2 hover:bg-slate-100 rounded cursor-pointer text-red-500 flex items-center  gap-x-1 flex-nowrap">
                <IoPowerOutline size={20} /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu
