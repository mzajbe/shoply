import React from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: "Active" | "Draft" | "Archived";
};

const allProducts: Product[] = [
  { id: "P001", name: "Wireless Headphones", sku: "WH-001", category: "Electronics", price: "$79.99", stock: 45, status: "Active" },
  { id: "P002", name: "USB-C Cable", sku: "USB-002", category: "Accessories", price: "$12.99", stock: 120, status: "Active" },
  { id: "P003", name: "Phone Stand", sku: "PS-003", category: "Accessories", price: "$24.99", stock: 0, status: "Active" },
  { id: "P004", name: "Laptop Case", sku: "LC-004", category: "Cases", price: "$49.99", stock: 32, status: "Active" },
  { id: "P005", name: "Screen Protector", sku: "SP-005", category: "Accessories", price: "$9.99", stock: 200, status: "Draft" },
  { id: "P006", name: "Bluetooth Speaker", sku: "BS-006", category: "Electronics", price: "$89.99", stock: 15, status: "Active" },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar active="Products" />
        <main className="flex-1">
          <Header />
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold">Products</h1>
                <p className="text-sm text-slate-600 mt-1">Manage your product catalog and inventory</p>
              </div>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition">
                + Add Product
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">All Products ({allProducts.length})</h2>
                </div>
                <input
                  placeholder="Search products..."
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
                />
              </div>

              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left text-slate-600">Product</th>
                    <th className="p-3 text-left text-slate-600">SKU</th>
                    <th className="p-3 text-left text-slate-600">Category</th>
                    <th className="p-3 text-left text-slate-600">Price</th>
                    <th className="p-3 text-left text-slate-600">Stock</th>
                    <th className="p-3 text-left text-slate-600">Status</th>
                    <th className="p-3 text-center text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((product) => (
                    <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-3 font-medium">{product.name}</td>
                      <td className="p-3 text-slate-500">{product.sku}</td>
                      <td className="p-3 text-slate-500">{product.category}</td>
                      <td className="p-3 font-medium">{product.price}</td>
                      <td className="p-3">
                        <span className={product.stock === 0 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                      </td>
                      <td className="p-3">
                        <StatusPill status={product.status} />
                      </td>
                      <td className="p-3 text-center">
                        <button className="text-orange-600 hover:underline text-sm mr-3">Edit</button>
                        <button className="text-red-600 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Product["status"] }) {
  const cls = status === "Active" ? "bg-green-100 text-green-800" : status === "Draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800";
  return <span className={`${cls} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium`}>{status}</span>;
}

function Sidebar({ active }: { active: string }) {
  const navItems = [
    { label: "Overview", icon: <IconGrid />, href: "/ahmed-dashboard" },
    { label: "Orders", icon: <IconShoppingCart />, href: "/ahmed-dashboard/orders" },
    { label: "Products", icon: <IconBox />, href: "/ahmed-dashboard/products" },
    { label: "Customers", icon: <IconUsers />, href: "/ahmed-dashboard/customers" },
    { label: "Marketing", icon: <IconMegaphone />, href: "/ahmed-dashboard/marketing" },
    { label: "Settings", icon: <IconCog />, href: "/ahmed-dashboard/settings" },
  ];

  return (
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                active === item.label ? "bg-slate-100 font-medium" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="w-5 h-5 text-slate-500">{item.icon}</div>
              <div className="flex-1">{item.label}</div>
            </Link>
          ))}
        </nav>

        <div className="mt-6">
          <button className="w-full text-sm px-3 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700">
            Add product
          </button>
        </div>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
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
  );
}

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" />
      <rect x="13" y="3" width="8" height="8" />
      <rect x="3" y="13" width="8" height="8" />
      <rect x="13" y="13" width="8" height="8" />
    </svg>
  );
}

function IconShoppingCart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73L13 3l-7 3.27A2 2 0 0 0 5 8v8a2 2 0 0 0 1 1.73L11 21l7-3.27A2 2 0 0 0 19 16z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMegaphone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v2a2 2 0 0 0 2 2h3l7 4V5L8 9H5a2 2 0 0 0-2 2z" />
    </svg>
  );
}

function IconCog() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.27 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.21 4.2A2 2 0 0 1 7 1.37l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c.06.6.36 1.08 1 1.51h.01c.64.43 1 .91 1.06 1.51V7a1.65 1.65 0 0 0 1 1.51c.66.43 1 .91 1.06 1.51V11a2 2 0 0 1 0 4h-.09c-.6.06-1.08.36-1.51 1z" />
    </svg>
  );
}
