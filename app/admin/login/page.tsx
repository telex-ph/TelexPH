'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminAuthenticateUrl, getVerifyLoginOtpUrl } from '@/lib/api-base'
import TurnstileWidget from '@/components/Turnstile/TurnstileWidget'
import WelcomeSlideshow from './WelcomeSlideshow'

// Login always lands on the dashboard root. Nothing sets a ?redirect= param
// any more — login URLs are kept clean — so there is no per-page target to
// restore.
const POST_LOGIN_TARGET = '/admin/dashboard'

const REQUEST_TIMEOUT_MS = 15000

// Wraps fetch with a timeout so a slow/unreachable backend (e.g. a cold
// Render instance) fails with a clear error instead of hanging the UI.
// Races a plain setTimeout alongside the abort signal: on some
// browser/network combinations abort() doesn't unstick an already-sent
// request, so the timer alone still has to be able to resolve this promise
// and let the UI recover even if the underlying connection stays open.
function fetchWithTimeout(input: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const fetchPromise = fetch(input, { ...init, signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId)
  })

  const timeoutPromise = new Promise<Response>((_, reject) => {
    setTimeout(() => reject(new DOMException('Request timed out', 'AbortError')), REQUEST_TIMEOUT_MS)
  })

  return Promise.race([fetchPromise, timeoutPromise])
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  )
}

function AdminLoginForm() {
  const [showMobileForm, setShowMobileForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [otp, setOtp] = useState('')
  const [otpEmail, setOtpEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  const handlelogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!turnstileToken) {
      setError('Please complete the human verification challenge.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetchWithTimeout(getAdminAuthenticateUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          turnstileToken,
          rememberMe,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      if (data.requiresOtp) {
        setOtpEmail(data.email)
        setStep('otp')
        setIsLoading(false)
        return
      }

      goToDashboard()

    } catch (err) {
      setError(err instanceof DOMException && err.name === 'AbortError'
        ? 'The server took too long to respond. Please try again.'
        : err instanceof Error ? err.message : 'An error occurred during login')
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetchWithTimeout(getVerifyLoginOtpUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: otpEmail,
          otp,
          rememberMe,
          accountType: 'admin',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      goToDashboard()
    } catch (err) {
      setError(err instanceof DOMException && err.name === 'AbortError'
        ? 'The server took too long to respond. Please try again.'
        : err instanceof Error ? err.message : 'An error occurred during verification')
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError('')
    setIsResending(true)

    try {
      const response = await fetchWithTimeout(getAdminAuthenticateUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          turnstileToken,
          rememberMe,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code')
      }

      if (data.requiresOtp) {
        setOtpEmail(data.email)
      }
    } catch (err) {
      setError(err instanceof DOMException && err.name === 'AbortError'
        ? 'The server took too long to respond. Please try again.'
        : err instanceof Error ? err.message : 'An error occurred while resending the code')
    } finally {
      setIsResending(false)
    }
  }

  const handleBackToCredentials = () => {
    setError('')
    setOtp('')
    setStep('credentials')
  }

  // Redirect to the post-login target with ?welcome=1 so the destination page
  // shows the "Login successful" overlay before its own content.
  //
  // Full navigation rather than router.push: the session cookie was just set by
  // the login response, and a hard load guarantees middleware evaluates the new
  // cookie jar. A soft navigation can be resolved against stale client state,
  // which left the button spinning on "Processing..." with nothing to recover it.
  const goToDashboard = () => {
    window.location.href = `${POST_LOGIN_TARGET}?welcome=1`
  }

  const loginForm = (
    <form onSubmit={handlelogin} className="space-y-2">
      <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1 ml-1 font-poppins">
          Email
        </label>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-.414.336-.75.75-.75h18c.414 0 .75.336.75.75v10.5a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" /></svg>
          <input
            id="admin-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            className="w-full pl-11 pr-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] focus:bg-white focus:scale-[1.01] outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1 ml-1 font-poppins">
          Password
        </label>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 10.5h10.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H6.75a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5z" /></svg>
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full pl-11 pr-12 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] focus:bg-white focus:scale-[1.01] outline-none transition-all text-gray-800 text-sm font-normal shadow-sm font-open-sans"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer font-open-sans">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#800000] rounded border-gray-300 cursor-pointer"
          />
          Remember me
        </label>
        <Link href="/admin/login/forgot-password" className="text-sm font-medium text-[#800000] hover:underline transition-colors font-poppins">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading || !email || !password}
        className={`w-full bg-[#800000] text-white py-2.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#600000] hover:-translate-y-0.5 hover:shadow-2xl transition-all shadow-xl shadow-[#800000]/20 active:scale-[0.98] font-poppins flex items-center justify-center gap-2 animate-fade-in-up disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-xl ${isLoading ? 'opacity-70' : ''}`}
        style={{ animationDelay: '0.22s' }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Processing...
          </>
        ) : (
          <>
            Log In
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </>
        )}
      </button>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.24s' }}>
        <TurnstileWidget
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken('')}
        />
      </div>

      <div className="relative flex items-center !mt-2">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-3 text-xs text-gray-400 font-open-sans">or</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <p className="text-center text-sm text-gray-500 font-open-sans !mt-2">
        Need help?{' '}
        <span className="text-[#800000] font-semibold cursor-pointer hover:underline">Contact</span> your system administrator.
      </p>

      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-open-sans !mt-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
        Your data is encrypted and secure.
      </p>
    </form>
  )

  const otpForm = (
    <form onSubmit={handleVerifyOtp} className="space-y-2">
      <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <label htmlFor="admin-otp" className="block text-sm font-medium text-gray-700 mb-1 ml-1 font-poppins">
          Verification code
        </label>
        <input
          id="admin-otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          autoComplete="one-time-code"
          autoFocus
          className="w-full px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] focus:bg-white focus:scale-[1.01] outline-none transition-all text-gray-800 text-center text-lg tracking-[0.4em] font-semibold shadow-sm font-open-sans"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          required
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1.5 ml-1 font-open-sans">
          We sent a 6-digit code to {otpEmail}.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className={`w-full bg-[#800000] text-white py-2.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#600000] hover:-translate-y-0.5 hover:shadow-2xl transition-all shadow-xl shadow-[#800000]/20 active:scale-[0.98] font-poppins flex items-center justify-center gap-2 animate-fade-in-up ${isLoading || otp.length !== 6 ? 'opacity-70' : ''}`}
        style={{ animationDelay: '0.1s' }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Verifying...
          </>
        ) : (
          'Verify Code'
        )}
      </button>

      <div className="flex items-center justify-between !mt-3 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <button
          type="button"
          onClick={handleBackToCredentials}
          disabled={isLoading}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors font-poppins"
        >
          &larr; Back
        </button>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isResending || isLoading}
          className="text-sm font-medium text-[#800000] hover:underline transition-colors font-poppins disabled:opacity-60"
        >
          {isResending ? 'Resending...' : 'Resend code'}
        </button>
      </div>
    </form>
  )

  return (
    <div className="h-dvh w-full relative flex items-center justify-center p-0 md:p-8 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.webp"
          alt="background"
          fill
          className="object-cover brightness-[0.4] contrast-[1.1]"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#800000]/30" />
      </div>

      <div className="relative z-10 w-full h-full md:h-auto md:max-w-5xl bg-white md:rounded-2xl shadow-[0_60px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row border border-white/10 font-open-sans">

        {/* mobile: welcome screen, only visible below md and before the user taps Sign In */}
        {!showMobileForm && (
          <div className="relative md:hidden w-full h-full flex flex-col items-center justify-end overflow-hidden bg-black">
            <WelcomeSlideshow />
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a0000]/90 via-[#1a0000]/85 to-black/90" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="mb-6 w-20 h-20 relative animate-illo-float-slow">
                <Image src="/images/Tlxlogo.webp" alt="TelexPH logo" fill className="object-contain" priority />
              </div>
              <p className="text-xs font-semibold text-[#ff5555] tracking-widest uppercase mb-2 font-poppins animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Admin Portal
              </p>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-3 font-poppins animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Telex<span className="text-[#ff2b2b]">PH</span>
              </h1>
              <p className="text-gray-300 text-sm font-normal font-open-sans animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                Manage operations, teams,
              </p>
              <p className="text-gray-300 text-sm font-normal font-open-sans animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                and clients in one place.
              </p>
            </div>

            <div className="relative z-10 w-full px-6 pb-10 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setShowMobileForm(true)
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#800000] to-[#a10000] text-white py-4 rounded-xl font-semibold text-sm tracking-wide hover:brightness-110 transition-all shadow-xl shadow-[#800000]/40 active:scale-[0.98] font-poppins animate-pulse-glow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 10.5h10.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H6.75a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5z" /></svg>
                Log in to Continue
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
              <p className="flex items-center gap-1.5 text-[11px] text-gray-400 font-open-sans mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[#a10000]"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                Secure. Reliable. Built for Performance.
              </p>
            </div>
          </div>
        )}

        {/* mobile: compact sign-in form */}
        {showMobileForm && (
          <div className="relative md:hidden w-full h-full overflow-y-auto flex flex-col bg-gradient-to-br from-[#4a0000] via-[#800000] to-[#2a0000]">
            {/* red header band — locked to a 30% share of the container (panel below takes the other 70%), so the ratio stays balanced instead of the header ballooning on tall devices */}
            <div className="relative w-full basis-[30%] min-h-[110px]">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setShowMobileForm(false)
                }}
                aria-label="Back"
                className="absolute top-3 left-4 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white z-20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* illustration, anchored to the header's own bottom edge so it always straddles the header/panel boundary no matter how tall the header grows.
                  bottom-0 + translate-y-1/3 (instead of a fixed px offset) keeps the same overlap ratio no matter how big the asset itself renders. */}
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

            {/* curved white form panel, pulled up so its top edge sits mid-illustration — basis is 70% PLUS the 2.5rem it loses to -mt-10 (the negative margin that pulls it up over the header), so the panel's visible height still comes out to exactly 70% of the container instead of leaving a gap of background color at the very bottom */}
            <div className="relative bg-white rounded-t-[40px] -mt-10 basis-[calc(70%_+_2.5rem)] shrink-0">
              <div className="px-6 pt-16 sm:pt-[90px] pb-4 animate-fade-in-up">
                <div className="mb-3 text-center">
                  <p className="text-xs font-semibold text-[#800000] tracking-widest uppercase mb-1 font-poppins">
                    Welcome back!
                  </p>
                  <h1 className="text-xl font-bold tracking-tight mb-1 font-poppins">
                    {step === 'otp' ? (
                      <>
                        <span className="text-gray-900">Verify </span>
                        <span className="text-[#800000]">your identity</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-900">Log in </span>
                        <span className="text-[#800000]">to continue</span>
                      </>
                    )}
                  </h1>
                  <p className="text-gray-400 text-xs font-normal font-open-sans">
                    {step === 'otp'
                      ? 'Enter the code sent to your email'
                      : 'Enter your credentials to access your account'}
                  </p>
                  {error && (
                    <p className="text-red-500 text-xs mt-2 font-bold tracking-tight">{error}</p>
                  )}
                </div>
                {step === 'otp' ? otpForm : loginForm}
              </div>
            </div>
          </div>
        )}

        {/* desktop form panel, always visible at md and up */}
        <div className="hidden md:flex md:w-1/2 px-10 py-12 lg:px-16 flex-col justify-center bg-white z-20 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 text-left">
              <p className="text-xs font-semibold text-[#800000] tracking-widest uppercase mb-1 font-poppins">
                Welcome back!
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-poppins">
                {step === 'otp' ? (
                  <>
                    <span className="text-gray-900">Verify </span>
                    <span className="text-[#800000]">your identity</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-900">Sign in </span>
                    <span className="text-[#800000]">to continue</span>
                  </>
                )}
              </h1>
              <p className="text-gray-400 text-sm font-normal font-open-sans">
                {step === 'otp'
                  ? 'Enter the code sent to your email'
                  : 'Enter your credentials to access your account'}
              </p>
              {error && (
                <p role="alert" className="text-red-500 text-xs mt-2 font-bold tracking-tight">{error}</p>
              )}
            </div>
            {step === 'otp' ? otpForm : loginForm}
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-[#fafafa] relative items-center justify-center border-l border-gray-50 overflow-hidden flex-col">
          <div className="relative z-10 w-full h-[65%] flex items-center justify-center p-6">
            <div className="relative w-full h-full scale-[1.15] transition-transform duration-1000 animate-gentle-float">
              <Image
                src="/images/log.jpg"
                alt="login illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="relative z-20 text-center px-10 pb-12">
            <p className="text-gray-500 text-sm font-normal max-w-[380px] mx-auto leading-relaxed font-poppins">
              This system is strictly for administrative use. all access attempts are monitored and unauthorized entry is prohibited.
            </p>
          </div>
          <div className="absolute top-10 right-10 w-40 h-40 border border-[#800000]/5 rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-[#800000]/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}