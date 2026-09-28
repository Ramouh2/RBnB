"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { motion, useMotionTemplate, useTransform } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";
import {
  RBNB_MAGNETIC_BUTTON_DEFAULTS,
  RBNB_SPRINGS,
  withOverride,
  type MagneticButtonConfig,
} from "@/lib/motion/constants";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

export type MagneticButtonVariant = "primary" | "secondary" | "ghost";
export type MagneticButtonSize = "md" | "lg";

/** Props HTML qui entrent en conflit avec les handlers Framer Motion. */
type MotionConflicts =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "style"
  | "children";

interface MagneticButtonBaseProps {
  children: ReactNode;
  className?: string;
  variant?: MagneticButtonVariant;
  size?: MagneticButtonSize;
  /** Calibration en direct (playground) : fusionnée avec RBNB_MAGNETIC_BUTTON_DEFAULTS. */
  configOverride?: Partial<MagneticButtonConfig>;
}

export type MagneticButtonProps =
  | (MagneticButtonBaseProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflicts>)
  | (MagneticButtonBaseProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, MotionConflicts | "href">);

const variantClasses: Record<MagneticButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.65),inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_12px_32px_-8px_rgba(99,102,241,0.8),inset_0_1px_0_0_rgba(255,255,255,0.3)]",
  secondary: "bg-surface-2 text-fg border border-edge shadow-sm hover:border-edge-strong",
  ghost: "bg-transparent text-fg-secondary hover:text-fg",
};

const sizeClasses: Record<MagneticButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

/**
 * Bouton CTA principal de RBnB.
 * - Desktop : attraction magnétique dans un rayon de 40px, reflet radial suivant le curseur, squash & stretch au clic.
 * - Tactile : aucun magnétisme, tap feedback `scale: 0.96`.
 * - Reduced motion : aucun déplacement spatial, reflet lumineux conservé.
 */
export function MagneticButton(props: MagneticButtonProps) {
  const { children, className, variant = "primary", size = "md", configOverride, ...rest } = props;
  const config = withOverride(RBNB_MAGNETIC_BUTTON_DEFAULTS, configOverride);
  const isDisabled = "disabled" in rest && Boolean(rest.disabled);

  const {
    ref: magneticRef,
    x,
    y,
    glowX,
    glowY,
    glowOpacity: proximity,
    pointerFine,
    reduced,
  } = useMagnetic<HTMLAnchorElement & HTMLButtonElement>({
    radius: config.radius,
    strength: config.strength,
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
    disabled: isDisabled,
  });

  const glowOpacity = useTransform(proximity, (v) => v * config.glow);
  const borderOpacity = useTransform(proximity, (v) => Math.min(1, v * config.glow * 1.6));
  const reflection = useMotionTemplate`radial-gradient(110px circle at ${glowX}px ${glowY}px, rgba(255,255,255,0.38), transparent 65%)`;
  const edgeLight = useMotionTemplate`radial-gradient(70px circle at ${glowX}px ${glowY}px, rgba(255,255,255,0.9), transparent 70%)`;

  const squash = pointerFine && !reduced;
  const whileTap = isDisabled
    ? undefined
    : squash
      ? { scaleX: config.squashX, scaleY: config.squashY }
      : { scale: config.tapScale };

  const classes = cn(
    "group relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight",
    "transition-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const motionProps = {
    style: { x, y },
    whileHover: isDisabled || reduced ? undefined : { scale: 1.015 },
    whileTap,
    transition: {
      scale: RBNB_SPRINGS.bouncy,
      scaleX: RBNB_SPRINGS.bouncy,
      scaleY: RBNB_SPRINGS.bouncy,
    },
  };

  const content = (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        style={{ background: reflection, opacity: glowOpacity }}
      />
      <motion.span
        aria-hidden="true"
        className="mask-border pointer-events-none absolute inset-0 rounded-[inherit] p-px"
        style={{ background: edgeLight, opacity: borderOpacity }}
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest;
    return (
      <MotionLink
        ref={magneticRef}
        href={href}
        className={classes}
        {...anchorProps}
        {...motionProps}
      >
        {content}
      </MotionLink>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflicts>;
  return (
    <motion.button
      ref={magneticRef}
      type={type}
      className={classes}
      {...buttonProps}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
