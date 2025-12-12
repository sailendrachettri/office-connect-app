import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import banner from "../../assets/svgs/banner_login.svg";

const LoginUser = ({setShowLogin, setIsLoggedIn}) => {
const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", form);
    // TODO: call login API
    setIsLoggedIn(true);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-5">
      <div className="w-full max-w-5xl flex bg-ternary rounded-2xl shadow-xl overflow-hidden border border-slate-200">

        {/* LEFT SIDE SVG */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-10">
          <img src={banner} alt="Banner" className="w-80 drop-shadow-xl scale-x-[-1]" />
        </div>

        {/* RIGHT SIDE LOGIN FORM */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          <h2 className="text-3xl font-semibold text-primary mb-3">Welcome Back</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Login to access your messaging dashboard.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex items-center gap-3 border border-slate-300 p-3 rounded-lg bg-slate-50">
              <FaEnvelope className="text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-slate-700"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 border border-slate-300 p-3 rounded-lg bg-slate-50">
              <FaLock className="text-slate-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-slate-700"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <span className="text-slate-600 text-sm hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            {/* Login Button */} 
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 cursor-pointer transition font-medium shadow"
            >
              Login
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Don’t have an account?{" "}
            <span onClick={()=> {setShowLogin(false); setIsLoggedIn(false)}} className="text-slate-800 font-medium cursor-pointer hover:underline">
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginUser