"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import allProducts from "../../products/product";

export default function PreviewPage() {
  const [config, setConfig] = useState<any>(null);

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
      }
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
  }, []);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">
        Loading Site Preview...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900" style={{ fontFamily: config.globalFont }}>
      <Navbar />

      {(config.pageSections?.[config.activePage] || config.sections || []).map((section: any) => (
        <section key={section.id} className="w-full">
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
                  {allProducts.slice(0, 3).map((p: any, i: number) => (
                    <div key={p.id} className="group cursor-pointer">
                      <div className="aspect-[4/5] bg-slate-100 rounded-3xl mb-6 overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                        {/* Logic: Show custom image if picked in Editor, otherwise show price */}
                        {section.content.customImages?.[i] ? (
                          <img
                            src={section.content.customImages[i]}
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
                    </div>
                  ))}
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