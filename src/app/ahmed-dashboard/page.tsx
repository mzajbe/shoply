import React from "react";
import Link from "next/link";

type Stat = { label: string; value: string; delta?: string };

type Order = {
  id: string;
  customer: string;
  email: string;
  total: string;
  status: "Paid" | "Pending" | "Refunded";
  date: string;
};

const stats: Stat[] = [
  { label: "Total Sales", value: "$24,320", delta: "+12%" },
  { label: "Orders", value: "1,342", delta: "+3%" },
  { label: "Avg. Order", value: "$48.12", delta: "-1%" },
  { label: "Visitors", value: "9,204", delta: "+8%" },
];

const recentOrders: Order[] = [
  { id: "1007", customer: "Nadia Rahman", email: "nadia@example.com", total: "$79.99", status: "Paid", date: "Dec 30, 2025" },
  { id: "1006", customer: "Ahmed Hassan", email: "ahmed@example.com", total: "$159.99", status: "Pending", date: "Dec 29, 2025" },
  { id: "1005", customer: "Sarah Johnson", email: "sarah@example.com", total: "$89.99", status: "Paid", date: "Dec 28, 2025" },
  { id: "1004", customer: "Maya Patel", email: "maya@example.com", total: "$19.99", status: "Paid", date: "Dec 27, 2025" },
  { id: "1003", customer: "Liam Smith", email: "liam@example.com", total: "$299.99", status: "Refunded", date: "Dec 26, 2025" },
];

export default function AhmedDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="w-72 bg-white border-r border-slate-200 min-h-screen sticky top-0">
          <div className="px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-orange-600 text-white w-10 h-10 flex items-center justify-center font-bold">S</div>
              <div>
                <div className="font-extrabold">Shoply</div>
                <div className="text-xs text-slate-500">Winter '26</div>
              </div>
            </div>

            <nav className="mt-8 space-y-1 text-sm">
              <NavLink href="/ahmed-dashboard" label="Overview" icon={<IconGrid />} active />
              <NavLink href="/ahmed-dashboard/orders" label="Orders" icon={<IconShoppingCart />} />
              <NavLink href="/ahmed-dashboard/products" label="Products" icon={<IconBox />} />
              <NavLink href="/ahmed-dashboard/customers" label="Customers" icon={<IconUsers />} />
              <NavLink href="/ahmed-dashboard/marketing" label="Marketing" icon={<IconMegaphone />} />
              <NavLink href="/ahmed-dashboard/settings" label="Settings" icon={<IconCog />} />
            </nav>

            <div className="mt-6">
              <button className="w-full text-sm px-3 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700">Add product</button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
              </div>

              <div className="text-sm text-slate-600">Sales today: <span className="font-medium text-slate-900 ml-1">$2,140</span></div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-slate-600 hover:text-slate-900">Notifications</button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">MS</div>
                  <div className="text-xs text-slate-500">My Store</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">MS</div>
              </div>
            </div>
          </header>

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
                    {recentOrders.map((o) => (
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
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-md ${active ? "bg-slate-100 font-medium" : "text-slate-700 hover:bg-slate-50"}`}>
      <div className="w-5 h-5 text-slate-500">{icon}</div>
      <div className="flex-1">{label}</div>
    </Link>
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

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>
  );
}
function IconShoppingCart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  );
}
function IconBox() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 3l-7 3.27A2 2 0 0 0 5 8v8a2 2 0 0 0 1 1.73L11 21l7-3.27A2 2 0 0 0 19 16z"/></svg>
  );
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-3-3.87"/><path d="M7 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
  );
}
function IconMegaphone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2a2 2 0 0 0 2 2h3l7 4V5L8 9H5a2 2 0 0 0-2 2z"/></svg>
  );
}
function IconCog() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.27 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.21 4.2A2 2 0 0 1 7 1.37l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c.06.6.36 1.08 1 1.51h.01c.64.43 1 .91 1.06 1.51V7a1.65 1.65 0 0 0 1 1.51c.66.43 1 .91 1.06 1.51V11a2 2 0 0 1 0 4h-.09c-.6.06-1.08.36-1.51 1z"/></svg>
  );
}

