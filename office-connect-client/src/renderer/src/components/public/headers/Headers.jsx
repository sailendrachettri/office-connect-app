import { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import profilePic from '../../../assets/peoples/default_user.jpg'
import QuickProfile from '../../common/QuickProfile'

const people = [
  {
    id: 1,
    name: 'Sailendra',
    lastMsg: 'Hey, are you coming today?',
    time: '3 mins ago',
    unread: 2,
    status: 'Last seen at 09:00 AM',
    image: profilePic
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    lastMsg: "Let's meet at 5 PM.",
    time: '10 mins ago',
    unread: 0,
    status: 'Last seen at 06:00 AM',
    image: profilePic
  },
  {
    id: 3,
    name: 'Priya Das',
    lastMsg: "Sure, I'll send it.",
    time: '1 hr ago',
    unread: 1,
    status: 'Last seen at 10:00 AM',
    image: profilePic
  },
  {
    id: 4,
    name: 'Amit Verma',
    lastMsg: 'Did you check the document?',
    time: '2 hrs ago',
    unread: 0,
    status: 'Last seen at 11:00 AM',
    image: profilePic
  },
  {
    id: 5,
    name: 'Neha Singh',
    lastMsg: 'Okay 👍',
    time: '3 hrs ago',
    unread: 3,
    status: 'Online',
    image: profilePic
  },
  {
    id: 6,
    name: 'Rohit Mehta',
    lastMsg: "I'll call you later.",
    time: 'Yesterday',
    unread: 0,
    status: 'Online',
    image: profilePic
  },
  {
    id: 7,
    name: 'Anjali Gupta',
    lastMsg: 'Meeting postponed.',
    time: 'Yesterday',
    unread: 1,
    status: 'Last seen at 19:00 PM',
    image: profilePic
  },
  {
    id: 8,
    name: 'Karan Malhotra',
    lastMsg: 'Done ✔️',
    time: 'Yesterday',
    unread: 0,
    status: 'Online',
    image: profilePic
  },
  {
    id: 9,
    name: 'Pooja Nair',
    lastMsg: 'Please review once.',
    time: '2 days ago',
    unread: 2,
    status: 'Online',
    image: profilePic
  },
  {
    id: 10,
    name: 'Arjun Patel',
    lastMsg: 'Sounds good!',
    time: '2 days ago',
    unread: 0,
    status: 'Last seen at 14:00 PM',
    image: profilePic
  },
  {
    id: 11,
    name: 'Sneha Kulkarni',
    lastMsg: 'Shared the files.',
    time: '3 days ago',
    unread: 0,
    status: 'Online',
    image: profilePic
  },
  {
    id: 12,
    name: 'Vikram Rao',
    lastMsg: "Let's discuss tomorrow.",
    time: '3 days ago',
    unread: 1,
    status: 'Online',
    image: profilePic
  },
  {
    id: 13,
    name: 'Nikita Joshi',
    lastMsg: 'Thanks!',
    time: '4 days ago',
    unread: 0,
    status: 'Online',
    image: profilePic
  },
  {
    id: 14,
    name: 'Suresh Kumar',
    lastMsg: 'Please update me.',
    time: '4 days ago',
    unread: 2,
    status: 'Online',
    image: profilePic
  },
  {
    id: 15,
    name: 'Riya Chatterjee',
    lastMsg: 'Will do 🙂',
    time: '5 days ago',
    unread: 0,
    status: 'Online',
    image: profilePic
  },
  {
    id: 16,
    name: 'Manish Pandey',
    lastMsg: 'Any update?',
    time: '5 days ago',
    unread: 1,
    status: 'Online',
    image: profilePic
  },
  {
    id: 17,
    name: 'Alok Mishra',
    lastMsg: 'Check your email.',
    time: '1 week ago',
    unread: 0,
    status: 'Online',
    image: profilePic
  },
  {
    id: 18,
    name: 'Swati Bansal',
    lastMsg: 'Got it, thanks.',
    time: '1 week ago',
    unread: 0,
    status: 'Online',
    image: profilePic
  },
  {
    id: 19,
    name: 'Deepak Yadav',
    lastMsg: 'Call me when free.',
    time: '1 week ago',
    unread: 2,
    status: 'Online',
    image: profilePic
  },
  {
    id: 20,
    name: 'Kavita Iyer',
    lastMsg: 'Noted.',
    time: '1 week ago',
    unread: 0,
    status: 'Online',
    image: profilePic
  }
]

const Headers = ({ userFullDetails }) => {
  const [toggleQuickProfile, setToggleQuickProfile] = useState(false)
  console.log({ userFullDetails })

  return (
    <>
      {userFullDetails?.user_id && (
        <div className="w-full h-full flex items-center justify-between px-4  bg-white border-b border-slate-200 shadow-sm ">
          {/* LEFT: Profile & User Info */}
          <div className="flex items-center gap-3">
            {/* Profile Image */}
            <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full object-cover" />

            {/* Chat Details */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{userFullDetails?.full_name}</h3>
              <p className="text-sm text-green-600">{userFullDetails?.status}</p>
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
      )}

      <QuickProfile
        toggleQuickProfile={toggleQuickProfile}
        setToggleQuickProfile={setToggleQuickProfile}
      />
    </>
  )
}

export default Headers
