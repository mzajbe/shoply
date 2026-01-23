"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    store_name: "",
    currency: "USD",
    email: "",
    payment_stripe: false,
    payment_paypal: false,
    shipping_rate: "0.00",
    notifications_email: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/dashboard/settings");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setFormData({
          store_name: data.store_name || "",
          currency: data.currency || "USD",
          email: data.email || "",
          payment_stripe: !!data.payment_stripe,
          payment_paypal: !!data.payment_paypal,
          shipping_rate: data.shipping_rate || "0.00",
          notifications_email: data.notifications_email !== undefined ? data.notifications_email : true
        });
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/dashboard/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8 text-neutral-800">
      <h1 className="text-3xl font-semibold mb-6">Store Settings</h1>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-8 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-8">

          {/* General Settings */}
          <Section title="General Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                <input
                  required
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.store_name}
                  onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                <input
                  required
                  type="email"
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </Section>

          {/* Financials */}
          <Section title="Financials & Currency">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <select
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="BDT">BDT (৳)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Flat Shipping Rate</label>
                <input
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.shipping_rate}
                  onChange={(e) => setFormData({ ...formData, shipping_rate: e.target.value })}
                />
              </div>
            </div>
          </Section>

          {/* Payment Methods */}
          <Section title="Payment Gateways">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <span className="font-medium">Accept Stripe Payments</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.payment_stripe} onChange={(e) => setFormData({ ...formData, payment_stripe: e.target.checked })} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <span className="font-medium">Accept PayPal Payments</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.payment_paypal} onChange={(e) => setFormData({ ...formData, payment_paypal: e.target.checked })} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="Notifications">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Receive email notifications for new orders</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.notifications_email} onChange={(e) => setFormData({ ...formData, notifications_email: e.target.checked })} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </Section>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition disabled:opacity-50 shadow-md hover:shadow-lg transform active:scale-95"
            >
              {saving ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h3>
      {children}
    </div>
  );
}

