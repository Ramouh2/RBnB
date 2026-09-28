/**
 * RBnB — Métadonnées produit centralisées (SEO, manifest, textes de marque).
 */
export const RBNB_SITE = {
  name: "RBnB",
  title: "RBnB — La plateforme premium des hôtes",
  tagline: "Vos logements, réservations et revenus, pilotés d'un seul geste.",
  description:
    "RBnB centralise vos logements, réservations, tarifs et revenus dans une interface ultra-fluide. Pensé pour les hôtes exigeants.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
  themeColor: "#050507",
} as const;
