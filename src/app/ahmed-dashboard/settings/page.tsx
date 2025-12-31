import React from "react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar active="Settings" />
        <main className="flex-1">
          <Header />
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold">Settings</h1>
              <p className="text-sm text-slate-600 mt-1">Manage your store settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <SettingsSection
                  title="Store Information"
                  description="Update your store name, email, and other details"
                  fields={[
                    { label: "Store Name", value: "My Store" },
                    { label: "Store Email", value: "store@example.com" },
                    { label: "Phone", value: "+1-555-0123" },
                    { label: "Address", value: "123 Main St, City, Country" },
                  ]}
                />

                <SettingsSection
                  title="Payment Settings"
                  description="Configure your payment methods and accounts"
                  fields={[
                    { label: "Stripe Account", value: "Connected ✓" },
                    { label: "PayPal Account", value: "Not connected" },
                    { label: "Bank Account", value: "****-****-9876" },
                  ]}
                />

                <SettingsSection
                  title="Email Notifications"
                  description="Choose what notifications you want to receive"
                  fields={[
                    { label: "New Orders", value: "Enabled" },
                    { label: "Low Stock Alerts", value: "Enabled" },
                    { label: "Customer Reviews", value: "Disabled" },
                  ]}
                />

                <SettingsSection
                  title="Shipping Settings"
                  description="Configure your shipping zones and rates"
                  fields={[
                    { label: "Default Shipping", value: "Standard - $5" },
                    { label: "Express Shipping", value: "Available - $15" },
                  ]}
                />
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                  <h3 className="font-semibold mb-4">Store Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Products</span>
                      <span className="font-medium">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Orders</span>
                      <span className="font-medium">287</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Customers</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Monthly Revenue</span>
                      <span className="font-medium">$12,450</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                  <h3 className="font-semibold mb-4">Account</h3>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50">
                      Change Password
                    </button>
                    <button className="w-full px-4 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50">
                      Delete Account
                    </button>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-sm font-semibold text-orange-900">Need Help?</div>
                  <div className="text-xs text-orange-800 mt-1">Contact our support team or visit our help center.</div>
                  <Link href="#" className="text-xs text-orange-600 hover:underline mt-2 inline-block">
                    View Documentation →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SettingsSection({ title, description, fields }: { title: string; description: string; fields: { label: string; value: string }[] }) {
  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{description}</p>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0">
            <div>
              <div className="font-medium text-sm">{field.label}</div>
              <div className="text-xs text-slate-500 mt-1">{field.value}</div>
            </div>
            <button className="text-sm text-orange-600 hover:underline">Edit</button>
          </div>
        ))}
      </div>

      <button className="mt-4 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition">
        Save Changes
      </button>
    </div>
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
