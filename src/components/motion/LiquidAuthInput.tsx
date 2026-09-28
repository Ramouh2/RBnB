"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { useElementWidth } from "@/hooks/useElementWidth";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RBNB_LIQUID_DEFAULTS, withOverride, type LiquidConfig } from "@/lib/motion/constants";
import { cn } from "@/lib/utils";
import { isValidEmail } from "@/lib/validation";
import { LIQUID_BAR_HEIGHT } from "./liquid/geometry";
import { LiquidField } from "./liquid/LiquidField";
import { LiquidSurface } from "./liquid/LiquidSurface";
import { useLiquidSplit } from "./liquid/useLiquidSplit";

export interface LiquidAuthInputProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  /** Contrôle manuel du déploiement. Sans valeur : déploiement automatique dès que l'email est valide. */
  expanded?: boolean;
  emailInvalid?: boolean;
  passwordInvalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  emailTrailing?: ReactNode;
  passwordTrailing?: ReactNode;
  onEmailEnter?: () => void;
  onPasswordEnter?: () => void;
  className?: string;
  configOverride?: Partial<LiquidConfig>;
}

/**
 * Deux champs RBnB (Email / Password) reliés par une séparation liquide visqueuse.
 * Le pont s'étire verticalement, s'affine jusqu'au ratio NECK puis se détache à la tension PULL.
 * Calque Gooey (SVG filtré) et calque de saisie (net) sont strictement séparés.
 */
export function LiquidAuthInput({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  expanded: controlledExpanded,
  emailInvalid = false,
  passwordInvalid = false,
  disabled = false,
  autoFocus = false,
  emailPlaceholder = "nom@rbnb.app",
  passwordPlaceholder = "Mot de passe",
  emailTrailing,
  passwordTrailing,
  onEmailEnter,
  onPasswordEnter,
  className,
  configOverride,
}: LiquidAuthInputProps) {
  const config = withOverride(RBNB_LIQUID_DEFAULTS, configOverride);
  const reduced = useReducedMotion();
  const uid = useId();
  const [containerRef, width] = useElementWidth<HTMLDivElement>();

  const [emailReady, setEmailReady] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Déploiement automatique après une courte pause sur un email valide.
  useEffect(() => {
    const valid = isValidEmail(email);
    const timer = setTimeout(() => setEmailReady(valid), valid ? config.delay : 0);
    return () => clearTimeout(timer);
  }, [email, config.delay]);

  const expanded = controlledExpanded ?? (emailReady || password.length > 0 || passwordFocused);
  const { split, reveal, lowerY } = useLiquidSplit(config, reduced, expanded);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{ height: LIQUID_BAR_HEIGHT * 2 + config.gap }}
    >
      {width > 0 && (
        <LiquidSurface width={width} split={split} config={config} reduced={reduced} lowerOpacity={reduced ? reveal : undefined} />
      )}

      <motion.div
        className="absolute inset-x-0 top-0"
        style={{ y: lowerY, opacity: reveal }}
        inert={!expanded}
        aria-hidden={!expanded}
      >
        <LiquidField
          id={`${uid}-password`}
          label="Mot de passe RBnB"
          icon={Lock}
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder={passwordPlaceholder}
          value={password}
          disabled={disabled}
          invalid={passwordInvalid}
          onChange={(event) => onPasswordChange(event.target.value)}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onPasswordEnter?.();
            }
          }}
          trailing={passwordTrailing}
        />
      </motion.div>

      <div className="absolute inset-x-0 top-0">
        <LiquidField
          id={`${uid}-email`}
          label="Adresse email RBnB"
          icon={Mail}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus={autoFocus}
          placeholder={emailPlaceholder}
          value={email}
          disabled={disabled}
          invalid={emailInvalid}
          fallbackSurface={width === 0}
          onChange={(event) => onEmailChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onEmailEnter?.();
            }
          }}
          trailing={emailTrailing}
        />
      </div>
    </div>
  );
}
