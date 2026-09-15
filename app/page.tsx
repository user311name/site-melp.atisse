"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { MouseEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  CakeSlice,
  ChefHat,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import "./page.css";

const services = [
  {
    number: "01",
    title: "Pâtisserie",
    text: "Des créations artisanales pensées pour vos moments.",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1400&q=90",
    icon: CakeSlice,
    href: "/patisserie",
  },
  {
    number: "02",
    title: "Cuisine privée",
    text: "Une expérience culinaire imaginée directement chez vous.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=90",
    icon: ChefHat,
    href: "/cheffe-privee",
  },
  {
    number: "03",
    title: "Sur mesure",
    text: "Une création unique, conçue autour de votre histoire.",
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1400&q=90",
    icon: Sparkles,
    href: "/contact",
  },
];

const creations = [
  {
    number: "01",
    title: "Tarte aux fruits",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=90",
  },
  {
    number: "02",
    title: "Création chocolat",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=90",
  },
  {
    number: "03",
    title: "Petites douceurs",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=90",
  },
];

function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth <= 800) return;

    const element = ref.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * -7;
    const rotateY = (x / rect.width - 0.5) * 7;

    element.style.setProperty("--rx", `${rotateX}deg`);
    element.style.setProperty("--ry", `${rotateY}deg`);
    element.style.setProperty("--mx", `${x}px`);
    element.style.setProperty("--my", `${y}px`);
  };

  const leave = () => {
    const element = ref.current;

    if (!element) return;

    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
  };

  const Icon = service.icon;

  return (
    <Link
      ref={ref}
      href={service.href}
      className="service-card"
      onMouseMove={move}
      onMouseLeave={leave}
    >
      <div className="service-image">
        <img
          src={service.image}
          alt={service.title}
        />
      </div>

      <div className="service-overlay" />

      <div className="service-light" />

      <div className="service-number">
        {service.number}
      </div>

      <div className="service-icon">
        <Icon
          size={19}
          strokeWidth={1.2}
        />
      </div>

      <div className="service-content">

        <span>
          EXPÉRIENCE MELP.ATISSE
        </span>

        <h3>
          {service.title}
        </h3>

        <p>
          {service.text}
        </p>

        <div className="service-more">

          <span>
            Découvrir
          </span>

          <div>
            <ArrowRight size={15} />
          </div>

        </div>

      </div>

      <div className="service-shine" />
    </Link>
  );
}


function ContactCard({
  type,
  children,
}: {
  type: "instagram" | "quote";
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth <= 800) return;

    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 10;

    const baseRotate = type === "instagram" ? -6 : 5;
    const depth = type === "instagram" ? 80 : 20;

    card.style.transform =
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY + baseRotate}deg) translate3d(0,-6px,${depth}px)`;
  };

  const handleLeave = () => {
    const card = ref.current;
    if (!card) return;

    const baseRotate = type === "instagram" ? -6 : 5;
    const depth = type === "instagram" ? 80 : 20;

    card.style.transform =
      `perspective(1200px) rotateZ(${baseRotate}deg) translate3d(0,0,${depth}px)`;
  };

  return (
    <a
      ref={ref}
      className={`contact-card contact-card-${type}`}
      href={type === "instagram" ? "https://www.instagram.com/melp.atisse/" : "/contact"}
      target={type === "instagram" ? "_blank" : undefined}
      rel={type === "instagram" ? "noopener noreferrer" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={(event) => {
        if (type === "instagram") {
          event.stopPropagation();
        }
      }}
    >
      {children}
    </a>
  );
}

export default function Home() {
  useEffect(() => {
    const revealElements =
      document.querySelectorAll(".reveal");

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        {
          threshold: 0.12,
        }
      );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="home">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=2400&q=95"
            alt="Création pâtissière MELP.ATISSE"
          />
        </div>

        <div className="hero-dark" />

        <div className="hero-noise" />

        <div className="hero-content reveal visible">

          <div className="hero-label">
            <span />
            PÂTISSERIE ARTISANALE
            <br />
            & CUISINE PRIVÉE
          </div>

          <h1>
            Le goût
            <br />
            des <i>bons</i>
            <br />
            moments.
          </h1>

          <p>
            Des créations pensées avec passion,
            entre pâtisserie délicate, cuisine
            généreuse et instants qui restent.
          </p>

          <div className="hero-buttons">

            <Link
              href="/patisserie"
              className="primary-button"
            >
              Découvrir mes créations
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/contact"
              className="under-button"
            >
              Faire une demande
              <ArrowRight size={14} />
            </Link>

          </div>

        </div>

        <div className="hero-pastry-showcase">
          <div className="hero-pastry-image">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=95"
              alt="Création pâtissière au chocolat MELP.ATISSE"
            />
          </div>

          <div className="hero-pastry-info">
            <span>01 / PÂTISSERIE</span>
            <strong>Créations<br /><i>artisanales.</i></strong>
            <small>Entremets · Tartes · Pièces sur mesure</small>
          </div>

          <div className="hero-pastry-number">MELP.01</div>
        </div>

        <div className="hero-note">
          Fait
          <br />
          avec passion
        </div>

        <div className="hero-bottom">

          <span>
            LA PLAINE-SUR-MER
            <br />
            & ALENTOURS
          </span>

          <a href="#services">
            Explorer
            <ArrowDown size={14} />
          </a>

          <span>
            01 — 04
          </span>

        </div>

      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        className="services"
        id="services"
      >

        <div className="services-heading reveal">

          <div>

            <span>
              01 / EXPÉRIENCES
            </span>

            <h2>
              Trois façons de
              <br />
              <i>
                vous faire plaisir.
              </i>
            </h2>

          </div>

          <p>
            Pâtisserie, cuisine privée ou
            création entièrement personnalisée :
            choisissez l&apos;expérience qui vous ressemble.
          </p>

        </div>

        <div className="services-grid">

          {services.map((service) => (
            <ServiceCard
              key={service.number}
              service={service}
            />
          ))}

        </div>

      </section>

      {/* =====================================================
          CRÉATIONS
      ===================================================== */}

      <section
        className="creations reveal"
        id="creations"
      >

        <div className="creations-text">

          <span>
            02 / PÂTISSERIE
          </span>

          <h2>
            Mes créations
            <br />
            <i>
              gourmandes.
            </i>
          </h2>

          <p>
            Tartes, entremets, cookies,
            number cakes et créations sur mesure.
            Des pièces pensées pour être aussi
            belles que délicieuses.
          </p>

          <Link
            href="/patisserie"
            className="dark-button"
          >
            Voir toutes les créations
            <ArrowRight size={15} />
          </Link>

        </div>

        <div className="creation-gallery">

          {creations.map((creation) => (
            <Link
              href="/patisserie"
              key={creation.number}
              className="creation-card"
            >

              <img
                src={creation.image}
                alt={creation.title}
              />

              <div className="creation-gradient" />

              <span>
                {creation.number}
              </span>

              <div className="creation-arrow">
                <ArrowRight size={15} />
              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* =====================================================
          PHRASE
      ===================================================== */}

      <section className="statement reveal">

        <div className="statement-image">

          <img
            src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=2000&q=90"
            alt="Création MELP.ATISSE"
          />

        </div>

        <div className="statement-overlay" />

        <div className="statement-content">

          <span>
            UNE ATTENTION PARTICULIÈRE
          </span>

          <h2>
            Parce que chaque
            <br />
            occasion mérite
            <br />
            <i>
              sa petite attention.
            </i>
          </h2>

          <div className="statement-sign">
            — MELP.ATISSE
          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT — DÉCOR PHOTO + CARTES 3D
      ===================================================== */}

      <section className="contact-reference reveal">

        <img
          className="contact-reference-image"
          src="/images/contact-background.png"
          alt=""
          aria-hidden="true"
        />

        <div className="contact-reference-overlay">

          {/* =========================
              PANNEAU TEXTE
          ========================= */}

          <div className="contact-copy">
            <span className="contact-copy-eyebrow">
              03 / CONTACT
            </span>

            <h2>
              Nous
              <br />
              <i>contacter.</i>
            </h2>

            <p>
              Une question, une demande particulière ou un projet ?
              <br />
              Je suis là pour en discuter et imaginer avec vous
              <br />
              une création sur mesure.
            </p>

            <div className="contact-copy-signature">
              — MELP.ATISSE
            </div>

            <div className="contact-copy-bottom">
              <span>03</span>
              <span>À VOTRE ÉCOUTE</span>
            </div>
          </div>

          {/* =========================
              CARTES 3D
          ========================= */}

          <div className="contact-cards-stage">

            <ContactCard type="instagram">
              <div className="contact-card-header">
                <div className="contact-card-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.1"
                      fill="none" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="12" cy="12" r="4.15"
                      fill="none" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="17.35" cy="6.65" r="1.05" fill="currentColor" />
                  </svg>
                </div>
                <span>01</span>
              </div>

              <div className="contact-card-content">
                <span>INSTAGRAM</span>
                <h3>
                  Suivez-moi
                  <br />
                  sur <i>Instagram</i>
                </h3>
                <p>
                  Découvrez les coulisses, mes créations
                  et toute l'actualité.
                </p>
              </div>

              <div className="contact-card-button">
                <span>Voir mon Instagram</span>
                <strong>
                  <ArrowRight size={14} />
                </strong>
              </div>
            </ContactCard>

            <ContactCard type="quote">
              <div className="contact-card-header">
                <div className="contact-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M7 3.5h7l4 4v13H7z" />
                    <path d="M14 3.5v4h4" />
                    <path d="M9.5 12h5" />
                    <path d="M9.5 15h5" />
                  </svg>
                </div>
                <span>02</span>
              </div>

              <div className="contact-card-content">
                <span>PROJET</span>
                <h3>
                  Demander
                  <br />
                  <i>un devis</i>
                </h3>
                <p>
                  Parlez-moi de votre projet et créons ensemble
                  une expérience unique.
                </p>
              </div>

              <div className="contact-card-button">
                <span>Faire une demande</span>
                <strong>
                  <ArrowRight size={14} />
                </strong>
              </div>
            </ContactCard>

          </div>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="footer-logo">
              MELP
              <i>
                .ATISSE
              </i>
            </div>

            <p>
              Pâtisserie artisanale
              <br />
              & cuisine privée.
            </p>

          </div>

          <div className="footer-column">

            <span>
              Navigation
            </span>

            <Link href="/">
              Accueil
            </Link>

            <Link href="/patisserie">
              Pâtisserie
            </Link>

            <Link href="/cheffe-privee">
              Cheffe privée
            </Link>

            <Link href="/evenements">
              Événements
            </Link>

          </div>

          <div className="footer-column">

            <span>
              Maison
            </span>

            <Link href="/a-propos">
              À propos
            </Link>

            <Link href="/avis">
              Avis
            </Link>

            <Link href="/contact">
              Contact
            </Link>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 MELP.ATISSE
          </span>

          <span>
            LA PLAINE-SUR-MER & ALENTOURS
          </span>

          <a href="#">
            Retour en haut
            <ArrowDown size={12} />
          </a>

        </div>

      </footer>

    </main>
  );
}