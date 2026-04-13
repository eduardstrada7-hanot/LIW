import Hero from "@/components/home/Hero";
import WelcomeSection from "@/components/home/WelcomeSection";
import CategoryHighlights from "@/components/home/CategoryHighlights";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";
import EmailPopup from "@/components/home/EmailPopup";

export default function HomePage() {
  return (
    <>
      <EmailPopup />
      <Hero />
      <WelcomeSection />
      <CategoryHighlights />
      <Testimonials />
      <CTABanner />
    </>
  );
}
