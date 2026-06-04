import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { linkGuestOrders } from "@/lib/account/linkGuestOrders";

function createSupabaseMock() {
  const ilike = vi.fn().mockResolvedValue({ error: null });
  const is = vi.fn().mockReturnValue({ ilike });
  const update = vi.fn().mockReturnValue({ is });
  const from = vi.fn().mockReturnValue({ update });

  return {
    supabase: { from } as unknown as SupabaseClient,
    from,
    update,
    is,
    ilike,
  };
}

describe("linkGuestOrders", () => {
  it("does nothing when email is empty", async () => {
    const { supabase, from } = createSupabaseMock();

    await linkGuestOrders(supabase, "user-123", "   ");

    expect(from).not.toHaveBeenCalled();
  });

  it("normalizes email and links guest orders", async () => {
    const { supabase, from, update, is, ilike } = createSupabaseMock();

    await linkGuestOrders(supabase, "user-123", "  Guest@Example.com ");

    expect(from).toHaveBeenCalledWith("orders");
    expect(update).toHaveBeenCalledWith({ user_id: "user-123" });
    expect(is).toHaveBeenCalledWith("user_id", null);
    expect(ilike).toHaveBeenCalledWith("customer_email", "guest@example.com");
  });
});
