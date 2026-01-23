"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/app/components/Footer/Footer";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";

type Product = {
  id: string;
  name: string;
  price?: string;
  imageUrl?: string | null;
  category?: string | null;
  status?: string | null;
};

export default function ProductsListingPage() {
  const params = useParams();
  const storeNameParam = Array.isArray(params?.storeName) ? params.storeName[0] : params?.storeName;
  const storeName = typeof storeNameParam === "string" ? storeNameParam : "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<{ globalColor: string; globalFont: string; pageSections?: Record<string, any[]> } | null>(null);
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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/dashboard/products", { cache: "no-store" });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const primaryColor = theme?.globalColor || "#6366f1";
  const storeHomeHref = storeName ? `/${storeName}` : "/";
  const cartHref = storeName ? `/${storeName}/cart` : "/dashboard/v1/theme/preview";
  const pageLinks = Object.keys(theme?.pageSections || { Home: [] });

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (p.status && p.status !== "Active") return false;
      if (!q) return true;
      return String(p.name || "").toLowerCase().includes(q) || String(p.category || "").toLowerCase().includes(q);
    });
  }, [products, search]);

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
            <Badge variant="secondary">Storefront</Badge>
            <h1 className="mt-3 text-4xl font-black">All Products</h1>
            <p className="text-sm text-slate-500 mt-2">
              Explore everything available in your store catalog.
            </p>
          </div>
          <div className="w-full md:w-80">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="py-20 text-center text-slate-400 font-semibold">Loading products...</div>
        )}

        {!loading && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.length === 0 && (
              <div className="col-span-full text-center text-slate-500">
                No products found.
              </div>
            )}
            {visibleProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-[4/5] bg-slate-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-black uppercase tracking-widest text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex items-center justify-between">
                  <div className="text-lg font-black" style={{ color: primaryColor }}>
                    {product.price || "Price on request"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null }, 1)}
                    >
                      Add
                    </Button>
                    <Link
                      href={`${storeHomeHref}/products/${encodeURIComponent(product.id)}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      View
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
