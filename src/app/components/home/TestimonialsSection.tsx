import { testimonials } from "./data";

export default function TestimonialsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold tracking-tight">Trusted by small sellers</h2>
      <p className="mt-2 text-slate-700 max-w-2xl">
        Real feedback that builds trust and improves conversion.
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-600">{t.role}</div>
            <div className="mt-3 text-slate-800 leading-relaxed">“{t.text}”</div>
            <div className="mt-5 font-semibold">{t.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
