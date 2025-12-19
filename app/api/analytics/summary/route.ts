
import { NextResponse } from 'next/server';
import { analyticsService } from '@/lib/analytics';

export async function GET() {
  try {
    const data = await analyticsService.getSummary();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener analítica' }, 
      { status: 500 }
    );
  }
}
