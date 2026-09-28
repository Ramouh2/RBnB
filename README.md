# RBnB

La plateforme premium des hôtes : logements, réservations, tarifs et revenus pilotés d'un seul geste.
Interface ultra-fluide gouvernée par un Motion Design System physique (ressorts Framer Motion).

> La constitution technique, produit et motion de RBnB est dans [`CLAUDE.md`](./CLAUDE.md).

## Démarrer

```bash
npm install
cp .env.example .env.local   # optionnel en développement
npm run dev                  # http://localhost:3000
```

Compte de démonstration : `demo@rbnb.app` / `rbnb-demo-2026` (modifiable via `.env.local`).

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing RBnB : Hero, Bento Grid, Tarifs interactifs, CTA, barre de commande ⌘K |
| `/login` | Connexion LiquidLogin (séparation Gooey, 3 gouttes, fusion, pilule) |
| `/dashboard` | Dashboard protégé (session serveur) |
| `/motion-playground` | Laboratoire de calibration du Motion System RBnB |

## Scripts

```bash
npm run lint        # ESLint 9 (flat config)
npm run typecheck   # tsc --noEmit
npm run build       # build de production Next.js
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS v4 ·
framer-motion · lucide-react · clsx · tailwind-merge. Aucun service payant : l'authentification
de démonstration est intégrée (cookie `httpOnly` signé HMAC-SHA256, sans dépendance).

## Production

Définir `RBNB_AUTH_SECRET` (≥ 32 caractères, `openssl rand -base64 32`) : sans lui, la connexion
est refusée en production. Déploiement gratuit possible sur Vercel (plan Hobby) ou tout hébergeur Node.js.
