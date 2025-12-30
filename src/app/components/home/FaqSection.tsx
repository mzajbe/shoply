import Link from "next/link";
import { faqs } from "./data";

export default function FaqSection() {
  return (
    <section id="faq" className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight">FAQ</h2>
        <p className="mt-2 text-slate-700 max-w-2xl">
          Common questions from new sellers.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {faqs.map((f) => (
            <details key={f.q} className="group faq-item rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 open:bg-white" >
                <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-slate-400 group-open:rotate-45 transition-transform duration-300">
                    +
                  </span>
                </summary>

                {/* animated content */}
                <div className="faq-content">
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              </details>

          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-orange-600 text-white p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Ready to build your store?</h3>
            <p className="mt-1 text-white/90">Start free, customize fast, publish with confidence.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/register"
              className="px-6 py-3 rounded-xl bg-white text-orange-700 font-semibold hover:bg-orange-50 transition"
            >
              Create account
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl border border-white/40 font-semibold hover:bg-white/10 transition"
            >
              Open builder
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
