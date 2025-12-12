import Link from "next/link";
import StepCard from "../ui/StepCard";
import BlueprintPill from "../ui/BlueprintPill";

export default function HowItWorksSection() {
  return (
    <section id="how" className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Launch Timeline</h2>
            <p className="mt-2 text-slate-700 max-w-2xl">
              A guided flow that keeps beginners confident—with our own layout and naming.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Open Builder →
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <StepCard number="01" title="Create your workspace" desc="Make an account and name your store." badge="2 min" />
          <StepCard number="02" title="Design your storefront" desc="Choose a theme and customize sections live." badge="3 min" />
          <StepCard number="03" title="Add products & publish" desc="Upload product details, then go live instantly." badge="5 min" />
        </div>

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
  );
}
