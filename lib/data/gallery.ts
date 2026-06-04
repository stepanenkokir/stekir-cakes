import { galleryImagePath } from "@/lib/images";
import { getMessages } from "@/lib/i18n/messages";
import { toLocale } from "@/lib/i18n/locale";

export type GalleryCategory =
  | "napoleon"
  | "medovik"
  | "smetannik"
  | "mannik"
  | "custom";

export type GalleryFilter = "all" | GalleryCategory;

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  height: "short" | "medium" | "tall";
};

const galleryMeta: {
  id: string;
  category: GalleryCategory;
  height: GalleryImage["height"];
}[] = [
  { id: "napoleon-1", category: "napoleon", height: "tall" },
  { id: "napoleon-2", category: "napoleon", height: "medium" },
  { id: "napoleon-3", category: "napoleon", height: "short" },
  { id: "napoleon-4", category: "napoleon", height: "medium" },
  { id: "medovik-1", category: "medovik", height: "tall" },
  { id: "medovik-2", category: "medovik", height: "medium" },
  { id: "medovik-3", category: "medovik", height: "short" },
  { id: "medovik-4", category: "medovik", height: "tall" },
  { id: "smetannik-1", category: "smetannik", height: "medium" },
  { id: "smetannik-2", category: "smetannik", height: "short" },
  { id: "smetannik-3", category: "smetannik", height: "tall" },
  { id: "smetannik-4", category: "smetannik", height: "medium" },
  { id: "mannik-1", category: "mannik", height: "medium" },
  { id: "mannik-2", category: "mannik", height: "short" },
  { id: "mannik-3", category: "mannik", height: "tall" },
  { id: "mannik-4", category: "mannik", height: "medium" },
  { id: "custom-1", category: "custom", height: "tall" },
  { id: "custom-2", category: "custom", height: "medium" },
  { id: "custom-3", category: "custom", height: "short" },
  { id: "custom-4", category: "custom", height: "medium" },
];

export function getGalleryFilters(locale: string) {
  const f = getMessages(toLocale(locale)).galleryFilters;
  return [
    { id: "all" as const, label: f.all },
    { id: "napoleon" as const, label: f.napoleon },
    { id: "medovik" as const, label: f.medovik },
    { id: "smetannik" as const, label: f.smetannik },
    { id: "mannik" as const, label: f.mannik },
    { id: "custom" as const, label: f.custom },
  ];
}

export function getGalleryImages(locale: string): GalleryImage[] {
  const altById = Object.fromEntries(
    getMessages(toLocale(locale)).gallery.items.map((item) => [item.id, item.alt]),
  );

  return galleryMeta.map((meta) => ({
    ...meta,
    src: galleryImagePath(meta.id),
    alt: altById[meta.id] ?? meta.id,
  }));
}

export function filterGalleryImages(
  filter: GalleryFilter,
  locale: string,
): GalleryImage[] {
  const images = getGalleryImages(locale);
  if (filter === "all") {
    return images;
  }
  return images.filter((image) => image.category === filter);
}

/** @deprecated */
export const galleryFilters = getGalleryFilters("en");
export const galleryImages = getGalleryImages("en");
