import { NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import pool from '@/lib/db';

export const runtime = 'nodejs';

type ProductPayload = {
    id?: string;
    name: string;
    sku: string;
    category: string;
    price: string;
    stock: number;
    status: string;
    imageUrl?: string;
};

type ParsedRequest = {
    data: ProductPayload;
    file: File | null;
};

function parseStock(value: unknown) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

async function parseRequest(request: Request): Promise<ParsedRequest> {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        const data: ProductPayload = {
            id: String(formData.get('id') || ''),
            name: String(formData.get('name') || ''),
            sku: String(formData.get('sku') || ''),
            category: String(formData.get('category') || ''),
            price: String(formData.get('price') || ''),
            stock: parseStock(formData.get('stock')),
            status: String(formData.get('status') || 'Active'),
            imageUrl: String(formData.get('imageUrl') || ''),
        };

        const file = formData.get('image');
        return { data, file: file instanceof File ? file : null };
    }

    const json = await request.json();
    const data: ProductPayload = {
        id: String(json.id || ''),
        name: String(json.name || ''),
        sku: String(json.sku || ''),
        category: String(json.category || ''),
        price: String(json.price || ''),
        stock: parseStock(json.stock),
        status: String(json.status || 'Active'),
        imageUrl: String(json.imageUrl || ''),
    };

    return { data, file: null };
}

async function ensureImageColumn(client: any) {
    await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT');
}

async function saveImageFile(file: File, id: string) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const extension = path.extname(file.name) || '.jpg';
    const filename = `${id}-${crypto.randomUUID()}${extension}`;
    const filePath = path.join(uploadDir, filename);

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(arrayBuffer));

    return `/uploads/${filename}`;
}

export async function GET() {
    const client = await pool.connect();
    try {
        await ensureImageColumn(client);
        const result = await client.query(
            'SELECT id, name, sku, category, price, stock, status, image_url as "imageUrl", created_at FROM products ORDER BY created_at DESC'
        );
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
        await ensureImageColumn(client);
        const { data, file } = await parseRequest(request);
        const { name, sku, category, price, stock, status } = data;

        if (!name || !sku || !category || !price) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const id = 'P' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const imageUrl = file ? await saveImageFile(file, id) : (data.imageUrl?.trim() ? data.imageUrl : null);

        await client.query(
            'INSERT INTO products (id, name, sku, category, price, stock, status, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, name, sku, category, price, stock, status, imageUrl]
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
        await ensureImageColumn(client);
        const { data, file } = await parseRequest(request);
        const { name, sku, category, price, stock, status } = data;
        const id = data.id;

        if (!id) {
            return NextResponse.json({ message: 'ID required' }, { status: 400 });
        }

        if (!name || !sku || !category || !price) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const imageUrl = file ? await saveImageFile(file, id) : (data.imageUrl?.trim() ? data.imageUrl : null);

        await client.query(
            'UPDATE products SET name=$1, sku=$2, category=$3, price=$4, stock=$5, status=$6, image_url=$7 WHERE id=$8',
            [name, sku, category, price, stock, status, imageUrl, id]
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
