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

export async function POST(request: Request) {
    const client = await pool.connect();
    try {
        const body = await request.json();
        const {
            customer,
            email,
            total,
            status = "Paid",
            date,
            productId = null,
            productName = null,
            quantity = 1
        } = body || {};

        if (!customer || !email || !total) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await client.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_id VARCHAR(50)');
        await client.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_name VARCHAR(255)');
        await client.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER');

        const now = new Date();
        const orderId = String(Date.now()) + String(Math.floor(Math.random() * 1000)).padStart(3, "0");
        const formattedDate = date || now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        await client.query(
            'INSERT INTO orders (id, customer, email, total, status, date, product_id, product_name, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [orderId, customer, email, total, status, formattedDate, productId, productName, quantity]
        );

        return NextResponse.json({ id: orderId });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PATCH(request: Request) {
    const client = await pool.connect();
    try {
        const body = await request.json();
        const { id, status } = body || {};
        if (!id || !status) {
            return NextResponse.json({ message: 'Missing id or status' }, { status: 400 });
        }
        const result = await client.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
    } finally {
        client.release();
    }
}
