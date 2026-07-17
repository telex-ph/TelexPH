'use client'
import Dashboard from './VAdashboard/components/Dashboard'
import LoginWelcomeGate from '@/components/LoginWelcomeGate'

export default function Page() {
  return (
    <>
      <LoginWelcomeGate portalLabel="Virtual Assistant" accent="#800000" />
      <Dashboard />
    </>
  )
}