import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const InputField = ({
  label,
  name,
  type = 'text',
  icon: Icon,
  register,
  errors,
  required = false,
  placeholder,
  regex,
  regexMessage,
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-600 mb-1">{label} <span className='text-red-500'>{required? '*' : ''}</span></label>}

      <div
        className={`flex items-center gap-3 border rounded-lg p-3 bg-slate-50
          ${errors?.[name] ? 'border-red-400' : 'border-slate-300'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        {Icon && <Icon className="text-slate-500" />}

        <input
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full outline-none bg-transparent text-slate-700"
          {...register(name, {
            required: required && `${label || name} is required`,
            pattern: regex ? { value: regex, message: regexMessage } : undefined
          })}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-500 hover:text-slate-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {errors?.[name] && <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>}
    </div>
  )
}

export default InputField
