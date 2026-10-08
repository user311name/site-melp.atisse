"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, RefreshCw, X } from "lucide-react";
import type { PickupOrder } from "@/lib/orders";

const statusText: Record<PickupOrder["status"], string> = { held: "Créneau retenu", awaiting_confirmation: "À confirmer", confirmed: "Confirmée", completed: "Terminée", cancelled: "Refusée / annulée" };

export default function OrderAdmin({ password }: { password: string }) {
  const [orders, setOrders] = useState<PickupOrder[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [payingId, setPayingId] = useState("");

  async function load() {
    setBusy(true);
    const response = await fetch("/api/orders", { headers: { "x-melp-admin-password": password }, cache: "no-store" });
    const result = await response.json();
    if (response.ok) {
      setOrders(result);
      setAmounts(current => Object.fromEntries(result.map((order: PickupOrder) => [order.id, current[order.id] ?? (order.amount ? (order.amount / 100).toFixed(2) : "")] )));
    } else setMessage(result.error ?? "Impossible de lire les commandes.");
    setBusy(false);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/orders", { headers: { "x-melp-admin-password": password }, cache: "no-store" })
      .then(response => response.json().then(result => ({ response, result })))
      .then(({ response, result }) => { if (active) { if (response.ok) { setOrders(result); setAmounts(Object.fromEntries(result.map((order: PickupOrder) => [order.id, order.amount ? (order.amount / 100).toFixed(2) : ""]))); } else setMessage(result.error ?? "Impossible de lire les commandes."); } })
      .catch(() => { if (active) setMessage("Impossible de lire les commandes."); });
    return () => { active = false; };
  }, [password]);

  async function update(id: string, status: PickupOrder["status"]) {
    setMessage("");
    const response = await fetch("/api/orders/update", { method: "POST", headers: { "Content-Type": "application/json", "x-melp-admin-password": password }, body: JSON.stringify({ id, status }) });
    const result = await response.json();
    if (!response.ok) setMessage(result.error ?? "Mise à jour impossible."); else await load();
  }

  async function createPaymentLink(order: PickupOrder) {
    const amount = Number((amounts[order.id] || "").replace(",", "."));
    if (!Number.isFinite(amount) || amount < 0.5) { setMessage("Renseigne le montant exact validé avec la cliente (minimum Stripe : 0,50 €)."); return; }
    setPayingId(order.id); setMessage("");
    try {
      const response = await fetch("/api/payments/checkout", { method: "POST", headers: { "Content-Type": "application/json", "x-melp-admin-password": password }, body: JSON.stringify({ orderId: order.id, amount }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Impossible de créer le lien de paiement.");
      await load();
      setMessage(result.reused ? "Le lien de paiement existant est prêt à être transmis." : "Lien de paiement Stripe créé. Transmets-le à la cliente par e-mail.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Impossible de créer le lien de paiement."); }
    finally { setPayingId(""); }
  }

  async function copyPaymentLink(url: string) {
    try { await navigator.clipboard.writeText(url); setMessage("Lien de paiement copié."); }
    catch { setMessage("Copie refusée par le navigateur. Utilise le bouton d’envoi par e-mail."); }
  }

  async function exportCalendar() {
    setMessage("");
    const response = await fetch("/api/orders/calendar", { headers: { "x-melp-admin-password": password }, cache: "no-store" });
    if (!response.ok) { const result = await response.json().catch(() => null); setMessage(result?.error ?? "Le calendrier n’a pas pu être téléchargé."); return; }
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a"); link.href = url; link.download = "melp-atisse-retraits-confirmes.ics"; link.click(); URL.revokeObjectURL(url);
    setMessage("Calendrier téléchargé. Importe le fichier .ics dans ton agenda professionnel.");
  }

  return <section className="admin-loyalty">
    <div className="admin-products-heading"><div><span className="warm-eyebrow">SUIVI CLIENT</span><h2>Demandes et commandes</h2><p>Les demandes restent à confirmer. Après validation du montant, tu peux créer un lien Stripe pour encaisser la commande.</p></div><div className="admin-order-tools"><button type="button" className="admin-refresh" onClick={() => void exportCalendar()}><Download size={15}/> Télécharger le calendrier (.ics)</button><button type="button" className="admin-refresh" onClick={() => void load()} disabled={busy}><RefreshCw size={15}/> Actualiser</button></div></div>
    {message && <p role="status" className="admin-loyalty-notice">{message}</p>}
    {orders.length === 0 ? <p className="admin-empty">Aucune demande enregistrée pour le moment.</p> : <div className="admin-order-list">{orders.map(order => {
      const emailBody = `Bonjour ${order.name},\n\nVotre commande Melp.atisse est confirmée. Vous pouvez régler en ligne avec ce lien sécurisé : ${order.stripeCheckoutUrl}\n\nMélissa`;
      return <article className="admin-order" key={order.id}>
        <div className="admin-order-main"><span>{order.kind === "pickup" ? `Retrait · ${order.date} à ${order.time}` : `Date souhaitée · ${order.date ?? "à préciser"}${order.time ? ` à ${order.time}` : ""}`} · {statusText[order.status]}</span><strong>{order.name || "Créneau en attente"}</strong><span>{order.email} · {order.phone}</span><span>{order.products}</span>{order.notes && <small>Précisions : {order.notes}</small>}<span>Paiement : {order.paymentStatus === "paid" ? "Payé" : order.paymentStatus === "refunded" ? "Remboursé" : order.stripeCheckoutUrl ? `Lien prêt · ${(order.amount ?? 0) / 100} €` : "À régler après confirmation"}</span><a href={`mailto:${encodeURIComponent(order.email)}?subject=${encodeURIComponent("Votre commande Melp.atisse")}`}>Répondre par e-mail</a></div>
        <div className="admin-order-actions">
          {order.status === "awaiting_confirmation" && <><button type="button" onClick={() => void update(order.id,"confirmed")}><Check size={14}/> Confirmer</button><button type="button" onClick={() => void update(order.id,"cancelled")}><X size={14}/> Refuser</button></>}
          {order.status === "confirmed" && order.paymentStatus !== "paid" && <>
            <label className="admin-payment-amount">Montant exact à encaisser (€)<input type="number" min="0.50" max="999999.99" step="0.01" inputMode="decimal" placeholder="À valider" value={amounts[order.id] ?? ""} onChange={event => setAmounts(current => ({ ...current, [order.id]: event.target.value }))}/></label>
            <button type="button" disabled={payingId === order.id} onClick={() => void createPaymentLink(order)}>{payingId === order.id ? "Création…" : order.stripeCheckoutUrl ? "Mettre à jour le lien" : "Créer le lien Stripe"}</button>
            {order.stripeCheckoutUrl && <><button type="button" onClick={() => void copyPaymentLink(order.stripeCheckoutUrl!)}><Copy size={14}/> Copier le lien</button><a className="admin-order-email-payment" href={`mailto:${encodeURIComponent(order.email)}?subject=${encodeURIComponent("Paiement de votre commande Melp.atisse")}&body=${encodeURIComponent(emailBody)}`}>Envoyer le lien par e-mail</a></>}
          </>}
          {order.status === "confirmed" && order.paymentStatus === "paid" && <span className="admin-payment-paid"><Check size={14}/> Paiement confirmé</span>}
          {order.status === "confirmed" && order.paymentStatus === "paid" && <button type="button" onClick={() => void update(order.id,"completed")}>Marquer retirée</button>}
        </div>
      </article>;
    })}</div>}
  </section>;
}
