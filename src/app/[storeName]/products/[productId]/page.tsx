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

type Product = {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  price?: string;
  stock?: number;
  status?: string;
  imageUrl?: string | null;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const storeNameParam = Array.isArray(params?.storeName) ? params.storeName[0] : params?.storeName;
  const productIdParam = Array.isArray(params?.productId) ? params.productId[0] : params?.productId;
  const storeName = typeof storeNameParam === "string" ? storeNameParam : "";
  const productId = typeof productIdParam === "string" ? decodeURIComponent(productIdParam) : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<{ globalColor: string; globalFont: string; pageSections?: Record<string, any[]> } | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", quantity: 1 });
  const { addItem, count } = useCart();

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
        // fall back below
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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch("/api/dashboard/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const found = list.find((p: any) => String(p.id) === String(productId));
        setProduct(found || null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    } else {
      setLoading(false);
      setProduct(null);
    }
  }, [productId]);

  const themeStyle = useMemo(() => {
    return theme ? { fontFamily: theme.globalFont } : undefined;
  }, [theme]);

  const primaryColor = theme?.globalColor || "#6366f1";
  const storeHomeHref = storeName ? `/${storeName}` : "/";
  const cartHref = storeName ? `/${storeName}/cart` : "/dashboard/v1/theme/preview";
  const pageLinks = Object.keys(theme?.pageSections || { Home: [] });

  const unitPrice = useMemo(() => {
    const raw = String(product?.price || "");
    const value = Number(raw.replace(/[^0-9.]/g, ""));
    return Number.isFinite(value) ? value : 0;
  }, [product?.price]);

  const currencySymbol = useMemo(() => {
    const raw = String(product?.price || "");
    return raw.trim().startsWith("$") ? "$" : "$";
  }, [product?.price]);

  const totalPrice = useMemo(() => {
    const qty = Math.max(1, Number(formData.quantity) || 1);
    return `${currencySymbol}${(unitPrice * qty).toFixed(2)}`;
  }, [currencySymbol, unitPrice, formData.quantity]);

  const submitOrder = async () => {
    if (!product) return;
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    setOrderStatus("submitting");
    try {
      const res = await fetch("/api/dashboard/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData.name.trim(),
          email: formData.email.trim(),
          total: totalPrice,
          status: "Paid",
          productId: product.id,
          productName: product.name,
          quantity: Math.max(1, Number(formData.quantity) || 1),
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      setOrderStatus("success");
      setShowCheckout(false);
      setFormData({ name: "", email: "", quantity: 1 });
      alert("Order placed successfully!");
    } catch (e) {
      setOrderStatus("error");
      alert("Failed to place order. Please try again.");
    } finally {
      setOrderStatus("idle");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900" style={themeStyle}>
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
        <div className="mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Link href={storeHomeHref} className="hover:text-slate-600">Store</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-500">Product</span>
        </div>

        {loading && (
          <div className="py-20 text-center text-slate-400 font-semibold">Loading product...</div>
        )}

        {!loading && !product && (
          <div className="py-20 text-center">
            <h1 className="text-2xl font-black text-slate-900">Product not found</h1>
            <p className="text-slate-500 mt-2">This product may have been removed.</p>
            <Link href={storeHomeHref} className="inline-block mt-6 px-5 py-3 rounded-full text-white text-sm font-black" style={{ backgroundColor: primaryColor }}>
              Back to Store
            </Link>
          </div>
        )}

        {!loading && product && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3 space-y-6">
              <Card className="overflow-hidden">
                <div className="aspect-[4/5] bg-slate-100 relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black uppercase tracking-widest text-xl">
                      {product.price || "No Image"}
                    </div>
                  )}
                  {product.status && (
                    <Badge variant="secondary" className="absolute top-4 left-4">
                      {product.status}
                    </Badge>
                  )}
                </div>
                <CardContent className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Product Highlights</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {typeof product.stock === "number" && product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-400">Category</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 font-bold text-slate-800">
                    {product.category || "Uncategorized"}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-400">SKU</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 font-bold text-slate-800">{product.sku || "N/A"}</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-400">Stock</CardTitle>
                  </CardHeader>
                  <CardContent className={`pt-0 font-bold ${product.stock === 0 ? "text-red-600" : "text-slate-800"}`}>
                    {typeof product.stock === "number" ? product.stock : "—"}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Badge variant="outline" className="w-fit">Limited Edition</Badge>
                  <CardTitle className="mt-4 text-4xl font-black leading-tight text-slate-900">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black" style={{ color: primaryColor }}>
                      {product.price || "Price on request"}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tax included</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Crafted for modern storefronts, this product details page pulls live data from your dashboard and updates instantly.
                  </p>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      if (product) {
                        addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null }, 1);
                      }
                    }}
                    className="w-full"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Add to Cart
                  </Button>
                  <Button variant="outline" onClick={() => setShowCheckout(true)} className="w-full">
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-400">Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Standard Shipping</span>
                    <span className="font-bold text-slate-800">3-5 Days</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span>Express Shipping</span>
                    <span className="font-bold text-slate-800">1-2 Days</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span>Return Window</span>
                    <span className="font-bold text-slate-800">30 Days</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-400">Why customers love it</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                    Premium materials and polished finish
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                    Built for durability with everyday use
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                    Designed to match your brand aesthetic
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {showCheckout && product && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-lg p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Complete Purchase</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowCheckout(false)}>✕</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-slate-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No Image</div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{product.name}</div>
                  <div className="text-sm text-slate-500">{product.price}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Your Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, Number(e.target.value) || 1) })}
                />
              </div>

              <div className="flex items-center justify-between text-sm font-bold">
                <span>Total</span>
                <span style={{ color: primaryColor }}>{totalPrice}</span>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setShowCheckout(false)}>Cancel</Button>
              <Button onClick={submitOrder} disabled={orderStatus === "submitting"} style={{ backgroundColor: primaryColor }}>
                {orderStatus === "submitting" ? "Placing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  );
}
