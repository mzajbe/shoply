import React from "react";
import Link from "next/link";
import { fetchStats, fetchOrders } from "@/lib/data";

type Stat = { label: string; value: string; delta?: string };

type Order = {
  id: string;
  customer: string;
  email: string;
  total: string;
  status: "Paid" | "Pending" | "Refunded";
  date: string;
};

export default async function AhmedDashboardPage() {
  const stats: Stat[] = await fetchStats();
  const recentOrders: Order[] = await fetchOrders();

  return (
    <div className="p-8">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overview</h3>
            <div className="text-sm text-slate-500">Last 30 days</div>
          </div>

          <div className="h-60 flex items-center justify-center text-slate-400">[Chart placeholder]</div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <SmallStat label="Conversion" value="2.4%" />
            <SmallStat label="Return rate" value="0.6%" />
            <SmallStat label="Avg. cart" value="$58.10" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent activity</h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
              <div>
                <div className="font-medium">Order #1007 paid</div>
                <div className="text-xs text-slate-500">Nadia Rahman — Dec 30, 2025</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2" />
              <div>
                <div className="font-medium">New customer signed up</div>
                <div className="text-xs text-slate-500">ahmed@example.com — Dec 29, 2025</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-400 mt-2" />
              <div>
                <div className="font-medium">Refund issued</div>
                <div className="text-xs text-slate-500">Order #1003 — Dec 26, 2025</div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-6 bg-white rounded-lg shadow border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent orders</h3>
          <Link href="/ahmed-dashboard/orders" className="text-sm text-orange-600 hover:underline">View all</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-600 bg-slate-50">
              <tr>
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3 font-medium">#{o.id}</td>
                  <td className="p-3">{o.customer}</td>
                  <td className="p-3 text-slate-500">{o.email}</td>
                  <td className="p-3 font-medium">{o.total}</td>
                  <td className="p-3"><StatusPill status={o.status} /></td>
                  <td className="p-3 text-slate-500">{o.date}</td>
                  <td className="p-3 text-center">
                    <button className="text-orange-600 text-sm hover:underline">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow border border-slate-200 flex items-center justify-between">
      <div>
        <div className="text-xs text-slate-500">{stat.label}</div>
        <div className="text-2xl font-semibold">{stat.value}</div>
      </div>
      <div className={`text-sm ${stat.delta && stat.delta.startsWith("+") ? "text-green-600" : "text-red-600"}`}>{stat.delta}</div>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-md p-3 text-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const cls = status === "Paid" ? "bg-green-100 text-green-800" : status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  return <span className={`${cls} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium`}>{status}</span>;
}


