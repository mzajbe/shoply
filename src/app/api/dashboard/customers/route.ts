import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM customers ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching customers' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const client = await pool.connect();
    try {
        const { name, email, spent, joined } = await request.json();
        const id = 'C' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        await client.query(
            'INSERT INTO customers (id, name, email, spent, joined) VALUES ($1, $2, $3, $4, $5)',
            [id, name, email, spent, joined]
        );

        return NextResponse.json({ message: 'Customer created', id }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating customer' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

    const client = await pool.connect();
    try {
        await client.query('DELETE FROM customers WHERE id = $1', [id]);
        return NextResponse.json({ message: 'Customer deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting customer' }, { status: 500 });
    } finally {
        client.release();
    }
}
