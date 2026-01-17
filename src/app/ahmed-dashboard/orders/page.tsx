import React from "react";
import Link from "next/link";
import { fetchOrders } from "@/lib/data";

type Order = {
  id: string;
  customer: string;
  email: string;
  total: string;
  status: "Paid" | "Pending" | "Refunded";
  date: string;
};

export default async function OrdersPage() {
  const allOrders: Order[] = await fetchOrders();

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
            {allOrders.map((order) => (
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
                  <button className="text-orange-600 hover:underline text-sm">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const cls = status === "Paid" ? "bg-green-100 text-green-800" : status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  return <span className={`${cls} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium`}>{status}</span>;
}

