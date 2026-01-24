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
    themeMood: "bold",
    sections: [
      {
        id: "mv1",
        type: "heroVideo",
        settings: { layout: "center", bgColor: "#0f172a", titleColor: "#ffffff", subtitleColor: "#e2e8f0" },
        content: {
          title: "Modern. Premium. Magnetic.",
          subtitle: "Bold visual language with cinematic motion and premium polish.",
          videoUrl: "",
          marqueeText: "Premium look   |   Modern theme   |   High conversion   |   Built for growth"
        }
      },
      {
        id: "mv2",
        type: "split",
        settings: { layout: "spacious", bgColor: "#0f172a" },
        content: {
          title: "Split layouts with glassmorphism.",
          subtitle: "Layered gradients, depth, and bold typography to spotlight your hero products.",
          imageUrl: "/themes/modern.png",
          bullets: ["Glass cards", "Layered gradients", "Responsive layout"]
        }
      },
      {
        id: "mv3",
        type: "stats",
        settings: { bgColor: "#111827" },
        content: {
          title: "Numbers that move",
          items: [{ label: "Conversion", value: "32%" }, { label: "AOV", value: "1990" }, { label: "Repeat", value: "41%" }]
        }
      },
      {
        id: "mv4",
        type: "products",
        settings: { bgColor: "#0b1220" },
        content: { title: "Featured drops", count: 4, source: "all", collection: "", quickView: true, featuredCount: 2 }
      },
      {
        id: "mv5",
        type: "testimonialsSlider",
        settings: { bgColor: "#0b1220" },
        content: {
          items: [
            { name: "Ava Chen", role: "Founder", text: "The Modern theme feels like a luxury brand site." },
            { name: "Leo Park", role: "Marketing Lead", text: "We saw higher engagement after switching." },
            { name: "Mira Khan", role: "Owner", text: "Fast, beautiful, and easy to customize." }
          ]
        }
      },
      {
        id: "mv6",
        type: "beforeAfter",
        settings: { bgColor: "#0f172a" },
        content: {
          title: "Before vs After",
          beforeUrl: "/themes/minimal.png",
          afterUrl: "/themes/modern.png",
          labelBefore: "Before",
          labelAfter: "After"
        }
      },
      {
        id: "mv7",
        type: "trust",
        settings: { bgColor: "#0b1220" },
        content: { title: "Trusted by founders", items: ["Secure checkout", "Fast delivery", "Premium support", "30-day returns"] }
      },
      {
        id: "mv8",
        type: "cta",
        settings: { bgColor: "#111827" },
        content: { title: "Ready to launch a premium storefront?", button: "Get Started" }
      }
    ]
  },
};

export default function PreviewPage() {
  const [config, setConfig] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
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
          themeMood: preset.themeMood || "bold",
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
        themeMood: "bold",
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

  useEffect(() => {
    const handleScroll = () => {
      const offset = Math.min(window.scrollY * 0.15, 120);
      setParallaxOffset(offset);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
  const themeMood = config.themeMood || "bold";
  const isModern = config.themeId === "modern";
  const basePath = storeName ? `/${storeName}` : "/dashboard/v1/theme/preview";
  const cartHref = storeName ? `/${storeName}/cart` : "/dashboard/v1/theme/preview";

  const baseThemeClass = isModern
    ? themeMood === "soft"
      ? "bg-slate-50 text-slate-900"
      : "bg-slate-950 text-white"
    : "bg-slate-50 text-slate-900";

  return (
    <main id="top" className={`min-h-screen scroll-smooth ${baseThemeClass}`} style={{ fontFamily: config.globalFont }}>
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

          {section.type === 'heroVideo' && (
            <div
              className={`py-24 px-6 md:px-10 relative overflow-hidden w-full flex flex-col justify-center ${section.settings?.textAlign === 'left' ? 'items-start text-left' :
                section.settings?.textAlign === 'right' ? 'items-end text-right' :
                  'items-center text-center'}`}
              style={{
                backgroundColor: section.settings?.bgColor || "#0f172a"
              }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-pink-500/40 blur-3xl rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-400/40 blur-3xl rounded-full" />
                <svg className="absolute inset-0 opacity-20" viewBox="0 0 600 600">
                  <circle cx="120" cy="140" r="90" stroke="white" strokeWidth="1" fill="none" className="animate-pulse" />
                  <circle cx="480" cy="420" r="110" stroke="white" strokeWidth="1" fill="none" className="animate-pulse" />
                </svg>
              </div>
              <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-300 mb-6">Premium Hero</div>
                <h1 className="text-5xl md:text-6xl leading-tight font-black" style={{
                  color: section.settings?.titleColor || "#ffffff",
                  transform: `translateY(${parallaxOffset * -0.2}px)`
                }}>{section.content.title}</h1>
                <p className="mt-6 text-xl md:text-2xl opacity-90 max-w-2xl mx-auto" style={{
                  color: section.settings?.subtitleColor || "#e2e8f0",
                  transform: `translateY(${parallaxOffset * -0.1}px)`
                }}>{section.content.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button style={{ backgroundColor: config.globalColor, color: "#0f172a" }}>Shop Now</Button>
                  <Button variant="outline" className="border-white/40 text-white">Watch Preview</Button>
                </div>
              </div>
              <div className="mt-12 border-t border-white/10 overflow-hidden">
                <div className="py-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">
                  {section.content.marqueeText || "Premium look   |   Modern theme   |   Built to convert"}
                </div>
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

          {section.type === 'split' && (
            <div className="py-20 px-6 md:px-10" style={{ backgroundColor: section.settings?.bgColor || "#0f172a" }}>
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-white">{section.content.title}</h2>
                  <p className="text-slate-200 text-lg">{section.content.subtitle}</p>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {(section.content.bullets || []).map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.globalColor }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 blur-2xl rounded-[32px]" />
                  <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-white/10 backdrop-blur">
                    {section.content.imageUrl ? (
                      <img src={section.content.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="aspect-[4/3] bg-white/10" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {section.type === 'stats' && (
            <div className="py-16 px-6 md:px-10" style={{ backgroundColor: section.settings?.bgColor || "#0f172a" }}>
              <div className="max-w-5xl mx-auto">
                <h3 className="text-3xl font-black text-center text-white">{section.content.title}</h3>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {(section.content.items || []).map((item: any, i: number) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-6 text-center">
                      <AnimatedStat value={String(item.value)} />
                      <div className="text-xs uppercase tracking-widest text-slate-200 mt-2">{item.label}</div>
                    </div>
                  ))}
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
                    const featuredCount = Number(section.content.featuredCount) || 0;
                    return sectionProducts.map((p: any, i: number) => {
                      const customImage = section.content.customImages?.[i];
                      const imageUrl = customImage || p.imageUrl || "";
                      const productHref = storeName ? `/${storeName}/products/${encodeURIComponent(p.id)}` : "#";
                      const isFeatured = i < featuredCount;
                      return (
                        <Link key={p.id || i} href={productHref} className="w-full">
                          <Card className={`overflow-hidden ${isModern ? "bg-white/5 border-white/10" : ""}`}>
                            <div className="aspect-[4/5] bg-slate-100 relative">
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
                              {isFeatured && (
                                <div className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                                  Featured
                                </div>
                              )}
                              {section.content.quickView && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setQuickViewProduct(p);
                                  }}
                                  className="absolute bottom-3 right-3 text-[10px] font-black uppercase tracking-widest bg-white/90 text-slate-900 px-3 py-1 rounded-full"
                                >
                                  Quick view
                                </button>
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

          {section.type === 'testimonialsSlider' && (
            <div className="py-20 px-6 md:px-10" style={{ backgroundColor: section.settings?.bgColor || "#0b1220" }}>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Testimonials</div>
                  <h3 className="mt-4 text-3xl font-black text-white">What founders say</h3>
                </div>
                <TestimonialSlider items={section.content.items || []} />
              </div>
            </div>
          )}

          {section.type === 'beforeAfter' && (
            <div className="py-20 px-6 md:px-10" style={{ backgroundColor: section.settings?.bgColor || "#0f172a" }}>
              <div className="max-w-5xl mx-auto text-center">
                <h3 className="text-3xl md:text-4xl font-black text-white">{section.content.title}</h3>
                <div className="mt-10">
                  <BeforeAfterSlider
                    beforeUrl={section.content.beforeUrl}
                    afterUrl={section.content.afterUrl}
                    labelBefore={section.content.labelBefore}
                    labelAfter={section.content.labelAfter}
                  />
                </div>
              </div>
            </div>
          )}

          {section.type === 'trust' && (
            <div className="py-14 px-6 md:px-10" style={{ backgroundColor: section.settings?.bgColor || "#0b1220" }}>
              <div className="max-w-5xl mx-auto">
                <div className="text-center text-white text-sm font-black uppercase tracking-widest mb-8">
                  {section.content.title}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(section.content.items || []).map((item: string, i: number) => (
                    <div key={i} className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-4 py-3 text-xs font-bold text-white text-center">
                      {item}
                    </div>
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

      {isModern && (
        <Link
          href={cartHref}
          className="fixed bottom-6 right-6 z-40 rounded-full px-5 py-3 text-xs font-black uppercase tracking-widest shadow-xl"
          style={{ backgroundColor: config.globalColor, color: "#0f172a" }}
        >
          Cart {count > 0 ? `(${count})` : ""}
        </Link>
      )}

      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[28px] max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-slate-100">
                {quickViewProduct.imageUrl ? (
                  <img src={quickViewProduct.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="aspect-[4/5] bg-slate-200" />
                )}
              </div>
              <div className="p-8">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Quick View</div>
                <h3 className="mt-3 text-2xl font-black text-slate-900">{quickViewProduct.name}</h3>
                <div className="mt-2 text-lg font-black" style={{ color: config.globalColor }}>
                  {quickViewProduct.price}
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Premium materials, curated details, and a modern finish designed for your best customers.
                </p>
                <div className="mt-6 flex gap-3">
                  <button className="px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white" style={{ backgroundColor: config.globalColor }}>
                    Add to cart
                  </button>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-slate-200 text-slate-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}

function AnimatedStat({ value }: { value: string }) {
  const [display, setDisplay] = useState(0);
  const raw = String(value || "");
  const target = Number(raw.replace(/[^0-9.]/g, "")) || 0;
  const suffix = raw.replace(/[0-9.]/g, "");

  useEffect(() => {
    let frame = 0;
    const total = 30;
    const timer = setInterval(() => {
      frame += 1;
      const next = Math.round((target * frame) / total);
      setDisplay(next);
      if (frame >= total) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-3xl font-black text-white">
      {display}{suffix}
    </div>
  );
}

function TestimonialSlider({ items }: { items: Array<{ name: string; role: string; text: string }> }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;
  const active = items[index];
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 backdrop-blur p-8 text-white">
      <p className="text-lg md:text-2xl font-semibold leading-relaxed">"{active.text}"</p>
      <div className="mt-6 text-xs uppercase tracking-widest text-slate-200">
        {active.name} - {active.role}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <span key={i} className={`h-1.5 w-6 rounded-full ${i === index ? "bg-white" : "bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  labelBefore,
  labelAfter
}: {
  beforeUrl: string;
  afterUrl: string;
  labelBefore: string;
  labelAfter: string;
}) {
  const [value, setValue] = useState(50);
  return (
    <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/5">
      <div className="aspect-[16/9] relative">
        {beforeUrl && (
          <img src={beforeUrl} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${value}%` }}>
          {afterUrl && (
            <img src={afterUrl} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full px-6">
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-white bg-black/40 px-3 py-1 rounded-full">
          {labelBefore || "Before"}
        </div>
        <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-white bg-black/40 px-3 py-1 rounded-full">
          {labelAfter || "After"}
        </div>
      </div>
    </div>
  );
}
