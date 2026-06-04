"use client";

import { useTranslations } from "next-intl";

type CakeTagsProps = {
  tags: string[];
};

export function CakeTags({ tags }: CakeTagsProps) {
  const t = useTranslations("cakeTags");

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-border bg-surface px-3 py-1 font-accent text-base text-primary-dark"
        >
          {t(tag as never)}
        </li>
      ))}
    </ul>
  );
}
