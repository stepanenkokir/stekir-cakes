"use client";

import { useMemo, useState } from "react";

export type AdminReviewRow = {
  id: string;
  reviewer_name: string;
  cake_slug: string;
  rating: number;
  occasion: string | null;
  body: string;
  approved: boolean;
  created_at: string;
};

type AdminReviewsListProps = {
  initialReviews: AdminReviewRow[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminReviewsList({ initialReviews }: AdminReviewsListProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredReviews = useMemo(() => {
    if (filter === "all") {
      return reviews;
    }
    if (filter === "pending") {
      return reviews.filter((review) => !review.approved);
    }
    return reviews.filter((review) => review.approved);
  }, [filter, reviews]);

  async function setApproved(reviewId: string, approved: boolean) {
    setError(null);
    setBusyId(reviewId);

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to update review.");
      }

      setReviews((current) =>
        current.map((review) => (review.id === reviewId ? { ...review, approved } : review)),
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update review.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeReview(reviewId: string) {
    setError(null);
    setBusyId(reviewId);

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to delete review.");
      }

      setReviews((current) => current.filter((review) => review.id !== reviewId));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to delete review.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <label htmlFor="admin-review-filter" className="text-sm text-text-muted">
          Filter
        </label>
        <select
          id="admin-review-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value as "all" | "pending" | "approved")}
          className="rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="all">All</option>
        </select>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="space-y-3">
        {filteredReviews.map((review) => (
          <article key={review.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-medium text-text">{review.reviewer_name}</h3>
                <p className="text-sm text-text-muted">
                  {review.cake_slug} · {review.rating}/5 · {formatDate(review.created_at)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  review.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {review.approved ? "Approved" : "Pending"}
              </span>
            </div>

            {review.occasion ? (
              <p className="mt-2 text-sm text-text-muted">Occasion: {review.occasion}</p>
            ) : null}
            <p className="mt-3 text-sm text-text">{review.body}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setApproved(review.id, true)}
                disabled={busyId === review.id}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => setApproved(review.id, false)}
                disabled={busyId === review.id}
                className="rounded-full border border-border bg-bg px-4 py-2 text-sm font-medium text-text hover:border-primary hover:text-primary-dark disabled:opacity-50"
              >
                Mark pending
              </button>
              <button
                type="button"
                onClick={() => removeReview(review.id)}
                disabled={busyId === review.id}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </article>
        ))}

        {filteredReviews.length === 0 ? (
          <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-text-muted shadow-soft">
            No reviews match this filter.
          </p>
        ) : null}
      </div>
    </div>
  );
}
