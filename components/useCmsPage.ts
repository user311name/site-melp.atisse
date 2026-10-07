"use client";

import { useEffect, useState } from "react";
import type { EditablePage } from "@/lib/site-content";

export default function useCmsPage(pageKey: string) {
  const [page, setPage] = useState<EditablePage | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/site-content", { cache: "no-store" }).then(response => response.ok ? response.json() : null).then(data => {
      if (live && data?.pages?.[pageKey]) setPage(data.pages[pageKey]);
    }).catch(() => undefined);
    return () => { live = false; };
  }, [pageKey]);
  return page;
}
