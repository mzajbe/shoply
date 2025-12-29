import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-16">
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Get In Touch
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          We’ll create high-quality backlinks content and build at least
          40 high-authority links to each asset, paving the way to grow
          your rankings and improve brand visibility.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}
