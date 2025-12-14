import { useEffect, useState } from 'react'
import { SEARCH_FRIEND_URL } from '../../api/routes_urls'
import { axiosInstance } from '../../api/api'
import defaultUser from '../../assets/peoples/default_user.jpg'

const FriendsSection = ({ userId }) => {
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!searchText || searchText.length < 2) {
      setSuggestions([])
      return
    }

    const timeout = setTimeout(async () => {
      try {
        setSearching(true)
        const payload = {
          UserId : userId,
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
  }, [searchText])

  const sendFriendRequest = async(user)=>{
    console.log(user)
  }

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
    </>
  )
}

export default FriendsSection
