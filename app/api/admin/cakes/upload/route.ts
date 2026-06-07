import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin/require-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/webp", "image/jpeg", "image/png"]);

export async function POST(request: Request) {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const serviceClient = createSupabaseServiceClient();
  if (!serviceClient) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File is too large (max 5 MB)." }, { status: 400 });
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  const objectPath = `${slug}/${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await serviceClient.storage
    .from("catalog-images")
    .upload(objectPath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Catalog image upload failed:", uploadError);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = serviceClient.storage.from("catalog-images").getPublicUrl(objectPath);

  return NextResponse.json({ url: publicUrl, path: objectPath });
}
