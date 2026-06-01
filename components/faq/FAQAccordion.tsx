"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { FaqCategory } from "@/lib/data/faq";

type FAQAccordionProps = {
  categories: FaqCategory[];
};

export function FAQAccordion({ categories }: FAQAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <section key={category.id} aria-labelledby={`${baseId}-${category.id}-heading`}>
          <h2
            id={`${baseId}-${category.id}-heading`}
            className="font-display text-2xl font-semibold text-text sm:text-3xl"
          >
            {category.title}
          </h2>

          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            {category.items.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `${baseId}-${item.id}-panel`;
              const buttonId = `${baseId}-${item.id}-button`;

              return (
                <div key={item.id}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-bg/60 sm:px-6"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                    >
                      <span className="font-medium text-text sm:text-lg">{item.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-primary transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-base leading-relaxed text-text-muted sm:px-6 sm:pb-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
