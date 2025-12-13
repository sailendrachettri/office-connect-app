import axios from "axios";

const API_BASE_URL = "https://localhost:44303";

// Public Axios instance (no auth)
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Private Axios instance (with auth)
export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically for private requests
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // or Electron store
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
