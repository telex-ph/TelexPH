import { NextRequest, NextResponse } from 'next/server';
import { backendGet } from '@/lib/api/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'views';

    // Fetch real funnel data from backend
    const data = await backendGet<{ funnels?: unknown[] }>(
      `/api/page-views/funnels?range=${range}&search=${search}&sortBy=${sortBy}`
    );

    return NextResponse.json(data.funnels || []);
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funnel data' },
      { status: 500 }
    );
  }
}
