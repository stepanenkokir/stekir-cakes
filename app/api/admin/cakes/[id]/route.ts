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

type RouteParams = {
  params: Promise<{ id: string }>;
};

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

export async function GET(_request: Request, { params }: RouteParams) {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await serviceClient.from("cakes").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Cake not found." }, { status: 404 });
  }

  return NextResponse.json({ cake: mapRowToFormInput(data) });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;

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

  const row = mapFormInputToRow(normalized, id);
  const { error } = await serviceClient
    .from("cakes")
    .update({
      slug: row.slug,
      price_per_pound: row.price_per_pound,
      min_weight: row.min_weight,
      notice_days: row.notice_days,
      sort_order: row.sort_order,
      is_active: row.is_active,
      tags: row.tags,
      image_paths: row.image_paths,
      translations: row.translations,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Cake update failed:", error);
    return NextResponse.json({ error: "Failed to update cake." }, { status: 500 });
  }

  revalidateCakesCatalog();

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { error } = await serviceClient
    .from("cakes")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to deactivate cake." }, { status: 500 });
  }

  revalidateCakesCatalog();

  return NextResponse.json({ success: true });
}
