import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(__dirname, "image-manifest.json");
const outputRoot = path.join(rootDir, "public", "images");

async function fetchBuffer(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  for (const entry of manifest) {
    const { target, source, width = 1200 } = entry;
    const outputPath = path.join(outputRoot, target);
    await mkdir(path.dirname(outputPath), { recursive: true });

    process.stdout.write(`Fetching ${target}... `);
    const buffer = await fetchBuffer(source);
    const webp = await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    await writeFile(outputPath, webp);
    process.stdout.write("done\n");
  }

  process.stdout.write(`\nSaved ${manifest.length} images to public/images/\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
