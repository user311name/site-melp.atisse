"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Pâtisseries", "/patisserie"],
  ["Épicerie", "/epicerie"],
  ["Fidélité", "/fidelite"],
  ["Ateliers", "/ateliers"],
  ["Traiteur", "/cheffe-privee"],
  ["À propos", "/a-propos"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return <header className={`site-header ${open ? "menu-open" : ""}`}>
    <Link href="/" className="brand" onClick={close}><span>MELP</span><i>.ATISSE</i><small>PÂTISSERIE ARTISANALE</small></Link>
    <nav className="desktop-nav" aria-label="Navigation principale">{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <Link href="/contact" className="header-contact">Une demande ? <ArrowRight size={15}/></Link>
    <button type="button" className="mobile-menu-button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    <div className="mobile-navigation" id="mobile-navigation" aria-hidden={!open}><div className="mobile-navigation-inner"><div className="mobile-navigation-top"><span>À DÉGUSTER</span><span>LA PLAINE-SUR-MER</span></div><nav className="mobile-navigation-links"><Link href="/" onClick={close}><span>01</span><strong>Accueil</strong><ArrowRight/></Link>{links.map(([label, href], i) => <Link href={href} key={href} onClick={close}><span>{String(i + 2).padStart(2,"0")}</span><strong>{label}</strong><ArrowRight/></Link>)}<Link href="/evenements" onClick={close}><span>08</span><strong>Événements</strong><ArrowRight/></Link><Link href="/avis" onClick={close}><span>09</span><strong>Avis</strong><ArrowRight/></Link><Link href="/contact" className="mobile-menu-contact" onClick={close}><span>10</span><strong>Écrire à Mélissa</strong><ArrowRight/></Link></nav></div></div>
  </header>;
}
