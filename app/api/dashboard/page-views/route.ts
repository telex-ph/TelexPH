import { NextRequest, NextResponse } from 'next/server';
import api from '@/lib/api/axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Fetch real page views data from backend
    const response = await api.get(`/api/page-views/dashboard/page-views?range=${range}`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching page views data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page views data' },
      { status: 500 }
    );
  }
}
