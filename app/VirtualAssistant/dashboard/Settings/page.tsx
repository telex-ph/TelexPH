import type { Metadata } from 'next'
import Settings from './components/Settings'

export const metadata: Metadata = {
  title: 'VA Portal | Settings',
  description: 'Manage your account settings and preferences.',
}

export default function Page() {
  return <Settings />
}