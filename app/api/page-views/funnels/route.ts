import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '30d'
    
    // Get the base API URL
    const raw = process.env.ADMIN_API_BASE_URL?.trim() || 
               process.env.NEXT_PUBLIC_API_URL?.trim() || ''
    let base = raw.replace(/\/$/, '')
    if (base.endsWith('/api')) base = base.slice(0, -4)

    if (!base) {
      return NextResponse.json(
        { error: 'API base URL not configured' },
        { status: 500 }
      )
    }

    // Forward the request to the backend API
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Forward Authorization header if present
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    // Forward cookie header if present
    const cookieHeader = req.headers.get('Cookie')
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    const response = await fetch(`${base}/api/page-views/funnels?range=${range}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch funnel data' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Funnel API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
