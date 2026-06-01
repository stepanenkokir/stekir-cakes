import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { CertificationsSection } from "@/components/about/CertificationsSection";
import { MeetTheBakerSection } from "@/components/about/MeetTheBakerSection";
import { OurStorySection } from "@/components/about/OurStorySection";
import { WhyChooseUsSection } from "@/components/about/WhyChooseUsSection";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet SteKir Cakes — a Sacramento home bakery bringing Eastern European family recipes to California celebrations. Fresh, custom cakes made to order.",
  openGraph: {
    title: "About SteKir Cakes",
    description:
      "Our story, our baker, and our commitment to fresh homemade cakes in Sacramento.",
  },
};

export default function AboutPage() {
  return (
    <main className="bg-bg">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Our Cakes", href: "/catalog" },
            { label: "About" },
          ]}
        />
      </div>

      <AboutHero />
      <OurStorySection />
      <WhyChooseUsSection />
      <MeetTheBakerSection />
      <CertificationsSection />
    </main>
  );
}
