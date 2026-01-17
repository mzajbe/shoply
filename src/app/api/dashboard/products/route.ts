import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM products ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const client = await pool.connect();
    try {
        const { name, sku, category, price, stock, status } = await request.json();
        const id = 'P' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        await client.query(
            'INSERT INTO products (id, name, sku, category, price, stock, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [id, name, sku, category, price, stock, status]
        );

        return NextResponse.json({ message: 'Product created', id }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PUT(request: Request) {
    const client = await pool.connect();
    try {
        const { id, name, sku, category, price, stock, status } = await request.json();

        await client.query(
            'UPDATE products SET name=$1, sku=$2, category=$3, price=$4, stock=$5, status=$6 WHERE id=$7',
            [name, sku, category, price, stock, status, id]
        );

        return NextResponse.json({ message: 'Product updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
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
        await client.query('DELETE FROM products WHERE id = $1', [id]);
        return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
    } finally {
        client.release();
    }
}
