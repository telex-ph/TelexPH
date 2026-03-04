'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ClientLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/client/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Authentication failed')
      router.push('/client/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

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
        @keyframes barRise1 {
          0%   { transform: scaleY(0); }
          60%  { transform: scaleY(1.08); }
          100% { transform: scaleY(1); }
        }
        @keyframes barRise2 {
          0%   { transform: scaleY(0); }
          70%  { transform: scaleY(1.05); }
          100% { transform: scaleY(1); }
        }
        @keyframes barRise3 {
          0%   { transform: scaleY(0); }
          80%  { transform: scaleY(1.06); }
          100% { transform: scaleY(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes lineGrow {
          from { stroke-dashoffset: 300; }
          to   { stroke-dashoffset: 0; }
        }

        .animate-float-main  { animation: floatMain 4.5s ease-in-out infinite; }
        .animate-float-badge { animation: floatBadge 5s ease-in-out infinite; animation-delay: 0.6s; }
        .animate-float-slow  { animation: floatSlow 6s ease-in-out infinite; animation-delay: 1.2s; }
        .animate-slide-in    { animation: slideIn 0.5s ease-out forwards; }

        .bar1 { transform-origin: bottom; animation: barRise1 1s ease-out 0.3s both; }
        .bar2 { transform-origin: bottom; animation: barRise2 1s ease-out 0.5s both; }
        .bar3 { transform-origin: bottom; animation: barRise3 1s ease-out 0.7s both; }
        .bar4 { transform-origin: bottom; animation: barRise1 1s ease-out 0.9s both; }

        .trend-line {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: lineGrow 1.5s ease-out 1s forwards;
        }

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
        .login-btn:hover {
          background: linear-gradient(90deg, #600000, #900000) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(128,0,0,0.40) !important;
        }
      `}</style>

      <div
        className="relative w-full flex overflow-hidden animate-slide-in"
        style={{
          maxWidth: 860,
          minHeight: 460,
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.13), 0 4px 20px rgba(0,0,0,0.07)',
          background: '#fff',
          margin: '24px',
          border: '1px solid #f0e8e8',
        }}
      >
        {/* ── LEFT: Form ── */}
        <div className="flex flex-col justify-center" style={{ width: '44%', padding: '52px 48px', zIndex: 10, minWidth: 280 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Login</h1>
          <p style={{ fontSize: 14, color: '#555', fontWeight: 500, marginBottom: 28 }}>
            Welcome to Client Portal
          </p>

          {error && (
            <div style={{
              background: '#fff5f5', border: '1.5px solid #e8d0d0', borderRadius: 10,
              padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#333', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input type="email" placeholder="Username or email" className="input-field"
                value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="input-field"
                style={{ paddingRight: 42 }} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', alignItems: 'center' }}>
                {showPassword ? (
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <Link href="#" style={{ fontSize: 13, color: '#333', fontWeight: 600, textDecoration: 'none' }}>Forgot?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="login-btn"
              style={{
                width: '100%', padding: '13px',
                background: isLoading ? '#b05555' : 'linear-gradient(90deg, #800000, #a00000)',
                color: '#ffffff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(128,0,0,0.30)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
              }}>
              {isLoading ? 'Processing...' : 'Login'}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Illustration Panel ── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>

          {/* Background blobs */}
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
            <path d="M 40 0 Q 520 0 520 40 L 520 460 Q 520 460 260 460 Q 60 460 20 340 Q -30 200 40 0 Z" fill="#fff0f0" opacity="0.8" />
            <path d="M 90 0 Q 520 0 520 60 L 520 460 Q 520 460 300 458 Q 110 452 80 330 Q 30 200 90 0 Z" fill="url(#gMid)" opacity="0.35" />
            <path d="M 160 0 Q 520 0 520 80 L 520 460 Q 520 460 360 456 Q 180 446 155 320 Q 110 195 160 0 Z" fill="url(#gDark)" opacity="0.90" />
          </svg>

          {/* ══ 3D ISOMETRIC ANALYTICS DASHBOARD ══ */}
          <div className="animate-float-main" style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px 8px 16px 24px', zIndex: 2,
          }}>
            <svg viewBox="0 0 280 290" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ width: '90%', maxWidth: 230, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
              <defs>
                <linearGradient id="platTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5e6e6" />
                  <stop offset="100%" stopColor="#e8cccc" />
                </linearGradient>
                <linearGradient id="platLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c08888" />
                  <stop offset="100%" stopColor="#a06060" />
                </linearGradient>
                <linearGradient id="platRight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8a4040" />
                  <stop offset="100%" stopColor="#6a2020" />
                </linearGradient>
                <linearGradient id="b1Top" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b6b" /><stop offset="100%" stopColor="#cc2222" />
                </linearGradient>
                <linearGradient id="b1Left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#aa1111" /><stop offset="100%" stopColor="#880000" />
                </linearGradient>
                <linearGradient id="b1Right" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#660000" /><stop offset="100%" stopColor="#440000" />
                </linearGradient>
                <linearGradient id="b2Top" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB347" /><stop offset="100%" stopColor="#e07700" />
                </linearGradient>
                <linearGradient id="b2Left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cc6600" /><stop offset="100%" stopColor="#aa4400" />
                </linearGradient>
                <linearGradient id="b2Right" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#884400" /><stop offset="100%" stopColor="#663300" />
                </linearGradient>
                <linearGradient id="b3Top" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE066" /><stop offset="100%" stopColor="#FFB700" />
                </linearGradient>
                <linearGradient id="b3Left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#CC9900" /><stop offset="100%" stopColor="#AA7700" />
                </linearGradient>
                <linearGradient id="b3Right" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#886600" /><stop offset="100%" stopColor="#664400" />
                </linearGradient>
                <linearGradient id="b4Top" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffaaaa" /><stop offset="100%" stopColor="#ff7777" />
                </linearGradient>
                <linearGradient id="b4Left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cc4444" /><stop offset="100%" stopColor="#aa2222" />
                </linearGradient>
                <linearGradient id="b4Right" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#882222" /><stop offset="100%" stopColor="#661111" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2d0000" />
                  <stop offset="100%" stopColor="#1a0000" />
                </linearGradient>
              </defs>

              {/* Ground shadow */}
              <ellipse cx="140" cy="272" rx="85" ry="13" fill="#000" opacity="0.25" />

              {/* Base slab */}
              <polygon points="140,210 218,166 140,122 62,166" fill="url(#platTop)" stroke="#c8aaaa" strokeWidth="1" />
              <polygon points="62,166 140,122 140,138 62,182" fill="url(#platLeft)" stroke="#b08080" strokeWidth="0.8" />
              <polygon points="218,166 140,122 140,138 218,182" fill="url(#platRight)" stroke="#884444" strokeWidth="0.8" />
              <polygon points="62,182 140,138 140,155 62,199" fill="#7a3030" stroke="#5a1818" strokeWidth="0.8" />
              <polygon points="218,182 140,138 140,155 218,199" fill="#601818" stroke="#440000" strokeWidth="0.8" />

              {/* Bar 1 — maroon */}
              <g className="bar1">
                <polygon points="96,178  114,168  114,98  96,108" fill="url(#b1Right)" />
                <polygon points="78,188  96,178  96,108  78,118" fill="url(#b1Left)" />
                <polygon points="78,118  96,108  114,98  96,88  78,98" fill="url(#b1Top)" />
                <polygon points="78,118 96,108 98,100 80,110" fill="white" opacity="0.2" />
              </g>

              {/* Bar 2 — orange */}
              <g className="bar2">
                <polygon points="114,168  132,158  132,108  114,118" fill="url(#b2Right)" />
                <polygon points="96,178  114,168  114,118  96,128" fill="url(#b2Left)" />
                <polygon points="96,128  114,118  132,108  114,98  96,108" fill="url(#b2Top)" />
                <polygon points="96,128 114,118 116,110 98,120" fill="white" opacity="0.2" />
              </g>

              {/* Bar 3 — gold */}
              <g className="bar3">
                <polygon points="150,158  168,148  168,83  150,93" fill="url(#b3Right)" />
                <polygon points="132,168  150,158  150,93  132,103" fill="url(#b3Left)" />
                <polygon points="132,103  150,93  168,83  150,73  132,83" fill="url(#b3Top)" />
                <polygon points="132,103 150,93 152,83 134,93" fill="white" opacity="0.22" />
              </g>

              {/* Bar 4 — rose */}
              <g className="bar4">
                <polygon points="168,148  186,138  186,100  168,110" fill="url(#b4Right)" />
                <polygon points="150,158  168,148  168,110  150,120" fill="url(#b4Left)" />
                <polygon points="150,120  168,110  186,100  168,90  150,100" fill="url(#b4Top)" />
                <polygon points="150,120 168,110 170,100 152,110" fill="white" opacity="0.2" />
              </g>

              {/* Floating mini screen card */}
              <g transform="translate(42, 52)">
                <polygon points="34,0  70,20  34,40  -2,20" fill="#fff" fillOpacity="0.22" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <polygon points="-2,20  34,40  34,68  -2,48" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                <polygon points="70,20  34,40  34,68  70,48" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                <polygon points="-2,48  34,68  70,48  34,28" fill="url(#screenGrad)" fillOpacity="0.85" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                <polyline
                  className="trend-line"
                  points="4,58  12,52  20,55  28,44  36,48  44,38  52,42"
                  stroke="#FFD700" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
                  filter="url(#glow)"
                  transform="translate(0, -10)"
                />
                <circle cx="52" cy="28" r="2.5" fill="#FFD700" opacity="0.9" />
              </g>

              {/* Floating avatar stack */}
              <g transform="translate(185, 68)">
                <rect width="62" height="36" rx="10" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
                <circle cx="14" cy="18" r="9" fill="#ff6b6b" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                <circle cx="26" cy="18" r="9" fill="#FFB347" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                <circle cx="38" cy="18" r="9" fill="#FFE066" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="3.5" fill="white" opacity="0.7" />
                <path d="M9 22 Q14 18 19 22" fill="white" opacity="0.6" />
                <circle cx="26" cy="14" r="3.5" fill="white" opacity="0.7" />
                <path d="M21 22 Q26 18 31 22" fill="white" opacity="0.6" />
                <circle cx="38" cy="14" r="3.5" fill="white" opacity="0.7" />
                <path d="M33 22 Q38 18 43 22" fill="white" opacity="0.6" />
              </g>

              {/* Sparkles & accents */}
              <g transform="translate(228, 50)">
                <polygon points="0,-7 1.5,-2.5 6,-2.5 2.5,1 4,6 0,3 -4,6 -2.5,1 -6,-2.5 -1.5,-2.5" fill="#FFD700" opacity="0.85" />
              </g>
              <g transform="translate(55, 228)">
                <polygon points="0,-5 3.5,0 0,5 -3.5,0" fill="#FF9944" opacity="0.8" />
              </g>
              <circle cx="220" cy="200" r="4" fill="#FFE066" opacity="0.6" />
              <circle cx="60" cy="90"  r="3" fill="#ff8888" opacity="0.55" />
              <circle cx="232" cy="130" r="2.5" fill="#FFB347" opacity="0.5" />
              <circle cx="52" cy="260"  r="2" fill="#FFB700" opacity="0.4" />
            </svg>
          </div>

          {/* Plus dot bottom-right */}
          <div style={{
            position: 'absolute', bottom: 28, right: 32, width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}