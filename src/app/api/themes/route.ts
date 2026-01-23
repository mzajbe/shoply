import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

// Multi-page layout storage
// Using the 'projects' table to store shoply builder state in the 'content' column (JSONB)

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    try {
        const client = await pool.connect();
        try {
            // We search for a project named 'Shoply Store' for this user
            const result = await client.query(
                'SELECT content FROM projects WHERE user_id = $1 AND name = $2',
                [payload.userId, 'Shoply Store']
            );

            if (result.rows.length === 0) {
                return NextResponse.json({ config: null });
            }

            return NextResponse.json({ config: result.rows[0].content });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Fetch project error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { config } = body;

        if (!config) {
            return NextResponse.json({ message: 'Missing config data' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            // UPSERT logic: Insert if not exists, otherwise update
            const checkResult = await client.query(
                'SELECT id FROM projects WHERE user_id = $1 AND name = $2',
                [payload.userId, 'Shoply Store']
            );

            if (checkResult.rows.length === 0) {
                // INSERT
                await client.query(
                    'INSERT INTO projects (user_id, name, content) VALUES ($1, $2, $3)',
                    [payload.userId, 'Shoply Store', config]
                );
                return NextResponse.json({ message: 'Project created and saved' });
            } else {
                // UPDATE
                await client.query(
                    'UPDATE projects SET content = $3, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND name = $2',
                    [payload.userId, 'Shoply Store', config]
                );
                return NextResponse.json({ message: 'Project updated successfully' });
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Save project error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
