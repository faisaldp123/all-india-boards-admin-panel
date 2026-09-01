"use client";
import { useState } from "react";
import Link from "next/link";
import API from "@/lib/api";
import "../login.css";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(""); try { const { data } = await API.post("/auth/forgot-password", { email, accountType: "admin" }); setMessage(data.message); } catch (err) { setError(err.response?.data?.message || "Could not send reset email"); } finally { setLoading(false); } };
  return <main className="login-container"><form onSubmit={submit} className="login-card"><div className="login-title">Reset admin password</div><div className="login-subtitle">We’ll email you a secure reset link.</div>{message && <div className="login-footer">{message}</div>}{error && <div className="login-error">{error}</div>}<input required type="email" placeholder="Email" className="login-input" value={email} onChange={(event) => setEmail(event.target.value)} /><button className="login-btn" disabled={loading}>{loading ? "Sending…" : "Send reset link"}</button><Link href="/" className="login-footer">Back to admin login</Link></form></main>;
}
