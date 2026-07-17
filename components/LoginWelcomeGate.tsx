'use client'

import { Suspense, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, useSearchParams } from 'next/navigation'
import LoginSuccessOverlay from '@/components/LoginSuccessOverlay'

type LoginWelcomeGateProps = {
  portalLabel: string
  accent?: string
}

/**
 * Shows the "Login successful" overlay on top of the destination page when the
 * user has just arrived from login (signalled by ?welcome=1 in the URL). The
 * overlay covers the page while it loads, then dismisses itself and strips the
 * query param so a refresh or later visit won't replay it.
 *
 * Drop this at the top of a dashboard page; it renders nothing on a normal visit.
 */
function LoginWelcomeGateInner({ portalLabel, accent }: LoginWelcomeGateProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Capture the flag once on mount — reading it later would miss it after we
  // strip the param from the URL.
  const [showWelcome, setShowWelcome] = useState(() => searchParams.get('welcome') === '1')

  // Portal the overlay into document.body so its `position: fixed` covers the
  // whole viewport. Rendered inside a dashboard layout (a flex/transformed
  // container), fixed positioning would otherwise be clipped to the content
  // area and leave the sidebar showing through.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!showWelcome) return
    // Remove ?welcome=1 immediately so the overlay can't replay on refresh.
    // replace (not push) keeps it out of history.
    router.replace(window.location.pathname, { scroll: false })
  }, [showWelcome, router])

  if (!showWelcome || !mounted) return null

  return createPortal(
    <LoginSuccessOverlay
      portalLabel={portalLabel}
      accent={accent}
      onDone={() => setShowWelcome(false)}
    />,
    document.body
  )
}

export default function LoginWelcomeGate(props: LoginWelcomeGateProps) {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <LoginWelcomeGateInner {...props} />
    </Suspense>
  )
}
