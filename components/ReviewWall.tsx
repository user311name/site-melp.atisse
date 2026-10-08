"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import type { CustomerReview, ReviewCategory } from "@/lib/reviews";

const emptyReviews: CustomerReview[] = [];

export default function ReviewWall() {
  const [reviews, setReviews] = useState<CustomerReview[]>(emptyReviews);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<ReviewCategory>("Pâtisserie");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const response = await fetch("/api/reviews", { cache: "no-store" });
    const result = await response.json().catch(() => null) as { reviews?: CustomerReview[]; error?: string } | null;
    if (!response.ok) throw new Error(result?.error || "Impossible de charger les avis.");
    setReviews(Array.isArray(result?.reviews) ? result.reviews : []);
  }

  useEffect(() => { void refresh().catch(error => setMessage(error instanceof Error ? error.message : "Impossible de charger les avis.")); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, text, rating, category, consent, website: form.get("website") }) });
      const result = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "Impossible d’envoyer cet avis.");
      setMessage(result?.message || "Merci pour votre avis !"); setName(""); setText(""); setRating(5); setCategory("Pâtisserie"); setConsent(false);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally { setBusy(false); }
  }

  return <section className="review-wall" aria-labelledby="review-wall-title">
    <div className="review-wall-heading"><span className="warm-eyebrow">AVIS AUTHENTIQUES · {reviews.length}</span><h2 id="review-wall-title">Vos expériences <em>à partager.</em></h2><p>Les avis publiés ici sont envoyés directement par les clientes et clients.</p></div>
    <div className="review-wall-layout">
      <div className="review-wall-list" aria-live="polite">
        {reviews.length === 0 ? <div className="review-wall-empty"><h3>Pas encore d’avis publié</h3><p>Soyez la première personne à partager votre expérience.</p></div> : reviews.map(review => <article className="review-wall-card" key={review.id}>
          <div className="review-wall-card-top"><span className="review-wall-stars" aria-label={`${review.rating} sur 5 étoiles`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < review.rating ? "currentColor" : "none"}/>)}</span><time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString("fr-FR")}</time></div>
          <blockquote>« {review.text} »</blockquote><div className="review-wall-author"><strong>{review.name}</strong><span>{review.category}</span></div>
        </article>)}
        <a className="review-wall-public-link" href="https://maps.google.com/?q=Melp.atisse+6+rue+L%C3%A9on+Fourneau+44770+La+Plaine-sur-Mer" target="_blank" rel="noreferrer">Consulter les avis publics <ArrowRight size={15}/></a>
      </div>
      <form className="review-wall-form" id="ajouter" onSubmit={submit}>
        <span className="warm-eyebrow">VOTRE EXPÉRIENCE</span><h3>Déposer un avis</h3><p>Votre avis sera publié immédiatement après l’envoi.</p>
        <label>Votre prénom<input value={name} onChange={event => setName(event.target.value)} autoComplete="given-name" maxLength={50} minLength={2} required placeholder="Ex. Camille"/></label>
        <label>La prestation concernée<select value={category} onChange={event => setCategory(event.target.value as ReviewCategory)}><option>Pâtisserie</option><option>Traiteur</option><option>Atelier</option><option>Autre</option></select></label>
        <fieldset className="review-wall-rating"><legend>Votre note</legend><div>{[1, 2, 3, 4, 5].map(value => <button type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} étoile${value > 1 ? "s" : ""}`} aria-pressed={rating === value}><Star size={25} fill={value <= rating ? "currentColor" : "none"}/></button>)}</div></fieldset>
        <label>Votre avis<textarea value={text} onChange={event => setText(event.target.value)} rows={5} minLength={10} maxLength={1200} required placeholder="Partagez votre expérience…"/></label>
        <label className="review-wall-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required/><span>J’accepte la publication de mon prénom, de ma note et de mon avis sur ce site.</span></label>
        <label className="review-wall-honeypot" aria-hidden="true">Ne pas remplir<input name="website" tabIndex={-1} autoComplete="off"/></label>
        {message && <p className="review-wall-message" role="status" aria-live="polite">{message}</p>}
        <button className="review-wall-submit" type="submit" disabled={busy || !consent}>{busy ? "Envoi…" : "Publier mon avis"}</button>
      </form>
    </div>
  </section>;
}
