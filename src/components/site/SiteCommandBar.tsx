"use client";

import { useRouter } from "next/navigation";
import { CreditCard, Layers, Link2, LogIn, Mail, Wand2 } from "lucide-react";
import { MorphingCommandBar, type RbnbCommand } from "@/components/motion/MorphingCommandBar";

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/** Barre de commande flottante de la landing RBnB. */
export function SiteCommandBar() {
  const router = useRouter();

  const commands: RbnbCommand[] = [
    {
      id: "pricing",
      label: "Voir les tarifs RBnB",
      description: "Mensuel, annuel et estimation",
      icon: CreditCard,
      keywords: ["prix", "abonnement", "pro"],
      onSelect: () => scrollToSection("tarifs"),
      successMessage: "Section Tarifs",
    },
    {
      id: "features",
      label: "Découvrir les fonctionnalités",
      icon: Layers,
      keywords: ["calendrier", "revenus"],
      onSelect: () => scrollToSection("fonctionnalites"),
      successMessage: "Section Fonctionnalités",
    },
    {
      id: "login",
      label: "Se connecter à RBnB",
      description: "Accéder à votre dashboard",
      icon: LogIn,
      keywords: ["connexion", "login", "compte"],
      shortcut: ["G", "L"],
      onSelect: () => router.push("/login"),
      successMessage: "Ouverture de la connexion…",
    },
    {
      id: "lab",
      label: "Ouvrir le Motion Lab",
      description: "Laboratoire du Motion System RBnB",
      icon: Wand2,
      keywords: ["playground", "animation", "motion"],
      onSelect: () => router.push("/motion-playground"),
      successMessage: "Ouverture du Motion Lab…",
    },
    {
      id: "copy",
      label: "Copier le lien de RBnB",
      icon: Link2,
      keywords: ["partager", "url"],
      onSelect: async () => {
        await navigator.clipboard.writeText(window.location.origin);
      },
      successMessage: "Lien copié dans le presse-papiers",
    },
    {
      id: "contact",
      label: "Contacter l'équipe RBnB",
      icon: Mail,
      keywords: ["aide", "support", "business"],
      onSelect: () => scrollToSection("contact"),
      successMessage: "Section Contact",
    },
  ];

  return <MorphingCommandBar commands={commands} />;
}
