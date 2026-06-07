import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["en", "es", "ru", "uk"];

const cakeMeta = [
  { slug: "napoleon", pricePerPound: 14, minWeight: 2, noticeDays: 3, sortOrder: 0 },
  { slug: "medovik", pricePerPound: 13, minWeight: 2, noticeDays: 3, sortOrder: 1 },
  { slug: "smetannik", pricePerPound: 12, minWeight: 2, noticeDays: 2, sortOrder: 2 },
  { slug: "mannik", pricePerPound: 11, minWeight: 1.5, noticeDays: 2, sortOrder: 3 },
];

function loadMessages(locale) {
  return JSON.parse(readFileSync(join(root, "messages", `${locale}.json`), "utf8"));
}

const rows = cakeMeta.map((meta) => {
  const translations = {};

  for (const locale of locales) {
    const content = loadMessages(locale).cakes[meta.slug];
    translations[locale] = {
      name: content.name,
      tagline: content.tagline,
      description: content.description,
      ingredients: content.ingredients,
      servings: content.servings,
      prepTime: content.prepTime,
      storageInstructions: content.storageInstructions,
    };
  }

  const tags = loadMessages("en").cakes[meta.slug].tags;

  return {
    id: `seed-${meta.slug}`,
    slug: meta.slug,
    price_per_pound: meta.pricePerPound,
    min_weight: meta.minWeight,
    notice_days: meta.noticeDays,
    sort_order: meta.sortOrder,
    is_active: true,
    tags,
    image_paths: [
      `/images/catalog/${meta.slug}-01.webp`,
      `/images/catalog/${meta.slug}-02.webp`,
    ],
    translations,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  };
});

writeFileSync(
  join(root, "lib", "data", "cakes-seed-data.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
);
console.log("Wrote lib/data/cakes-seed-data.json");
