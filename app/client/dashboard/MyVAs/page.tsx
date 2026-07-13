import type { Metadata } from 'next'
import MyVAsPage from './components/MyVAsPage'

export const metadata: Metadata = {
  title: 'Client Portal | My VAs',
  description: 'Client Portal Dashboard - Manage Hired Virtual Assistants',
}

export default function Page() {
  return <MyVAsPage />
}
