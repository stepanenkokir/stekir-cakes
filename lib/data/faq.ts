export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        id: "advance-notice",
        question: "How far in advance do I need to order?",
        answer:
          "We require a minimum of 3 days notice for standard orders. For large orders or custom designs, please allow at least 1 week so we can plan every detail with care.",
      },
      {
        id: "minimum-size",
        question: "What is the minimum cake size?",
        answer:
          "Our minimum cake size is 2 lbs, which serves approximately 8–10 people. Mannik is available from 1.5 lbs for smaller gatherings.",
      },
      {
        id: "customize-flavor",
        question: "Can I customize the flavor or filling?",
        answer:
          "Yes! We welcome customization requests. Reach out through our contact form or give us a call to discuss flavor variations, fillings, and design ideas.",
      },
      {
        id: "wedding-cakes",
        question: "Do you make wedding cakes?",
        answer:
          "We love creating cakes for weddings and special celebrations. Custom inquiries are welcome — please contact us with your date, guest count, and vision.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      {
        id: "delivery-areas",
        question: "What areas do you deliver to?",
        answer:
          "We deliver throughout Sacramento, Carmichael, Folsom, Roseville, El Dorado Hills, Elk Grove, Rancho Cordova, and Fair Oaks — up to 30 miles from zip code 95608.",
      },
      {
        id: "delivery-fee",
        question: "How much is delivery?",
        answer:
          "Delivery is $10 within 15 miles of our kitchen, and $20 for addresses 15–30 miles away. Your exact fee is calculated at checkout based on your location.",
      },
      {
        id: "pickup",
        question: "Can I pick up instead?",
        answer:
          "Yes! Free pickup is available. We will share the pickup address and time window after your order is confirmed.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    items: [
      {
        id: "payment-methods",
        question: "How do I pay?",
        answer:
          "We accept Zelle, Venmo, and cash on delivery. A 50% deposit is required to confirm your order — we will send payment instructions after we review your request.",
      },
      {
        id: "payment-due",
        question: "When is payment due?",
        answer:
          "The 50% deposit is due within 24 hours of order confirmation. The remaining balance is due on delivery or at pickup.",
      },
    ],
  },
  {
    id: "allergies-storage",
    title: "Allergies & Storage",
    items: [
      {
        id: "allergens",
        question: "Do your cakes contain allergens?",
        answer:
          "All of our cakes contain dairy and eggs. Mannik can be adapted as a gluten-sensitive option — please let us know about any allergies or dietary needs when you order.",
      },
      {
        id: "storage",
        question: "How should I store the cake?",
        answer:
          "Keep your cake refrigerated in the box. For best flavor and texture, enjoy within 3 days. Napoleon especially benefits from one day of refrigeration before serving.",
      },
    ],
  },
];
