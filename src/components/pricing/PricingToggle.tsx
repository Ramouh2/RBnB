"use client";

import { SegmentedControl } from "@/components/motion/SegmentedControl";
import type { DiscountBadgeConfig, PricingToggleConfig } from "@/lib/motion/constants";
import { DiscountBadge } from "./DiscountBadge";

export type BillingPeriod = "monthly" | "annual";

export interface PricingToggleProps {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
  discountLabel?: string;
  className?: string;
  configOverride?: Partial<PricingToggleConfig>;
  badgeConfigOverride?: Partial<DiscountBadgeConfig>;
}

/** Toggle Mensuel / Annuel de RBnB, avec badge de remise absolu (aucun layout shift). */
export function PricingToggle({
  value,
  onChange,
  discountLabel = "-20 %",
  className,
  configOverride,
  badgeConfigOverride,
}: PricingToggleProps) {
  return (
    <SegmentedControl<BillingPeriod>
      label="Période de facturation RBnB"
      value={value}
      onChange={onChange}
      className={className}
      configOverride={configOverride}
      options={[
        { value: "monthly", label: "Mensuel" },
        {
          value: "annual",
          label: (
            <>
              Annuel<span className="sr-only"> (remise {discountLabel})</span>
            </>
          ),
          adornment: (
            <DiscountBadge
              active={value === "annual"}
              label={discountLabel}
              className="-right-3 -top-3"
              configOverride={badgeConfigOverride}
            />
          ),
        },
      ]}
    />
  );
}
