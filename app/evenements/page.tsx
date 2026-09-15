"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import "./page.css";

type DayStatus = "muted" | "available" | "booked" | "today";

type CalendarDay = {
  day: number;
  status: DayStatus;
};

const monthData: Record<string, CalendarDay[]> = {
  septembre: [
    { day: 31, status: "muted" }, { day: 1, status: "muted" }, { day: 2, status: "muted" },
    { day: 3, status: "muted" }, { day: 4, status: "muted" }, { day: 5, status: "muted" },
    { day: 6, status: "muted" }, { day: 7, status: "muted" }, { day: 8, status: "muted" },
    { day: 9, status: "muted" }, { day: 10, status: "muted" }, { day: 11, status: "muted" },
    { day: 12, status: "muted" }, { day: 13, status: "muted" }, { day: 14, status: "muted" },
    { day: 15, status: "today" }, { day: 16, status: "available" }, { day: 17, status: "available" },
    { day: 18, status: "booked" }, { day: 19, status: "available" }, { day: 20, status: "available" },
    { day: 21, status: "available" }, { day: 22, status: "available" }, { day: 23, status: "available" },
    { day: 24, status: "booked" }, { day: 25, status: "available" }, { day: 26, status: "available" },
    { day: 27, status: "available" }, { day: 28, status: "available" }, { day: 29, status: "available" },
    { day: 30, status: "available" }, { day: 1, status: "muted" }, { day: 2, status: "muted" },
    { day: 3, status: "muted" }, { day: 4, status: "muted" },
  ],
  octobre: [
    { day: 28, status: "muted" }, { day: 29, status: "muted" }, { day: 30, status: "muted" },
    { day: 1, status: "available" }, { day: 2, status: "available" }, { day: 3, status: "booked" },
    { day: 4, status: "available" }, { day: 5, status: "available" }, { day: 6, status: "available" },
    { day: 7, status: "available" }, { day: 8, status: "available" }, { day: 9, status: "available" },
    { day: 10, status: "booked" }, { day: 11, status: "available" }, { day: 12, status: "available" },
    { day: 13, status: "available" }, { day: 14, status: "available" }, { day: 15, status: "available" },
    { day: 16, status: "available" }, { day: 17, status: "booked" }, { day: 18, status: "available" },
    { day: 19, status: "available" }, { day: 20, status: "available" }, { day: 21, status: "available" },
    { day: 22, status: "available" }, { day: 23, status: "available" }, { day: 24, status: "booked" },
    { day: 25, status: "available" }, { day: 26, status: "available" }, { day: 27, status: "available" },
    { day: 28, status: "available" }, { day: 29, status: "available" }, { day: 30, status: "available" },
    { day: 31, status: "available" }, { day: 1, status: "muted" }, { day: 2, status: "muted" },
  ],
};

const months = [
  { key: "septembre", name: "Septembre", year: 2026 },
  { key: "octobre", name: "Octobre", year: 2026 },
];

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
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const month = months[monthIndex];
  const days = monthData[month.key];

  const dateLabel = selectedDate
    ? `${selectedDate} ${month.name.toLowerCase()} ${month.year}`
    : "Choisir une date";

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
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=90"
            alt="Réception élégante"
          />
          <div className="image-overlay" />
          <span>01 / RÉCEPTION</span>
        </div>

        <div className="showcase-side">
          <div className="showcase-small">
            <img
              src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=90"
              alt="Création pâtissière"
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

      {/* CALENDAR */}
      <section className="booking" id="reservation">
        <div className="booking-intro">
          <span className="section-number">05 / DISPONIBILITÉS</span>

          <h2>
            Choisissez
            <br />
            <em>votre date.</em>
          </h2>

          <p>
            Consultez les disponibilités et sélectionnez le jour qui vous
            correspond. Votre demande sera ensuite étudiée personnellement.
          </p>

          <div className="availability">
            <div>
              <i className="available-dot" />
              <span>Disponible</span>
            </div>
            <div>
              <i className="booked-dot" />
              <span>Réservé</span>
            </div>
          </div>
        </div>

        <div className="calendar-wrap">
          <div className="calendar-decoration one" />
          <div className="calendar-decoration two" />

          <div className="calendar-card">
            <div className="calendar-header">
              <button
                type="button"
                aria-label="Mois précédent"
                disabled={monthIndex === 0}
                onClick={() => {
                  setMonthIndex((value) => Math.max(0, value - 1));
                  setSelectedDate(null);
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="calendar-title">
                <span>DISPONIBILITÉS</span>
                <strong>
                  {month.name} <small>{month.year}</small>
                </strong>
              </div>

              <button
                type="button"
                aria-label="Mois suivant"
                disabled={monthIndex === months.length - 1}
                onClick={() => {
                  setMonthIndex((value) =>
                    Math.min(months.length - 1, value + 1)
                  );
                  setSelectedDate(null);
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="calendar-week">
              {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {days.map((item, index) => (
                <button
                  type="button"
                  key={`${item.day}-${index}`}
                  disabled={
                    item.status === "muted" || item.status === "booked"
                  }
                  className={`calendar-day ${item.status} ${
                    selectedDate === item.day && item.status !== "muted"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setSelectedDate(item.day)}
                >
                  <span>{item.day}</span>
                  {item.status === "available" && <i />}
                </button>
              ))}
            </div>

            <div className="calendar-footer">
              <div className="selected-date">
                <span>DATE SÉLECTIONNÉE</span>
                <strong>{dateLabel}</strong>
              </div>

              <Link
                href={`/contact?date=${encodeURIComponent(dateLabel)}`}
                className={`calendar-continue ${
                  !selectedDate ? "disabled" : ""
                }`}
                onClick={(event) => {
                  if (!selectedDate) event.preventDefault();
                }}
              >
                Continuer
                <ArrowRight size={15} />
              </Link>
            </div>
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
