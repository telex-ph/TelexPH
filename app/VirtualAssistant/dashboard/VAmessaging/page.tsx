import type { Metadata } from 'next'
import VAmessaging from './components/messaging'

// File location: app/VirtualAssistant/dashboard/VAmessaging/page.tsx

export const metadata: Metadata = {
  title: 'VA Messaging',
}

export default function Page() {
  return <VAmessaging />
}