"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import useCmsPage from "@/components/useCmsPage";
import "./page.css";

const values = [
  {
    number: "01",
    title: "Générosité",
    text: "Des créations faites pour être découvertes, dégustées et partagées.",
    tags: "PARTAGE   /   PLAISIR   /   CONVIVIALITÉ",
    image:
      "/images/gateau-fraises.png",
  },
  {
    number: "02",
    title: "Précision",
    text: "Chaque geste compte. Chaque détail participe à l’expérience.",
    tags: "RIGUEUR   /   EXIGENCE   /   MAÎTRISE",
    image:
      "/images/number-cake-choux.png",
  },
  {
    number: "03",
    title: "Créativité",
    text: "Des recettes libres, élégantes et imaginées autour de chaque projet.",
    tags: "INSPIRATION   /   AUDACE   /   SUR-MESURE",
    image:
      "/images/number-cake-chocolat-fleurs.png",
  },
  {
    number: "04",
    title: "Sincérité",
    text: "De bons produits, une cuisine authentique et un travail fait avec passion.",
    tags: "TRANSPARENCE   /   AUTHENTICITÉ   /   PASSION",
    image:
      "/images/traiteur-planche-festive.png",
  },
];

export default function APropos() {
  const cmsPage = useCmsPage("a-propos");
  const editableValues = cmsPage ? cmsPage.sections.map((section,index) => ({ number: String(index + 1).padStart(2,"0"), title: section.title, text: section.body, tags: values[index]?.tags || "", image: section.image || values[index]?.image || "" })) : values;
  return (
    <main className="about-page">
      <Header />

      {/* =====================================================
          INTRO VALEURS
      ===================================================== */}

      <section className="values-intro">
        <div className="values-intro-left">
          <span className="small-label">MES VALEURS</span>

          <h1>
            {cmsPage?.title || "Ce qui me"}
            <br />
            <em>{cmsPage?.emphasis || "guide."}</em>
          </h1>
        </div>

        <div className="values-intro-middle">
          <p>
            {cmsPage?.intro || <>Des valeurs simples
            <br />
            et essentielles, qui donnent
            <br />
            du sens à chaque création.</>}
          </p>
        </div>

        <div className="values-intro-right">
          <span>MELP.ATISSE</span>
          <span>04 / VALEURS</span>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-photo"><img src={cmsPage?.image || "/images/carte-photo-1.png"} alt={cmsPage?.imageAlt || "Création pâtissière photographiée dans l’univers Melp.atisse"}/></div>
        <div className="about-story-copy">
          <span className="small-label">LE PARCOURS DE MÉLISSA</span>
          <h2>La pâtisserie, <em>avec intention.</em></h2>
          <p>Mélissa Garnier est pâtissière, cheffe privée et traiteur à La Plaine-sur-Mer. Elle est formée au BTM Pâtissier-Chocolatier-Glacier-Confiseur-Traiteur.</p>
          <p>Avec Melp.atisse, elle imagine des pâtisseries fines sur commande, en travaillant les textures, les saveurs et le soin du décor. Chaque création prend forme au fil des échanges autour de l’occasion et des envies.</p>
          <Link href="/contact">Échanger avec Mélissa <ArrowUpRight size={16}/></Link>
        </div>
      </section>

      {/* =====================================================
          3D CARDS
      ===================================================== */}

      <section className="values-cards">
        {editableValues.map((value) => (
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

      <section className="brand-card-showcase">
        <div>
          <span className="small-label">L’IDENTITÉ MELP.ATISSE</span>
          <h2>Une carte pensée<br/><em>à son image.</em></h2>
          <p>Les couleurs, les formes et les créations de la carte de visite inspirent l’univers du site.</p>
        </div>
        <div className="brand-card-pair">
          <img data-melp-media-id="about-card-front" src="/images/melp-carte-recto.png" alt="Recto de la carte de visite Melp.atisse"/>
          <img data-melp-media-id="about-card-back" src="/images/melp-carte-verso.png" alt="Verso de la carte de visite Melp.atisse avec coordonnées"/>
        </div>
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
