import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { calculateDeliveryFee } from "@/lib/delivery";
import { BAKERY_EMAIL } from "@/lib/data/contact";

type DeliveryType = "delivery" | "pickup";
type DeliveryWindow = "morning" | "afternoon" | "evening";
type PaymentMethod = "zelle" | "venmo" | "cash";

type CartItemPayload = {
  slug?: string;
  name?: string;
  weightLbs?: number;
  tiers?: number;
  inscription?: string;
  decorationNotes?: string;
  unitPrice?: number;
  quantity?: number;
};

type OrderPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  deliveryType?: DeliveryType;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  deliveryDate?: string;
  deliveryWindow?: DeliveryWindow;
  deliveryInstructions?: string;
  paymentMethod?: PaymentMethod;
  agreeToTerms?: boolean;
  items?: CartItemPayload[];
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  depositAmount?: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DELIVERY_ZIP_PATTERN = /^\d{5}$/;
const ALLOWED_PAYMENT_METHODS: PaymentMethod[] = ["zelle", "venmo", "cash"];
const ALLOWED_DELIVERY_TYPES: DeliveryType[] = ["delivery", "pickup"];
const ALLOWED_DELIVERY_WINDOWS: DeliveryWindow[] = ["morning", "afternoon", "evening"];

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    return null;
  }

  return { url, anonKey, serviceRoleKey };
}

function sanitizeText(value: string | undefined): string {
  return value?.trim() ?? "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function validatePayload(payload: OrderPayload) {
  const firstName = sanitizeText(payload.firstName);
  const lastName = sanitizeText(payload.lastName);
  const phone = sanitizeText(payload.phone);
  const email = sanitizeText(payload.email);
  const deliveryType = payload.deliveryType;
  const deliveryAddress = sanitizeText(payload.deliveryAddress);
  const deliveryCity = sanitizeText(payload.deliveryCity);
  const deliveryZip = sanitizeText(payload.deliveryZip);
  const deliveryDate = sanitizeText(payload.deliveryDate);
  const deliveryWindow = payload.deliveryWindow;
  const deliveryInstructions = sanitizeText(payload.deliveryInstructions);
  const paymentMethod = payload.paymentMethod;
  const agreeToTerms = Boolean(payload.agreeToTerms);
  const items = payload.items ?? [];
  const subtotal = Number(payload.subtotal ?? 0);
  const deliveryFee = Number(payload.deliveryFee ?? 0);
  const total = Number(payload.total ?? 0);
  const depositAmount = Number(payload.depositAmount ?? 0);

  if (firstName.length < 2) {
    return { error: "Please enter your first name." };
  }

  if (lastName.length < 2) {
    return { error: "Please enter your last name." };
  }

  if (phone.length < 7) {
    return { error: "Please enter a valid phone number." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!deliveryType || !ALLOWED_DELIVERY_TYPES.includes(deliveryType)) {
    return { error: "Please select delivery or pickup." };
  }

  if (!deliveryDate) {
    return { error: "Please select a delivery date." };
  }

  if (!deliveryWindow || !ALLOWED_DELIVERY_WINDOWS.includes(deliveryWindow)) {
    return { error: "Please select a delivery window." };
  }

  if (deliveryType === "delivery") {
    if (deliveryAddress.length < 5) {
      return { error: "Please enter a valid delivery address." };
    }

    if (deliveryCity.length < 2) {
      return { error: "Please enter a valid city." };
    }

    if (!DELIVERY_ZIP_PATTERN.test(deliveryZip)) {
      return { error: "Please enter a valid 5-digit ZIP code." };
    }

    const feeResult = calculateDeliveryFee(deliveryZip);
    if (feeResult.tier === "unsupported") {
      return { error: feeResult.message };
    }

    if (Math.abs(deliveryFee - feeResult.fee) > 0.01) {
      return { error: "Delivery fee does not match the selected ZIP code." };
    }
  } else if (deliveryFee !== 0) {
    return { error: "Pickup orders should not include a delivery fee." };
  }

  if (!paymentMethod || !ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    return { error: "Please select a payment method." };
  }

  if (!agreeToTerms) {
    return { error: "Please agree to the Terms & Conditions." };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Your cart is empty." };
  }

  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return { error: "Invalid order subtotal." };
  }

  if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
    return { error: "Invalid delivery fee." };
  }

  if (!Number.isFinite(total) || total <= 0) {
    return { error: "Invalid order total." };
  }

  if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
    return { error: "Invalid deposit amount." };
  }

  const normalizedItems = items.map((item) => {
    const unitPrice = Number(item.unitPrice ?? 0);
    const quantity = Number(item.quantity ?? 0);
    const weightLbs = Number(item.weightLbs ?? 0);
    const subtotalValue = unitPrice * quantity;

    return {
      slug: sanitizeText(item.slug),
      name: sanitizeText(item.name),
      weight_lbs: Number.isFinite(weightLbs) ? weightLbs : 0,
      tiers: Number(item.tiers ?? 1),
      inscription: sanitizeText(item.inscription),
      decoration_notes: sanitizeText(item.decorationNotes),
      unit_price: Number.isFinite(unitPrice) ? unitPrice : 0,
      subtotal: Number.isFinite(subtotalValue) ? subtotalValue : 0,
    };
  });

  return {
    firstName,
    lastName,
    phone,
    email,
    deliveryType,
    deliveryAddress,
    deliveryCity,
    deliveryZip,
    deliveryDate,
    deliveryWindow,
    deliveryInstructions,
    paymentMethod,
    items: normalizedItems,
    subtotal,
    deliveryFee,
    total,
    depositAmount,
  };
}

async function getUserId() {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

async function sendOrderEmails(params: {
  orderNumber: string;
  fullName: string;
  phone: string;
  email: string;
  deliveryType: DeliveryType;
  deliveryDate: string;
  deliveryWindow: DeliveryWindow;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  depositAmount: number;
  itemSummaryText: string;
  ownerAddressSummary: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL ?? BAKERY_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "SteKir Cakes <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);
  const paymentLabel = params.paymentMethod === "cash" ? "Cash on Delivery" : params.paymentMethod.toUpperCase();
  const deliveryLabel = params.deliveryType === "pickup" ? "Pickup" : "Delivery";

  const customerSubject = `We received your order ${params.orderNumber}`;
  const ownerSubject = `New cake order ${params.orderNumber}`;

  const customerText = [
    `Hi ${params.fullName},`,
    "",
    `Thank you for your order with SteKir Cakes!`,
    `Order number: ${params.orderNumber}`,
    "",
    "Order details:",
    params.itemSummaryText,
    "",
    `${deliveryLabel} date: ${params.deliveryDate}`,
    `Time window: ${params.deliveryWindow}`,
    `Payment method: ${paymentLabel}`,
    "",
    `Subtotal: $${params.subtotal.toFixed(2)}`,
    `Delivery fee: $${params.deliveryFee.toFixed(2)}`,
    `Total: $${params.total.toFixed(2)}`,
    `Deposit due (50%): $${params.depositAmount.toFixed(2)}`,
    "",
    "We'll contact you shortly to confirm details and payment instructions.",
  ].join("\n");

  const ownerText = [
    "New order received",
    "",
    `Order number: ${params.orderNumber}`,
    `Customer: ${params.fullName}`,
    `Phone: ${params.phone}`,
    `Email: ${params.email}`,
    "",
    "Items:",
    params.itemSummaryText,
    "",
    `Type: ${deliveryLabel}`,
    `Address: ${params.ownerAddressSummary}`,
    `Date: ${params.deliveryDate}`,
    `Window: ${params.deliveryWindow}`,
    `Payment method: ${paymentLabel}`,
    "",
    `Subtotal: $${params.subtotal.toFixed(2)}`,
    `Delivery fee: $${params.deliveryFee.toFixed(2)}`,
    `Total: $${params.total.toFixed(2)}`,
    `Deposit (50%): $${params.depositAmount.toFixed(2)}`,
  ].join("\n");

  const [customerResult, ownerResult] = await Promise.all([
    resend.emails.send({
      from: fromEmail,
      to: params.email,
      subject: customerSubject,
      text: customerText,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Hi ${escapeHtml(params.fullName)},</p>
        <p>Your order <strong>${escapeHtml(params.orderNumber)}</strong> has been received.</p>
        <p><strong>Order details:</strong><br />${escapeHtml(params.itemSummaryText).replace(/\n/g, "<br />")}</p>
        <p><strong>${escapeHtml(deliveryLabel)} date:</strong> ${escapeHtml(params.deliveryDate)}</p>
        <p><strong>Time window:</strong> ${escapeHtml(params.deliveryWindow)}</p>
        <p><strong>Payment method:</strong> ${escapeHtml(paymentLabel)}</p>
        <p><strong>Subtotal:</strong> $${params.subtotal.toFixed(2)}<br />
        <strong>Delivery fee:</strong> $${params.deliveryFee.toFixed(2)}<br />
        <strong>Total:</strong> $${params.total.toFixed(2)}<br />
        <strong>Deposit due (50%):</strong> $${params.depositAmount.toFixed(2)}</p>
        <p>We will contact you shortly to confirm everything.</p>
      `,
    }),
    resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      replyTo: params.email,
      subject: ownerSubject,
      text: ownerText,
      html: `
        <h2>New order received</h2>
        <p><strong>Order number:</strong> ${escapeHtml(params.orderNumber)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(params.fullName)}<br />
        <strong>Phone:</strong> ${escapeHtml(params.phone)}<br />
        <strong>Email:</strong> ${escapeHtml(params.email)}</p>
        <p><strong>Items:</strong><br />${escapeHtml(params.itemSummaryText).replace(/\n/g, "<br />")}</p>
        <p><strong>Type:</strong> ${escapeHtml(deliveryLabel)}<br />
        <strong>Address:</strong> ${escapeHtml(params.ownerAddressSummary)}<br />
        <strong>Date:</strong> ${escapeHtml(params.deliveryDate)}<br />
        <strong>Window:</strong> ${escapeHtml(params.deliveryWindow)}<br />
        <strong>Payment method:</strong> ${escapeHtml(paymentLabel)}</p>
        <p><strong>Subtotal:</strong> $${params.subtotal.toFixed(2)}<br />
        <strong>Delivery fee:</strong> $${params.deliveryFee.toFixed(2)}<br />
        <strong>Total:</strong> $${params.total.toFixed(2)}<br />
        <strong>Deposit (50%):</strong> $${params.depositAmount.toFixed(2)}</p>
      `,
    }),
  ]);

  if (customerResult.error || ownerResult.error) {
    throw new Error("Failed to send order emails.");
  }
}

export async function POST(request: Request) {
  let body: OrderPayload;

  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validated = validatePayload(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const env = getSupabaseEnv();
  if (!env) {
    return NextResponse.json(
      { error: "Order service is not configured. Please try again later." },
      { status: 503 },
    );
  }

  const customerName = `${validated.firstName} ${validated.lastName}`.trim();
  const userId = await getUserId();
  const ownerAddressSummary =
    validated.deliveryType === "pickup"
      ? "Pickup"
      : `${validated.deliveryAddress}, ${validated.deliveryCity}, ${validated.deliveryZip}`;

  const itemsSummaryText = validated.items
    .map((item, index) => {
      const name = item.name || "Custom cake";
      const weight = item.weight_lbs ? `${item.weight_lbs} lbs` : "custom weight";
      const tiers = item.tiers ? `${item.tiers} tier${item.tiers > 1 ? "s" : ""}` : "1 tier";
      const subtotal = item.subtotal ?? 0;
      return `${index + 1}. ${name} — ${weight}, ${tiers}, $${subtotal.toFixed(2)}`;
    })
    .join("\n");

  const adminClient = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: insertedOrder, error } = await adminClient
    .from("orders")
    .insert({
      user_id: userId,
      customer_name: customerName,
      customer_email: validated.email,
      customer_phone: validated.phone,
      items: validated.items,
      delivery_type: validated.deliveryType,
      delivery_address:
        validated.deliveryType === "delivery" ? validated.deliveryAddress : null,
      delivery_city: validated.deliveryType === "delivery" ? validated.deliveryCity : null,
      delivery_zip: validated.deliveryType === "delivery" ? validated.deliveryZip : null,
      delivery_date: validated.deliveryDate,
      delivery_window: validated.deliveryWindow,
      delivery_instructions: validated.deliveryInstructions || null,
      delivery_fee: validated.deliveryFee,
      payment_method: validated.paymentMethod,
      subtotal: validated.subtotal,
      total: validated.total,
      deposit_amount: validated.depositAmount,
      status: "pending",
    })
    .select("order_number")
    .single();

  if (error || !insertedOrder?.order_number) {
    console.error("Order insert failed:", error);
    return NextResponse.json(
      { error: "Unable to place your order right now. Please try again." },
      { status: 500 },
    );
  }

  const orderNumber = insertedOrder.order_number;

  try {
    await sendOrderEmails({
      orderNumber,
      fullName: customerName,
      phone: validated.phone,
      email: validated.email,
      deliveryType: validated.deliveryType,
      deliveryDate: validated.deliveryDate,
      deliveryWindow: validated.deliveryWindow,
      paymentMethod: validated.paymentMethod,
      subtotal: validated.subtotal,
      deliveryFee: validated.deliveryFee,
      total: validated.total,
      depositAmount: validated.depositAmount,
      itemSummaryText: itemsSummaryText,
      ownerAddressSummary,
    });
  } catch (emailError) {
    console.error("Order placed but email failed:", emailError);
  }

  return NextResponse.json({ success: true, orderNumber });
}
