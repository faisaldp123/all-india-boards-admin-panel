"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

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

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminRole", res.data.role);

      router.push("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div className="relative w-full max-w-md px-8 py-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-white">

        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" className="w-14 mb-3 drop-shadow-lg" />
          <h1 className="text-2xl font-semibold tracking-wide">
            All India Boards
          </h1>
          <p className="text-sm text-gray-300">Admin Panel Login</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 text-red-300 text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Email Address
          </label>
          <input
            type="email"
            placeholder="admin@gmail.com"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-1 block">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-lg disabled:opacity-60"
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-6">
          Secure Admin Access • Authorized Users Only
        </p>
      </div>
    </div>
  );
}