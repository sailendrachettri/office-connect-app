import profilePic from "../../../assets/peoples/default_user.jpg";


const Sidebar = () => {
  const people = [
    {
      id: 1,
      name: "Sailendra",
      lastMsg: "Hey, are you coming today?",
      time: "3 mins ago",
      unread: 2,
      image: profilePic
    },
    {
      id: 2,
      name: "Rahul Sharma",
      lastMsg: "Let's meet at 5 PM.",
      time: "10 mins ago",
      unread: 0,
      image: profilePic
    },
    {
      id: 3,
      name: "Priya Das",
      lastMsg: "Sure, I'll send it.",
      time: "1 hr ago",
      unread: 1,
      image: profilePic
    }
  ]

  return (
    <div className="w-full h-full flex flex-col bg-white">

      {/* Title */}
      <h2 className="text-xl font-semibold px-4 py-4.75 border-b border-slate-200 text-primary">
        Office Connect
      </h2>

      {/* Search */}
      <div className="p-3 border-b">
        <input
          type="text"
          placeholder="Search here"
          className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:bg-white focus:ring focus:ring-blue-300 outline-none"
        />
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">

        {people.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-4 py-3 border-b cursor-pointer hover:bg-gray-100"
          >
            {/* Image */}
            <img
              src={user.image}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />

            {/* Name + Last Message */}
            <div className="flex-1">
              <div className="font-medium text-slate-900">{user.name}</div>
              <div className="text-sm text-slate-500 truncate w-[180px]">
                {user.lastMsg}
              </div>
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

    </div>
  )
}

export default Sidebar
