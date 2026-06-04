export type OccasionFilter =
  | "all"
  | "birthday"
  | "anniversary"
  | "holiday"
  | "everyday";

export const occasionFilters: { id: OccasionFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "holiday", label: "Holiday" },
  { id: "everyday", label: "Everyday" },
];

export function cakeMatchesOccasion(
  tags: string[],
  filter: OccasionFilter,
): boolean {
  if (filter === "all") {
    return true;
  }

  const needle = filter.charAt(0).toUpperCase() + filter.slice(1);
  return tags.some((tag) => tag.toLowerCase() === needle.toLowerCase());
}
