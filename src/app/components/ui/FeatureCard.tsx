export default function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-sm transition">
      <div className="text-sm font-semibold text-orange-700">•</div>
      <div className="mt-2 text-lg font-bold">{title}</div>
      <p className="mt-2 text-slate-700 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
