import axios from "axios";
import { STORAGE_KEYS } from "@/utils/constants.js";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 12000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const rawSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (rawSession) {
      try {
        const { token } = JSON.parse(rawSession);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn("Unable to parse stored session", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
