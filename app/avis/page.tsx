"use client";

import Link from "next/link";
import ManagedPageSections from "@/components/ManagedPageSections";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import useCmsPage from "@/components/useCmsPage";
import ReviewWall from "@/components/ReviewWall";
import "./page.css";
import "./reviews.css";

export default function Avis() {
  const cmsPage = useCmsPage("avis");
  return (
    <main className="reviews-page">
      <Header />

      <section className="reviews-hero">
        <span>05 / AVIS</span>

        <h1>
          {cmsPage?.title || "Vos mots font"}
          <br />
          <i>{cmsPage?.emphasis || "vivre Melp."}</i>
        </h1>

        <p>
          {cmsPage?.intro || "Les retours de celles et ceux qui ont goûté les créations de Mélissa."}
        </p>
        {cmsPage?.image && <img className="cms-page-hero-photo" src={cmsPage.image} alt={cmsPage.imageAlt || "Création Melp.atisse"}/>}
      </section>

      <ReviewWall />

      <section className="review-final">
        <span>VOTRE EXPÉRIENCE</span>

        <h2>
          Vous avez goûté
          <br />
          à l'univers
          <br />
          <i>MELP.ATISSE ?</i>
        </h2>

        <Link href="/contact">
          Écrire à Mélissa
          <ArrowRight size={17} />
        </Link>
      </section>

          <ManagedPageSections pageKey="avis"/>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand">
              MELP<i>.ATISSE</i>
            </div>
            <p>Pâtisserie artisanale & cuisine privée.</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <span>Explorer</span>
              <Link href="/">Accueil</Link>
              <Link href="/patisserie">Pâtisserie</Link>
              <Link href="/cheffe-privee">Cheffe privée</Link>
            </div>

            <div className="footer-column">
              <span>Contact</span>
              <Link href="/contact">Demander un devis</Link>
              <Link href="/evenements">Événements</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 MELP.ATISSE</span>
          <span>La Plaine-sur-Mer & alentours</span>
        </div>
      </footer>
    </main>
  );
}
