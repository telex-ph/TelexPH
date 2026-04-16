import { NextRequest, NextResponse } from 'next/server';
import api from '@/lib/api/axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'views';

    // Fetch real funnel data from backend
    const response = await api.get(`/api/page-views/funnels?range=${range}&search=${search}&sortBy=${sortBy}`);
    
    return NextResponse.json(response.data.funnels || []);
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funnel data' },
      { status: 500 }
    );
  }
}
