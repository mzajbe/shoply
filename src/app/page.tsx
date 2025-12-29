import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import HeroSection from "@/app/components/home/HeroSection";
import FeaturesSection from "@/app/components/home/FeaturesSection";
import HowItWorksSection from "@/app/components/home/HowItWorksSection";
import TestimonialsSection from "@/app/components/home/TestimonialsSection";
import FaqSection from "@/app/components/home/FaqSection";

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
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
