import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const en = JSON.parse(readFileSync(join(root, "messages", "en.json"), "utf8"));

// Deep merge helper: target gets source values where provided
function deepMerge(base, patch) {
  if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
    return patch ?? base;
  }
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    out[key] = deepMerge(base?.[key], patch[key]);
  }
  return out;
}

writeFileSync(join(root, "messages", "es.json"), JSON.stringify(en, null, 2));
writeFileSync(join(root, "messages", "ru.json"), JSON.stringify(en, null, 2));
writeFileSync(join(root, "messages", "uk.json"), JSON.stringify(en, null, 2));
console.log("Created es.json, ru.json, uk.json from en (to be patched)");
