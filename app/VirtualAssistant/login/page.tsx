"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, LayoutGrid, Lock } from "lucide-react";

export default function VALoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: replace with your actual auth logic
    router.push("/VirtualAssistant/dashboard");
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

          {/* Headline */}
          <div className="mb-7">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-3 w-fit"
              style={{ background: "#fff5f5", border: "1px solid #ffd0d0" }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#8B0000" }} />
              <span className="text-[11px] font-bold tracking-[.06em] uppercase" style={{ color: "#8B0000" }}>VA Portal Access</span>
            </div>
            <h1 className="text-[28px] font-black leading-tight mb-2" style={{ color: "#1a0000", letterSpacing: "-0.03em" }}>
              Sign in to<br />your account
            </h1>
            <p className="text-[13px] leading-relaxed" style={{ color: "#b09090" }}>
              Enter your credentials to continue to your VA workspace and manage your tasks.
            </p>
          </div>

          <form onSubmit={handleSignIn}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-[11px] font-extrabold tracking-[.1em] uppercase mb-1.5" style={{ color: "#8B0000" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@telexph.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-all"
                style={{ background: "#fff5f5", border: "1.5px solid #f5dede", color: "#1a0000" }}
                onFocus={(e) => { e.target.style.borderColor = "#8B0000"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(139,0,0,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#f5dede"; e.target.style.background = "#fff5f5"; e.target.style.boxShadow = "none"; }}
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
            <div className="flex items-center justify-between mt-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer text-[13px]" style={{ color: "#b09090" }}>
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

            {/* Sign In */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl text-[13px] font-extrabold tracking-[.12em] uppercase text-white flex items-center justify-center gap-2.5 mb-5 transition-all hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "#8B0000", boxShadow: "0 6px 22px rgba(139,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.15)" }}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 12px 30px rgba(139,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)")}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 6px 22px rgba(139,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.15)")}
            >
              Sign In <ArrowRight size={18} />
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

        {/* ── RIGHT Panel ── */}
        <div
          className="relative w-full md:w-[400px] flex-shrink-0 flex flex-col px-7 py-8 overflow-hidden"
          style={{ background: "linear-gradient(145deg, #6b0000 0%, #3a0000 55%, #1c0000 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute pointer-events-none" style={{ width: "320px", height: "320px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: "-120px", right: "-100px" }} />
          <div className="absolute pointer-events-none" style={{ width: "180px", height: "180px", borderRadius: "50%", background: "rgba(0,0,0,0.2)", bottom: "-50px", left: "-50px" }} />

          {/* Top row */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <span className="text-[13px] font-bold tracking-[.06em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>VA Dashboard</span>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <LayoutGrid size={18} color="rgba(255,255,255,0.8)" />
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10 mb-6">
            <h2 className="text-[20px] font-extrabold text-white leading-tight mb-2">
              Your work.<br />Your schedule.<br />Your career.
            </h2>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Manage clients, tasks, and earnings — all from one secure workspace.
            </p>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-2 gap-2.5 mb-6">
            {stats.map((s) => (
              <div
                key={s.lbl}
                className="rounded-xl px-3.5 py-3"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="text-[18px] font-extrabold text-white">{s.num}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Bar chart mock */}
          <div
            className="relative z-10 rounded-xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-2"
              style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {[0,1,2].map(i => <div key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />)}
              <div className="flex-1 ml-2 h-1.5 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>
            <div className="flex items-end gap-1 px-3 py-3" style={{ minHeight: "64px" }}>
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{
                    height: `${h}%`,
                    background: i === 3 ? "rgba(255,150,150,0.65)" : "rgba(255,120,120,0.4)",
                    borderRadius: "3px 3px 0 0",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="relative z-10 mt-auto pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-[11.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              this portal is for{" "}
              <span className="font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>VA use only</span>.<br />
              all access is monitored and logged.
            </p>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ml-3"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <Lock size={15} color="rgba(255,255,255,0.6)" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}