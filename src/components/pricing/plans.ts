import { BarChart3, CalendarDays, Globe, Headphones, Layers, ShieldCheck, Sparkles, Users, Wallet, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BillingPeriod } from "./PricingToggle";

/** Grille tarifaire RBnB (source unique des prix affichés). */

export const RBNB_ANNUAL_DISCOUNT = 0.2;

export interface RbnbPlan {
  id: "essential" | "pro" | "business";
  name: string;
  description: string;
  monthlyPrice: number;
  features: { icon: LucideIcon; label: string }[];
}

export const RBNB_PLANS: RbnbPlan[] = [
  {
    id: "essential",
    name: "RBnB Essentiel",
    description: "Pour démarrer avec un premier logement.",
    monthlyPrice: 0,
    features: [
      { icon: CalendarDays, label: "1 logement synchronisé" },
      { icon: Wallet, label: "Suivi des revenus" },
      { icon: ShieldCheck, label: "Paiements sécurisés" },
    ],
  },
  {
    id: "pro",
    name: "RBnB Pro",
    description: "Tout RBnB pour les hôtes qui gèrent plusieurs logements.",
    monthlyPrice: 30,
    features: [
      { icon: Layers, label: "Jusqu'à 3 logements inclus" },
      { icon: Zap, label: "Tarification dynamique" },
      { icon: BarChart3, label: "Analyses avancées & exports" },
      { icon: Sparkles, label: "Messages automatisés" },
    ],
  },
  {
    id: "business",
    name: "RBnB Business",
    description: "Pour les conciergeries et équipes multi-sites.",
    monthlyPrice: 75,
    features: [
      { icon: Users, label: "Équipe & rôles illimités" },
      { icon: Globe, label: "Multi-devises & multi-sites" },
      { icon: Headphones, label: "Accompagnement dédié" },
    ],
  },
];

/** Prix mensuel affiché selon la période (remise annuelle arrondie à l'euro). */
export function planPrice(monthlyPrice: number, period: BillingPeriod): number {
  return period === "annual" ? Math.round(monthlyPrice * (1 - RBNB_ANNUAL_DISCOUNT)) : monthlyPrice;
}

/** Estimation RBnB Pro : 3 logements inclus, puis 8 € par logement supplémentaire. */
export function estimateProPrice(listings: number, period: BillingPeriod): number {
  const monthly = 30 + Math.max(0, listings - 3) * 8;
  return planPrice(monthly, period);
}
