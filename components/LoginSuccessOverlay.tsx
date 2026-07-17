'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

type LoginSuccessOverlayProps = {
  portalLabel: string
  accent?: string
  onDone: () => void
}

export default function LoginSuccessOverlay({
  portalLabel,
  accent = '#800000',
  onDone,
}: LoginSuccessOverlayProps) {
  // Keep the latest onDone in a ref so the timer effect can run exactly once on
  // mount without re-firing when the parent passes a fresh onDone on re-render
  // (the login pages pass an inline `() => router.push(...)`, a new reference
  // every render — depending on it would reset the timer mid-countdown).
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    // Hold the overlay on screen for its full duration, THEN redirect while it's
    // still fully opaque — it stays covering the screen until the page
    // navigation unmounts it, so the login page never flashes back into view.
    const finish = setTimeout(() => onDoneRef.current(), 2200)
    return () => clearTimeout(finish)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{
        opacity: 1,
      }}
    >
      <style jsx global>{`
        @keyframes lsoRingPop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes lsoCheckDraw {
          from { stroke-dashoffset: 32; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes lsoRipple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes lsoLogoIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lsoTextIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsoDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
      }} />
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{ width: 480, height: 480, background: `${accent}33`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="relative mb-7 w-20 h-20 flex items-center justify-center">
          <span
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${accent}`, animation: 'lsoRipple 1.6s ease-out infinite' }}
          />
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${accent}, #2a0000)`,
              animation: 'lsoRingPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12.5L10 17L19 7"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="32"
                strokeDashoffset="32"
                style={{ animation: 'lsoCheckDraw 0.45s ease-out 0.35s forwards' }}
              />
            </svg>
          </div>
        </div>

        <div
          className="mb-2 w-9 h-9 relative opacity-0"
          style={{ animation: 'lsoLogoIn 0.5s ease-out 0.15s forwards' }}
        >
          <Image src="/images/Tlxlogo.webp" alt="TelexPH logo" fill className="object-contain" priority />
        </div>

        <h1
          className="text-2xl font-bold tracking-tight text-white mb-1.5 font-poppins opacity-0"
          style={{ animation: 'lsoTextIn 0.5s ease-out 0.25s forwards' }}
        >
          Login successful
        </h1>
        <p
          className="text-sm text-gray-400 font-open-sans opacity-0"
          style={{ animation: 'lsoTextIn 0.5s ease-out 0.35s forwards' }}
        >
          Taking you to your {portalLabel} dashboard
        </p>

        <div className="flex items-center gap-1.5 mt-6 opacity-0" style={{ animation: 'lsoTextIn 0.5s ease-out 0.45s forwards' }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: accent, animation: `lsoDotBounce 1s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
