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
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    alt: "Layered Napoleon cake with flaky pastry and custard cream",
    category: "napoleon",
    height: "tall",
  },
  {
    id: "napoleon-2",
    src: "https://images.unsplash.com/photo-1621303837174-897873a273d1?auto=format&fit=crop&w=800&q=80",
    alt: "Close-up of crisp Napoleon pastry layers",
    category: "napoleon",
    height: "medium",
  },
  {
    id: "napoleon-3",
    src: "https://images.unsplash.com/photo-1535141192574-bf49d59f1f3c?auto=format&fit=crop&w=800&q=80",
    alt: "Classic mille-feuille Napoleon slices on a plate",
    category: "napoleon",
    height: "short",
  },
  {
    id: "napoleon-4",
    src: "https://images.unsplash.com/photo-1541782814451-732b08046da5?auto=format&fit=crop&w=800&q=80",
    alt: "Golden flaky pastry dessert with powdered sugar",
    category: "napoleon",
    height: "medium",
  },
  {
    id: "medovik-1",
    src: "https://images.unsplash.com/photo-1725275648140-5326d32dbe21?auto=format&fit=crop&w=800&q=80",
    alt: "Honey Medovik cake with sour cream frosting",
    category: "medovik",
    height: "tall",
  },
  {
    id: "medovik-2",
    src: "https://images.unsplash.com/photo-1624000961428-eeece184988b?auto=format&fit=crop&w=800&q=80",
    alt: "Slice of layered honey sponge cake",
    category: "medovik",
    height: "medium",
  },
  {
    id: "medovik-3",
    src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    alt: "Medovik slice showing thin honey layers",
    category: "medovik",
    height: "short",
  },
  {
    id: "medovik-4",
    src: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
    alt: "Whole honey cake decorated with fresh flowers",
    category: "medovik",
    height: "tall",
  },
  {
    id: "smetannik-1",
    src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    alt: "Light sour cream Smetannik cake slice",
    category: "smetannik",
    height: "medium",
  },
  {
    id: "smetannik-2",
    src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
    alt: "Fluffy sponge cake with creamy filling",
    category: "smetannik",
    height: "short",
  },
  {
    id: "smetannik-3",
    src: "https://images.unsplash.com/photo-1571116862879-d2f6b9c3e284?auto=format&fit=crop&w=800&q=80",
    alt: "Elegant white cream cake for a celebration",
    category: "smetannik",
    height: "tall",
  },
  {
    id: "smetannik-4",
    src: "https://images.unsplash.com/photo-1607478903553-83fe52d8aebb?auto=format&fit=crop&w=800&q=80",
    alt: "Whole sour cream layer cake on a stand",
    category: "smetannik",
    height: "medium",
  },
  {
    id: "mannik-1",
    src: "https://images.unsplash.com/photo-1517433679644-89f4ca4fd2f6?auto=format&fit=crop&w=800&q=80",
    alt: "Rustic semolina Mannik cake with golden crumb",
    category: "mannik",
    height: "medium",
  },
  {
    id: "mannik-2",
    src: "https://images.unsplash.com/photo-1562440769-5460d228984a?auto=format&fit=crop&w=800&q=80",
    alt: "Simple home-style cake with tender texture",
    category: "mannik",
    height: "short",
  },
  {
    id: "mannik-3",
    src: "https://images.unsplash.com/photo-158766817927-7c5c7a5a0e8f?auto=format&fit=crop&w=800&q=80",
    alt: "Semolina cake slice on a ceramic plate",
    category: "mannik",
    height: "tall",
  },
  {
    id: "mannik-4",
    src: "https://images.unsplash.com/photo-1614700138105-70f29bbe302d?auto=format&fit=crop&w=800&q=80",
    alt: "Comforting everyday cake with light glaze",
    category: "mannik",
    height: "medium",
  },
  {
    id: "custom-1",
    src: "https://images.unsplash.com/photo-1551024503-8b383718c079?auto=format&fit=crop&w=800&q=80",
    alt: "Custom tiered celebration cake with elegant piping",
    category: "custom",
    height: "tall",
  },
  {
    id: "custom-2",
    src: "https://images.unsplash.com/photo-1535254931724-32c999a86e03?auto=format&fit=crop&w=800&q=80",
    alt: "Birthday cake with candles and custom decoration",
    category: "custom",
    height: "medium",
  },
  {
    id: "custom-3",
    src: "https://images.unsplash.com/photo-1586985289682-104a381d1362?auto=format&fit=crop&w=800&q=80",
    alt: "Custom chocolate cake topped with fresh berries",
    category: "custom",
    height: "short",
  },
  {
    id: "custom-4",
    src: "https://images.unsplash.com/photo-1519869325930-281384150ba7?auto=format&fit=crop&w=800&q=80",
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
