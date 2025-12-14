import { useEffect, useState } from 'react'
import {
  CANCEL_FRIEND_REQUEST_URL ,
  GET_FRIEND_LIST_URL,
  SEARCH_FRIEND_URL,
  SEND_FRIEND_REQUEST_URL
} from '../../api/routes_urls'
import { axiosInstance, axiosPrivate } from '../../api/api'
import defaultUser from '../../assets/peoples/default_user.jpg'
import toast from 'react-hot-toast'

const FriendsSection = ({ userId }) => {
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('FRIEND')
  const [friendList, setFriendList] = useState([])
  const [refreshPage, setRefreshPage] = useState(false);

  const sendFriendRequest = async (user) => {
    try {
      const payload = {
        ReceiverId: user?.user_id
      }
      const res = await axiosPrivate.post(SEND_FRIEND_REQUEST_URL, payload)
      console.log(res)
      if (res?.data?.success == true) {
        toast.success(res?.data?.message || 'Friend request sent!')
      }
      setSearchText('')
    } catch (error) {
      console.error('not able to send friend request')
      toast.error(res?.data?.message || 'Something went wrong!')
    }finally{
      setRefreshPage(prev => !prev);
    }
  }

  const filteredList = friendList.filter((item) => 
    item.relation_status === activeTab
  )

  const handleCancleFreindRequest = async(frienduserId)=>{
   try {
     const payload = {
       ReceiverId: frienduserId
     }
     const res = await axiosPrivate.post(CANCEL_FRIEND_REQUEST_URL , payload);
     if(res?.data?.success == true){
      toast.success(res?.data?.message || '');
     }
   } catch (error) {
    console.error("not able to cancle friend request", error);
   }finally{
    setRefreshPage(prev => !prev);
   }
  }

  useEffect(() => {
    if (!searchText || searchText.length < 2) {
      setSuggestions([])
      return
    }

    const timeout = setTimeout(async () => {
      try {
        setSearching(true)
        const payload = {
          UserId: userId,
          SearchText: searchText
        }
        const res = await axiosInstance.post(SEARCH_FRIEND_URL, payload)
        console.log('rr', res)
        setSuggestions(res?.data?.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setSearching(false)
      }
    }, 400) // debounce

    return () => clearTimeout(timeout)
  }, [searchText, refreshPage])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await axiosPrivate.get(GET_FRIEND_LIST_URL)
        // console.log(res)
        if (res?.data?.success == true) {
          setFriendList(res?.data?.data || [])
          // console.log({ friendList })
        }
      } catch (error) {
        console.error('not able to get the friend list', error)
      }
    })()
  }, [refreshPage])

  return (
    <>
      {/* SEARCH FRIEND SECTION */}

      <div className="mt-10 bg-white shadow rounded-2xl p-6 relative">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Friend</h3>

        <input
          type="text"
          placeholder="Search by username, full name or phone no."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full border rounded-xl px-4 py-2 outline-none focus:outline-none focus:ring-slate-200 border-slate-200"
        />

        {/* AUTOCOMPLETE DROPDOWN */}
        {searchText && (
          <div className="absolute z-20 w-[68vw] bg-white border border-slate-200 rounded-xl mt-2 max-h-72 overflow-y-auto shadow-lg">
            {searching && <div className="p-4 text-gray-400">Searching...</div>}

            {!searching && suggestions.length === 0 && (
              <div className="p-4 text-gray-400">No users found</div>
            )}

            {!searching &&
              suggestions.map((u, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 hover:bg-slate-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.profile_image || defaultUser}
                      className="w-10 h-10 rounded-full object-cover"
                      alt=""
                    />

                    <div>
                      <p className="font-medium text-gray-800">{u.full_name}</p>
                      <p className="text-sm text-gray-500">@{u.username}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => sendFriendRequest(u)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <div>
        {/* Tabs */}

        <div>
          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-full justify-around mt-7">
            {['FRIEND', 'PENDING_RECEIVED', 'PENDING_SENT'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition
        ${
          activeTab === tab ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
              >
                {tab === 'FRIEND' && 'Friends'}
                {tab === 'PENDING_RECEIVED' && 'Pending'}
                {tab === 'PENDING_SENT' && 'Sent'}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            {filteredList?.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-6">No users found</p>
            )}

            {filteredList?.map((user) => (
              <div
                key={user?.user_id}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user?.profile_image || defaultUser}
                    alt={user?.full_name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">{user?.full_name}</p>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  {activeTab === 'FRIEND' && (
                    <button className="text-sm text-red-500 hover:underline">Remove</button>
                  )}

                  {activeTab === 'PENDING_RECEIVED' && (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg">
                        Accept
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-200 rounded-lg">Reject</button>
                    </div>
                  )}

                  {activeTab === 'PENDING_SENT' && (
                    <div className='gap-x-6 flex items-center justify-center flex-row'>
                      <button onClick={()=> {handleCancleFreindRequest(user?.user_id)}} className="text-sm  bg-red-100 px-3 py-1 text-red-500 rounded-md">Cancle</button>
                    {/* <button className="text-sm text-gray-500">Pending</button> */}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default FriendsSection
