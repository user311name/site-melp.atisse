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
  if (pageKey === "collaborations") {
    const groups = [
      { id: "point-de-vente", title: "Où acheter mes gourmandises" },
      { id: "restaurant", title: "Restaurants & collaborations" },
      { id: "atelier", title: "Partenaires ateliers" },
    ];
    return <div className="managed-page-sections collaboration-directory">{groups.map(group => {
      const entries = page.sections.filter(section => section.category === group.id);
      if (!entries.length) return null;
      return <section className="collab-managed-group" key={group.id}><h2>{group.title}</h2><div className="collab-managed-grid">{entries.map(section => <article className="managed-page-section collab-managed-card" key={section.id}>
        {section.image ? <img src={section.image} alt={section.imageAlt || section.title}/> : <div className="collab-photo-placeholder">Photo à ajouter</div>}
        <div>{section.title && <h3>{section.title}</h3>}{section.location && <p className="managed-section-detail">{section.location}</p>}{section.date && <p className="managed-section-detail">{section.date}</p>}{section.body && <p>{section.body}</p>}{section.linkText && section.linkUrl && <a className="managed-page-section-link" href={section.linkUrl} target={section.linkUrl.startsWith("https://") ? "_blank" : undefined} rel={section.linkUrl.startsWith("https://") ? "noreferrer" : undefined}>{section.linkText}</a>}</div>
      </article>)}</div></section>;
    })}</div>;
  }
  return <div className="managed-page-sections">{page.sections.map(section => <article className={`managed-page-section${section.id === "home-video-links" ? " managed-video-section" : ""}`} key={section.id}>
    {section.image && <img src={section.image} alt={section.imageAlt || section.title} />}
    <div>{section.title && <h2>{section.title}</h2>}{section.date && <p className="managed-section-detail">{section.date}</p>}{section.location && <p className="managed-section-detail">{section.location}</p>}{section.body && <p>{section.body}</p>}{section.linkText && section.linkUrl && <a className="managed-page-section-link" href={section.linkUrl} target={section.linkUrl.startsWith("https://") ? "_blank" : undefined} rel={section.linkUrl.startsWith("https://") ? "noreferrer" : undefined}>{section.linkText}</a>}</div>
  </article>)}</div>;
}
