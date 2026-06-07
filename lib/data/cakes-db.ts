import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { CakePricing, CakeRow } from "@/lib/data/cake-types";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function createPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchActiveCakeRows(): Promise<CakeRow[] | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("cakes")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .returns<CakeRow[]>();

    if (error || !data) {
      console.error("Failed to fetch active cakes:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch active cakes:", error);
    return null;
  }
}

export async function fetchAllCakeRows(): Promise<CakeRow[] | null> {
  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return null;
  }

  const { data, error } = await serviceClient
    .from("cakes")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<CakeRow[]>();

  if (error || !data) {
    console.error("Failed to fetch all cakes:", error);
    return null;
  }

  return data;
}

export async function fetchCakeRowBySlug(
  slug: string,
  options?: { includeInactive?: boolean },
): Promise<CakeRow | null> {
  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return null;
  }

  let query = serviceClient.from("cakes").select("*").eq("slug", slug);

  if (!options?.includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query.maybeSingle<CakeRow>();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function fetchActiveCakeSlugs(): Promise<string[] | null> {
  const rows = await fetchActiveCakeRows();
  if (!rows) {
    return null;
  }
  return rows.map((row) => row.slug);
}

export async function fetchCakePricingMap(): Promise<Map<string, CakePricing> | null> {
  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return null;
  }

  try {
    const { data, error } = await serviceClient
      .from("cakes")
      .select("slug, price_per_pound, min_weight")
      .eq("is_active", true)
      .returns<Array<{ slug: string; price_per_pound: number; min_weight: number }>>();

    if (error || !data) {
      console.error("Failed to fetch cake pricing:", error);
      return null;
    }

    return new Map(
      data.map((row) => [
        row.slug,
        {
          slug: row.slug,
          pricePerPound: Number(row.price_per_pound),
          minWeight: Number(row.min_weight),
        },
      ]),
    );
  } catch (error) {
    console.error("Failed to fetch cake pricing:", error);
    return null;
  }
}
