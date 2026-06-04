import { NextResponse } from "next/server";
import { Resend } from "resend";
import { BAKERY_EMAIL } from "@/lib/data/contact";
import { getApiMessages, resolveLocale } from "@/lib/i18n/api";
import { getMessages } from "@/lib/i18n/messages";
import type { Messages } from "@/lib/i18n/messages";

type ContactPayload = {
  locale?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(body: ContactPayload, api: Messages["api"]) {
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2) {
    return { error: api.contactName };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: api.contactEmail };
  }

  if (phone.length < 7) {
    return { error: api.phone };
  }

  if (message.length < 10) {
    return { error: api.contactMessage };
  }

  return { name, email, phone, message };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const locale = resolveLocale(body.locale);
  const messages = getMessages(locale);
  const api = getApiMessages(body.locale);
  const validated = validatePayload(body, api);

  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { name, email, phone, message } = validated;
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL ?? BAKERY_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "SteKir Cakes <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return NextResponse.json({ error: api.supabase }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const subject = `${messages.contact.sendMessage}: ${name}`;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: ownerEmail,
    replyTo: email,
    subject,
    text: [
      messages.emails.newOrder,
      "",
      `${messages.contact.name}: ${name}`,
      `${messages.contact.email}: ${email}`,
      `${messages.contact.phone}: ${phone}`,
      "",
      `${messages.contact.message}:`,
      message,
    ].join("\n"),
    html: `
      <h2>${escapeHtml(messages.contact.sendMessage)}</h2>
      <p><strong>${escapeHtml(messages.contact.name)}:</strong> ${escapeHtml(name)}</p>
      <p><strong>${escapeHtml(messages.contact.email)}:</strong> ${escapeHtml(email)}</p>
      <p><strong>${escapeHtml(messages.contact.phone)}:</strong> ${escapeHtml(phone)}</p>
      <p><strong>${escapeHtml(messages.contact.message)}:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: messages.common.somethingWrong },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
