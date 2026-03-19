import type { Metadata } from 'next'
import VAdashboard from './VAdashboard'

export const metadata: Metadata = {
  title: 'Client Portal | Virtual Assistant Dashboard',
  description: 'Manage your Virtual Assistant team — hiring, performance, tasks, and billing.',
}

export default function Page() {
  return <VAdashboard />
}