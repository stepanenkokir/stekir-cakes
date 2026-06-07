import type { Locale } from "@/lib/i18n/locale";

export type CakeTranslation = {
  name: string;
  tagline: string;
  description: string;
  ingredients: string;
  servings: string;
  prepTime: string;
  storageInstructions: string;
};

export type CakeTranslations = Partial<Record<Locale, CakeTranslation>>;

export type CakeRow = {
  id: string;
  slug: string;
  price_per_pound: number;
  min_weight: number;
  notice_days: number;
  sort_order: number;
  is_active: boolean;
  tags: string[];
  image_paths: string[];
  translations: CakeTranslations;
  created_at: string;
  updated_at: string;
};

export type Cake = {
  id: string;
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
  isActive: boolean;
  sortOrder: number;
};

export type CakePricing = {
  slug: string;
  pricePerPound: number;
  minWeight: number;
};

export type CakeFormInput = {
  slug: string;
  pricePerPound: number;
  minWeight: number;
  noticeDays: number;
  sortOrder: number;
  isActive: boolean;
  tags: string[];
  imagePaths: string[];
  translations: CakeTranslations;
};
