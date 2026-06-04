import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { calculateDeliveryFee } from "@/lib/delivery";
import { BAKERY_EMAIL } from "@/lib/data/contact";
import { getApiMessages, getEmailMessages, resolveLocale } from "@/lib/i18n/api";
import { getMessages } from "@/lib/i18n/messages";
import type { Messages } from "@/lib/i18n/messages";

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
  locale?: string;
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

type ApiMessages = Messages["api"];
type EmailMessages = Messages["emails"];

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

function validatePayload(
  payload: OrderPayload,
  api: ApiMessages,
  feeOutside: string,
  orderSubmitError: string,
) {
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
    return { error: api.firstName };
  }

  if (lastName.length < 2) {
    return { error: api.lastName };
  }

  if (phone.length < 7) {
    return { error: api.phone };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: api.email };
  }

  if (!deliveryType || !ALLOWED_DELIVERY_TYPES.includes(deliveryType)) {
    return { error: api.deliveryType };
  }

  if (!deliveryDate) {
    return { error: api.deliveryDate };
  }

  if (!deliveryWindow || !ALLOWED_DELIVERY_WINDOWS.includes(deliveryWindow)) {
    return { error: api.deliveryWindow };
  }

  if (deliveryType === "delivery") {
    if (deliveryAddress.length < 5) {
      return { error: api.street };
    }

    if (deliveryCity.length < 2) {
      return { error: api.city };
    }

    if (!DELIVERY_ZIP_PATTERN.test(deliveryZip)) {
      return { error: api.zip };
    }

    const feeResult = calculateDeliveryFee(deliveryZip);
    if (feeResult.tier === "unsupported") {
      return { error: feeOutside };
    }

    if (Math.abs(deliveryFee - feeResult.fee) > 0.01) {
      return { error: api.zip };
    }
  } else if (deliveryFee !== 0) {
    return { error: api.invalidItem };
  }

  if (!paymentMethod || !ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    return { error: api.payment };
  }

  if (!agreeToTerms) {
    return { error: api.terms };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { error: api.items };
  }

  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return { error: api.invalidItem };
  }

  if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
    return { error: api.invalidItem };
  }

  if (!Number.isFinite(total) || total <= 0) {
    return { error: api.invalidItem };
  }

  if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
    return { error: api.invalidItem };
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

  if (normalizedItems.some((item) => !item.name || item.unit_price <= 0)) {
    return { error: orderSubmitError };
  }

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
  emails: EmailMessages;
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
  pickupLabel: string;
  deliveryLabel: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL ?? BAKERY_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "SteKir Cakes <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);
  const { emails } = params;
  const deliveryLabel =
    params.deliveryType === "pickup" ? params.pickupLabel : params.deliveryLabel;
  const paymentLabel =
    params.paymentMethod === "cash"
      ? params.paymentMethod
      : params.paymentMethod.toUpperCase();

  const customerSubject = emails.customerSubject.replace("{orderNumber}", params.orderNumber);
  const ownerSubject = emails.ownerSubject.replace("{orderNumber}", params.orderNumber);

  const customerText = [
    emails.greeting.replace("{name}", params.fullName),
    "",
    emails.received,
    "",
    emails.deposit,
    "",
    `${emails.orderDetails}:`,
    params.itemSummaryText,
    "",
    `${deliveryLabel}: ${params.deliveryDate}`,
    `${params.deliveryWindow}`,
    `$${params.subtotal.toFixed(2)} / $${params.deliveryFee.toFixed(2)} / $${params.total.toFixed(2)}`,
    `$${params.depositAmount.toFixed(2)}`,
  ].join("\n");

  const ownerText = [
    emails.newOrder,
    "",
    `${emails.orderDetails}:`,
    params.itemSummaryText,
    "",
    `${params.fullName} | ${params.phone} | ${params.email}`,
    `${deliveryLabel}: ${params.ownerAddressSummary}`,
    `${params.deliveryDate} | ${params.deliveryWindow} | ${paymentLabel}`,
    `$${params.total.toFixed(2)} (${params.depositAmount.toFixed(2)})`,
    "",
    emails.review,
  ].join("\n");

  const [customerResult, ownerResult] = await Promise.all([
    resend.emails.send({
      from: fromEmail,
      to: params.email,
      subject: customerSubject,
      text: customerText,
      html: `
        <p>${escapeHtml(emails.greeting.replace("{name}", params.fullName))}</p>
        <p>${escapeHtml(emails.received)}</p>
        <p>${escapeHtml(emails.deposit)}</p>
        <p><strong>${escapeHtml(emails.orderDetails)}:</strong><br />${escapeHtml(params.itemSummaryText).replace(/\n/g, "<br />")}</p>
        <p>${escapeHtml(deliveryLabel)}: ${escapeHtml(params.deliveryDate)}</p>
      `,
    }),
    resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      replyTo: params.email,
      subject: ownerSubject,
      text: ownerText,
      html: `
        <h2>${escapeHtml(emails.newOrder)}</h2>
        <p>${escapeHtml(emails.review)}</p>
        <p><strong>${escapeHtml(emails.orderDetails)}:</strong><br />${escapeHtml(params.itemSummaryText).replace(/\n/g, "<br />")}</p>
        <p>${escapeHtml(params.fullName)} | ${escapeHtml(params.phone)} | ${escapeHtml(params.email)}</p>
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

  const locale = resolveLocale(body.locale);
  const messages = getMessages(locale);
  const api = getApiMessages(body.locale);
  const emails = getEmailMessages(body.locale);

  const validated = validatePayload(
    body,
    api,
    messages.checkout.step2.fees.outside,
    messages.checkout.step3.errors.submit,
  );

  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const env = getSupabaseEnv();
  if (!env) {
    return NextResponse.json({ error: api.supabase }, { status: 503 });
  }

  const customerName = `${validated.firstName} ${validated.lastName}`.trim();
  const userId = await getUserId();
  const ownerAddressSummary =
    validated.deliveryType === "pickup"
      ? messages.common.pickup
      : `${validated.deliveryAddress}, ${validated.deliveryCity}, ${validated.deliveryZip}`;

  const itemsSummaryText = validated.items
    .map((item, index) => {
      const name = item.name || messages.common.customCake;
      const weight = item.weight_lbs
        ? messages.common.lbs.replace("{weight}", String(item.weight_lbs))
        : messages.account.orders.customWeight;
      const tiers = item.tiers
        ? `${item.tiers} ${item.tiers > 1 ? messages.common.tiers : messages.common.tier}`
        : `1 ${messages.common.tier}`;
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
      { error: messages.checkout.step3.errors.submit },
      { status: 500 },
    );
  }

  const orderNumber = insertedOrder.order_number;

  try {
    await sendOrderEmails({
      emails,
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
      pickupLabel: messages.common.pickup,
      deliveryLabel: messages.common.delivery,
    });
  } catch (emailError) {
    console.error("Order placed but email failed:", emailError);
  }

  return NextResponse.json({ success: true, orderNumber });
}
