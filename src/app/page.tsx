import Link from "next/link";

const faqs = [
  {
    q: "Do I need coding skills?",
    a: "No. Shoply is built for non-technical users. You pick a theme, add products, customize content, and publish.",
  },
  {
    q: "How fast can I launch?",
    a: "A basic store can be live in minutes. You can keep improving it anytime with live preview.",
  },
  {
    q: "Can I manage products and orders?",
    a: "Yes. You can add/edit/delete products and track orders from the dashboard.",
  },
];

const testimonials = [
  {
    name: "Bakery Owner",
    role: "Home-based business",
    text: "My products finally look professional online. Customers can browse and order without calling me.",
  },
  {
    name: "Mobile Shop",
    role: "Retail store",
    text: "Stock + orders became organized. I can update prices and products quickly.",
  },
  {
    name: "Food Seller",
    role: "Pre-order business",
    text: "It reduced inbox chaos. Now orders are clean and easy to manage.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-extrabold tracking-tight text-lg">
            Shoply<span className="text-orange-600">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Log in
            </Link>
            <Link
              href="/builder"
              className="text-sm px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
            >
              Start building
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative background (unique: soft “mesh” look) */}
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
                href="/builder"
                className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
              >
                Build my store
              </Link>
              <Link
                href="/demo"
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

          {/* Unique: “Live Preview” mock card */}
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

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight">Everything you need to launch</h2>
        <p className="mt-2 text-slate-700 max-w-2xl">
          Built around the core workflow: theme → customization → products → publish.

        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature
            title="Theme selection"
            desc="Pick a premade theme and get a clean layout instantly."
          />
          <Feature
            title="Easy customization"
            desc="Update logo, banner, colors, sections, and text."
          />
          <Feature
            title="Product management"
            desc="Add, edit, delete products with images, price, and description."
          />
          <Feature
            title="Customer storefront"
            desc="A responsive public store page that reflects your theme."
          />
        </div>
      </section>

      {/* How it works (inspired by “simple steps”, but unique UI) */}
      <section id="how" className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Launch Timeline</h2>
              <p className="mt-2 text-slate-700 max-w-2xl">
                A guided flow that keeps beginners confident—similar “simple steps” idea, but with our own layout and naming. :contentReference[oaicite:3]
              </p>
            </div>
            <Link
              href="/builder"
              className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              Open Builder →
            </Link>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <Step
              number="01"
              title="Create your workspace"
              desc="Make an account and name your store."
              badge="2 min"
            />
            <Step
              number="02"
              title="Design your storefront"
              desc="Choose a theme and customize sections live."
              badge="3 min"
            />
            <Step
              number="03"
              title="Add products & publish"
              desc="Upload product details, then go live instantly."
              badge="5 min"
            />
          </div>

          {/* Unique signature strip */}
          <div className="mt-10 rounded-2xl bg-white border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">What makes Shoply feel different?</h3>
                <p className="mt-2 text-slate-700 max-w-2xl">
                  The <span className="font-semibold">Store Blueprint</span> checks your homepage like a checklist:
                  trust, products, contact, and CTA—so your store looks complete, not empty.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <BlueprintPill text="✅ Hero + CTA" />
                <BlueprintPill text="✅ Featured products" />
                <BlueprintPill text="✅ Social proof" />
                <BlueprintPill text="✅ FAQ + Contact" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight">Trusted by small sellers</h2>
        <p className="mt-2 text-slate-700 max-w-2xl">
          A “real user” proof section like ZatiqEasy uses, but with different content and style. :contentReference[oaicite:4]
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

      {/* FAQ */}
      <section id="faq" className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight">FAQ</h2>
          <p className="mt-2 text-slate-700 max-w-2xl">
            Common questions—same concept as ZatiqEasy’s FAQ section. :contentReference[oaicite:5]
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 open:bg-white transition"
              >
                <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-slate-400 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-slate-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-orange-600 text-white p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">Ready to build your store?</h3>
              <p className="mt-1 text-white/90">
                Start free, customize fast, publish with confidence.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl bg-white text-orange-700 font-semibold hover:bg-orange-50 transition"
              >
                Create account
              </Link>
              <Link
                href="/builder"
                className="px-6 py-3 rounded-xl border border-white/40 font-semibold hover:bg-white/10 transition"
              >
                Open builder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-extrabold">Shoply<span className="text-orange-600">.</span></div>
            <div className="text-sm text-slate-600 mt-1">
              No-code eCommerce builder for small businesses.
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-700">
            <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
            <Link href="/about" className="hover:text-slate-900">About</Link>
            <Link href="/contact" className="hover:text-slate-900">Contact</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="mt-1 text-lg font-extrabold">{value}</div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-sm transition">
      <div className="text-sm font-semibold text-orange-700">•</div>
      <div className="mt-2 text-lg font-bold">{title}</div>
      <p className="mt-2 text-slate-700 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({
  number,
  title,
  desc,
  badge,
}: {
  number: string;
  title: string;
  desc: string;
  badge: string;
}) {
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

function BlueprintPill({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">
      {text}
    </div>
  );
}

function MiniProduct() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="h-20 bg-slate-100" />
      <div className="p-3">
        <div className="h-2 w-16 bg-slate-200 rounded" />
        <div className="mt-2 h-2 w-10 bg-slate-100 rounded" />
        <div className="mt-3 h-7 w-full bg-slate-900 rounded-lg" />
      </div>
    </div>
  );
}
