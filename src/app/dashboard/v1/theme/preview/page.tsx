"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";

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
  classic: {
    globalColor: "#10b981",
    globalFont: "Georgia",
    sections: [
      { id: "cl1", type: "hero", settings: { layout: "boxed", bgColor: "#ffffff" }, content: { title: "The Standard of Excellence", subtitle: "Traditional values meets modern tech.", bgImage: "" } },
      { id: "cl2", type: "products", settings: { bgColor: "#ffffff" }, content: { title: "Our Best Sellers", count: 3, source: "all", collection: "" } }
    ]
  },
  bold: {
    globalColor: "#eab308",
    globalFont: "Inter",
    sections: [
      { id: "bd1", type: "hero", settings: { layout: "spacious", bgColor: "#121212", titleColor: "#ffffff" }, content: { title: "UNLEASH THE POWER", subtitle: "High energy design for high energy brands.", bgImage: "" } },
      { id: "bd2", type: "cta", settings: { bgColor: "#1a1a1a" }, content: { title: "Join the Dark Side", button: "Get Started Now" } }
    ]
  },
  elegant: {
    globalColor: "#c2410c",
    globalFont: "Georgia",
    sections: [
      { id: "el1", type: "hero", settings: { layout: "center", bgColor: "#fff7ed" }, content: { title: "Pure Sophistication", subtitle: "The finest selection for the finest taste.", bgImage: "" } },
      { id: "el2", type: "testimonials", settings: { bgColor: "#ffffff" }, content: { items: [{ name: "Sophia R.", text: "Absolutely stunning template.", role: "CEO" }] } }
    ]
  },
  tech: {
    globalColor: "#06b6d4",
    globalFont: "Inter",
    sections: [
      { id: "tk1", type: "hero", settings: { layout: "spacious", bgColor: "#0f172a", titleColor: "#22d3ee" }, content: { title: "Future Forward", subtitle: "Building the digital landscape of tomorrow.", bgImage: "" } },
      { id: "tk2", type: "faq", settings: { bgColor: "#1e293b", titleColor: "#ffffff" }, content: { title: "System Knowledge", items: [{ q: "Uptime?", a: "99.9% guaranteed." }] } }
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

  const sections = config.pageSections?.[config.activePage] || config.sections || [];
  const hasNavbar = sections.some((section: any) => section.type === "navbar");

  return (
    <main id="top" className="min-h-screen bg-white text-slate-900 scroll-smooth" style={{ fontFamily: config.globalFont }}>
      {!hasNavbar && <Navbar />}

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
              className={`py-32 px-10 text-white relative overflow-hidden w-full flex flex-col justify-center ${section.settings?.textAlign === 'left' ? 'items-start text-left' :
                section.settings?.textAlign === 'right' ? 'items-end text-right' :
                  'items-center text-center'}`}
              style={{
                backgroundColor: section.settings?.bgColor || config.globalColor,
                backgroundImage: section.content.bgImage ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.bgImage})` : 'none',
                backgroundSize: section.content.bgSize || 'cover',
                backgroundPosition: section.content.bgPos || 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="max-w-6xl mx-auto relative z-10">
                <h1 className="text-6xl leading-tight" style={{
                  color: section.settings?.titleColor || undefined,
                  fontWeight: section.settings?.isBold ? '900' : '900',
                  fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                }}>{section.content.title}</h1>
                <p className="mt-6 text-2xl opacity-90 max-w-2xl mx-auto" style={{ color: section.settings?.subtitleColor || undefined }}>{section.content.subtitle}</p>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS SECTION (NEWLY ADDED) */}
          {section.type === 'products' && (
            <div className={`py-20 w-full ${section.settings?.textAlign === 'left' ? 'text-left' :
              section.settings?.textAlign === 'right' ? 'text-right' :
                'text-center'}`}
              style={{ backgroundColor: section.settings?.bgColor || 'white' }}>
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl mb-12" style={{
                  color: section.settings?.titleColor || undefined,
                  fontWeight: section.settings?.isBold ? '900' : 'bold',
                  fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                }}>
                  {section.content.title || "Featured Products"}
                </h2>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 ${section.settings?.textAlign === 'left' ? 'justify-items-start' :
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
                        <Link key={p.id || i} href={productHref} className="group cursor-pointer">
                          <div className="aspect-[4/5] bg-slate-100 rounded-3xl mb-6 overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt={p.name}
                              />
                            ) : (
                              <div className="h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xl">
                                {p.price}
                              </div>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                          <p
                            className="text-lg font-bold mt-1"
                            style={{ color: config.globalColor }}
                          >
                            {p.price}
                          </p>
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
              style={{ backgroundColor: section.settings?.bgColor || 'white' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl mb-16" style={{
                  color: section.settings?.titleColor || undefined,
                  fontWeight: section.settings?.isBold ? '900' : '900',
                  fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                }}>{section.content.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {section.content.items.map((item: any, i: number) => (
                    <div key={i} className={`flex gap-6 items-start p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-2xl hover:bg-white transition-all duration-500 ${section.settings?.textAlign === 'right' ? 'flex-row-reverse text-right' : 'flex-row'}`}>
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 shrink-0">✨</div>
                      <div>
                        <h4 className="font-black text-2xl mb-3 text-slate-900" style={{ color: section.settings?.titleColor || undefined }}>{item.t}</h4>
                        <p className="text-slate-500 text-lg leading-relaxed" style={{ color: section.settings?.subtitleColor || undefined }}>{item.d}</p>
                      </div>
                    </div>
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
              style={{ backgroundColor: section.settings?.bgColor || 'rgba(248, 250, 252, 0.5)' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl mb-16" style={{
                  color: section.settings?.titleColor || undefined,
                  fontWeight: section.settings?.isBold ? '900' : '900',
                  fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                }}>{section.content.title}</h2>
                <div className="space-y-4">
                  {section.content.items.map((item: any, i: number) => (
                    <div key={i} className={`bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm ${section.settings?.textAlign === 'right' ? 'text-right' : 'text-left'}`}>
                      <h3 className="font-extrabold text-xl text-slate-900 mb-4" style={{ color: section.settings?.titleColor || undefined }}>{item.q}</h3>
                      <p className="text-slate-500 text-lg leading-relaxed border-t pt-6 border-slate-50" style={{ color: section.settings?.subtitleColor || undefined }}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. TESTIMONIALS SECTION */}
          {section.type === 'testimonials' && (
            <div className={`py-32 px-6 w-full flex flex-col ${section.settings?.textAlign === 'left' ? 'items-start text-left' :
              section.settings?.textAlign === 'right' ? 'items-end text-right' :
                'items-center text-center'}`}
              style={{ backgroundColor: section.settings?.bgColor || 'white' }}>
              <div className={`max-w-5xl mx-auto flex flex-col ${section.settings?.textAlign === 'left' ? 'items-start' :
                section.settings?.textAlign === 'right' ? 'items-end' :
                  'items-center'}`}>
                {section.content.items.map((item: any, i: number) => (
                  <div key={i} className={`flex flex-col ${section.settings?.textAlign === 'left' ? 'items-start' :
                    section.settings?.textAlign === 'right' ? 'items-end' :
                      'items-center'}`}>
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full mb-12" />
                    <p className="text-3xl md:text-5xl text-slate-800 font-bold leading-tight italic" style={{ color: section.settings?.subtitleColor || undefined }}>
                      "{item.text}"
                    </p>
                    <div className={`mt-12 flex items-center gap-5 ${section.settings?.textAlign === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-16 h-16 bg-slate-100 rounded-full border-4 border-white shadow-md" />
                      <div className={section.settings?.textAlign === 'right' ? 'text-right' : 'text-left'}>
                        <p className="font-black text-xl text-slate-900" style={{ color: section.settings?.titleColor || undefined }}>{item.name}</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. CTA SECTION */}
          {section.type === 'cta' && (
            <div className={`py-32 px-6 text-white w-full flex flex-col ${section.settings?.textAlign === 'left' ? 'items-start text-left' :
              section.settings?.textAlign === 'right' ? 'items-end text-right' :
                'items-center text-center'}`}
              style={{ backgroundColor: section.settings?.bgColor || config.globalColor }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-6xl mb-12 leading-tight" style={{
                  color: section.settings?.titleColor || undefined,
                  fontWeight: section.settings?.isBold ? '900' : '900',
                  fontStyle: section.settings?.isItalic ? 'italic' : 'normal'
                }}>{section.content.title}</h2>
                <button
                  className="px-12 py-5 bg-white rounded-full text-slate-900 font-black text-xl shadow-2xl hover:scale-110 active:scale-95 transition-all"
                  style={{ color: config.globalColor }}
                >
                  {section.content.button}
                </button>
              </div>
            </div>
          )}
        </section>
      ))}
      <Footer />
    </main>
  );
}
