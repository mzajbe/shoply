import FeatureCard from "../ui/FeatureCard";

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold tracking-tight">Everything you need to launch</h2>
      <p className="mt-2 text-slate-700 max-w-2xl">
        Built around the core workflow: theme → customization → products → publish.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard title="Theme selection" desc="Pick a premade theme and get a clean layout instantly." />
        <FeatureCard title="Easy customization" desc="Update logo, banner, colors, sections, and text." />
        <FeatureCard title="Product management" desc="Add, edit, delete products with images, price, and description." />
        <FeatureCard title="Customer storefront" desc="A responsive public store page that reflects your theme." />
      </div>
    </section>
  );
}
