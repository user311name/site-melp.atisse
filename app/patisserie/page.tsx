"use client";

import ManagedPageSections from "@/components/ManagedPageSections";
import { useEffect, useMemo, useState } from "react";
import { pastryCatalog, type PastryProduct } from "@/lib/pastry-catalog";
import type { EditablePage } from "@/lib/site-content";
import type { CustomerReview, ReviewCategory } from "@/lib/reviews";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Plus,
  Send,
  Star,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import "./page.css";
import "./reviews.css";




const categories = [
  "Toutes",
  "Gâteaux",
  "Number cakes",
  "Entremets",
  "Traiteur",
];

export default function Patisserie() {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [catalog, setCatalog] = useState<PastryProduct[]>(pastryCatalog);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [cmsPage, setCmsPage] = useState<EditablePage | null>(null);
  useEffect(() => { fetch("/api/site-content", { cache: "no-store" }).then(response => response.ok ? response.json() : null).then((content: { patisserie?: { products?: PastryProduct[] }; pages?: Record<string, EditablePage> } | null) => { if (Array.isArray(content?.patisserie?.products)) setCatalog(content.patisserie.products); if (content?.pages?.patisserie) setCmsPage(content.pages.patisserie); }).catch(() => undefined); }, []);
  useEffect(() => { fetch("/api/reviews", { cache: "no-store" }).then(response => response.ok ? response.json() : null).then((result: { reviews?: CustomerReview[] } | null) => { if (Array.isArray(result?.reviews)) setReviews(result.reviews); }).catch(() => undefined); }, []);
  const [selectedProduct, setSelectedProduct] =
    useState<PastryProduct | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewCategory, setReviewCategory] = useState<ReviewCategory>("Pâtisserie");
  const [reviewConsent, setReviewConsent] = useState(false);

  const filteredProducts = useMemo(() => {
    const published = catalog.filter(product => product.name.trim());
    if (activeCategory === "Toutes") {
      return published;
    }

    return catalog.filter(
      (product) => product.name.trim() && product.category === activeCategory,
    );
  }, [activeCategory, catalog]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const submitReview = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!reviewName.trim() || reviewText.trim().length < 10 || !reviewConsent) {
      setReviewMessage("Indiquez votre prénom, un avis d’au moins 10 caractères et acceptez sa publication.");
      return;
    }
    setReviewMessage("");
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: reviewName, text: reviewText, rating: reviewRating, category: reviewCategory, consent: reviewConsent }) });
      const result = await response.json().catch(() => null) as { error?: string; message?: string; review?: CustomerReview } | null;
      if (!response.ok) throw new Error(result?.error || "Impossible d’enregistrer ton avis.");
      const updated = await fetch("/api/reviews", { cache: "no-store" }).then(value => value.json()) as { reviews?: CustomerReview[] };
      if (Array.isArray(updated.reviews)) setReviews(updated.reviews);
      setReviewMessage(result?.message || "Merci ! Votre avis est publié sur le site.");
      setReviewName(""); setReviewText(""); setReviewRating(5); setReviewCategory("Pâtisserie"); setReviewConsent(false);
    } catch (error) {
      setReviewMessage(error instanceof Error ? error.message : "Impossible d’enregistrer ton avis.");
    }
  };

  return (
    <main className="patisserie-page">
      <Header />

      <section className="pas-hero">
        <div className="pas-hero-background" />

        <div className="pas-hero-content">
          <div className="pas-kicker">
            <span>01</span>
            <i />
            <span>{cmsPage?.eyebrow || "PÂTISSERIE ARTISANALE"}</span>
          </div>

          <h1>
            {cmsPage?.title || "La gourmandise"}
            <br />
            <em>{cmsPage?.emphasis || "comme signature."}</em>
          </h1>

          <p>
            {cmsPage?.intro || "Des créations imaginées, façonnées et dressées à la main, directement depuis l’atelier MELP.ATISSE."}
          </p>

          <a href={cmsPage?.ctaUrl || "#creations"} className="pas-hero-link">
            {cmsPage?.ctaLabel || "Découvrir les créations"}
            <ArrowRight size={17} />
          </a>
        </div>

        {cmsPage?.image && <img className="pas-cms-hero-image" src={cmsPage.image} alt={cmsPage.imageAlt || "Création Melp.atisse"}/>}
        <div className="pas-hero-side">
          <span>MADE WITH</span>
          <strong>PASSION</strong>
          <small>La Plaine-sur-Mer & alentours</small>
        </div>

        <div className="pas-scroll">
          <span>SCROLL</span>
          <i />
        </div>
      </section>

      <section className="pas-intro">
        <div className="pas-intro-label">
          <span>02</span>
          <p>L&apos;atelier</p>
        </div>

        <div className="pas-intro-main">
          <p className="pas-overline">
            CRÉATIONS ARTISANALES
          </p>

          <h2>
            Chaque pièce
            <br />
            <em>raconte une histoire.</em>
          </h2>

          <div className="pas-intro-bottom">
            <p>
              Je travaille chaque création comme une petite pièce
              d&apos;atelier : des produits soigneusement choisis, des
              textures travaillées et une attention particulière portée
              au détail.
            </p>

            <div className="pas-intro-stat">
              <strong>100%</strong>
              <span>fait maison</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pas-catalogue" id="creations">
        <div className="pas-catalogue-head">
          <div>
            <span className="pas-overline">
              03 / COLLECTION
            </span>

            <h2>
              Les créations
              <br />
              <em>du moment.</em>
            </h2>
          </div>

          <p>
            Explorez les créations MELP.ATISSE et cliquez sur une
            pièce pour découvrir son univers.
          </p>
        </div>

        <div className="warm-note">Fiches de présentation à valider avec Mélissa avant publication : recettes, formats, tarifs, allergènes, photos et disponibilité seront précisés produit par produit.</div>

        <div className="pas-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="pas-products">
          {filteredProducts.map((product, index) => (
            <article
              className={`pas-product ${
                index % 2 === 0
                  ? "pas-product-large"
                  : "pas-product-small"
              }`}
              key={product.id}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="pas-product-card">
                <div className="pas-product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div className="pas-product-number">
                    0{product.id}
                  </div>

                  {product.popular && (
                    <div className="pas-popular">
                      LES PLUS AIMÉS
                    </div>
                  )}

                  <button
                    type="button"
                    className={`pas-heart ${
                      favorites.includes(product.id)
                        ? "liked"
                        : ""
                    }`}
                    aria-label="Ajouter aux favoris"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <Heart
                      size={18}
                      fill={
                        favorites.includes(product.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <div className="pas-product-hover">
                    <span>Voir la création</span>
                    <ArrowRight size={18} />
                  </div>
                </div>

                <div className="pas-product-info">
                  <div>
                    <span>{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.eyebrow}</p>
                  </div>

                  <strong>{product.price}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pas-featured">
        <div className="pas-featured-image">
          <img
            src={catalog[1]?.image ?? pastryCatalog[1].image}
            alt={catalog[1]?.name || "Création pâtissière Melp.atisse"}
          />

          <div className="pas-featured-floating">
            <span>CRÉATION</span>
            <strong>01</strong>
          </div>
        </div>

        <div className="pas-featured-copy">
          <span className="pas-overline">
            04 / SIGNATURE
          </span>

          <h2>
            Le goût
            <br />
            <em>avant tout.</em>
          </h2>

          <p>
            Une pâtisserie élégante ne se résume pas à son
            apparence. Chaque création est pensée pour offrir une
            vraie expérience : le premier regard, le parfum, la
            texture puis le goût.
          </p>

          <button
            type="button"
            onClick={() => setSelectedProduct(catalog[1] ?? pastryCatalog[1])}
          >
            Découvrir la signature
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <section className="pas-reviews">
        <div className="pas-reviews-header">
          <div>
            <span className="pas-overline">
              05 / AVIS
            </span>

            <h2>
              Vos mots,
              <br />
              <em>les plus précieux.</em>
            </h2>
          </div>

          <div className="pas-rating-summary">
            <strong>{reviews.length ? averageRating.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "—"}</strong>

            <div>
              {reviews.length ? <div className="stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill={star <= Math.round(averageRating) ? "currentColor" : "none"} />)}</div> : <span>Aucun avis publié</span>}

              <span>{reviews.length} avis</span>
            </div>
          </div>
        </div>

        <div className="pas-reviews-grid">
          {reviews.length === 0 && (
            <p className="pas-review-empty">Les avis clients seront affichés ici lorsqu’ils auront été recueillis et validés.</p>
          )}
          {reviews.slice(0, 3).map((review, index) => (
            <article
              className="pas-review"
              key={`${review.name}-${index}`}
            >
              <div className="pas-review-top">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill={
                        star <= review.rating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>

                <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString("fr-FR")}</time>
              </div>

              <p>“{review.text}”</p>

              <strong>{review.name}</strong>
            </article>
          ))}
        </div>

        <div className="pas-review-action">
          <button
            type="button"
            onClick={() => setReviewOpen(true)}
          >
            <Plus size={17} />
            Laisser un avis
          </button>
        </div>
      </section>

      <section className="pas-custom">
        <div className="pas-custom-image">
          <img
            data-melp-media-id="pastry-custom"
            src="/images/number-cake-tropical.png"
            alt="Number cake personnalisé au décor tropical et chocolaté"
          />
        </div>

        <div className="pas-custom-copy">
          <span className="pas-overline">
            06 / SUR MESURE
          </span>

          <h2>
            Vous imaginez.
            <br />
            <em>Je crée.</em>
          </h2>

          <p>
            Anniversaire, mariage, naissance, événement
            professionnel ou simplement une envie particulière :
            racontez-moi votre idée et imaginons ensemble une
            création qui vous ressemble.
          </p>

          <Link href="/contact">
            Parler de mon projet
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="pas-instagram">
        <div className="pas-instagram-head">
          <div>
            <span className="pas-overline">
              07 / INSTAGRAM
            </span>

            <h2>
              Dans les coulisses
              <br />
              <em>de l&apos;atelier.</em>
            </h2>
          </div>

          <a
            href="https://www.instagram.com/melp.atisse/"
            target="_blank"
            rel="noreferrer"
            className="pas-instagram-link"
          >
            <span className="pas-instagram-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect
                  x="3.25"
                  y="3.25"
                  width="17.5"
                  height="17.5"
                  rx="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle
                  cx="17.35"
                  cy="6.65"
                  r="1"
                  fill="currentColor"
                />
              </svg>
            </span>

            @melp.atisse

            <span className="pas-instagram-arrow" aria-hidden="true">
              <ArrowUpRight size={16} strokeWidth={1.3} />
            </span>
          </a>
        </div>

        <div className="pas-instagram-grid">
          <a
            href="https://www.instagram.com/melp.atisse/"
            target="_blank"
            rel="noreferrer"
            className="pas-insta-image"
          >
            <img
              data-melp-media-id="pastry-instagram-1"
              src="/images/number-cake-vanille-fleurs.png"
              alt="Number cake décoré de crème pochée et de fleurs"
            />

            <div className="pas-insta-overlay">
              <span className="pas-insta-number">01</span>
              <span className="pas-insta-caption">
                Number cake fleuri
              </span>
              <span className="pas-insta-open" aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={1.3} />
              </span>
            </div>
          </a>

          <a
            href="https://www.instagram.com/melp.atisse/"
            target="_blank"
            rel="noreferrer"
            className="pas-insta-image"
          >
            <img
              data-melp-media-id="pastry-instagram-2"
              src="/images/gateau-framboises-fleurs.png"
              alt="Gâteau décoré de framboises et de fleurs"
            />

            <div className="pas-insta-overlay">
              <span className="pas-insta-number">02</span>
              <span className="pas-insta-caption">
                Framboises & fleurs
              </span>
              <span className="pas-insta-open" aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={1.3} />
              </span>
            </div>
          </a>

          <a
            href="https://www.instagram.com/melp.atisse/"
            target="_blank"
            rel="noreferrer"
            className="pas-insta-image"
          >
            <img
              data-melp-media-id="pastry-instagram-3"
              src="/images/number-cake-choux.png"
              alt="Number cake garni de petits choux et de fleurs"
            />

            <div className="pas-insta-overlay">
              <span className="pas-insta-number">03</span>
              <span className="pas-insta-caption">
                Number cake aux choux
              </span>
              <span className="pas-insta-open" aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={1.3} />
              </span>
            </div>
          </a>

          <a
            href="https://www.instagram.com/melp.atisse/"
            target="_blank"
            rel="noreferrer"
            className="pas-insta-image"
          >
            <img
              data-melp-media-id="pastry-instagram-4"
              src="/images/entremets-chocolat-noisettes.png"
              alt="Entremets au décor chocolat et noisettes"
            />

            <div className="pas-insta-overlay">
              <span className="pas-insta-number">04</span>
              <span className="pas-insta-caption">
                Chocolat & noisettes
              </span>
              <span className="pas-insta-open" aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={1.3} />
              </span>
            </div>
          </a>
        </div>

        <div className="pas-instagram-bottom">
          <span>
            PÂTISSERIE ARTISANALE
          </span>

          <span>
            CRÉATIONS · SAVOIR-FAIRE · PASSION
          </span>

          <a
            href="https://www.instagram.com/melp.atisse/"
            target="_blank"
            rel="noreferrer"
          >
            Voir le profil Instagram
            <span className="pas-instagram-bottom-arrow" aria-hidden="true">
              <ArrowUpRight size={16} strokeWidth={1.3} />
            </span>
          </a>
        </div>
      </section>

          <ManagedPageSections pageKey="patisserie"/>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand">
              MELP<i>.ATISSE</i>
            </div>

            <p>
              Pâtisserie artisanale & cuisine privée.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <span>Explorer</span>

              <Link href="/">Accueil</Link>
              <Link href="/cheffe-privee">
                Cheffe privée
              </Link>
              <Link href="/evenements">
                Événements
              </Link>
            </div>

            <div className="footer-column">
              <span>Contact</span>

              <Link href="/contact">
                Demander un devis
              </Link>

              <Link href="/avis">Avis</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 MELP.ATISSE</span>
          <span>
            La Plaine-sur-Mer & alentours
          </span>
        </div>
      </footer>

      {selectedProduct && (
        <div
          className="pas-modal-backdrop"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="pas-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="pas-modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <div className="pas-modal-image">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />

              <span>0{selectedProduct.id}</span>
            </div>

            <div className="pas-modal-content">
              <span className="pas-modal-category">
                {selectedProduct.category}
              </span>

              <h2>{selectedProduct.name}</h2>

              <p className="pas-modal-eyebrow">
                {selectedProduct.eyebrow}
              </p>

              <p className="pas-modal-description">
                {selectedProduct.description}
              </p>

              <div className="pas-modal-price">
                <strong>{selectedProduct.price}</strong>
                <span>{selectedProduct.weight}</span>
              </div>

              <div className="pas-detail-grid">
                <div>
                  <span>INGRÉDIENTS</span>

                  <ul>
                    {selectedProduct.ingredients.map(
                      (ingredient) => (
                        <li key={ingredient}>
                          {ingredient}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div>
                  <span>NOTES</span>

                  <div className="pas-notes">
                    {selectedProduct.notes.map(
                      (note) => (
                        <em key={note}>{note}</em>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="pas-allergens">
                <span>ALLERGÈNES</span>

                <p>
                  {selectedProduct.allergens.join(
                    " · ",
                  )}
                </p>
              </div>

              <div className="pas-conservation">
                <span>CONSERVATION</span>

                <p>
                  {selectedProduct.conservation}
                </p>
              </div>

              <div className="pas-conservation">
                <span>DISPONIBILITÉ</span>
                <p>{selectedProduct.availability || "À confirmer avec Mélissa au moment de la demande."}</p>
              </div>

              <div className="pas-modal-actions">
                <button
                  type="button"
                  className="pas-modal-favorite"
                  onClick={() =>
                    toggleFavorite(
                      selectedProduct.id,
                    )
                  }
                >
                  <Heart
                    size={17}
                    fill={
                      favorites.includes(
                        selectedProduct.id,
                      )
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {favorites.includes(
                    selectedProduct.id,
                  )
                    ? "Dans mes favoris"
                    : "Ajouter aux favoris"}
                </button>

                <Link href={`/commander?creation=${encodeURIComponent(selectedProduct.name)}`}>
                  Demander cette création
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewOpen && (
        <div
          className="pas-review-backdrop"
          onClick={() => setReviewOpen(false)}
        >
          <div
            className="pas-review-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="pas-modal-close"
              onClick={() => setReviewOpen(false)}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <span className="pas-overline">
              VOTRE EXPÉRIENCE
            </span>

            <h2>
              Laisser
              <br />
              <em>un avis.</em>
            </h2>

            <form onSubmit={submitReview}>
              <label>
                Votre prénom

                <input
                  value={reviewName}
                  onChange={(event) =>
                    setReviewName(
                      event.target.value,
                    )
                  }
                  placeholder="Ex. Camille"
                />
              </label>

              <label>Ce dont tu souhaites parler
                <select value={reviewCategory} onChange={event => setReviewCategory(event.target.value as ReviewCategory)}>
                  <option>Pâtisserie</option><option>Traiteur</option><option>Atelier</option><option>Autre</option>
                </select>
              </label>

              <label>
                Votre note

                <div className="pas-rating-input">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() =>
                          setReviewRating(star)
                        }
                        aria-label={`${star} étoile${
                          star > 1 ? "s" : ""
                        }`}
                      >
                        <Star
                          size={24}
                          fill={
                            star <= reviewRating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    ),
                  )}
                </div>
              </label>

              <label>
                Votre avis

                <textarea
                  value={reviewText}
                  onChange={(event) =>
                    setReviewText(
                      event.target.value,
                    )
                  }
                  placeholder="Partagez votre expérience..."
                  rows={5}
                />
              </label>

              <label className="pas-review-consent"><input type="checkbox" checked={reviewConsent} onChange={event => setReviewConsent(event.target.checked)} required/><span>J’accepte la publication de mon prénom, de ma note et de mon avis sur ce site.</span></label>

              {reviewMessage && (
                <p className="pas-review-message">
                  {reviewMessage}
                </p>
              )}

              <button
                type="submit"
                className="pas-submit-review"
                disabled={!reviewConsent}
              >
                Publier mon avis
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}



