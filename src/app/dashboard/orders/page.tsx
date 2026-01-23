import React from "react";
import Link from "next/link";

type Order = {
  id: string;
  customer: string;
  total: string;
  status: "Paid" | "Pending" | "Refunded";
  date: string;
  email: string;
};

const allOrders: Order[] = [
  { id: "1001", customer: "Ayesha Khan", email: "ayesha@example.com", total: "$129.00", status: "Paid", date: "Dec 28, 2025" },
  { id: "1002", customer: "John Doe", email: "john@example.com", total: "$49.50", status: "Pending", date: "Dec 27, 2025" },
  { id: "1003", customer: "Liam Smith", email: "liam@example.com", total: "$299.99", status: "Refunded", date: "Dec 26, 2025" },
  { id: "1004", customer: "Maya Patel", email: "maya@example.com", total: "$19.99", status: "Paid", date: "Dec 25, 2025" },
  { id: "1005", customer: "Sarah Johnson", email: "sarah@example.com", total: "$89.99", status: "Paid", date: "Dec 24, 2025" },
  { id: "1006", customer: "Ahmed Hassan", email: "ahmed@example.com", total: "$159.99", status: "Pending", date: "Dec 23, 2025" },
];

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Orders</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and track all your store orders</p>
          </div>
          <Link href="/dashboard" className="text-sm px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">All Orders ({allOrders.length})</h2>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition">
                  Export
                </button>
              </div>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-sm text-gray-600 font-medium">
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{order.email}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.total}</td>
                  <td className="px-6 py-4">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{order.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const color = status === "Paid" ? "bg-green-100 text-green-800" : status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  return <span className={`${color} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium`}>{status}</span>;
}

