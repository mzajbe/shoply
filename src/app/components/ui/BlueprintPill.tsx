export default function BlueprintPill({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">
      {text}
    </div>
  );
}
