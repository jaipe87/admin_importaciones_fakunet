import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Safe process access
  const envUser = typeof process !== 'undefined' && process.env && process.env.ADMIN_USER;
  const envPass = typeof process !== 'undefined' && process.env && process.env.ADMIN_PASS;

  const validUser = envUser || 'admin';
  const validPass = envPass || '1234';

  if (username === validUser && password === validPass) {
    // Set cookie valid for 1 day
    (await cookies()).set('auth_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
}