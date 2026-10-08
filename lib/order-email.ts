import type { PickupOrder } from "@/lib/orders";
import type { SiteInquiry } from "@/lib/inquiries";

export function orderEmailDeliveryReady() {
  return Boolean(process.env.RESEND_API_KEY && process.env.MELP_EMAIL_FROM);
}

export function isValidOrderEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function formatOrderDate(order: PickupOrder) {
  if (!order.date) return "Date à convenir avec Mélissa";
  const date = new Date(`${order.date}T12:00:00Z`).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${date}${order.time ? ` à ${order.time}` : ""}`;
}

export async function sendOrderDecisionEmail(order: PickupOrder, decision: "confirmed" | "cancelled") {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MELP_EMAIL_FROM;
  if (!apiKey || !from) throw new Error("L’envoi automatique n’est pas configuré. Ajoute RESEND_API_KEY et MELP_EMAIL_FROM dans les variables de production.");
  if (!isValidOrderEmail(order.email)) throw new Error("L’adresse e-mail du client est absente ou invalide.");

  const firstName = order.name.trim().split(/\s+/)[0] || "Bonjour";
  const date = formatOrderDate(order);
  const accepted = decision === "confirmed";
  const subject = accepted ? "Votre commande Melp.atisse est confirmée" : "Réponse à votre demande Melp.atisse";
  const paragraphs = accepted
    ? ["Votre demande de commande chez Melp.atisse est acceptée.", `Votre retrait est prévu le ${date}.`, "Mélissa vous recontactera pour confirmer le montant et vous transmettre le lien de paiement sécurisé. Le règlement sera demandé séparément."]
    : ["Merci pour votre demande auprès de Melp.atisse.", `Nous sommes désolés, Mélissa ne peut pas accepter cette demande pour la date souhaitée (${date}).`, "Vous pouvez répondre à ce message pour échanger avec Mélissa sur une autre date ou une autre possibilité."];
  const text = [`Bonjour ${firstName},`, "", ...paragraphs, "", "À bientôt,", "Mélissa · Melp.atisse"].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#4b2818"><p>Bonjour ${escapeHtml(firstName)},</p>${paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}<p>À bientôt,<br/>Mélissa · Melp.atisse</p></div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `order-${decision}/${order.id}`,
    },
    body: JSON.stringify({ from, to: [order.email], reply_to: "melp.atisse.contact@gmail.com", subject, text, html }),
  });
  const result = await response.json().catch(() => null) as { id?: string; message?: string; name?: string } | null;
  if (!response.ok || !result?.id) {
    const detail = result?.message ? ` (${result.message})` : "";
    throw new Error(`L’e-mail n’a pas pu être envoyé par le service d’envoi${detail}`);
  }
  return result.id;
}

export async function sendInquiryDecisionEmail(inquiry: SiteInquiry, decision: "accepted" | "declined") {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MELP_EMAIL_FROM;
  if (!apiKey || !from) throw new Error("L’envoi automatique n’est pas configuré. Ajoute RESEND_API_KEY et MELP_EMAIL_FROM dans les variables de production.");
  if (!isValidOrderEmail(inquiry.email)) throw new Error("L’adresse e-mail du client est absente ou invalide.");
  const firstName = inquiry.name.trim().split(/\s+/)[0] || "Bonjour";
  const date = inquiry.requestedDate ? new Date(`${inquiry.requestedDate}T12:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", dateStyle: "long" }) : "à convenir";
  const accepted = decision === "accepted";
  const subject = accepted ? `Votre demande « ${inquiry.request} » est acceptée` : `Réponse à votre demande « ${inquiry.request} »`;
  const paragraphs = accepted
    ? [`Mélissa accepte votre demande « ${inquiry.request} ».`, `Date souhaitée : ${date}${inquiry.participants ? ` · ${inquiry.participants} participant(s)` : ""}.`, "Mélissa vous recontactera pour préciser les modalités et, si nécessaire, le devis."]
    : [`Merci pour votre demande « ${inquiry.request} » auprès de Melp.atisse.`, `Nous sommes désolés, Mélissa ne peut pas y donner suite pour la date souhaitée (${date}).`, "Vous pouvez répondre à ce message pour échanger avec Mélissa sur une autre date ou une autre possibilité."];
  const text = [`Bonjour ${firstName},`, "", ...paragraphs, "", "À bientôt,", "Mélissa · Melp.atisse"].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#4b2818"><p>Bonjour ${escapeHtml(firstName)},</p>${paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}<p>À bientôt,<br/>Mélissa · Melp.atisse</p></div>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `inquiry-${decision}/${inquiry.id}` },
    body: JSON.stringify({ from, to: [inquiry.email], reply_to: "melp.atisse.contact@gmail.com", subject, text, html }),
  });
  const result = await response.json().catch(() => null) as { id?: string; message?: string } | null;
  if (!response.ok || !result?.id) throw new Error(`L’e-mail n’a pas pu être envoyé par le service d’envoi${result?.message ? ` (${result.message})` : ""}`);
  return result.id;
}
