
import { NextResponse } from 'next/server';
import { productsDB } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = productsDB.find(p => p.code === id);
  
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Logic separation: Prepare data
    const featuresArray = typeof body.features === 'string' 
      ? body.features.split('\n').filter((f: string) => f.trim() !== '')
      : body.features;

    const codeDisplay = body.code || '(código sin especificar)';
    const whatsappMessage = `Hola, estoy interesado en el producto ${body.name} (código ${codeDisplay}). Lo vi en la web de Importaciones Fakunet y quiero más información.`;

    const updates = {
      ...body,
      features: featuresArray,
      whatsapp_message: whatsappMessage,
    };

    const updated = productsDB.update(p => p.code === id, updates);

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}
