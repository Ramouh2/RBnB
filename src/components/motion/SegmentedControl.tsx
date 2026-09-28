"use client";

import { useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  RBNB_PRICING_TOGGLE_DEFAULTS,
  RBNB_REDUCED_TRANSITION,
  toSpring,
  withOverride,
  type PricingToggleConfig,
} from "@/lib/motion/constants";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Élément positionné en absolu (badge) : n'affecte jamais la mise en page. */
  adornment?: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Libellé accessible du groupe. */
  label: string;
  size?: "sm" | "md";
  className?: string;
  configOverride?: Partial<PricingToggleConfig>;
}

/**
 * Sélecteur segmenté RBnB (radiogroup ARIA). La pilule active glisse d'une option à l'autre
 * via `layoutId`, avec inertie de ressort et squash & stretch pendant le déplacement.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  className,
  configOverride,
}: SegmentedControlProps<T>) {
  const config = withOverride(RBNB_PRICING_TOGGLE_DEFAULTS, configOverride);
  const reduced = useReducedMotion();
  const pillId = `rbnb-seg-${useId().replace(/:/g, "")}`;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [interacted, setInteracted] = useState(false);

  const select = (index: number, focus: boolean) => {
    const option = options[(index + options.length) % options.length];
    setInteracted(true);
    onChange(option.value);
    if (focus) buttons.current[options.indexOf(option)]?.focus();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      select(index + 1, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      select(index - 1, true);
    }
  };

  const transition = reduced ? RBNB_REDUCED_TRANSITION : toSpring(config);
  const stretch = config.scale;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("relative inline-flex rounded-full border border-edge bg-surface-1 p-1 shadow-sm", className)}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(index, false)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "relative rounded-full font-medium transition-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
              size === "md" ? "h-10 px-5 text-sm" : "h-9 px-3.5 text-[13px]",
              selected ? "text-fg" : "text-fg-muted hover:text-fg-secondary",
            )}
          >
            {selected && (
              <motion.span layoutId={pillId} transition={transition} className="absolute inset-0" aria-hidden="true">
                <motion.span
                  className="absolute inset-0 rounded-full border border-edge-strong bg-surface-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_4px_14px_-4px_rgba(0,0,0,0.6)]"
                  initial={interacted && !reduced ? { scaleX: 1, scaleY: 1 } : false}
                  animate={
                    interacted && !reduced
                      ? { scaleX: [1, 1 + stretch, 1 - stretch * 0.25, 1], scaleY: [1, 1 - stretch * 0.45, 1 + stretch * 0.1, 1] }
                      : undefined
                  }
                  transition={{ duration: 0.5, times: [0, 0.35, 0.7, 1], ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.span>
            )}
            <span className="relative z-10">{option.label}</span>
            {option.adornment}
          </button>
        );
      })}
    </div>
  );
}
