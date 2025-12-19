import { NextResponse } from 'next/server';
import { writeFile, readdir, stat } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { Buffer } from 'buffer';

const UPLOAD_DIR = path.join((process as any).cwd(), 'public', 'uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function GET() {
  try {
    const files = await readdir(UPLOAD_DIR);
    
    const fileInfos = await Promise.all(
      files.map(async (filename) => {
        const stats = await stat(path.join(UPLOAD_DIR, filename));
        return {
          name: filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          date: stats.mtime,
        };
      })
    );
    
    // Sort by newest first
    fileInfos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ files: fileInfos });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading directory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate extension (Agregado PDF)
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/jpg', 'application/pdf'];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: Images & PDF' }, { status: 400 });
  }

  // Handle filename collision
  let filename = file.name.replace(/\s+/g, '-').toLowerCase();
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  
  let counter = 1;
  while (fs.existsSync(path.join(UPLOAD_DIR, filename))) {
    filename = `${name}-${counter}${ext}`;
    counter++;
  }

  try {
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return NextResponse.json({ success: true, filename, url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
  }
}