import "server-only";

import { revalidateTag } from "next/cache";

export const CAKES_CACHE_TAG = "cakes";

export function revalidateCakesCatalog() {
  revalidateTag(CAKES_CACHE_TAG, "max");
}
