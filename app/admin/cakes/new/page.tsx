import { CakeForm } from "@/components/admin/CakeForm";
import { emptyTranslations } from "@/lib/data/cake-utils";

export default function AdminNewCakePage() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-text">Add cake</h2>
      <CakeForm
        mode="create"
        initialValue={{
          slug: "",
          pricePerPound: 12,
          minWeight: 2,
          noticeDays: 2,
          sortOrder: 0,
          isActive: true,
          tags: [],
          imagePaths: [],
          translations: emptyTranslations(),
        }}
      />
    </div>
  );
}
