import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Le paiement Stripe n’est pas configuré. Ajoutez STRIPE_SECRET_KEY dans les variables d’environnement.");
  stripeClient ??= new Stripe(secret);
  return stripeClient;
}

export function getSiteUrl(request?: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const origin = request?.headers.get("origin");
  if (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  throw new Error("Configurez NEXT_PUBLIC_SITE_URL avec l’adresse officielle du site.");
}
