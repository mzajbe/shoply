import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      const user = result.rows[0];
      const isValid = await verifyPassword(password, user.password);

      if (!isValid) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      const token = await signToken({ userId: user.id, email: user.email });

      // Return user info without password
      const { password: _, ...userInfo } = user;

      const response = NextResponse.json({ message: 'Login successful', user: userInfo }, { status: 200 });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return response;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
