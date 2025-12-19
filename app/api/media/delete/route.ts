import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const { filename } = await request.json();

  if (!filename) {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 });
  }

  // Prevent directory traversal
  const safeFilename = path.basename(filename);
  const filepath = path.join((process as any).cwd(), 'public', 'uploads', safeFilename);

  try {
    await unlink(filepath);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'File not found or could not be deleted' }, { status: 500 });
  }
}