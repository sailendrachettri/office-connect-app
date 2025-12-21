import { API_BASE_URL, axiosInstance } from "../../api/api"
import { UPLOAD_FILES_URL } from "../../api/routes_urls"

export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await axiosInstance.post(
    UPLOAD_FILES_URL,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  return res.data
}

export const viewUploadedFile = (url)=>{
  return `${API_BASE_URL}${url}`;
}