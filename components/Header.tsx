"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  ["Pâtisseries", "/patisserie"],
  ["Épicerie", "/epicerie"],
  ["Ateliers", "/ateliers"],
  ["Traiteur", "/cheffe-privee"],
  ["Événements", "/evenements"],
  ["Avis", "/avis"],
  ["À propos", "/a-propos"],
  ["Commander", "/commander"],
  ["Cartes cadeaux", "/cartes-cadeaux"],
  ["Collaborations", "/collaborations"],
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const closeOnWideScreen = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };
    const wideScreen = window.matchMedia("(min-width: 1101px)");

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    wideScreen.addEventListener("change", closeOnWideScreen);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      wideScreen.removeEventListener("change", closeOnWideScreen);
    };
  }, [open]);

  return <header className={`site-header${open ? " menu-open" : ""}`}>
    <Link href="/" className="brand" onClick={close} aria-label="Melp.atisse, accueil">
      <span>Melp</span><i>.atisse</i>
      <small>Pâtissière · Traiteur · Cheffe privée · Atelier</small>
    </Link>
    <nav className="desktop-nav" aria-label="Navigation principale">
      {links.map(([label, href]) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
    </nav>
    <Link href="/contact" className="header-contact" aria-current={pathname === "/contact" ? "page" : undefined}>Une demande ? <ArrowRight size={15}/></Link>
    <button type="button" className="mobile-menu-button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
      {open ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}
    </button>
    <div className="mobile-navigation" id="mobile-navigation" aria-hidden={!open} inert={!open}>
      <div className="mobile-navigation-inner">
        <div className="mobile-navigation-top"><span>À DÉGUSTER</span><span>LA PLAINE-SUR-MER</span></div>
        <nav className="mobile-navigation-links" aria-label="Navigation mobile">
          <Link href="/" onClick={close} aria-current={pathname === "/" ? "page" : undefined}><span>01</span><strong>Accueil</strong><ArrowRight aria-hidden="true"/></Link>
          {links.map(([label, href], index) => <Link href={href} key={href} onClick={close} aria-current={pathname === href ? "page" : undefined}>
            <span>{String(index + 2).padStart(2, "0")}</span><strong>{label}</strong><ArrowRight aria-hidden="true"/>
          </Link>)}
          <Link href="/contact" className="mobile-menu-contact" onClick={close} aria-current={pathname === "/contact" ? "page" : undefined}>
            <span>{String(links.length + 2).padStart(2, "0")}</span><strong>Écrire à Mélissa</strong><ArrowRight aria-hidden="true"/>
          </Link>
        </nav>
      </div>
    </div>
  </header>;
}
