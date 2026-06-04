# Image assets workflow

Place originals here (optional). Served files live in `public/images/`.

## Folder map

| Folder | Data file | Naming |
|--------|-----------|--------|
| `public/images/site/` | Hero components use `siteImages` in `lib/images.ts` | `home-hero.webp`, `about-hero.webp`, `baker-portrait.webp` |
| `public/images/catalog/` | `lib/data/cakes.ts` | `{slug}-01.webp`, `{slug}-02.webp` |
| `public/images/gallery/` | `lib/data/gallery.ts` | `{id}.webp` (must match gallery `id`) |
| `public/images/reviews/` | `lib/data/reviews.ts` | `review-{id}.webp` |

## Replace an existing photo

1. Export as WebP (~1200px wide for catalog/gallery, ~1600px for heroes).
2. Overwrite the file in `public/images/...` **keeping the same filename**.
3. Run `npm run dev` and check the page.
4. Commit.

## Add a new gallery photo

1. Add `public/images/gallery/custom-5.webp` (example).
2. Add an entry to `galleryImages` in `lib/data/gallery.ts` with `id: "custom-5"`.
3. Commit.

## Re-download placeholders from stock URLs

```bash
npm run images:fetch
```

Uses `scripts/image-manifest.json` as the source list. Update the manifest when adding new targets.
