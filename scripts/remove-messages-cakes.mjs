import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["en", "es", "ru", "uk"];

for (const locale of locales) {
  const path = join(root, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  delete messages.cakes;
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`);
  console.log(`Removed cakes from messages/${locale}.json`);
}
