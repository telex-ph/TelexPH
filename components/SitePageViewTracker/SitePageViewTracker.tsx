'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { getApiBaseUrl } from '@/lib/api-base'
import { getOrCreateVisitorSessionId, getVisitorEmail } from '@/lib/page-view-session'

const EXCLUDED_PREFIXES = [
  '/admin',
  '/client',
  '/VirtualAssistant',
  '/VAdash',
  '/api',
]

/**
 * Records public marketing page views to the admin API (no auth).
 * Skips admin, client, and VA app routes.
 */
export default function SitePageViewTracker() {
  const pathname = usePathname()
  const lastSent = useRef<{ path: string; at: number } | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return

    const now = Date.now()
    if (
      lastSent.current?.path === pathname &&
      now - lastSent.current.at < 400
    ) {
      return
    }
    lastSent.current = { path: pathname, at: now }

    const sessionId = getOrCreateVisitorSessionId()
    if (!sessionId) return
    const email = getVisitorEmail()

    const payload: Record<string, string> = {
      path: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
      sessionId,
      kind: 'page',
    }
    if (email) payload.email = email

    const body = JSON.stringify(payload)

    const url = `${getApiBaseUrl()}/page-views/track`

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      credentials: 'omit',
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
