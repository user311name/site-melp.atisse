import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import Header from "@/components/Header";
import "./page.css";

const reviews = [
  {
    text: "Une création magnifique, aussi belle que délicieuse. Tout le monde a adoré.",
    name: "Camille",
    type: "Anniversaire",
  },
  {
    text: "Une cheffe passionnée, à l'écoute et incroyablement créative. Une vraie expérience.",
    name: "Marion",
    type: "Dîner privé",
  },
  {
    text: "Le gâteau était sublime. Les détails, les goûts, la présentation… tout était parfait.",
    name: "Sarah",
    type: "Événement",
  },
  {
    text: "Une très belle découverte. Tout était pensé avec beaucoup de soin.",
    name: "Julie",
    type: "Pâtisserie",
  },
  {
    text: "Une prestation au-delà de nos attentes. Nous recommandons sans hésiter.",
    name: "Thomas",
    type: "Réception",
  },
  {
    text: "Des produits excellents et une vraie attention portée aux détails.",
    name: "Claire",
    type: "Anniversaire",
  },
];

export default function Avis() {
  return (
    <main className="reviews-page">
      <Header />

      <section className="reviews-hero">
        <span>05 / AVIS</span>

        <h1>
          Ils en parlent
          <br />
          <i>mieux que moi.</i>
        </h1>

        <p>
          Parce que la plus belle récompense reste celle de voir les gens
          repartir avec le sourire.
        </p>
      </section>

      <section className="reviews-grid">
        {reviews.map((review, index) => (
          <article key={review.name} className="review-item">
            <div className="review-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </div>

            <span className="review-number">
              0{index + 1}
            </span>

            <blockquote>“{review.text}”</blockquote>

            <div className="review-author">
              <strong>{review.name}</strong>
              <span>{review.type}</span>
            </div>
          </article>
        ))}
      </section>

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
          Partager votre expérience
          <ArrowRight size={17} />
        </Link>
      </section>

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