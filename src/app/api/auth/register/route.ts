import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const client = await pool.connect();
        try {
            const existingUserResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUserResult.rows.length > 0) {
                return NextResponse.json({ message: 'User already exists' }, { status: 409 });
            }

            const hashedPassword = await hashPassword(password);

            const result = await client.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
                [name, email, hashedPassword]
            );

            const user = result.rows[0];
            const token = await signToken({ userId: user.id, email: user.email });

            const response = NextResponse.json({ message: 'User created successfully', user }, { status: 201 });

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
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
