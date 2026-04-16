import { NextRequest, NextResponse } from 'next/server';
import api from '@/lib/api/axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Fetch real visitor data from backend
    const response = await api.get(`/api/page-views/dashboard/page-views/visitors?range=${range}`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching visitor data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitor data' },
      { status: 500 }
    );
  }
}
