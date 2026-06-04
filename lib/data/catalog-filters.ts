import { getMessages } from "@/lib/i18n/messages";
import { toLocale } from "@/lib/i18n/locale";

export type OccasionFilter =
  | "all"
  | "birthday"
  | "anniversary"
  | "holiday"
  | "everyday";

export function getOccasionFilters(locale: string) {
  const f = getMessages(toLocale(locale)).catalogFilters;
  return [
    { id: "all" as const, label: f.all },
    { id: "birthday" as const, label: f.birthday },
    { id: "anniversary" as const, label: f.anniversary },
    { id: "holiday" as const, label: f.holiday },
    { id: "everyday" as const, label: f.everyday },
  ];
}

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

/** @deprecated */
export const occasionFilters = getOccasionFilters("en");
