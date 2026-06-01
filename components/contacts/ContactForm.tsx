"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";

type FormStatus = "idle" | "submitting" | "success" | "error";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setForm(initialState);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border border-border bg-surface p-8 text-center shadow-soft sm:p-10"
        role="status"
      >
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary"
          aria-hidden="true"
        >
          ✓
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-text">Message sent!</h2>
        <p className="mx-auto mt-3 max-w-sm text-text-muted">
          Thank you for reaching out. We will get back to you within one business day — usually much
          sooner.
        </p>
        <Button className="mt-6" onClick={() => setStatus("idle")} variant="ghost">
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8"
      noValidate
    >
      <h2 className="font-display text-2xl font-semibold text-text">Send a Message</h2>
      <p className="mt-2 text-text-muted">
        Wedding inquiries, custom designs, or anything else — tell us what you are planning.
      </p>

      <div className="mt-6 space-y-5">
        <FormField label="Name" htmlFor="contact-name">
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={formInputClassName()}
            placeholder="Your name"
          />
        </FormField>

        <FormField label="Email" htmlFor="contact-email">
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={formInputClassName()}
            placeholder="you@example.com"
          />
        </FormField>

        <FormField label="Phone" htmlFor="contact-phone" hint="So we can call or text you back">
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={formInputClassName()}
            placeholder="(916) 555-0123"
          />
        </FormField>

        <FormField label="Message" htmlFor="contact-message">
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            className={formInputClassName("resize-y min-h-[120px]")}
            placeholder="Tell us about your event, preferred cake, delivery date, or any questions..."
          />
        </FormField>
      </div>

      {status === "error" && errorMessage ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        className="mt-6 w-full"
        disabled={status === "submitting"}
        aria-label={status === "submitting" ? "Sending message" : "Send message"}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
