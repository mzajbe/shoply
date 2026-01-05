import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Demo credentials for now
    const DEMO_EMAIL = 'demo@shoply.test';
    const DEMO_PASSWORD = 'demopassword';

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return NextResponse.json({ success: true, user: { email: DEMO_EMAIL, demo: true } }, { status: 200 });
    }

    // No DB yet — reject other credentials
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
