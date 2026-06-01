import { CakeSlice } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyCart() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface shadow-card"
        aria-hidden="true"
      >
        <CakeSlice className="h-12 w-12 text-accent" strokeWidth={1.25} />
      </div>
      <h2 className="font-display text-2xl font-semibold text-text">No cakes yet</h2>
      <p className="mt-3 text-text-muted">
        Browse our catalog and customize a cake made fresh to order for your celebration.
      </p>
      <Button href="/catalog" className="mt-8">
        Browse Our Cakes
      </Button>
    </div>
  );
}
