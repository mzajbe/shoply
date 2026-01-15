import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM orders ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
    } finally {
        client.release();
    }
}
