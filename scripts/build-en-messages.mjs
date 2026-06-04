import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadTsExport(filePath, exportName) {
  const content = readFileSync(join(root, filePath), "utf8");
  const match = content.match(
    new RegExp(`export const ${exportName}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\]);`),
  );
  if (!match) throw new Error(`Could not parse ${exportName} from ${filePath}`);
  const sanitized = match[1]
    .replace(/\b\w+ImagePath\([^)]*\)/g, '""')
    .replace(/catalogImagePath\([^)]*\)/g, '""')
    .replace(/galleryImagePath\([^)]*\)/g, '""')
    .replace(/reviewImagePath\([^)]*\)/g, '""');
  return eval(sanitized);
}

const cakesRaw = loadTsExport("lib/data/cakes.ts", "cakes");
const faqRaw = loadTsExport("lib/data/faq.ts", "faqCategories");
const termsRaw = loadTsExport("lib/data/terms.ts", "termsSections");
const privacyRaw = loadTsExport("lib/data/privacy.ts", "privacySections");
const reviewsRaw = loadTsExport("lib/data/reviews.ts", "reviews");
const galleryRaw = loadTsExport("lib/data/gallery.ts", "galleryImages");

const cakes = {};
for (const c of cakesRaw) {
  cakes[c.slug] = {
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    ingredients: c.ingredients,
    servings: c.servings,
    prepTime: c.prepTime,
    storageInstructions: c.storageInstructions,
    tags: c.tags,
  };
}

const faq = faqRaw.map((cat) => ({
  id: cat.id,
  title: cat.title,
  items: cat.items.map((i) => ({
    id: i.id,
    question: i.question,
    answer: i.answer,
  })),
}));

const terms = {
  pageTitle: "Terms & Conditions",
  pageIntro:
    "Please read these policies before placing an order. By checking the agreement box at checkout, you accept these terms.",
  onThisPage: "On this page",
  contactForm: "Contact form",
  footerCtaTitle: "Ready to order?",
  footerCtaText:
    "Browse our catalog, customize your cake, and agree to these terms at checkout.",
  browseCakes: "Browse Cakes",
  readFaq: "Read FAQ",
  sections: termsRaw,
};

const privacy = {
  pageTitle: "Privacy Policy",
  pageIntro:
    "How we handle your personal information when you browse, order, or create an account on SteKir Cakes.",
  onThisPage: "On this page",
  contactForm: "Contact form",
  footerCtaTitle: "Questions about your data?",
  footerCtaText:
    "Email us to request access, correction, or deletion of your personal information.",
  emailUs: "Email Us",
  readTerms: "Read Terms",
  sections: privacyRaw,
};

const reviews = reviewsRaw.map((r) => ({
  id: r.id,
  quote: r.quote,
  name: r.name,
  occasion: r.occasion,
  cakeSlug: r.cakeSlug,
}));

const gallery = galleryRaw.map((g) => ({
  id: g.id,
  alt: g.alt,
}));

const messages = {
  common: {
    brand: "SteKir Cakes",
    home: "Home",
    orderNow: "Order Now",
    browseCakes: "Browse Cakes",
    browseOurCakes: "Browse Our Cakes",
    learnMore: "Learn More",
    customizeOrder: "Customize & Order",
    addToCart: "Add to Cart",
    addedToCart: "Added to Cart!",
    continue: "Continue",
    back: "Back",
    contactUs: "Contact Us",
    readFaq: "Read FAQ",
    readTerms: "Read Terms",
    emailUs: "Email Us",
    textUs: "Text Us",
    signIn: "Sign In",
    signOut: "Sign Out",
    myAccount: "My Account",
    languageSwitcher: "Choose language",
    fromPrice: "From {price}",
    lbs: "{weight} lbs",
    somethingWrong: "Something went wrong. Please try again.",
    required: "Required",
    optional: "Optional",
    customer: "Customer",
    friend: "Friend",
    customCake: "Custom Cake",
    na: "N/A",
    all: "All",
    soon: "Soon",
    sending: "Sending...",
    saving: "Saving...",
    updating: "Updating...",
    deleting: "Deleting...",
    placingOrder: "Placing Order...",
    placeOrder: "Place Order",
    proceedCheckout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    sendMessage: "Send Message",
    submitReview: "Submit Review",
    submitting: "Submitting...",
    saveProfile: "Save Profile",
    updatePassword: "Update Password",
    deleteAccount: "Delete Account",
    viewOrders: "View Orders",
    updateProfile: "Update Profile",
    viewOrderStatus: "View Order Status",
    backToHome: "Back to Home",
    seeFullGallery: "See Full Gallery",
    readAllReviews: "Read All Reviews",
    sendAnotherMessage: "Send another message",
    ourCakes: "Our Cakes",
    catalog: "Catalog",
    gallery: "Gallery",
    about: "About",
    contact: "Contact",
    reviews: "Reviews",
    faq: "FAQ",
    terms: "Terms",
    privacy: "Privacy",
    cart: "Cart",
    checkout: "Checkout",
    termsConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    paymentZelle: "Zelle",
    paymentVenmo: "Venmo",
    paymentCash: "Cash on Delivery",
    pickup: "Pickup",
    delivery: "Delivery",
    depositPercent: "Deposit due (50%)",
    depositConfirm: "Deposit due (50% to confirm)",
    orderNumber: "Order number",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    deliveryFee: "Delivery fee",
    estDelivery: "Est. delivery",
    estimatedTotal: "Estimated total",
    total: "Total",
    weight: "Weight",
    tiers: "tiers",
    tier: "tier",
    inscription: "Inscription",
    notes: "Notes",
    ingredients: "Ingredients",
    storage: "Storage",
    paymentMethod: "Payment method",
    cake: "Cake",
    yes: "Yes",
    no: "No",
  },
  nav: {
    ourCakes: "Our Cakes",
    gallery: "Gallery",
    about: "About",
    contact: "Contact",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    cartAria: "Shopping cart, {count} items",
    accountAria: "Go to my account",
    signInAria: "Sign in to account",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    closeOverlay: "Close menu overlay",
  },
  footer: {
    tagline:
      "Homemade Eastern European cakes in Sacramento — baked fresh to order for every celebration.",
    quickLinks: "Quick Links",
    contact: "Contact",
    serviceArea:
      "Serving Sacramento, Carmichael, Folsom, Roseville, El Dorado Hills, Elk Grove & Rancho Cordova",
    copyright: "© {year} SteKir Cakes. All rights reserved.",
  },
  metadata: {
    defaultTitle: "SteKir Cakes | Homemade Custom Cakes in Sacramento",
    defaultDescription:
      "Eastern European-style custom cakes made to order in Sacramento. Napoleon, Medovik, Smetannik & Mannik — delivered to Folsom, Roseville, El Dorado Hills & beyond.",
    ogDescription:
      "Classic Eastern European cakes, baked fresh to order and delivered across the Sacramento area.",
    template: "%s | SteKir Cakes",
    catalogTitle: "Our Cakes",
    catalogDescription:
      "Classic Eastern European recipes, reimagined for every celebration",
    notFound: "Cake Not Found",
  },
  cakes,
  cakeTags: {
    Birthday: "Birthday",
    Anniversary: "Anniversary",
    "Most Popular": "Most Popular",
    Holiday: "Holiday",
    "Fan Favorite": "Fan Favorite",
    Everyday: "Everyday",
    Kids: "Kids",
    "Gluten-Sensitive Option": "Gluten-Sensitive Option",
  },
  catalogFilters: {
    all: "All",
    birthday: "Birthday",
    anniversary: "Anniversary",
    holiday: "Holiday",
    everyday: "Everyday",
    filterAria: "Filter cakes by occasion",
    noMatch: "No cakes match this occasion. Try another filter or browse all cakes.",
  },
  galleryFilters: {
    all: "All",
    napoleon: "Napoleon",
    medovik: "Medovik",
    smetannik: "Smetannik",
    mannik: "Mannik",
    custom: "Custom Designs",
    filterAria: "Filter gallery by cake type",
    noPhotos: "No photos in this category yet. Check back soon!",
    viewPhoto: "View photo: {alt}",
    lightboxTitle: "Gallery image viewer",
    closeViewer: "Close gallery viewer",
    close: "Close",
    prev: "Previous image",
    next: "Next image",
    counter: "{current} of {total}",
  },
  faq: {
    pageTitle: "Frequently Asked Questions",
    pageIntro:
      "Everything you need to know about ordering, delivery, payment, and caring for your cake",
    footerTitle: "Still have questions?",
    footerText:
      "We are happy to help with custom requests, wedding inquiries, or anything not covered here.",
    categories: faq,
  },
  terms,
  privacy,
  reviews: {
    filters: {
      all: "All Cakes",
      napoleon: "Napoleon",
      medovik: "Medovik",
      smetannik: "Smetannik",
      mannik: "Mannik",
    },
    pageTitle: "What Our Customers Say",
    pageIntro:
      "Honest feedback from families and celebrations across Sacramento, Folsom, Roseville, and beyond",
    basedOn: "Based on {count} customer review",
    basedOnPlural: "Based on {count} customer reviews",
    trustNote:
      "Every review is from a real order in the Sacramento area. Thank you for trusting us with your celebrations.",
    noReviews: "No reviews for this cake yet. Be the first to share your experience!",
    photoBy: "Photo shared by {name}",
    items: reviews,
  },
  gallery: { items: gallery },
  contact: {
    pageTitle: "Get in Touch",
    pageIntro:
      "We are here to help with custom orders, delivery questions, and special celebrations",
    reachUs: "Reach Us",
    reachIntro:
      "Questions about a custom design, wedding cake, or delivery? We would love to hear from you.",
    businessHours: "Business Hours",
    hoursNote:
      "Orders are baked fresh to your schedule — please allow at least 3 days notice for standard cakes.",
    sendMessage: "Send a Message",
    formIntro:
      "Wedding inquiries, custom designs, or anything else — tell us what you are planning.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    phoneHint: "So we can call or text you back",
    placeholders: {
      name: "Your name",
      email: "you@example.com",
      phone: "(916) 555-0123",
      message:
        "Tell us about your event, preferred cake, delivery date, or any questions...",
    },
    successTitle: "Message sent!",
    successText:
      "Thank you for reaching out. We will get back to you within one business day — usually much sooner.",
    deliveryZone: "Delivery Zone",
    deliveryZoneIntro:
      "We deliver fresh cakes within 30 miles of Carmichael, CA (95608). Delivery is $10 within 15 miles and $20 for 15–30 miles.",
    radiusLabel: "30-mile delivery radius",
    centerLabel: "Carmichael, CA (95608)",
    areasTitle: "Areas we serve",
    channels: {
      phone: { label: "Phone", description: "Call or text for quick questions about your order" },
      email: { label: "Email", description: "We reply within one business day" },
      instagram: {
        label: "Instagram",
        description: "See our latest creations and behind-the-scenes",
      },
      sms: { label: "Text Message", value: "Send us a text", description: "Fastest way to reach us about custom orders" },
      whatsapp: {
        label: "WhatsApp",
        value: "Chat on WhatsApp",
        description: "Message us anytime — we will respond during business hours",
      },
    },
    hours: [
      { days: "Mon – Sat", hours: "9:00 AM – 7:00 PM" },
      { days: "Sunday", hours: "10:00 AM – 4:00 PM" },
    ],
    areas: [
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
    ],
  },
};

mkdirSync(join(root, "messages"), { recursive: true });
writeFileSync(
  join(root, "messages", "en.json"),
  JSON.stringify(messages, null, 2),
  "utf8",
);
console.log("Wrote messages/en.json");
