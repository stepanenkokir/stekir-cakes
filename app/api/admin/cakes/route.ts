import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin/require-admin";
import { revalidateCakesCatalog } from "@/lib/catalog/revalidate";
import type { CakeFormInput } from "@/lib/data/cake-types";
import {
  emptyTranslations,
  mapFormInputToRow,
  mapRowToFormInput,
} from "@/lib/data/cake-utils";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateFormInput(input: CakeFormInput): string | null {
  const slug = sanitizeSlug(input.slug);
  if (!slug) {
    return "Slug is required.";
  }

  if (input.pricePerPound <= 0 || input.minWeight <= 0 || input.noticeDays < 0) {
    return "Invalid pricing or weight settings.";
  }

  const english = input.translations.en;
  if (!english?.name?.trim() || !english.description?.trim()) {
    return "English name and description are required.";
  }

  if (input.imagePaths.length === 0) {
    return "At least one image is required.";
  }

  return null;
}

export async function GET() {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await serviceClient
    .from("cakes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load cakes." }, { status: 500 });
  }

  return NextResponse.json({
    cakes: (data ?? []).map((row) => mapRowToFormInput(row)),
  });
}

export async function POST(request: Request) {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: CakeFormInput;
  try {
    body = (await request.json()) as CakeFormInput;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const normalized: CakeFormInput = {
    ...body,
    slug: sanitizeSlug(body.slug),
    tags: body.tags ?? [],
    imagePaths: body.imagePaths ?? [],
    translations: {
      ...emptyTranslations(),
      ...body.translations,
    },
  };

  const validationError = validateFormInput(normalized);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const row = mapFormInputToRow(normalized);
  const { data, error } = await serviceClient
    .from("cakes")
    .insert({
      slug: row.slug,
      price_per_pound: row.price_per_pound,
      min_weight: row.min_weight,
      notice_days: row.notice_days,
      sort_order: row.sort_order,
      is_active: row.is_active,
      tags: row.tags,
      image_paths: row.image_paths,
      translations: row.translations,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Cake insert failed:", error);
    return NextResponse.json({ error: "Failed to create cake." }, { status: 500 });
  }

  revalidateCakesCatalog();

  return NextResponse.json({ success: true, id: data.id });
}
