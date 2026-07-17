import AdminDashboard from './AdminDashboard'
import LoginWelcomeGate from '@/components/LoginWelcomeGate'

export default function Page() {
  return (
    <>
      <LoginWelcomeGate portalLabel="Admin" accent="#800000" />
      <AdminDashboard />
    </>
  )
}