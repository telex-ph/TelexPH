import type { Metadata } from 'next'
import BrowseVAsPage from './components/BrowseVAsPage'

export const metadata: Metadata = {
  title: 'Client Portal | Browse VAs',
  description: 'Client Portal Dashboard - Browse Virtual Assistants',
}

export default function Page() {
  return <BrowseVAsPage />
}
