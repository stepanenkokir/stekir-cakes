import { BAKERY_PHONE, BAKERY_PHONE_DISPLAY } from "@/lib/constants";

export const BAKERY_EMAIL = "hello@stekircakes.com";
export const BAKERY_INSTAGRAM_HANDLE = "@stekircakes";
export const BAKERY_INSTAGRAM_URL = "https://instagram.com/stekircakes";

/** Carmichael, CA — delivery radius origin (ZIP 95608) */
export const DELIVERY_CENTER = {
  lat: 38.6171,
  lng: -121.3283,
  label: "Carmichael, CA (95608)",
} as const;

export const DELIVERY_RADIUS_MILES = 30;

export const BAKERY_HOURS = [
  { days: "Mon – Sat", hours: "9:00 AM – 7:00 PM" },
  { days: "Sunday", hours: "10:00 AM – 4:00 PM" },
] as const;

export const DELIVERY_AREAS = [
  "Sacramento",
  "Carmichael",
  "Folsom",
  "Roseville",
  "El Dorado Hills",
  "Elk Grove",
  "Rancho Cordova",
  "Fair Oaks",
  "Citrus Heights",
  "Orangevale",
] as const;

export const contactChannels = [
  {
    id: "phone",
    label: "Phone",
    value: BAKERY_PHONE_DISPLAY,
    href: `tel:${BAKERY_PHONE}`,
    description: "Call or text for quick questions about your order",
  },
  {
    id: "email",
    label: "Email",
    value: BAKERY_EMAIL,
    href: `mailto:${BAKERY_EMAIL}`,
    description: "We reply within one business day",
  },
  {
    id: "instagram",
    label: "Instagram",
    value: BAKERY_INSTAGRAM_HANDLE,
    href: BAKERY_INSTAGRAM_URL,
    description: "See our latest creations and behind-the-scenes",
  },
  {
    id: "sms",
    label: "Text Message",
    value: "Send us a text",
    href: `sms:${BAKERY_PHONE}`,
    description: "Fastest way to reach us about custom orders",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "Chat on WhatsApp",
    href: `https://wa.me/${BAKERY_PHONE.replace("+", "")}`,
    description: "Message us anytime — we will respond during business hours",
  },
] as const;
