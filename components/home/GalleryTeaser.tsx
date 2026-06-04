import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galleryImages } from "@/lib/data/gallery";

const teaserImages = galleryImages.slice(0, 6);

export function GalleryTeaser() {
  return (
    <section className="bg-bg py-20" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="gallery-heading"
          title="Made with Love" subtitle="A glimpse of cakes we've crafted for Sacramento celebrations" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {teaserImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-2xl ${
                index === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[320px]" : "aspect-square"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href="/catalog/gallery" variant="ghost">
            See Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
