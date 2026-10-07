"use client";

import { useEffect, useState } from "react";
import type { EditablePage } from "@/lib/site-content";

export default function ManagedPageSections({ pageKey }: { pageKey: string }) {
  const [page, setPage] = useState<EditablePage | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/site-content", { cache: "no-store" }).then(response => response.ok ? response.json() : null).then(data => {
      if (live && data?.pages?.[pageKey]) setPage(data.pages[pageKey]);
    }).catch(() => undefined);
    return () => { live = false; };
  }, [pageKey]);

  if (!page?.sections?.length) return null;
  return <div className="managed-page-sections">{page.sections.map(section => <article className="managed-page-section" key={section.id}>
    {section.image && <img src={section.image} alt={section.imageAlt || section.title} />}
    <div>{section.title && <h2>{section.title}</h2>}{section.body && <p>{section.body}</p>}{section.linkText && section.linkUrl && <a className="managed-page-section-link" href={section.linkUrl}>{section.linkText}</a>}</div>
  </article>)}</div>;
}
