"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  CakeSlice,
  CalendarDays,
  Check,
  ChefHat,
  Clock3,
  Gift,
  Mail,
  MapPin,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import Header from "@/components/Header";
import "./page.css";

const prestations = [
  {
    number: "01",
    title: "Pâtisserie",
    description: "Desserts, mignardises & créations sucrées",
    image:
      "/images/gateau-framboises-fleurs.png",
    icon: CakeSlice,
  },
  {
    number: "02",
    title: "Gâteau personnalisé",
    description: "Anniversaire, mariage ou occasion spéciale",
    image:
      "/images/number-cake-marin.png",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Table sucrée",
    description: "Une table complète autour de vos envies",
    image:
      "/images/number-cake-fruits-rouges.png",
    icon: CakeSlice,
  },
  {
    number: "04",
    title: "Dîner privé",
    description: "Une expérience culinaire à domicile",
    image:
      "/images/carte-photo-2.png",
    icon: ChefHat,
  },
  {
    number: "05",
    title: "Événement",
    description: "Mariage, réception, entreprise...",
    image:
      "/images/traiteur-planche-festive.png",
    icon: UtensilsCrossed,
  },
  { number: "06", title: "Atelier privé", description: "Une séance gourmande adaptée à votre groupe", image: "/images/number-cake-choux.png", icon: CakeSlice },
  { number: "07", title: "Épicerie gourmande", description: "Des douceurs à offrir ou à partager", image: "/images/entremets-chocolat-noisettes.png", icon: Gift },
  { number: "08", title: "Carte cadeau", description: "Offrir une création ou une expérience", image: "/images/gateau-fraises.png", icon: Gift },
  { number: "09", title: "Collaboration professionnelle", description: "Imaginer un partenariat avec Mélissa", image: "/images/traiteur-planche-festive.png", icon: ChefHat },
  { number: "10", title: "Demande particulière", description: "Une date ou un projet à étudier", image: "/images/number-cake-marin.png", icon: Sparkles },
];

const bottomCards = [
  {
    number: "01",
    title: "Gourmandise",
    subtitle: "Des créations généreuses",
    image:
      "/images/number-cake-choux.png",
  },
  {
    number: "02",
    title: "Élégance",
    subtitle: "Une table pensée dans les détails",
    image:
      "/images/number-cake-tropical.png",
  },
  {
    number: "03",
    title: "Sur mesure",
    subtitle: "Une création qui vous ressemble",
    image:
      "/images/entremets-chocolat-noisettes.png",
  },
];

export default function ContactPage() {
  const [selected, setSelected] = useState("Pâtisserie");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("prestation");
    const match = prestations.find(item => item.title.toLocaleLowerCase() === requested?.toLocaleLowerCase());
    if (match) setSelected(match.title);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const details = new FormData(event.currentTarget);
    details.set("Prestation", selected);
    const body = Array.from(details.entries())
      .map(([label, value]) => `${label} : ${value}`)
      .join("\n");
    window.location.href = `mailto:melp.atisse.contact@gmail.com?subject=${encodeURIComponent("Demande depuis le site Melp.atisse")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <main className="contact-page">
      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="contact-hero">
        <div className="hero-orbit hero-orbit-1" />
        <div className="hero-orbit hero-orbit-2" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="hero-blur blur-one" />
        <div className="hero-blur blur-two" />

        <div className="contact-hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">01 / CONTACT</span>

            <h1>
              Une envie,
              <br />
              <em>une table.</em>
            </h1>

            <p>
              Pâtisserie, gâteau personnalisé, dîner privé ou événement :
              choisissez simplement ce qui vous ferait plaisir.
            </p>

            <a href="#demande" className="hero-button">
              Commencer
              <ArrowRight size={17} />
            </a>
          </div>

          {/* ================= CARTES 3D ================= */}

          <div className="hero-cards">
            {prestations.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  className={`hero-card hero-card-${index + 1} ${
                    selected === item.title ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelected(item.title);
                    document
                      .getElementById("demande")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div className="hero-card-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="hero-card-shade" />

                  <div className="hero-card-top">
                    <span>{item.number}</span>

                    {selected === item.title ? (
                      <Check size={15} />
                    ) : (
                      <Icon size={17} strokeWidth={1.5} />
                    )}
                  </div>

                  <div className="hero-card-content">
                    <h2>{item.title}</h2>

                    <p>{item.description}</p>
                  </div>

                  <div className="hero-card-bottom">
                    <span>CHOISIR CETTE PRESTATION</span>
                    <ArrowRight size={15} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="hero-location">
            <span>LA PLAINE-SUR-MER</span>
            <span>& ALENTOURS</span>
          </div>

          <div className="hero-scroll">
            <span>SCROLL</span>
            <div />
          </div>

          <div className="hero-coordinate">44°56′N</div>
        </div>
      </section>

      {/* =====================================================
          FORMULAIRE
      ===================================================== */}

      <section className="request-section" id="demande">
        <div className="request-layout">
          <div className="request-intro">
            <span className="eyebrow">02 / VOTRE DEMANDE</span>

            <h2>
              Quelques détails
              <br />
              pour <em>commencer.</em>
            </h2>

            <p>
              Remplissez simplement les informations ci-dessous.
              <br />
              Je vous répondrai personnellement avec une proposition adaptée.
            </p>

            <div className="request-benefits">
              <div className="benefit">
                <div className="benefit-icon">
                  <Clock3 size={18} />
                </div>

                <div>
                  <strong>Réponse personnalisée</strong>
                  <span>Après étude de votre demande</span>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">
                  <ChefHat size={18} />
                </div>

                <div>
                  <strong>Échange personnalisé</strong>
                  <span>Pour une proposition sur mesure</span>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <strong>La Plaine-sur-Mer</strong>
                  <span>& alentours</span>
                </div>
              </div>
            </div>
          </div>

          <form className="request-form" onSubmit={handleSubmit}>
            <div className="form-card-top">
              <div>
                <span>VOTRE PRESTATION</span>

                <strong>{selected}</strong>

                <small>
                  {prestations.find((item) => item.title === selected)
                    ?.description || ""}
                </small>
              </div>

              <button
                type="button"
                onClick={() =>
                  document
                    .querySelector(".contact-choice-mobile")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Modifier
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="mobile-choice contact-choice-mobile">
              <span>CHOISIR UNE PRESTATION</span>

              <div className="mobile-choice-list">
                {prestations.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className={selected === item.title ? "selected" : ""}
                    onClick={() => setSelected(item.title)}
                  >
                    {item.title}

                    {selected === item.title && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid">
              <label>
                <span>VOTRE NOM *</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Votre nom"
                  required
                />
              </label>

              <label>
                <span>VOTRE E-MAIL *</span>
                <input
                  type="email"
                  name="email"
                  placeholder="vous@email.com"
                  required
                />
              </label>

              <label>
                <span>DATE SOUHAITÉE *</span>
                <input type="date" name="date" required />
              </label>

              <label>
                <span>NOMBRE DE PERSONNES *</span>
                <input
                  type="number"
                  name="people"
                  min="1"
                  placeholder="Ex. 10"
                  required
                />
              </label>

              <label>
                <span>TÉLÉPHONE</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="06 00 00 00 00"
                />
              </label>

              <label>
                <span>OCCASION</span>

                <select name="occasion" defaultValue="">
                  <option value="" disabled>
                    Sélectionner
                  </option>
                  <option value="anniversaire">Anniversaire</option>
                  <option value="mariage">Mariage</option>
                  <option value="bapteme">Baptême</option>
                  <option value="baby-shower">Baby shower</option>
                  <option value="entreprise">Entreprise</option>
                  <option value="diner-prive">Dîner privé</option>
                  <option value="autre">Autre</option>
                </select>
              </label>
            </div>

            <label className="message-field">
              <span>UN PETIT MOT</span>

              <textarea
                name="message"
                placeholder="Goûts, thème, allergies, inspirations..."
                rows={5}
              />
            </label>

            <div className="form-bottom">
              <div className="privacy">
                <span className="privacy-lock">⌑</span>

                <span>
                  Vos informations restent
                  <br />
                  confidentielles.
                </span>
              </div>

              <button className="submit-button" type="submit">
                {sent ? "Messagerie ouverte" : "Préparer mon e-mail"}

                {sent ? (
                  <Check size={17} />
                ) : (
                  <ArrowRight size={17} />
                )}
              </button>
            </div>

            {sent && (
              <div className="success-box">
                <Check size={18} />

                <div>
                  <strong>Votre e-mail est prêt.</strong>

                  <span>
                    Vérifiez l’ouverture de votre messagerie puis envoyez le message pour transmettre votre demande à Mélissa.
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* =====================================================
          ENTRE LES DEUX
      ===================================================== */}

      <section className="mid-section">
        <div className="mid-line" />

        <span>UNE ATTENTION PARTICULIÈRE</span>

        <h2>
          Chaque occasion mérite
          <br />
          <em>sa petite attention.</em>
        </h2>

        <p>
          Des créations pensées avec soin, de la première idée
          <br />
          jusqu'au dernier détail.
        </p>
      </section>

      {/* =====================================================
          BAS — CARTES 3D
      ===================================================== */}

      <section className="bottom-showcase">
        <div className="bottom-orbit bottom-orbit-one" />
        <div className="bottom-orbit bottom-orbit-two" />

        <div className="bottom-content">
          <div className="bottom-copy">
            <span className="eyebrow light">03 / ET APRÈS ?</span>

            <h2>
              On imagine
              <br />
              la suite <em>ensemble.</em>
            </h2>

            <p>
              Chaque événement est unique.
              <br />
              Créons un moment gourmand qui vous ressemble.
            </p>

            <Link href="/patisserie" className="bottom-button">
              Voir les créations
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bottom-cards">
            {bottomCards.map((card, index) => (
              <div
                key={card.title}
                className={`bottom-card bottom-card-${index + 1}`}
              >
                <div className="bottom-card-image">
                  <img src={card.image} alt={card.title} />
                </div>

                <div className="bottom-card-overlay" />

                <div className="bottom-card-top">
                  <span>{card.number}</span>
                </div>

                <div className="bottom-card-content">
                  <h3>{card.title}</h3>
                  <p>{card.subtitle}</p>
                </div>

                <div className="bottom-card-arrow">
                  <ArrowRight size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          INFOS
      ===================================================== */}

      <section className="contact-infos">
        <div className="info-block">
          <Mail size={19} />

          <span>ÉCRIRE</span>

          <h3>Une question ?</h3>

          <a href="mailto:melp.atisse.contact@gmail.com">
            melp.atisse.contact@gmail.com
            <ArrowRight size={14} />
          </a>
        </div>

        <div className="info-block">
          <MapPin size={19} />

          <span>LOCALISATION</span>

          <h3>La Plaine-sur-Mer</h3>

          <p>6 rue Léon Fourneau<br/>44770 La Plaine-sur-Mer</p>
          <a href="https://maps.google.com/?q=6+rue+L%C3%A9on+Fourneau+44770+La+Plaine-sur-Mer" target="_blank" rel="noreferrer">Voir l’adresse sur la carte <ArrowRight size={14}/></a>
        </div>

        <div className="info-block">
          <MapPin size={19} />
          <span>TÉLÉPHONE</span>
          <h3>Échanger de vive voix</h3>
          <a href="tel:+33651369133">06 51 36 91 33 <ArrowRight size={14}/></a>
        </div>

        <div className="info-block">
          <CalendarDays size={19} />

          <span>DISPONIBILITÉS</span>

          <h3>Sur réservation</h3>

          <p>Anticipez vos demandes pour les grandes occasions.</p>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="contact-footer">
        <div className="footer-main">
          <div className="footer-brand-block">
            <div className="footer-brand">
              MELP<i>.ATISSE</i>
            </div>

            <p>
              Pâtisserie artisanale & cuisine privée.
              <br />
              La Plaine-sur-Mer & alentours.
            </p>
          </div>

          <div className="footer-column">
            <span>EXPLORER</span>

            <Link href="/">Accueil</Link>
            <Link href="/patisserie">Pâtisserie</Link>
            <Link href="/cheffe-privee">Cheffe privée</Link>
            <Link href="/evenements">Événements</Link>
          </div>

          <div className="footer-column">
            <span>À PROPOS</span>

            <Link href="/a-propos">Qui suis-je ?</Link>
            <Link href="/avis">Avis</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="footer-column">
            <span>SUIVRE</span>

            <a
              href="https://www.instagram.com/melp.atisse/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
              <ArrowRight size={13} />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 MELP.ATISSE</span>

          <span>DES SAVEURS POUR VOS PLUS BEAUX MOMENTS.</span>
        </div>
      </footer>
    </main>
  );
}
