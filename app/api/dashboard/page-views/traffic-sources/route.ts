import { NextRequest, NextResponse } from 'next/server';
import { backendGet } from '@/lib/api/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Fetch real traffic sources data from backend
    const data = await backendGet<{ trafficSources?: unknown[] }>(
      `/api/page-views/dashboard/page-views?range=${range}`
    );
    return NextResponse.json(data.trafficSources || []);
  } catch (error) {
    console.error('Error fetching traffic sources data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch traffic sources data' },
      { status: 500 }
    );
  }
}
