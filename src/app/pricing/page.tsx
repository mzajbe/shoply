"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [billingStatus, setBillingStatus] = useState<{ isPremium: boolean; premiumUntil?: string | null }>({ isPremium: false, premiumUntil: null });
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [billingError, setBillingError] = useState("");

  useEffect(() => {
    const loadBilling = async () => {
      try {
        const res = await fetch("/api/billing/status", { cache: "no-store" });
        const data = await res.json();
        setBillingStatus({
          isPremium: !!data?.isPremium,
          premiumUntil: data?.premiumUntil || null,
        });
      } catch {
        setBillingStatus({ isPremium: false, premiumUntil: null });
      } finally {
        setLoading(false);
      }
    };
    loadBilling();
  }, []);

  const startPremiumCheckout = async () => {
    setBillingError("");
    setProcessingPayment(true);
    try {
      const res = await fetch("/api/billing/aamarpay/create", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data?.paymentUrl) {
        throw new Error(data?.message || "Payment initiation failed");
      }
      window.location.href = data.paymentUrl;
    } catch (error: any) {
      setBillingError(error?.message || "Unable to start checkout");
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.5em] text-amber-300">Pricing</div>
            <h1 className="mt-4 text-4xl md:text-5xl font-black leading-tight">
              Choose the plan that scales your storefront.
            </h1>
            <p className="mt-4 text-slate-300 max-w-2xl">
              Start free with Minimal, or unlock Modern for premium layouts, exclusive styling blocks, and priority updates.
            </p>
          </div>
          <Link
            href="/dashboard/v1/theme"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
          >
            Back to Theme Library
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Free</div>
            <h2 className="mt-4 text-3xl font-black">Minimal</h2>
            <p className="mt-2 text-slate-300">Launch fast with the essential storefront setup.</p>
            <div className="mt-6 text-4xl font-black">0 TK</div>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <div>Minimal theme access</div>
              <div>Core layout blocks</div>
              <div>Standard support</div>
            </div>
            <div className="mt-8">
              <Link
                href="/dashboard/v1/theme"
                className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold"
              >
                Use Free Theme
              </Link>
            </div>
          </div>

          <div className="relative rounded-[28px] border border-amber-300/40 bg-white text-slate-900 p-8 shadow-2xl">
            <div className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              Premium
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-600">Membership</div>
            <h2 className="mt-4 text-3xl font-black">Modern</h2>
            <p className="mt-2 text-slate-600">Designed for high-impact storytelling and bold visuals.</p>
            <div className="mt-6 flex items-end gap-2">
              <div className="text-5xl font-black">199</div>
              <div className="text-sm text-slate-500 mb-2">TK / month</div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <div>Modern theme access + updates</div>
              <div>Premium design blocks</div>
              <div>Priority support</div>
            </div>
            {billingStatus.isPremium && (
              <div className="mt-6 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-4 py-2">
                Premium active
              </div>
            )}
            {billingError && (
              <div className="mt-6 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest px-4 py-2">
                {billingError}
              </div>
            )}
            <div className="mt-8">
              <button
                onClick={startPremiumCheckout}
                disabled={processingPayment || billingStatus.isPremium || loading}
                className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-amber-500 text-slate-900 text-sm font-black uppercase tracking-widest shadow-lg hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {billingStatus.isPremium ? "Already Premium" : processingPayment ? "Redirecting..." : "Pay with AamarPay"}
              </button>
            </div>
            <div className="mt-4 text-[10px] text-slate-500">
              Developer mode uses AamarPay sandbox for safe testing.
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
          <div className="rounded-2xl border border-slate-800 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-300">Cancel Anytime</div>
            <p className="mt-3">Your premium membership renews monthly, and you can cancel whenever you want.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-300">Secure Checkout</div>
            <p className="mt-3">Payments are processed through AamarPay's sandbox gateway in developer mode.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-300">Premium Support</div>
            <p className="mt-3">Get priority assistance for premium storefront customization.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
