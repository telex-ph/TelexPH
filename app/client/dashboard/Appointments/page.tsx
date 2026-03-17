import type { Metadata } from 'next'
import SubscriptionsPage from './components/clientAppointments'

export const metadata: Metadata = {
  title: 'Client Portal | Subscriptions',
  description: 'Client Portal Dashboard - Subscriptions',
}

export default function Page() {
  return <SubscriptionsPage />
}