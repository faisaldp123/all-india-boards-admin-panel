import axios from "axios";

const API = axios.create({
  baseURL: "https://all-india-boards-admin-backend.onrender.com/api",
  timeout: 10000,
});

// Attach token automatically
API.interceptors.request.use(
  (req) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminToken");
      console.log("📦 Sending Token:", token);

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default API;