'use client'

import { useState } from 'react'
import LogoutOverlay from '@/components/LogoutOverlay'
import LogoutConfirmModal from '@/components/LogoutConfirmModal'

interface logoutprops {
  isdarkmode: boolean
  /**
   * Ask the parent to show the confirmation. This button lives inside the
   * header dropdown, and clicking it closes that dropdown — which unmounts this
   * component and would take a locally-owned modal down with it. So the
   * confirm/overlay state is hoisted to the layout instead. See
   * AdminLogoutFlow in app/admin/dashboard/layout.tsx.
   */
  onRequestConfirm?: () => void
}

/**
 * Performs the admin logout request. Exported so the layout can run the same
 * flow from its hoisted confirmation modal.
 *
 * Goes through the same-origin '/api' proxy (next.config.ts rewrite): hitting
 * the absolute backend URL makes this cross-site, and the SameSite=Lax auth
 * cookies are then NOT attached — so the backend never sees the session and
 * never clears the cookies, leaving the user still logged in.
 */
export async function performAdminLogout(): Promise<void> {
  try {
    await fetch(`/api/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Important: includes cookies
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Even on error we still redirect (token might be expired).
    console.error('Logout error:', error)
  }
}

/** Full browser navigation, not router.push: the session cookies were just
 *  cleared server-side, and a hard load guarantees middleware re-evaluates
 *  against the new (empty) cookie jar instead of a client-cached state. */
export function goToAdminLogin(): void {
  window.location.href = '/admin/login'
}

export default function Logout({ isdarkmode, onRequestConfirm }: logoutprops) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [logoutDone, setLogoutDone] = useState(false)

  const handlelogout = async () => {
    if (isLoggingOut) return // Prevent multiple clicks
    setConfirmOpen(false)

    // Show the logout overlay immediately, then clear the session in the
    // background. The overlay owns the redirect (via onDone) so it stays
    // covering the screen the whole time — no dashboard flash before leaving.
    setIsLoggingOut(true)
    await performAdminLogout()
    // Release the overlay whether or not the request succeeded.
    setLogoutDone(true)
  }

  return (
    <>
      {confirmOpen && (
        <LogoutConfirmModal
          portalLabel="Admin"
          accent="#800000"
          onConfirm={handlelogout}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
      {isLoggingOut && (
        <LogoutOverlay portalLabel="Admin" accent="#800000" ready={logoutDone} onDone={goToAdminLogin} />
      )}
    <button
      onClick={() => (onRequestConfirm ? onRequestConfirm() : setConfirmOpen(true))}
      disabled={isLoggingOut}
      className={`w-full flex items-center gap-4 px-6 py-5 rounded-[25px] text-[11px] font-black uppercase tracking-widest transition-all border-none bg-transparent cursor-pointer text-left ${
        isdarkmode 
          ? 'text-red-400 hover:bg-white/5' 
          : 'text-red-600 hover:bg-red-50'
      } ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {isLoggingOut ? 'Logging out...' : 'logout'}
    </button>
    </>
  )
}