import { ReactNode } from 'react'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <section className="min-h-screen bg-white font-rubik antialiased text-black">
          {children}
        </section>
      </body>
    </html>
  )
}