# Mise en service du paiement

Le paiement est volontairement demandé après que Mélissa a vérifié la demande et fixé le montant. L’administration crée alors un lien Stripe Checkout par carte, que Mélissa transmet à la cliente. Le site ne calcule aucun tarif à partir d’informations qui n’ont pas été validées.

## Configuration nécessaire

1. Créer/activer le compte Stripe de Melp.atisse et commencer avec les clés de test.
2. Dans le projet Vercel, connecter une base Upstash Redis. Les variables attendues sont `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`. Elles rendent le registre des commandes et la réservation des créneaux durables entre les fonctions Vercel.
3. Ajouter dans Vercel, pour l’environnement Production :
   - `STRIPE_SECRET_KEY` : clé secrète Stripe de test, puis clé live après validation du parcours ;
   - `STRIPE_WEBHOOK_SECRET` : secret fourni pour le webhook ci-dessous ;
   - `NEXT_PUBLIC_SITE_URL` : `https://site-melp-atisse.vercel.app` ;
   - `MELP_ADMIN_PASSWORD` : mot de passe administrateur privé et robuste.
   - `RESEND_API_KEY` : clé API Resend utilisée pour les confirmations envoyées depuis l’administration ;
   - `MELP_EMAIL_FROM` : expéditeur vérifié dans Resend, au format `Melp.atisse <commandes@votre-domaine.fr>`.
4. Dans Stripe, créer un webhook vers `https://site-melp-atisse.vercel.app/api/payments/webhook` et écouter `checkout.session.completed`. Copier son secret de signature dans `STRIPE_WEBHOOK_SECRET`.
5. Redéployer le site après avoir enregistré les variables.

## Parcours après configuration

1. Une cliente envoie sa demande de commande sur le site ; aucun paiement n’est prélevé à cette étape.
2. Mélissa vérifie la date, la capacité de production, les produits et le montant dans `/admin`.
3. En acceptant ou en refusant la demande depuis l’admin, Mélissa envoie automatiquement la réponse correspondante par e-mail. L’acceptation rappelle la date et l’heure de retrait et précise que le lien de paiement suivra. L’état de chaque envoi apparaît dans l’admin ; si l’envoi échoue, un bouton permet de réessayer.
4. Après validation du montant, Mélissa crée le lien Stripe et le transmet au client par e-mail. La cliente paie sur la page sécurisée hébergée par Stripe.
5. Le webhook Stripe enregistre le paiement auprès du site ; la page de retour vérifie également le statut directement auprès de Stripe.

En production, le site suspend les demandes, la gestion du calendrier et la création des liens de paiement tant que la base durable n’est pas configurée. La confirmation automatique nécessite aussi une clé Resend et une adresse d’expédition dont le domaine est vérifié. Ne placez aucune clé Stripe, Resend ou Redis dans le code source ni dans un message.

Les cartes cadeaux ne sont pas incluses dans ce parcours de paiement : leurs montants, conditions d’utilisation et leur suivi doivent d’abord être définis par Mélissa.
