import { ReactNode } from 'react'

export default function adminlayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <section className="min-h-screen bg-white font-rubik antialiased text-black">
      {children}
    </section>
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}