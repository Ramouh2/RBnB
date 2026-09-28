"use client";

import type { ReactNode } from "react";
import { CalendarDays, Command, MessageSquareText, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SpotlightBentoCard, SpotlightBentoGrid } from "@/components/motion/SpotlightBentoCard";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Kbd } from "@/components/ui/Kbd";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
  visual?: ReactNode;
}

const FEATURES: Feature[] = [
  {
    icon: CalendarDays,
    title: "Calendrier unifié",
    description: "Toutes vos plateformes de réservation synchronisées dans un seul calendrier RBnB, sans double réservation.",
    className: "lg:col-span-4",
    visual: <CalendarVisual />,
  },
  {
    icon: Zap,
    title: "Tarification dynamique",
    description: "RBnB ajuste vos prix selon la saison, la demande et les événements locaux.",
    className: "lg:col-span-2",
  },
  {
    icon: TrendingUp,
    title: "Revenus en temps réel",
    description: "Suivez chaque euro, logement par logement, avec des tableaux de bord vivants.",
    className: "lg:col-span-2",
  },
  {
    icon: MessageSquareText,
    title: "Messages automatisés",
    description: "Check-in, codes d'accès, rappels : RBnB écrit à vos voyageurs au bon moment.",
    className: "lg:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Paiements sécurisés",
    description: "Encaissements, cautions et virements tracés de bout en bout.",
    className: "lg:col-span-2",
  },
  {
    icon: Command,
    title: "Tout RBnB au clavier",
    description: "Ouvrez la barre de commande et pilotez votre activité sans quitter le clavier.",
    className: "lg:col-span-6",
    visual: (
      <span className="flex items-center gap-1.5">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    ),
  },
];

export function FeaturesBento() {
  return (
    <section id="fonctionnalites" aria-labelledby="features-title" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <SectionHeader
        id="features-title"
        eyebrow="Fonctionnalités"
        title="Tout ce qu'un hôte exigeant attend de RBnB"
        description="Une seule interface, pensée comme un instrument : précise, rapide, vivante."
      />
      <SpotlightBentoGrid className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {FEATURES.map((feature, index) => (
          <SpotlightBentoCard
            key={feature.title}
            delay={index * 0.05}
            className={cn("min-h-52 sm:col-span-1", feature.className, index === 0 || index === 5 ? "sm:col-span-2" : undefined)}
            contentClassName="flex h-full flex-col justify-between gap-6 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-10 items-center justify-center rounded-xl border border-edge bg-surface-2 text-fg shadow-sm">
                <feature.icon className="size-[18px]" aria-hidden="true" />
              </span>
              {feature.visual}
            </div>
            <div>
              <h3 className="text-base">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-secondary">{feature.description}</p>
            </div>
          </SpotlightBentoCard>
        ))}
      </SpotlightBentoGrid>
    </section>
  );
}

function CalendarVisual() {
  const booked = new Set([2, 3, 4, 9, 10, 15, 16, 17, 18, 23, 24]);
  return (
    <div className="hidden grid-cols-7 gap-1 sm:grid" aria-hidden="true">
      {Array.from({ length: 28 }, (_, day) => (
        <span
          key={day}
          className={cn(
            "size-3.5 rounded-[4px] border",
            booked.has(day) ? "border-accent/40 bg-accent/60" : "border-edge-subtle bg-surface-2",
          )}
        />
      ))}
    </div>
  );
}
