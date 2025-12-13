import profilePic from '../../assets/peoples/default_user.jpg'
import { IoIosCloseCircleOutline } from 'react-icons/io'

const QuickProfile = ({ toggleQuickProfile, setToggleQuickProfile }) => {
  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setToggleQuickProfile(false)}
        className={`
          fixed inset-0 z-40
          transition-opacity duration-300
          ${toggleQuickProfile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* RIGHT SIDEBAR */}
      <div
        className={`
          fixed top-7 right-0 h-full w-[30%] min-w-[320px] bg-ternary z-50
          shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${toggleQuickProfile ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* HEADER */}
        <div className="h-[70px] border-b border-slate-200 flex items-center  gap-x-2 px-4">
          <button
            className="text-slate-500 hover:text-slate-800"
            onClick={() => setToggleQuickProfile(false)}
          >
            <IoIosCloseCircleOutline size={22} />
          </button>
          <h2 className="text-lg text-slate-800">Profile Information</h2>
        </div>

        {/* BODY */}
        <div className="p-6 flex flex-col items-center text-center">
          <img
            src={profilePic}
            alt="User"
            className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-sm"
          />

          <h3 className="mt-4 text-xl font-semibold text-slate-900">Sailendra</h3>

          <p className="mt-1 text-sm text-green-600 font-medium">Online</p>

          <div className="w-full my-6 border-t border-slate-200" />

          <div className="w-full text-left space-y-4">
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm text-slate-800">sailendra@office.local</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">About</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Building Office Connect for local LAN communication 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuickProfile
