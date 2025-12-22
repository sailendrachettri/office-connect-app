import  { useState } from 'react'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import banner from '../../assets/svgs/banner_login.svg'
import { REGEX } from '../../utils/regex'
import InputField from '../../reusables/input-fields/InputField'
import { useForm } from 'react-hook-form'
import { axiosInstance } from '../../api/api'
import { LOGIN_USER_URL } from '../../api/routes_urls'
import toast from 'react-hot-toast'
import { IoExitOutline } from 'react-icons/io5'
import { useChat } from '../../context/ChatContext'

const LoginUser = ({ setShowLogin, setIsLoggedIn  }) => {
  const [loading, isLoading] = useState(false)
  const {setRefresh} = useChat();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const handlLogin = async (data) => {
    try {
      isLoading(true)

      const payload = {
        Email: data?.email,
        Password: data?.password
      }

      const res = await axiosInstance.post(LOGIN_USER_URL, payload)

      const accessToken = res?.data?.data?.accessToken
      const refreshToken = res?.data?.data?.refreshToken
      const userId = res?.data?.data?.userId

      if (res?.data?.success) {
        await window.store.set('accessToken', accessToken)
        await window.store.set('refreshToken', refreshToken)
        await window.store.set('userId', userId)
        await window.store.set('user', {
          userId,
          fullName,
          email,
          profileImage

        })
        setRefresh(prev => !prev);
        setTimeout(() => {
          isLoading(false)
          setIsLoggedIn(true)
          toast.success('Login successful!')
        }, 1000)
      } else {
        toast.error('Please enter a valid credentials')
      }
    } catch (error) {
      if (error?.code == 'ERR_NETWORK') {
        toast.error(
          'Unable to connect. Please ensure you are on the same local network as the server.'
        )
      } else if (error?.response?.data?.success == false) {
        toast.error('Please enter a valid credentials')
      }
      console.error('Invalid credentials', error)
    } finally {
      setTimeout(() => {
        isLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-5">
      <div className="w-full max-w-5xl flex bg-ternary rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* LEFT SIDE SVG */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-10">
          <img src={banner} alt="Banner" className="w-80 drop-shadow-xl scale-x-[-1]" />
        </div>

        {/* RIGHT SIDE LOGIN FORM */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          <h2 className="text-3xl font-semibold text-primary mb-3">Welcome Back</h2>
          <p className="text-slate-500 mb-6 text-sm">Login to access your messaging dashboard.</p>

          <form onSubmit={handleSubmit(handlLogin)} className="flex flex-col gap-4">
            {/* Email */}

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

            {/* Password */}

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

            {/* Forgot Password */}
            <div className="text-right">
              <span className="text-slate-600 text-sm hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`w-full ${loading ? 'bg-slate-400 text-slate-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'}  py-3 rounded-lg  transition font-medium shadow`}
            >
              {loading ? 'Logging you in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Don’t have an account?{' '}
            <span
              onClick={() => {
                setShowLogin(false)
                setIsLoggedIn(false)
              }}
              className="text-slate-800 font-medium cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>

      <section className="pt-7">
        <div
          className="text-slate-400 cursor-pointer w-fit hover:text-red-400 flex items-center justify-center gap-x-2 flex-nowrap"
          onClick={() => window.api.close()}
        >
          <IoExitOutline size={23} />

          <span> Exit App</span>
        </div>
      </section>
    </div>
  )
}

export default LoginUser
