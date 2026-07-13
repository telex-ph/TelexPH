import type { Metadata } from 'next'
import { Suspense } from 'react'
import InterviewRecordingPage from './components/InterviewRecordingPage'

export const metadata: Metadata = {
  title: 'Client Portal | Interview Recording',
  description: 'Client Portal Dashboard - VA Interview Scheduling & Recordings',
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InterviewRecordingPage />
    </Suspense>
  )
}
