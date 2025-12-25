import { useEffect, useState } from 'react'
import { GET_USER_DETAILS_URL } from '../../api/routes_urls'
import { axiosInstance } from '../../api/api'
import defaultUser from '../../assets/peoples/default_user.jpg'
import { formatDateWithSuffix } from '../../utils/dates/formateDateWithSuffic'
import FriendsSection from './FriendsSection'
import { viewUploadedFile } from '../../utils/file-upload-to-server/uploadFile'

const UserProfile = ({ trigger, getFriendList, friendSearchText }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = await window.store.get('userId')
        if (!userId) return

        setUserId(userId)

        const res = await axiosInstance.post(GET_USER_DETAILS_URL, { UserId: userId })
        setUser(res?.data?.data)
      } catch (err) {
        console.error('Failed to fetch profile', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [])

  if (loading) return <div className="p-6">Loading profile...</div>
  if (!user) return <div className="p-6 text-red-500">Failed to load profile</div>

  return (
    <div className="max-w-6xl mx-auto p-6 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PROFILE CARD */}
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={
                user?.profile_image
                  ? viewUploadedFile(user.profile_image)
                  : user?.avatar_url
                    ? viewUploadedFile(user.avatar_url)
                    : defaultUser
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.full_name}</h2>

          <p className="text-sm text-gray-500">@{user.username}</p>

          {/* <span
            className={`mt-3 px-4 py-1 rounded-full text-sm font-medium
              ${
                user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
          >
            {user.status}
          </span> */}
        </div>

        {/* RIGHT DETAILS PANEL */}
        <div className="lg:col-span-2 bg-white shadow rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-base font-medium text-gray-800">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Mobile Number</p>
              <p className="text-base font-medium text-gray-800">{user.mobile_no}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Joined on</p>
              <p className="text-base font-medium text-gray-800">
                {formatDateWithSuffix(user.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search friend and request */}
      <FriendsSection friendSearchText={friendSearchText} getFriendList={getFriendList} trigger={trigger} userId={userId} />
    </div>
  )
}

export default UserProfile
