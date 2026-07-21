
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2, Activity, Lock, Shield, Mail } from "lucide-react";
import TurnstileWidget from "@/components/Turnstile/TurnstileWidget";
import WelcomeSlideshow from "./WelcomeSlideshow";
const API_BASE = "https://telexph-admin.onrender.com/api";
const STATS = [
  { num: "2,400+", lbl: "Active VAs" },
  { num: "98%", lbl: "Satisfaction" },
  { num: "150+", lbl: "Clients" },
  { num: "$5M+", lbl: "Paid out" }
];
const BAR_HEIGHTS = [45, 62, 50, 80, 58, 90, 70];
function VALoginPage() {
  const router = useRouter();
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [isScreenLeaving, setIsScreenLeaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("credentials");
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const goToMobileForm = () => {
    if (isScreenLeaving) return;
    setIsScreenLeaving(true);
    setTimeout(() => {
      setShowMobileForm(true);
      setIsScreenLeaving(false);
    }, 360);
  };
  const goToMobileWelcome = () => {
    if (isScreenLeaving) return;
    setIsScreenLeaving(true);
    setTimeout(() => {
      setShowMobileForm(false);
      setIsScreenLeaving(false);
    }, 360);
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!turnstileToken) {
      setError("Please complete the human verification challenge.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/va/authenticate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken, rememberMe: remember })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }
      if (data.requiresOtp) {
        setOtpEmail(data.email);
        setStep("otp");
        setIsLoading(false);
        return;
      }
      router.push("/VirtualAssistant/dashboard?welcome=1");
    } catch {
      setError("Unable to connect. Please try again.");
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/va/verify-login-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp, rememberMe: remember })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || "Verification failed.");
        setIsLoading(false);
        return;
      }
      router.push("/VirtualAssistant/dashboard?welcome=1");
    } catch {
      setError("Unable to connect. Please try again.");
      setIsLoading(false);
    }
  };
  const handleResendOtp = async () => {
    setError("");
    setIsResending(true);
    try {
      const res = await fetch(`${API_BASE}/auth/va/authenticate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken, rememberMe: remember })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || "Failed to resend code.");
        return;
      }
      if (data.requiresOtp) setOtpEmail(data.email);
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsResending(false);
    }
  };
  const handleBackToCredentials = () => {
    setError("");
    setOtp("");
    setStep("credentials");
  };
  const mobileLoginForm = <form onSubmit={handleSignIn} className="space-y-3">
      <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
          Email
        </label>
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#fdeaea] flex items-center justify-center pointer-events-none transition-colors duration-200 group-focus-within:bg-[#800000]/12">
            <Mail size={15} className="text-[#800000]" />
          </span>
          <input
    type="email"
    required
    placeholder="you@example.com"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      setError("");
    }}
    className="peer w-full pl-12 pr-3 py-3 rounded-2xl border border-gray-200 bg-gray-50/70 text-sm text-gray-800 outline-none focus:border-[#800000] focus:bg-white focus:ring-4 focus:ring-[#800000]/10 focus:shadow-md transition-all duration-200"
  />
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
          Password
        </label>
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#fdeaea] flex items-center justify-center pointer-events-none transition-colors duration-200 group-focus-within:bg-[#800000]/12">
            <Lock size={15} className="text-[#800000]" />
          </span>
          <input
    type={showPassword ? "text" : "password"}
    required
    placeholder="Enter your password"
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      setError("");
    }}
    className="peer w-full pl-12 pr-11 py-3 rounded-2xl border border-gray-200 bg-gray-50/70 text-sm text-gray-800 outline-none focus:border-[#800000] focus:bg-white focus:ring-4 focus:ring-[#800000]/10 focus:shadow-md transition-all duration-200"
    style={{ color: "#1f2937", caretColor: "#1f2937", WebkitTextFillColor: "#1f2937" }}
  />
          <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? "Hide password" : "Show password"}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#800000] transition-all duration-150 hover:scale-110 active:scale-90"
  >
            <span
    key={showPassword ? "visible" : "hidden"}
    className="block"
    style={{ animation: "vaPopIn 0.2s ease-out" }}
  >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
        <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
          <input
    type="checkbox"
    checked={remember}
    onChange={(e) => setRemember(e.target.checked)}
    className="w-3.5 h-3.5 accent-[#800000] cursor-pointer transition-transform duration-150 active:scale-90"
  />
          Remember me
        </label>
        <button
    type="button"
    onClick={() => router.push("/VirtualAssistant/forgot-password")}
    className="relative text-xs font-medium text-[#800000] transition-opacity duration-150 hover:opacity-80 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-[#800000] after:transition-all after:duration-200 hover:after:w-full"
  >
          Forgot password?
        </button>
      </div>

      {error && <div
    className="px-4 py-3 rounded-xl bg-[#fff5f5] border border-red-200"
    style={{ animation: "vaShake 0.4s ease-in-out" }}
  >
          <p className="text-xs text-red-700 font-medium m-0">{error}</p>
        </div>}

      <button
    type="submit"
    disabled={isLoading}
    className={`relative overflow-hidden w-full bg-gradient-to-br from-[#5c0000] via-[#800000] to-[#a10000] text-white py-3.5 rounded-2xl font-semibold text-[15px] tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#800000]/35 transition-all duration-200 animate-fade-in-up before:content-[''] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 before:ease-out ${isLoading ? "opacity-65 cursor-not-allowed" : "cursor-pointer hover:brightness-110 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#800000]/45 active:translate-y-0 active:scale-[0.98] hover:before:translate-x-full"}`}
    style={{ animationDelay: "0.35s" }}
  >
        {isLoading ? <>
            <Loader2 size={16} className="relative z-10 animate-spin" /> <span className="relative z-10">Signing in…</span>
          </> : <>
            <Lock size={16} className="relative z-10" />
            <span className="relative z-10">Log In</span>
          </>}
      </button>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <TurnstileWidget
    onVerify={setTurnstileToken}
    onExpire={() => setTurnstileToken("")}
  />
      </div>
    </form>;
  const mobileOtpForm = <form onSubmit={handleVerifyOtp} className="space-y-3">
      <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
          Verification code
        </label>
        <input
    type="text"
    inputMode="numeric"
    maxLength={6}
    required
    placeholder="000000"
    value={otp}
    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
    className="w-full px-3 py-3 rounded-2xl border border-gray-200 bg-gray-50/70 text-center text-lg tracking-[0.4em] font-semibold text-gray-800 outline-none focus:border-[#800000] focus:bg-white focus:ring-4 focus:ring-[#800000]/10 focus:shadow-md transition-all duration-200"
  />
        <p className="text-[12px] text-gray-500 mt-1.5">
          We sent a 6-digit code to {otpEmail}.
        </p>
      </div>

      {error && <div
    className="px-4 py-3 rounded-xl bg-[#fff5f5] border border-red-200"
    style={{ animation: "vaShake 0.4s ease-in-out" }}
  >
          <p className="text-xs text-red-700 font-medium m-0">{error}</p>
        </div>}

      <button
    type="submit"
    disabled={isLoading || otp.length !== 6}
    className={`relative overflow-hidden w-full bg-gradient-to-br from-[#5c0000] via-[#800000] to-[#a10000] text-white py-3.5 rounded-2xl font-semibold text-[15px] tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#800000]/35 transition-all duration-200 animate-fade-in-up ${isLoading || otp.length !== 6 ? "opacity-65 cursor-not-allowed" : "cursor-pointer hover:brightness-110 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#800000]/45 active:translate-y-0 active:scale-[0.98]"}`}
    style={{ animationDelay: "0.2s" }}
  >
        {isLoading ? <>
            <Loader2 size={16} className="animate-spin" /> Verifying…
          </> : <>
            <Lock size={16} /> Verify Code
          </>}
      </button>

      <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
        <button
    type="button"
    onClick={handleBackToCredentials}
    disabled={isLoading}
    className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
  >
          &larr; Back
        </button>
        <button
    type="button"
    onClick={handleResendOtp}
    disabled={isResending || isLoading}
    className="text-xs font-medium text-[#800000] hover:opacity-80 transition-opacity disabled:opacity-60"
  >
          {isResending ? "Resending\u2026" : "Resend code"}
        </button>
      </div>
    </form>;
  return <div style={styles.page} className="!p-0 md:!p-8">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vaScreenIn {
          from { opacity: 0; transform: translateY(18px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes vaShake {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-4px); }
          40%      { transform: translateX(4px); }
          60%      { transform: translateX(-3px); }
          80%      { transform: translateX(3px); }
        }
        @keyframes vaPopIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes vaScreenOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(-16px) scale(0.97); }
        }
        @keyframes vaGlowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(128,0,0,0.16); }
          50%      { box-shadow: 0 0 0 5px rgba(128,0,0,0.08); }
        }
        @keyframes vaCheckPop {
          0%   { transform: scale(0.8); }
          55%  { transform: scale(1.18); }
          100% { transform: scale(1); }
        }
        input[type="checkbox"]:checked {
          animation: vaCheckPop 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes vaCardRise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vaKenBurns {
          0%   { transform: scale(1); }
          100% { transform: scale(1.09); }
        }
        .animate-va-kenburns {
          animation: vaKenBurns 16s ease-in-out infinite alternate;
        }
        @keyframes vaIconPulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(128,0,0,0.35); }
          50%      { box-shadow: 0 4px 24px rgba(128,0,0,0.55); }
        }
        @keyframes vaRibbonShimmer {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.86; }
        }
        .animate-va-ribbon-shimmer {
          animation: vaRibbonShimmer 5s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes vaSeamGlow {
          0%, 100% { stroke-opacity: 0.55; }
          50%      { stroke-opacity: 0.95; }
        }
        .animate-va-seam-glow {
          animation: vaSeamGlow 3.2s ease-in-out infinite;
        }
        @keyframes vaWaveDrift {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(-10px); }
        }
        .animate-va-wave-drift {
          animation: vaWaveDrift 7s ease-in-out infinite;
        }
        @keyframes vaWaveDriftSlow {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(8px); }
        }
        .animate-va-wave-drift-slow {
          animation: vaWaveDriftSlow 9s ease-in-out infinite;
        }
        @keyframes vaGrainFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-va-grain-fade {
          animation: vaGrainFade 1.2s ease-out both;
        }
      ` }} />
      {
    /* Background blobs */
  }
      <div style={styles.blob1} className="hidden md:block" />
      <div style={styles.blob2} className="hidden md:block" />
      <div style={styles.glowLine} className="hidden md:block" />

      {
    /* mobile: welcome screen, only visible below md and before the user taps Sign In */
  }
      {!showMobileForm && <div
    className="relative md:hidden w-full h-screen flex flex-col items-center justify-end overflow-hidden bg-black"
    style={{
      animation: isScreenLeaving ? "vaScreenOut 0.36s cubic-bezier(0.4,0,0.6,1) forwards" : "vaScreenIn 0.5s ease-out",
      height: "100dvh"
    }}
  >
          <WelcomeSlideshow />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a0000]/90 via-[#1a0000]/85 to-black/90" />
          <div
    className="absolute inset-0 opacity-40"
    style={{
      backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
      backgroundSize: "28px 28px"
    }}
  />
          <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="mb-6 w-16 h-16 rounded-2xl bg-[#800000] flex items-center justify-center animate-illo-float-slow">
              <Activity size={28} color="#fff" />
            </div>
            <p className="text-xs font-semibold text-[#ff5555] tracking-widest uppercase mb-2 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              VAportal &middot; Secure
            </p>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Welcome back
            </h1>
            <p className="text-gray-300 text-sm font-normal animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              Sign in to your Virtual
            </p>
            <p className="text-gray-300 text-sm font-normal animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
              Assistant account.
            </p>
          </div>

          <div className="relative z-10 w-full px-6 pb-10 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
            <button
    type="button"
    onClick={goToMobileForm}
    className="group relative overflow-hidden w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#800000] to-[#a10000] text-white py-4 rounded-xl font-semibold text-sm tracking-wide hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-[#800000]/40 active:scale-[0.98] animate-pulse-glow before:content-[''] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-out"
  >
              <Lock size={16} className="relative z-10" />
              <span className="relative z-10">Log in to Continue</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
            <p className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-5">
              <Lock size={12} className="text-[#a10000]" />
              VA portal only &mdash; all access is monitored and logged.
            </p>
          </div>
        </div>}

      {
    /* mobile: compact sign-in form — flat white layout matching the TelexPH admin portal reference */
  }
      {showMobileForm && <div
    className="relative md:hidden w-full overflow-hidden flex flex-col bg-white"
    style={{
      animation: isScreenLeaving ? "vaScreenOut 0.36s cubic-bezier(0.4,0,0.6,1) forwards" : "vaScreenIn 0.45s ease-out",
      height: "100dvh"
    }}
  >
          {
    /* ── HEADER ── the office photo is the star: only a light readability scrim sits behind the text, and a thin red wedge sweeps in from the top-right with the photo still showing through. */
  }
          <div className="relative shrink-0 overflow-hidden bg-white" style={{ height: "34vh", minHeight: 210 }}>
            <Image
    src="/images/post3.webp"
    alt=""
    fill
    quality={100}
    sizes="100vw"
    className="object-cover"
    priority
  />
            {
    /* readability scrim, layer 1 — bottom-anchored, since the text block sits at the bottom of the header (justify-end) */
  }
            <div
    className="absolute inset-0"
    style={{ background: "linear-gradient(0deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.15) 65%, rgba(255,255,255,0) 82%)" }}
  />
            {
    /* readability scrim, layer 2 — diagonal, confined to the left where the text sits, fully clear by mid-header so the right side of the photo (and the red wedge) stay untouched */
  }
            <div
    className="absolute inset-0"
    style={{ background: "linear-gradient(100deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 22%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 50%)" }}
  />

            {
    /* red wedge — the ONLY place the red tint appears; a plain div clipped with a CSS polygon (percentage-based, so it always matches the rendered box exactly regardless of height) */
  }
            <div
    className="absolute inset-0"
    style={{
      background: "linear-gradient(135deg, #6b0000 0%, #5c0000 55%, #4a0000 100%)",
      opacity: 0.4,
      clipPath: "polygon(64% 0%, 86% 100%, 100% 100%, 100% 0%)"
    }}
  />

            {
    /* plain white fade along the very bottom edge only, so the header melts into the form with a clean white seam (no red bleed) */
  }
            <div
    className="absolute inset-x-0 bottom-0 h-8"
    style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0), #ffffff)" }}
  />

            {
    /* header content */
  }
            <div className="relative z-10 h-full flex flex-col justify-end px-6 pt-8 pb-4">
              <div className="flex items-center gap-2.5 mb-3 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
                <div className="relative w-9 h-9 shrink-0">
                  <Image src="/images/Tlxlogo.webp" alt="TelexPH logo" fill className="object-contain" priority />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight leading-none">
                    <span className="text-gray-900">Telex</span><span className="text-[#800000]">PH</span>
                  </h2>
                  <p className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase mt-0.5">
                    VA Portal
                  </p>
                </div>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
                  {step === "otp" ? "Verify your identity" : "Welcome back!"}
                </h1>
                <p className="text-gray-600 text-[13px] font-normal">
                  {step === "otp" ? "Enter the code sent to your email" : "Sign in to continue to your account"}
                </p>
              </div>
            </div>
          </div>

          <button
    type="button"
    onClick={goToMobileWelcome}
    aria-label="Back"
    className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 z-20 transition-all duration-200 hover:shadow-lg hover:-translate-x-0.5 active:scale-90"
    style={{ animation: "vaPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.15s both" }}
  >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>

          {
    /* ── FORM CONTAINER ── solid white, holds every login field so nothing overlaps the header photo. min-h-0 lets it shrink inside the fixed-height screen instead of pushing content off-screen; justify-center keeps the form vertically balanced in whatever space remains below the header instead of leaving dead space at the bottom. */
  }
          <div className="relative z-10 flex flex-col flex-1 min-h-0 px-6 pt-3 pb-4 bg-white overflow-y-auto">
            {step === "otp" ? mobileOtpForm : mobileLoginForm}

            {
    /* footer trust badge */
  }
            <div className="mt-3 relative overflow-hidden flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#fdeaea]/80 to-[#fdeaea]/30 border border-[#f5caca] px-3.5 py-2.5 shrink-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              {
    /* faint dot-grid accent, bottom-right */
  }
              <div
    className="absolute right-3 bottom-1 w-16 h-7 opacity-40 pointer-events-none"
    style={{ backgroundImage: "radial-gradient(rgba(128,0,0,0.3) 1px, transparent 1px)", backgroundSize: "7px 7px" }}
  />
              <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 relative z-10">
                <Shield size={16} className="text-[#800000]" />
              </div>
              <div className="relative z-10">
                <p className="text-gray-900 text-[12px] font-bold leading-tight">Secure access</p>
                <p className="text-gray-500 text-[10.5px] leading-snug mt-0.5">
                  Manage your tasks, schedule, and earnings in one place.
                </p>
              </div>
            </div>
          </div>
        </div>}

      {
    /* Card */
  }
      <div style={styles.card} className="hidden md:flex animate-fade-in-up">

        {
    /* ── LEFT: Form ── */
  }
        <div style={styles.left}>

          {
    /* Brand */
  }
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <Activity size={18} color="#fff" />
            </div>
            <span style={styles.brandName}>VAportal</span>
            <span style={styles.brandBadge}>Secure</span>
          </div>

          <h1 style={styles.heading}>{step === "otp" ? "Verify your identity" : "Welcome back"}</h1>
          <p style={styles.subhead}>
            {step === "otp" ? "Enter the code sent to your email" : "Sign in to your Virtual Assistant account"}
          </p>

          {step === "otp" ? <form onSubmit={handleVerifyOtp} style={styles.form}>

              {
    /* OTP code */
  }
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Verification code</label>
                <input
    type="text"
    inputMode="numeric"
    maxLength={6}
    required
    placeholder="000000"
    value={otp}
    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
    style={{ ...styles.input, textAlign: "center", letterSpacing: "0.4em", fontWeight: 600 }}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = "#800000";
      e.currentTarget.style.background = "#fff";
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = "#f0e8e8";
      e.currentTarget.style.background = "#fdf8f8";
    }}
  />
                <p style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
                  We sent a 6-digit code to {otpEmail}.
                </p>
              </div>

              {
    /* Error */
  }
              {error && <div style={styles.errorBox}>
                  <p style={styles.errorText}>{error}</p>
                </div>}

              {
    /* Submit */
  }
              <button
    type="submit"
    disabled={isLoading || otp.length !== 6}
    style={{
      ...styles.submitBtn,
      opacity: isLoading || otp.length !== 6 ? 0.65 : 1,
      cursor: isLoading || otp.length !== 6 ? "not-allowed" : "pointer"
    }}
    onMouseEnter={(e) => {
      if (isLoading || otp.length !== 6) return;
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(128,0,0,0.35)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
                {isLoading ? <><Loader2 size={15} className="animate-spin" /> Verifying…</> : "Verify Code"}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: -6 }}>
                <button
    type="button"
    onClick={handleBackToCredentials}
    disabled={isLoading}
    style={{ ...styles.forgotBtn, color: "#888" }}
  >
                  &larr; Back
                </button>
                <button
    type="button"
    onClick={handleResendOtp}
    disabled={isResending || isLoading}
    style={styles.forgotBtn}
  >
                  {isResending ? "Resending\u2026" : "Resend code"}
                </button>
              </div>

            </form> : <form onSubmit={handleSignIn} style={styles.form}>

              {
    /* Email */
  }
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Email address</label>
                <input
    type="email"
    required
    placeholder="you@example.com"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      setError("");
    }}
    style={styles.input}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = "#800000";
      e.currentTarget.style.background = "#fff";
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = "#f0e8e8";
      e.currentTarget.style.background = "#fdf8f8";
    }}
  />
              </div>

              {
    /* Password */
  }
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Password</label>
                <div style={styles.passWrap}>
                  <input
    type={showPassword ? "text" : "password"}
    required
    placeholder="Enter your password"
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      setError("");
    }}
    style={{ ...styles.input, paddingRight: "44px" }}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = "#800000";
      e.currentTarget.style.background = "#fff";
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = "#f0e8e8";
      e.currentTarget.style.background = "#fdf8f8";
    }}
  />
                  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={styles.eyeBtn}
  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {
    /* Remember + Forgot */
  }
              <div style={styles.rowMeta}>
                <label style={styles.rememberLabel}>
                  <input
    type="checkbox"
    checked={remember}
    onChange={(e) => setRemember(e.target.checked)}
    style={{ accentColor: "#800000", width: 14, height: 14, cursor: "pointer" }}
  />
                  Remember me
                </label>
                <button
    type="button"
    onClick={() => router.push("/VirtualAssistant/forgot-password")}
    style={styles.forgotBtn}
  >
                  Forgot password?
                </button>
              </div>

              {
    /* Error */
  }
              {error && <div style={styles.errorBox}>
                  <p style={styles.errorText}>{error}</p>
                </div>}

              {
    /* Submit */
  }
              <button
    type="submit"
    disabled={isLoading}
    style={{
      ...styles.submitBtn,
      opacity: isLoading ? 0.65 : 1,
      cursor: isLoading ? "not-allowed" : "pointer"
    }}
    onMouseEnter={(e) => {
      if (isLoading) return;
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(128,0,0,0.35)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
    onMouseDown={(e) => {
      if (!isLoading) e.currentTarget.style.transform = "translateY(0) scale(0.98)";
    }}
    onMouseUp={(e) => {
      if (!isLoading) e.currentTarget.style.transform = "translateY(-2px) scale(1)";
    }}
  >
                {isLoading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : "Sign in"}
              </button>

              <TurnstileWidget
    onVerify={setTurnstileToken}
    onExpire={() => setTurnstileToken("")}
  />

              {
    /* Divider */
  }
              <div style={styles.divider}>
                <div style={styles.dividerLine} />
                <span style={styles.dividerText}>or</span>
                <div style={styles.dividerLine} />
              </div>

              {
    /* Apply link */
  }
              <p style={styles.applyText}>
                New here?{" "}
                <button
    type="button"
    onClick={() => router.push("/VirtualAssistant/VAforms")}
    style={styles.applyLink}
  >
                  Apply as a Virtual Assistant
                </button>
              </p>

            </form>}
        </div>

        {
    /* ── RIGHT: Stats & Charts ── */
  }
        <div style={styles.right}>

          {
    /* Stat grid */
  }
          <div style={styles.statGrid}>
            {STATS.map((s) => <div
    key={s.lbl}
    style={{ ...styles.statCard, transition: "transform 0.2s, background 0.2s" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.background = "rgba(139,0,0,0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.background = "rgba(139,0,0,0.12)";
    }}
  >
                <div style={styles.statNum}>{s.num}</div>
                <div style={styles.statLbl}>{s.lbl}</div>
              </div>)}
          </div>

          {
    /* Bar chart */
  }
          <div style={styles.chartBox}>
            <div style={styles.chartHeader}>
              <span style={styles.chartTitle}>Monthly earnings</span>
            </div>
            <div style={styles.chartVal}>$48,200</div>
            <div style={styles.chartChange}>↑ 12.4% this month</div>
            <div style={styles.bars}>
              {BAR_HEIGHTS.map((h, i) => <div
    key={i}
    style={{
      ...styles.bar,
      height: `${h}%`,
      background: i === 5 ? "#800000" : "rgba(139,0,0,0.3)"
    }}
  />)}
            </div>
          </div>

          {
    /* Sparkline */
  }
          <div style={styles.sparkBox}>
            <div style={styles.sparkLabel}>Task completion</div>
            <div style={styles.sparkRow}>
              <div>
                <div style={styles.sparkBig}>1,284</div>
                <div style={styles.sparkSub}>tasks this quarter</div>
              </div>
              <svg width="80" height="40" viewBox="0 0 80 40">
                <polyline
    points="0,32 13,24 26,28 40,14 53,18 66,8 80,4"
    fill="none"
    stroke="#800000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
                <polyline
    points="0,32 13,24 26,28 40,14 53,18 66,8 80,4 80,40 0,40"
    fill="rgba(139,0,0,0.18)"
    stroke="none"
  />
              </svg>
            </div>
          </div>

          {
    /* Notice */
  }
          <div style={styles.notice}>
            <Lock size={12} color="#800000" style={{ flexShrink: 0 }} />
            <span style={styles.noticeText}>
              VA portal only — all access is monitored and logged.
            </span>
          </div>

        </div>
      </div>
    </div>;
}
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0000",
    position: "relative",
    overflow: "hidden"
  },
  blob1: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(160,0,0,0.4) 0%, transparent 70%)",
    top: -160,
    left: -120,
    pointerEvents: "none"
  },
  blob2: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(100,0,0,0.35) 0%, transparent 70%)",
    bottom: -100,
    right: -80,
    pointerEvents: "none"
  },
  glowLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(139,0,0,0.6), transparent)"
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: 880,
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(139,0,0,0.25)"
  },
  /* ── LEFT ── */
  left: {
    flex: 1,
    background: "#fff",
    padding: "52px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 36
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    background: "#800000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  brandName: {
    fontSize: 15,
    fontWeight: 500,
    color: "#1a0000",
    letterSpacing: "-0.3px"
  },
  brandBadge: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    background: "#fff0f0",
    color: "#800000",
    borderRadius: 4,
    padding: "2px 7px",
    border: "1px solid #f5caca"
  },
  heading: {
    fontSize: 28,
    fontWeight: 500,
    color: "#1a0000",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
    marginBottom: 6
  },
  subhead: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 32
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  fieldGroup: {
    marginBottom: 18
  },
  fieldLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#800000",
    marginBottom: 6
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #f0e8e8",
    background: "#fdf8f8",
    fontSize: 14,
    color: "#1a0000",
    outline: "none",
    transition: "border-color 0.15s, background 0.15s"
  },
  passWrap: {
    position: "relative"
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ccc",
    padding: 0,
    display: "flex",
    alignItems: "center"
  },
  rowMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24
  },
  rememberLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    fontSize: 13,
    color: "#888"
  },
  forgotBtn: {
    fontSize: 13,
    fontWeight: 500,
    color: "#800000",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0
  },
  errorBox: {
    marginBottom: 16,
    padding: "10px 14px",
    borderRadius: 8,
    background: "#fff5f5",
    border: "1px solid #fecaca"
  },
  errorText: {
    fontSize: 12,
    color: "#b91c1c",
    fontWeight: 500,
    margin: 0
  },
  submitBtn: {
    width: "100%",
    padding: 13,
    background: "#800000",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
    transition: "opacity 0.15s, transform 0.1s"
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#f0e8e8"
  },
  dividerText: {
    fontSize: 12,
    color: "#ccc"
  },
  applyText: {
    textAlign: "center",
    fontSize: 13,
    color: "#bbb",
    margin: 0
  },
  applyLink: {
    color: "#800000",
    fontWeight: 500,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    padding: 0
  },
  /* ── RIGHT ── */
  right: {
    width: 320,
    background: "#0d0000",
    padding: "40px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    borderLeft: "1px solid rgba(139,0,0,0.2)"
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10
  },
  statCard: {
    background: "rgba(139,0,0,0.12)",
    border: "1px solid rgba(139,0,0,0.2)",
    borderRadius: 12,
    padding: "14px 12px"
  },
  statNum: {
    fontSize: 20,
    fontWeight: 500,
    color: "#fff",
    marginBottom: 2
  },
  statLbl: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.07em"
  },
  chartBox: {
    background: "rgba(139,0,0,0.08)",
    border: "1px solid rgba(139,0,0,0.18)",
    borderRadius: 14,
    padding: 16
  },
  chartHeader: {
    marginBottom: 4
  },
  chartTitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.07em"
  },
  chartVal: {
    fontSize: 22,
    fontWeight: 500,
    color: "#fff"
  },
  chartChange: {
    fontSize: 11,
    color: "#4caf7d",
    marginBottom: 14
  },
  bars: {
    display: "flex",
    alignItems: "flex-end",
    gap: 5,
    height: 64
  },
  bar: {
    flex: 1,
    borderRadius: "4px 4px 0 0",
    transition: "background 0.2s"
  },
  sparkBox: {
    background: "rgba(139,0,0,0.08)",
    border: "1px solid rgba(139,0,0,0.18)",
    borderRadius: 14,
    padding: 16
  },
  sparkLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 10
  },
  sparkRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sparkBig: {
    fontSize: 20,
    fontWeight: 500,
    color: "#fff"
  },
  sparkSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    marginTop: 2
  },
  notice: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(139,0,0,0.1)",
    border: "1px solid rgba(139,0,0,0.2)",
    borderRadius: 10,
    padding: "10px 12px",
    marginTop: "auto"
  },
  noticeText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    lineHeight: 1.5
  }
};
export {
  VALoginPage as default
};
