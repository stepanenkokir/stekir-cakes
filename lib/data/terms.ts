export type TermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
};

export const termsSections: TermsSection[] = [
  {
    id: "order-policy",
    title: "Order Policy",
    paragraphs: [
      "All cakes are made fresh to order. By placing an order with SteKir Cakes, you agree to the policies outlined on this page.",
      "Standard orders require a minimum of 3 days notice before your requested delivery or pickup date. Large orders, multi-tier designs, or heavily customized cakes may require at least 1 week of notice.",
      "Our minimum cake size is 2 lbs (approximately 8–10 servings), unless otherwise noted for a specific cake. Order details — including weight, tiers, inscription, decoration notes, and delivery date — are confirmed before baking begins.",
    ],
    listItems: [
      "Orders are not confirmed until we review your request and receive the required 50% deposit.",
      "Changes to weight, design, or delivery date may be accepted at our discretion if requested with sufficient notice.",
      "Cancellations made more than 48 hours before the scheduled delivery or pickup date may receive a partial refund of the deposit, minus any costs already incurred.",
      "Cancellations within 48 hours of delivery or pickup are not eligible for a refund, as ingredients are purchased and production has typically begun.",
    ],
  },
  {
    id: "delivery-policy",
    title: "Delivery Policy",
    paragraphs: [
      "We deliver throughout the Sacramento metro area and surrounding suburbs, up to 30 miles from zip code 95608.",
    ],
    listItems: [
      "Delivery fee: $10 within 15 miles of our kitchen.",
      "Delivery fee: $20 for addresses 15–30 miles away.",
      "Free pickup is available — the pickup address and time window are shared after your order is confirmed.",
      "Delivery areas include Sacramento, Carmichael, Folsom, Roseville, El Dorado Hills, Elk Grove, Rancho Cordova, Fair Oaks, Citrus Heights, and Orangevale.",
      "Someone must be available to receive the order at the agreed time window. If delivery cannot be completed due to an incorrect address, unavailable recipient, or restricted access, we may attempt to reschedule. A second delivery attempt may incur an additional fee.",
      "We are not responsible for damage to cakes left unattended after a successful delivery or pickup handoff.",
    ],
  },
  {
    id: "payment-policy",
    title: "Payment Policy",
    paragraphs: [
      "We accept Zelle, Venmo, and cash on delivery or at pickup. Payment instructions are sent after we confirm your order details.",
    ],
    listItems: [
      "A 50% deposit is required to confirm your order.",
      "The deposit is due within 24 hours of order confirmation.",
      "The remaining balance is due on delivery or at pickup.",
      "Orders may be cancelled if the deposit is not received within the stated timeframe.",
      "Prices are listed in USD and may be updated without notice; confirmed orders are honored at the price agreed at confirmation.",
    ],
  },
  {
    id: "allergen-disclaimer",
    title: "Allergen Disclaimer",
    paragraphs: [
      "Our cakes are prepared in a home kitchen licensed under the Sacramento County Cottage Food Operations program. Cross-contact with common allergens may occur.",
      "Please inform us of any allergies or dietary restrictions when you order. While we take reasonable care, we cannot guarantee an allergen-free environment.",
    ],
    listItems: [
      "All cakes contain dairy and eggs unless explicitly discussed otherwise.",
      "Mannik may be adapted as a gluten-sensitive option — please contact us to discuss your needs.",
      "We do not use nuts as a standard ingredient, but please disclose nut allergies so we can assess your order individually.",
      "Customers with severe allergies order at their own risk and should consult us before placing an order.",
    ],
  },
  {
    id: "liability-limitations",
    title: "Liability Limitations",
    paragraphs: [
      "SteKir Cakes provides custom baked goods on an as-is basis. Our liability is limited to the amount paid for the order in question.",
    ],
    listItems: [
      "We are not liable for improper storage, handling, or consumption after delivery or pickup.",
      "Perishable products should be refrigerated promptly and consumed within 3 days unless otherwise advised.",
      "We are not responsible for delays caused by circumstances outside our reasonable control, including severe weather or traffic conditions.",
      "Photographs on our website and social media are representative; slight variations in decoration may occur due to the handmade nature of our work.",
      "Nothing in these terms limits rights that cannot be excluded under applicable California law.",
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    paragraphs: [
      "Questions about these terms, your order, or a custom request? Reach out — we are happy to help.",
      "SteKir Cakes · Sacramento, CA · Cottage Food Operation",
      "These terms were last updated in May 2026. We may revise this page from time to time; continued use of our ordering services constitutes acceptance of the current version.",
    ],
  },
];

export const termsContact = {
  phone: "(916) 555-0192",
  phoneHref: "tel:+19165550192",
  email: "hello@stekircakes.com",
  emailHref: "mailto:hello@stekircakes.com",
  instagram: "@stekircakes",
  instagramHref: "https://instagram.com/stekircakes",
};
