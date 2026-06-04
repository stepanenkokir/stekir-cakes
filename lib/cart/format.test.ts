import { describe, expect, it } from "vitest";
import { formatCurrency, formatDeliveryDate } from "@/lib/cart/format";

describe("formatCurrency", () => {
  it("formats USD for English locale", () => {
    expect(formatCurrency(28, "en")).toBe("$28.00");
  });

  it("formats USD for Russian locale", () => {
    const formatted = formatCurrency(28, "ru");
    expect(formatted).toContain("28");
    expect(formatted).toMatch(/[\$US]|USD/);
  });

  it("falls back to English for unknown locale", () => {
    expect(formatCurrency(10, "xx")).toBe("$10.00");
  });
});

describe("formatDeliveryDate", () => {
  it("formats a date for English locale", () => {
    const formatted = formatDeliveryDate("2026-06-10", "en");

    expect(formatted).toContain("2026");
    expect(formatted).toContain("Jun");
    expect(formatted).toContain("10");
  });

  it("falls back to English for unknown locale", () => {
    const formatted = formatDeliveryDate("2026-06-10", "invalid");

    expect(formatted).toContain("2026");
    expect(formatted).toContain("Jun");
  });
});
