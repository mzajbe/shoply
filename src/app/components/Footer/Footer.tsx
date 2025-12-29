import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="font-extrabold">
            Shoply<span className="text-orange-600">.</span>
          </div>
          <div className="text-sm text-slate-600 mt-1">
            No-code eCommerce builder for small businesses.
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-700">
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
