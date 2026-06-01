# Cursor Prompt — Custom Cake Order Portal (Sacramento, CA)

---

## Project Overview

Build a full-stack custom cake ordering web application for a home bakery serving Sacramento, CA and surrounding suburbs: Carmichael, Folsom, Roseville, El Dorado Hills, Elk Grove, Rancho Cordova, and Fair Oaks.

The bakery specializes in Eastern European-style cakes (Napoleon, Medovik, Smetannik, Mannik) made from scratch to order. All prices in USD.

---

## Tech Stack

- **Framework**: Next.js 14 (or better) with App Router
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Email notifications**: Resend (send order confirmation to customer + alert to bakery owner)
- **Maps**: Google Maps Embed API
- **Reviews & Reputation**: Google Business Profile, Yelp
- **Local SEO**: Google Business Profile integration
- **Directions**: Google Maps deep links
- **Image placeholders**: Unsplash (search: "cake", "honey cake", "Napoleon cake")
- **Language**: English throughout
- **Deployment target**: Vercel

---

## Design System

### Aesthetic Direction

Warm, artisan, editorial — like a high-end bakery in a boutique neighborhood. Think cream linen textures, hand-drawn accents, generous whitespace. NOT corporate, NOT generic food-delivery app.

### Color Palette (CSS variables)

```css
--color-bg: #fdf8f2; /* warm off-white / cream */
--color-primary: #b5813a; /* golden caramel */
--color-primary-dark: #8c6020; /* deep amber */
--color-accent: #d4a96a; /* light honey */
--color-text: #2c1a0e; /* dark espresso */
--color-text-muted: #7a6050; /* warm gray-brown */
--color-surface: #fff9f0; /* card background */
--color-border: #e8d9c4; /* soft border */
```

### Typography

- **Display / Headings**: `Playfair Display` (Google Fonts) — elegant serif for titles
- **Body**: `Lato` or `Source Sans 3` — clean, readable
- **Accent labels**: `Dancing Script` — hand-lettered feel for decorative tags

### Component Style

- Buttons: rounded-full, filled primary for CTA, outlined ghost for secondary
- Cards: subtle shadow, rounded-2xl, hover: lift with shadow deepening
- Inputs: soft border, focus ring in --color-primary
- Sections: alternating cream and white backgrounds, generous padding (py-20)

---

## Site Architecture & Routes

```
/                          Home (landing page)
/catalog                   All cakes catalog
/catalog/napoleon          Napoleon cake page
/catalog/medovik           Medovik cake page
/catalog/smetannik         Smetannik cake page
/catalog/mannik            Mannik cake page
/gallery                   Photo gallery of past orders
/about                     About the bakery / our story
/reviews                   Customer reviews
/faq                       Frequently asked questions
/contacts                  Contact info + delivery zone map
/cart                      Shopping cart
/checkout                  Order form & checkout
/order-success             Order confirmation page
/terms                     Terms & Conditions
/privacy                   Privacy Policy
/account                   Personal account dashboard (auth required)
/account/orders            Order history list
/account/orders/[id]       Single order detail + status tracker
/admin                     Admin dashboard (owner only, protected)
```

---

## Page-by-Page Specifications

---

### `/` — Home Page

Build these sections in order:

**1. Navigation (sticky header)**

- Logo: "Sweet Sacramento" (script font)
- Nav links: Our Cakes | Gallery | About | Contact
- Right: Cart icon with badge + "Order Now" button (primary)
- Mobile: hamburger menu with slide-in drawer

**2. Hero Section**

- Full-width, ~90vh height
- Background: large, warm-toned photo of a layered Napoleon cake
- Overlay: soft dark gradient from bottom
- Headline: `"Homemade Cakes, Made to Order"` (Playfair Display, large)
- Subheadline: `"Crafted with love in Sacramento. Delivering to Folsom, Roseville, El Dorado Hills & beyond."`
- Two buttons: "Browse Cakes" (primary, large) | "How It Works" (ghost)
- Subtle scroll-down arrow animation

**3. Trust Bar**

- 4 icons in a row: 🌿 All-natural ingredients | 🎂 Any size, any occasion | 🚗 Local delivery | ❤️ Made from scratch

**4. Our Cakes Section**

- Title: "Choose Your Cake"
- Subtitle: "Classic Eastern European recipes, reimagined for every celebration"
- 4 cake cards in a 2x2 (desktop) / 1-col (mobile) grid
- Each card: photo, cake name, tagline, starting price, "Learn More" button
- Slight hover lift animation

**5. How It Works**

- 3 steps with numbered icons:
  1. "Choose & Customize" — Pick your cake, size, and add a personal message
  2. "We Confirm & Bake" — We'll call or text to confirm details and bake fresh to order
  3. "Fresh Delivery" — Delivered to your door in Sacramento & surrounding areas
- Clean timeline or card layout

**6. Gallery Teaser**

- Title: "Made with Love"
- Masonry or CSS grid of 6 photos (use Unsplash placeholders: cakes, desserts)
- "See Full Gallery" button

**7. Reviews Section**

- Title: "What Our Customers Say"
- Auto-scrolling or manual slider with 4–5 review cards
- Each card: quote, reviewer name, star rating (5 stars), occasion (e.g., "Birthday cake")
- Soft pastel card background

**8. CTA Banner**

- Full-width warm background (--color-primary or texture)
- Text: "Ready to order your perfect cake?"
- Subtext: "Order at least 3 days in advance. Weekend orders fill quickly!"
- Button: "Order Now" (white button, dark text)

**9. Footer**

- Logo + short tagline
- Links: Home | Catalog | Gallery | About | FAQ | Terms | Privacy
- Contact: phone, email, Instagram link
- Delivery area: "Serving Sacramento, Carmichael, Folsom, Roseville, El Dorado Hills, Elk Grove & Rancho Cordova"
- © 2025 Sweet Sacramento. All rights reserved.

---

### `/catalog` — Cake Catalog Page

- Page title: "Our Cakes" with subtitle
- Filter bar: "All" (default) | by occasion tag (Birthday / Anniversary / Holiday / Everyday)
- Grid of all 4 cake cards (same style as homepage but larger)
- Each card shows: photo, name, description snippet, price range, "Customize & Order" CTA
- Breadcrumb: Home > Our Cakes

---

### `/catalog/[slug]` — Individual Cake Page (reusable template)

Use a single dynamic route component. Pass different data for each cake.

**Cake Data:**

```js
const cakes = [
  {
    slug: "napoleon",
    name: "Napoleon",
    tagline: "Layers of tradition, a lifetime of flavor",
    description:
      "Our Napoleon is a true classic — dozens of paper-thin, flaky pastry layers alternating with rich homemade custard cream. Every bite is a balance of crunch and silk. Perfect for birthdays, anniversaries, and any moment worth celebrating.",
    ingredients: "Butter, flour, eggs, whole milk, sugar, vanilla bean",
    pricePerPound: 14, // USD per lb
    minWeight: 2, // lbs
    servings: "1 lb feeds approx. 3–4 people",
    prepTime: "3 days notice required",
    images: ["napoleon-1.jpg", "napoleon-2.jpg"],
    tags: ["Birthday", "Anniversary", "Most Popular"],
  },
  {
    slug: "medovik",
    name: "Medovik",
    tagline: "Honey-kissed layers, cloud-soft cream",
    description:
      "Medovik is our most beloved cake — thin honey sponge layers soaked in time, paired with a velvety sour cream frosting. Its fragrant sweetness and melt-in-your-mouth texture have made it a family favorite across generations.",
    ingredients: "Honey, butter, eggs, flour, sour cream, sugar",
    pricePerPound: 13,
    minWeight: 2,
    servings: "1 lb feeds approx. 3–4 people",
    prepTime: "3 days notice required",
    images: ["medovik-1.jpg", "medovik-2.jpg"],
    tags: ["Birthday", "Holiday", "Fan Favorite"],
  },
  {
    slug: "smetannik",
    name: "Smetannik",
    tagline: "Light as a cloud, warm as home",
    description:
      "Smetannik is the cake your grandmother would have made on a Sunday afternoon. Fluffy sour cream sponge layers with a smooth, tangy cream — this cake is lighter than it looks and impossible to stop eating.",
    ingredients: "Sour cream, eggs, flour, sugar, butter, vanilla",
    pricePerPound: 12,
    minWeight: 2,
    servings: "1 lb feeds approx. 3–4 people",
    prepTime: "2 days notice required",
    images: ["smetannik-1.jpg", "smetannik-2.jpg"],
    tags: ["Everyday", "Birthday", "Kids"],
  },
  {
    slug: "mannik",
    name: "Mannik",
    tagline: "Simple, tender, and perfectly satisfying",
    description:
      "Our Mannik is a semolina-based cake with a uniquely dense yet tender crumb — no flour, just coarsely ground semolina giving it a rustic, comforting texture. Naturally dairy-free adaptable, great for kids and those who prefer a less sweet dessert.",
    ingredients: "Semolina, eggs, sour cream, sugar, butter, baking soda",
    pricePerPound: 11,
    minWeight: 1.5,
    servings: "1 lb feeds approx. 3–4 people",
    prepTime: "2 days notice required",
    images: ["mannik-1.jpg", "mannik-2.jpg"],
    tags: ["Kids", "Everyday", "Gluten-Sensitive Option"],
  },
];
```

**Page Layout:**

Left column (60%): large hero photo + thumbnail gallery carousel
Right column (40%): sticky order configurator

**Order Configurator widget (right sticky panel):**

- Cake name + price display (updates live)
- Weight selector: 2 lbs | 2.5 lbs | 3 lbs | 3.5 lbs | 4 lbs | Custom (input)
- Number of tiers: 1 | 2 | 3
- Inscription on cake: text input, max 40 chars (optional)
- Preferred delivery date: date picker (minimum: today + 3 days)
- Decoration notes: textarea, "Any special wishes for decoration, flavors, or design?"
- **Live price calculation**: `price = weight × pricePerPound` shown large and bold
- Delivery fee note: "Delivery: $10 within 15 miles | $20 up to 30 miles"
- "Add to Cart" button (primary, full width)
- "Questions? Text us" link → opens SMS to bakery number

Below fold: Ingredients list, Storage instructions, Related cakes grid (3 cards)

---

### `/gallery` — Photo Gallery

- Masonry grid layout (CSS columns or Masonry library)
- Filter tabs: All | Napoleon | Medovik | Smetannik | Mannik | Custom Designs
- Lightbox on click (use yet-another-react-lightbox or similar)
- Placeholder: 20 Unsplash images (cakes, pastry, desserts)

---

### `/about` — About the Bakery

Sections:

1. **Hero**: warm photo (baker at work), headline "Made with love in Sacramento"
2. **Our Story**: 2-paragraph story — home baker, family recipes, Eastern European tradition brought to California
3. **Why Choose Us**: 3–4 cards: Fresh daily | No preservatives | Custom sizes | Local delivery
4. **Meet the Baker**: photo, name (placeholder: "Anna"), brief bio
5. **Certifications**: Sacramento County Cottage Food License badge, "Insured & Certified"

---

### `/reviews` — Reviews Page

- Average rating display (e.g., ★★★★★ 4.9/5 — 47 reviews)
- Filter by cake type
- Review cards: name, date, star rating, occasion, review text, optional photo
- Review submission form (requires login or just name+email):
  - Star rating selector
  - Which cake ordered
  - Review text
  - Submits to Supabase `reviews` table (pending approval by admin)

---

### `/faq` — FAQ Page

Accordion-style. Include these questions:

**Ordering:**

- How far in advance do I need to order? (3 days minimum, 1 week for large orders or custom designs)
- What is the minimum cake size? (2 lbs / approx. 8–10 servings)
- Can I customize the flavor or filling? (Yes, contact us to discuss options)
- Do you make wedding cakes? (Custom inquiries welcome via contact form)

**Delivery:**

- What areas do you deliver to? (Sacramento, Carmichael, Folsom, Roseville, El Dorado Hills, Elk Grove, Rancho Cordova, Fair Oaks — up to 30 miles from 95608)
- How much is delivery? ($10 within 15 miles, $20 for 15–30 miles)
- Can I pick up instead? (Yes! Free pickup available — address shared after order confirmation)

**Payment:**

- How do I pay? (Zelle, Venmo, cash on delivery — 50% deposit required at order confirmation)
- When is payment due? (Deposit due within 24h of order confirmation; balance due on delivery)

**Allergies & Storage:**

- Do your cakes contain allergens? (All cakes contain dairy and eggs. Gluten-free options: Mannik. Please inform us of allergies.)
- How should I store the cake? (Refrigerate in the box. Best consumed within 3 days. Napoleon improves with 1 day of refrigeration.)

---

### `/contacts` — Contact Page

- **Phone**: (916) 555-0192 (placeholder)
- **Email**: hello@sweetsacramento.com (placeholder)
- **Instagram**: @sweetsacramento
- **WhatsApp / SMS**: link to wa.me or sms: link
- **Hours**: Mon–Sat 9am–7pm | Sun 10am–4pm
- **Delivery Zone Map**: Google Maps embed showing Sacramento metro area with a radius circle
- **Delivery area list**: Sacramento, Carmichael, Folsom, Roseville, El Dorado Hills, Elk Grove, Rancho Cordova, Fair Oaks, Citrus Heights, Orangevale
- Contact form: Name, Email, Phone, Message, Submit → sends via Resend to owner email

---

### `/cart` — Shopping Cart

- List of cart items: cake name, customization summary (weight, inscription, date), unit price, quantity controls (+ / −), remove button
- Order summary sidebar: subtotal, estimated delivery fee, total
- "Continue Shopping" button
- "Proceed to Checkout" button (primary)
- Empty cart state: illustration + "No cakes yet" + CTA to catalog
- Persist cart in localStorage

---

### `/checkout` — Checkout Form

Multi-step form (3 steps with progress indicator):

**Step 1 — Contact Info**

- First name, Last name
- Phone number (required — for order confirmation call/text)
- Email address

**Step 2 — Delivery**

- Delivery or Pickup (toggle)
- If delivery: Street address, City, ZIP code, Delivery date (from configurator or re-select)
- Delivery time window: Morning (9am–12pm) | Afternoon (12pm–5pm) | Evening (5pm–8pm)
- Special delivery instructions (optional)

**Step 3 — Payment & Review**

- Order summary (cake details, pricing)
- Payment method: Zelle | Venmo | Cash on Delivery
- Deposit info: "A 50% deposit ($XX) is required to confirm your order. We will send you payment instructions via text/email."
- Terms checkbox: "I agree to the Terms & Conditions"
- "Place Order" button

On submit:

1. Save order to Supabase `orders` table with status `pending`
2. Send confirmation email to customer via Resend
3. Send notification email to bakery owner with full order details
4. Redirect to `/order-success`

---

### `/order-success` — Order Confirmation

- Large checkmark animation (CSS)
- "Thank you, [First Name]! 🎂"
- Order number: `#SAC-XXXXX`
- Summary: cake, weight, delivery date, total, deposit amount
- "What happens next?":
  1. You'll receive a text/call within a few hours to confirm details
  2. Send your 50% deposit to confirm the order
  3. Your cake will be baked fresh and delivered on your chosen date
- Buttons: "View Order Status" (if logged in) | "Back to Home"

---

### `/terms` — Terms & Conditions

Static page. Include these sections:

- Order Policy (minimum notice, cancellation — no refund within 48h of delivery)
- Delivery Policy (zones, fees, failed delivery)
- Payment Policy (deposit, balance, accepted methods)
- Allergen Disclaimer
- Liability Limitations
- Contact information

---

### `/privacy` — Privacy Policy

Standard privacy policy covering:

- What data is collected (name, email, phone, address, order history)
- How it's used (order fulfillment, email notifications)
- No data sold to third parties
- Cookie usage (minimal)
- Contact to request data deletion

---

### `/account` — Personal Account (Protected Route)

Require Supabase Auth. If not logged in, redirect to login modal or `/account/login`.

**`/account` (dashboard)**

- Welcome message: "Welcome back, [Name]"
- Summary cards: Total orders, Active orders, Loyalty points (future feature placeholder)
- Quick links: View Orders | Update Profile

**`/account/orders`**

- Table: Order # | Cake | Weight | Delivery Date | Total | Status | Actions
- Status badges: Pending | Confirmed | Baking | Out for Delivery | Delivered | Cancelled
- Click row to open `/account/orders/[id]`

**`/account/orders/[id]`**

- Order details: all items, customization, delivery info, pricing
- Status tracker (horizontal step bar):
  `Order Received → Confirmed → Baking → Out for Delivery → Delivered`
  Highlight current step in --color-primary
- "Contact Us About This Order" button → opens email/SMS link

**`/account/profile`**

- Edit: name, phone, email, default delivery address
- Change password
- Delete account option

---

### `/admin` — Admin Panel (Owner Only)

Protect with Supabase RLS — only user with `role = 'admin'` can access.

- **Orders table**: all orders, filter by status/date, update status via dropdown
- **Revenue summary**: this week / this month totals
- **Reviews moderation**: approve/reject submitted reviews
- Simple and functional — no need for fancy design here

---

## Database Schema (Supabase)

```sql
-- Users (handled by Supabase Auth)
-- Extended profile:
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  phone text,
  default_address text,
  role text default 'customer'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null, -- e.g. SAC-00042
  user_id uuid references profiles(id),
  -- Customer info (denormalized for guests)
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  -- Items
  items jsonb not null, -- [{slug, name, weight_lbs, tiers, inscription, decoration_notes, unit_price, subtotal}]
  -- Delivery
  delivery_type text not null, -- 'delivery' | 'pickup'
  delivery_address text,
  delivery_city text,
  delivery_zip text,
  delivery_date date not null,
  delivery_window text, -- 'morning' | 'afternoon' | 'evening'
  delivery_instructions text,
  delivery_fee numeric(6,2) default 0,
  -- Payment
  payment_method text not null, -- 'zelle' | 'venmo' | 'cash'
  subtotal numeric(8,2) not null,
  total numeric(8,2) not null,
  deposit_amount numeric(8,2),
  -- Status
  status text default 'pending', -- pending | confirmed | baking | out_for_delivery | delivered | cancelled
  -- Meta
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  reviewer_name text not null,
  cake_slug text not null,
  rating integer check (rating between 1 and 5),
  occasion text,
  body text not null,
  approved boolean default false,
  created_at timestamptz default now()
);
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
OWNER_EMAIL=hello@sweetsacramento.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

---

## Component Checklist

Build these as reusable components:

- `<Header />` — sticky, with cart badge
- `<Footer />`
- `<CakeCard />` — photo, name, tagline, price, CTA
- `<OrderConfigurator />` — weight/date/inscription/live price
- `<CartItem />`
- `<OrderStatusBar />` — step tracker for order status
- `<ReviewCard />`
- `<FAQAccordion />`
- `<DeliveryZoneMap />` — Google Maps embed
- `<StarRating />` — display + interactive input variant

---

## MVP Scope (Build in This Order)

**Phase 1 — Core (ship this first):**

1. Home page
2. `/catalog` + all 4 cake pages with `OrderConfigurator`
3. `/cart` + `/checkout` + `/order-success`
4. Email notifications via Resend
5. `/contacts`, `/faq`, `/terms`, `/privacy`

**Phase 2 — Trust & Content:** 6. `/gallery` 7. `/about` 8. `/reviews` (display only, no submission yet)

**Phase 3 — Accounts:** 9. Supabase Auth + `/account` dashboard 10. `/account/orders` + `/account/orders/[id]` 11. `/admin` panel

---

## Additional Notes

- All images: use `next/image` with `priority` on above-fold images
- SEO: each cake page should have unique `<title>`, `<meta description>`, and Open Graph tags
- Loading states: use skeleton loaders on data-fetching pages
- Error states: friendly messages with CTA back to catalog
- Accessibility: all buttons have aria-labels, images have alt text, forms have labels
- Mobile: test all pages at 375px width — the order flow must work perfectly on iPhone
- Phone numbers and addresses are Sacramento-area placeholders — make them easy to find and replace
