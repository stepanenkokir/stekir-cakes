"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency, formatDeliveryDate } from "@/lib/cart/format";
import type { CartItem as CartItemType } from "@/lib/cart/types";

type CartItemProps = {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
};

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-text">
              <Link
                href={`/catalog/${item.slug}`}
                className="transition-colors hover:text-primary-dark"
              >
                {item.name}
              </Link>
            </h2>
            <p className="font-display text-lg font-semibold text-primary-dark sm:hidden">
              {formatCurrency(lineTotal)}
            </p>
          </div>

          <ul className="mt-3 space-y-1 text-sm text-text-muted">
            <li>
              {item.weightLbs} lbs
              {item.tiers > 1 ? ` · ${item.tiers} tiers` : ""}
            </li>
            <li>Delivery: {formatDeliveryDate(item.deliveryDate)}</li>
            {item.inscription ? (
              <li>
                Inscription: <span className="text-text">&ldquo;{item.inscription}&rdquo;</span>
              </li>
            ) : null}
            {item.decorationNotes ? (
              <li className="line-clamp-2">Notes: {item.decorationNotes}</li>
            ) : null}
          </ul>

          <p className="mt-2 text-xs text-text-muted">
            {formatCurrency(item.unitPrice)} each
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="hidden font-display text-lg font-semibold text-primary-dark sm:block">
            {formatCurrency(lineTotal)}
          </p>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center rounded-full border border-border bg-bg"
              role="group"
              aria-label={`Quantity for ${item.name}`}
            >
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="rounded-l-full p-2 text-text transition-colors hover:bg-surface hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span
                className="min-w-[2rem] px-2 text-center text-sm font-medium tabular-nums"
                aria-live="polite"
              >
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="rounded-r-full p-2 text-text transition-colors hover:bg-surface hover:text-primary-dark"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="rounded-full p-2 text-text-muted transition-colors hover:bg-bg hover:text-red-700"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
