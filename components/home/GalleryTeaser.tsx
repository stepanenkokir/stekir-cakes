import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80",
    alt: "Decorated celebration cake with fresh flowers",
  },
  {
    src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    alt: "Slice of layered honey cake on a plate",
  },
  {
    src: "https://images.unsplash.com/photo-1551024503-8b383718c079?auto=format&fit=crop&w=600&q=80",
    alt: "Elegant tiered wedding-style cake",
  },
  {
    src: "https://images.unsplash.com/photo-1586985289682-104a381d1362?auto=format&fit=crop&w=600&q=80",
    alt: "Chocolate dessert with berries",
  },
  {
    src: "https://images.unsplash.com/photo-1535254931724-32c999a86e03?auto=format&fit=crop&w=600&q=80",
    alt: "Birthday cake with candles",
  },
  {
    src: "https://images.unsplash.com/photo-1519869325930-281384150ba7?auto=format&fit=crop&w=600&q=80",
    alt: "Pastry display with assorted desserts",
  },
];

export function GalleryTeaser() {
  return (
    <section className="bg-bg py-20" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="gallery-heading"
          title="Made with Love" subtitle="A glimpse of cakes we've crafted for Sacramento celebrations" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryImages.map((image, index) => (
            <div
              key={image.src}
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
