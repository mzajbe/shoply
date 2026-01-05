"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import allProducts from "../../products/product";

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

  // --- MEDIA MODAL STATE ---
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [selectingFor, setSelectingFor] = useState<{ id: string, field: string, index?: number } | null>(null);

  // --- PERSISTENCE LOGIC (SAVE/LOAD) ---
  useEffect(() => {
    const savedData = localStorage.getItem("shoply_project_draft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setGlobalColor(parsed.globalColor || "#6366f1");
        setGlobalFont(parsed.globalFont || "Inter");
        setSections(parsed.sections || []);
      } catch (e) { console.error("Failed to load draft", e); }
    } else {
      setSections([
        { 
          id: "hero-1", 
          type: "hero", 
          settings: { layout: "spacious" }, 
          content: { title: "Your Brand, Your Way", subtitle: "Build your dream store.", bgImage: "", bgSize: "cover", bgPos: "center" } 
        }
      ]);
    }

    const savedMedia = localStorage.getItem("shoply_media_library");
    if (savedMedia) {
      setMediaItems(JSON.parse(savedMedia));
    }
  }, []);

  const saveToLocalStorage = () => {
    const projectData = { globalColor, globalFont, sections };
    localStorage.setItem("shoply_project_draft", JSON.stringify(projectData));
    setSaveStatus("Saved!");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  // NEW: Handle Preview
 const handlePreview = () => {
  const previewData = { globalColor, globalFont, sections };
  // Save the current state so the preview page can read it
  localStorage.setItem("shoply_theme_preview", JSON.stringify(previewData));
  
  // FIXED: Point to the new absolute path to avoid 404
  window.open("/ahmed-dashboard/theme/preview", "_blank");
};

  // --- MEDIA PICKER LOGIC ---
  const openMediaPicker = (sectionId: string, field: string, index?: number) => {
    setSelectingFor({ id: sectionId, field, index });
    setShowMediaModal(true);
  };

  const selectImage = (url: string) => {
    if (selectingFor) {
      const { id, field, index } = selectingFor;
      if (field === "productImage" && typeof index === "number") {
        const section = sections.find(s => s.id === id);
        const newCustomImages = [...(section?.content.customImages || [])];
        newCustomImages[index] = url;
        updateContent(id, { customImages: newCustomImages });
      } else {
        updateContent(id, { [field]: url });
      }
      setShowMediaModal(false);
      setSelectingFor(null);
    }
  };

  // --- BLOCK MANAGEMENT ---
  const addSection = (type: SectionType) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setSections([...sections, { id: newId, type, settings: { layout: "center" }, content: getDefaultContent(type) }]);
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
      case 'hero': return { title: "New Hero Section", subtitle: "Edit text directly.", bgImage: "", bgSize: "cover", bgPos: "center" };
      case 'products': return { title: "Featured Products", count: 3, customImages: [] };
      case 'features': return { title: "Why Us", items: [{ t: "Fast Shipping", d: "Delivery in 2 days" }, { t: "24/7 Support", d: "Always here" }] };
      case 'faq': return { title: "FAQ", items: [{ q: "Shipping?", a: "Worldwide!" }] };
      case 'testimonials': return { items: [{ name: "Alex S.", text: "Best store ever!", role: "Buyer" }] };
      case 'cta': return { title: "Ready to start?", button: "Get Started" };
      default: return { title: "New Section" };
    }
  }

  const activeSection = sections.find(s => s.id === activeSectionId);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-900 overflow-hidden">
      {/* HEADER TOOLBAR */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/ahmed-dashboard/theme" className="text-slate-400 hover:text-slate-600 transition">←</Link>
          <span className="font-bold text-xl text-orange-600">Shoply Builder</span>
        </div>
        <div className="flex items-center gap-3">
          {/* NEW PREVIEW BUTTON */}
          <button 
            onClick={handlePreview} 
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
          >
            Preview Site
          </button>
          <button onClick={saveToLocalStorage} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
            {saveStatus === "Saved!" ? "✓ Saved" : "💾 Save Draft"}
          </button>
          <button onClick={() => setShowExport(true)} className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold">Publish</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Controls */}
        <aside className="w-80 bg-white border-r overflow-y-auto p-6 space-y-8 shrink-0">
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Add Block</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['hero', 'products', 'features', 'faq', 'testimonials', 'cta'] as SectionType[]).map(type => (
                <button key={type} onClick={() => addSection(type)} className="p-3 border rounded-xl text-xs font-semibold hover:border-orange-500 hover:bg-orange-50 transition-all capitalize">+ {type}</button>
              ))}
            </div>
          </section>

          {activeSection?.type === 'hero' && (
            <section className="p-4 bg-slate-50 rounded-2xl border space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-tighter">Background Image</h4>
              <button onClick={() => openMediaPicker(activeSection.id, 'bgImage')} className="w-full py-2 bg-white border-2 border-dashed border-slate-200 rounded-lg text-xs font-medium hover:border-orange-400 transition">
                {activeSection.content.bgImage ? "Replace Image" : "Pick Background"}
              </button>
              {activeSection.content.bgImage && (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase block mb-1">Image Size</label>
                    <select value={activeSection.content.bgSize || "cover"} onChange={(e) => updateContent(activeSection.id, { bgSize: e.target.value })} className="w-full p-2 border rounded text-xs">
                      <option value="cover">Fill (Cover)</option>
                      <option value="contain">Fit (Contain)</option>
                    </select>
                  </div>
                  <button onClick={() => updateContent(activeSection.id, { bgImage: "" })} className="w-full text-[10px] text-red-500 font-bold uppercase">Remove Image</button>
                </>
              )}
            </section>
          )}

          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Global Styles</h3>
            <div className="space-y-4">
              <label className="text-xs font-semibold block mb-2">Accent Color</label>
              <input type="color" value={globalColor} onChange={(e) => setGlobalColor(e.target.value)} className="w-full h-10 cursor-pointer rounded-lg border p-1" />
            </div>
          </section>
        </aside>

        {/* MAIN PREVIEW CANVAS */}
        <main className="flex-1 overflow-y-auto p-12 bg-slate-100 scroll-smooth">
          <div className="max-w-4xl mx-auto shadow-2xl bg-white min-h-screen" style={{ fontFamily: globalFont }}>
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                onClick={() => setActiveSectionId(section.id)}
                className={`group relative transition-all border-2 ${activeSectionId === section.id ? 'border-orange-500 ring-4 ring-orange-50' : 'border-transparent hover:border-slate-200'}`}
              >
                <div className="absolute -left-14 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                   <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} className="p-2 bg-white shadow-sm rounded-lg hover:text-orange-600">↑</button>
                   <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} className="p-2 bg-white shadow-sm rounded-lg hover:text-orange-600">↓</button>
                   <button onClick={(e) => { e.stopPropagation(); removeSection(section.id); }} className="p-2 bg-white shadow-sm rounded-lg hover:text-red-600">✕</button>
                </div>

                <div className="p-2">
                  {section.type === 'hero' && (
                    <div className="py-32 px-10 text-white rounded-lg text-center relative overflow-hidden transition-all" 
                      style={{ 
                        background: section.content.bgImage ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.bgImage})` : globalColor,
                        backgroundSize: section.content.bgSize || 'cover',
                        backgroundPosition: section.content.bgPos || 'center'
                      }}>
                      <h2 className="text-5xl font-black outline-none leading-tight" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}>{section.content.title}</h2>
                      <p className="mt-6 text-xl opacity-90 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { subtitle: e.currentTarget.innerText })}>{section.content.subtitle}</p>
                    </div>
                  )}

                  {section.type === 'products' && (
                    <div className="py-16 px-10">
                      <h3 className="text-3xl font-bold mb-10 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}>{section.content.title}</h3>
                      <div className="grid grid-cols-3 gap-8">
                        {allProducts.slice(0, 3).map((p, i) => (
                          <div key={p.id}>
                            <div onClick={(e) => { e.stopPropagation(); openMediaPicker(section.id, 'productImage', i); }} className="aspect-[4/5] bg-slate-100 rounded-2xl mb-4 overflow-hidden border-2 border-transparent hover:border-orange-400 cursor-pointer">
                              {section.content.customImages?.[i] ? <img src={section.content.customImages[i]} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">Pick Image</div>}
                            </div>
                            <div className="font-bold text-sm">{p.name}</div>
                            <div className="text-orange-600 font-bold text-sm">{p.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rendering for additional blocks */}
                  {section.type === 'features' && (
                    <div className="py-16 px-10 border-t">
                      <h3 className="text-2xl font-bold mb-10 text-center outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}>{section.content.title}</h3>
                      <div className="grid grid-cols-2 gap-10">
                        {section.content.items.map((item: any, i: number) => (
                          <div key={i} className="p-4 bg-slate-50 rounded-xl">
                            <h4 className="font-bold text-lg outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 't', e.currentTarget.innerText)}>{item.t}</h4>
                            <p className="text-slate-600 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'd', e.currentTarget.innerText)}>{item.d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

                  {section.type === 'testimonials' && (
                    <div className="py-16 px-10 text-center italic border-t">
                       {section.content.items.map((item: any, i: number) => (
                         <div key={i} className="max-w-2xl mx-auto">
                           <p className="text-2xl text-slate-700 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'text', e.currentTarget.innerText)}>{item.text}</p>
                           <p className="mt-4 font-bold not-italic text-slate-900 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'name', e.currentTarget.innerText)}>{item.name}</p>
                           <p className="text-sm not-italic text-slate-400 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'role', e.currentTarget.innerText)}>{item.role}</p>
                         </div>
                       ))}
                    </div>
                  )}

                  {section.type === 'cta' && (
                    <div className="py-20 text-center border-t">
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

      {/* MEDIA MODAL */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-10 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold">Pick Image</h2>
              <button onClick={() => setShowMediaModal(false)} className="text-slate-400 hover:text-slate-900 text-2xl">✕</button>
            </div>
            <div className="p-8 overflow-y-auto grid grid-cols-4 gap-4">
              {mediaItems.length > 0 ? mediaItems.map((item: any) => (
                <div key={item.id} onClick={() => selectImage(item.url)} className="cursor-pointer aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all">
                  <img src={item.url} className="w-full h-full object-cover" />
                </div>
              )) : (
                <div className="col-span-4 py-10 text-center">
                   <p className="text-slate-400 mb-4">No images found.</p>
                   <Link href="/ahmed-dashboard/media" className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold">Go to Library</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}