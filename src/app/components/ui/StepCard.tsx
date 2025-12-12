export default function StepCard({
  number, title, desc, badge,
}: { number: string; title: string; desc: string; badge: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-slate-900">{number}</div>
        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
          {badge}
        </span>
      </div>
      <div className="mt-3 text-lg font-bold">{title}</div>
      <p className="mt-2 text-slate-700 text-sm leading-relaxed">{desc}</p>
      <div className="mt-5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full w-2/3 bg-orange-600 rounded-full" />
      </div>
    </div>
  );
}
