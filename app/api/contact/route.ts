import { NextResponse } from "next/server";
import { Resend } from "resend";
import { BAKERY_EMAIL } from "@/lib/data/contact";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(body: ContactPayload) {
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2) {
    return { error: "Please enter your name." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (phone.length < 7) {
    return { error: "Please enter a valid phone number." };
  }

  if (message.length < 10) {
    return { error: "Please enter a message of at least 10 characters." };
  }

  return { name, email, phone, message };
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validated = validatePayload(body);

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
    return NextResponse.json(
      { error: "Email service is not configured. Please call or text us directly." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: ownerEmail,
    replyTo: email,
    subject: `Contact form: ${name}`,
    text: [
      "New contact form submission",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      "Message:",
      message,
    ].join("\n"),
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
