import { AdminReviewsList, type AdminReviewRow } from "@/components/admin/AdminReviewsList";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminReviewsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: reviews = [] } = await supabase
    .from("reviews")
    .select("id, reviewer_name, cake_slug, rating, occasion, body, approved, created_at")
    .order("created_at", { ascending: false })
    .returns<AdminReviewRow[]>();

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-text">Reviews moderation</h2>
      <AdminReviewsList initialReviews={reviews} />
    </div>
  );
}
