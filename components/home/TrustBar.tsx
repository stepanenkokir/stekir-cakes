import { Cake, Heart, Leaf, Truck } from "lucide-react";

const trustItems = [
  {
    icon: Leaf,
    label: "All-natural ingredients",
  },
  {
    icon: Cake,
    label: "Any size, any occasion",
  },
  {
    icon: Truck,
    label: "Local delivery",
  },
  {
    icon: Heart,
    label: "Made from scratch",
  },
];

export function TrustBar() {
  return (
    <section
      id="trust-bar"
      className="border-y border-border bg-white py-10"
      aria-label="Why customers trust us"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm font-medium leading-snug text-text sm:text-base">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
