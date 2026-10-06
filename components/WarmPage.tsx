"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import "@/app/landing.css";

export default function WarmPage({ eyebrow, title, emphasis, intro, image, imageAlt, children, cta = "Découvrir" }: { eyebrow: string; title: string; emphasis: string; intro: string; image: string; imageAlt: string; children: ReactNode; cta?: string }) {
  return <main className="warm-page"><Header/><section className="warm-hero"><div><span className="warm-eyebrow">{eyebrow}</span><h1>{title}<br/><em>{emphasis}</em></h1><p>{intro}</p>{cta && <a className="warm-button" href="#contenu">{cta}<ArrowRight size={16}/></a>}</div><img src={image} alt={imageAlt}/></section><section className="warm-content" id="contenu">{children}</section><footer className="warm-footer"><Link href="/">MELP<i>.ATISSE</i></Link><span>La Plaine-sur-Mer · Pays de Retz</span><div><Link href="/patisserie">Pâtisseries</Link><Link href="/ateliers">Ateliers</Link><Link href="/contact">Contact</Link><a href="https://www.instagram.com/melp.atisse/" target="_blank" rel="noreferrer">Instagram · @melp.atisse</a></div></footer></main>;
}
