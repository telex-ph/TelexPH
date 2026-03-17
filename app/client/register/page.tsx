'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ClientRegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/auth/client/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Registration failed')
      router.push('/client/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  const getStrength = (p: string) => {
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  const strength = getStrength(password)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#DC2626', '#D97706', '#059669', '#2563EB'][strength]

  if (!mounted) return null

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#f7f0f0' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Nunito', sans-serif; }

        @keyframes floatMain {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-9px) rotate(1deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50%       { transform: translateY(-7px) rotate(-1deg); }
        }
        @keyframes shieldBob {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          45%      { transform: translateY(-8px) rotate(0.5deg); }
          65%      { transform: translateY(3px) rotate(-0.5deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.65; transform: scale(1.08); }
        }
        @keyframes spinDash {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -80; }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-float-main  { animation: floatMain 4.5s ease-in-out infinite; }
        .animate-float-badge { animation: floatBadge 5s ease-in-out infinite; animation-delay: 0.6s; }
        .animate-float-slow  { animation: floatSlow 6s ease-in-out infinite; animation-delay: 1.2s; }
        .animate-slide-in    { animation: slideIn 0.5s ease-out forwards; }
        .shield-bob          { animation: shieldBob 4.5s ease-in-out infinite; }
        .glow-pulse          { animation: glowPulse 3s ease-in-out infinite; }
        .spin-dash           { animation: spinDash 4s linear infinite; }
        .check-draw          { stroke-dasharray: 60; animation: checkDraw 1.2s ease-out 0.5s both; }

        .fade-up-1 { animation: fadeUp 0.6s ease-out 0.2s both; }
        .fade-up-2 { animation: fadeUp 0.6s ease-out 0.35s both; }
        .fade-up-3 { animation: fadeUp 0.6s ease-out 0.5s both; }
        .fade-up-4 { animation: fadeUp 0.6s ease-out 0.65s both; }
        .fade-up-5 { animation: fadeUp 0.6s ease-out 0.8s both; }
        .fade-up-6 { animation: fadeUp 0.6s ease-out 0.95s both; }

        .input-field {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border: 1.5px solid #e8d0d0;
          border-radius: 10px;
          background: #fdf8f8;
          font-size: 14px;
          color: #1a1a2e;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #800000;
          box-shadow: 0 0 0 3px rgba(128,0,0,0.10);
        }
        .reg-btn:hover {
          background: linear-gradient(90deg, #600000, #900000) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(128,0,0,0.40) !important;
        }
      `}</style>

      <div
        className="relative w-full flex overflow-hidden animate-slide-in"
        style={{
          maxWidth: 930, minHeight: 500, borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.13), 0 4px 20px rgba(0,0,0,0.07)',
          background: '#fff', margin: '24px', border: '1px solid #f0e8e8',
          flexDirection: 'row-reverse',
        }}
      >
        {/* RIGHT: Form */}
        <div className="flex flex-col justify-center"
          style={{ width: '44%', padding: '44px 48px', zIndex: 10, minWidth: 300 }}>

          <div className="fade-up-1">
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Create Account</h1>
            <p style={{ fontSize: 14, color: '#555', fontWeight: 500, marginBottom: 24 }}>
              Join the Client Portal today
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fff5f5', border: '1.5px solid #e8d0d0', borderRadius: 10,
              padding: '12px 16px', marginBottom: 14, fontSize: 13, color: '#333', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Name row */}
            <div className="fade-up-2" style={{ display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input type="text" placeholder="First name" className="input-field"
                  value={firstName} onChange={e => setFirstName(e.target.value)} required disabled={isLoading} />
              </div>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input type="text" placeholder="Last name" className="input-field"
                  value={lastName} onChange={e => setLastName(e.target.value)} required disabled={isLoading} />
              </div>
            </div>

            {/* Email */}
            <div className="fade-up-3" style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <input type="email" placeholder="Email address" className="input-field"
                value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
            </div>

            {/* Password */}
            <div className="fade-up-4">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input type={showPassword ? 'text' : 'password'} placeholder="Password"
                  className="input-field" style={{ paddingRight: 42 }}
                  value={password} onChange={e => setPassword(e.target.value)} required disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showPassword
                    ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              {password && (
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, display: 'flex', gap: 3 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= strength ? strengthColor : '#e8d0d0', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: strengthColor, minWidth: 36 }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="fade-up-5" style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </span>
              <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm password"
                className="input-field"
                style={{ paddingRight: 42, borderColor: confirmPassword && password !== confirmPassword ? '#DC2626' : undefined }}
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required disabled={isLoading} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', alignItems: 'center' }}>
                {showConfirm
                  ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
              {confirmPassword && password !== confirmPassword && (
                <p style={{ fontSize: 11, color: '#DC2626', marginTop: 4, fontWeight: 600 }}>Passwords don't match</p>
              )}
            </div>

            {/* Submit */}
            <div className="fade-up-6" style={{ marginTop: 2 }}>
              <button type="submit" disabled={isLoading} className="reg-btn"
                style={{
                  width: '100%', padding: '13px',
                  background: isLoading ? '#b05555' : 'linear-gradient(90deg, #800000, #a00000)',
                  color: '#ffffff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(128,0,0,0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
              <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: '#555', fontWeight: 500 }}>
                Already have an account?{' '}
                <Link href="/client/login" style={{ color: '#800000', fontWeight: 700, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* LEFT: Illustration Panel */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>

          {/* Background blobs — mirrored from login (blob opens toward LEFT) */}
          <svg viewBox="0 0 520 460" xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="gMid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c04040" /><stop offset="100%" stopColor="#900000" />
              </linearGradient>
              <linearGradient id="gDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#800000" /><stop offset="100%" stopColor="#500000" />
              </linearGradient>
            </defs>
            {/* Layer 1: light blush */}
            <path d="M 480 0 Q 0 0 0 40 L 0 460 Q 0 460 260 460 Q 460 460 500 340 Q 550 200 480 0 Z" fill="#fff0f0" opacity="0.8" />
            {/* Layer 2: medium red */}
            <path d="M 430 0 Q 0 0 0 60 L 0 460 Q 0 460 220 458 Q 410 452 440 330 Q 490 200 430 0 Z" fill="url(#gMid)" opacity="0.35" />
            {/* Layer 3: deep maroon */}
            <path d="M 360 0 Q 0 0 0 80 L 0 460 Q 0 460 160 456 Q 340 446 365 320 Q 410 195 360 0 Z" fill="url(#gDark)" opacity="0.90" />
          </svg>

          {/* 3D ISOMETRIC SHIELD */}
          <div className="animate-float-main" style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px 8px 16px 24px', zIndex: 2,
          }}>
            <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ width: '90%', maxWidth: 240, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
              <defs>
                <linearGradient id="pT2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5e6e6"/><stop offset="100%" stopColor="#e8cccc"/>
                </linearGradient>
                <linearGradient id="pL2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c08888"/><stop offset="100%" stopColor="#a06060"/>
                </linearGradient>
                <linearGradient id="pR2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8a4040"/><stop offset="100%" stopColor="#6a2020"/>
                </linearGradient>
                <linearGradient id="shFront" x1="0%" y1="0%" x2="60%" y2="100%">
                  <stop offset="0%" stopColor="#ff7777"/><stop offset="100%" stopColor="#aa0000"/>
                </linearGradient>
                <linearGradient id="shLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cc1111"/><stop offset="100%" stopColor="#880000"/>
                </linearGradient>
                <linearGradient id="shRight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#660000"/><stop offset="100%" stopColor="#440000"/>
                </linearGradient>
                <linearGradient id="shTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff9999"/><stop offset="100%" stopColor="#cc3333"/>
                </linearGradient>
                <linearGradient id="shInner" x1="0%" y1="0%" x2="60%" y2="100%">
                  <stop offset="0%" stopColor="#ff9999"/><stop offset="100%" stopColor="#cc2222"/>
                </linearGradient>
                <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE066"/><stop offset="100%" stopColor="#FFA500"/>
                </linearGradient>
                <filter id="softDrop2" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.38"/>
                </filter>
                <filter id="glow4" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              <ellipse cx="150" cy="302" rx="90" ry="11" fill="#000" opacity="0.25"/>

              {/* PLATFORM */}
              <polygon points="150,238 238,190 150,142 62,190" fill="url(#pT2)" stroke="#c8aaaa" strokeWidth="0.8"/>
              <polygon points="62,190 150,142 150,162 62,210"  fill="url(#pL2)" stroke="#b08080" strokeWidth="0.7"/>
              <polygon points="238,190 150,142 150,162 238,210" fill="url(#pR2)" stroke="#884444" strokeWidth="0.7"/>
              <polygon points="62,210 150,162 150,182 62,230"  fill="#7a3030" stroke="#5a1818" strokeWidth="0.7"/>
              <polygon points="238,210 150,162 150,182 238,230" fill="#601818" stroke="#440000" strokeWidth="0.7"/>

              {/* SHIELD BODY */}
              <g className="shield-bob" filter="url(#softDrop2)">
                <path d="M 195 90 Q 214 90 218 112 L 218 168 Q 218 200 195 222 L 178 234 L 178 214 Q 198 196 198 168 L 198 115 Q 196 100 182 100 Z"
                  fill="url(#shRight)" stroke="#330000" strokeWidth="0.7"/>
                <path d="M 105 90 Q 86 90 82 112 L 82 168 Q 82 200 105 222 L 122 234 L 122 214 Q 102 196 102 168 L 102 115 Q 104 100 118 100 Z"
                  fill="url(#shLeft)" stroke="#550000" strokeWidth="0.7"/>
                <path d="M 122 234 L 150 254 L 178 234 L 178 214 L 150 234 L 122 214 Z"
                  fill="#550000" stroke="#330000" strokeWidth="0.7"/>
                <path d="M 105 90 Q 150 72 195 90 L 182 100 Q 150 84 118 100 Z"
                  fill="url(#shTop)" stroke="rgba(255,210,210,0.5)" strokeWidth="0.8"/>
                <path d="M 118 100 Q 150 84 182 100 L 198 115 L 198 168 Q 198 196 178 214 L 150 234 L 122 214 Q 102 196 102 168 L 102 115 Z"
                  fill="url(#shFront)" stroke="rgba(255,180,180,0.3)" strokeWidth="1"/>
                <path d="M 128 104 Q 150 90 172 104 L 168 118 Q 150 106 132 118 Z"
                  fill="rgba(255,255,255,0.22)"/>
                <path d="M 116 118 L 116 148 Q 116 152 118 155 L 110 155 Q 107 151 107 145 L 107 120 Z"
                  fill="rgba(255,255,255,0.10)"/>
                <path d="M 126 112 Q 150 98 174 112 L 188 124 L 188 166 Q 188 190 172 206 L 150 222 L 128 206 Q 112 190 112 166 L 112 124 Z"
                  fill="url(#shInner)" opacity="0.30" stroke="rgba(255,220,220,0.25)" strokeWidth="1.5"/>
                <g filter="url(#glow4)">
                  <circle cx="150" cy="162" r="26" fill="rgba(0,0,0,0.18)"/>
                  <circle cx="150" cy="162" r="24" fill="rgba(255,200,50,0.22)" stroke="url(#goldG)" strokeWidth="2"/>
                  <path d="M 136 162 l 9 9 19 -22"
                    stroke="url(#goldG)" strokeWidth="5" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="check-draw"/>
                </g>
                <ellipse cx="150" cy="188" rx="18" ry="5" fill="#FFD700" opacity="0.18" className="glow-pulse"/>
              </g>

              {/* Floating badge: Verified */}
              <g transform="translate(196, 36)" className="animate-float-badge">
                <rect width="86" height="32" rx="16" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2"/>
                <circle cx="17" cy="16" r="9" fill="#059669"/>
                <path d="M13 16 l3 3 5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="31" y="11" width="40" height="4.5" rx="2.2" fill="white" opacity="0.65"/>
                <rect x="31" y="18" width="26" height="3.5" rx="1.8" fill="white" opacity="0.30"/>
              </g>

              {/* Floating badge: Member star */}
              <g transform="translate(14, 200)" className="animate-float-slow">
                <rect width="84" height="32" rx="16" fill="rgba(255,200,50,0.22)" stroke="rgba(255,200,50,0.55)" strokeWidth="1.2"/>
                <circle cx="17" cy="16" r="9" fill="#F59E0B"/>
                <polygon points="17,9 18.5,13.5 23.5,13.5 19.5,16.5 21,21 17,18 13,21 14.5,16.5 10.5,13.5 15.5,13.5" fill="white" opacity="0.9"/>
                <rect x="31" y="11" width="38" height="4.5" rx="2.2" fill="white" opacity="0.65"/>
                <rect x="31" y="18" width="26" height="3.5" rx="1.8" fill="white" opacity="0.30"/>
              </g>

              {/* Spinning orbit ring */}
              <circle cx="150" cy="158" r="110"
                stroke="rgba(255,255,255,0.10)" strokeWidth="1" fill="none"
                strokeDasharray="6 10"
                className="spin-dash"
                style={{ transformOrigin: '150px 158px' }}/>

              {/* Shield micro icon */}
              <g transform="translate(30, 52)">
                <circle cx="0" cy="0" r="16" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
                <path d="M -7 -3 Q 0 -12 7 -3 L 7 5 Q 0 10 -7 5 Z" fill="rgba(255,210,80,0.85)"/>
                <path d="M -3.5 1.5 l 2.5 2.5 5 -6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </g>

              {/* Sparkles */}
              <g transform="translate(228, 50)" filter="url(#glow4)">
                <polygon points="0,-7 1.5,-2.5 6,-2.5 2.5,1 4,6 0,3 -4,6 -2.5,1 -6,-2.5 -1.5,-2.5" fill="#FFD700" opacity="0.85"/>
              </g>
              <g transform="translate(55, 228)">
                <polygon points="0,-5 3.5,0 0,5 -3.5,0" fill="#FF9944" opacity="0.8"/>
              </g>
              <circle cx="220" cy="200" r="4" fill="#FFE066" opacity="0.6"/>
              <circle cx="60"  cy="90"  r="3" fill="#ff8888" opacity="0.55"/>
              <circle cx="232" cy="130" r="2.5" fill="#FFB347" opacity="0.5"/>
              <circle cx="52"  cy="260" r="2" fill="#FFB700" opacity="0.4"/>
            </svg>
          </div>

          {/* Plus button bottom-left */}
          <div style={{
            position: 'absolute', bottom: 28, left: 32, width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}