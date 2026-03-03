import type { Metadata } from 'next'
import ClientDashboard from './clientDashboard'

export const metadata: Metadata = {
  title: 'Client Portal | Dashboard',
  description: 'Client Portal Dashboard',
}

export default function Page() {
  return <ClientDashboard />
}