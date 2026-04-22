"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/app/components/Footer/Footer";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const params = useParams();
  const storeNameParam = Array.isArray(params?.storeName) ? params.storeName[0] : params?.storeName;
  const storeName = typeof storeNameParam === "string" ? storeNameParam : "";

  const { items, updateQuantity, removeItem, clearCart, count } = useCart();
  const [theme, setTheme] = useState<{ globalColor: string; globalFont: string; pageSections?: Record<string, any[]> } | null>(null);
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch("/api/themes");
        const data = await res.json();
        if (data?.config) {
          setTheme({
            globalColor: data.config.globalColor || "#6366f1",
            globalFont: data.config.globalFont || "Inter",
            pageSections: data.config.pageSections || {},
          });
          return;
        }
      } catch {
        // ignore
      }

      try {
        const saved = localStorage.getItem("shoply_theme_preview");
        if (saved) {
          const parsed = JSON.parse(saved);
          setTheme({
            globalColor: parsed.globalColor || "#6366f1",
            globalFont: parsed.globalFont || "Inter",
            pageSections: parsed.pageSections || {},
          });
          return;
        }
      } catch {
        // ignore
      }

      setTheme({ globalColor: "#6366f1", globalFont: "Inter", pageSections: { Home: [] } });
    };

    loadTheme();
  }, []);

  const primaryColor = theme?.globalColor || "#6366f1";
  const storeHomeHref = storeName ? `/${storeName}` : "/";
  const cartHref = storeName ? `/${storeName}/cart` : "/dashboard/theme/preview";
  const pageLinks = Object.keys(theme?.pageSections || { Home: [] });

  const parsePrice = (value?: string) => {
    const raw = String(value || "");
    const number = Number(raw.replace(/[^0-9.]/g, ""));
    return Number.isFinite(number) ? number : 0;
  };

  const currencySymbol = useMemo(() => {
    const first = items.find((i) => i.price && String(i.price).trim().length > 0);
    const raw = String(first?.price || "");
    return raw.trim().startsWith("$") ? "$" : "$";
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  }, [items]);

  const formattedSubtotal = `${currencySymbol}${subtotal.toFixed(2)}`;

  const placeOrder = async () => {
    if (!customer.name.trim() || !customer.email.trim()) {
      alert("Please enter your name and email.");
      return;
    }
    if (items.length === 0) return;

    setPlacing(true);
    try {
      for (const item of items) {
        const total = `${currencySymbol}${(parsePrice(item.price) * item.quantity).toFixed(2)}`;
        await fetch("/api/dashboard/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: customer.name.trim(),
            email: customer.email.trim(),
            total,
            status: "Paid",
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
          }),
        });
      }
      clearCart();
      setCustomer({ name: "", email: "" });
      alert("Order placed successfully!");
    } catch {
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: theme?.globalFont || "Inter" }}>
      <div className="sticky top-0 z-30 border-b border-slate-200/60 backdrop-blur bg-white/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="font-black text-lg">
              {storeName ? storeName.replace(/-+/g, " ") : "Brand"}
            </div>
            <nav className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
              {pageLinks.map((name) => (
                <Link
                  key={name}
                  href={`${storeHomeHref}?page=${encodeURIComponent(name)}`}
                  className="hover:text-slate-900 transition text-slate-500"
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={storeHomeHref}
              className={buttonVariants({ size: "sm" })}
              style={{ backgroundColor: primaryColor }}
            >
              Shop Now
            </Link>
            <Link
              href={cartHref}
              className={buttonVariants({ variant: "outline", size: "icon" })}
              aria-label="Cart"
            >
              <span className="text-base">🛒</span>
              {count > 0 && (
                <span className="ml-1 text-[10px] font-black text-slate-700">({count})</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <Badge variant="secondary">Cart</Badge>
            <h1 className="mt-3 text-4xl font-black">Your Cart</h1>
            <p className="text-sm text-slate-500 mt-2">
              Review your items and place your order.
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearCart}>Clear cart</Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card className="mt-10">
            <CardContent className="py-16 text-center text-slate-500">
              Your cart is empty. Start shopping to add products.
              <div className="mt-6">
                <Link href={storeHomeHref} className={buttonVariants({ size: "sm" })} style={{ backgroundColor: primaryColor }}>
                  Browse products
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="py-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-20 w-20 rounded-2xl bg-slate-100 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No Image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-slate-900">{item.name}</div>
                      <div className="text-sm text-slate-500">{item.price || "Price on request"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                      <div className="min-w-8 text-center text-sm font-bold">{item.quantity}</div>
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    </div>
                    <Button variant="ghost" onClick={() => removeItem(item.id)}>Remove</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-bold">{formattedSubtotal}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span>Total</span>
                    <span className="font-black" style={{ color: primaryColor }}>{formattedSubtotal}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Your Name</Label>
                    <Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={placeOrder} disabled={placing} style={{ backgroundColor: primaryColor }} className="w-full">
                    {placing ? "Placing..." : "Place Order"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
