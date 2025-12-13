import profilePic from "../../../assets/peoples/default_user.jpg";


const Sidebar = ({setSelectedUsersProfileId}) => {
 const people = [
  {
    id: 1,
    name: "Sailendra",
    lastMsg: "Hey, are you coming today?",
    time: "3 mins ago",
    unread: 2,
    image: profilePic,
  },
  {
    id: 2,
    name: "Rahul Sharma",
    lastMsg: "Let's meet at 5 PM.",
    time: "10 mins ago",
    unread: 0,
    image: profilePic,
  },
  {
    id: 3,
    name: "Priya Das",
    lastMsg: "Sure, I'll send it.",
    time: "1 hr ago",
    unread: 1,
    image: profilePic,
  },
  {
    id: 4,
    name: "Amit Verma",
    lastMsg: "Did you check the document?",
    time: "2 hrs ago",
    unread: 0,
    image: profilePic,
  },
  {
    id: 5,
    name: "Neha Singh",
    lastMsg: "Okay 👍",
    time: "3 hrs ago",
    unread: 3,
    image: profilePic,
  },
  {
    id: 6,
    name: "Rohit Mehta",
    lastMsg: "I'll call you later.",
    time: "Yesterday",
    unread: 0,
    image: profilePic,
  },
  {
    id: 7,
    name: "Anjali Gupta",
    lastMsg: "Meeting postponed.",
    time: "Yesterday",
    unread: 1,
    image: profilePic,
  },
  {
    id: 8,
    name: "Karan Malhotra",
    lastMsg: "Done ✔️",
    time: "Yesterday",
    unread: 0,
    image: profilePic,
  },
  {
    id: 9,
    name: "Pooja Nair",
    lastMsg: "Please review once.",
    time: "2 days ago",
    unread: 2,
    image: profilePic,
  },
  {
    id: 10,
    name: "Arjun Patel",
    lastMsg: "Sounds good!",
    time: "2 days ago",
    unread: 0,
    image: profilePic,
  },
  {
    id: 11,
    name: "Sneha Kulkarni",
    lastMsg: "Shared the files.",
    time: "3 days ago",
    unread: 0,
    image: profilePic,
  },
  {
    id: 12,
    name: "Vikram Rao",
    lastMsg: "Let's discuss tomorrow.",
    time: "3 days ago",
    unread: 1,
    image: profilePic,
  },
  {
    id: 13,
    name: "Nikita Joshi",
    lastMsg: "Thanks!",
    time: "4 days ago",
    unread: 0,
    image: profilePic,
  },
  {
    id: 14,
    name: "Suresh Kumar",
    lastMsg: "Please update me.",
    time: "4 days ago",
    unread: 2,
    image: profilePic,
  },
  {
    id: 15,
    name: "Riya Chatterjee",
    lastMsg: "Will do 🙂",
    time: "5 days ago",
    unread: 0,
    image: profilePic,
  },
  {
    id: 16,
    name: "Manish Pandey",
    lastMsg: "Any update?",
    time: "5 days ago",
    unread: 1,
    image: profilePic,
  },
  {
    id: 17,
    name: "Alok Mishra",
    lastMsg: "Check your email.",
    time: "1 week ago",
    unread: 0,
    image: profilePic,
  },
  {
    id: 18,
    name: "Swati Bansal",
    lastMsg: "Got it, thanks.",
    time: "1 week ago",
    unread: 0,
    image: profilePic,
  },
  {
    id: 19,
    name: "Deepak Yadav",
    lastMsg: "Call me when free.",
    time: "1 week ago",
    unread: 2,
    image: profilePic,
  },
  {
    id: 20,
    name: "Kavita Iyer",
    lastMsg: "Noted.",
    time: "1 week ago",
    unread: 0,
    image: profilePic,
  },
];


  return (
    <div className="w-full h-full flex flex-col bg-white">

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

        {people.map((user) => (
          <div
            key={user.id}
            onClick={()=>{setSelectedUsersProfileId(user?.id)}}
            className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-gray-100"
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
