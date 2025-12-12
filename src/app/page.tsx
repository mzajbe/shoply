import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Build Your Online Store <br /> Without Coding
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Shoply is a no-code website builder that helps small businesses
          create and launch their own e-commerce store in minutes.
        </p>

        <div className="flex gap-4">
          <Link
            href="/builder"
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>

          <Link
            href="/demo"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Theme Selection"
            description="Choose from multiple pre-made themes with one click."
          />
          <FeatureCard
            title="Easy Customization"
            description="Edit text, colors, logo, and layout without any coding."
          />
          <FeatureCard
            title="Product Management"
            description="Add, edit, or delete products with images and prices."
          />
          <FeatureCard
            title="Live Storefront"
            description="Instantly publish a responsive customer-facing store."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Selling Online?
        </h2>
        <p className="mb-6 text-gray-700">
          Create your store today and grow your business digitally.
        </p>

        <Link
          href="/signup"
          className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Create Your Store
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Shoply. All rights reserved.
      </footer>
    </main>
  );
}

/* Feature Card Component */
function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
