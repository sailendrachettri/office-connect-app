import axios from 'axios'

const API_BASE_URL = 'https://localhost:44303'

// Public Axios instance (no auth)
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Private Axios instance (with auth)
export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Attach token automatically for private requests
axiosPrivate.interceptors.request.use(
  async (config) => {
    // ✅ GET TOKEN FROM ELECTRON STORE
    const token = await window.store.get('accessToken')


    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)
