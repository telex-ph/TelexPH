import { redirect } from 'next/navigation'

type Props = {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LegacyLoginRedirect({ searchParams }: Props) {
  const sp = await searchParams
  const r = sp.redirect
  if (typeof r === 'string' && r.startsWith('/') && !r.startsWith('//')) {
    redirect(`/admin/login?redirect=${encodeURIComponent(r)}`)
  }
  redirect('/admin/login')
}
