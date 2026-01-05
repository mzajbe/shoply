import Link from "next/link";

const themes = [
  {
    id: "minimal",
    name: "Minimal",
    desc: "A clean, whitespace-focused layout perfect for high-end boutique brands.",
    accent: "bg-indigo-500",
    previewColor: "#6366f1",
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Bold typography and high-contrast elements for storytelling and impact.",
    accent: "bg-rose-500",
    previewColor: "#fb7185",
  },
  {
    id: "classic",
    name: "Classic",
    desc: "Traditional e-commerce structure with clear navigation and trust-focused blocks.",
    accent: "bg-emerald-500",
    previewColor: "#10b981",
  },
];

export default function ThemeLibrary() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Theme Library</h1>
          <p className="text-slate-500 mt-1 text-lg">
            Select a blueprint to start building your no-code storefront.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* UPDATED: Added Dashboard button to jump back to the main admin page */}
          <Link 
            href="/ahmed-dashboard" 
            className="inline-flex items-center px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            📊 View Dashboard
          </Link>

          {/* Quick Action: Start from Scratch */}
          <Link 
            href="/ahmed-dashboard/theme/editor" 
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition-all hover:scale-105 active:scale-95"
          >
            Build from Scratch
          </Link>
        </div>
      </div>

      {/* Theme Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {themes.map((t) => (
          <div key={t.id} className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
            
            {/* Theme Visual Preview */}
            <div className="h-48 relative flex items-center justify-center bg-slate-50 overflow-hidden" aria-hidden="true">
              <div className="absolute inset-0 opacity-10" style={{ backgroundColor: t.previewColor }} />
              
              {/* Mockup UI Elements */}
              <div className="relative w-4/5 h-3/5 rounded-xl bg-white shadow-lg border border-slate-100 p-3 flex flex-col gap-2">
                <div className={`w-1/3 h-2 rounded-full ${t.accent}`} />
                <div className="w-full h-1 bg-slate-100 rounded-full" />
                <div className="w-4/5 h-1 bg-slate-100 rounded-full" />
                <div className="mt-auto flex gap-2">
                  <div className="w-8 h-8 rounded-md bg-slate-50" />
                  <div className="w-8 h-8 rounded-md bg-slate-50" />
                  <div className="w-8 h-8 rounded-md bg-slate-50" />
                </div>
              </div>
            </div>

            {/* Content & Actions */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-xl text-slate-900">{t.name}</h2>
                <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded">Template</span>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {t.desc}
              </p>

              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/ahmed-dashboard/theme/editor/customize?id=${t.id}`}
                  className="flex-1 text-center px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-md"
                >
                  Customize
                </Link>
                <Link
                  href={`/ahmed-dashboard/theme/editor?id=${t.id}`}
                  className="flex-1 text-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Live Editor
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blueprint Hint Footer */}
      <div className="mt-16 p-8 bg-orange-50 rounded-3xl border border-orange-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl font-bold">!</div>
        <div>
          <h3 className="font-bold text-lg text-orange-900">Did you know?</h3>
          <p className="text-orange-700/80 max-w-2xl">
            You can change your theme at any time. All your products and custom blocks will automatically adapt to the new design's colors and fonts.
          </p>
        </div>
      </div>
    </div>
  );
}