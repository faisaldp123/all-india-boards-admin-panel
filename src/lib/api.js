import axios from "axios";

const API = axios.create({
  baseURL: "https://all-india-boards-admin-backend.onrender.com/api",
});

// Attach token automatically
API.interceptors.request.use(
  (req) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminToken");
      if (token) {
        req.headers.Authorization = `Bearer ${token}`; // ✅ FIXED
      }
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default API;