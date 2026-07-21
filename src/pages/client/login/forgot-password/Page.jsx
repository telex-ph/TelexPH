
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getForgotPasswordUrl, getResetPasswordUrl } from "@/lib/api-base";
function ClientForgotPasswordPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(getForgotPasswordUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, accountType: "client" })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setStep("reset");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.trim().length < 6) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(getResetPasswordUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim(), newPassword, accountType: "client" })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setStep("done");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="h-screen w-full relative flex items-center justify-center p-0 md:p-8 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
    src="/images/background.webp"
    alt="background"
    fill
    className="object-cover brightness-[0.4] contrast-[1.1]"
    priority
    quality={90}
  />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#8b0000]/30" />
      </div>

      <div className="relative z-10 w-full h-full md:max-w-5xl md:h-auto md:max-h-[600px] bg-white md:rounded-2xl shadow-[0_60px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row border border-white/10 font-open-sans">

        {
    /* mobile hero image, only visible below md */
  }
        <div className="relative md:hidden w-full h-56 flex-shrink-0">
          <Image
    src="/images/log.jpg"
    alt="forgot password illustration"
    fill
    className="object-cover"
    priority
  />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
          <Link
    href="/client/login"
    aria-label="Back to sign in"
    className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center text-white"
  >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
        </div>

        <div className="w-full md:w-1/2 px-6 py-6 sm:px-10 md:px-16 flex flex-col justify-center bg-white z-20 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">

            {step === "email" && <>
                <div className="mb-6 text-center md:text-left">
                  <p className="text-xs font-semibold text-[#8b0000] tracking-widest uppercase mb-1 font-poppins">
                    Forgot password?
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#8b0000] tracking-tight mb-2 font-poppins">
                    Reset your password
                  </h1>
                  <p className="text-gray-400 text-sm font-normal font-open-sans">
                    Enter your email and we&apos;ll send you a verification code.
                  </p>
                  {error && <p className="text-red-500 text-xs mt-2 font-bold tracking-tight">{error}</p>}
                </div>

                <form onSubmit={handleSendCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1 font-poppins">
                      Email
                    </label>
                    <input
    type="email"
    placeholder="you@example.com"
    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#8b0000]/20 focus:border-[#8b0000] focus:bg-white outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    disabled={isLoading}
  />
                  </div>

                  <button
    type="submit"
    disabled={isLoading}
    className={`w-full bg-[#8b0000] text-white py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#6b0000] transition-all shadow-xl shadow-[#8b0000]/20 active:scale-[0.98] mt-2 font-poppins flex items-center justify-center gap-2 ${isLoading ? "opacity-70" : ""}`}
  >
                    {isLoading ? <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        Sending...
                      </> : "Send Verification Code"}
                  </button>

                  <Link
    href="/client/login"
    className="block text-center text-sm font-medium text-[#8b0000] hover:underline transition-colors font-poppins pt-1"
  >
                    Back to sign in
                  </Link>
                </form>
              </>}

            {step === "reset" && <>
                <div className="mb-6 text-center md:text-left">
                  <p className="text-xs font-semibold text-[#8b0000] tracking-widest uppercase mb-1 font-poppins">
                    Check your email
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#8b0000] tracking-tight mb-2 font-poppins">
                    Enter verification code
                  </h1>
                  <p className="text-gray-400 text-sm font-normal font-open-sans">
                    We sent a 6-digit code to <span className="font-medium text-gray-600">{email}</span>. Enter it below with your new password.
                  </p>
                  {error && <p className="text-red-500 text-xs mt-2 font-bold tracking-tight">{error}</p>}
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1 font-poppins">
                      Verification Code
                    </label>
                    <input
    type="text"
    inputMode="numeric"
    maxLength={6}
    placeholder="123456"
    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#8b0000]/20 focus:border-[#8b0000] focus:bg-white outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans tracking-[0.3em] text-center"
    value={otp}
    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
    required
    disabled={isLoading}
  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1 font-poppins">
                      New Password
                    </label>
                    <div className="relative">
                      <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    className="w-full px-5 py-3 pr-12 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#8b0000]/20 focus:border-[#8b0000] focus:bg-white outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    required
    disabled={isLoading}
  />
                      <button
    type="button"
    onClick={() => setShowPassword((v) => !v)}
    aria-label={showPassword ? "Hide password" : "Show password"}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
                        {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1 font-poppins">
                      Confirm New Password
                    </label>
                    <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#8b0000]/20 focus:border-[#8b0000] focus:bg-white outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    disabled={isLoading}
  />
                  </div>

                  <button
    type="submit"
    disabled={isLoading}
    className={`w-full bg-[#8b0000] text-white py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#6b0000] transition-all shadow-xl shadow-[#8b0000]/20 active:scale-[0.98] mt-2 font-poppins flex items-center justify-center gap-2 ${isLoading ? "opacity-70" : ""}`}
  >
                    {isLoading ? <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        Resetting...
                      </> : "Reset Password"}
                  </button>

                  <button
    type="button"
    onClick={() => setStep("email")}
    className="block w-full text-center text-sm font-medium text-[#8b0000] hover:underline transition-colors font-poppins pt-1"
  >
                    Use a different email
                  </button>
                </form>
              </>}

            {step === "done" && <div className="text-center md:text-left">
                <div className="mx-auto md:mx-0 mb-4 w-14 h-14 rounded-full bg-[#8b0000]/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8b0000" strokeWidth="2" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#8b0000] tracking-tight mb-2 font-poppins">
                  Password reset
                </h1>
                <p className="text-gray-400 text-sm font-normal font-open-sans mb-6">
                  Your password has been updated successfully. You can now sign in with your new password.
                </p>
                <Link
    href="/client/login"
    className="block w-full text-center bg-[#8b0000] text-white py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#6b0000] transition-all shadow-xl shadow-[#8b0000]/20 active:scale-[0.98] font-poppins"
  >
                  Back to Sign In
                </Link>
              </div>}

          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-[#fafafa] relative items-center justify-center border-l border-gray-50 overflow-hidden flex-col">
          <div className="relative z-10 w-full h-[65%] flex items-center justify-center p-6">
            <div className="relative w-full h-full scale-[1.15]">
              <Image
    src="/images/log.jpg"
    alt="forgot password illustration"
    fill
    className="object-contain"
    priority
  />
            </div>
          </div>
          <div className="relative z-20 text-center px-10 pb-12">
            <p className="text-gray-500 text-sm font-normal max-w-[380px] mx-auto leading-relaxed font-poppins">
              This portal is for registered clients only. All access attempts are monitored.
            </p>
          </div>
          <div className="absolute top-10 right-10 w-40 h-40 border border-[#8b0000]/5 rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-[#8b0000]/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>;
}
export {
  ClientForgotPasswordPage as default
};
