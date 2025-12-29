import Link from "next/link";
import Stat from "../ui/Stat";
import MiniProduct from "../ui/MiniProduct";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-orange-200 blur-3xl opacity-70" />
        <div className="absolute top-32 -right-24 h-96 w-96 rounded-full bg-amber-200 blur-3xl opacity-60" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-slate-200 blur-3xl opacity-60" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
            No-code store builder • Launch fast
          </p>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
            Create your online store in minutes —
            <span className="text-orange-600"> without coding</span>.
          </h1>

          <p className="mt-4 text-slate-700 text-base md:text-lg leading-relaxed">
            Choose a theme, add products, customize your content, and publish a clean storefront your customers can browse on any device.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
            >
              Build my store
            </Link>
            <Link
              href="/store/demo"
              className="inline-flex justify-center items-center px-6 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50 transition"
            >
              See a live demo
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <Stat label="Themes" value="3+" />
            <Stat label="Setup" value="~5 min" />
            <Stat label="Mobile-ready" value="100%" />
          </div>
        </div>

        {/* Live preview mock */}
        <div className="relative">
          <div className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-slate-500">Live Preview</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                shoply.store/yourbrand
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="mt-2 h-2 w-40 bg-slate-100 rounded" />
                </div>
                <div className="h-10 w-24 bg-orange-600 rounded-xl" />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <MiniProduct />
                <MiniProduct />
                <MiniProduct />
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Update theme color</div>
                  <span className="text-xs text-slate-500">Instant</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-orange-600" />
                  <span className="h-6 w-6 rounded-full bg-slate-900" />
                  <span className="h-6 w-6 rounded-full bg-emerald-600" />
                  <span className="h-6 w-6 rounded-full bg-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white border border-slate-200 shadow-sm rounded-2xl p-4 hidden md:block">
            <div className="text-xs text-slate-500">Unique feature</div>
            <div className="mt-1 font-semibold">Store Blueprint</div>
            <div className="mt-2 text-sm text-slate-700 max-w-xs">
              Shoply auto-suggests what your homepage is missing (hero, products, trust, FAQ) and guides you step-by-step.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
