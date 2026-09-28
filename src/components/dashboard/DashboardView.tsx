"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, CalendarPlus, CreditCard, LogOut, RefreshCw, Star, TrendingUp, Wallet, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { signOutAction } from "@/app/dashboard/actions";
import { MorphingCommandBar, type RbnbCommand } from "@/components/motion/MorphingCommandBar";
import { SegmentedControl } from "@/components/motion/SegmentedControl";
import { SpotlightBentoCard, SpotlightBentoGrid } from "@/components/motion/SpotlightBentoCard";
import { StatefulSubmitButton, type SubmitStatus } from "@/components/motion/StatefulSubmitButton";
import { AnimatedPrice } from "@/components/pricing/AnimatedPrice";
import { Logo } from "@/components/ui/Logo";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RBNB_REDUCED_TRANSITION, RBNB_SPRINGS } from "@/lib/motion/constants";
import { formatCurrencyFr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DASHBOARD_DATA, UPCOMING_BOOKINGS, type DashboardPeriod } from "./data";
import { RevenueChart } from "./RevenueChart";

const PERIOD_LABELS: Record<DashboardPeriod, string> = { "7d": "7 jours", "30d": "30 jours", "12m": "12 mois" };

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function DashboardView({ email }: { email: string }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [period, setPeriod] = useState<DashboardPeriod>("30d");
  const [syncStatus, setSyncStatus] = useState<SubmitStatus>("idle");
  const data = DASHBOARD_DATA[period];

  const synchronize = async () => {
    if (syncStatus === "loading") return;
    setSyncStatus("loading");
    await wait(1200);
    setSyncStatus("success");
    await wait(2200);
    setSyncStatus("idle");
  };

  const commands: RbnbCommand[] = [
    {
      id: "sync",
      label: "Synchroniser les calendriers",
      description: "Toutes les plateformes connectées",
      icon: RefreshCw,
      keywords: ["calendrier", "sync"],
      onSelect: () => wait(1100),
      successMessage: "Calendriers à jour",
    },
    {
      id: "booking",
      label: "Nouvelle réservation",
      description: "Bloquer des dates manuellement",
      icon: CalendarPlus,
      keywords: ["réservation", "ajouter"],
      onSelect: () => wait(700),
      successMessage: "Brouillon de réservation créé",
    },
    {
      id: "period",
      label: "Afficher les 12 derniers mois",
      icon: TrendingUp,
      keywords: ["revenus", "année", "période"],
      onSelect: () => setPeriod("12m"),
      successMessage: "Période : 12 mois",
    },
    {
      id: "pricing",
      label: "Voir les tarifs RBnB",
      icon: CreditCard,
      onSelect: () => router.push("/#tarifs"),
      successMessage: "Ouverture des tarifs…",
    },
    {
      id: "lab",
      label: "Ouvrir le Motion Lab",
      icon: Wand2,
      onSelect: () => router.push("/motion-playground"),
      successMessage: "Ouverture du Motion Lab…",
    },
    {
      id: "logout",
      label: "Se déconnecter de RBnB",
      icon: LogOut,
      keywords: ["déconnexion", "quitter"],
      onSelect: () => signOutAction(),
      successMessage: "À bientôt sur RBnB",
    },
  ];

  const kpis: { icon: LucideIcon; label: string; node: ReactNode }[] = [
    {
      icon: Wallet,
      label: "Revenus",
      node: <AnimatedPrice value={data.revenue} srLabel={(f) => `Revenus : ${f}`} />,
    },
    {
      icon: CalendarDays,
      label: "Réservations",
      node: <AnimatedPrice value={data.bookings} currency={null} srLabel={(f) => `${f} réservations`} />,
    },
    {
      icon: TrendingUp,
      label: "Taux d'occupation",
      node: <AnimatedPrice value={data.occupancy} currency="%" srLabel={(f) => `Occupation : ${f}`} />,
    },
    {
      icon: Star,
      label: "Note moyenne",
      node: <AnimatedPrice value={data.rating} currency="★" fractionDigits={2} srLabel={(f) => `Note moyenne : ${f}`} />,
    },
  ];

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-[var(--z-sticky)] border-b border-edge-subtle bg-surface-0/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden h-4 w-px bg-edge sm:block" aria-hidden="true" />
            <span className="hidden text-sm text-fg-secondary sm:block">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden max-w-[16rem] truncate rounded-full border border-edge bg-surface-1 px-3 py-1.5 text-xs text-fg-secondary sm:block">
              {email}
            </span>
            <form action={signOutAction}>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-edge bg-surface-1 px-4 text-sm text-fg-secondary transition-tint hover:border-edge-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Déconnexion</span>
                <span className="sr-only sm:hidden">Se déconnecter</span>
              </motion.button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-32 pt-10 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl">Votre activité RBnB</h1>
            <p className="mt-2 text-sm text-fg-secondary">Vue d&apos;ensemble sur {PERIOD_LABELS[period]}. Appuyez sur ⌘K pour agir.</p>
          </div>
          <SegmentedControl<DashboardPeriod>
            label="Période du dashboard RBnB"
            size="sm"
            value={period}
            onChange={setPeriod}
            options={(Object.keys(PERIOD_LABELS) as DashboardPeriod[]).map((value) => ({ value, label: PERIOD_LABELS[value] }))}
          />
        </div>

        <SpotlightBentoGrid className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((kpi, index) => (
            <SpotlightBentoCard key={kpi.label} delay={index * 0.05} contentClassName="flex flex-col gap-4 p-5">
              <span className="flex items-center gap-2 text-xs font-medium text-fg-muted">
                <kpi.icon className="size-3.5" aria-hidden="true" />
                {kpi.label}
              </span>
              <span className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{kpi.node}</span>
            </SpotlightBentoCard>
          ))}
        </SpotlightBentoGrid>

        <SpotlightBentoGrid className="grid gap-4 lg:grid-cols-5">
          <SpotlightBentoCard className="lg:col-span-3" contentClassName="flex flex-col gap-6 p-6" configOverride={{ rotation: 2 }}>
            <div className="flex items-center justify-between">
              <h2 className="text-base">Revenus</h2>
              <span className="text-xs text-fg-muted">{PERIOD_LABELS[period]}</span>
            </div>
            <RevenueChart series={data.series} labels={data.seriesLabels} />
          </SpotlightBentoCard>

          <SpotlightBentoCard className="lg:col-span-2" contentClassName="flex h-full flex-col gap-4 p-6" configOverride={{ rotation: 2 }}>
            <h2 className="text-base">Prochaines arrivées</h2>
            <motion.ul
              className="flex flex-col gap-2"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.06 } } }}
            >
              {UPCOMING_BOOKINGS.map((booking) => (
                <motion.li
                  key={booking.id}
                  variants={{
                    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.default },
                  }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-edge-subtle bg-surface-2/50 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{booking.guest}</p>
                    <p className="truncate text-xs text-fg-muted">
                      {booking.listing} · {booking.dates}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end">
                    <span className="text-sm tabular-nums text-fg">{formatCurrencyFr(booking.amount)}</span>
                    <span className={cn("text-[11px]", booking.status === "confirmée" ? "text-success" : "text-warning")}>
                      {booking.status}
                    </span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </SpotlightBentoCard>
        </SpotlightBentoGrid>

        <SpotlightBentoCard contentClassName="flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base">Synchronisation des calendriers</h2>
            <p className="mt-1 text-sm text-fg-secondary">Récupère les dernières réservations de toutes vos plateformes connectées.</p>
          </div>
          <StatefulSubmitButton
            type="button"
            status={syncStatus}
            onClick={() => void synchronize()}
            loadingLabel="Synchronisation en cours"
            successLabel="Synchronisé"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Synchroniser
          </StatefulSubmitButton>
        </SpotlightBentoCard>
      </main>

      <MorphingCommandBar commands={commands} />
    </div>
  );
}
