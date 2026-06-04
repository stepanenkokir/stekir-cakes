import { beforeEach, describe, expect, it } from "vitest";
import type { CartItem } from "@/lib/cart/types";
import { readCartFromStorage, writeCartToStorage } from "@/lib/cart/storage";

const sampleItem: CartItem = {
  id: "item-1",
  slug: "napoleon",
  name: "Napoleon",
  weightLbs: 2,
  tiers: 1,
  inscription: "",
  decorationNotes: "",
  deliveryDate: "2026-06-10",
  unitPrice: 28,
  quantity: 1,
};

describe("cart storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty array when storage is empty", () => {
    expect(readCartFromStorage()).toEqual([]);
  });

  it("returns an empty array for invalid JSON", () => {
    localStorage.setItem("stekir-cart", "not-json");

    expect(readCartFromStorage()).toEqual([]);
  });

  it("returns an empty array when stored value is not an array", () => {
    localStorage.setItem("stekir-cart", JSON.stringify({ items: [] }));

    expect(readCartFromStorage()).toEqual([]);
  });

  it("persists and reads cart items", () => {
    writeCartToStorage([sampleItem]);

    expect(readCartFromStorage()).toEqual([sampleItem]);
  });
});
