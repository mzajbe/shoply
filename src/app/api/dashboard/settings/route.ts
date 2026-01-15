import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM store_settings LIMIT 1');
        if (result.rows.length === 0) {
            return NextResponse.json({
                store_name: '',
                currency: 'USD',
                email: '',
                payment_stripe: false,
                payment_paypal: false,
                shipping_rate: '0.00',
                notifications_email: true
            });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching settings' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PUT(request: Request) {
    const client = await pool.connect();
    try {
        const {
            store_name,
            currency,
            email,
            payment_stripe,
            payment_paypal,
            shipping_rate,
            notifications_email
        } = await request.json();

        const check = await client.query('SELECT id FROM store_settings LIMIT 1');

        if (check.rows.length > 0) {
            await client.query(
                `UPDATE store_settings SET 
                store_name=$1, 
                currency=$2, 
                email=$3,
                payment_stripe=$4,
                payment_paypal=$5,
                shipping_rate=$6,
                notifications_email=$7
             WHERE id=$8`,
                [store_name, currency, email, payment_stripe, payment_paypal, shipping_rate, notifications_email, check.rows[0].id]
            );
        } else {
            await client.query(
                `INSERT INTO store_settings (
                store_name, currency, email, payment_stripe, payment_paypal, shipping_rate, notifications_email
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [store_name, currency, email, payment_stripe, payment_paypal, shipping_rate, notifications_email]
            );
        }

        return NextResponse.json({ message: 'Settings updated' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error updating settings' }, { status: 500 });
    } finally {
        client.release();
    }
}
