 "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/auth/LogoutButton";
import { useSearchParams } from "next/navigation";

const themes = [
  {
    id: "minimal",
    name: "Minimal",
    desc: "A clean, whitespace-focused layout perfect for high-end boutique brands.",
    accent: "bg-indigo-500",
    previewImage: "/themes/minimal.png",
    premium: false,
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Bold typography and high-contrast elements for storytelling and impact.",
    accent: "bg-rose-500",
    previewImage: "/themes/modern.png",
    premium: true,
  },
];

type StoreSettings = {
  store_name?: string;
};

function slugifyStoreName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ThemeLibrary() {
  const search = useSearchParams();
  const [storeName, setStoreName] = useState("");
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [billingStatus, setBillingStatus] = useState<{ isPremium: boolean; premiumUntil?: string | null }>({ isPremium: false, premiumUntil: null });
  const [showPricing, setShowPricing] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [billingError, setBillingError] = useState("");
  const upgradeStatus = search.get("upgrade");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/dashboard/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = (await res.json()) as StoreSettings;
        setStoreName(data.store_name || "");
      } catch (error) {
        setStoreName("");
      } finally {
        setLoadingSettings(false);
      }
    };
    loadSettings();
  }, []);
  useEffect(() => {
    const loadBilling = async () => {
      try {
        const res = await fetch("/api/billing/status", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load billing");
        const data = await res.json();
        setBillingStatus({
          isPremium: !!data?.isPremium,
          premiumUntil: data?.premiumUntil || null,
        });
      } catch {
        setBillingStatus({ isPremium: false, premiumUntil: null });
      } finally {
        // no-op
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

  const storeSlug = useMemo(() => slugifyStoreName(storeName), [storeName]);
  const storePath = storeSlug ? `/${storeSlug}.store` : "";
  const canPreview = !loadingSettings && storeSlug.length > 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Theme Library</h1>
          <p className="text-slate-500 mt-1 text-lg">
            Select a blueprint to start building your no-code storefront.
          </p>
          {upgradeStatus === "success" && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-2 border border-emerald-200">
              Premium activated. Modern theme unlocked.
            </div>
          )}
          {upgradeStatus === "failed" && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-widest px-4 py-2 border border-rose-200">
              Payment failed. Please try again.
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* UPDATED: Added Dashboard button to jump back to the main admin page */}
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            📊 View Dashboard
          </Link>

          <LogoutButton className="inline-flex items-center px-6 py-3 border border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-50 transition-all active:scale-95 shadow-sm" />

          {/* Quick Action: Start from Scratch */}
          <Link
            href="/dashboard/v1/theme/editor"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition-all hover:scale-105 active:scale-95"
          >
            Build from Scratch
          </Link>
        </div>
      </div>

      {/* Theme Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {themes.map((t) => (
          <div key={t.id} className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">

            {/* Theme Visual Preview */}
            <div className="h-56 relative flex items-center justify-center bg-slate-50 overflow-hidden" aria-hidden="true">
              <img
                src={t.previewImage}
                alt={t.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">Explore {t.name}</span>
              </div>
            </div>

            {/* Content & Actions */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-xl text-slate-900">{t.name}</h2>
                <div className="flex items-center gap-2">
                  {t.premium && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded">Premium</span>
                  )}
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded">Template</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {t.desc}
              </p>
              {t.premium && (
                <div className="text-xs font-semibold text-slate-500 mb-4">
                  Premium membership required - 199 TK / month
                </div>
              )}

              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                {canPreview ? (
                  <Link
                    href={storePath}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-md"
                  >
                    Live Preview
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/v1/settings"
                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-300 transition shadow-md"
                    aria-disabled="true"
                  >
                    Set Store Name
                  </Link>
                )}
                {t.premium && !billingStatus.isPremium ? (
                  <button
                    onClick={() => setShowPricing(true)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-50 transition"
                  >
                    Upgrade to Premium
                  </button>
                ) : (
                  <Link
                    href={`/dashboard/v1/theme/editor?id=${t.id}&new=true`}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                  >
                    Live Editor
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blueprint Hint Footer */}
      <div className="mt-16 p-8 bg-orange-50 rounded-3xl border border-orange-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl font-bold">!</div>
        <div>
          <h3 className="font-bold text-lg text-orange-900">Did you know?</h3>
          <p className="text-orange-700/80 max-w-2xl">
            You can change your theme at any time. All your products and custom blocks will automatically adapt to the new design's colors and fonts.
          </p>
        </div>
      </div>

      {showPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-white rounded-[32px] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
              <div className="p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="text-xs font-black uppercase tracking-[0.4em] text-amber-300">Premium Membership</div>
                <h2 className="mt-4 text-3xl font-black leading-tight">
                  Unlock Modern theme + advanced styling presets.
                </h2>
                <p className="mt-4 text-sm text-slate-200 leading-relaxed">
                  Designed for brands that need a high-impact storefront. Get premium typography, curated color systems,
                  and priority updates for the Modern template.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-100">
                  <li>* Modern theme access + updates</li>
                  <li>* Premium design blocks & layouts</li>
                  <li>* Priority product support</li>
                </ul>
              </div>
              <div className="p-8 flex flex-col gap-6">
                <div className="rounded-2xl border border-slate-200 p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Monthly Plan</div>
                  <div className="mt-3 flex items-end gap-2">
                    <div className="text-4xl font-black text-slate-900">199</div>
                    <div className="text-sm text-slate-500 mb-1">TK / month</div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">
                    Auto-renews monthly. Cancel any time.
                  </div>
                </div>
                {billingStatus.isPremium && (
                  <div className="rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-2 border border-emerald-200">
                    Premium active
                  </div>
                )}
                {billingError && (
                  <div className="rounded-xl bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-widest px-4 py-2 border border-rose-200">
                    {billingError}
                  </div>
                )}
                <button
                  onClick={startPremiumCheckout}
                  disabled={processingPayment || billingStatus.isPremium}
                  className="w-full px-6 py-3 rounded-xl bg-amber-500 text-slate-900 font-black uppercase tracking-widest text-xs shadow-lg hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {billingStatus.isPremium ? "Already Premium" : processingPayment ? "Redirecting..." : "Pay with AamarPay"}
                </button>
                <button
                  onClick={() => setShowPricing(false)}
                  className="w-full px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Close
                </button>
                <div className="text-[10px] text-slate-400 leading-relaxed">
                  Payments are processed securely via AamarPay sandbox.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

