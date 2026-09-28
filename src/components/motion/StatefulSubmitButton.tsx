"use client";

import { useEffect, useMemo, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { CircleAlert } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  RBNB_REDUCED_TRANSITION,
  RBNB_SPRINGS,
  RBNB_SUBMIT_BUTTON_DEFAULTS,
  toSpring,
  withOverride,
  type SubmitButtonConfig,
} from "@/lib/motion/constants";
import { crossfade, shakeTransition } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";
import { LiquidSpinner } from "./liquid/LiquidSpinner";

export type SubmitStatus = "idle" | "loading" | "success" | "error";

type MotionConflicts = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "style" | "children";

export interface StatefulSubmitButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflicts> {
  /** État contrôlé : IDLE → LOADING → SUCCESS → ERROR. */
  status: SubmitStatus;
  /** Libellé de l'état IDLE. */
  children: ReactNode;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  /** Message de feedback affiché sous le bouton en état ERROR. */
  errorMessage?: string;
  /** Occupe toute la largeur disponible en état IDLE. */
  fullWidth?: boolean;
  configOverride?: Partial<SubmitButtonConfig>;
}

const BACKGROUND: Record<SubmitStatus, string> = {
  idle: "#6366f1",
  loading: "#1a1d28",
  success: "#10b981",
  error: "#ef4444",
};

/**
 * Bouton de validation / paiement RBnB à 4 états continus.
 * La largeur morphe via la projection `layout` dans un conteneur à hauteur réservée : aucun layout shift.
 */
export function StatefulSubmitButton({
  status,
  children,
  loadingLabel = "Traitement en cours",
  successLabel = "Confirmé",
  errorLabel = "Réessayer",
  errorMessage,
  fullWidth = false,
  configOverride,
  className,
  onClick,
  disabled,
  type = "submit",
  ...rest
}: StatefulSubmitButtonProps) {
  const config = withOverride(RBNB_SUBMIT_BUTTON_DEFAULTS, configOverride);
  const reduced = useReducedMotion();
  const shake = useAnimationControls();
  const pulse = useAnimationControls();
  const previous = useRef<SubmitStatus>(status);

  const locked = status === "loading" || status === "success";
  const spring = reduced ? RBNB_REDUCED_TRANSITION : toSpring(config);

  useEffect(() => {
    if (previous.current === status) return;
    previous.current = status;
    if (reduced) return;
    if (status === "error") {
      const { x, transition } = shakeTransition(config.shake);
      void shake.start({ x, transition });
    }
    if (status === "success") {
      // Rebond de confirmation : impulsion physique sur un ressort (1 → 1 avec vélocité).
      void pulse.start({ scale: 1, transition: { ...RBNB_SPRINGS.bouncy, velocity: 2.4 } });
    }
  }, [status, reduced, shake, pulse, config.shake]);

  const particles = useMemo(
    () =>
      Array.from({ length: config.particles }, (_, i) => {
        const angle = (i / config.particles) * Math.PI * 2 + (i % 2 ? 0.25 : -0.1);
        const distance = config.intensity * (0.75 + ((i * 37) % 10) / 20);
        return {
          id: i,
          x: Math.cos(angle) * distance * 1.6,
          y: Math.sin(angle) * distance,
          size: i % 3 === 0 ? 5 : 3.5,
          color: i % 3 === 0 ? "#6ee7b7" : i % 3 === 1 ? "#f8fafc" : "#a5b4fc",
        };
      }),
    [config.particles, config.intensity],
  );

  const announcement =
    status === "loading" ? loadingLabel : status === "success" ? successLabel : status === "error" ? (errorMessage ?? errorLabel) : "";

  return (
    <div className={cn("relative flex flex-col items-center", fullWidth && "w-full", className)}>
      <motion.div animate={shake} className={cn("relative flex h-12 items-center justify-center", fullWidth ? "w-full" : "min-w-12")}>
        <motion.div animate={pulse} className={cn("flex items-center justify-center", fullWidth && "w-full")}>
          <motion.button
            layout
            type={type}
            disabled={disabled || locked}
            aria-disabled={disabled || locked}
            aria-busy={status === "loading"}
            onClick={(event) => {
              if (locked) {
                event.preventDefault();
                return;
              }
              onClick?.(event);
            }}
            initial={false}
            animate={{ backgroundColor: BACKGROUND[status] }}
            whileHover={locked || reduced ? undefined : { scale: 1.015 }}
            whileTap={locked ? undefined : { scale: config.tapScale }}
            transition={{ layout: spring, backgroundColor: { duration: 0.24 }, scale: RBNB_SPRINGS.bouncy }}
            style={{ borderRadius: 999 }}
            className={cn(
              "relative flex h-12 items-center justify-center overflow-hidden font-medium text-white",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_10px_28px_-12px_rgba(0,0,0,0.8)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
              "disabled:cursor-default",
              status === "loading" ? "w-12" : fullWidth && status === "idle" ? "w-full" : "px-6",
            )}
            {...rest}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {status === "idle" && (
                <motion.span key="idle" layout="position" variants={crossfade} initial="hidden" animate="visible" exit="exit" className="flex items-center gap-2 whitespace-nowrap px-1 text-sm">
                  {children}
                </motion.span>
              )}
              {status === "loading" && (
                <motion.span key="loading" layout="position" variants={crossfade} initial="hidden" animate="visible" exit="exit" className="flex items-center">
                  <LiquidSpinner size={22} className="text-white" />
                </motion.span>
              )}
              {status === "success" && (
                <motion.span key="success" layout="position" variants={crossfade} initial="hidden" animate="visible" exit="exit" className="flex items-center gap-2 whitespace-nowrap text-sm">
                  <CheckMark reduced={reduced} />
                  {successLabel}
                </motion.span>
              )}
              {status === "error" && (
                <motion.span key="error" layout="position" variants={crossfade} initial="hidden" animate="visible" exit="exit" className="flex items-center gap-2 whitespace-nowrap text-sm">
                  <CircleAlert className="size-4" aria-hidden="true" />
                  {errorLabel}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Micro-particules de célébration (hors du bouton : non rognées) */}
        <AnimatePresence>
          {status === "success" && !reduced && (
            <motion.span key="burst" aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center" exit={{ opacity: 0 }}>
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute rounded-full"
                  style={{ width: p.size, height: p.size, background: p.color }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{ x: p.x, y: p.y, scale: [0, 1.15, 0], opacity: [1, 1, 0] }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                />
              ))}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Zone de message à hauteur réservée : zéro layout shift */}
      <div className="h-6 pt-1.5 text-center">
        <AnimatePresence mode="wait" initial={false}>
          {status === "error" && errorMessage && (
            <motion.p
              key={errorMessage}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.snappy}
              className="text-xs font-medium text-error"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}

function CheckMark({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={reduced ? { duration: 0 } : { ...RBNB_SPRINGS.default, delay: 0.1 }}
      />
    </svg>
  );
}
