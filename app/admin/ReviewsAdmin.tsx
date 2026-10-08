"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import type { CustomerReview } from "@/lib/reviews";

export default function ReviewsAdmin({ password }: { password: string }) {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");

  async function refresh() {
    const response = await fetch("/api/reviews", { cache: "no-store" });
    const result = await response.json().catch(() => null) as { reviews?: CustomerReview[]; error?: string } | null;
    if (!response.ok) throw new Error(result?.error || "Impossible de charger les avis.");
    setReviews(Array.isArray(result?.reviews) ? result.reviews : []);
  }

  useEffect(() => { void refresh().catch(error => setMessage(error instanceof Error ? error.message : "Impossible de charger les avis.")); }, []);

  async function remove(review: CustomerReview) {
    if (!window.confirm(`Supprimer l’avis de ${review.name} ?`)) return;
    setBusyId(review.id); setMessage("");
    try {
      const response = await fetch(`/api/reviews?id=${encodeURIComponent(review.id)}`, { method: "DELETE", headers: { "x-melp-admin-password": password } });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "Suppression impossible.");
      setReviews(current => current.filter(item => item.id !== review.id)); setMessage("Avis supprimé.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Suppression impossible."); }
    finally { setBusyId(""); }
  }

  return <section className="admin-panel reviews-admin"><div className="reviews-admin-heading"><div><h2>Avis publiés</h2><p>Les avis avec accord de publication apparaissent sur les pages Avis et Pâtisserie.</p></div><button className="admin-secondary" type="button" onClick={() => void refresh().catch(error => setMessage(error.message))}>Actualiser</button></div>
    {message && <p className="admin-feedback" role="status">{message}</p>}
    {reviews.length === 0 ? <p className="admin-empty">Aucun avis publié pour le moment.</p> : <div className="reviews-admin-list">{reviews.map(review => <article className="reviews-admin-item" key={review.id}><div><strong>{review.name} · {review.rating}/5 · {review.category}</strong><small>{new Date(review.createdAt).toLocaleDateString("fr-FR")}</small><p>{review.text}</p></div><button type="button" className="admin-delete" onClick={() => void remove(review)} disabled={busyId === review.id} aria-label={`Supprimer l’avis de ${review.name}`}><Trash2 size={16}/>{busyId === review.id ? "Suppression…" : "Supprimer"}</button></article>)}</div>}
  </section>;
}
