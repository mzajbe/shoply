import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Premium API endpoint' });
}

export async function POST() {
  return NextResponse.json({ message: 'Premium API endpoint' });
}