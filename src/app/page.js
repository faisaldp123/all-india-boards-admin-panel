"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import "./login.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/admin-login", form);

      console.log("🔥 FULL RESPONSE:", res);
      console.log("🔥 RESPONSE DATA:", res.data);

      // ✅ SAFE CHECK
      if (!res.data || !res.data.token) {
        throw new Error("Token not received from server");
      }

      // ✅ STORE TOKEN
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminRole", res.data.role || "admin");

      console.log(
        "✅ Saved Token:",
        localStorage.getItem("adminToken")
      );

      // ✅ VERIFY STORAGE
      if (!localStorage.getItem("adminToken")) {
        throw new Error("Token not saved in localStorage");
      }

      router.push("/admin");

    } catch (err) {
      console.log("❌ LOGIN ERROR:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <img src="/logo.png" className="login-logo" />
        <div className="login-title">All India Boards</div>
        <div className="login-subtitle">Admin Panel Login</div>

        {error && <div className="login-error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          className="login-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="login-footer">
          Secure Admin Access
        </div>
      </div>
    </div>
  );
}