"use client";

import Link from "next/link";
import { allProducts, Product } from "../../../../public/products";

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
                <p className="text-sm text-slate-600 mt-1">
                  Manage your product catalog and inventory
                </p>
              </div>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition">
                + Add Product
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-medium">
                  All Products ({allProducts.length})
                </h2>

                <input
                  placeholder="Search products..."
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  {allProducts.map((product: Product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="p-3 font-medium">{product.name}</td>
                      <td className="p-3 text-slate-500">{product.sku}</td>
                      <td className="p-3 text-slate-500">{product.category}</td>
                      <td className="p-3 font-medium">{product.price}</td>
                      <td className="p-3">
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-3">
                        <StatusPill status={product.status} />
                      </td>
                      <td className="p-3 text-center">
                        <button className="text-orange-600 hover:underline text-sm mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:underline text-sm">
                          Delete
                        </button>
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

/* -------------------- Helper Components -------------------- */

function StatusPill({ status }: { status: Product["status"] }) {
  const cls =
    status === "Active"
      ? "bg-green-100 text-green-800"
      : status === "Draft"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-gray-100 text-gray-800";

  return (
    <span
      className={`${cls} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium`}
    >
      {status}
    </span>
  );
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
          <div className="rounded-md bg-orange-600 text-white w-10 h-10 flex items-center justify-center font-bold">
            S
          </div>
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
                active === item.label
                  ? "bg-slate-100 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="w-5 h-5 text-slate-500">{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
      <input
        placeholder="Search"
        className="px-4 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="flex items-center gap-3">
        <div className="text-sm font-medium">MS</div>
        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
          MS
        </div>
      </div>
    </header>
  );
}

/* -------------------- Icons -------------------- */

function IconGrid() {
  return <div className="w-4 h-4 border" />;
}
function IconShoppingCart() {
  return <div className="w-4 h-4 border" />;
}
function IconBox() {
  return <div className="w-4 h-4 border" />;
}
function IconUsers() {
  return <div className="w-4 h-4 border" />;
}
function IconMegaphone() {
  return <div className="w-4 h-4 border" />;
}
function IconCog() {
  return <div className="w-4 h-4 border" />;
}
