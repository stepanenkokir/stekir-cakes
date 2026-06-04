/** Delivery fee tiers per bakery policy (Carmichael 95608 origin, up to 30 miles). */
export const DELIVERY_FEE_NEAR = 10;
export const DELIVERY_FEE_FAR = 20;

/** ZIP prefixes and full codes within ~15 miles of Carmichael (95608). */
const NEAR_ZIP_PREFIXES = ["956", "958", "957", "942"] as const;

const NEAR_ZIP_CODES = new Set([
  "95608",
  "95609",
  "95610",
  "95621",
  "95624",
  "95628",
  "95630",
  "95655",
  "95660",
  "95661",
  "95662",
  "95670",
  "95673",
  "95814",
  "95815",
  "95816",
  "95817",
  "95818",
  "95819",
  "95820",
  "95821",
  "95822",
  "95823",
  "95824",
  "95825",
  "95826",
  "95827",
  "95828",
  "95829",
  "95831",
  "95832",
  "95833",
  "95834",
  "95835",
  "95838",
  "95841",
  "95842",
  "95864",
]);

/** ZIP prefixes likely within 15–30 miles of the delivery hub. */
const FAR_ZIP_PREFIXES = ["959", "961"] as const;

export type DeliveryFeeResult = {
  fee: number;
  tier: "near" | "far" | "unsupported";
  message: string;
};

export function calculateDeliveryFee(zip: string): DeliveryFeeResult {
  const normalized = zip.trim();

  if (!/^\d{5}$/.test(normalized)) {
    return {
      fee: DELIVERY_FEE_NEAR,
      tier: "near",
      message: "Enter a valid ZIP to confirm delivery fee.",
    };
  }

  if (NEAR_ZIP_CODES.has(normalized)) {
    return {
      fee: DELIVERY_FEE_NEAR,
      tier: "near",
      message: "Delivery within 15 miles: $10",
    };
  }

  if (NEAR_ZIP_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return {
      fee: DELIVERY_FEE_NEAR,
      tier: "near",
      message: "Delivery within 15 miles: $10",
    };
  }

  if (FAR_ZIP_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return {
      fee: DELIVERY_FEE_FAR,
      tier: "far",
      message: "Delivery 15–30 miles: $20",
    };
  }

  if (normalized.startsWith("95")) {
    return {
      fee: DELIVERY_FEE_FAR,
      tier: "far",
      message: "Delivery 15–30 miles: $20",
    };
  }

  return {
    fee: 0,
    tier: "unsupported",
    message: "This ZIP may be outside our 30-mile delivery zone. Contact us to confirm.",
  };
}
