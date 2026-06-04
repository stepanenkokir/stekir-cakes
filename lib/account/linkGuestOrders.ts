import type { SupabaseClient } from "@supabase/supabase-js";

/** Attach guest orders (same email, no user_id) to the signed-in account. */
export async function linkGuestOrders(
  supabase: SupabaseClient,
  userId: string,
  email: string,
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return;
  }

  await supabase
    .from("orders")
    .update({ user_id: userId })
    .is("user_id", null)
    .ilike("customer_email", normalizedEmail);
}
