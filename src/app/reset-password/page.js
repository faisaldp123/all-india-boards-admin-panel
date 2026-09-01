"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";
import "../login.css";

function AdminResetPasswordForm() {
  const params = useSearchParams(); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event) => { event.preventDefault(); if (password !== confirm) return setError("Passwords do not match"); setLoading(true); setError(""); try { const { data } = await API.post("/auth/reset-password", { token: params.get("token"), password, accountType: "admin" }); setMessage(data.message); setPassword(""); setConfirm(""); } catch (err) { setError(err.response?.data?.message || "Could not reset password"); } finally { setLoading(false); } };
  return <main className="login-container"><form onSubmit={submit} className="login-card"><div className="login-title">Set a new password</div><div className="login-subtitle">Use at least 8 characters.</div>{message && <div className="login-footer">{message}</div>}{error && <div className="login-error">{error}</div>}<input required minLength={8} type="password" placeholder="New password" className="login-input" value={password} onChange={(event) => setPassword(event.target.value)} /><input required minLength={8} type="password" placeholder="Confirm new password" className="login-input" value={confirm} onChange={(event) => setConfirm(event.target.value)} /><button className="login-btn" disabled={loading}>{loading ? "Updating…" : "Update password"}</button><Link href="/" className="login-footer">Back to admin login</Link></form></main>;
}

export default function AdminResetPassword() {
  return <Suspense fallback={<main className="login-container"><div className="login-card">Loading reset form…</div></main>}><AdminResetPasswordForm /></Suspense>;
}
