"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

export function useAuthNextPath() {
  const searchParams = useSearchParams();
  const locale = useLocale();

  return useMemo(() => {
    const param = searchParams.get("next");
    if (param && param.startsWith("/")) {
      return param;
    }
    return `/${locale}/account`;
  }, [searchParams, locale]);
}
