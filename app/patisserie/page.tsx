"use client";

import { useMemo, useState } from "react";
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

type Product = {
  id: number;
  category: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  price: string;
  ingredients: string[];
  allergens: string[];
  notes: string[];
  conservation: string;
  weight: string;
  popular?: boolean;
};

const products: Product[] = [
  {
    id: 1,
    category: "Tartes",
    name: "Tarte Fraîche",
    eyebrow: "Fruits · Vanille · Sablé",
    description:
      "Une tarte fine et élégante composée d'un sablé croustillant, d'une crème légère à la vanille et de fruits frais sélectionnés selon la saison.",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1600&q=90",
    price: "À partir de 32 €",
    ingredients: [
      "Farine de blé",
      "Beurre",
      "Sucre",
      "Œufs",
      "Vanille",
      "Fruits frais",
      "Crème",
    ],
    allergens: ["Gluten", "Lait", "Œufs"],
    notes: ["Frais", "Vanillé", "Fruité"],
    conservation: "À conserver au réfrigérateur et à déguster dans les 24 h.",
    weight: "4 à 6 personnes",
    popular: true,
  },
  {
    id: 2,
    category: "Entremets",
    name: "Velours Chocolat",
    eyebrow: "Chocolat noir · Praliné · Cacao",
    description:
      "Un entremets intense et fondant où le chocolat noir rencontre un cœur praliné et une texture mousseuse particulièrement légère.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=90",
    price: "À partir de 42 €",
    ingredients: [
      "Chocolat noir",
      "Cacao",
      "Praliné noisette",
      "Crème",
      "Beurre",
      "Œufs",
      "Sucre",
    ],
    allergens: ["Lait", "Œufs", "Fruits à coque"],
    notes: ["Intense", "Praliné", "Fondant"],
    conservation:
      "À conserver au réfrigérateur. Sortir 15 min avant dégustation.",
    weight: "6 à 8 personnes",
    popular: true,
  },
  {
    id: 3,
    category: "Cookies",
    name: "Cookie Signature",
    eyebrow: "Chocolat · Fleur de sel · Beurre",
    description:
      "Un cookie généreux au cœur fondant, légèrement croustillant sur les bords, avec du chocolat et une pointe de fleur de sel.",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1600&q=90",
    price: "À partir de 4 €",
    ingredients: [
      "Farine de blé",
      "Beurre",
      "Cassonade",
      "Chocolat",
      "Œufs",
      "Fleur de sel",
    ],
    allergens: ["Gluten", "Lait", "Œufs"],
    notes: ["Gourmand", "Fondant", "Chocolaté"],
    conservation: "À conserver dans une boîte hermétique.",
    weight: "1 pièce",
  },
  {
    id: 4,
    category: "Gâteaux",
    name: "Nuage Vanille",
    eyebrow: "Vanille · Crème · Biscuit moelleux",
    description:
      "Un gâteau aérien autour d'une vanille douce, d'un biscuit moelleux et d'une crème délicate. Une création pensée pour les grandes occasions.",
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1600&q=90",
    price: "À partir de 45 €",
    ingredients: [
      "Farine de blé",
      "Œufs",
      "Sucre",
      "Vanille",
      "Crème",
      "Beurre",
    ],
    allergens: ["Gluten", "Lait", "Œufs"],
    notes: ["Doux", "Aérien", "Vanillé"],
    conservation: "À conserver au réfrigérateur.",
    weight: "6 à 10 personnes",
  },
  {
    id: 5,
    category: "Tartes",
    name: "Caramel & Noisette",
    eyebrow: "Caramel · Noisette · Sablé",
    description:
      "Une création généreuse autour d'un caramel onctueux, d'une crème de noisette et d'un sablé délicatement croustillant.",
    image:
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1600&q=90",
    price: "À partir de 38 €",
    ingredients: [
      "Farine de blé",
      "Beurre",
      "Noisette",
      "Sucre",
      "Crème",
      "Œufs",
    ],
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    notes: ["Caramélisé", "Noisette", "Gourmand"],
    conservation:
      "À conserver au réfrigérateur et consommer sous 48 h.",
    weight: "6 personnes",
  },
  {
    id: 6,
    category: "Entremets",
    name: "Éclat Framboise",
    eyebrow: "Framboise · Vanille · Chocolat blanc",
    description:
      "La fraîcheur de la framboise associée à une mousse vanillée et une touche de chocolat blanc pour une création délicate et équilibrée.",
    image:
      "https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&w=1600&q=90",
    price: "À partir de 44 €",
    ingredients: [
      "Framboise",
      "Vanille",
      "Chocolat blanc",
      "Crème",
      "Œufs",
      "Sucre",
    ],
    allergens: ["Lait", "Œufs"],
    notes: ["Frais", "Acidulé", "Délicat"],
    conservation: "À conserver au réfrigérateur.",
    weight: "6 à 8 personnes",
    popular: true,
  },
];

const initialReviews = [
  {
    name: "Camille",
    rating: 5,
    text: "Une pâtisserie aussi belle que délicieuse. Tout était extrêmement fin.",
    date: "Il y a 2 semaines",
  },
  {
    name: "Sophie",
    rating: 5,
    text: "Le gâteau était magnifique et surtout vraiment excellent. Je recommande.",
    date: "Il y a 1 mois",
  },
  {
    name: "Julien",
    rating: 5,
    text: "Très belle découverte. Les textures et les saveurs sont incroyables.",
    date: "Il y a 2 mois",
  },
];

const categories = [
  "Toutes",
  "Tartes",
  "Entremets",
  "Cookies",
  "Gâteaux",
];

export default function Patisserie() {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Toutes") {
      return products;
    }

    return products.filter(
      (product) => product.category === activeCategory,
    );
  }, [activeCategory]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const submitReview = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!reviewName.trim() || !reviewText.trim()) {
      setReviewMessage(
        "Merci de renseigner votre prénom et votre avis.",
      );
      return;
    }

    setReviews((current) => [
      {
        name: reviewName.trim(),
        rating: reviewRating,
        text: reviewText.trim(),
        date: "À l'instant",
      },
      ...current,
    ]);

    setReviewName("");
    setReviewText("");
    setReviewRating(5);
    setReviewMessage("Merci pour votre avis ♡");
    setReviewOpen(false);
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
            <span>PÂTISSERIE ARTISANALE</span>
          </div>

          <h1>
            La gourmandise
            <br />
            <em>comme signature.</em>
          </h1>

          <p>
            Des créations imaginées, façonnées et dressées à la main,
            directement depuis l&apos;atelier MELP.ATISSE.
          </p>

          <a href="#creations" className="pas-hero-link">
            Découvrir les créations
            <ArrowRight size={17} />
          </a>
        </div>

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
            src={products[1].image}
            alt="Velours Chocolat"
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
            onClick={() => setSelectedProduct(products[1])}
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
            <strong>5.0</strong>

            <div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill="currentColor"
                  />
                ))}
              </div>

              <span>{reviews.length} avis</span>
            </div>
          </div>
        </div>

        <div className="pas-reviews-grid">
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

                <span>{review.date}</span>
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
            src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1800&q=90"
            alt="Création pâtissière sur mesure"
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
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1400&q=95"
              alt="Viennoiseries artisanales"
            />

            <div className="pas-insta-overlay">
              <span className="pas-insta-number">01</span>
              <span className="pas-insta-caption">
                Le savoir-faire
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
              src="https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1400&q=95"
              alt="Tarte pâtissière artisanale"
            />

            <div className="pas-insta-overlay">
              <span className="pas-insta-number">02</span>
              <span className="pas-insta-caption">
                Tarte & précision
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
              src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1400&q=95"
              alt="Gâteau pâtissier fait maison"
            />

            <div className="pas-insta-overlay">
              <span className="pas-insta-number">03</span>
              <span className="pas-insta-caption">
                Création maison
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
              src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=95"
              alt="Dessert pâtissier gourmand"
            />

            <div className="pas-insta-overlay">
              <span className="pas-insta-number">04</span>
              <span className="pas-insta-caption">
                Le goût avant tout
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

                <Link href="/contact">
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

              {reviewMessage && (
                <p className="pas-review-message">
                  {reviewMessage}
                </p>
              )}

              <button
                type="submit"
                className="pas-submit-review"
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