"use client";

import { useEffect, useState } from "react";
import { Check, Download, RefreshCw, X } from "lucide-react";
import type { PickupOrder } from "@/lib/orders";

const statusText: Record<PickupOrder["status"], string> = { held: "Créneau retenu", awaiting_confirmation: "À confirmer", confirmed: "Confirmée", completed: "Terminée", cancelled: "Refusée / annulée" };

export default function OrderAdmin({ password }: { password: string }) {
  const [orders, setOrders] = useState<PickupOrder[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    const response = await fetch("/api/orders", { headers: { "x-melp-admin-password": password }, cache: "no-store" });
    const result = await response.json(); if (response.ok) setOrders(result); else setMessage(result.error ?? "Impossible de lire les commandes."); setBusy(false);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/orders", { headers: { "x-melp-admin-password": password }, cache: "no-store" })
      .then(response => response.json().then(result => ({ response, result })))
      .then(({ response, result }) => { if (active) { if (response.ok) setOrders(result); else setMessage(result.error ?? "Impossible de lire les commandes."); } })
      .catch(() => { if (active) setMessage("Impossible de lire les commandes."); });
    return () => { active = false; };
  }, [password]);

  async function update(id: string, status: PickupOrder["status"]) {
    setMessage(""); const response = await fetch("/api/orders/update", { method: "POST", headers: { "Content-Type": "application/json", "x-melp-admin-password": password }, body: JSON.stringify({ id, status }) });
    const result = await response.json(); if (!response.ok) setMessage(result.error ?? "Mise à jour impossible."); else await load();
  }

  async function exportCalendar() {
    setMessage("");
    const response = await fetch("/api/orders/calendar", { headers: { "x-melp-admin-password": password }, cache: "no-store" });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setMessage(result?.error ?? "Le calendrier n’a pas pu être téléchargé.");
      return;
    }
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = "melp-atisse-retraits-confirmes.ics";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Calendrier téléchargé. Importe le fichier .ics dans ton agenda professionnel ; il contient les retraits déjà confirmés au moment du téléchargement.");
  }

  return <section className="admin-loyalty"><div className="admin-products-heading"><div><span className="warm-eyebrow">SUIVI CLIENT</span><h2>Demandes et commandes</h2><p>Une demande est enregistrée mais reste à confirmer. Une confirmation bloque le créneau de retrait.</p></div><div className="admin-order-tools"><button type="button" className="admin-refresh" onClick={() => void exportCalendar()}><Download size={15}/> Télécharger le calendrier (.ics)</button><button type="button" className="admin-refresh" onClick={() => void load()} disabled={busy}><RefreshCw size={15}/> Actualiser</button></div></div>{message && <p role="status" className="admin-loyalty-notice">{message}</p>}{orders.length === 0 ? <p className="admin-empty">Aucune demande enregistrée pour le moment.</p> : <div className="admin-order-list">{orders.map(order => <article className="admin-order" key={order.id}><div className="admin-order-main"><span>{order.kind === "pickup" ? `Retrait · ${order.date} à ${order.time}` : `Date souhaitée · ${order.date ?? "à préciser"}${order.time ? ` à ${order.time}` : ""}`} · {statusText[order.status]}</span><strong>{order.name || "Créneau en attente"}</strong><span>{order.email} · {order.phone}</span><span>{order.products}</span>{order.notes && <small>Précisions : {order.notes}</small>}<a href={`mailto:${encodeURIComponent(order.email)}?subject=${encodeURIComponent("Votre demande Melp.atisse")}`}>Répondre par e-mail</a></div><div className="admin-order-actions">{order.status === "awaiting_confirmation" && <><button type="button" onClick={() => void update(order.id,"confirmed")}><Check size={14}/> Confirmer</button><button type="button" onClick={() => void update(order.id,"cancelled")}><X size={14}/> Refuser</button></>}{order.status === "confirmed" && <button type="button" onClick={() => void update(order.id,"completed")}>Marquer retirée</button>}</div></article>)}</div>}</section>;
}
