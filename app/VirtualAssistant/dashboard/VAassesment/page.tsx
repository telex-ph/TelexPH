import type { Metadata } from 'next'
import VAassesment from './components/VAassesment'

export const metadata: Metadata = {
  title: 'Client Portal | Assessments',
  description: 'Review and score VA assessment submissions.',
}

export default function Page() {
  return <VAassesment />
}