import { CtaBanner } from "@/components/home/CtaBanner";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { OurCakesSection } from "@/components/home/OurCakesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { TrustBar } from "@/components/home/TrustBar";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <OurCakesSection />
      <HowItWorksSection />
      <GalleryTeaser />
      <ReviewsSection />
      <CtaBanner />
    </main>
  );
}
