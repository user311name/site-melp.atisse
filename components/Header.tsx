"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className={`site-header ${open ? "menu-open" : ""}`}>
      {/* =====================================================
          LOGO
      ===================================================== */}

      <Link
        href="/"
        className="brand"
        onClick={closeMenu}
      >
        <span>MELP</span>
        <i>.ATISSE</i>
      </Link>

      {/* =====================================================
          NAVIGATION DESKTOP
      ===================================================== */}

      <nav className="desktop-nav">
        <Link href="/" onClick={closeMenu}>
          Accueil
        </Link>

        <Link href="/patisserie" onClick={closeMenu}>
          Pâtisserie
        </Link>

        <Link href="/cheffe-privee" onClick={closeMenu}>
          Cheffe privée
        </Link>

        <Link href="/evenements" onClick={closeMenu}>
          Événements
        </Link>

        <Link href="/a-propos" onClick={closeMenu}>
          À propos
        </Link>

        <Link href="/contact" onClick={closeMenu}>
          Contact
        </Link>
      </nav>

      {/* =====================================================
          BOUTON CONTACT DESKTOP
      ===================================================== */}

      <Link
        href="/contact"
        className="header-contact"
        onClick={closeMenu}
      >
        <span>Demander un devis</span>
        <ArrowRight size={15} />
      </Link>

      {/* =====================================================
          BOUTON MOBILE — 3 TRAITS
      ===================================================== */}

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          open
            ? "Fermer le menu"
            : "Ouvrir le menu"
        }
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        {open ? (
          <X
            size={27}
            strokeWidth={1.5}
          />
        ) : (
          <Menu
            size={29}
            strokeWidth={1.5}
          />
        )}
      </button>

      {/* =====================================================
          MENU MOBILE
      ===================================================== */}

      <div
        id="mobile-navigation"
        className={`mobile-navigation ${
          open
            ? "mobile-navigation-open"
            : ""
        }`}
        aria-hidden={!open}
      >
        <div className="mobile-navigation-inner">

          <div className="mobile-navigation-top">
            <span>MENU</span>
            <span>06 / NAVIGATION</span>
          </div>

          <nav className="mobile-navigation-links">

            <Link
              href="/"
              onClick={closeMenu}
            >
              <span>01</span>
              <strong>Accueil</strong>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/patisserie"
              onClick={closeMenu}
            >
              <span>02</span>
              <strong>Pâtisserie</strong>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/cheffe-privee"
              onClick={closeMenu}
            >
              <span>03</span>
              <strong>Cheffe privée</strong>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/evenements"
              onClick={closeMenu}
            >
              <span>04</span>
              <strong>Événements</strong>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/a-propos"
              onClick={closeMenu}
            >
              <span>05</span>
              <strong>À propos</strong>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/contact"
              onClick={closeMenu}
            >
              <span>06</span>
              <strong>Contact</strong>
              <ArrowRight size={18} />
            </Link>

          </nav>

          <div className="mobile-navigation-bottom">
            <span>LA PLAINE-SUR-MER & ALENTOURS</span>

            <Link
              href="/contact"
              onClick={closeMenu}
            >
              Demander un devis
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}