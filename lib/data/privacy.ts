export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
};

export const privacySections: PrivacySection[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      "SteKir Cakes (“we,” “us”) respects your privacy. This policy explains what personal information we collect when you use our website, place an order, or create an account, and how we use and protect that information.",
      "By using our site or submitting an order, you agree to the practices described here. If you do not agree, please do not use our ordering services.",
    ],
  },
  {
    id: "data-we-collect",
    title: "What Data We Collect",
    paragraphs: [
      "We collect only the information needed to fulfill your cake orders, communicate with you, and improve your experience on our site.",
    ],
    listItems: [
      "Contact details: name, email address, and phone number.",
      "Delivery information: street address, city, ZIP code, preferred delivery date, time window, and special instructions (when you choose delivery).",
      "Order details: cake selections, weight, tiers, inscriptions, decoration notes, payment method preference, and order history.",
      "Account information: if you create an account, we store your profile details linked to your login via our authentication provider.",
      "Communications: messages you send through our contact form or by email, text, or phone.",
      "Technical data: basic server logs (such as IP address and browser type) used for security and troubleshooting — not for advertising profiles.",
    ],
  },
  {
    id: "how-we-use-data",
    title: "How We Use Your Data",
    paragraphs: [
      "We use your information solely to operate our bakery and serve you. We do not sell your personal data to third parties.",
    ],
    listItems: [
      "Process and fulfill cake orders, including confirmation calls or texts.",
      "Send order confirmations, payment instructions, and delivery updates by email or SMS.",
      "Respond to questions, custom design requests, and support inquiries.",
      "Maintain your order history when you are logged in to your account.",
      "Comply with legal obligations and protect against fraud or abuse of our services.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing With Third Parties",
    paragraphs: [
      "We do not sell, rent, or trade your personal information. We share data only with trusted service providers who help us run the business, and only as needed to perform their function.",
    ],
    listItems: [
      "Email delivery (e.g., order confirmations) through our transactional email provider.",
      "Hosting, database, and authentication services that store order and account data securely.",
      "Payment coordination is handled directly between you and us (Zelle, Venmo, or cash) — we do not store credit card numbers on our website.",
      "We may disclose information if required by law or to protect the rights, safety, or property of our customers and business.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Local Storage",
    paragraphs: [
      "Our site uses minimal cookies and browser storage. We do not use advertising or cross-site tracking cookies.",
    ],
    listItems: [
      "Shopping cart contents may be stored in your browser’s local storage so your selections persist between visits.",
      "Session cookies may be used if you log in to your account, managed by our authentication provider.",
      "You can clear local storage and cookies through your browser settings; doing so may empty your cart or sign you out.",
    ],
  },
  {
    id: "retention-security",
    title: "Retention & Security",
    paragraphs: [
      "We retain order and contact records for as long as needed to fulfill orders, resolve disputes, and meet bookkeeping or legal requirements.",
      "We apply reasonable technical and organizational measures to protect your data. No online service can guarantee absolute security; please use a strong, unique password if you create an account.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights & Data Deletion",
    paragraphs: [
      "Depending on where you live, you may have rights to access, correct, or delete personal information we hold about you.",
      "California residents may have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what we collect and to request deletion, subject to certain exceptions (such as records we must keep to complete an order or for tax purposes).",
    ],
    listItems: [
      "To request a copy of your data, correct inaccurate information, or ask us to delete your account and associated records, contact us using the details below.",
      "We will respond within a reasonable timeframe. Deletion requests may be limited where we are required to retain information for legal or operational reasons.",
    ],
  },
  {
    id: "children",
    title: "Children’s Privacy",
    paragraphs: [
      "Our services are not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have received such information, please contact us so we can delete it.",
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    paragraphs: [
      "Questions about this privacy policy or a data request? Reach out — we will help you promptly.",
      "SteKir Cakes · Sacramento, CA · Cottage Food Operation",
      "This policy was last updated in May 2026. We may update this page from time to time; material changes will be reflected here with an updated date.",
    ],
  },
];

export const privacyContact = {
  phone: "(916) 555-0192",
  phoneHref: "tel:+19165550192",
  email: "hello@stekircakes.com",
  emailHref: "mailto:hello@stekircakes.com",
  instagram: "@stekircakes",
  instagramHref: "https://instagram.com/stekircakes",
};
