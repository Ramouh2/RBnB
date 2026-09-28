"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, RotateCcw } from "lucide-react";
import { RBNB_REDUCED_TRANSITION, RBNB_SPRINGS } from "@/lib/motion/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { ControlSlider, type ControlSpec } from "./ControlSlider";

/** Config de calibration : uniquement des valeurs numériques (compatible avec les interfaces). */
type NumericConfig<T> = { [K in keyof T]: number };

/** État de calibration d'un banc d'essai : valeurs courantes, mise à jour par clé, restauration. */
export function useBenchConfig<T extends NumericConfig<T>>(defaults: T) {
  const [config, setConfig] = useState<T>(defaults);
  const set = (key: keyof T, value: number) => setConfig((current) => ({ ...current, [key]: value }));
  const reset = () => setConfig(defaults);
  return { config, set, reset };
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

interface BenchProps<T extends NumericConfig<T>> {
  index: number;
  title: string;
  description: string;
  /** Nom de la constante exportée par COPY CONFIG. */
  exportName: string;
  config: T;
  controls: ControlSpec<Extract<keyof T, string>>[];
  onChange: (key: keyof T, value: number) => void;
  onReset: () => void;
  /** Boutons de déclenchement manuel des états. */
  actions?: ReactNode;
  /** Information d'état courante (ex : étape, mode). */
  status?: ReactNode;
  children: ReactNode;
  previewClassName?: string;
  className?: string;
}

/** Banc d'essai du Motion Lab RBnB : rendu live, contrôles, valeurs, RESET DEFAULTS & COPY CONFIG. */
export function Bench<T extends NumericConfig<T>>({
  index,
  title,
  description,
  exportName,
  config,
  controls,
  onChange,
  onReset,
  actions,
  status,
  children,
  previewClassName,
  className,
}: BenchProps<T>) {
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleCopy = async () => {
    const snippet = `export const ${exportName} = ${JSON.stringify(config, null, 2)} as const;\n`;
    const ok = await copyText(snippet);
    if (!ok) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  const headingId = `bench-${index}`;

  return (
    <section aria-labelledby={headingId} className={cn("surface-card flex flex-col overflow-hidden rounded-2xl", className)}>
      <header className="flex items-start justify-between gap-4 border-b border-edge-subtle p-5">
        <div className="min-w-0">
          <span className="font-mono text-[11px] tabular-nums text-fg-muted">{String(index).padStart(2, "0")}</span>
          <h2 id={headingId} className="mt-1 text-lg">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-fg-secondary">{description}</p>
        </div>
        {status && <div className="shrink-0 text-right text-xs text-fg-muted">{status}</div>}
      </header>

      <div
        className={cn(
          "relative flex min-h-64 items-center justify-center overflow-hidden bg-surface-0 p-6",
          "bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:18px_18px]",
          previewClassName,
        )}
      >
        {children}
      </div>

      {actions && <div className="flex flex-wrap gap-2 border-t border-edge-subtle p-4">{actions}</div>}

      <div className="grid gap-x-6 gap-y-4 border-t border-edge-subtle p-5 sm:grid-cols-2">
        {controls.map((control) => (
          <ControlSlider
            key={control.key}
            label={control.label}
            value={config[control.key]}
            min={control.min}
            max={control.max}
            step={control.step}
            unit={control.unit}
            onChange={(value) => onChange(control.key, value)}
          />
        ))}
      </div>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-edge-subtle p-4">
        <code className="min-w-0 truncate font-mono text-[11px] text-fg-muted">{exportName}</code>
        <div className="flex gap-2">
          <BenchButton onClick={onReset}>
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset defaults
          </BenchButton>
          <BenchButton onClick={() => void handleCopy()} aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {copied ? (
                <motion.span
                  key="done"
                  className="flex items-center gap-1.5 text-success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.bouncy}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  Copié
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Copy className="size-3.5" aria-hidden="true" />
                  Copy config
                </motion.span>
              )}
            </AnimatePresence>
          </BenchButton>
        </div>
      </footer>
    </section>
  );
}

interface BenchButtonProps {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  "aria-live"?: "polite";
  "aria-pressed"?: boolean;
}

/** Bouton compact des bancs (déclencheurs d'états, reset, copie). */
export function BenchButton({ children, onClick, active = false, ...aria }: BenchButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-xs font-medium uppercase tracking-wide transition-tint sm:h-9",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        active ? "border-accent/50 bg-accent/15 text-fg" : "border-edge bg-surface-2 text-fg-secondary hover:border-edge-strong hover:text-fg",
      )}
      {...aria}
    >
      {children}
    </motion.button>
  );
}
