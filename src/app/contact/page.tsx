import ContactSection from "@/app/components/contact/ContactSection";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";

export const metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <main
      className="min-h-screen bg-white"  style={{
    background: "linear-gradient(to bottom, #f2c5a5, #ffffff)"
  }}
    >
      <Navbar />
      <ContactSection />
      <Footer />

    </main>
  );
}
