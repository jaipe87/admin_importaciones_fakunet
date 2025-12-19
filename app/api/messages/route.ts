
import { NextResponse } from 'next/server';
import { messagesDB } from '@/lib/db';
import { Message } from '@/types';

export async function GET() {
  const messages = messagesDB.getAll();
  // Sort by date desc (newest first)
  messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic Validation
    if (!body.firstName || !body.email || !body.content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      firstName: body.firstName,
      lastName: body.lastName || '',
      phone: body.phone || '',
      email: body.email,
      content: body.content,
      date: new Date().toISOString(),
      read: false
    };

    messagesDB.add(newMessage);
    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
