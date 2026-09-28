"use client";

import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiquidFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Action à droite (bouton continuer / valider). */
  trailing?: ReactNode;
  /** Surface blanche CSS de secours tant que le calque Gooey n'est pas mesuré (évite tout flash SSR). */
  fallbackSurface?: boolean;
  invalid?: boolean;
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * Rangée de saisie nette, rendue au-dessus du calque Gooey (jamais filtrée).
 * Police 16px : évite le zoom automatique iOS à la prise de focus.
 */
export function LiquidField({
  id,
  label,
  icon: Icon,
  trailing,
  fallbackSurface = false,
  invalid = false,
  inputRef,
  className,
  ...inputProps
}: LiquidFieldProps) {
  return (
    <div
      className={cn(
        "relative flex h-14 items-center gap-3 rounded-full pl-5 pr-1.5 transition-tint",
        "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-surface-0",
        invalid ? "focus-within:ring-error/80" : "focus-within:ring-accent/70",
        fallbackSurface && "bg-fg",
        className,
      )}
    >
      <Icon className={cn("size-[18px] shrink-0", invalid ? "text-error" : "text-fg-muted")} aria-hidden="true" />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        aria-invalid={invalid || undefined}
        className="rbnb-autofill h-full min-w-0 flex-1 bg-transparent text-base text-surface-0 outline-none placeholder:text-fg-muted disabled:cursor-not-allowed"
        {...inputProps}
      />
      {trailing}
    </div>
  );
}
