"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type SectionType = "navbar" | "hero" | "features" | "products" | "faq" | "testimonials" | "cta";

type Product = {
  id: string;
  name: string;
  price?: string;
  imageUrl?: string | null;
  category?: string | null;
  status?: string | null;
};

const THEMES: Record<string, any> = {
  minimal: { name: "Minimal", color: "#6366f1", font: "Inter", preview: "/themes/minimal.png" },
  modern: { name: "Modern", color: "#fb7185", font: "Poppins", preview: "/themes/modern.png" },
  classic: { name: "Classic", color: "#10b981", font: "Georgia", preview: "/themes/classic.png" },
  bold: { name: "Bold & Dark", color: "#1a1a1a", font: "Inter", preview: "/themes/dark.png" },
  elegant: { name: "Elegant", color: "#c2410c", font: "Georgia", preview: "/themes/elegant.png" },
  tech: { name: "Tech-Forward", color: "#06b6d4", font: "Inter", preview: "/themes/tech.png" },
};

const THEME_PRESETS: Record<string, any> = {
  minimal: {
    color: "#6366f1",
    font: "Inter",
    sections: [
      { id: "m1", type: "hero", settings: { layout: "spacious", bgColor: "#ffffff" }, content: { title: "Refined Simplicity", subtitle: "Minimalist design for modern brands.", bgImage: "" } },
      { id: "m2", type: "products", settings: { bgColor: "#f8fafc" }, content: { title: "Essential Collection", count: 3, source: "all", collection: "" } }
    ]
  },
  modern: {
    color: "#fb7185",
    font: "Poppins",
    sections: [
      { id: "mo1", type: "hero", settings: { layout: "center", bgColor: "#fff1f2" }, content: { title: "Bold & Vibrant", subtitle: "Express your brand with high contrast.", bgImage: "" } },
      { id: "mo2", type: "features", settings: { bgColor: "#ffffff" }, content: { title: "Innovative Features", items: [{ t: "Next-Gen", d: "Leading the market." }, { t: "Unmatched", d: "Quality first." }] } }
    ]
  },
  classic: {
    color: "#10b981",
    font: "Georgia",
    sections: [
      { id: "cl1", type: "hero", settings: { layout: "boxed", bgColor: "#ffffff" }, content: { title: "The Standard of Excellence", subtitle: "Traditional values meets modern tech.", bgImage: "" } },
      { id: "cl2", type: "products", settings: { bgColor: "#ffffff" }, content: { title: "Our Best Sellers", count: 3, source: "all", collection: "" } }
    ]
  },
  bold: {
    color: "#eab308",
    font: "Inter",
    sections: [
      { id: "bd1", type: "hero", settings: { layout: "spacious", bgColor: "#121212", titleColor: "#ffffff" }, content: { title: "UNLEASH THE POWER", subtitle: "High energy design for high energy brands.", bgImage: "" } },
      { id: "bd2", type: "cta", settings: { bgColor: "#1a1a1a" }, content: { title: "Join the Dark Side", button: "Get Started Now" } }
    ]
  },
  elegant: {
    color: "#c2410c",
    font: "Georgia",
    sections: [
      { id: "el1", type: "hero", settings: { layout: "center", bgColor: "#fff7ed" }, content: { title: "Pure Sophistication", subtitle: "The finest selection for the finest taste.", bgImage: "" } },
      { id: "el2", type: "testimonials", settings: { bgColor: "#ffffff" }, content: { items: [{ name: "Sophia R.", text: "Absolutely stunning template.", role: "CEO" }] } }
    ]
  },
  tech: {
    color: "#06b6d4",
    font: "Inter",
    sections: [
      { id: "tk1", type: "hero", settings: { layout: "spacious", bgColor: "#0f172a", titleColor: "#22d3ee" }, content: { title: "Future Forward", subtitle: "Building the digital landscape of tomorrow.", bgImage: "" } },
      { id: "tk2", type: "faq", settings: { bgColor: "#1e293b", titleColor: "#ffffff" }, content: { title: "System Knowledge", items: [{ q: "Uptime?", a: "99.9% guaranteed." }] } }
    ]
  },
};

interface Section {
  id: string;
  type: SectionType;
  settings: {
    layout?: "spacious" | "center" | "boxed";
    textAlign?: "left" | "center" | "right";
    bgColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    isBold?: boolean;
    isItalic?: boolean;
  };
  content: any;
}

export default function LiveEditor() {
  const search = useSearchParams();

  // --- STATE MANAGEMENT ---
  const [globalColor, setGlobalColor] = useState("#6366f1");
  const [globalFont, setGlobalFont] = useState("Inter");
  const [pageSections, setPageSections] = useState<Record<string, Section[]>>({ "Home": [] });
  const [activePage, setActivePage] = useState("Home");
  const [activeTab, setActiveTab] = useState<"edit" | "pages" | "theme">("edit");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Computed: current page sections
  const sections = pageSections[activePage] || [];
  const hasNavbar = sections.some((section) => section.type === "navbar");
  const pageLinks = Object.keys(pageSections);

  // --- MEDIA MODAL STATE ---
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [selectingFor, setSelectingFor] = useState<{ id: string, field: string, index?: number } | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    const precision = value >= 10 || index === 0 ? 0 : 1;
    return `${value.toFixed(precision)} ${units[index]}`;
  };

  // --- PERSISTENCE LOGIC (SAVE/LOAD) ---
  useEffect(() => {
    const urlThemeId = search.get("id");
    const isNew = search.get("new") === "true";

    async function loadInitialData() {
      let loadedFromCloud = false;

      // 1. TRY CLOUD FIRST
      try {
        const res = await fetch("/api/themes");
        const data = await res.json();
        if (data.config) {
          const config = data.config;
          // If it's a new theme selection from library, we might want to prioritize the preset
          // but only if the user explicitly clicked "new" and it's a DIFFERENT theme.
          if (!(isNew && urlThemeId && config.themeId !== urlThemeId)) {
            setPageSections(config.pageSections || { "Home": [] });
            setGlobalColor(config.globalColor || "#6366f1");
            setGlobalFont(config.globalFont || "Inter");
            if (config.activePage) setActivePage(config.activePage);
            loadedFromCloud = true;
            console.log("Loaded from Cloud Project");
          }
        }
      } catch (e) { console.error("Cloud fetch failed", e); }

      if (loadedFromCloud) return;

      // 2. FALLBACK TO LOCAL STORAGE
      const savedData = localStorage.getItem("shoply_project_draft");
      let loadedFromDraft = false;

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          const draftThemeId = parsed.themeId;

          if (!urlThemeId || urlThemeId === draftThemeId) {
            if (parsed.pageSections) setPageSections(parsed.pageSections);
            setGlobalColor(parsed.globalColor || "#6366f1");
            setGlobalFont(parsed.globalFont || "Inter");
            if (parsed.activePage) setActivePage(parsed.activePage);
            loadedFromDraft = true;
          }
        } catch (e) { console.error("Failed to load draft", e); }
      }

      // 3. FALLBACK TO PRESETS
      if (!loadedFromDraft) {
        if (urlThemeId && THEME_PRESETS[urlThemeId]) {
          const preset = THEME_PRESETS[urlThemeId];
          setGlobalColor(search.get("color") || preset.color);
          setGlobalFont(search.get("font") || preset.font);
          setPageSections({ "Home": preset.sections });
        } else {
          setPageSections({ "Home": [{ id: "hero-1", type: "hero", settings: { layout: "spacious" }, content: { title: "Your Brand, Your Way", subtitle: "Build your dream store.", bgImage: "", bgSize: "cover", bgPos: "center" } }] });
        }
      }
    }

    loadInitialData();

    // Clear the 'new' flag
    if (isNew && urlThemeId) {
      window.history.replaceState({}, '', window.location.pathname + `?id=${urlThemeId}`);
    }

    const savedMedia = localStorage.getItem("shoply_media_library");
    if (savedMedia) {
      setMediaItems(JSON.parse(savedMedia));
    }
  }, []);

  // AUTO-SYNC Preview Data (Instant for live preview tab)
  useEffect(() => {
    const previewData = { globalColor, globalFont, sections: pageSections[activePage], activePage, pageSections };
    localStorage.setItem("shoply_theme_preview", JSON.stringify(previewData));
  }, [globalColor, globalFont, pageSections, activePage]);

  // DEBOUNCED AUTO-SAVE Project Draft (Every 1.5s after last change)
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(async () => {
      const urlThemeId = search.get("id");
      const projectData = {
        themeId: urlThemeId || "default",
        globalColor,
        globalFont,
        pageSections,
        activePage
      };

      // 1. Local Storage fallback (fast)
      localStorage.setItem("shoply_project_draft", JSON.stringify(projectData));

      // 2. Cloud Server Sync (reliable)
      try {
        await fetch("/api/themes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: projectData })
        });
        setSaveStatus("Cloud Synced");
      } catch (e) {
        console.error("Cloud save failed", e);
        setSaveStatus("Saved Locally");
      }

      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 2000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [globalColor, globalFont, pageSections, activePage, search]);

  const saveToLocalStorage = () => {
    const urlThemeId = search.get("id");
    const projectData = {
      themeId: urlThemeId || "default",
      globalColor,
      globalFont,
      pageSections,
      activePage
    };
    localStorage.setItem("shoply_project_draft", JSON.stringify(projectData));
    setSaveStatus("Saved!");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/dashboard/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setStoreName(data.store_name || "");
      } catch (error) {
        setStoreName("");
      } finally {
        setSettingsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/dashboard/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
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

  const productCollections = useMemo(() => {
    const set = new Set<string>();
    liveProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [liveProducts]);

  const storeSlug = useMemo(() => {
    return storeName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [storeName]);
  const storePath = storeSlug ? `/${storeSlug}.store` : "";

  // NEW: Handle Preview
  const handlePreview = () => {
    const previewData = { globalColor, globalFont, sections };
    // Save the current state so the preview page can read it
    localStorage.setItem("shoply_theme_preview", JSON.stringify(previewData));

    if (!settingsLoaded || !storeSlug) {
      window.open("/dashboard/v1/settings", "_blank");
      return;
    }

    window.open(storePath, "_blank");
  };

  // --- THEME & PAGE LOGIC ---
  const applyTheme = (themeId: string, fullReset = false) => {
    const theme = THEMES[themeId];
    const preset = THEME_PRESETS[themeId];
    if (theme) {
      setGlobalColor(theme.color);
      setGlobalFont(theme.font);

      if (fullReset && preset) {
        if (confirm("Reset current page content to template defaults?")) {
          setPageSections(prev => ({
            ...prev,
            [activePage]: preset.sections
          }));
          setActiveSectionId(null);
        }
      }
    }
  };

  const createNewPage = () => {
    const pageName = prompt("Enter page name (e.g., 'About', 'Contact'):");
    if (pageName && !pageSections[pageName]) {
      setPageSections(prev => ({
        ...prev,
        [pageName]: []
      }));
      setActivePage(pageName);
      setActiveTab("edit");
    }
  };

  const switchPage = (pageName: string) => {
    setActivePage(pageName);
    setActiveTab("edit");
    setActiveSectionId(null);
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

  const handleMediaUpload = async (file: File) => {
    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      const newItem = {
        id: data.id,
        url: data.url,
        name: data.name,
        size: formatBytes(data.size),
        type: data.type || "image",
      };

      const updated = [newItem, ...mediaItems];
      setMediaItems(updated);
      localStorage.setItem("shoply_media_library", JSON.stringify(updated));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // --- BLOCK MANAGEMENT ---
  const addSection = (type: SectionType) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newSection: Section = {
      id: newId,
      type,
      settings: { layout: "center", textAlign: "center", bgColor: "", titleColor: "", subtitleColor: "", isBold: false, isItalic: false },
      content: getDefaultContent(type)
    };

    setPageSections(prev => ({
      ...prev,
      [activePage]: [...(prev[activePage] || []), newSection]
    }));
    setActiveSectionId(newId);
  };

  const removeSection = (id: string) => {
    setPageSections(prev => ({
      ...prev,
      [activePage]: (prev[activePage] || []).filter(s => s.id !== id)
    }));
    if (activeSectionId === id) setActiveSectionId(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const currentSections = [...(pageSections[activePage] || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= currentSections.length) return;
    [currentSections[index], currentSections[target]] = [currentSections[target], currentSections[index]];

    setPageSections(prev => ({
      ...prev,
      [activePage]: currentSections
    }));
  };

  const updateContent = (id: string, updates: any) => {
    setPageSections(prev => ({
      ...prev,
      [activePage]: (prev[activePage] || []).map(s => s.id === id ? { ...s, content: { ...s.content, ...updates } } : s)
    }));
  };

  const updateSettings = (id: string, updates: any) => {
    setPageSections(prev => ({
      ...prev,
      [activePage]: (prev[activePage] || []).map(s => s.id === id ? { ...s, settings: { ...s.settings, ...updates } } : s)
    }));
  };

  const updateItemInList = (sectionId: string, listKey: string, index: number, field: string, value: string) => {
    setPageSections(prev => ({
      ...prev,
      [activePage]: (prev[activePage] || []).map(s => {
        if (s.id !== sectionId) return s;
        const newList = [...s.content[listKey]];
        newList[index] = { ...newList[index], [field]: value };
        return { ...s, content: { ...s.content, [listKey]: newList } };
      })
    }));
  };

  const removeItemFromList = (sectionId: string, listKey: string, index: number) => {
    setPageSections(prev => ({
      ...prev,
      [activePage]: (prev[activePage] || []).map(s => {
        if (s.id !== sectionId) return s;
        const newList = s.content[listKey].filter((_: any, i: number) => i !== index);
        return { ...s, content: { ...s.content, [listKey]: newList } };
      })
    }));
  };

  function getDefaultContent(type: SectionType) {
    switch (type) {
      case 'navbar': {
        const existingLinks = sections
          .filter(s => s.type !== 'navbar')
          .slice(0, 4)
          .map((s) => ({
            label: s.type.charAt(0).toUpperCase() + s.type.slice(1),
            href: `#section-${s.id}`
          }));
        return {
          brand: "Shoply",
          links: existingLinks.length ? existingLinks : [
            { label: "Home", href: "#top" },
            { label: "Shop", href: "#top" }
          ],
          ctaLabel: "Shop Now",
          ctaHref: "#top"
        };
      }
      case 'hero': return { title: "New Hero Section", subtitle: "Edit text directly.", bgImage: "", bgSize: "cover", bgPos: "center" };
      case 'products': return { title: "Featured Products", count: 3, source: "all", collection: "", customImages: [] };
      case 'features': return { title: "Why Us", items: [{ t: "Fast Shipping", d: "Delivery in 2 days" }, { t: "24/7 Support", d: "Always here" }] };
      case 'faq': return { title: "FAQ", items: [{ q: "Shipping?", a: "Worldwide!" }] };
      case 'testimonials': return { items: [{ name: "Alex S.", text: "Best store ever!", role: "Buyer" }] };
      case 'cta': return { title: "Ready to start?", button: "Get Started" };
      default: return { title: "New Section" };
    }
  }

  const activeSection = sections.find(s => s.id === activeSectionId);
  const activeSectionIndex = sections.findIndex(s => s.id === activeSectionId);

  // --- HELPERS FOR SETTINGS ---
  const handleContentChange = (field: string, value: any) => {
    if (activeSectionId) {
      updateContent(activeSectionId, { [field]: value });
    }
  };

  const handleListItemChange = (listKey: string, index: number, field: string, value: string) => {
    if (activeSectionId) {
      updateItemInList(activeSectionId, listKey, index, field, value);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-900 overflow-hidden">
      {/* HEADER TOOLBAR */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/v1/theme" className="text-slate-400 hover:text-slate-600 transition">←</Link>
          <span className="font-bold text-xl text-orange-600">Shoply Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              {isSaving && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />}
              {isSaving ? "Auto-saving..." : (saveStatus || "All changes saved")}
            </span>
            <span className="text-xs font-bold text-orange-600">{activePage} Page</span>
          </div>
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
        <aside className="w-80 bg-white border-r overflow-y-auto flex flex-col shrink-0 border-slate-200">
          {/* TABS (CONCEPTUAL) */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'edit' ? 'border-orange-500 text-orange-600 bg-orange-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab("pages")}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'pages' ? 'border-orange-500 text-orange-600 bg-orange-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Pages
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'theme' ? 'border-orange-500 text-orange-600 bg-orange-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Theme
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-8">
            {activeTab === "edit" && (
              <>
                {/* SECTION NAVIGATOR */}
                <section className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Sections</h3>
                    <span className="text-[10px] font-bold text-slate-300">{sections.length} Layers</span>
                  </div>
                  <div className="space-y-1">
                    {sections.map((s, idx) => (
                      <div
                        key={s.id}
                        onClick={() => setActiveSectionId(s.id)}
                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${activeSectionId === s.id ? 'bg-orange-600 text-white shadow-md shadow-orange-200' : 'hover:bg-slate-50 text-slate-600'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeSectionId === s.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{idx + 1}</span>
                          <span className="text-xs font-bold capitalize">{s.type}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }} className="p-1 hover:bg-black/10 rounded">↑</button>
                          <button onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }} className="p-1 hover:bg-black/10 rounded">↓</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Add New Block</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {(['navbar', 'hero', 'products', 'features', 'faq', 'testimonials', 'cta'] as SectionType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => addSection(type)}
                          className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all gap-1 saturate-[0.8] hover:saturate-100"
                        >
                          <span className="text-lg">
                            {type === 'navbar' && '=='}
                            {type === 'hero' && '🖼️'}
                            {type === 'products' && '🛍️'}
                            {type === 'features' && '✨'}
                            {type === 'faq' && '❓'}
                            {type === 'testimonials' && '💬'}
                            {type === 'cta' && '⚡'}
                          </span>
                          <span className="text-[9px] font-bold capitalize">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* CONTEXTUAL SETTINGS */}
                {activeSection ? (
                  <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-4 border-t border-slate-100">
                    {/* ... existing section settings content ... */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Settings</h3>
                      <button onClick={() => setActiveSectionId(null)} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100">✕ Close</button>
                    </div>

                    <div className="space-y-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {/* STYLE CONTROLS */}
                      <div className="space-y-4 pb-6 border-b border-slate-200">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Style</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Background</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={activeSection.settings.bgColor || "#ffffff"}
                                onChange={(e) => updateSettings(activeSection.id, { bgColor: e.target.value })}
                                className="w-10 h-10 cursor-pointer rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-200"
                              />
                              <button onClick={() => updateSettings(activeSection.id, { bgColor: "" })} className="text-[9px] text-slate-400 font-bold hover:text-red-500">Reset</button>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Title Color</label>
                            <input
                              type="color"
                              value={activeSection.settings.titleColor || "#000000"}
                              onChange={(e) => updateSettings(activeSection.id, { titleColor: e.target.value })}
                              className="w-10 h-10 cursor-pointer rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-200"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Description Color</label>
                            <input
                              type="color"
                              value={activeSection.settings.subtitleColor || "#64748b"}
                              onChange={(e) => updateSettings(activeSection.id, { subtitleColor: e.target.value })}
                              className="w-10 h-10 cursor-pointer rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-200"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Text Alignment</label>
                            <div className="flex bg-white border border-slate-200 rounded-lg p-1 gap-1">
                              {(['left', 'center', 'right'] as const).map(align => (
                                <button
                                  key={align}
                                  onClick={() => updateSettings(activeSection.id, { textAlign: align })}
                                  className={`flex-1 p-1 rounded transition-all text-xs ${activeSection.settings.textAlign === align ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-400'}`}
                                >
                                  {align === 'left' && '⬅️'}
                                  {align === 'center' && '↔️'}
                                  {align === 'right' && '➡️'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateSettings(activeSection.id, { isBold: !activeSection.settings.isBold })}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeSection.settings.isBold ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}
                          >
                            BOLD
                          </button>
                          <button
                            onClick={() => updateSettings(activeSection.id, { isItalic: !activeSection.settings.isItalic })}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black italic transition-all ${activeSection.settings.isItalic ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}
                          >
                            ITALIC
                          </button>
                        </div>
                      </div>

                      {/* COMMON: Title */}
                      {activeSection.content.title !== undefined && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Section Title</label>
                          <input
                            type="text"
                            value={activeSection.content.title}
                            onChange={(e) => handleContentChange('title', e.target.value)}
                            className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                          />
                        </div>
                      )}

                      {/* HERO SPECIFIC */}
                      {activeSection.type === 'hero' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Hero Subtitle</label>
                            <textarea
                              value={activeSection.content.subtitle}
                              onChange={(e) => handleContentChange('subtitle', e.target.value)}
                              className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none h-24 resize-none font-medium"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter block">Media Content</label>
                            <div className="relative group cursor-pointer" onClick={() => openMediaPicker(activeSection.id, 'bgImage')}>
                              <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-orange-200 transition-colors">
                                {activeSection.content.bgImage ? (
                                  <img src={activeSection.content.bgImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                    <span className="text-2xl opacity-50">🖼️</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Pick Background</span>
                                  </div>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Media</span>
                              </div>
                            </div>
                            {activeSection.content.bgImage && (
                              <button onClick={() => handleContentChange('bgImage', '')} className="w-full py-2 bg-red-50 text-[9px] font-black text-red-500 uppercase tracking-widest rounded-lg hover:bg-red-100 transition-colors">Remove Media</button>
                            )}
                          </div>
                        </>
                      )}

                      {/* PRODUCTS SPECIFIC */}
                      {activeSection.type === 'products' && (() => {
                        const sourceValue = activeSection.content.source || "all";
                        return (
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Show</label>
                              <select
                                value={sourceValue}
                                onChange={(e) => handleContentChange('source', e.target.value)}
                                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                              >
                                <option value="all">All Products</option>
                                <option value="collection">Collection (Category)</option>
                              </select>
                            </div>

                            {sourceValue === "collection" && (
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Collection</label>
                                <select
                                  value={activeSection.content.collection || ""}
                                  onChange={(e) => handleContentChange('collection', e.target.value)}
                                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                                >
                                  <option value="">Select category</option>
                                  {productCollections.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                                {!productsLoaded && (
                                  <div className="text-[10px] text-slate-400">Loading categories...</div>
                                )}
                                {productsLoaded && productCollections.length === 0 && (
                                  <div className="text-[10px] text-slate-400">No categories found.</div>
                                )}
                              </div>
                            )}

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Products Count</label>
                              <input
                                type="number"
                                min={1}
                                max={12}
                                value={activeSection.content.count ?? 3}
                                onChange={(e) => handleContentChange('count', Math.max(1, Number(e.target.value) || 1))}
                                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                              />
                            </div>
                          </div>
                        );
                      })()}

                      {/* CTA/Button SPECIFIC */}
                      {activeSection.content.button !== undefined && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Button Label</label>
                          <input
                            type="text"
                            value={activeSection.content.button}
                            onChange={(e) => handleContentChange('button', e.target.value)}
                            className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                          />
                        </div>
                      )}

                      {/* NAVBAR SPECIFIC */}
                      {activeSection.type === 'navbar' && (
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Brand</label>
                            <input
                              type="text"
                              value={activeSection.content.brand || ""}
                              onChange={(e) => handleContentChange('brand', e.target.value)}
                              className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">CTA Label</label>
                              <input
                                type="text"
                                value={activeSection.content.ctaLabel || ""}
                                onChange={(e) => handleContentChange('ctaLabel', e.target.value)}
                                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">CTA Link</label>
                              <input
                                type="text"
                                value={activeSection.content.ctaHref || ""}
                                onChange={(e) => handleContentChange('ctaHref', e.target.value)}
                                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                                placeholder="#section-..."
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nav Links</label>
                              <button
                                onClick={() => updateContent(activeSection.id, {
                                  links: [...(activeSection.content.links || []), { label: "New Link", href: "#" }]
                                })}
                                className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-full hover:bg-orange-100 transition-colors uppercase tracking-widest"
                              >
                                + Add
                              </button>
                            </div>
                            {(activeSection.content.links || []).map((link: any, idx: number) => (
                              <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Link {idx + 1}</span>
                                  <button
                                    onClick={() => removeItemFromList(activeSection.id, 'links', idx)}
                                    className="text-[9px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={link.label || ""}
                                  onChange={(e) => updateItemInList(activeSection.id, 'links', idx, 'label', e.target.value)}
                                  className="w-full text-xs font-bold outline-none placeholder:text-slate-200 border-b border-transparent focus:border-orange-100 pb-1"
                                  placeholder="Label"
                                />
                                <input
                                  type="text"
                                  value={link.href || ""}
                                  onChange={(e) => updateItemInList(activeSection.id, 'links', idx, 'href', e.target.value)}
                                  className="w-full text-[11px] text-slate-500 outline-none placeholder:text-slate-200"
                                  placeholder="Href"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* LIST ITEMS */}
                      {activeSection.content.items && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Content Layers</label>
                            <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{activeSection.content.items.length} Elements</span>
                          </div>
                          <div className="space-y-3">
                            {activeSection.content.items.map((item: any, idx: number) => (
                              <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 hover:border-orange-100 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-slate-200">LAYER #{idx + 1}</span>
                                  <button
                                    onClick={() => removeItemFromList(activeSection.id, 'items', idx)}
                                    className="text-slate-300 hover:text-red-500 transition text-[9px] font-black uppercase tracking-widest"
                                  >
                                    Delete
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={item.t ?? item.q ?? item.name ?? ""}
                                  onChange={(e) => handleListItemChange('items', idx, 't' in item ? 't' : ('q' in item ? 'q' : 'name'), e.target.value)}
                                  className="w-full text-xs font-bold outline-none placeholder:text-slate-200 border-b border-transparent focus:border-orange-100 pb-1"
                                  placeholder="Layer Heading..."
                                />
                                <textarea
                                  value={item.d ?? item.a ?? item.text ?? ""}
                                  onChange={(e) => handleListItemChange('items', idx, 'd' in item ? 'd' : ('a' in item ? 'a' : 'text'), e.target.value)}
                                  className="w-full text-[11px] text-slate-500 outline-none h-14 resize-none placeholder:text-slate-200 leading-relaxed"
                                  placeholder="Layer description content goes here..."
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                ) : (
                  <section className="p-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm ring-4 ring-slate-100">
                      <span className="text-2xl">🖱️</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Editor Idle</h4>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed px-4">Click any segment in the preview or select a layer from the list above to begin tuning.</p>
                    </div>
                  </section>
                )}
              </>
            )}

            {activeTab === "pages" && (
              <section className="animate-in fade-in slide-in-from-right-2 duration-300 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Pages</h3>
                  <button
                    onClick={createNewPage}
                    className="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors uppercase tracking-widest"
                  >
                    + New Page
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.keys(pageSections).map((page) => {
                    const isHome = page === "Home";
                    const isActive = page === activePage;
                    return (
                      <div
                        key={page}
                        onClick={() => switchPage(page)}
                        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${isActive ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{isHome ? '🏠' : '📄'}</span>
                          <span className="text-xs font-bold">{page}</span>
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />}
                      </div>
                    );
                  })}
                </div>
                <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                  <p className="text-[10px] font-bold text-orange-700 leading-relaxed uppercase tracking-widest mb-2">Multi-page Mode</p>
                  <p className="text-[10px] text-orange-600/80 leading-relaxed">You can now create multiple pages. Switching pages will update the visual canvas below.</p>
                </div>
              </section>
            )}

            {activeTab === "theme" && (
              <section className="animate-in fade-in slide-in-from-right-2 duration-300 space-y-10">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Template Switching</h3>
                  <div className="grid grid-cols-2 gap-3 mb-10">
                    {Object.entries(THEMES).map(([tid, tdata]: [string, any]) => (
                      <button
                        key={tid}
                        onClick={() => applyTheme(tid)}
                        onDoubleClick={() => applyTheme(tid, true)}
                        className={`group relative p-2 rounded-2xl border-2 transition-all overflow-hidden ${globalColor === tdata.color ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-300'}`}
                        title="Click to apply colors, Double-click to reset content"
                      >
                        <img src={tdata.preview} className="w-full aspect-[4/3] object-cover rounded-xl mb-2 grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block text-center pb-1">{tdata.name}</span>
                        {globalColor === tdata.color && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full shadow-lg">
                            <span className="text-[8px]">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Design Overrides</h3>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Brand Accent</label>
                      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <input
                          type="color"
                          value={globalColor}
                          onChange={(e) => setGlobalColor(e.target.value)}
                          className="w-14 h-14 cursor-pointer rounded-xl border-4 border-white shadow-sm ring-1 ring-slate-200"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-black uppercase text-slate-900 tracking-widest font-mono">{globalColor}</span>
                          <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Primary Theme Color</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Site Typography</label>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                        <select
                          value={globalFont}
                          onChange={(e) => setGlobalFont(e.target.value)}
                          className="w-full h-12 px-4 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none font-black appearance-none"
                        >
                          <option value="Inter">Modern Sans (Inter)</option>
                          <option value="Poppins">Playful (Poppins)</option>
                          <option value="Georgia">Elegant Serif (Georgia)</option>
                          <option value="Outfit">Clean (Outfit)</option>
                        </select>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1">Changes the font for the entire storefront</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Styles</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 rounded-xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all text-left">
                      <div className="w-8 h-8 rounded bg-slate-900 mb-2" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">Modern Noir</span>
                    </button>
                    <button className="p-3 rounded-xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all text-left">
                      <div className="w-8 h-8 rounded bg-indigo-600 mb-2" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">Indigo Sky</span>
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* MAIN PREVIEW CANVAS */}
        <main id="top" className="flex-1 overflow-y-auto bg-slate-100/50 p-4 md:p-12 scroll-smooth">
          {/* Device Mockup Wrapper */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white shadow-2xl rounded-[32px] overflow-hidden border border-slate-200 min-h-screen relative" style={{ fontFamily: globalFont }}>

              {/* Fake Browser Toolbar */}
              <div className="h-10 bg-slate-50 border-b flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                <div className="bg-white border rounded px-4 py-1 flex-1 max-w-sm mx-auto text-[10px] text-slate-400 text-center font-medium">
                  your-dream-store.shoply.com
                </div>
              </div>

              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 px-10 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl">🏗️</div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Your canvas is empty</h2>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto">Click "Add Block" in the sidebar to start building your storefront.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
              {!hasNavbar && (
                <div className="sticky top-0 z-30 border-b border-slate-200/60 backdrop-blur bg-white">
                  <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="font-black text-lg">{storeName || "Brand"}</div>
                      <nav className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
                        {pageLinks.map((name) => (
                          <button
                            key={name}
                            onClick={() => switchPage(name)}
                            className={`hover:text-slate-900 transition ${activePage === name ? "text-slate-900" : "text-slate-500"}`}
                          >
                            {name}
                          </button>
                        ))}
                      </nav>
                    </div>
                    <button
                      onClick={() => switchPage(activePage)}
                      className="px-4 py-2 rounded-full text-xs font-black text-white shadow-sm hover:shadow-md transition"
                      style={{ backgroundColor: globalColor }}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              )}

              {sections.map((section, index) => (
                    <div
                      key={section.id}
                      id={`section-${section.id}`}
                      onClick={(e) => { e.stopPropagation(); setActiveSectionId(section.id); }}
                      className={`group relative transition-all cursor-pointer ${activeSectionId === section.id ? 'ring-4 ring-orange-500 ring-inset ring-offset-0' : 'hover:bg-slate-50/50'}`}
                    >
                      {/* Floating Indicator */}
                      {activeSectionId === section.id && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 z-10 flex items-center justify-center">
                          <div className="bg-orange-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full -translate-y-1/2 shadow-lg">
                            Currently Editing: {section.type}
                          </div>
                        </div>
                      )}

                      {/* Quick Controls Bar (On Hover) */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-full p-1 flex gap-0.5">
                          <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">↑</button>
                          <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">↓</button>
                          <div className="w-px h-4 bg-slate-200 mx-1 mt-2" />
                          <button onClick={(e) => { e.stopPropagation(); removeSection(section.id); }} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full text-slate-400">✕</button>
                        </div>
                      </div>

                      <div className="w-full">
                        {section.type === 'navbar' && (
                          <div
                            className="sticky top-0 z-30 border-b border-slate-200/60 backdrop-blur"
                            style={{ backgroundColor: section.settings.bgColor || "white" }}
                          >
                            <div className="px-6 md:px-16 py-4 flex items-center justify-between">
                              <div className="flex items-center gap-8">
                                <div
                                  className="font-black text-lg outline-none"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) => updateContent(section.id, { brand: e.currentTarget.innerText })}
                                  style={{ color: section.settings.titleColor || undefined }}
                                >
                                  {section.content.brand || "Brand"}
                                </div>
                                <nav className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                                  {(section.content.links || []).map((link: any, i: number) => (
                                    <a
                                      key={i}
                                      href={link.href || "#"}
                                      className="hover:text-slate-900 transition"
                                      style={{ color: section.settings.subtitleColor || undefined }}
                                    >
                                      <span
                                        className="outline-none"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => updateItemInList(section.id, 'links', i, 'label', e.currentTarget.innerText)}
                                      >
                                        {link.label || "Link"}
                                      </span>
                                    </a>
                                  ))}
                                </nav>
                              </div>
                              <div className="flex items-center gap-3">
                                {section.content.ctaLabel && (
                                  <a
                                    href={section.content.ctaHref || "#"}
                                    className="px-4 py-2 rounded-full text-[10px] font-black text-white shadow-sm hover:shadow-md transition"
                                    style={{ backgroundColor: globalColor }}
                                  >
                                    <span
                                      className="outline-none"
                                      contentEditable
                                      suppressContentEditableWarning
                                      onBlur={(e) => updateContent(section.id, { ctaLabel: e.currentTarget.innerText })}
                                    >
                                      {section.content.ctaLabel}
                                    </span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {section.type === 'hero' && (
                          <div className={`py-24 md:py-36 px-6 md:px-20 text-white relative overflow-hidden flex flex-col justify-center ${section.settings.textAlign === 'left' ? 'items-start text-left' :
                            section.settings.textAlign === 'right' ? 'items-end text-right' :
                              'items-center text-center'}`}
                            style={{
                              backgroundColor: section.settings.bgColor || globalColor,
                              backgroundImage: section.content.bgImage ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.bgImage})` : 'none',
                              backgroundSize: section.content.bgSize || 'cover',
                              backgroundPosition: section.content.bgPos || 'center'
                            }}>
                            <h2
                              className="text-4xl md:text-6xl outline-none leading-tight max-w-4xl"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}
                              style={{
                                color: section.settings.titleColor || undefined,
                                fontWeight: section.settings.isBold ? '900' : 'inherit',
                                fontStyle: section.settings.isItalic ? 'italic' : 'normal'
                              }}
                            >
                              {section.content.title}
                            </h2>
                            <p
                              className="mt-6 text-lg md:text-xl opacity-90 outline-none max-w-2xl"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateContent(section.id, { subtitle: e.currentTarget.innerText })}
                              style={{ color: section.settings.subtitleColor || undefined }}
                            >
                              {section.content.subtitle}
                            </p>
                            {section.content.button && (
                              <button className="mt-10 px-8 py-4 bg-white text-slate-900 rounded-full font-bold shadow-xl active:scale-95 transition-transform" style={{ color: globalColor }}>
                                {section.content.button}
                              </button>
                            )}
                          </div>
                        )}

                        {section.type === 'products' && (
                          <div className={`py-20 px-6 md:px-16 container mx-auto ${section.settings.textAlign === 'left' ? 'text-left' :
                            section.settings.textAlign === 'right' ? 'text-right' :
                              'text-center'}`}
                            style={{ backgroundColor: section.settings.bgColor || 'transparent' }}>
                            {(() => {
                              const source = section.content.source || "all";
                              const collection = section.content.collection || "";
                              const count = Number(section.content.count) || 3;
                              const baseList = source === "collection" && collection
                                ? liveProducts.filter((p) => p.category === collection)
                                : liveProducts;
                              const sectionProducts = baseList.slice(0, count);
                              return (
                                <>
                                  <h3
                                    className="text-3xl mb-12 outline-none"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}
                                    style={{
                                      color: section.settings.titleColor || undefined,
                                      fontWeight: section.settings.isBold ? '900' : '800',
                                      fontStyle: section.settings.isItalic ? 'italic' : 'normal'
                                    }}
                                  >
                                    {section.content.title}
                                  </h3>
                                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${section.settings.textAlign === 'left' ? 'justify-items-start' :
                                    section.settings.textAlign === 'right' ? 'justify-items-end' :
                                      'justify-items-center'}`}>
                                    {sectionProducts.length === 0 && (
                                      <div className="col-span-full text-slate-400 text-sm font-semibold">
                                        {productsLoaded ? "No products found for this selection." : "Loading products..."}
                                      </div>
                                    )}
                                    {sectionProducts.map((p, i) => {
                                      const customImage = section.content.customImages?.[i];
                                      const imageUrl = customImage || p.imageUrl || "";
                                      return (
                                        <div key={p.id || i} className="group/item">
                                          <div onClick={(e) => { e.stopPropagation(); openMediaPicker(section.id, 'productImage', i); }} className="aspect-[3/4] bg-slate-50 rounded-[28px] mb-5 overflow-hidden border-2 border-transparent hover:border-orange-500/50 shadow-sm transition-all group-hover/item:shadow-md cursor-pointer relative">
                                            {imageUrl ? (
                                              <img src={imageUrl} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                                            ) : (
                                              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                                                <span className="text-3xl">🖼️</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Image Slot</span>
                                              </div>
                                            )}
                                          </div>
                                          <div className="px-1 text-center md:text-left">
                                            <div className="font-extrabold text-lg text-slate-900 leading-tight">{p.name}</div>
                                            <div className="text-orange-600 font-black text-sm mt-1">{p.price}</div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {section.type === 'features' && (
                          <div className={`py-20 px-6 md:px-16 container mx-auto ${section.settings.textAlign === 'left' ? 'text-left' :
                            section.settings.textAlign === 'right' ? 'text-right' :
                              'text-center'}`}
                            style={{ backgroundColor: section.settings.bgColor || 'transparent' }}>
                            <h3
                              className="text-2xl md:text-4xl mb-16 outline-none"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}
                              style={{
                                color: section.settings.titleColor || undefined,
                                fontWeight: section.settings.isBold ? '900' : '800',
                                fontStyle: section.settings.isItalic ? 'italic' : 'normal'
                              }}
                            >
                              {section.content.title}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              {section.content.items.map((item: any, i: number) => (
                                <div key={i} className={`flex gap-6 items-start p-8 rounded-[32px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all hover:-translate-y-1 ${section.settings.textAlign === 'right' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 shrink-0">✨</div>
                                  <div>
                                    <h4 className="font-extrabold text-xl mb-2 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 't', e.currentTarget.innerText)} style={{ color: section.settings.titleColor || undefined }}>{item.t}</h4>
                                    <p className="text-slate-500 leading-relaxed outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'd', e.currentTarget.innerText)} style={{ color: section.settings.subtitleColor || undefined }}>{item.d}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.type === 'faq' && (
                          <div className={`py-20 px-6 md:px-16 container mx-auto ${section.settings.textAlign === 'left' ? 'text-left' :
                            section.settings.textAlign === 'right' ? 'text-right' :
                              'text-center'}`}
                            style={{ backgroundColor: section.settings.bgColor || 'rgba(248, 250, 252, 0.5)' }}>
                            <h3
                              className="text-2xl md:text-3xl mb-12 outline-none"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}
                              style={{
                                color: section.settings.titleColor || undefined,
                                fontWeight: section.settings.isBold ? '900' : '800',
                                fontStyle: section.settings.isItalic ? 'italic' : 'normal'
                              }}
                            >
                              {section.content.title}
                            </h3>
                            <div className="space-y-4 max-w-3xl mx-auto">
                              {section.content.items.map((item: any, i: number) => (
                                <div key={i} className={`bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm ${section.settings.textAlign === 'right' ? 'text-right' : 'text-left'}`}>
                                  <h3 className="font-extrabold text-lg text-slate-900 mb-2 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'q', e.currentTarget.innerText)} style={{ color: section.settings.titleColor || undefined }}>{item.q}</h3>
                                  <p className="text-slate-500 text-sm leading-relaxed outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'a', e.currentTarget.innerText)} style={{ color: section.settings.subtitleColor || undefined }}>{item.a}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.type === 'testimonials' && (
                          <div className={`py-24 px-6 container mx-auto flex flex-col ${section.settings.textAlign === 'left' ? 'items-start text-left' :
                            section.settings.textAlign === 'right' ? 'items-end text-right' :
                              'items-center text-center'}`}
                            style={{ backgroundColor: section.settings.bgColor || 'transparent' }}>
                            {section.content.items.map((item: any, i: number) => (
                              <div key={i} className={`max-w-4xl flex flex-col ${section.settings.textAlign === 'left' ? 'items-start' :
                                section.settings.textAlign === 'right' ? 'items-end' :
                                  'items-center'}`}>
                                <div className="w-16 h-1 bg-slate-200 rounded-full mb-8" />
                                <p className="text-2xl md:text-4xl text-slate-800 font-bold italic leading-tight outline-none flex gap-1" style={{ color: section.settings.subtitleColor || undefined }}>
                                  <span className="opacity-30">"</span>
                                  <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateItemInList(section.id, 'items', i, 'text', e.currentTarget.innerText)}
                                    className="outline-none"
                                  >
                                    {item.text}
                                  </span>
                                  <span className="opacity-30">"</span>
                                </p>
                                <div className={`mt-8 flex items-center gap-4 ${section.settings.textAlign === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
                                  <div className="w-12 h-12 bg-slate-100 rounded-full border-2 border-white shadow-sm" />
                                  <div className={section.settings.textAlign === 'right' ? 'text-right' : 'text-left'}>
                                    <p className="font-black text-lg text-slate-900 outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'name', e.currentTarget.innerText)} style={{ color: section.settings.titleColor || undefined }}>{item.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateItemInList(section.id, 'items', i, 'role', e.currentTarget.innerText)}>{item.role}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.type === 'cta' && (
                          <div className={`py-24 px-6 flex flex-col ${section.settings.textAlign === 'left' ? 'items-start text-left' :
                            section.settings.textAlign === 'right' ? 'items-end text-right' :
                              'items-center text-center'}`}
                            style={{ backgroundColor: section.settings.bgColor || globalColor }}>
                            <h3
                              className="text-3xl md:text-5xl text-white mb-10 outline-none max-w-3xl"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateContent(section.id, { title: e.currentTarget.innerText })}
                              style={{
                                color: section.settings.titleColor || undefined,
                                fontWeight: section.settings.isBold ? '900' : '900',
                                fontStyle: section.settings.isItalic ? 'italic' : 'normal'
                              }}
                            >
                              {section.content.title}
                            </h3>
                            <button className="px-10 py-4 bg-white rounded-full font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all" style={{ color: globalColor }}>
                              <span className="outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(section.id, { button: e.currentTarget.innerText })}>{section.content.button}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fake Footer */}
              <footer className="py-12 px-10 border-t bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="font-black text-xl text-slate-900">Your Store.</div>
                <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Shop</span>
                  <span>About</span>
                  <span>Privacy</span>
                  <span>Contact</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">© 2026 Powered by Shoply</div>
              </footer>
            </div>
          </div>
        </main>
      </div>

      {/* EXPORT / PUBLISH MODAL */}
      {showExport && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-10 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">🚀</div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-slate-900">Publish Your Site?</h2>
              <p className="text-slate-500 leading-relaxed px-6">Your changes will be saved and your storefront will be updated live for all visitors.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-3">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Status</span>
                <span className="text-green-600">Ready to Deploy</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Pages</span>
                <span className="text-slate-900">{Object.keys(pageSections).length} Pages Detected</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowExport(false)} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition">Cancel</button>
              <button
                onClick={() => {
                  saveToLocalStorage();
                  alert("Successfully Published! Your site is now live at your-store.shoply.com");
                  setShowExport(false);
                }}
                className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all"
              >
                PUBLISH NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEDIA MODAL */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-10 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold">Pick Image</h2>
              <div className="flex items-center gap-3">
                <label className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                  {isUploadingMedia ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleMediaUpload(file);
                      }
                      if (e.target.value) {
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
                <button onClick={() => setShowMediaModal(false)} className="text-slate-400 hover:text-slate-900 text-2xl">?</button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto grid grid-cols-4 gap-4">
              {mediaItems.length > 0 ? mediaItems.map((item: any) => (
                <div key={item.id} onClick={() => selectImage(item.url)} className="cursor-pointer aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all">
                  <img src={item.url} className="w-full h-full object-cover" />
                </div>
              )) : (
                <div className="col-span-4 py-10 text-center">
                  <p className="text-slate-400 mb-4">No images found.</p>
                  <Link href="/dashboard/v1/media" className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold">Go to Library</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


