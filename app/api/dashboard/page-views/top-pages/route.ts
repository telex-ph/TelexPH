import { NextRequest, NextResponse } from 'next/server';
import { backendGet } from '@/lib/api/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Fetch real top pages data from backend
    const data = await backendGet<{ topPages?: unknown[] }>(
      `/api/page-views/dashboard/page-views?range=${range}`
    );
    return NextResponse.json(data.topPages || []);
  } catch (error) {
    console.error('Error fetching top pages data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top pages data' },
      { status: 500 }
    );
  }
}
