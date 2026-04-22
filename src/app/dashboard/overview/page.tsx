import React from "react";
import Link from "next/link";
import { fetchOrders, fetchCustomers, fetchProducts } from "@/lib/data";

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
  const recentOrders: Order[] = await fetchOrders();
  const customers = await fetchCustomers();
  const products = await fetchProducts();

  const parseMoney = (value: string) => {
    const num = Number(String(value || "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(num) ? num : 0;
  };

  const totalOrders = recentOrders.length;
  const paidOrders = recentOrders.filter((o) => o.status === "Paid");
  const refundedOrders = recentOrders.filter((o) => o.status === "Refunded");
  const totalSales = paidOrders.reduce((sum, o) => sum + parseMoney(o.total), 0);
  const avgOrder = paidOrders.length ? totalSales / paidOrders.length : 0;
  const visitors = Array.isArray(customers) ? customers.length : 0;

  const stats: Stat[] = [
    { label: "Total Sales", value: `$${totalSales.toFixed(2)}` },
    { label: "Orders", value: `${totalOrders}` },
    { label: "Avg. Order", value: `$${avgOrder.toFixed(2)}` },
    { label: "Products", value: `${Array.isArray(products) ? products.length : 0}` },
  ];

  const conversionRate = totalOrders ? (paidOrders.length / totalOrders) * 100 : 0;
  const returnRate = totalOrders ? (refundedOrders.length / totalOrders) * 100 : 0;

  const toDate = (value: string) => {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? new Date(parsed) : null;
  };

  const buildDailySeries = (orders: Order[], days = 14) => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const buckets: { date: Date; total: number }[] = [];
    for (let i = 0; i < days; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      buckets.push({ date: d, total: 0 });
    }

    for (const order of orders) {
      const d = toDate(order.date);
      if (!d) continue;
      const day = new Date(d);
      day.setHours(0, 0, 0, 0);
      const index = Math.floor((day.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
      if (index >= 0 && index < buckets.length) {
        buckets[index].total += parseMoney(order.total);
      }
    }

    return buckets;
  };

  const dailySeries = buildDailySeries(paidOrders, 14);

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

          <div className="h-60">
            <OverviewChart data={dailySeries} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <SmallStat label="Conversion" value={`${conversionRate.toFixed(1)}%`} />
            <SmallStat label="Return rate" value={`${returnRate.toFixed(1)}%`} />
            <SmallStat label="Avg. cart" value={`$${avgOrder.toFixed(2)}`} />
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
          <Link href="/dashboard/orders" className="text-sm text-orange-600 hover:underline">View all</Link>
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

function OverviewChart({ data }: { data: { date: Date; total: number }[] }) {
  const width = 640;
  const height = 220;
  const padding = 24;
  const maxValue = Math.max(1, ...data.map((d) => d.total));

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.total / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  });

  const gradientId = "overview-gradient";
  const path = `M ${points[0]} ` + points.slice(1).map((p) => `L ${p}`).join(" ");

  const areaPath =
    `${path} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  const formatDay = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={width} height={height} rx="16" fill="#ffffff" />

        {[0.25, 0.5, 0.75, 1].map((p) => {
          const y = height - padding - p * (height - padding * 2);
          return <line key={p} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />;
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={path} fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />

        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * (width - padding * 2);
          const y = height - padding - (d.total / maxValue) * (height - padding * 2);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#fb923c" />
            </g>
          );
        })}

        {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((d, i) => {
          const index = data.findIndex((v) => v === d);
          const x = padding + (index / (data.length - 1)) * (width - padding * 2);
          return (
            <text key={i} x={x} y={height - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">
              {formatDay(d.date)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}



