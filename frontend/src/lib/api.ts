import axios from "axios";
import Cookies from "js-cookie";
import constant from "./constant";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5500/api", // Setup from .env
  timeout: 10000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = Cookies.get(constant.ACCESS_TOKEN_KEY);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;
