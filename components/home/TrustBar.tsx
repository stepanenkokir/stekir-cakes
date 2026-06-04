import { Cake, Heart, Leaf, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";

const trustIcons = [Leaf, Cake, Truck, Heart] as const;

export async function TrustBar() {
  const t = await getTranslations("home.trust");
  const items = t.raw("items") as string[];

  return (
    <section
      id="trust-bar"
      className="border-y border-border bg-white py-10"
      aria-label={t("aria")}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {items.map((label, index) => {
          const Icon = trustIcons[index] ?? Heart;

          return (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-medium leading-snug text-text sm:text-base">
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
