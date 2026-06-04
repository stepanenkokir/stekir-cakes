"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { cakes } from "@/lib/data/cakes";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ReviewSubmissionForm() {
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [cakeSlug, setCakeSlug] = useState("");
  const [rating, setRating] = useState(0);
  const [occasion, setOccasion] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setReviewerEmail((current) => current || session.user.email || "");
      }
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerName,
          reviewerEmail,
          cakeSlug,
          rating,
          occasion,
          body,
        }),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Unable to submit review.");
        return;
      }

      setStatus("success");
      setMessage(
        data.message ??
          "Thank you! Your review was submitted and will appear after approval.",
      );
      setReviewerName("");
      setReviewerEmail("");
      setCakeSlug("");
      setRating(0);
      setOccasion("");
      setBody("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="mt-16 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-text">Share Your Experience</h2>
      <p className="mt-2 text-sm text-text-muted">
        Reviews are moderated before publishing. Sign in optional — name and email are required for guests.
      </p>

      {status === "success" ? (
        <p className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-primary-dark">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Your name" htmlFor="review-name">
              <input
                id="review-name"
                type="text"
                value={reviewerName}
                onChange={(event) => setReviewerName(event.target.value)}
                className={formInputClassName()}
                required
                minLength={2}
              />
            </FormField>

            <FormField label="Email" htmlFor="review-email" hint="Not shown publicly.">
              <input
                id="review-email"
                type="email"
                value={reviewerEmail}
                onChange={(event) => setReviewerEmail(event.target.value)}
                className={formInputClassName()}
                required
              />
            </FormField>
          </div>

          <FormField label="Which cake did you order?" htmlFor="review-cake">
            <select
              id="review-cake"
              value={cakeSlug}
              onChange={(event) => setCakeSlug(event.target.value)}
              className={formInputClassName()}
              required
            >
              <option value="">Select a cake</option>
              {cakes.map((cake) => (
                <option key={cake.slug} value={cake.slug}>
                  {cake.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Your rating" htmlFor="review-rating">
            <StarRating
              mode="input"
              rating={rating}
              onChange={setRating}
              size="lg"
              aria-label="Rate your experience from 1 to 5 stars"
            />
            {rating === 0 ? (
              <p className="mt-2 text-xs text-text-muted">Tap a star to rate</p>
            ) : null}
          </FormField>

          <FormField label="Occasion (optional)" htmlFor="review-occasion">
            <input
              id="review-occasion"
              type="text"
              value={occasion}
              onChange={(event) => setOccasion(event.target.value)}
              className={formInputClassName()}
              placeholder="Birthday cake, anniversary, etc."
            />
          </FormField>

          <FormField label="Your review" htmlFor="review-body">
            <textarea
              id="review-body"
              rows={5}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className={formInputClassName("resize-y")}
              required
              minLength={20}
              placeholder="Tell us what you loved about your cake..."
            />
          </FormField>

          {status === "error" && message ? (
            <p className="text-sm text-red-600">{message}</p>
          ) : null}

          <Button type="submit" disabled={status === "submitting" || rating === 0}>
            {status === "submitting" ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}
    </section>
  );
}
