import { toLocale, type Locale } from "@/lib/i18n/locale";
import type {
  Cake,
  CakeFormInput,
  CakeRow,
  CakeTranslation,
  CakeTranslations,
} from "@/lib/data/cake-types";

export const cakeLocales: Locale[] = ["en", "es", "ru", "uk"];

function getTranslation(
  translations: CakeTranslations,
  locale: string,
): CakeTranslation {
  const loc = toLocale(locale);
  return (
    translations[loc] ??
    translations.en ?? {
      name: "",
      tagline: "",
      description: "",
      ingredients: "",
      servings: "",
      prepTime: "",
      storageInstructions: "",
    }
  );
}

export function mapRowToCake(row: CakeRow, locale: string): Cake {
  const content = getTranslation(row.translations, locale);
  const images = row.image_paths.length > 0 ? row.image_paths : [];

  return {
    id: row.id,
    slug: row.slug,
    name: content.name,
    tagline: content.tagline,
    description: content.description,
    ingredients: content.ingredients,
    servings: content.servings,
    prepTime: content.prepTime,
    storageInstructions: content.storageInstructions,
    tags: row.tags,
    pricePerPound: Number(row.price_per_pound),
    minWeight: Number(row.min_weight),
    noticeDays: row.notice_days,
    image: images[0] ?? "",
    images,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

export function mapFormInputToRow(
  input: CakeFormInput,
  id?: string,
): Omit<CakeRow, "created_at" | "updated_at"> {
  return {
    id: id ?? crypto.randomUUID(),
    slug: input.slug.trim(),
    price_per_pound: input.pricePerPound,
    min_weight: input.minWeight,
    notice_days: input.noticeDays,
    sort_order: input.sortOrder,
    is_active: input.isActive,
    tags: input.tags,
    image_paths: input.imagePaths,
    translations: input.translations,
  };
}

export function mapRowToFormInput(row: CakeRow): CakeFormInput {
  return {
    slug: row.slug,
    pricePerPound: Number(row.price_per_pound),
    minWeight: Number(row.min_weight),
    noticeDays: row.notice_days,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    tags: row.tags,
    imagePaths: row.image_paths,
    translations: row.translations,
  };
}

export function emptyTranslations(): CakeTranslations {
  const empty: CakeTranslation = {
    name: "",
    tagline: "",
    description: "",
    ingredients: "",
    servings: "",
    prepTime: "",
    storageInstructions: "",
  };

  return {
    en: { ...empty },
    es: { ...empty },
    ru: { ...empty },
    uk: { ...empty },
  };
}

export function getStartingPrice(cake: Cake): number {
  return cake.minWeight * cake.pricePerPound;
}
