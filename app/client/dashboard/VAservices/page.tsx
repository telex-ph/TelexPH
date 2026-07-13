import type { Metadata } from 'next'
import VAServicesPage from './components/VAservicesPage'

export const metadata: Metadata = {
  title: 'Client Portal | VA Services',
  description: 'Client Portal Dashboard - Virtual Assistant Services',
}

export default function Page() {
  return <VAServicesPage />
}
