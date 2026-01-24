"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Exclude full-page editor and preview routes from the dashboard layout
    const isFullPage = pathname.startsWith("/dashboard/v1/theme/editor") ||
        pathname.startsWith("/dashboard/v1/theme/preview");

    if (isFullPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="flex">
                <Sidebar />
                <main className="flex-1">
                    <Header />
                    {children}
                </main>
            </div>
        </div>
    );
}

type Order = { total: string; date: string; status: string };
type User = { id: number; name: string; email: string };

function Sidebar() {
    const pathname = usePathname();
    const [storeName, setStoreName] = useState<string>("Shoply");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch("/api/dashboard/settings", { cache: "no-store" });
                if (!res.ok) return;
                const data = await res.json();
                setStoreName(data?.store_name || "Shoply");
            } catch {
                setStoreName("Shoply");
            } finally {
                setLoaded(true);
            }
        };
        loadSettings();
    }, []);

    const navItems = [
        { label: "Overview", icon: <IconGrid />, href: "/dashboard/v1" },
        { label: "Themes", icon: <IconPalette />, href: "/dashboard/v1/theme" },
        { label: "Orders", icon: <IconShoppingCart />, href: "/dashboard/v1/orders" },
        { label: "Products", icon: <IconBox />, href: "/dashboard/v1/products" },
        { label: "Customers", icon: <IconUsers />, href: "/dashboard/v1/customers" },
        { label: "Marketing", icon: <IconMegaphone />, href: "/dashboard/v1/marketing" },
        { label: "Settings", icon: <IconCog />, href: "/dashboard/v1/settings" },
    ];

    return (
        <aside className="w-72 bg-white border-r border-slate-200 min-h-screen sticky top-0">
            <div className="px-6 py-6">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                    <div className="rounded-md bg-orange-600 text-white w-10 h-10 flex items-center justify-center font-bold">S</div>
                    <div>
                        <div className="font-extrabold">{storeName}</div>
                        <div className="text-xs text-slate-500">{loaded ? "Store owner" : "Loading..."}</div>
                    </div>
                </Link>

                <nav className="mt-8 space-y-1 text-sm">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? "bg-slate-100 font-medium" : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="w-5 h-5 text-slate-500">{item.icon}</div>
                                <div className="flex-1">{item.label}</div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-6">
                    <Link
                        href="/dashboard/v1/products"
                        className="w-full text-sm px-3 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 inline-flex items-center justify-center"
                    >
                        Add product
                    </Link>
                </div>
            </div>
        </aside>
    );
}

function Header() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [storeName, setStoreName] = useState<string>("My Store");
    const [loaded, setLoaded] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const loadHeader = async () => {
            try {
                const [ordersRes, meRes, settingsRes] = await Promise.all([
                    fetch("/api/dashboard/orders", { cache: "no-store" }),
                    fetch("/api/auth/me", { cache: "no-store" }),
                    fetch("/api/dashboard/settings", { cache: "no-store" }),
                ]);
                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setOrders(Array.isArray(data) ? data : []);
                }
                if (meRes.ok) {
                    const data = await meRes.json();
                    setUser(data?.user || null);
                }
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    setStoreName(data?.store_name || "My Store");
                }
            } catch {
                // ignore
            } finally {
                setLoaded(true);
            }
        };
        loadHeader();
    }, []);

    const parseMoney = (value: string) => {
        const num = Number(String(value || "").replace(/[^0-9.]/g, ""));
        return Number.isFinite(num) ? num : 0;
    };

    const salesToday = useMemo(() => {
        const today = new Date();
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);

        return orders
            .filter((o) => o.status === "Paid")
            .filter((o) => {
                const parsed = Date.parse(o.date);
                if (!Number.isFinite(parsed)) return false;
                const d = new Date(parsed);
                return d >= start && d <= end;
            })
            .reduce((sum, o) => sum + parseMoney(o.total), 0);
    }, [orders]);

    const userInitials = useMemo(() => {
        const base = user?.name || storeName || "Store";
        const parts = base.trim().split(/\s+/).slice(0, 2);
        return parts.map((p) => p[0]).join("").toUpperCase();
    }, [user?.name, storeName]);

    const notificationItems = useMemo(() => {
        return orders.slice(0, 5).map((order) => ({
            id: order.id,
            status: order.status,
            total: order.total,
            date: order.date,
        }));
    }, [orders]);

    const notificationCount = useMemo(() => {
        return orders.filter((o) => o.status === "Pending").length;
    }, [orders]);

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
                <div className="text-sm text-slate-600">
                    Sales today:
                    <span className="font-medium text-slate-900 ml-1">
                        {loaded ? `$${salesToday.toFixed(2)}` : "Loading..."}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        className="text-slate-600 hover:text-slate-900 relative"
                        onClick={() => setShowNotifications((v) => !v)}
                    >
                        Notifications
                        {notificationCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold bg-orange-600 text-white rounded-full w-5 h-5">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                            <div className="px-4 py-3 border-b border-slate-200 text-sm font-semibold">Recent orders</div>
                            <ul className="max-h-64 overflow-auto">
                                {notificationItems.length === 0 && (
                                    <li className="px-4 py-4 text-sm text-slate-500">No notifications yet.</li>
                                )}
                                {notificationItems.map((item) => (
                                    <li key={item.id} className="px-4 py-3 border-b border-slate-100 text-sm">
                                        <div className="font-medium">Order #{item.id} • {item.status}</div>
                                        <div className="text-xs text-slate-500">{item.total} — {item.date}</div>
                                    </li>
                                ))}
                            </ul>
                            <div className="px-4 py-3 text-xs text-slate-400">Showing latest 5 orders</div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-sm font-medium">{user?.name || "Store Owner"}</div>
                        <div className="text-xs text-slate-500">{storeName}</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">{userInitials}</div>
                </div>
            </div>
        </header>
    );
}

/* -------------------- Icons -------------------- */
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

function IconPalette() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a9 9 0 1 0 0 18h1a3 3 0 0 0 0-6h-1a3 3 0 0 1 0-6z" />
            <circle cx="8.5" cy="10.5" r="1" />
            <circle cx="11.5" cy="7.5" r="1" />
            <circle cx="15.5" cy="10.5" r="1" />
            <circle cx="16.5" cy="14.5" r="1" />
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

