import { NextResponse } from 'next/server';
import { sliderDB } from '@/lib/db';

export async function GET() {
  return NextResponse.json(sliderDB.getAll());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSlide = sliderDB.add({
      id: Date.now().toString(),
      image_url: body.image_url,
      active: true
    });
    return NextResponse.json(newSlide);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add slide' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const success = sliderDB.delete(s => s.id === id);
    
    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}