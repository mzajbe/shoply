import React from "react";

type Order = {
	id: string;
	customer: string;
	total: string;
	status: "Paid" | "Pending" | "Refunded";
	date: string;
};

const sampleOrders: Order[] = [
	{ id: "1001", customer: "Ayesha Khan", total: "$129.00", status: "Paid", date: "Dec 28, 2025" },
	{ id: "1002", customer: "John Doe", total: "$49.50", status: "Pending", date: "Dec 27, 2025" },
	{ id: "1003", customer: "Liam Smith", total: "$299.99", status: "Refunded", date: "Dec 26, 2025" },
	{ id: "1004", customer: "Maya Patel", total: "$19.99", status: "Paid", date: "Dec 25, 2025" },
];

export default function DashboardPage() {
	return (
		<main className="min-h-screen bg-gray-50 p-8">
			<header className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Welcome back to shopify</h1>
					<p className="text-sm text-gray-600">Overview of your store performance</p>
				</div>
				<div className="flex items-center gap-3">
					<button className="rounded bg-black px-4 py-2 text-white">My Store</button>
				</div>
			</header>

			<section className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
				<StatCard title="Total Orders" value="1,248" change="+8%" />
				<StatCard title="Gross Revenue" value="$57,420" change="+12%" />
				<StatCard title="Products" value="124" change="+1%" />
				<StatCard title="Visitors" value="8,904" change="-3%" />
			</section>

			<section className="mt-8 grid gap-6 md:grid-cols-3">
				<div className="md:col-span-2">
					<div className="rounded bg-white p-6 shadow">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-medium">Recent Orders</h2>
							<div className="text-sm text-gray-500">Last 7 days</div>
						</div>
						<table className="w-full table-auto text-left">
							<thead className="text-sm text-gray-500">
								<tr>
									<th className="pb-2">Order</th>
									<th className="pb-2">Customer</th>
									<th className="pb-2">Total</th>
									<th className="pb-2">Status</th>
									<th className="pb-2">Date</th>
								</tr>
							</thead>
							<tbody>
								{sampleOrders.map((o) => (
									<tr key={o.id} className="border-t">
										<td className="py-3 font-medium">#{o.id}</td>
										<td className="py-3">{o.customer}</td>
										<td className="py-3">{o.total}</td>
										<td className="py-3">
											<StatusPill status={o.status} />
										</td>
										<td className="py-3 text-sm text-gray-500">{o.date}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<aside className="space-y-6">
					<div className="rounded bg-white p-6 shadow">
						<h3 className="mb-3 text-sm font-medium">Quick actions</h3>
						<div className="flex flex-col gap-2">
							<button className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-left">Add product</button>
							<button className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-left">View online store</button>
							<button className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-left">Customize theme</button>
						</div>
					</div>

					<div className="rounded bg-white p-6 shadow">
						<h3 className="mb-3 text-sm font-medium">Theme preview</h3>
						<div className="h-40 rounded border border-gray-100 bg-gradient-to-br from-white to-gray-50" />
						<p className="mt-3 text-sm text-gray-500">A quick glance at your shop's theme. Powered by shopify.</p>
					</div>
				</aside>
			</section>
		</main>
	);
}

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
	return (
		<div className="rounded bg-white p-5 shadow">
			<div className="text-sm text-gray-500">{title}</div>
			<div className="mt-2 flex items-baseline justify-between">
				<div className="text-2xl font-semibold">{value}</div>
				<div className="text-sm text-green-600">{change}</div>
			</div>
			<div className="mt-3 h-8 w-full">
				<MiniSparkline />
			</div>
		</div>
	);
}

function MiniSparkline() {
	return (
		<svg width="100%" height="32" viewBox="0 0 100 32" preserveAspectRatio="none">
			<polyline fill="none" stroke="#10b981" strokeWidth={2} points="0,22 20,18 40,10 60,12 80,6 100,8" />
		</svg>
	);
}

function StatusPill({ status }: { status: Order["status"] }) {
	const color = status === "Paid" ? "bg-green-100 text-green-800" : status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
	return <span className={`${color} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium`}>{status}</span>;
}

