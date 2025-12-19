import axios from 'axios'
import { REFRESH_URL } from './routes_urls'
import { createChatConnection } from '../signalr/chatConnection'
import { setConnected, setDisconnected } from '../store/connectionSlice'
import { store } from '../store'

const API_BASE_URL = 'http://192.168.1.50:5171'

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

axiosPrivate.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Get refresh token from electron-store
        const refreshToken = await window.store.get('refreshToken')

        if (!refreshToken) throw new Error('No refresh token')

        // Call refresh endpoint
        const response = await axiosInstance.post(REFRESH_URL, { refreshToken })

        const { accessToken, refreshToken: newRefreshToken } = response.data

        await window.store.set('accessToken', accessToken)
        await window.store.set('refreshToken', newRefreshToken)
        axiosPrivate.defaults.headers.Authorization = `Bearer ${accessToken}`
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        const connection = createChatConnection(response?.data?.data?.user_Id)

        connection
          .start()
          .then(() => {
            store.dispatch(setConnected('signalr'))
          })
          .catch(() => {
            store.dispatch(setDisconnected())
          })
        // Retry original request
        return axiosPrivate(originalRequest)
      } catch (err) {
        console.error('Session expired, please login again')
        await window.store.delete('accessToken')
        await window.store.delete('refreshToken')
        // console.error('Refresh token failed', err)
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)
