import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
  if (!token) {
    return NextResponse.json({ isPremium: false, premiumUntil: null }, { status: 200 });
  }

  const payload = await verifyToken(token);
  if (!payload?.userId) {
    return NextResponse.json({ isPremium: false, premiumUntil: null }, { status: 200 });
  }

  const client = await pool.connect();
  try {
    const result = await client.query("SELECT premium_until FROM users WHERE id = $1", [payload.userId]);
    const premiumUntil = result.rows[0]?.premium_until ? new Date(result.rows[0].premium_until) : null;
    const isPremium = !!premiumUntil && premiumUntil.getTime() > Date.now();
    return NextResponse.json({ isPremium, premiumUntil }, { status: 200 });
  } catch (error) {
    console.error("Billing status error:", error);
    return NextResponse.json({ isPremium: false, premiumUntil: null }, { status: 500 });
  } finally {
    client.release();
  }
}
