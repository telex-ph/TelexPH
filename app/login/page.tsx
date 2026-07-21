import { redirect } from 'next/navigation'

/**
 * Legacy /login entry point — forwards to the real admin login.
 *
 * Any ?redirect= param is intentionally dropped: login URLs are kept clean, so
 * signing in always lands on the dashboard root.
 */
export default async function LegacyLoginRedirect() {
  redirect('/admin/login')
}
