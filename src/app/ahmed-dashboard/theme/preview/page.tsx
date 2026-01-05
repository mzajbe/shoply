"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import allProducts from "../../products/product";

export default function PreviewPage() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Load the latest customized data from storage
    const saved = localStorage.getItem("shoply_theme_preview");
    if (saved) {
      setConfig(JSON.parse(saved));
    }
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
      
      {config.sections?.map((section: any) => (
  <section key={section.id} className="w-full">
    {/* 1. HERO SECTION */}
    {section.type === 'hero' && (
      <div 
        className="py-32 px-10 text-white text-center relative overflow-hidden w-full" 
        style={{ 
          background: section.content.bgImage ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.bgImage})` : config.globalColor,
          backgroundSize: section.content.bgSize || 'cover',
          backgroundPosition: section.content.bgPos || 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-6xl font-black leading-tight">{section.content.title}</h1>
          <p className="mt-6 text-2xl opacity-90 max-w-2xl mx-auto">{section.content.subtitle}</p>
        </div>
      </div>
    )}

    {/* 2. PRODUCTS SECTION (NEWLY ADDED) */}
    {section.type === 'products' && (
      <div className="py-20 w-full bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">
            {section.content.title || "Featured Products"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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

    {/* 3. CTA SECTION */}
    {section.type === 'cta' && (
      <div className="py-20 text-center border-t border-slate-100 bg-white w-full">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-8">{section.content.title}</h2>
          <button 
            className="px-10 py-4 rounded-full text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform" 
            style={{ background: config.globalColor }}
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