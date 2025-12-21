import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa'
import { MdOutlinePhotoCamera } from 'react-icons/md'
import banner from '../../assets/svgs/banner.svg'
import { axiosInstance } from '../../api/api'
import { REGISTER_USER_URL } from '../../api/routes_urls'
import toast from 'react-hot-toast'
import InputField from '../../reusables/input-fields/InputField'
import { REGEX } from '../../utils/regex'
import { uploadFile } from '../../utils/file-upload-to-server/uploadFile'
import { useChat } from '../../context/ChatContext'

const UserRegister = ({ setShowLogin, setIsLoggedIn  }) => {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [preview, setPreview] = useState(null)

  const {setRefresh} = useChat();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      let profileImageUrl = null

      if (profile) {
        const uploadRes = await uploadFile(profile)
        profileImageUrl = uploadRes.url
      }

      const payload = {
        FullName: data.fullName,
        Email: data.email,
        Mobile: data.phone,
        Password: data.password,
        ProfileImage: profileImageUrl
      }

      const res = await axiosInstance.post(REGISTER_USER_URL, payload)

      const accessToken = res?.data?.data?.accessToken
      const refreshToken = res?.data?.data?.refreshToken
      const userId = res?.data?.data?.userId

      if (res?.data?.success) {
        await window.store.set('accessToken', accessToken)
        await window.store.set('refreshToken', refreshToken)
        await window.store.set('userId', userId)
        // await window.store.set('user', {
        //   userId,
        //   fullName,
        //   email,
        //   profileImage

        // })

        setRefresh(prev => !prev);
        toast.success(res.data.message)
        setIsLoggedIn(true)
      }
    } catch (err) {
      if (err?.code == 'ERR_BAD_REQUEST') {
        toast.error(err?.response?.data?.data?.message || 'Server errror.')
      }
      if (err?.code == 'ERR_NETWORK') {
        toast.error(
          'Unable to register. Please ensure you are on the same local network as the server.'
        )
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-5">
      <div className="w-full max-w-5xl flex bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* LEFT */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-10">
          <img src={banner} className="w-80" />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-primary mb-6">Create Account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Full Name"
              name="fullName"
              icon={FaUser}
              placeholder="Enter full name"
              register={register}
              errors={errors}
              required
            />

            <InputField
              label="Email"
              name="email"
              icon={FaEnvelope}
              placeholder="Enter email"
              register={register}
              errors={errors}
              required
              regex={REGEX.EMAIL}
              regexMessage="Invalid email address"
            />

            <InputField
              label="Phone"
              name="phone"
              type="number"
              icon={FaPhone}
              placeholder="10-digit mobile number"
              register={register}
              errors={errors}
              required
              regex={REGEX.PHONE}
              regexMessage="Enter valid 10 digit number"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              icon={FaLock}
              placeholder="Create password"
              register={register}
              errors={errors}
              required
              regex={REGEX.PASSWORD}
              regexMessage="Min 6 chars, include number"
            />

            {/* Profile Upload */}

            {preview && <img src={preview} className="w-16 h-16 rounded-full object-cover mb-2" />}
            <div className="flex justify-between items-center border border-slate-300 p-3 rounded-lg bg-slate-50">
              <div>
                <p className="text-sm text-slate-600">Profile Picture</p>
                <p className="text-xs text-slate-400">JPG / PNG</p>
              </div>

              <label className="cursor-pointer">
                <MdOutlinePhotoCamera size={24} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    setProfile(file)
                    setPreview(URL.createObjectURL(file))
                  }}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition
                ${
                  loading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                }
              `}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <span
              onClick={() => setShowLogin(true)}
              className="font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
