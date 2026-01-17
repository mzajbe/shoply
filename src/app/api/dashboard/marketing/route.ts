import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM campaigns ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching campaigns' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const client = await pool.connect();
    try {
        const { name, type, status } = await request.json();
        const id = 'M' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        await client.query(
            'INSERT INTO campaigns (id, name, type, status) VALUES ($1, $2, $3, $4)',
            [id, name, type, status]
        );

        return NextResponse.json({ message: 'Campaign created', id }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating campaign' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PUT(request: Request) {
    const client = await pool.connect();
    try {
        const { id, name, type, status } = await request.json();

        await client.query(
            'UPDATE campaigns SET name=$1, type=$2, status=$3 WHERE id=$4',
            [name, type, status, id]
        );

        return NextResponse.json({ message: 'Campaign updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating campaign' }, { status: 500 });
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
        await client.query('DELETE FROM campaigns WHERE id = $1', [id]);
        return NextResponse.json({ message: 'Campaign deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting campaign' }, { status: 500 });
    } finally {
        client.release();
    }
}
