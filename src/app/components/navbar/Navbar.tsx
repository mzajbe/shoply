 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { id: number; name: string; email: string };

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoaded(true);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/dashboard/settings", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setStoreName(data?.store_name || "");
      } catch {
        setStoreName("");
      }
    };
    loadSettings();
  }, [user]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight text-lg">
          Shoply<span className="text-orange-600">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#faq" className="hover:text-slate-900">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {loaded && user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="text-xs uppercase tracking-widest text-slate-400">Store</span>
                <span className="font-bold">{storeName || "Your Shop"}</span>
              </div>
              <Link
                href="/dashboard/v1"
                className="text-sm px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

