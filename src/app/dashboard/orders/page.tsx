"use client";

import React, { useState, useMemo } from "react";
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
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "All">("All");

  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return allOrders;
    return allOrders.filter(order => order.status === statusFilter);
  }, [statusFilter]);

  const stats = useMemo(() => {
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => {
      const amount = parseFloat(order.total.replace('$', ''));
      return sum + amount;
    }, 0);
    const paidOrders = allOrders.filter(order => order.status === "Paid").length;
    const pendingOrders = allOrders.filter(order => order.status === "Pending").length;
    const refundedOrders = allOrders.filter(order => order.status === "Refunded").length;

    return { totalOrders, totalRevenue, paidOrders, pendingOrders, refundedOrders };
  }, []);

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

        <OrderStats stats={stats} />

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">All Orders ({filteredOrders.length})</h2>
              <div className="flex gap-3 items-center">
                <OrderFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
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
              {filteredOrders.map((order) => (
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

function OrderStats({ stats }: { stats: { totalOrders: number; totalRevenue: number; paidOrders: number; pendingOrders: number; refundedOrders: number } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Paid Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.paidOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Refunded Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.refundedOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderFilters({ statusFilter, setStatusFilter }: { statusFilter: Order["status"] | "All"; setStatusFilter: (status: Order["status"] | "All") => void }) {
  return (
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value as Order["status"] | "All")}
      className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
    >
      <option value="All">All Status</option>
      <option value="Paid">Paid</option>
      <option value="Pending">Pending</option>
      <option value="Refunded">Refunded</option>
    </select>
  );
}

