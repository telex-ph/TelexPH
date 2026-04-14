import type { Metadata } from 'next'
import VASubscriptions from './components/VASubscriptions'

export const metadata: Metadata = {
  title: 'VA Portal | Subscriptions',
  description: 'Virtual Assistant — plans and engagements',
}

export default function Page() {
  return <VASubscriptions />
}
