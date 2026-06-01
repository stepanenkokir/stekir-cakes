import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Gallery",
  description:
    "Browse photos of our custom cakes — Napoleon, Medovik, Smetannik, Mannik, and one-of-a-kind designs made for Sacramento celebrations.",
};

export default function GalleryPage() {
  return (
    <main className="bg-bg py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Our Cakes", href: "/catalog" },
            { label: "Gallery" },
          ]}
        />

        <SectionHeading
          title="Made with Love"
          subtitle="A collection of cakes we've crafted for birthdays, weddings, holidays, and everyday joy across Sacramento"
          align="left"
        />

        <GalleryGrid />
      </div>
    </main>
  );
}
