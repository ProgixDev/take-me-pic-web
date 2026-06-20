/**
 * Canonical Premium plan catalogue. These are marketing/pricing definitions
 * driven by the StoreKit / RevenueCat product configuration — static config,
 * not database rows — so they live here rather than being fetched. Keep the
 * `id`s aligned with the product ids used by `subscriptions` (free / monthly /
 * annual).
 */

export type PlanCatalogEntry = {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

export const plans: PlanCatalogEntry[] = [
  {
    id: "free",
    name: "Carnet",
    price: "Gratuit",
    period: "",
    tagline: "pour commencer le voyage",
    features: ["Trouver quelqu'un à proximité", "Prendre des photos pour les autres", "Gagner du karma", "Galerie de session chiffrée 24 h", "Accès à la communauté"],
    cta: "télécharger",
    highlight: false,
  },
  {
    id: "monthly",
    name: "Première classe — mensuel",
    price: "4,99 €",
    period: "/ mois",
    tagline: "le confort, sans engagement",
    features: ["Tout le plan Carnet", "Profil mis en avant — 3× plus de matchs", "Spots secrets, hors guide", "2× karma par session", "Aucune publicité", "Galerie illimitée"],
    cta: "essai 7 jours gratuits",
    highlight: false,
  },
  {
    id: "annual",
    name: "Première classe — annuel",
    price: "39,99 €",
    period: "/ an",
    tagline: "le meilleur prix · -33 %",
    features: ["Tout le plan mensuel", "2 mois offerts", "Badge ambassadeur", "Support prioritaire", "Accès anticipé aux nouveautés"],
    cta: "essai 7 jours gratuits",
    highlight: true,
  },
];
