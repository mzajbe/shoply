import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import HeroSection from "@/app/components/home/HeroSection";
import FeaturesSection from "@/app/components/home/FeaturesSection";
import HowItWorksSection from "@/app/components/home/HowItWorksSection";
import TestimonialsSection from "@/app/components/home/TestimonialsSection";
import FaqSection from "@/app/components/home/FaqSection";

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
