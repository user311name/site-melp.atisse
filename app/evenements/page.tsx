"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
} from "lucide-react";
import Header from "@/components/Header";
import "./page.css";

const eventTypes = [
  {
    number: "01",
    title: "Mariage",
    text: "Une réception à votre image, de la première création au dernier détail.",
  },
  {
    number: "02",
    title: "Anniversaire",
    text: "Une création unique et une table pensée pour votre moment.",
  },
  {
    number: "03",
    title: "Entreprise",
    text: "Cocktails, repas et expériences culinaires professionnelles.",
  },
  {
    number: "04",
    title: "Réception",
    text: "Une expérience entièrement personnalisée chez vous.",
  },
];

export default function Evenements() {

  return (
    <main className="events-page">
      <Header />

      {/* HERO */}
      <section className="events-hero">
        <div className="hero-image" />
        <div className="hero-vignette" />
        <div className="hero-grain" />

        <div className="hero-content">
          <span className="section-number">03 / ÉVÉNEMENTS</span>

          <h1>
            Les grands
            <br />
            moments
            <br />
            <em>méritent mieux.</em>
          </h1>

          <p>
            Des expériences sur mesure pensées autour de votre histoire,
            avec élégance, précision et gourmandise.
          </p>

          <a href="#reservation" className="hero-link">
            <span>Voir les disponibilités</span>
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="hero-meta">
          <span>44°56&apos;N</span>
          <span>LA PLAINE-SUR-MER</span>
        </div>

        <div className="hero-scroll">
          <span>SCROLL</span>
          <i />
        </div>
      </section>

      {/* INTRO */}
      <section className="events-intro">
        <div className="intro-heading">
          <span className="section-number dark">VOS OCCASIONS</span>
          <h2>
            Créer autour
            <br />
            <em>de l&apos;instant.</em>
          </h2>
        </div>

        <div className="intro-copy">
          <span className="intro-index">MELP / 03</span>
          <p>
            Mariage, anniversaire, baptême, réception privée ou événement
            professionnel : chaque occasion mérite une expérience pensée
            jusque dans les détails.
          </p>
          <div className="intro-line" />
        </div>
      </section>

      {/* EVENT CARDS */}
      <section className="event-types">
        <div className="types-header">
          <span>DES EXPÉRIENCES</span>
          <span>01 — 04</span>
        </div>

        <div className="types-grid">
          {eventTypes.map((event) => (
            <article className="event-card" key={event.number}>
              <div className="card-glow" />
              <div className="card-top">
                <span>{event.number}</span>
                <ArrowRight size={17} />
              </div>

              <div className="card-content">
                <h3>{event.title}</h3>
                <p>{event.text}</p>
              </div>

              <div className="card-bottom">
                <span>EXPÉRIENCE SUR MESURE</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="events-showcase">
        <div className="showcase-main">
          <img
            src="/images/traiteur-planche-festive.png"
            alt="Planche traiteur festive réalisée par Melp.atisse"
          />
          <div className="image-overlay" />
          <span>01 / RÉCEPTION</span>
        </div>

        <div className="showcase-side">
          <div className="showcase-small">
            <img
              src="/images/number-cake-tropical.png"
              alt="Number cake personnalisé, création Melp.atisse"
            />
            <span>02 / CRÉATION</span>
          </div>

          <div className="showcase-text">
            <span className="section-number dark">L&apos;ATTENTION AU DÉTAIL</span>
            <p>
              Une esthétique sobre, des créations sur mesure et une attention
              particulière portée à chaque invité.
            </p>
            <div className="signature">MELP<i>.ATISSE</i></div>
          </div>
        </div>
      </section>

      {/* DATE & ATELIERS PARTENAIRES */}
      <section className="booking" id="reservation">
        <div className="booking-intro">
          <span className="section-number">05 / DISPONIBILITÉS</span>
          <h2>Une date à<br/><em>imaginer.</em></h2>
          <p>Les prestations traiteur et cheffe privée se préparent sur demande. Après un premier échange, Mélissa vérifie la date et la capacité de production avant de confirmer votre projet.</p>
          <Link href="/contact" className="calendar-continue">Décrire mon événement <ArrowRight size={15}/></Link>
        </div>
        <div className="calendar-wrap">
          <div className="calendar-card">
            <span className="section-number dark">RENDEZ-VOUS À SAVENAY</span>
            <h3>Les ateliers du premier samedi</h3>
            <p>Retrouvez les prochains thèmes et réservez directement sur le site de C’est moi qui l’ai fait, notre partenaire à Savenay.</p>
            <a className="calendar-continue" href="https://cmqlf.com/categorie/boutique-cest-moi-qui-lai-fait/ateliers-cuisine/" target="_blank" rel="noreferrer">Voir le programme partenaire <ArrowRight size={15}/></a>
          </div>
        </div>
      </section>
      {/* FINAL CTA */}
      <section className="events-cta">
        <div className="cta-circle circle-one" />
        <div className="cta-circle circle-two" />

        <div className="cta-inner">
          <div className="cta-icon">
            <CalendarDays size={20} />
          </div>

          <span className="section-number dark">
            UNE DATE · UN MOMENT · UNE HISTOIRE
          </span>

          <h2>
            Votre événement
            <br />
            <em>commence ici.</em>
          </h2>

          <div className="cta-points">
            <span><Check size={14} /> Sur mesure</span>
            <span><Check size={14} /> Pâtisserie & cuisine</span>
            <span><Check size={14} /> Accompagnement</span>
          </div>

          <Link href="/contact" className="cta-button">
            Demander un devis
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand">
              MELP<i>.ATISSE</i>
            </div>
            <p>Pâtisserie artisanale & cuisine privée.</p>
          </div>

          <div className="footer-links">
            <div>
              <span>EXPLORER</span>
              <Link href="/">Accueil</Link>
              <Link href="/patisserie">Pâtisserie</Link>
              <Link href="/cheffe-privee">Cheffe privée</Link>
            </div>

            <div>
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
