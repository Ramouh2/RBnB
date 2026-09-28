"use client";

import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { ElasticSlider } from "@/components/motion/ElasticSlider";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SpotlightBentoCard, SpotlightBentoGrid } from "@/components/motion/SpotlightBentoCard";
import { SectionHeader } from "@/components/site/SectionHeader";
import { formatCurrencyFr } from "@/lib/format";
import { AnimatedPrice } from "./AnimatedPrice";
import { RBNB_PLANS, estimateProPrice, planPrice, type RbnbPlan } from "./plans";
import { PricingToggle, type BillingPeriod } from "./PricingToggle";
import { ProCard } from "./ProCard";

/** Grille tarifaire interactive de RBnB. */
export function PricingSection() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [listings, setListings] = useState(6);

  const [essential, pro, business] = RBNB_PLANS;
  const proPrice = planPrice(pro.monthlyPrice, period);
  const estimate = estimateProPrice(listings, period);

  return (
    <section id="tarifs" aria-labelledby="tarifs-title" className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <SectionHeader
        id="tarifs-title"
        eyebrow="Tarifs"
        title="Un tarif clair, pensé pour chaque hôte RBnB"
        description="Commencez gratuitement, passez à RBnB Pro quand votre activité décolle. Sans engagement, résiliable à tout moment."
      />

      <div className="mt-10 flex justify-center">
        <PricingToggle value={period} onChange={setPeriod} />
      </div>

      <SpotlightBentoGrid className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
        <PlanCard plan={essential} period={period} delay={0.05} cta="Commencer gratuitement" href="/login" />
        <ProCard
          className="lg:-my-3"
          description={pro.description}
          price={proPrice}
          features={pro.features}
          billingNote={period === "annual" ? `Facturé ${formatCurrencyFr(proPrice * 12)} par an` : "Sans engagement, mensuel"}
          cta={
            <MagneticButton href="/login" className="w-full" size="lg">
              Essayer RBnB Pro
              <ArrowRight className="size-4" aria-hidden="true" />
            </MagneticButton>
          }
        />
        <PlanCard plan={business} period={period} delay={0.15} cta="Contacter l'équipe RBnB" href="#contact" />
      </SpotlightBentoGrid>

      <SpotlightBentoCard className="mt-5" contentClassName="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg">Estimez votre abonnement RBnB Pro</h3>
            <p className="mt-1 text-sm text-fg-secondary">3 logements inclus, puis 8 € par logement supplémentaire.</p>
          </div>
          <ElasticSlider
            value={listings}
            onChange={setListings}
            min={1}
            max={50}
            label="Nombre de logements"
            formatValue={(v) => `${v} logement${v > 1 ? "s" : ""}`}
            startIcon={<Minus className="size-4" />}
            endIcon={<Plus className="size-4" />}
          />
          <p className="text-sm text-fg-secondary">
            <span className="font-semibold tabular-nums text-fg">{listings}</span> logement{listings > 1 ? "s" : ""} gérés avec RBnB
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <AnimatedPrice
            value={estimate}
            className="text-5xl font-semibold tracking-tight text-fg"
            suffix="/mois"
            suffixClassName="text-sm font-normal text-fg-muted"
            srLabel={(formatted) => `Estimation RBnB Pro : ${formatted} par mois`}
          />
          <span className="mt-2 text-xs text-fg-muted">{period === "annual" ? "Remise annuelle de 20 % incluse" : "Facturation mensuelle"}</span>
        </div>
      </SpotlightBentoCard>
    </section>
  );
}

interface PlanCardProps {
  plan: RbnbPlan;
  period: BillingPeriod;
  delay: number;
  cta: string;
  href: string;
}

function PlanCard({ plan, period, delay, cta, href }: PlanCardProps) {
  const price = planPrice(plan.monthlyPrice, period);
  return (
    <SpotlightBentoCard delay={delay} contentClassName="flex h-full flex-col gap-6 p-6 sm:p-8">
      <div>
        <h3 className="text-lg">{plan.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-secondary">{plan.description}</p>
      </div>
      <div>
        <AnimatedPrice
          value={price}
          className="text-4xl font-semibold tracking-tight text-fg"
          suffix="/mois"
          suffixClassName="text-sm font-normal text-fg-muted"
          srLabel={(formatted) => `${plan.name} : ${formatted} par mois`}
        />
        <div className="mt-2 h-5 text-xs text-fg-muted">
          {plan.monthlyPrice === 0 ? "Gratuit pour toujours" : period === "annual" ? `Facturé ${formatCurrencyFr(price * 12)} par an` : "Sans engagement"}
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {plan.features.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-sm text-fg-secondary">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-edge bg-surface-2 text-fg-secondary">
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
            {label}
          </li>
        ))}
      </ul>
      <MagneticButton href={href} variant="secondary" className="mt-auto w-full" size="lg">
        {cta}
      </MagneticButton>
    </SpotlightBentoCard>
  );
}
