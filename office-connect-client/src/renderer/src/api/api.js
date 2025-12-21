import axios from 'axios'
import { REFRESH_URL } from './routes_urls'


export const API_BASE_URL = 'http://192.168.1.50:5171'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

axiosPrivate.interceptors.request.use(
  async (config) => {
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = await window.store.get('refreshToken')

        if (!refreshToken) throw new Error('No refresh token')

        const response = await axiosInstance.post(REFRESH_URL, { refreshToken })

        const { accessToken, refreshToken: newRefreshToken } = response.data

        await window.store.set('accessToken', accessToken)
        await window.store.set('refreshToken', newRefreshToken)
        axiosPrivate.defaults.headers.Authorization = `Bearer ${accessToken}`
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // const connection = createChatConnection(response?.data?.data?.user_Id)

        // connection
        //   .start()
        //   .then(() => {
        //     store.dispatch(setConnected('signalr'))
        //   })
        //   .catch(() => {
        //     store.dispatch(setDisconnected())
        //   })

        return axiosPrivate(originalRequest)
      } catch (err) {
        console.error('Session expired, please login again')
        await window.store.delete('accessToken')
        await window.store.delete('refreshToken')

        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)
