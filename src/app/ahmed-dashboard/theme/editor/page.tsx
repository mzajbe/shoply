"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import allProducts from "../../products/product"; // Importing real product data

// Define the types of blocks available in the builder
type SectionType = "hero" | "features" | "products" | "faq" | "testimonials" | "cta";

interface Section {
  id: string;
  type: SectionType;
  settings: {
    layout?: "spacious" | "center" | "boxed";
  };
  content: any;
}

export default function LiveEditor() {
  const search = useSearchParams();
  
  // --- STATE MANAGEMENT ---
  const [globalColor, setGlobalColor] = useState("#6366f1");
  const [globalFont, setGlobalFont] = useState("Inter");
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [showExport, setShowExport] = useState(false);

  // --- PERSISTENCE LOGIC (SAVE/LOAD) ---
  // Load saved draft on initial mount
  useEffect(() => {
    const savedData = localStorage.getItem("shoply_project_draft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setGlobalColor(parsed.globalColor || "#6366f1");
        setGlobalFont(parsed.globalFont || "Inter");
        setSections(parsed.sections || []);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    } else {
      // Default initial layout if no save exists
      setSections([
        { 
          id: "hero-1", 
          type: "hero", 
          settings: { layout: "spacious" }, 
          content: { title: "Your Brand, Your Way", subtitle: "Build your dream store without writing a single line of code." } 
        }
      ]);
    }
  }, []);

  // Save project to local storage
  const saveToLocalStorage = () => {
    const projectData = { globalColor, globalFont, sections };
    localStorage.setItem("shoply_project_draft", JSON.stringify(projectData));
    setSaveStatus("Saved!");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  // --- BLOCK MANAGEMENT ---
  const addSection = (type: SectionType) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newSection: Section = {
      id: newId,
      type,
      settings: { layout: "center" },
      content: getDefaultContent(type)
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newId);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    if (activeSectionId === id) setActiveSectionId(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    [newSections[index], newSections[target]] = [newSections[target], newSections[index]];
    setSections(newSections);
  };

  // --- CONTENT UPDATERS (INLINE EDITING) ---
  const updateContent = (id: string, updates: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: { ...s.content, ...updates } } : s));
  };

  const updateItemInList = (sectionId: string, listKey: string, index: number, field: string, value: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newList = [...s.content[listKey]];
      newList[index] = { ...newList[index], [field]: value };
      return { ...s, content: { ...s.content, [listKey]: newList } };
    }));
  };

  function getDefaultContent(type: SectionType) {
    switch(type) {
      case 'hero': return { title: "New Hero Section", subtitle: "Click here to edit this text directly." };
      case 'products': return { title: "Featured Products", count: 3 };
      case 'features': return { title: "Why Us", items: [{ t: "Fast Shipping", d: "Delivery in 2 days" }, { t: "24/7 Support", d: "Always here" }] };
      case 'faq': return { title: "FAQ", items: [{ q: "Shipping?", a: "Worldwide!" }] };
      case 'testimonials': return { items: [{ name: "Alex S.", text: "Best store ever!", role: "Buyer" }] };
      case 'cta': return { title: "Ready to start?", button: "Get Started" };
      default: return { title: "New Section" };
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-900 overflow-hidden">
      {/* HEADER TOOLBAR */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl text-orange-600">Shoply Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={saveToLocalStorage}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2"
          >
            {saveStatus === "Saved!" ? "✓ Saved" : "💾 Save Draft"}
          </button>
          <button 
            onClick={() => setShowExport(true)}
            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
          >
            Publish
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Controls */}
        <aside className="w-80 bg-white border-r overflow-y-auto p-6 space-y-8 shrink-0">
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Add Block</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['hero', 'products', 'features', 'faq', 'testimonials', 'cta'] as SectionType[]).map(type => (
                <button key={type} onClick={() => addSection(type)} className="p-3 border rounded-xl text-xs font-semibold hover:border-orange-500 hover:bg-orange-50 transition-all capitalize">
                  + {type}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Styles</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-2">Accent Color</label>
                <input type="color" value={globalColor} onChange={(e) => setGlobalColor(e.target.value)} className="w-full h-10 cursor-pointer rounded-lg border p-1" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-2">Typography</label>
                <select value={globalFont} onChange={(e) => setGlobalFont(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
                  <option>Inter</option><option>Poppins</option><option>Georgia</option>
                </select>
              </div>
            </div>
          </section>

          {activeSectionId && (
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 animate-in slide-in-from-bottom-2 duration-300">
                <p className="text-[10px] font-bold text-orange-600 uppercase mb-2">Active Block</p>
                <button onClick={() => setActiveSectionId(null)} className="text-xs font-medium text-slate-600 hover:text-orange-600">Done Editing</button>
            </div>
          )}
        </aside>

        {/* MAIN PREVIEW CANVAS */}
        <main className="flex-1 overflow-y-auto p-12 bg-slate-100 scroll-smooth">
          <div className="max-w-4xl mx-auto shadow-2xl bg-white min-h-screen transition-all duration-500" style={{ fontFamily: globalFont }}>
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                onClick={() => setActiveSectionId(section.id)}
                className={`group relative transition-all border-2 ${activeSectionId === section.id ? 'border-orange-500 ring-4 ring-orange-50' : 'border-transparent hover:border-slate-200'}`}
              >
                {/* TOOLBAR */}
                <div className="absolute -left-14 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                   <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} className="p-2 bg-white shadow-sm rounded-lg hover:text-orange-600">↑</button>
                   <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} className="p-2 bg-white shadow-sm rounded-lg hover:text-orange-600">↓</button>
                   <button onClick={(e) => { e.stopPropagation(); removeSection(section.id); }} className="p-2 bg-white shadow-sm rounded-lg hover:text-red-600">✕</button>
                </div>

                <div className="p-2">
                  {/* HERO BLOCK */}
                  {section.type === 'hero' && (
                    <div className="py-20 px-10 text-white rounded-lg text-center" style={{ background: globalColor }}>
                      <h2 className="text-5xl font-black outline-none leading-tight" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}>{section.content.title}</h2>
                      <p className="mt-6 text-xl opacity-90 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { subtitle: e.currentTarget.innerText })}>{section.content.subtitle}</p>
                    </div>
                  )}

                  {/* PRODUCTS BLOCK */}
                  {section.type === 'products' && (
                    <div className="py-16 px-10">
                      <h3 className="text-3xl font-bold mb-10 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}>{section.content.title}</h3>
                      <div className="grid grid-cols-3 gap-8">
                        {allProducts.slice(0, section.content.count).map(p => (
                          <div key={p.id}>
                            <div className="aspect-[4/5] bg-slate-100 rounded-2xl mb-4" />
                            <div className="font-bold text-sm">{p.name}</div>
                            <div className="text-orange-600 font-bold text-sm">{p.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQ BLOCK */}
                  {section.type === 'faq' && (
                    <div className="py-16 px-10 bg-slate-50">
                       <h3 className="text-center font-black text-2xl mb-10 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}>{section.content.title}</h3>
                       {section.content.items.map((item: any, i: number) => (
                         <div key={i} className="max-w-2xl mx-auto mb-4 bg-white p-6 rounded-2xl border shadow-sm">
                           <div className="font-bold text-lg outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'q', e.currentTarget.innerText)}>{item.q}</div>
                           <div className="text-slate-600 mt-2 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'a', e.currentTarget.innerText)}>{item.a}</div>
                         </div>
                       ))}
                    </div>
                  )}

                  {/* CTA BLOCK */}
                  {section.type === 'cta' && (
                    <div className="py-20 text-center">
                      <h2 className="text-4xl font-black mb-8 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}>{section.content.title}</h2>
                      <button className="px-10 py-4 rounded-full text-white font-bold text-lg shadow-lg" style={{ background: globalColor }}>
                        <span className="outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { button: e.currentTarget.innerText })}>{section.content.button}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* PUBLISH SUCCESS MODAL */}
      {showExport && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
            <h2 className="text-2xl font-bold">Store Published!</h2>
            <p className="text-slate-500 mt-2">All changes have been successfully saved to your live storefront profile.</p>
            <button onClick={() => setShowExport(false)} className="mt-8 w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition">Return to Editor</button>
          </div>
        </div>
      )}
    </div>
  );
}