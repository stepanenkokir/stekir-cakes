import { notFound } from "next/navigation";
import { CakeForm } from "@/components/admin/CakeForm";
import { mapRowToFormInput } from "@/lib/data/cake-utils";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditCakePage({ params }: PageProps) {
  const { id } = await params;
  const serviceClient = createSupabaseServiceClient();

  if (!serviceClient) {
    notFound();
  }

  const { data, error } = await serviceClient.from("cakes").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-text">Edit cake</h2>
      <CakeForm mode="edit" cakeId={id} initialValue={mapRowToFormInput(data)} />
    </div>
  );
}
