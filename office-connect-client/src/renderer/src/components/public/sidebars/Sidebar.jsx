import profilePic from '../../../assets/peoples/default_user.jpg'
import { useChat } from '../../../context/ChatContext'
import { getTime24FromDate } from '../../../utils/dates/getTime24FromDate'
import { viewUploadedFile } from '../../../utils/file-upload-to-server/uploadFile'

const Sidebar = ({ setSelectedTab, friendList, setFriendSearchText }) => {
  const { selectedFriendProfileId, setSelectedFriendProfileId, isFriendTyping } = useChat()

  return (
    <div className="w-full h-full flex flex-col bg-white pb-10">
      {/* Title */}
      <h2 className="text-xl font-semibold px-4 py-4.75 border-b border-slate-200 text-primary">
        Office Connect
      </h2>

      {/* Search */}
      <div className="px-1 py-3 border-b border-slate-200">
        <input
          onChange={(e) => setFriendSearchText(e.target.value)}
          type="text"
          placeholder="Search here"
          className="w-full px-3 py-2 border rounded-lg border-slate-200 text-slate-500 bg-slate-50 focus:outline-none focus:ring-primary outline-none"
        />
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto custom-scroll">
        {friendList?.length == 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-sm px-6">
              <div className="mb-3 text-lg font-semibold text-gray-700">No friends found</div>

              <p className="mb-5 text-sm text-gray-500">
                Add a friend to start chatting and sharing messages.
              </p>

              <button
                onClick={() => setSelectedTab('profile')}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400
                 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                Add friends
              </button>
            </div>
          </div>
        ) : (
          <div className="me-1">
            {friendList?.map((user) => (
              <div
                key={user?.user_id}
                onClick={() => {
                  setSelectedFriendProfileId(user?.user_id)
                }}
                className={`${selectedFriendProfileId == user?.user_id ? 'bg-gray-100' : 'bg-white'} flex rounded-md my-1 hover:bg-gray-50 items-center gap-3 px-4 py-3 border-b border-slate-200 cursor-pointer`}
              >
                {/* Image */}
                <img
                  src={
                    user?.profile_image
                      ? viewUploadedFile(user.profile_image)
                      : user?.avatar_url
                        ? viewUploadedFile(user.avatar_url)
                        : profilePic
                  }
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />

                {/* Name + Last Message */}
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{user?.full_name}</div>
                  <div className="text-sm text-slate-500 truncate w-45">
                    {selectedFriendProfileId == user?.user_id && isFriendTyping
                      ? 'Typing...'
                      : user?.last_message?.message_text}
                  </div>
                </div>

                {/* Time + Unread */}
                <div className="text-right">
                  <div className="text-xs text-slate-500">
                    {user?.last_message?.created_at &&
                      getTime24FromDate(user?.last_message?.created_at)}
                  </div>

                  {user?.unread_count > 0 && (
                    <div className="mt-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full inline-block">
                      {user?.unread_count}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
