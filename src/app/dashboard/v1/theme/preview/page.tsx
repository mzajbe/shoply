"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/app/components/Footer/Footer";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

type Product = {
  id: string;
  name: string;
  price?: string;
  imageUrl?: string | null;
  category?: string | null;
  status?: string | null;
};

const PREVIEW_PRESETS: Record<string, any> = {
  minimal: {
    globalColor: "#6366f1",
    globalFont: "Inter",
    sections: [
      { id: "m1", type: "hero", settings: { layout: "spacious", bgColor: "#ffffff" }, content: { title: "Refined Simplicity", subtitle: "Minimalist design for modern brands.", bgImage: "" } },
      { id: "m2", type: "products", settings: { bgColor: "#f8fafc" }, content: { title: "Essential Collection", count: 3, source: "all", collection: "" } }
    ]
  },
  modern: {
    globalColor: "#fb7185",
    globalFont: "Poppins",
    sections: [
      { id: "mo1", type: "hero", settings: { layout: "center", bgColor: "#fff1f2" }, content: { title: "Bold & Vibrant", subtitle: "Express your brand with high contrast.", bgImage: "" } },
      { id: "mo2", type: "features", settings: { bgColor: "#ffffff" }, content: { title: "Innovative Features", items: [{ t: "Next-Gen", d: "Leading the market." }, { t: "Unmatched", d: "Quality first." }] } }
    ]
  },
};

export default function PreviewPage() {
  const [config, setConfig] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const search = useSearchParams();
  const params = useParams();
  const storeNameParam = Array.isArray(params?.storeName) ? params.storeName[0] : params?.storeName;
  const storeName = typeof storeNameParam === "string" ? storeNameParam : "";
  const { count } = useCart();

  useEffect(() => {
    // Load the latest customized data from storage
    const loadData = async () => {
      // 1. Try Cloud First
      try {
        const res = await fetch("/api/themes");
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          return;
        }
      } catch (e) { console.error("Cloud preview fetch failed", e); }

      // 2. Fallback to local
      const saved = localStorage.getItem("shoply_theme_preview");
      if (saved) {
        setConfig(JSON.parse(saved));
        return;
      }

      // 3. Fallback to theme preset (from query string)
      const themeId = search.get("id") || "minimal";
      const preset = PREVIEW_PRESETS[themeId];
      if (preset) {
        setConfig({
          globalColor: preset.globalColor,
          globalFont: preset.globalFont,
          sections: preset.sections,
          pageSections: { Home: preset.sections },
          activePage: "Home",
          themeId,
        });
        return;
      }

      // 4. Final fallback: basic demo
      const demoSections = [
        { id: "hero-1", type: "hero", settings: { layout: "spacious", bgColor: "#ffffff" }, content: { title: "Your Storefront", subtitle: "A clean demo layout.", bgImage: "" } },
        { id: "products-1", type: "products", settings: { bgColor: "#f8fafc" }, content: { title: "Featured Products", count: 3, source: "all", collection: "" } }
      ];
      setConfig({
        globalColor: "#6366f1",
        globalFont: "Inter",
        sections: demoSections,
        pageSections: { Home: demoSections },
        activePage: "Home",
        themeId: "default",
      });
    };

    loadData();

    // Listen for changes in other tabs (the editor)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "shoply_theme_preview") {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [search]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/dashboard/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        setProducts([]);
      } finally {
        setProductsLoaded(true);
      }
    };
    loadProducts();
  }, []);

  const normalizedProducts = useMemo<Product[]>(() => {
    return (products || []).map((p: any) => ({
      id: String(p.id ?? ""),
      name: p.name ?? "Untitled",
      price: p.price ?? "",
      imageUrl: p.imageUrl ?? p.image_url ?? null,
      category: p.category ?? "Uncategorized",
      status: p.status ?? null,
    }));
  }, [products]);

  const liveProducts = useMemo(() => {
    return normalizedProducts.filter((p) => !p.status || p.status === "Active");
  }, [normalizedProducts]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">
        Loading Site Preview...
      </div>
    );
  }

  const pageParam = search.get("page");
  const activePage =
    pageParam && config.pageSections?.[pageParam]
      ? pageParam
      : (config.activePage || "Home");
  const sections = config.pageSections?.[activePage] || config.sections || [];
  const hasNavbar = sections.some((section: any) => section.type === "navbar");
  const pageLinks = Object.keys(config.pageSections || { Home: [] });
  const basePath = storeName ? `/${storeName}` : "/dashboard/v1/theme/preview";
  const cartHref = storeName ? `/${storeName}/cart` : "/dashboard/v1/theme/preview";

  return (
    <main id="top" className="min-h-screen bg-slate-50 text-slate-900 scroll-smooth" style={{ fontFamily: config.globalFont }}>
      {!hasNavbar && (
        <div
          className="sticky top-0 z-30 border-b border-slate-200/60 backdrop-blur bg-white/80"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="font-black text-lg">
                {storeName ? storeName.replace(/-+/g, " ") : "Brand"}
              </div>
              <nav className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
                {pageLinks.map((name: string) => (
                  <Link
                    key={name}
                    href={`${basePath}?page=${encodeURIComponent(name)}`}
                    className={`hover:text-slate-900 transition ${activePage === name ? "text-slate-900" : "text-slate-500"}`}
                  >
                    {name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={basePath}
                className={buttonVariants({ size: "sm" })}
                style={{ backgroundColor: config.globalColor }}
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
      )}

      {sections.map((section: any) => (
        <section key={section.id} id={`section-${section.id}`} className="w-full">
          {/* NAVBAR SECTION */}
          {section.type === 'navbar' && (
            <div
              className="sticky top-0 z-30 border-b border-slate-200/60 backdrop-blur"
              style={{ backgroundColor: section.settings?.bgColor || "white" }}
            >
              <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="font-black text-lg" style={{ color: section.settings?.titleColor || undefined }}>
                    {section.content.brand || "Brand"}
                  </div>
                  <nav className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
                    {(section.content.links || []).map((link: any, i: number) => (
                      <a
                        key={i}
                        href={link.href || "#"}
                        className="hover:text-slate-900 transition"
                        style={{ color: section.settings?.subtitleColor || undefined }}
                      >
                        {link.label || "Link"}
                      </a>
                    ))}
                  </nav>
                </div>
                {section.content.ctaLabel && (
                  <a
                    href={section.content.ctaHref || "#"}
                    className="px-4 py-2 rounded-full text-xs font-black text-white shadow-sm hover:shadow-md transition"
                    style={{ backgroundColor: config.globalColor }}
                  >
                    {section.content.ctaLabel}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 1. HERO SECTION */}
          {section.type === 'hero' && (
            <div
              className={`py-24 px-6 md:px-10 relative overflow-hidden w-full flex flex-col justify-center ${section.settings?.textAlign === 'left' ? 'items-start text-left' :
                section.settings?.textAlign === 'right' ? 'items-end text-right' :
                  'items-center text-center'}`}
              style={{
                backgroundColor: section.settings?.bgColor || "transparent",
                backgroundImage: section.content.bgImage ? `linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url(${section.content.bgImage})` : 'none',
                backgroundSize: section.content.bgSize || 'cover',
                backgroundPosition: section.content.bgPos || 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="max-w-5xl mx-auto relative z-10">
                <Badge variant="secondary" className="mb-6">New season</Badge>
                <h1 className="text-5xl md:text-6xl leading-tight font-black" style={{
                  color: section.settings?.titleColor || config.globalColor,
                  fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                }}>{section.content.title}</h1>
                <p className="mt-6 text-xl md:text-2xl opacity-90 max-w-2xl mx-auto text-slate-600" style={{ color: section.settings?.subtitleColor || undefined }}>{section.content.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button style={{ backgroundColor: config.globalColor }}>Shop Now</Button>
                  <Button variant="outline">Explore</Button>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS SECTION (NEWLY ADDED) */}
          {section.type === 'products' && (
            <div className={`py-20 w-full ${section.settings?.textAlign === 'left' ? 'text-left' :
              section.settings?.textAlign === 'right' ? 'text-right' :
                'text-center'}`}
              style={{ backgroundColor: section.settings?.bgColor || 'transparent' }}>
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <Badge variant="secondary">Featured</Badge>
                    <h2 className="text-4xl mt-3" style={{
                      color: section.settings?.titleColor || undefined,
                      fontWeight: section.settings?.isBold ? '900' : 'bold',
                      fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                    }}>
                      {section.content.title || "Featured Products"}
                    </h2>
                  </div>
                  <Link
                    href={storeName ? `/${storeName}/products` : "#"}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    View all
                  </Link>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${section.settings?.textAlign === 'left' ? 'justify-items-start' :
                  section.settings?.textAlign === 'right' ? 'justify-items-end' :
                    'justify-items-center'}`}>
                  {(() => {
                    const source = section.content.source || "all";
                    const collection = section.content.collection || "";
                    const count = Number(section.content.count) || 3;
                    const baseList = source === "collection" && collection
                      ? liveProducts.filter((p) => p.category === collection)
                      : liveProducts;
                    const sectionProducts = baseList.slice(0, count);
                    if (sectionProducts.length === 0) {
                      return (
                        <div className="col-span-full text-slate-400 text-sm font-semibold">
                          {productsLoaded ? "No products found for this selection." : "Loading products..."}
                        </div>
                      );
                    }
                    return sectionProducts.map((p: any, i: number) => {
                      const customImage = section.content.customImages?.[i];
                      const imageUrl = customImage || p.imageUrl || "";
                      const productHref = storeName ? `/${storeName}/products/${encodeURIComponent(p.id)}` : "#";
                      return (
                        <Link key={p.id || i} href={productHref} className="w-full">
                          <Card className="overflow-hidden">
                            <div className="aspect-[4/5] bg-slate-100">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  className="w-full h-full object-cover"
                                  alt={p.name}
                                />
                              ) : (
                                <div className="h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                                  {p.price}
                                </div>
                              )}
                            </div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{p.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 flex items-center justify-between">
                              <span className="text-lg font-black" style={{ color: config.globalColor }}>{p.price}</span>
                              <span className={buttonVariants({ variant: "ghost", size: "sm" })}>View</span>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* 3. FEATURES SECTION */}
          {section.type === 'features' && (
            <div className={`py-24 px-6 w-full ${section.settings?.textAlign === 'left' ? 'text-left' :
              section.settings?.textAlign === 'right' ? 'text-right' :
                'text-center'}`}
              style={{ backgroundColor: section.settings?.bgColor || 'transparent' }}>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <Badge variant="secondary">Why Shoply</Badge>
                  <h2 className="text-4xl mt-4" style={{
                    color: section.settings?.titleColor || undefined,
                    fontWeight: section.settings?.isBold ? '900' : '900',
                    fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                  }}>{section.content.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.content.items.map((item: any, i: number) => (
                    <Card key={i}>
                      <CardHeader className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl border border-slate-200">✨</div>
                        <div>
                          <CardTitle className="text-2xl" style={{ color: section.settings?.titleColor || undefined }}>{item.t}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 text-slate-500 text-lg leading-relaxed" style={{ color: section.settings?.subtitleColor || undefined }}>
                        {item.d}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. FAQ SECTION */}
          {section.type === 'faq' && (
            <div className={`py-24 px-6 w-full ${section.settings?.textAlign === 'left' ? 'text-left' :
              section.settings?.textAlign === 'right' ? 'text-right' :
                'text-center'}`}
              style={{ backgroundColor: section.settings?.bgColor || 'transparent' }}>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <Badge variant="secondary">FAQ</Badge>
                  <h2 className="text-4xl mt-4" style={{
                    color: section.settings?.titleColor || undefined,
                    fontWeight: section.settings?.isBold ? '900' : '900',
                    fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                  }}>{section.content.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.content.items.map((item: any, i: number) => (
                    <Card key={i}>
                      <CardHeader>
                        <CardTitle className="text-xl" style={{ color: section.settings?.titleColor || undefined }}>{item.q}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-slate-500 text-lg leading-relaxed" style={{ color: section.settings?.subtitleColor || undefined }}>
                        {item.a}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. TESTIMONIALS SECTION */}
          {section.type === 'testimonials' && (
            <div className={`py-24 px-6 w-full ${section.settings?.textAlign === 'left' ? 'text-left' :
              section.settings?.textAlign === 'right' ? 'text-right' :
                'text-center'}`}
              style={{ backgroundColor: section.settings?.bgColor || 'transparent' }}>
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <Badge variant="secondary">Testimonials</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.content.items.map((item: any, i: number) => (
                    <Card key={i}>
                      <CardContent className="pt-6 space-y-6">
                        <p className="text-2xl text-slate-800 font-semibold italic" style={{ color: section.settings?.subtitleColor || undefined }}>
                          "{item.text}"
                        </p>
                        <Separator />
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-full border-2 border-white shadow-sm" />
                          <div>
                            <p className="font-black text-lg text-slate-900" style={{ color: section.settings?.titleColor || undefined }}>{item.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. CTA SECTION */}
          {section.type === 'cta' && (
            <div className={`py-20 px-6 w-full ${section.settings?.textAlign === 'left' ? 'items-start text-left' :
              section.settings?.textAlign === 'right' ? 'items-end text-right' :
                'items-center text-center'} flex flex-col`}
              style={{ backgroundColor: section.settings?.bgColor || "transparent" }}>
              <Card className="max-w-4xl mx-auto w-full">
                <CardContent className="py-10 text-center">
                  <h2 className="text-4xl md:text-5xl mb-6 leading-tight" style={{
                    color: section.settings?.titleColor || config.globalColor,
                    fontWeight: section.settings?.isBold ? '900' : '900',
                    fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                  }}>{section.content.title}</h2>
                  <Button style={{ backgroundColor: config.globalColor }}>
                    {section.content.button}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      ))}
      <Footer />
    </main>
  );
}
