import type { Metadata } from 'next'
import ClientDashboard from './clientDashboard'
import LoginWelcomeGate from '@/components/LoginWelcomeGate'

export const metadata: Metadata = {
  title: 'Client Portal | Dashboard',
  description: 'Client Portal Dashboard',
}

export default function Page() {
  return (
    <>
      <LoginWelcomeGate portalLabel="Client" accent="#8b0000" />
      <ClientDashboard />
    </>
  )
}