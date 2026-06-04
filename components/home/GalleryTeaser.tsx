import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGalleryImages } from "@/lib/data/gallery";

export async function GalleryTeaser() {
  const locale = await getLocale();
  const t = await getTranslations("home.galleryTeaser");
  const tc = await getTranslations("common");
  const teaserImages = getGalleryImages(locale).slice(0, 6);

  return (
    <section className="bg-bg py-20" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="gallery-heading" title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {teaserImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-2xl ${
                index === 0
                  ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[320px]"
                  : "aspect-square"
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
            {tc("seeFullGallery")}
          </Button>
        </div>
      </div>
    </section>
  );
}
