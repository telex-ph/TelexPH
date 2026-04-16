import { NextRequest, NextResponse } from 'next/server'

/**
 * GHL Workflow → POST dito (same secret as backend GHL_WEBHOOK_SECRET).
 * I-forward sa Express API para ma-store sa MongoDB.
 *
 * GHL URL: https://<your-next-domain>/api/ghl/pageview
 * Header: x-ghl-webhook-secret: <GHL_WEBHOOK_SECRET>
 */
export async function POST(req: NextRequest) {
  const secret = process.env.GHL_WEBHOOK_SECRET?.trim()
  if (!secret) {
    return NextResponse.json(
      { error: 'GHL_WEBHOOK_SECRET is not configured' },
      { status: 500 }
    )
  }

  const headerSecret = req.headers.get('x-ghl-webhook-secret')?.trim()
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  if (headerSecret !== secret && bearer !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const raw =
    process.env.ADMIN_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    ''
  let base = raw.replace(/\/$/, '')
  if (base.endsWith('/api')) base = base.slice(0, -4)

  if (!base) {
    return NextResponse.json(
      { error: 'ADMIN_API_BASE_URL or NEXT_PUBLIC_API_URL required' },
      { status: 500 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/api/ghl/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ghl-webhook-secret': secret,
      },
      body: JSON.stringify(body),
    })
    const data = await r.json().catch(() => ({}))
    return NextResponse.json(data, { status: r.status })
  } catch (e) {
    console.error('GHL pageview proxy:', e)
    return NextResponse.json({ error: 'Upstream failed' }, { status: 502 })
  }
}
