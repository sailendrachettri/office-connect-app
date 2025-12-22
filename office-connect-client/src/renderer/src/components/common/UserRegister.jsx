import { useEffect, useState } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowRight, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa'
import { MdOutlinePhotoCamera } from 'react-icons/md'
import banner from '../../assets/svgs/banner.svg'
import { axiosInstance } from '../../api/api'
import { GET_AVATAR_URL, REGISTER_USER_URL } from '../../api/routes_urls'
import toast from 'react-hot-toast'
import { uploadFile, viewUploadedFile } from '../../utils/file-upload-to-server/uploadFile'
import { useChat } from '../../context/ChatContext'

// Custom Input Field Component (moved outside to prevent re-creation)
const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, value, error, onChange, isPassword = false }) => {
  const [showPassword, setShowPassword] = useState(false)
  
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
            error ? 'border-red-500' : 'border-slate-300'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const UserRegister = ({ setShowLogin, setIsLoggedIn }) => {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [avatars, setAvatars] = useState([])
  const [selectedAvatarId, setSelectedAvatarId] = useState(null)
  
  // Store form data across steps
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  })

  const [errors, setErrors] = useState({})

  const { setRefresh } = useChat()

  // Validation regex patterns
  const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*\d).{6,}$/,
    PHONE: /^[0-9]{10}$/
  }

  // Validate step 1
  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!REGEX.EMAIL.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!REGEX.PASSWORD.test(formData.password)) {
      newErrors.password = 'Min 6 chars, include number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      toast.error('Passwords do not match!')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate step 2
  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone is required'
    } else if (!REGEX.PHONE.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10 digit number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Handle Next button for Step 1
  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  // Handle Back button
  const handleBack = () => {
    setCurrentStep(1)
  }

  // Final form submission
  const handleSubmit = async () => {
    if (!validateStep2()) return

    setLoading(true)

    try {
      let profileImageUrl = null
      let avatarId = null

      // If user uploaded custom image
      if (profile) {
        const uploadRes = await uploadFile(profile)
        profileImageUrl = uploadRes.url
      }

      // If avatar selected
      if (selectedAvatarId && !profile) {
        avatarId = selectedAvatarId
      }

      const payload = {
        FullName: formData.fullName,
        Email: formData.email,
        Mobile: formData.phone,
        Password: formData.password,
        ProfileImage: profileImageUrl,
        AvatarId: avatarId
      }

      const res = await axiosInstance.post(REGISTER_USER_URL, payload)

      const { accessToken, refreshToken, userId } = res?.data?.data || {}

      if (res?.data?.success) {
        await window.store.set('accessToken', accessToken)
        await window.store.set('refreshToken', refreshToken)
        await window.store.set('userId', userId)

        setRefresh((prev) => !prev)
        toast.success(res.data.message)
        setIsLoggedIn(true)
      }
    } catch (err) {
      if (err?.code === 'ERR_BAD_REQUEST') {
        toast.error(err?.response?.data?.data?.message || 'Server error.')
      }
      if (err?.code === 'ERR_NETWORK') {
        toast.error('Unable to register. Please ensure server is reachable.')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(GET_AVATAR_URL)
        setAvatars(res?.data?.data || [])
      } catch (error) {
        console.error('not able to get avatars', error)
      }
    })()
  }, [])

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-5">
      <div className="w-full max-w-5xl flex bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* LEFT */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-10">
          <img src={banner} className="w-80" alt="Banner" />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
            
            {/* Step Indicators */}
            <div className="flex items-center gap-4 mt-6">
              {/* Step 1 */}
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep === 1 
                    ? 'bg-primary text-white ring-4 ring-primary/20' 
                    : currentStep > 1
                    ? 'bg-primary text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium transition-colors ${
                    currentStep === 1 ? 'text-primary' : 'text-slate-600'
                  }`}>
                    Credentials
                  </p>
                  <div className={`h-1 rounded-full mt-1 transition-all duration-500 ${
                    currentStep >= 1 ? 'bg-primary' : 'bg-slate-200'
                  }`} />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep === 2 
                    ? 'bg-primary text-white ring-4 ring-primary/20' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  2
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium transition-colors ${
                    currentStep === 2 ? 'text-primary' : 'text-slate-600'
                  }`}>
                    Personal Info
                  </p>
                  <div className={`h-1 rounded-full mt-1 transition-all duration-500 ${
                    currentStep === 2 ? 'bg-primary' : 'bg-slate-200'
                  }`} />
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden">
            {/* Step 1: Email & Password */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                currentStep === 1 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-full absolute top-0 left-0 w-full pointer-events-none'
              }`}
            >
              <div className="space-y-4">
                <InputField
                  label="Email"
                  name="email"
                  icon={FaEnvelope}
                  placeholder="Enter email"
                  value={formData.email}
                  error={errors.email}
                  onChange={handleInputChange}
                />

                <InputField
                  label="Password"
                  name="password"
                  icon={FaLock}
                  placeholder="Create password"
                  value={formData.password}
                  error={errors.password}
                  onChange={handleInputChange}
                  isPassword={true}
                />

                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  icon={FaLock}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  error={errors.confirmPassword}
                  onChange={handleInputChange}
                  isPassword={true}
                />

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  Next
                  <FaArrowRight />
                </button>
              </div>
            </div>

            {/* Step 2: Personal Details & Avatar */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                currentStep === 2 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-full absolute top-0 left-0 w-full pointer-events-none'
              }`}
            >
              <div className="space-y-4">
                <InputField
                  label="Full Name"
                  name="fullName"
                  icon={FaUser}
                  placeholder="Enter full name"
                  value={formData.fullName}
                  error={errors.fullName}
                  onChange={handleInputChange}
                />

                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  icon={FaPhone}
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  error={errors.phone}
                  maxLength={10}
                  onChange={handleInputChange}
                />

                {/* Avatar Selection */}
                <div>
                  {avatars?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-700">Choose an Avatar</p>

                      <div className="grid grid-cols-6 gap-4">
                        {avatars.map((avatar) => (
                          <button
                            type="button"
                            key={avatar.avatarId}
                            onClick={() => {
                              setSelectedAvatarId(avatar.avatarId)
                              setProfile(null)
                              setPreview(null)
                            }}
                            className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition
                              ${
                                selectedAvatarId === avatar.avatarId
                                  ? 'border-primary ring-2 ring-primary/40'
                                  : 'border-slate-200 hover:border-primary/60'
                              }`}
                          >
                            <img
                              src={viewUploadedFile(avatar.avatarUrl)}
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-xs text-slate-400">Or upload custom photo</span>

                        <label className="flex items-center gap-2 cursor-pointer text-primary text-sm hover:text-primary/80 transition">
                          <MdOutlinePhotoCamera size={20} />
                          Upload
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                setProfile(file)
                                setPreview(URL.createObjectURL(file))
                                setSelectedAvatarId(null)
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Preview uploaded image */}
                      {preview && (
                        <div className="mt-3">
                          <p className="text-xs text-slate-500 mb-1">Preview</p>
                          <img src={preview} className="w-16 h-16 rounded-full object-cover border" alt="Preview" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 py-3 rounded-lg font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 transition flex items-center justify-center gap-2"
                  >
                    <FaArrowLeft />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-2/3 py-3 rounded-lg font-medium transition
                      ${
                        loading
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                      }
                    `}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <span
              onClick={() => setShowLogin(true)}
              className="font-medium cursor-pointer hover:underline text-primary"
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