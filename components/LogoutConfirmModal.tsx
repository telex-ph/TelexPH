'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type LogoutConfirmModalProps = {
  /** Which portal is signing out — shown in the body copy. */
  portalLabel: string
  accent?: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * "Log out?" confirmation shown before the logout request runs. Shared by the
 * admin, client, VA and VAdash dashboards so every logout entry point asks
 * first — each portal has more than one trigger (sidebar + header menu), and
 * they all route through a single handler.
 *
 * Portaled into document.body so its fixed overlay covers the viewport instead
 * of being clipped by a dashboard's content column, matching LogoutOverlay.
 */
export default function LogoutConfirmModal({
  portalLabel,
  accent = '#800000',
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) {
  const [mounted, setMounted] = useState(false)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  // Escape closes; focus lands on the confirm button so keyboard users can
  // act without tabbing through the page behind the overlay.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    confirmRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.55)', animation: 'lcFadeIn 0.15s ease-out' }}
      onClick={onCancel}
    >
      <style jsx global>{`
        @keyframes lcFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lcPopIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Stop clicks inside the card from reaching the backdrop's onCancel. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-2xl"
        style={{ animation: 'lcPopIn 0.2s cubic-bezier(0.34,1.3,0.64,1) both' }}
      >
        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: `${accent}1a`, color: accent }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </div>

        <h2
          id="logout-confirm-title"
          className="mb-1.5 text-lg font-bold text-gray-900"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Log out?
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          You&apos;ll be signed out of {portalLabel} and returned to the login page.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-xl border-none px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: accent }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
