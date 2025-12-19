
import { NextResponse } from 'next/server';
import { categoriesDB } from '@/lib/db';

export async function GET() {
  return NextResponse.json(categoriesDB.getAll());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCategory = categoriesDB.add({
      id: Date.now().toString(),
      name: body.name,
      active: true
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
