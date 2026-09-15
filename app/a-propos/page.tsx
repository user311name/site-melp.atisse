"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import "./page.css";

const values = [
  {
    number: "01",
    title: "Générosité",
    text: "Des créations faites pour être découvertes, dégustées et partagées.",
    tags: "PARTAGE   /   PLAISIR   /   CONVIVIALITÉ",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=90",
  },
  {
    number: "02",
    title: "Précision",
    text: "Chaque geste compte. Chaque détail participe à l’expérience.",
    tags: "RIGUEUR   /   EXIGENCE   /   MAÎTRISE",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1400&q=90",
  },
  {
    number: "03",
    title: "Créativité",
    text: "Des recettes libres, élégantes et imaginées autour de chaque projet.",
    tags: "INSPIRATION   /   AUDACE   /   SUR-MESURE",
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1400&q=90",
  },
  {
    number: "04",
    title: "Sincérité",
    text: "De bons produits, une cuisine authentique et un travail fait avec passion.",
    tags: "TRANSPARENCE   /   AUTHENTICITÉ   /   PASSION",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=90",
  },
];

export default function APropos() {
  return (
    <main className="about-page">
      <Header />

      {/* =====================================================
          INTRO VALEURS
      ===================================================== */}

      <section className="values-intro">
        <div className="values-intro-left">
          <span className="small-label">NOS VALEURS</span>

          <h1>
            Ce qui nous
            <br />
            <em>guide.</em>
          </h1>
        </div>

        <div className="values-intro-middle">
          <p>
            Des valeurs simples
            <br />
            et essentielles, qui donnent
            <br />
            du sens à chaque création.
          </p>
        </div>

        <div className="values-intro-right">
          <span>MELP.ATISSE</span>
          <span>04 / VALEURS</span>
        </div>
      </section>

      {/* =====================================================
          3D CARDS
      ===================================================== */}

      <section className="values-cards">
        {values.map((value) => (
          <article className="value-card" key={value.number}>
            <div className="value-card-inner">
              {/* Numéro */}
              <div className="value-card-number">
                {value.number}
              </div>

              {/* Contenu */}
              <div className="value-card-content">
                <h2>{value.title}</h2>

                <p>{value.text}</p>

                <span className="value-tags">
                  {value.tags}
                </span>
              </div>

              {/* Photo */}
              <div className="value-card-image">
                <img src={value.image} alt={value.title} />

                <div className="image-dark" />
              </div>

              {/* Flèche */}
              <div className="value-card-arrow">
                <ArrowUpRight
                  size={22}
                  strokeWidth={1.4}
                />
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* =====================================================
          BAS DE SECTION
      ===================================================== */}

      <section className="values-footer-line">
        <div>
          <span>DES CRÉATIONS</span>
          <small>QUI ONT DU SENS</small>
        </div>

        <div className="line" />

        <span>MELP.ATISSE</span>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="about-cta">
        <span className="small-label">MELP.ATISSE</span>

        <h2>
          Faire simple.
          <br />
          Faire bon.
          <br />
          <em>Faire vrai.</em>
        </h2>

        <Link href="/contact" className="cta-button">
          Parlons de votre projet
          <ArrowUpRight size={18} strokeWidth={1.4} />
        </Link>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

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
              <span>EXPLORER</span>

              <Link href="/">Accueil</Link>
              <Link href="/patisserie">Pâtisserie</Link>
              <Link href="/cheffe-privee">Cheffe privée</Link>
              <Link href="/evenements">Événements</Link>
            </div>

            <div className="footer-column">
              <span>CONTACT</span>

              <Link href="/contact">Demander un devis</Link>
              <Link href="/avis">Avis</Link>
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