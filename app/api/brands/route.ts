
import { NextResponse } from 'next/server';
import { brandsDB } from '@/lib/db';

export async function GET() {
  const brands = brandsDB.getAll();
  return NextResponse.json(brands);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBrand = brandsDB.add({
      id: Date.now().toString(),
      name: body.name,
      active: true
    });
    return NextResponse.json(newBrand);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
