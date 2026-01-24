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

        // Upsert customer record + update total spent
        const parseMoney = (value: string) => {
            const num = Number(String(value || "").replace(/[^0-9.]/g, ""));
            return Number.isFinite(num) ? num : 0;
        };
        const newSpent = parseMoney(total);
        const existingCustomer = await client.query(
            'SELECT id, spent FROM customers WHERE email = $1',
            [email]
        );

        if (existingCustomer.rows.length > 0) {
            const currentSpent = parseMoney(existingCustomer.rows[0].spent);
            const updatedSpent = `$${(currentSpent + newSpent).toFixed(2)}`;
            await client.query(
                'UPDATE customers SET name = $1, spent = $2 WHERE email = $3',
                [customer, updatedSpent, email]
            );
        } else {
            const customerId = `C${Date.now()}`;
            const spentValue = `$${newSpent.toFixed(2)}`;
            await client.query(
                'INSERT INTO customers (id, name, email, spent, joined) VALUES ($1, $2, $3, $4, $5)',
                [customerId, customer, email, spentValue, formattedDate]
            );
        }

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
