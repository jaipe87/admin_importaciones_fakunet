
import { NextResponse } from 'next/server';
import { analyticsConfigDB } from '@/lib/db';

export async function GET() {
  const config = analyticsConfigDB.get();
  // Return masked private key for security
  return NextResponse.json({
    propertyId: config.propertyId,
    clientEmail: config.clientEmail,
    hasKey: !!config.privateKey
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = analyticsConfigDB.get();

    analyticsConfigDB.save({
      propertyId: body.propertyId || current.propertyId,
      clientEmail: body.clientEmail || current.clientEmail,
      // Only update private key if provided (it might be empty if user didn't change it)
      privateKey: body.privateKey ? body.privateKey : current.privateKey
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
