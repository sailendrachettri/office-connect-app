import profilePic from '../../../assets/peoples/default_user.jpg'

const Sidebar = ({ setSelectedFriendProfileId, friendList }) => {

  return (
    <div className="w-full h-full flex flex-col bg-white pb-10">
      {/* Title */}
      <h2 className="text-xl font-semibold px-4 py-4.75 border-b border-slate-200 text-primary">
        Office Connect
      </h2>

      {/* Search */}
      <div className="px-1 py-3 border-b border-slate-200">
        <input
          type="text"
          placeholder="Search here"
          className="w-full px-3 py-2 border rounded-lg border-slate-200 text-slate-500 bg-slate-50 focus:outline-none focus:ring-primary outline-none"
        />
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto custom-scroll">
        {friendList?.length == 0 ? (
          <div>No friends found</div>
        ) : (
          <div>
            {friendList?.map((user) => (
              <div
                key={user.user_id}
                onClick={() => {
                  setSelectedFriendProfileId(user?.user_id)
                }}
                className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-gray-100"
              >
                {/* Image */}
                <img src={user?.profile_image ||  profilePic} alt="" className="w-12 h-12 rounded-full object-cover" />

                {/* Name + Last Message */}
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{user.full_name}</div>
                  <div className="text-sm text-slate-500 truncate w-[180px]">{user.lastMsg}</div>
                </div>

                {/* Time + Unread */}
                <div className="text-right">
                  <div className="text-xs text-slate-500">{user.time}</div>

                  {user.unread > 0 && (
                    <div className="mt-1 bg-primary text-white text-xs px-2 py-[2px] rounded-full inline-block">
                      {user.unread}
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
