import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

const PREMIUM_PRICE = "199";
const PREMIUM_CURRENCY = "BDT";

export async function POST(request: Request) {
  const token = request.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload?.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const userRes = await client.query("SELECT id, name, email FROM users WHERE id = $1", [payload.userId]);
    const user = userRes.rows[0];
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const storeId = process.env.AAMARPAY_STORE_ID || "aamarpaytest";
    const signatureKey = process.env.AAMARPAY_SIGNATURE_KEY || "dbb74894e82415a2f7ff0ec3a97e4183";
    const baseUrl = process.env.AAMARPAY_BASE_URL || "https://sandbox.aamarpay.com";

    const origin = new URL(request.url).origin;
    const tranId = `SUB${user.id}${Date.now().toString().slice(-8)}`.slice(0, 32);

    await client.query(
      `INSERT INTO billing_transactions (user_id, mer_txnid, amount, currency, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
      [user.id, tranId, PREMIUM_PRICE, PREMIUM_CURRENCY]
    );

    const body = {
      store_id: storeId,
      signature_key: signatureKey,
      tran_id: tranId,
      amount: PREMIUM_PRICE,
      currency: PREMIUM_CURRENCY,
      desc: "Shoply Premium Membership (Monthly)",
      cus_name: user.name || "Shoply User",
      cus_email: user.email || "unknown@example.com",
      cus_phone: "0000000000",
      cus_add1: "N/A",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      success_url: `${origin}/api/billing/aamarpay/callback?status=success`,
      fail_url: `${origin}/api/billing/aamarpay/callback?status=fail`,
      cancel_url: `${origin}/api/billing/aamarpay/callback?status=cancel`,
      type: "json",
      opt_a: String(user.id),
      opt_b: "premium_monthly",
    };

    const res = await fetch(`${baseUrl}/jsonpost.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);
    if (!data || data.result !== "true" || !data.payment_url) {
      await client.query("UPDATE billing_transactions SET status='failed' WHERE mer_txnid=$1", [tranId]);
      return NextResponse.json({ message: "Payment initiation failed", detail: data }, { status: 502 });
    }

    return NextResponse.json({ paymentUrl: data.payment_url }, { status: 200 });
  } catch (error) {
    console.error("AamarPay create error:", error);
    return NextResponse.json({ message: "Payment initiation failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
