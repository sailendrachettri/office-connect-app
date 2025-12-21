import React, { useState } from 'react'
import { MdOutlinePhotoCamera } from 'react-icons/md'
import { axiosPrivate } from '../../../api/api'
import { ADD_AVATAR_URL } from '../../../api/routes_urls'
import { uploadFile } from '../../../utils/file-upload-to-server/uploadFile'
import toast from 'react-hot-toast'

const AvatarCms = () => {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [profile, setProfile] = useState(null)

  const handleUploadAvatars = async () => {
    try {
      setLoading(true)

      let avatarUrl = null

      if (profile) {
        const uploadRes = await uploadFile(profile) 
        avatarUrl = uploadRes.url
      }

      const payload = {
        AvatarUrl: avatarUrl
      }

      const res = await axiosPrivate.post(ADD_AVATAR_URL, payload)

      if(res?.data?.data?.status == 'true' || res?.data?.success == true){
        toast.success(res?.data?.data?.message || 'Avatar added successful');
      }else{
        toast.error("Not able to add avatar.");
      }
      console.log(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setPreview(null);
      setProfile(null);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* ---------- Heading ---------- */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Avatar Management
        </h2>
        <p className="text-sm text-slate-500">
          Upload and manage profile avatars used across the application
        </p>
      </div>

      {/* ---------- Card ---------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
        {/* Preview */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border border-slate-300 overflow-hidden bg-slate-100 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <MdOutlinePhotoCamera className="text-slate-400" size={24} />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">
              Profile Picture
            </p>
            <p className="text-xs text-slate-400">
              JPG or PNG, max 5MB
            </p>
          </div>
        </div>

        {/* Upload Field */}
        <div className="flex items-center justify-between border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50">
          <p className="text-sm text-slate-600">
            Choose an image to upload
          </p>

          <label className="cursor-pointer inline-flex items-center gap-2 text-primary text-sm font-medium">
            <MdOutlinePhotoCamera size={20} />
            Upload
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (!file) return
                setProfile(file)
                setPreview(URL.createObjectURL(file))
              }}
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          disabled={loading || !profile}
          onClick={handleUploadAvatars}
          className={`w-full py-3 rounded-lg text-sm font-medium transition
            ${
              loading || !profile
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
            }
          `}
        >
          {loading ? 'Uploading Avatar...' : 'Save Avatar'}
        </button>
      </div>
    </div>
  )
}

export default AvatarCms
