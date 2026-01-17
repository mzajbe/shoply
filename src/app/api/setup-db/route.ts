import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/setup';

export async function GET() {
    try {
        await setupDatabase();
        return NextResponse.json({ message: 'Database initialized successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to initialize database', error: String(error) }, { status: 500 });
    }
}
