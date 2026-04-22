import { NextResponse } from "next/server";
import pool from "@/lib/db";

const PREMIUM_PRICE = "199";
const PREMIUM_CURRENCY = "BDT";

const SUCCESS_STATUSES = new Set(["successful", "success", "paid", "completed"]);

function normalizeAmount(value: string) {
  const num = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

async function handleCallback(request: Request, form: FormData | null, query: URLSearchParams) {
  const status = query.get("status") || "fail";
  let merTxnId = String(
    form?.get("mer_txnid") ||
      form?.get("tran_id") ||
      query.get("mer_txnid") ||
      query.get("tran_id") ||
      ""
  );
  const pgTxnId = String(form?.get("pg_txnid") || query.get("pg_txnid") || "");
  const amount = String(form?.get("amount") || query.get("amount") || "");
  const currency = String(form?.get("currency") || query.get("currency") || "");
  const payStatus = String(form?.get("pay_status") || query.get("pay_status") || "");
  const optA = String(form?.get("opt_a") || query.get("opt_a") || "");

  const clientLookup = await pool.connect();
  try {
    if (!merTxnId && optA && /^\d+$/.test(optA)) {
      const pending = await clientLookup.query(
        "SELECT mer_txnid FROM billing_transactions WHERE user_id=$1 AND status='pending' ORDER BY created_at DESC LIMIT 1",
        [Number(optA)]
      );
      merTxnId = pending.rows[0]?.mer_txnid || "";
    }
  } catch (error) {
    console.error("AamarPay lookup error:", error);
  } finally {
    clientLookup.release();
  }

  if (!merTxnId) {
    return NextResponse.redirect(new URL("/dashboard?upgrade=failed", request.url));
  }

  const storeId = process.env.AAMARPAY_STORE_ID || "aamarpaytest";
  const signatureKey = process.env.AAMARPAY_SIGNATURE_KEY || "dbb74894e82415a2f7ff0ec3a97e4183";
  const baseUrl = process.env.AAMARPAY_BASE_URL || "https://sandbox.aamarpay.com";

  const client = await pool.connect();
  try {
    let verified = false;
    let verifiedAmount = amount;
    let verifiedCurrency = currency;

    try {
      const verifyUrl = `${baseUrl}/api/v1/trxcheck/request.php?request_id=${encodeURIComponent(
        merTxnId
      )}&store_id=${encodeURIComponent(storeId)}&signature_key=${encodeURIComponent(
        signatureKey
      )}&type=json`;
      const verifyRes = await fetch(verifyUrl, { method: "GET" });
      const verifyData = await verifyRes.json().catch(() => null);
      const statusCode = String(verifyData?.status_code || "");
      const verifyPayStatus = String(verifyData?.pay_status || "");
      verifiedAmount = String(verifyData?.amount || verifiedAmount);
      verifiedCurrency = String(verifyData?.currency || verifiedCurrency);
      verified =
        statusCode === "2" ||
        SUCCESS_STATUSES.has(verifyPayStatus.toLowerCase());
    } catch (error) {
      console.error("AamarPay verify error:", error);
    }

    const amountMatch =
      normalizeAmount(verifiedAmount) === normalizeAmount(PREMIUM_PRICE) ||
      normalizeAmount(amount) === normalizeAmount(PREMIUM_PRICE);
    const currencyMatch =
      (verifiedCurrency || currency || "").trim().toUpperCase() === PREMIUM_CURRENCY;

    const isSuccess =
      (status === "success" || SUCCESS_STATUSES.has(payStatus.toLowerCase()) || verified) &&
      amountMatch &&
      currencyMatch;

    if (!isSuccess) {
      await client.query(
        "UPDATE billing_transactions SET status=$1, pg_txnid=$2, updated_at=NOW() WHERE mer_txnid=$3",
        [status === "cancel" ? "canceled" : "failed", pgTxnId || null, merTxnId]
      );
      return NextResponse.redirect(new URL("/dashboard?upgrade=failed", request.url));
    }

    let userId: number | null = null;
    if (optA && /^\d+$/.test(optA)) {
      userId = Number(optA);
    } else {
      const txnRes = await client.query("SELECT user_id FROM billing_transactions WHERE mer_txnid=$1", [merTxnId]);
      userId = txnRes.rows[0]?.user_id || null;
    }

    if (!userId) {
      return NextResponse.redirect(new URL("/dashboard?upgrade=failed", request.url));
    }

    await client.query(
      "UPDATE billing_transactions SET status='paid', pg_txnid=$1, updated_at=NOW() WHERE mer_txnid=$2",
      [pgTxnId || null, merTxnId]
    );

    await client.query(
      `UPDATE users
       SET premium_until = (CASE WHEN premium_until IS NULL OR premium_until < NOW() THEN NOW() ELSE premium_until END) + INTERVAL '30 days'
       WHERE id = $1`,
      [userId]
    );

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("AamarPay callback error:", error);
    return NextResponse.redirect(new URL("/dashboard?upgrade=failed", request.url));
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  let form: FormData | null = null;
  try {
    form = await request.formData();
  } catch {
    form = null;
  }
  return handleCallback(request, form, url.searchParams);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  return handleCallback(request, null, url.searchParams);
}
