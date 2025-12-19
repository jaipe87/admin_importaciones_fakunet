
import { NextResponse } from 'next/server';
import { productsDB } from '@/lib/db';
import { Product } from '@/types';

export async function GET() {
  return NextResponse.json(productsDB.getAll());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic Validation
    if (!body.code || !body.name || !body.brand || !body.category) {
        return NextResponse.json({ error: 'Faltan campos obligatorios (código, nombre, marca, categoría)' }, { status: 400 });
    }

    // Check if code exists
    const existing = productsDB.find(p => p.code === body.code);
    if (existing) {
        return NextResponse.json({ error: 'El código del producto ya existe.' }, { status: 409 });
    }

    // Process features
    const featuresArray = typeof body.features === 'string' 
      ? body.features.split('\n').filter((f: string) => f.trim() !== '')
      : body.features || [];

    // Auto-generate WhatsApp message
    const codeDisplay = body.code || '(código sin especificar)';
    const whatsappMessage = `Hola, estoy interesado en el producto ${body.name} (código ${codeDisplay}). Lo vi en la web de Importaciones Fakunet y quiero más información.`;

    const newProduct: Product = {
      ...body,
      features: featuresArray,
      whatsapp_message: whatsappMessage,
      active: true, // Default active
      pdf_url: body.pdf_url || '',
      image_url: body.image_url || ''
    };

    productsDB.add(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creando producto' }, { status: 500 });
  }
}
