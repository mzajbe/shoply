import Link from "next/link";
import LogoutButton from "@/app/components/auth/LogoutButton";

const themes = [
  {
    id: "minimal",
    name: "Minimal",
    desc: "A clean, whitespace-focused layout perfect for high-end boutique brands.",
    accent: "bg-indigo-500",
    previewImage: "/themes/minimal.png",
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Bold typography and high-contrast elements for storytelling and impact.",
    accent: "bg-rose-500",
    previewImage: "/themes/modern.png",
  },
  {
    id: "classic",
    name: "Classic",
    desc: "Traditional e-commerce structure with clear navigation and trust-focused blocks.",
    accent: "bg-emerald-500",
    previewImage: "/themes/classic.png",
  },
  {
    id: "bold",
    name: "Bold & Dark",
    desc: "High energy, dark themes with neon accents for tech and gaming brands.",
    accent: "bg-yellow-400",
    previewImage: "/themes/dark.png",
  },
  {
    id: "elegant",
    name: "Elegant",
    desc: "Serene colors and serif typography for jewelry, fashion, and luxury goods.",
    accent: "bg-amber-700",
    previewImage: "/themes/elegant.png",
  },
  {
    id: "tech",
    name: "Tech-Forward",
    desc: "Sleek, futuristic design with grid layouts and glassmorphism elements.",
    accent: "bg-cyan-500",
    previewImage: "/themes/tech.png",
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
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            📊 View Dashboard
          </Link>

          <LogoutButton className="inline-flex items-center px-6 py-3 border border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-50 transition-all active:scale-95 shadow-sm" />

          {/* Quick Action: Start from Scratch */}
          <Link
            href="/dashboard/ahmed-dashboard/theme/editor"
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
            <div className="h-56 relative flex items-center justify-center bg-slate-50 overflow-hidden" aria-hidden="true">
              <img
                src={t.previewImage}
                alt={t.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">Explore {t.name}</span>
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
                  href={`/your-store-name?id=${t.id}`}
                  className="flex-1 text-center px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-md"
                >
                  Live Preview
                </Link>
                <Link
                  href={`/dashboard/ahmed-dashboard/theme/editor?id=${t.id}&new=true`}
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
