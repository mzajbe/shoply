"use client";

import React, { useEffect, useState } from "react";

type Order = {
  id: string;
  customer: string;
  email: string;
  total: string;
  status: "Paid" | "Pending" | "Refunded" | "Cancelled";
  date: string;
};

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/dashboard/orders", { cache: "no-store" });
      const data = await res.json();
      setAllOrders(Array.isArray(data) ? data : []);
    } catch {
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchOrders();
      setSelectedOrder(null);
    } catch {
      alert("Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Orders</h1>
        <p className="text-sm text-slate-600 mt-1">Manage and track all your store orders</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">All Orders ({allOrders.length})</h2>
          </div>
          <div className="flex gap-3">
            <input
              placeholder="Search orders..."
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
            />
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition">
              Export
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 text-left text-slate-600">Order ID</th>
              <th className="p-3 text-left text-slate-600">Customer</th>
              <th className="p-3 text-left text-slate-600">Email</th>
              <th className="p-3 text-left text-slate-600">Total</th>
              <th className="p-3 text-left text-slate-600">Status</th>
              <th className="p-3 text-left text-slate-600">Date</th>
              <th className="p-3 text-center text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">Loading orders...</td>
              </tr>
            )}
            {!loading && allOrders.map((order) => (
              <tr key={order.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 font-medium">#{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3 text-slate-500">{order.email}</td>
                <td className="p-3 font-medium">{order.total}</td>
                <td className="p-3">
                  <StatusPill status={order.status} />
                </td>
                <td className="p-3 text-slate-500">{order.date}</td>
                <td className="p-3 text-center">
                  <button
                    className="text-orange-600 hover:underline text-sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Update Order Status</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-semibold">Order:</span> #{selectedOrder.id}</div>
              <div><span className="font-semibold">Customer:</span> {selectedOrder.customer}</div>
              <div><span className="font-semibold">Total:</span> {selectedOrder.total}</div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
              <select
                className="mt-2 w-full border border-slate-200 rounded-lg p-2 text-sm"
                value={selectedOrder.status}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value as Order["status"] })}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-orange-600 text-white"
                onClick={() => updateStatus(selectedOrder.id, selectedOrder.status)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const cls = status === "Paid" ? "bg-green-100 text-green-800" : status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  return <span className={`${cls} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium`}>{status}</span>;
}

