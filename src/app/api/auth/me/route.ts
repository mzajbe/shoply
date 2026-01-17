import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const token = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1]; // Simple cookie parsing or use cookies() from next/headers

    // Better way with Next.js specific API
    // import { cookies } from 'next/headers';
    // const cookieStore = cookies();
    // const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT id, name, email FROM users WHERE id = $1', [payload.userId]);
            if (result.rows.length === 0) {
                return NextResponse.json({ user: null }, { status: 200 });
            }
            return NextResponse.json({ user: result.rows[0] }, { status: 200 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
