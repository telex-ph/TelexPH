import type { Metadata } from 'next'
import ShortlistedPage from './components/ShortlistedPage'

export const metadata: Metadata = {
  title: 'Client Portal | Shortlisted',
  description: 'Client Portal Dashboard - Shortlisted Virtual Assistants',
}

export default function Page() {
  return <ShortlistedPage />
}
