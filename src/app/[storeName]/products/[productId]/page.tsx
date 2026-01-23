"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";

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
  const [theme, setTheme] = useState<{ globalColor: string; globalFont: string } | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch("/api/themes");
        const data = await res.json();
        if (data?.config) {
          setTheme({
            globalColor: data.config.globalColor || "#6366f1",
            globalFont: data.config.globalFont || "Inter",
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
          });
          return;
        }
      } catch {
        // ignore
      }

      setTheme({ globalColor: "#6366f1", globalFont: "Inter" });
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

  return (
    <main className="min-h-screen bg-white text-slate-900" style={themeStyle}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">
          <Link href={storeHomeHref} className="hover:text-slate-600">Store</Link>
          <span className="mx-2">/</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden shadow-sm">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xl">
                  {product.price || "No Image"}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900">{product.name}</h1>
                <p className="text-lg font-black" style={{ color: primaryColor }}>
                  {product.price || "Price on request"}
                </p>
              </div>

              <div className="text-sm text-slate-500 space-y-1">
                {product.sku && <div><span className="font-semibold text-slate-700">SKU:</span> {product.sku}</div>}
                {product.category && <div><span className="font-semibold text-slate-700">Category:</span> {product.category}</div>}
                {typeof product.stock === "number" && (
                  <div>
                    <span className="font-semibold text-slate-700">Stock:</span>{" "}
                    <span className={product.stock === 0 ? "text-red-600 font-semibold" : ""}>{product.stock}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button className="w-full py-4 rounded-full text-white font-black text-sm tracking-widest uppercase" style={{ backgroundColor: primaryColor }}>
                  Add to Cart
                </button>
                <button className="w-full py-4 rounded-full border border-slate-200 text-slate-600 font-bold text-sm">
                  Buy Now
                </button>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">About this product</h2>
                <p className="text-slate-600 leading-relaxed">
                  This product details page is fully dynamic. It shows real product data that you added in your store dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
