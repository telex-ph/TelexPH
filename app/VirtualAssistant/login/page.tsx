"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, BarChart2, Lock, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function VALoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [remember,     setRemember]     = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/va/authenticate`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Invalid email or password.");
        return;
      }

      router.push("/VirtualAssistant/dashboard");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { num: "2,400+", lbl: "Active VAs" },
    { num: "98%",    lbl: "Satisfaction" },
    { num: "150+",   lbl: "Global clients" },
    { num: "$5M+",   lbl: "Paid out" },
  ];

  const bars = [45, 70, 55, 90, 65, 48, 78];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: "#0d0000" }}
    >
      {/* Background blobs */}
      <div className="absolute pointer-events-none" style={{ width: "500px", height: "500px", borderRadius: "50%", background: "rgba(139,0,0,0.35)", top: "-150px", left: "-150px", filter: "blur(80px)" }} />
      <div className="absolute pointer-events-none" style={{ width: "400px", height: "400px", borderRadius: "50%", background: "rgba(80,0,0,0.3)", bottom: "-100px", right: "-100px", filter: "blur(70px)" }} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[900px] flex flex-col md:flex-row rounded-[24px] overflow-hidden min-h-[520px]"
        style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}
      >

        {/* ── LEFT: Form ── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 md:px-10 bg-white">

          <form onSubmit={handleSignIn} className="flex flex-col gap-0">
            {/* Email */}
            <label className="text-[13px] font-semibold mb-1.5" style={{ color: "#8B0000" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="w-full px-4 py-3 rounded-lg text-sm text-gray-700 outline-none mb-4 transition-all border-[1.5px] border-transparent focus:border-[#8B0000] focus:bg-white"
              style={{ background: "#f0f4fa" }}
            />

          <form onSubmit={handleSignIn}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-[11px] font-extrabold tracking-[.1em] uppercase mb-1.5" style={{ color: "#8B0000" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full px-4 py-3 pr-10 rounded-lg text-sm text-gray-700 outline-none transition-all border-[1.5px] border-transparent focus:border-[#8B0000] focus:bg-white"
                style={{ background: "#f0f4fa" }}
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="block text-[11px] font-extrabold tracking-[.1em] uppercase mb-1.5" style={{ color: "#8B0000" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl text-[14px] outline-none transition-all"
                  style={{ background: "#fff5f5", border: "1.5px solid #f5dede", color: "#1a0000" }}
                  onFocus={(e) => { e.target.style.borderColor = "#8B0000"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(139,0,0,0.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#f5dede"; e.target.style.background = "#fff5f5"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
                  style={{ color: "#c0a0a0", background: "none", border: "none" }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-[15px] h-[15px] cursor-pointer"
                  style={{ accentColor: "#8B0000" }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => router.push("/VirtualAssistant/forgot-password")}
                className="text-[13px] font-bold hover:opacity-75 transition-opacity"
                style={{ color: "#8B0000", background: "none", border: "none" }}
              >
                Forgot password?
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-[12px] text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Sign In */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-sm font-bold tracking-widest uppercase text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "#8B0000" }}
            >
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[12.5px]" style={{ color: "#c0a0a0" }}>
            New here?{" "}
            <button
              type="button"
              onClick={() => router.push("/VirtualAssistant/VAforms")}
              className="font-bold hover:underline underline-offset-[3px]"
              style={{ color: "#8B0000", background: "none", border: "none" }}
            >
              Apply as a Virtual Assistant
            </button>
          </p>
        </div>

        {/* ── RIGHT: Illustration ── */}
        <div className="relative w-full md:w-[340px] flex flex-col items-center justify-between py-6 px-5" style={{ background: "#f5eeee" }}>
          <div className="absolute top-5 right-5 w-[42px] h-[42px] rounded-[10px] flex items-center justify-center" style={{ background: "#8B0000" }}>
            <BarChart2 size={20} color="white" />
          </div>

          <div className="w-full mt-14 bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 8px 24px rgba(139,0,0,0.15)" }}>
            <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: "#8B0000" }}>
              <div className="w-2 h-2 rounded-full bg-white opacity-40" />
              <div className="w-2 h-2 rounded-full bg-white opacity-40" />
              <div className="w-2 h-2 rounded-full bg-white opacity-40" />
              <div className="flex-1 ml-2 h-2 rounded bg-white opacity-20" />
            </div>
            <div className="p-2 flex gap-1.5">
              <div className="flex-[1.2] rounded-md p-2" style={{ background: "#8B0000" }}>
                <div className="h-1.5 rounded bg-white opacity-60 mb-1" /><div className="h-1.5 rounded bg-white opacity-35 w-[60%]" />
              </div>
              <div className="flex-1 rounded-md p-2" style={{ background: "#fdf2f2" }}>
                <div className="h-1.5 rounded mb-1" style={{ background: "#e8b4b4" }} /><div className="h-1.5 rounded w-[70%]" style={{ background: "#f5d4d4" }} />
              </div>
              <div className="flex-1 rounded-md p-2" style={{ background: "#fdf2f2" }}>
                <div className="h-1.5 rounded mb-1" style={{ background: "#e8b4b4" }} /><div className="h-1.5 rounded w-[50%]" style={{ background: "#f5d4d4" }} />
              </div>
            </div>
            <div className="px-2 pb-2 grid grid-cols-2 gap-1.5">
              <div className="rounded-md p-2 flex items-end gap-1" style={{ background: "#fdf2f2", height: "56px" }}>
                {[60, 80, 50, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: "#8B0000", opacity: 0.7 }} />
                ))}
              </div>
              <div className="rounded-md overflow-hidden" style={{ background: "#fdf2f2", height: "56px" }}>
                <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <polyline points="0,35 20,25 40,30 60,15 80,20 100,10" fill="none" stroke="#8B0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-[12px] text-gray-400 text-center leading-relaxed mt-4">
            this portal is for <span className="font-semibold text-gray-500">VA use only</span>. all access
            <br />attempts are monitored and logged.
          </p>

          <div className="absolute bottom-5 right-5 w-[38px] h-[38px] rounded-full flex items-center justify-center" style={{ background: "#f5d4d4" }}>
            <Lock size={16} color="#8B0000" />
          </div>
        </div>

      </div>
    </div>
  );
}