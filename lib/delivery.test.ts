import { describe, expect, it } from "vitest";
import {
  calculateDeliveryFee,
  DELIVERY_FEE_FAR,
  DELIVERY_FEE_NEAR,
} from "@/lib/delivery";

describe("calculateDeliveryFee", () => {
  it("returns near tier for an exact near ZIP code", () => {
    const result = calculateDeliveryFee("95608");

    expect(result.fee).toBe(DELIVERY_FEE_NEAR);
    expect(result.tier).toBe("near");
    expect(result.message).toContain("$10");
  });

  it("returns near tier for a near ZIP prefix", () => {
    const result = calculateDeliveryFee("95899");

    expect(result.fee).toBe(DELIVERY_FEE_NEAR);
    expect(result.tier).toBe("near");
  });

  it("returns far tier for far ZIP prefixes", () => {
    const result = calculateDeliveryFee("95901");

    expect(result.fee).toBe(DELIVERY_FEE_FAR);
    expect(result.tier).toBe("far");
    expect(result.message).toContain("$20");
  });

  it("returns far tier for other 95-prefix ZIP codes", () => {
    const result = calculateDeliveryFee("95123");

    expect(result.fee).toBe(DELIVERY_FEE_FAR);
    expect(result.tier).toBe("far");
  });

  it("returns near tier with validation message for invalid ZIP", () => {
    const result = calculateDeliveryFee("abc");

    expect(result.fee).toBe(DELIVERY_FEE_NEAR);
    expect(result.tier).toBe("near");
    expect(result.message).toContain("valid ZIP");
  });

  it("returns unsupported tier for ZIPs outside the delivery zone", () => {
    const result = calculateDeliveryFee("90210");

    expect(result.fee).toBe(0);
    expect(result.tier).toBe("unsupported");
    expect(result.message).toContain("outside");
  });

  it("trims whitespace from the ZIP input", () => {
    const result = calculateDeliveryFee("  95608  ");

    expect(result.fee).toBe(DELIVERY_FEE_NEAR);
    expect(result.tier).toBe("near");
  });
});
