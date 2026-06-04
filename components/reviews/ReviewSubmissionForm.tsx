"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/Button";
import { FormField, formInputClassName } from "@/components/ui/FormField";
import { getCakes } from "@/lib/data/cakes";
import { getSupabaseBrowserClientOrNull } from "@/lib/supabase/client";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ReviewSubmissionForm() {
  const locale = useLocale();
  const t = useTranslations("reviewsForm");
  const tc = useTranslations("common");
  const cakes = useMemo(() => getCakes(locale), [locale]);
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
          locale,
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
        setMessage(data.error ?? t("submitFailed"));
        return;
      }

      setStatus("success");
      setMessage(data.message ?? t("thankYou"));
      setReviewerName("");
      setReviewerEmail("");
      setCakeSlug("");
      setRating(0);
      setOccasion("");
      setBody("");
    } catch {
      setStatus("error");
      setMessage(tc("somethingWrong"));
    }
  }

  return (
    <section className="mt-16 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-text">{t("title")}</h2>
      <p className="mt-2 text-sm text-text-muted">{t("intro")}</p>

      {status === "success" ? (
        <p className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-primary-dark">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label={t("yourName")} htmlFor="review-name">
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

            <FormField label={t("email")} htmlFor="review-email" hint={t("emailHint")}>
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

          <FormField label={t("cake")} htmlFor="review-cake">
            <select
              id="review-cake"
              value={cakeSlug}
              onChange={(event) => setCakeSlug(event.target.value)}
              className={formInputClassName()}
              required
            >
              <option value="">{t("selectCake")}</option>
              {cakes.map((cake) => (
                <option key={cake.slug} value={cake.slug}>
                  {cake.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label={t("rating")} htmlFor="review-rating">
            <StarRating
              mode="input"
              rating={rating}
              onChange={setRating}
              size="lg"
              aria-label={t("starsAria")}
            />
            {rating === 0 ? (
              <p className="mt-2 text-xs text-text-muted">{t("ratingHint")}</p>
            ) : null}
          </FormField>

          <FormField label={t("occasion")} htmlFor="review-occasion">
            <input
              id="review-occasion"
              type="text"
              value={occasion}
              onChange={(event) => setOccasion(event.target.value)}
              className={formInputClassName()}
              placeholder={t("occasionPlaceholder")}
            />
          </FormField>

          <FormField label={t("review")} htmlFor="review-body">
            <textarea
              id="review-body"
              rows={5}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className={formInputClassName("resize-y")}
              required
              minLength={20}
              placeholder={t("reviewPlaceholder")}
            />
          </FormField>

          {status === "error" && message ? (
            <p className="text-sm text-red-600">{message}</p>
          ) : null}

          <Button type="submit" disabled={status === "submitting" || rating === 0}>
            {status === "submitting" ? tc("submitting") : tc("submitReview")}
          </Button>
        </form>
      )}
    </section>
  );
}
