import { catalogImagePath } from "@/lib/images";

export type Cake = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string;
  pricePerPound: number;
  minWeight: number;
  servings: string;
  prepTime: string;
  noticeDays: number;
  image: string;
  images: string[];
  storageInstructions: string;
  tags: string[];
};

export const cakes: Cake[] = [
  {
    slug: "napoleon",
    name: "Napoleon",
    tagline: "Layers of tradition, a lifetime of flavor",
    description:
      "Our Napoleon is a true classic — dozens of paper-thin, flaky pastry layers alternating with rich homemade custard cream. Every bite is a balance of crunch and silk. Perfect for birthdays, anniversaries, and any moment worth celebrating.",
    ingredients: "Butter, flour, eggs, whole milk, sugar, vanilla bean",
    pricePerPound: 14,
    minWeight: 2,
    servings: "1 lb feeds approx. 3–4 people",
    prepTime: "3 days notice required",
    noticeDays: 3,
    image: catalogImagePath("napoleon", 1),
    images: [
      catalogImagePath("napoleon", 1),
      catalogImagePath("napoleon", 2),
    ],
    storageInstructions:
      "Refrigerate in the box. Best consumed within 3 days. Napoleon improves with 1 day of refrigeration.",
    tags: ["Birthday", "Anniversary", "Most Popular"],
  },
  {
    slug: "medovik",
    name: "Medovik",
    tagline: "Honey-kissed layers, cloud-soft cream",
    description:
      "Medovik is our most beloved cake — thin honey sponge layers soaked in time, paired with a velvety sour cream frosting. Its fragrant sweetness and melt-in-your-mouth texture have made it a family favorite across generations.",
    ingredients: "Honey, butter, eggs, flour, sour cream, sugar",
    pricePerPound: 13,
    minWeight: 2,
    servings: "1 lb feeds approx. 3–4 people",
    prepTime: "3 days notice required",
    noticeDays: 3,
    image: catalogImagePath("medovik", 1),
    images: [
      catalogImagePath("medovik", 1),
      catalogImagePath("medovik", 2),
    ],
    storageInstructions:
      "Refrigerate in the box. Best consumed within 3 days for optimal freshness and texture.",
    tags: ["Birthday", "Holiday", "Fan Favorite"],
  },
  {
    slug: "smetannik",
    name: "Smetannik",
    tagline: "Light as a cloud, warm as home",
    description:
      "Smetannik is the cake your grandmother would have made on a Sunday afternoon. Fluffy sour cream sponge layers with a smooth, tangy cream — this cake is lighter than it looks and impossible to stop eating.",
    ingredients: "Sour cream, eggs, flour, sugar, butter, vanilla",
    pricePerPound: 12,
    minWeight: 2,
    servings: "1 lb feeds approx. 3–4 people",
    prepTime: "2 days notice required",
    noticeDays: 2,
    image: catalogImagePath("smetannik", 1),
    images: [
      catalogImagePath("smetannik", 1),
      catalogImagePath("smetannik", 2),
    ],
    storageInstructions:
      "Refrigerate in the box. Best consumed within 3 days. Let sit at room temperature for 15 minutes before serving.",
    tags: ["Everyday", "Birthday", "Kids"],
  },
  {
    slug: "mannik",
    name: "Mannik",
    tagline: "Simple, tender, and perfectly satisfying",
    description:
      "Our Mannik is a semolina-based cake with a uniquely dense yet tender crumb — no flour, just coarsely ground semolina giving it a rustic, comforting texture. Naturally dairy-free adaptable, great for kids and those who prefer a less sweet dessert.",
    ingredients: "Semolina, eggs, sour cream, sugar, butter, baking soda",
    pricePerPound: 11,
    minWeight: 1.5,
    servings: "1 lb feeds approx. 3–4 people",
    prepTime: "2 days notice required",
    noticeDays: 2,
    image: catalogImagePath("mannik", 1),
    images: [
      catalogImagePath("mannik", 1),
      catalogImagePath("mannik", 2),
    ],
    storageInstructions:
      "Store covered at room temperature for up to 2 days, or refrigerate for up to 4 days. Best enjoyed within 2 days.",
    tags: ["Kids", "Everyday", "Gluten-Sensitive Option"],
  },
];

export function getStartingPrice(cake: Cake): number {
  return cake.minWeight * cake.pricePerPound;
}

export function getCakeBySlug(slug: string): Cake | undefined {
  return cakes.find((cake) => cake.slug === slug);
}

export function getRelatedCakes(slug: string): Cake[] {
  return cakes.filter((cake) => cake.slug !== slug);
}
