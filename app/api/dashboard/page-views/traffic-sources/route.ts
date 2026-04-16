import { NextRequest, NextResponse } from 'next/server';
import api from '@/lib/api/axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Fetch real traffic sources data from backend
    const response = await api.get(`/api/page-views/dashboard/page-views?range=${range}`);
    return NextResponse.json(response.data.trafficSources || []);
  } catch (error) {
    console.error('Error fetching traffic sources data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch traffic sources data' },
      { status: 500 }
    );
  }
}
