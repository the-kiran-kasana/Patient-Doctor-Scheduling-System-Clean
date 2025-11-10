import axios from "axios";

const API_BASE = "http://localhost:6060";

const api = axios.create({
  baseURL: API_BASE,
});

// ✅ Interceptor: Automatically attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found — user might not be logged in");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: Handle token expiration or unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("🔒 Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
