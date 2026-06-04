export const IMAGE_ROOT = "/images";

export function imagePath(...segments: string[]): string {
  return `${IMAGE_ROOT}/${segments.join("/")}`;
}

export const siteImages = {
  homeHero: imagePath("site", "home-hero.webp"),
  aboutHero: imagePath("site", "about-hero.webp"),
  bakerPortrait: imagePath("site", "baker-portrait.webp"),
} as const;

export function galleryImagePath(id: string): string {
  return imagePath("gallery", `${id}.webp`);
}

export function catalogImagePath(slug: string, index: number): string {
  return imagePath("catalog", `${slug}-${String(index).padStart(2, "0")}.webp`);
}

export function reviewImagePath(reviewId: string): string {
  return imagePath("reviews", `review-${reviewId}.webp`);
}
