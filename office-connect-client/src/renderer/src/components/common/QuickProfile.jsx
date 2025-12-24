import profilePic from '../../assets/peoples/default_user.jpg'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { viewUploadedFile } from '../../utils/file-upload-to-server/uploadFile'
import { formatLastSeen } from '../../utils/dates/formatLastSeen'

const QuickProfile = ({ toggleQuickProfile, setToggleQuickProfile, userFullDetails }) => {
  const isOnline = userFullDetails?.status === 'online'

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setToggleQuickProfile(false)}
        className={`fixed inset-0 z-40 transition-opacity duration-300
        ${toggleQuickProfile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* RIGHT SIDEBAR */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[30%] min-w-85 bg-white
        shadow-2xl transform transition-transform duration-300 ease-in-out
        ${toggleQuickProfile ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* HEADER */}
        <header className="sticky top-0 z-10 h-16 flex items-center justify-between px-5 border-b border-slate-200 bg-white">
          <h2 className="text-base font-semibold text-slate-800">Profile Information</h2>
          <button
            onClick={() => setToggleQuickProfile(false)}
            className="text-slate-400 hover:text-slate-700 transition"
          >
            <IoIosCloseCircleOutline size={26} />
          </button>
        </header>

        {/* BODY */}
        <div className="p-6 overflow-y-auto h-[calc(100%-4rem)]">
          {/* AVATAR */}
          <div className="flex flex-col items-center text-center">
            <div className={`relative p-1 rounded-full ${isOnline ? 'ring-4 ring-green-400' : 'ring-4 ring-slate-300'}`}>
              <img
                src={
                  userFullDetails?.profile_image
                    ? viewUploadedFile(userFullDetails.profile_image)
                    : userFullDetails?.avatar_url
                      ? viewUploadedFile(userFullDetails.avatar_url)
                      : profilePic
                }
                alt="User"
                className="w-32 h-32 rounded-full object-cover bg-slate-100"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900 capitalize">
              {userFullDetails?.full_name}
            </h3>

            <p className="text-sm text-slate-500">@{userFullDetails?.username}</p>

            {/* STATUS */}
            <span
              className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
              ${isOnline ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
            >
              <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
              {isOnline ? 'Online' : `Last seen ${formatLastSeen(userFullDetails?.last_seen) || 'recently'}`}
            </span>
          </div>

          {/* DIVIDER */}
          <div className="my-6 border-t border-slate-200" />

          {/* DETAILS */}
          <div className="space-y-4">
            <InfoItem label="Email" value={userFullDetails?.email} />
            <InfoItem label="Phone" value={userFullDetails?.mobile_no || '—'} />
          </div>
        </div>
      </aside>
    </>
  )
}

const InfoItem = ({ label, value }) => (
  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-sm font-medium text-slate-800 mt-1 break-all">{value}</p>
  </div>
)

export default QuickProfile
