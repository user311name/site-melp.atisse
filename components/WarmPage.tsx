"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import type { EditablePage } from "@/lib/site-content";
import Header from "@/components/Header";
import ManagedPageSections from "@/components/ManagedPageSections";
import "@/app/landing.css";

export default function WarmPage({ eyebrow, title, emphasis, intro, image, imageAlt, children, cta = "Découvrir", includeManagedSections = true }: { eyebrow: string; title: string; emphasis: string; intro: string; image: string; imageAlt: string; children: ReactNode; cta?: string; includeManagedSections?: boolean }) {
  const pathname = usePathname();
  const pageKey = pathname.replace(/^\/+|\/+$/g, "");
  const [cmsPage, setCmsPage] = useState<EditablePage | null>(null);
  useEffect(() => { let live = true; fetch("/api/site-content", { cache: "no-store" }).then(response => response.ok ? response.json() : null).then(data => { if (live && data?.pages?.[pageKey]) setCmsPage(data.pages[pageKey]); }).catch(() => undefined); return () => { live = false; }; }, [pageKey]);
  const heroImage = cmsPage ? cmsPage.image : image;
  const heroImageAlt = cmsPage ? cmsPage.imageAlt : imageAlt;
  return <main className="warm-page"><Header/><section className="warm-hero"><div><span className="warm-eyebrow">{cmsPage?.eyebrow || eyebrow}</span><h1>{cmsPage?.title || title}<br/><em>{cmsPage?.emphasis || emphasis}</em></h1><p>{cmsPage?.intro || intro}</p>{(cmsPage?.ctaLabel || cta) && <a className="warm-button" href={cmsPage?.ctaUrl || "#contenu"}>{cmsPage?.ctaLabel || cta}<ArrowRight size={16}/></a>}</div>{heroImage ? <img src={heroImage} alt={heroImageAlt || "Photo de la rubrique"}/> : <div className="warm-hero-placeholder" role="img" aria-label={heroImageAlt || "Photo à ajouter"}><span>Photo à ajouter</span></div>}</section><section className="warm-content" id="contenu">{children}{includeManagedSections && <ManagedPageSections pageKey={pageKey}/>}</section><footer className="warm-footer"><Link href="/">Melp<i>.atisse</i></Link><span>La Plaine-sur-Mer · Pays de Retz</span><div><Link href="/patisserie">Pâtisseries</Link><Link href="/ateliers">Ateliers</Link><Link href="/contact">Contact</Link><a href="https://www.instagram.com/melp.atisse/" target="_blank" rel="noreferrer">Instagram · @melp.atisse</a></div></footer></main>;
}
