import { galleryImagePath } from "@/lib/images";

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

export const galleryFilters: { id: GalleryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "napoleon", label: "Napoleon" },
  { id: "medovik", label: "Medovik" },
  { id: "smetannik", label: "Smetannik" },
  { id: "mannik", label: "Mannik" },
  { id: "custom", label: "Custom Designs" },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "napoleon-1",
    src: galleryImagePath("napoleon-1"),
    alt: "Layered Napoleon cake with flaky pastry and custard cream",
    category: "napoleon",
    height: "tall",
  },
  {
    id: "napoleon-2",
    src: galleryImagePath("napoleon-2"),
    alt: "Close-up of crisp Napoleon pastry layers",
    category: "napoleon",
    height: "medium",
  },
  {
    id: "napoleon-3",
    src: galleryImagePath("napoleon-3"),
    alt: "Classic mille-feuille Napoleon slices on a plate",
    category: "napoleon",
    height: "short",
  },
  {
    id: "napoleon-4",
    src: galleryImagePath("napoleon-4"),
    alt: "Golden flaky pastry dessert with powdered sugar",
    category: "napoleon",
    height: "medium",
  },
  {
    id: "medovik-1",
    src: galleryImagePath("medovik-1"),
    alt: "Honey Medovik cake with sour cream frosting",
    category: "medovik",
    height: "tall",
  },
  {
    id: "medovik-2",
    src: galleryImagePath("medovik-2"),
    alt: "Slice of layered honey sponge cake",
    category: "medovik",
    height: "medium",
  },
  {
    id: "medovik-3",
    src: galleryImagePath("medovik-3"),
    alt: "Medovik slice showing thin honey layers",
    category: "medovik",
    height: "short",
  },
  {
    id: "medovik-4",
    src: galleryImagePath("medovik-4"),
    alt: "Whole honey cake decorated with fresh flowers",
    category: "medovik",
    height: "tall",
  },
  {
    id: "smetannik-1",
    src: galleryImagePath("smetannik-1"),
    alt: "Light sour cream Smetannik cake slice",
    category: "smetannik",
    height: "medium",
  },
  {
    id: "smetannik-2",
    src: galleryImagePath("smetannik-2"),
    alt: "Fluffy sponge cake with creamy filling",
    category: "smetannik",
    height: "short",
  },
  {
    id: "smetannik-3",
    src: galleryImagePath("smetannik-3"),
    alt: "Elegant white cream cake for a celebration",
    category: "smetannik",
    height: "tall",
  },
  {
    id: "smetannik-4",
    src: galleryImagePath("smetannik-4"),
    alt: "Whole sour cream layer cake on a stand",
    category: "smetannik",
    height: "medium",
  },
  {
    id: "mannik-1",
    src: galleryImagePath("mannik-1"),
    alt: "Rustic semolina Mannik cake with golden crumb",
    category: "mannik",
    height: "medium",
  },
  {
    id: "mannik-2",
    src: galleryImagePath("mannik-2"),
    alt: "Simple home-style cake with tender texture",
    category: "mannik",
    height: "short",
  },
  {
    id: "mannik-3",
    src: galleryImagePath("mannik-3"),
    alt: "Semolina cake slice on a ceramic plate",
    category: "mannik",
    height: "tall",
  },
  {
    id: "mannik-4",
    src: galleryImagePath("mannik-4"),
    alt: "Comforting everyday cake with light glaze",
    category: "mannik",
    height: "medium",
  },
  {
    id: "custom-1",
    src: galleryImagePath("custom-1"),
    alt: "Custom tiered celebration cake with elegant piping",
    category: "custom",
    height: "tall",
  },
  {
    id: "custom-2",
    src: galleryImagePath("custom-2"),
    alt: "Birthday cake with candles and custom decoration",
    category: "custom",
    height: "medium",
  },
  {
    id: "custom-3",
    src: galleryImagePath("custom-3"),
    alt: "Custom chocolate cake topped with fresh berries",
    category: "custom",
    height: "short",
  },
  {
    id: "custom-4",
    src: galleryImagePath("custom-4"),
    alt: "Assorted custom pastries and dessert display",
    category: "custom",
    height: "medium",
  },
];

export function filterGalleryImages(filter: GalleryFilter): GalleryImage[] {
  if (filter === "all") {
    return galleryImages;
  }

  return galleryImages.filter((image) => image.category === filter);
}
