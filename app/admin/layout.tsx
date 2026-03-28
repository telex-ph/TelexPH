import { ReactNode } from 'react'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <section className="min-h-screen bg-white font-rubik antialiased text-black">
      {children}
    </section>
  )
}