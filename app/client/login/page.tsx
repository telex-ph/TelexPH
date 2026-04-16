'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getClientAuthenticateUrl } from '@/lib/api-base'

export default function ClientLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { 
    setMounted(true)
    // Show success message if redirected from registration
    const params = new URLSearchParams(window.location.search)
    if (params.get('registered') === '1') {
      setSuccess('Account created successfully! You can now sign in.')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    try {
      const response = await fetch(getClientAuthenticateUrl(), {
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
    <div className="root relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6"
      style={{ background:'#0a0000', fontFamily:"'Poppins',sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box}
        body{font-family:'Poppins',sans-serif;font-weight:300}

        /* Background — maroon/dark only, zero pink */
        .root::before{content:'';position:fixed;inset:0;z-index:0;
          background:
            radial-gradient(ellipse 65% 55% at 15% 25%, rgba(110,0,0,.85) 0%, transparent 60%),
            radial-gradient(ellipse 55% 50% at 88% 75%, rgba(60,0,0,.9)  0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 52% 50%, rgba(80,0,0,.3)   0%, transparent 55%)}
        .root::after{content:'';position:fixed;inset:0;z-index:0;
          background-image:linear-gradient(rgba(180,0,0,.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(180,0,0,.025) 1px,transparent 1px);
          background-size:52px 52px}

        @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(45px,30px) scale(1.04)}70%{transform:translate(-20px,55px) scale(.97)}}
        @keyframes orb2{0%,100%{transform:translate(0,0)}50%{transform:translate(-40px,-30px) scale(1.06)}}
        @keyframes pfloat{0%,100%{transform:translateY(0) translateX(0)}33%{transform:translateY(-14px) translateX(6px)}66%{transform:translateY(-7px) translateX(-4px)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes floatIllo{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes barRise{from{transform:scaleY(0)}60%{transform:scaleY(1.04)}to{transform:scaleY(1)}}
        @keyframes lineGrow{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}

        .bar1{transform-origin:bottom;animation:barRise .85s ease-out .2s both}
        .bar2{transform-origin:bottom;animation:barRise .85s ease-out .35s both}
        .bar3{transform-origin:bottom;animation:barRise .85s ease-out .5s both}
        .bar4{transform-origin:bottom;animation:barRise .85s ease-out .65s both}
        .bar5{transform-origin:bottom;animation:barRise .85s ease-out .8s both}
        .tline{stroke-dasharray:200;stroke-dashoffset:200;animation:lineGrow 1.3s ease-out .7s forwards}

        .inp{width:100%;padding:11px 14px;background:#f0f2f5;border:1.5px solid #e2e4e8;border-radius:8px;
          font-size:13px;font-family:'Poppins',sans-serif;font-weight:300;color:#111;outline:none;transition:all .2s;caret-color:#8b0000}
        .inp::placeholder{color:#aaa;font-weight:300}
        .inp:focus{background:#eaecf0;border-color:#8b0000;box-shadow:0 0 0 3px rgba(139,0,0,.09)}
        .inp:disabled{opacity:.5;cursor:not-allowed}
        .sbtn:hover:not(:disabled){background:#6b0000!important;transform:translateY(-1px);box-shadow:0 6px 18px rgba(100,0,0,.5)!important}
        .sbtn:active{transform:translateY(0)!important}
        .sbtn:disabled{opacity:.55;cursor:not-allowed}
      `}</style>

      {/* Orbs — maroon/dark red only */}
      <div className="pointer-events-none fixed rounded-full" style={{width:480,height:480,background:'radial-gradient(circle,rgba(120,0,0,.6) 0%,transparent 70%)',top:-90,left:-90,filter:'blur(100px)',zIndex:0,animation:'orb1 22s ease-in-out infinite'}}/>
      <div className="pointer-events-none fixed rounded-full" style={{width:400,height:400,background:'radial-gradient(circle,rgba(70,0,0,.65) 0%,transparent 70%)',bottom:-80,right:-60,filter:'blur(100px)',zIndex:0,animation:'orb2 26s ease-in-out infinite'}}/>



      {/* ── CARD ── */}
      <div className="relative z-10 flex w-full overflow-hidden"
        style={{maxWidth:900,minHeight:520,borderRadius:20,boxShadow:'0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.06)',animation:'cardIn .6s cubic-bezier(.22,1,.36,1) both'}}>

        {/* LEFT — white form panel */}
        <div className="flex flex-col justify-center bg-white" style={{width:'46%',minWidth:300,padding:'60px 52px'}}>

          <h1 className="mb-2 font-semibold uppercase" style={{fontSize:26,letterSpacing:'0.05em',color:'#8b0000',lineHeight:1.15}}>Welcome Back</h1>
          <p className="mb-8 text-[12px] font-light leading-relaxed" style={{color:'#888'}}>
            Secure verification required. Please provide your<br/>client login details.
          </p>

          {success && (
            <div className="mb-5 rounded-lg px-4 py-3 text-[12px] font-light" style={{background:'#f0fdf4',border:'1px solid #86efac',color:'#166534',display:'flex',alignItems:'center',gap:8}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{flexShrink:0,color:'#16a34a'}}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {success}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg px-4 py-3 text-[12px] font-light" style={{background:'#fff5f5',border:'1px solid #e5c0c0',color:'#7f1d1d'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium" style={{color:'#8b0000',letterSpacing:'0.01em'}}>Email Address</label>
              <input type="email" placeholder="your@email.com" className="inp"
                value={email} onChange={e=>setEmail(e.target.value)} required disabled={isLoading}/>
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium" style={{color:'#8b0000',letterSpacing:'0.01em'}}>Password</label>
              <div className="relative">
                <input type={showPassword?'text':'password'} placeholder="••••••••••" className="inp" style={{paddingRight:42}}
                  value={password} onChange={e=>setPassword(e.target.value)} required disabled={isLoading}/>
                <button type="button" onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 border-none bg-transparent p-1" style={{color:'#bbb',cursor:'pointer'}}>
                  {showPassword
                    ?<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    :<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span></span>
              <Link href="#" className="text-[12px] font-medium no-underline" style={{color:'#8b0000'}}>Forgot password?</Link>
            </div>

            <button type="submit" disabled={isLoading}
              className="sbtn mt-1 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white transition-all"
              style={{background:'#8b0000',boxShadow:'0 4px 14px rgba(100,0,0,.4)',letterSpacing:'0.16em'}}>
              {isLoading
                ?<><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white" style={{animation:'spin .7s linear infinite'}}/>Processing...</>
                :'Sign In'}
            </button>

            <p className="mt-1 text-center text-[12px] font-light" style={{color:'#888'}}>
              Don&apos;t have an account?{' '}
              <Link href="/client/register" className="font-medium no-underline" style={{color:'#8b0000'}}>
                Create one
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT — light illustration panel */}
        <div className="relative flex-1 overflow-hidden" style={{background:'linear-gradient(150deg,#f5eded 0%,#ede5e5 55%,#e8dede 100%)',minWidth:0}}>

          {/* Subtle top-right glow */}
          <div className="pointer-events-none absolute" style={{top:-50,right:-50,width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle,rgba(139,0,0,.07) 0%,transparent 70%)'}}/>

          {/* Illustration */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8">
            <svg viewBox="0 0 340 230" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{width:'96%',maxWidth:380,filter:'drop-shadow(0 10px 28px rgba(100,0,0,.14))',animation:'floatIllo 3.5s ease-in-out infinite'}}>
              <defs>
                <linearGradient id="dashBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#faf5f5"/>
                </linearGradient>
                <linearGradient id="hdr" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7a0000"/><stop offset="100%" stopColor="#b00000"/>
                </linearGradient>
                <linearGradient id="bDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b0000"/><stop offset="100%" stopColor="#6b0000"/>
                </linearGradient>
                <linearGradient id="bMid" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#b52020"/><stop offset="100%" stopColor="#8b0000"/>
                </linearGradient>
                <linearGradient id="bLight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d96060"/><stop offset="100%" stopColor="#b52020"/>
                </linearGradient>
                <linearGradient id="bPale" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e8a0a0"/><stop offset="100%" stopColor="#d96060"/>
                </linearGradient>
                <filter id="cs"><feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="rgba(100,0,0,.12)"/></filter>
              </defs>

              {/* Card base */}
              <rect x="18" y="14" width="304" height="202" rx="14" fill="url(#dashBg)" filter="url(#cs)"/>
              {/* Header */}
              <rect x="18" y="14" width="304" height="34" rx="14" fill="url(#hdr)"/>
              <rect x="18" y="34" width="304" height="14" fill="url(#hdr)"/>
              {/* Window dots */}
              <circle cx="35" cy="31" r="4" fill="rgba(255,255,255,.35)"/>
              <circle cx="49" cy="31" r="4" fill="rgba(255,255,255,.35)"/>
              <circle cx="63" cy="31" r="4" fill="rgba(255,255,255,.35)"/>
              {/* Header label */}
              <rect x="84" y="27" width="90" height="8" rx="4" fill="rgba(255,255,255,.4)"/>

              {/* Sidebar */}
              <rect x="18" y="48" width="50" height="168" fill="#fdf5f5"/>
              <rect x="28" y="62" width="30" height="5" rx="2.5" fill="#d9a0a0"/>
              <rect x="28" y="73" width="22" height="5" rx="2.5" fill="#e8c0c0"/>
              <rect x="28" y="84" width="26" height="5" rx="2.5" fill="#e8c0c0"/>
              <rect x="28" y="95" width="20" height="5" rx="2.5" fill="#e8c0c0"/>
              <rect x="28" y="106" width="28" height="5" rx="2.5" fill="#e8c0c0"/>
              <rect x="28" y="117" width="24" height="5" rx="2.5" fill="#d9a0a0"/>
              <rect x="18" y="70" width="4" height="12" rx="2" fill="#8b0000"/>

              {/* Stat cards */}
              <rect x="76" y="58" width="72" height="36" rx="7" fill="#8b0000"/>
              <rect x="80" y="62" width="32" height="5" rx="2.5" fill="rgba(255,255,255,.45)"/>
              <rect x="80" y="70" width="52" height="8" rx="4" fill="rgba(255,255,255,.85)"/>
              <rect x="80" y="82" width="24" height="4" rx="2" fill="rgba(255,255,255,.35)"/>

              <rect x="154" y="58" width="72" height="36" rx="7" fill="white" stroke="#e8d0d0" strokeWidth="1"/>
              <rect x="158" y="62" width="32" height="5" rx="2.5" fill="#d9a0a0"/>
              <rect x="158" y="70" width="52" height="8" rx="4" fill="#6b0000"/>
              <rect x="158" y="82" width="24" height="4" rx="2" fill="#b07070"/>

              <rect x="232" y="58" width="72" height="36" rx="7" fill="white" stroke="#e8d0d0" strokeWidth="1"/>
              <rect x="236" y="62" width="32" height="5" rx="2.5" fill="#d9a0a0"/>
              <rect x="236" y="70" width="52" height="8" rx="4" fill="#6b0000"/>
              <rect x="236" y="82" width="24" height="4" rx="2" fill="#b07070"/>

              {/* Bar chart */}
              <rect x="76" y="102" width="132" height="86" rx="7" fill="white" stroke="#eddada" strokeWidth="1"/>
              <rect x="85" y="110" width="44" height="5" rx="2.5" fill="#d9a0a0"/>
              <line x1="84" y1="181" x2="200" y2="181" stroke="#eddada" strokeWidth="1"/>
              <g className="bar1"><rect x="90"  y="154" width="15" height="27" rx="3" fill="url(#bPale)"/></g>
              <g className="bar2"><rect x="112" y="144" width="15" height="37" rx="3" fill="url(#bLight)"/></g>
              <g className="bar3"><rect x="134" y="149" width="15" height="32" rx="3" fill="url(#bMid)"/></g>
              <g className="bar4"><rect x="156" y="136" width="15" height="45" rx="3" fill="url(#bDark)"/></g>
              <g className="bar5"><rect x="178" y="141" width="15" height="40" rx="3" fill="url(#bMid)"/></g>

              {/* Line chart */}
              <rect x="214" y="102" width="92" height="86" rx="7" fill="white" stroke="#eddada" strokeWidth="1"/>
              <rect x="222" y="110" width="40" height="5" rx="2.5" fill="#d9a0a0"/>
              <polyline className="tline" points="222,162 233,152 244,157 255,143 266,149 277,137 288,143"
                stroke="#8b0000" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="288" cy="143" r="3" fill="#8b0000"/>
              <circle cx="255" cy="143" r="2.5" fill="#b00000"/>
              {/* Bottom row */}
              <rect x="76" y="194" width="230" height="7" rx="3.5" fill="#fdf0f0"/>
            </svg>

            <p className="text-center text-[12px] font-normal leading-relaxed" style={{color:'#555',maxWidth:260}}>
              this portal is for <strong>client use only</strong>. all access<br/>attempts are monitored and logged.
            </p>
          </div>

          {/* Top-right badge */}
          <div className="pointer-events-none absolute" style={{top:28,right:28,width:44,height:44,borderRadius:12,background:'#8b0000',boxShadow:'0 4px 14px rgba(100,0,0,.28)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
 
          {/* Bottom-right lock badge */}
          <div className="pointer-events-none absolute" style={{bottom:28,right:28,width:36,height:36,borderRadius:'50%',background:'rgba(139,0,0,.1)',border:'1.5px solid rgba(139,0,0,.18)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#8b0000" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>


        </div>
      </div>
    </div>
  )
}