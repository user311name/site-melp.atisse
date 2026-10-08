"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WarmPage from "@/components/WarmPage";

export default function PaymentReturnStatus({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<"checking" | "paid" | "pending" | "error">(sessionId ? "checking" : "error");

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    let attempts = 0;
    const check = async () => {
      try {
        const response = await fetch(`/api/payments/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Vérification impossible.");
        if (active) setState(data.paymentStatus === "paid" ? "paid" : "pending");
      } catch {
        if (active) setState("error");
      }
    };
    void check();
    const timer = window.setInterval(() => { if (++attempts < 8) void check(); else window.clearInterval(timer); }, 2500);
    return () => { active = false; window.clearInterval(timer); };
  }, [sessionId]);

  return <WarmPage eyebrow="VOTRE COMMANDE MELP.ATISSE" title="Merci pour" emphasis="votre confiance." intro="Le résultat du paiement est vérifié directement auprès de Stripe." image="/images/gateau-fraises.png" imageAlt="Création pâtissière Melp.atisse">
    <section className="warm-note" role="status" aria-live="polite">
      {state === "checking" && "Vérification du paiement en cours…"}
      {state === "paid" && "Paiement confirmé. Mélissa retrouve votre commande dans son administration et vous recontactera si une précision est nécessaire."}
      {state === "pending" && "Stripe n’a pas encore confirmé le paiement. Cette page se met à jour automatiquement ; ne refaites pas le paiement."}
      {state === "error" && "Impossible de vérifier ce paiement pour le moment. Contactez Mélissa avant de réessayer."}
    </section>
    <p><Link className="warm-button" href="/">Retour à l’accueil</Link></p>
  </WarmPage>;
}
