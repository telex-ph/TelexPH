
import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAdminAuthenticateUrl, getVerifyLoginOtpUrl } from "@/lib/api-base";
import TurnstileWidget from "@/components/Turnstile/TurnstileWidget";
import { Alert, Field, Header, Icon, IllustrationPanel, LinkButton, OtpInput, PasswordToggle, SubmitButton, useCooldown } from "./AuthUi";
import WelcomeSlideshow from "./WelcomeSlideshow";
import ContactAdminModal from "./ContactAdminModal";
const POST_LOGIN_TARGET = "/admin/dashboard";
const REQUEST_TIMEOUT_MS = 15e3;
function fetchWithTimeout(input, init = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const fetchPromise = fetch(input, { ...init, signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId);
  });
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new DOMException("Request timed out", "AbortError")), REQUEST_TIMEOUT_MS);
  });
  return Promise.race([fetchPromise, timeoutPromise]);
}
async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    throw new Error(
      response.ok
        ? "The server returned an empty response. Please try again."
        : `Request failed with status ${response.status}. Please try again.`
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The server returned an unexpected response. Please try again.");
  }
}
function AdminLoginPage() {
  return <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>;
}
function AdminLoginForm() {
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const resetTurnstile = () => {
    setTurnstileToken("");
    setTurnstileKey((k) => k + 1);
  };
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("credentials");
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendLeft, startResendCooldown] = useCooldown(30);
  const [showContactAdmin, setShowContactAdmin] = useState(false);
  const handlelogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!turnstileToken) {
      setError("Please complete the human verification challenge.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchWithTimeout(getAdminAuthenticateUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          turnstileToken,
          rememberMe
        })
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }
      if (data.requiresOtp) {
        setOtpEmail(data.email);
        setStep("otp");
        startResendCooldown();
        setIsLoading(false);
        return;
      }
      goToDashboard();
    } catch (err) {
      setError(err instanceof DOMException && err.name === "AbortError" ? "The server took too long to respond. Please try again." : err instanceof Error ? err.message : "An error occurred during login");
      resetTurnstile();
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetchWithTimeout(getVerifyLoginOtpUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: otpEmail,
          otp,
          rememberMe,
          accountType: "admin"
        })
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }
      goToDashboard();
    } catch (err) {
      setError(err instanceof DOMException && err.name === "AbortError" ? "The server took too long to respond. Please try again." : err instanceof Error ? err.message : "An error occurred during verification");
      setIsLoading(false);
    }
  };
  const handleResendOtp = async () => {
    setError("");
    setIsResending(true);
    try {
      const response = await fetchWithTimeout(getAdminAuthenticateUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          turnstileToken,
          rememberMe
        })
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }
      if (data.requiresOtp) {
        setOtpEmail(data.email);
        setOtp("");
        startResendCooldown();
      }
    } catch (err) {
      setError(err instanceof DOMException && err.name === "AbortError" ? "The server took too long to respond. Please try again." : err instanceof Error ? err.message : "An error occurred while resending the code");
    } finally {
      setIsResending(false);
    }
  };
  const handleBackToCredentials = () => {
    setError("");
    setOtp("");
    setStep("credentials");
  };
  const goToDashboard = () => {
    window.location.href = `${POST_LOGIN_TARGET}?welcome=1`;
  };
  const eyeToggle = <PasswordToggle shown={showPassword} onClick={() => setShowPassword((v) => !v)} />;
  const loginForm = <form onSubmit={handlelogin} className="space-y-4">
      <Alert>{error}</Alert>
      <div className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
        <Field
    id="admin-email"
    label="Email"
    icon="mail"
    type="email"
    placeholder="you@example.com"
    autoComplete="email"
    autoFocus
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    disabled={isLoading}
  />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <Field
    id="admin-password"
    label="Password"
    icon="lock"
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    autoComplete="current-password"
    capsHint
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    disabled={isLoading}
    right={eyeToggle}
  />
      </div>

      <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer font-open-sans">
          <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
    className="w-4 h-4 accent-[var(--brand-red)] rounded border-gray-300 cursor-pointer"
  />
          Remember me
        </label>
        <LinkButton as={Link} href="/admin/login/forgot-password">Forgot password?</LinkButton>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <TurnstileWidget
    key={turnstileKey}
    onVerify={setTurnstileToken}
    onExpire={() => setTurnstileToken("")}
  />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
        <SubmitButton loading={isLoading} loadingText="Processing..." disabled={!email || !password}>
          Log In
          <Icon name="arrow" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        </SubmitButton>
      </div>

      <p className="text-center text-sm text-gray-500 font-open-sans !mt-5">
        Need help?{" "}
        <LinkButton onClick={() => setShowContactAdmin(true)}>Contact</LinkButton> your system administrator.
      </p>

      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-open-sans !mt-2">
        <Icon name="shield" className="w-4 h-4" />
        Your data is encrypted and secure.
      </p>
    </form>;
  const otpForm = <form onSubmit={handleVerifyOtp} className="space-y-4">
      <Alert>{error}</Alert>
      <div className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
        <span className="block text-[13px] font-semibold text-gray-700 mb-1.5 ml-0.5 font-poppins">Verification code</span>
        <OtpInput value={otp} onChange={setOtp} disabled={isLoading} autoFocus invalid={!!error} />
        <p className="text-xs text-gray-500 mt-2 ml-0.5 font-open-sans">
          We sent a 6-digit code to <span className="font-semibold text-gray-700 break-all">{otpEmail}</span>.
        </p>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <SubmitButton loading={isLoading} loadingText="Verifying..." disabled={otp.length !== 6}>Verify Code</SubmitButton>
      </div>

      <div className="flex items-center justify-between !mt-5 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <LinkButton onClick={handleBackToCredentials} disabled={isLoading} className="!text-gray-500 inline-flex items-center gap-1.5">
          <Icon name="back" className="w-3.5 h-3.5" />
          Back
        </LinkButton>
        <LinkButton onClick={handleResendOtp} disabled={isResending || isLoading || resendLeft > 0}>
          {isResending ? "Resending..." : resendLeft > 0 ? `Resend in ${resendLeft}s` : "Resend code"}
        </LinkButton>
      </div>
    </form>;
  return <div className="h-dvh w-full relative flex items-center justify-center p-0 md:p-8 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
    src="/images/background.webp"
    alt="background"
    fill
    className="object-cover brightness-[0.4] contrast-[1.1]"
    priority
    quality={90}
  />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[var(--brand-red)]/30" />
      </div>

      <div className="relative z-10 w-full h-full md:h-auto md:min-h-[min(640px,92dvh)] md:max-w-5xl bg-white md:rounded-3xl shadow-[0_60px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row border border-white/10 font-open-sans">

        {
    /* mobile: welcome screen, only visible below md and before the user taps Sign In */
  }
        {!showMobileForm && <div className="relative md:hidden w-full h-full flex flex-col items-center justify-end overflow-hidden bg-black">
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
              <div className="mb-6 w-20 h-20 relative animate-illo-float-slow">
                <Image src="/images/Tlxlogo.webp" alt="TelexPH logo" fill className="object-contain" priority />
              </div>
              <p className="text-xs font-semibold text-[#ff5555] tracking-widest uppercase mb-2 font-poppins animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Admin Portal
              </p>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-3 font-poppins animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                Telex<span className="text-[#ff2b2b]">PH</span>
              </h1>
              <p className="text-gray-300 text-sm font-normal font-open-sans animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                Manage operations, teams,
              </p>
              <p className="text-gray-300 text-sm font-normal font-open-sans animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
                and clients in one place.
              </p>
            </div>

            <div className="relative z-10 w-full px-6 pb-10 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
              <button
    type="button"
    onClick={() => {
      setError("");
      setShowMobileForm(true);
    }}
    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-red)] text-white py-4 rounded-xl font-semibold text-sm tracking-wide hover:brightness-110 transition-all shadow-xl shadow-[var(--brand-red)]/40 active:scale-[0.98] font-poppins animate-pulse-glow"
  >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 10.5h10.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H6.75a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5z" /></svg>
                Log in to Continue
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
              <p className="flex items-center gap-1.5 text-[11px] text-gray-400 font-open-sans mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[var(--brand-red)]"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                Secure. Reliable. Built for Performance.
              </p>
            </div>
          </div>}

        {
    /* mobile: compact sign-in form */
  }
        {showMobileForm && <div className="relative md:hidden w-full h-full overflow-y-auto flex flex-col bg-gradient-to-br from-[var(--brand-maroon)] via-[var(--brand-red)] to-[#2a0000]">
            {
    /* red header band — locked to a 30% share of the container (panel below takes the other 70%), so the ratio stays balanced instead of the header ballooning on tall devices */
  }
            <div className="relative w-full basis-[30%] min-h-[110px]">
              <div
    className="absolute inset-0 opacity-30"
    style={{
      backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
      backgroundSize: "24px 24px"
    }}
  />
              <button
    type="button"
    onClick={() => {
      setError("");
      setShowMobileForm(false);
    }}
    aria-label="Back"
    className="absolute top-3 left-4 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white z-20"
  >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>

              {
    /* illustration, anchored to the header's own bottom edge so it always straddles the header/panel boundary no matter how tall the header grows.
       bottom-0 + translate-y-1/3 (instead of a fixed px offset) keeps the same overlap ratio no matter how big the asset itself renders. */
  }
              <div className="absolute inset-x-0 bottom-0 translate-y-1/3 flex justify-center pointer-events-none z-20">
                <div className="relative w-full max-w-[clamp(170px,27vh,260px)] aspect-[558/447] animate-illo-float-slow">
                  <Image
    src="/images/loginformicon-removebg-preview.png"
    alt="Secure login"
    fill
    className="object-contain drop-shadow-2xl"
    priority
  />
                </div>
              </div>
            </div>

            {
    /* curved white form panel, pulled up so its top edge sits mid-illustration — basis is 70% PLUS the 2.5rem it loses to -mt-10 (the negative margin that pulls it up over the header), so the panel's visible height still comes out to exactly 70% of the container instead of leaving a gap of background color at the very bottom */
  }
            <div className="relative bg-white rounded-t-[40px] -mt-10 basis-[calc(70%_+_2.5rem)] shrink-0">
              <div className="px-6 pt-24 sm:pt-[100px] pb-6 animate-fade-in-up">
                <div className="mb-3 text-center">
                  <p className="text-xs font-semibold text-[var(--brand-red)] tracking-widest uppercase mb-1 font-poppins">
                    Welcome back!
                  </p>
                  <h1 className="text-xl font-bold tracking-tight mb-1 font-poppins">
                    {step === "otp" ? <>
                        <span className="text-gray-900">Verify </span>
                        <span className="text-[var(--brand-red)]">your identity</span>
                      </> : <>
                        <span className="text-gray-900">Log in </span>
                        <span className="text-[var(--brand-red)]">to continue</span>
                      </>}
                  </h1>
                  <p className="text-gray-400 text-xs font-normal font-open-sans">
                    {step === "otp" ? "Enter the code sent to your email" : "Enter your credentials to access your account"}
                  </p>
                </div>
                {step === "otp" ? otpForm : loginForm}
              </div>
            </div>
          </div>}

        {
    /* desktop form panel, always visible at md and up */
  }
        <div className="hidden md:flex md:w-1/2 px-14 py-10 flex-col justify-center bg-white z-20 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <Header
    eyebrow={step === "otp" ? "Two-step verification" : "Welcome back!"}
    title={step === "otp" ? <>Verify <span style={{ color: "var(--brand-red)" }}>your identity</span></> : <>Sign in <span style={{ color: "var(--brand-red)" }}>to continue</span></>}
    subtitle={step === "otp" ? "Enter the code sent to your email to finish signing in." : "Enter your credentials to access your account."}
  />
            {step === "otp" ? otpForm : loginForm}
          </div>
        </div>

        <IllustrationPanel />
      </div>

      {showContactAdmin && <ContactAdminModal onClose={() => setShowContactAdmin(false)} />}
    </div>;
}
export {
  AdminLoginPage as default
};
