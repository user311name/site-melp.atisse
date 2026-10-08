"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, X } from "lucide-react";
import type { SiteInquiry } from "@/lib/inquiries";

const statusLabel: Record<SiteInquiry["status"], string> = { new: "À traiter", accepted: "Acceptée", declined: "Refusée" };
const displayDate = (value: string) => {
  if (!value) return "À convenir";
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR", { timeZone: "UTC", dateStyle: "long" });
};

export default function InquiryAdmin({ password }: { password: string }) {
  const [inquiries, setInquiries] = useState<SiteInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const response = await fetch("/api/inquiries", { headers: { "x-melp-admin-password": password }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Impossible de lire les demandes.");
      setInquiries(result);
      if (!quiet) setMessage("");
    } catch (error) {
      if (!quiet) setMessage(error instanceof Error ? error.message : "Impossible de lire les demandes.");
    } finally { if (!quiet) setLoading(false); }
  }, [password]);

  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(true), 15000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [load]);

  async function decide(inquiry: SiteInquiry, status: "accepted" | "declined") {
    setBusyId(inquiry.id);
    setMessage("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-melp-admin-password": password },
        body: JSON.stringify({ id: inquiry.id, status }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.inquiry) await load(true);
        throw new Error(result.error || "La réponse n’a pas pu être envoyée.");
      }
      await load(true);
      setMessage(status === "accepted" ? "Demande acceptée : l’e-mail de confirmation a été envoyé." : "Demande refusée : l’e-mail de réponse a été envoyé.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "La réponse n’a pas pu être envoyée."); }
    finally { setBusyId(""); }
  }

  return <section className="admin-loyalty admin-inquiries">
    <div className="admin-products-heading">
      <div><span className="warm-eyebrow">CONTACT DU SITE</span><h2>Demandes de prestations et d’ateliers</h2><p>Les nouvelles demandes apparaissent ici automatiquement (actualisation toutes les 15 secondes). Accepter ou refuser envoie un e-mail au client.</p></div>
      <button type="button" className="admin-refresh" onClick={() => void load()} disabled={loading}><RefreshCw size={15}/> {loading ? "Actualisation…" : "Actualiser"}</button>
    </div>
    {message && <p role="status" className="admin-loyalty-notice">{message}</p>}
    {inquiries.length === 0 ? <p className="admin-empty">Aucune demande enregistrée pour le moment.</p> : <div className="admin-order-list">{inquiries.map(inquiry => {
      const emailSent = Boolean(inquiry.decisionEmailSentAt);
      return <article className="admin-order" key={inquiry.id}>
        <div className="admin-order-main">
          <span>{inquiry.kind === "atelier" ? "Atelier" : "Prestation"} · {statusLabel[inquiry.status]} · reçue le {new Date(inquiry.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</span>
          <strong>{inquiry.name}</strong>
          <span><a href={`mailto:${encodeURIComponent(inquiry.email)}`}>{inquiry.email}</a>{inquiry.phone ? ` · ${inquiry.phone}` : ""}</span>
          <span>{inquiry.request} · date souhaitée : {displayDate(inquiry.requestedDate)} · {inquiry.participants} participant(s)</span>
          {inquiry.occasion && <span>Occasion : {inquiry.occasion}</span>}
          {inquiry.location && <span>Lieu : {inquiry.location}</span>}
          <small className="admin-inquiry-details">{inquiry.details}</small>
          {inquiry.status !== "new" && <small>{emailSent ? `E-mail de réponse envoyé le ${new Date(inquiry.decisionEmailSentAt!).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}.` : "E-mail non envoyé : utilise le bouton pour réessayer."}</small>}
        </div>
        <div className="admin-order-actions">
          {(inquiry.status === "new" || inquiry.status === "accepted" && !emailSent) && <button type="button" disabled={busyId === inquiry.id} onClick={() => void decide(inquiry, "accepted")}><Check size={14}/>{busyId === inquiry.id ? "Envoi…" : inquiry.status === "new" ? "Accepter et prévenir par e-mail" : "Renvoyer l’acceptation"}</button>}
          {(inquiry.status === "new" || inquiry.status === "declined" && !emailSent) && <button type="button" disabled={busyId === inquiry.id} onClick={() => void decide(inquiry, "declined")}><X size={14}/>{busyId === inquiry.id ? "Envoi…" : inquiry.status === "new" ? "Refuser et prévenir par e-mail" : "Renvoyer le refus"}</button>}
        </div>
      </article>;
    })}</div>}
  </section>;
}
