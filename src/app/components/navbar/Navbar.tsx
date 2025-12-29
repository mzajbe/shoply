import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight text-lg text-black">
          Shoply<span className="text-orange-600">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#faq" className="hover:text-slate-900">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm px-4 py-2 rounded-lg text-black hover:bg-slate-100 transition"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="text-sm px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
          >
            Start building
          </Link>
        </div>
      </div>
    </header>
  );
}
