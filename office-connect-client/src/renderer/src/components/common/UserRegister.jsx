import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa'
import { MdOutlinePhotoCamera } from 'react-icons/md'
import banner from '../../assets/svgs/banner.svg'

const UserRegister = ({setShowLogin, setIsLoggedIn}) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    profile: null
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFile = (e) => {
    setForm({ ...form, profile: e.target.files[0] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Data:', form)
    setIsLoggedIn(true);
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-5">
      <div className="w-full max-w-5xl flex bg-ternary rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* LEFT SIDE SVG OR IMAGE */}
        <div className="hidden md:flex w-1/2  text-white items-center justify-center p-10">
          <img src={banner} alt="Banner" className="w-80 drop-shadow-xl" />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          <h2 className="text-3xl font-semibold text-primary mb-3">Create New Account</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Register your profile to access the messaging system.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex items-center gap-3 border border-slate-300 p-3 rounded-lg bg-slate-50">
              <FaUser className="text-slate-500" />
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-slate-700"
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 border border-slate-300 p-3 rounded-lg bg-slate-50">
              <FaEnvelope className="text-slate-500" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-slate-700"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 border border-slate-300 p-3 rounded-lg bg-slate-50">
              <FaPhone className="text-slate-500" />
              <input
                name="phone"
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-slate-700"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 border border-slate-300 p-3 rounded-lg bg-slate-50">
              <FaLock className="text-slate-500" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-slate-700"
              />
            </div>

            {/* Profile Photo Upload */}
            <div className="flex items-center justify-between border border-slate-300 p-3 rounded-lg bg-slate-50 cursor-pointer">
              <div>
                <p className="text-slate-600 text-sm">Upload Profile Picture</p>
                <p className="text-slate-400 text-xs">JPG / PNG up to 2MB</p>
              </div>

              <label className="cursor-pointer">
                <MdOutlinePhotoCamera size={26} className="text-slate-600" />
                <input type="file" className="hidden" onChange={handleFile} />
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 cursor-pointer transition font-medium shadow"
            >
              Register User
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Already have an account?{' '}
            <span onClick={()=>setShowLogin(true)} className="text-slate-800 font-medium cursor-pointer hover:underline">Login</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
