"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LiveEditor() {
  const search = useSearchParams();
  const id = search.get("id") || "minimal";
  const initialColor = search.get("color") || (id === "modern" ? "#fb7185" : id === "classic" ? "#10b981" : "#6366f1");
  const initialFont = search.get("font") || (id === "modern" ? "Poppins" : id === "classic" ? "Georgia" : "Inter");
  const initialLayout = search.get("layout") || "spacious";

  const [color, setColor] = useState(initialColor);
  const [font, setFont] = useState(initialFont);
  const [layout, setLayout] = useState(initialLayout);

  const [title, setTitle] = useState("Welcome to your store");
  const [subtitle, setSubtitle] = useState("Edit this hero text inline to preview changes in real time.");
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    setColor(initialColor);
    setFont(initialFont);
    setLayout(initialLayout);
  }, [initialColor, initialFont, initialLayout]);

  function exportTheme() {
    const payload = { id, color, font, layout, title, subtitle };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(true);
    setTimeout(() => setShowExport(false), 1500);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Live Site Editor</h1>
        <div className="flex items-center gap-3">
          <button onClick={exportTheme} className="px-3 py-1 bg-blue-600 text-white rounded">Export Theme</button>
          {showExport && <span className="text-sm text-green-600">Exported</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="space-y-4">
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium">Accent Color</label>
            <input className="w-16 h-10 mt-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>

          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium">Font</label>
            <select value={font} onChange={(e) => setFont(e.target.value)} className="mt-2 w-full border rounded px-2 py-1">
              <option>Inter</option>
              <option>Poppins</option>
              <option>Georgia</option>
            </select>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium">Layout</label>
            <select value={layout} onChange={(e) => setLayout(e.target.value)} className="mt-2 w-full border rounded px-2 py-1">
              <option value="spacious">Spacious</option>
              <option value="center">Centered</option>
              <option value="boxed">Boxed</option>
            </select>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium">Hero Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full border rounded px-2 py-1" />
            <label className="block text-sm font-medium mt-3">Hero Subtitle</label>
            <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="mt-2 w-full border rounded p-2" />
          </div>
        </aside>

        <main className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="p-8" style={{ background: color, fontFamily: font }}>
              <div className={layout === "boxed" ? "max-w-3xl mx-auto" : layout === "center" ? "max-w-2xl mx-auto text-center" : "max-w-4xl mx-auto"}>
                <h2 className="text-4xl font-bold text-white" contentEditable onInput={(e) => setTitle((e.target as HTMLElement).innerText)} suppressContentEditableWarning>{title}</h2>
                <p className="mt-3 text-white/90" contentEditable onInput={(e) => setSubtitle((e.target as HTMLElement).innerText)} suppressContentEditableWarning>{subtitle}</p>
                <div className="mt-6">
                  <button className="px-4 py-2 bg-white text-black rounded">Call to action</button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Page Content</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded p-4">Product / block 1</div>
                <div className="border rounded p-4">Product / block 2</div>
                <div className="border rounded p-4">Product / block 3</div>
                <div className="border rounded p-4">Product / block 4</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
