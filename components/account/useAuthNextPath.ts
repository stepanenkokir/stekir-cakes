"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { stripLocalePrefix } from "@/lib/i18n/locale";

export function useAuthNextPath() {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const param = searchParams.get("next");
    if (param && param.startsWith("/") && !param.startsWith("//")) {
      return stripLocalePrefix(param);
    }
    return "/account";
  }, [searchParams]);
}
