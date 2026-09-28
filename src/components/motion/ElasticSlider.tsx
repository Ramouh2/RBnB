"use client";

import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { animate, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { useElementWidth } from "@/hooks/useElementWidth";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  RBNB_ELASTIC_SLIDER_DEFAULTS,
  RBNB_SPRINGS,
  toSpring,
  withOverride,
  type ElasticSliderConfig,
} from "@/lib/motion/constants";
import { rubberband, snapToStep } from "@/lib/motion/physics";
import { clamp, cn } from "@/lib/utils";

export interface ElasticSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Libellé accessible du slider. */
  label: string;
  /** Texte lu par les lecteurs d'écran (aria-valuetext). */
  formatValue?: (value: number) => string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  disabled?: boolean;
  className?: string;
  configOverride?: Partial<ElasticSliderConfig>;
}

/**
 * Slider RBnB à effet rubber-band : au-delà des bornes, la piste s'étire, résiste
 * (amortissement logarithmique) puis revient élastiquement au relâchement.
 * Toute la cinématique passe par des MotionValues ; `onChange` n'est émis qu'aux changements de pas.
 */
export function ElasticSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  formatValue,
  startIcon,
  endIcon,
  disabled = false,
  className,
  configOverride,
}: ElasticSliderProps) {
  const config = withOverride(RBNB_ELASTIC_SLIDER_DEFAULTS, configOverride);
  const reduced = useReducedMotion();
  const spring = toSpring(config);

  const [trackRef, width] = useElementWidth<HTMLDivElement>();
  const dragging = useRef(false);
  const lastEmitted = useRef(value);
  const range = max - min || 1;
  const toRatio = (v: number) => clamp((v - min) / range, 0, 1);

  const ratio = useMotionValue(toRatio(value));
  const overflow = useMotionValue(0);
  const rawGrab = useMotionValue(1);
  const grab = useSpring(rawGrab, RBNB_SPRINGS.bouncy);

  const thumbX = useTransform(() => ratio.get() * width + overflow.get());
  const velocity = useVelocity(thumbX);
  const stretch = useTransform(velocity, (v) => (reduced ? 1 : 1 + Math.min(Math.abs(v) / 2400, config.intensity)));
  const thumbScaleX = useTransform(() => stretch.get() * grab.get());
  const thumbScaleY = useTransform(() => grab.get() / Math.sqrt(stretch.get()));

  const trackScaleX = useTransform(overflow, (o) => 1 + Math.abs(o) / Math.max(width, 1));
  const trackScaleY = useTransform(overflow, (o) => 1 - Math.min((Math.abs(o) / Math.max(width, 1)) * 1.4, 0.4));
  const trackOrigin = useTransform(overflow, (o) => (o < 0 ? 1 : 0));
  const fillX = useTransform(ratio, (r) => `${(r - 1) * 100}%`);
  const startIconX = useTransform(overflow, (o) => Math.min(o, 0) * 0.35);
  const endIconX = useTransform(overflow, (o) => Math.max(o, 0) * 0.35);
  const startIconScale = useTransform(overflow, (o) => 1 + Math.min(Math.max(-o, 0) / 120, 0.25));
  const endIconScale = useTransform(overflow, (o) => 1 + Math.min(Math.max(o, 0) / 120, 0.25));

  // Synchronisation avec la valeur contrôlée (hors drag).
  useEffect(() => {
    lastEmitted.current = value;
    if (dragging.current) return;
    const target = clamp((value - min) / (max - min || 1), 0, 1);
    if (reduced) ratio.jump(target);
    else animate(ratio, target, spring);
    // `spring` est dérivé de config : on réagit uniquement à la valeur et aux bornes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, min, max, reduced, ratio]);

  const emit = (next: number) => {
    const snapped = snapToStep(next, min, max, step);
    if (snapped !== lastEmitted.current) {
      lastEmitted.current = snapped;
      onChange(snapped);
    }
  };

  const updateFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const trackWidth = Math.max(track.offsetWidth, 1);
    const local = clientX - rect.left;
    const excess = local < 0 ? local : local > trackWidth ? local - trackWidth : 0;
    const nextRatio = clamp(local / trackWidth, 0, 1);
    ratio.jump(nextRatio);
    overflow.jump(reduced ? 0 : rubberband(excess, config.maxOverflow));
    emit(min + nextRatio * range);
  };

  const release = () => {
    if (!dragging.current) return;
    dragging.current = false;
    rawGrab.set(1);
    const target = toRatio(lastEmitted.current);
    if (reduced) {
      ratio.jump(target);
      overflow.jump(0);
      return;
    }
    animate(ratio, target, spring);
    animate(overflow, 0, spring);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = true;
    if (!reduced) rawGrab.set(config.scale);
    updateFromPointer(event.clientX);
    trackRef.current?.parentElement?.querySelector<HTMLElement>("[role='slider']")?.focus({ preventScroll: true });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    updateFromPointer(event.clientX);
  };

  const bump = (direction: -1 | 1) => {
    if (reduced) return;
    overflow.jump(direction * config.maxOverflow * 0.4);
    animate(overflow, 0, { ...RBNB_SPRINGS.rubber, velocity: direction * 120 });
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const bigStep = step * Math.max(1, Math.round(range / step / 10));
    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = value + step;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = value - step;
        break;
      case "PageUp":
        next = value + bigStep;
        break;
      case "PageDown":
        next = value - bigStep;
        break;
      case "Home":
        next = min;
        break;
      case "End":
        next = max;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (next > max && value >= max) return bump(1);
    if (next < min && value <= min) return bump(-1);
    emit(clamp(next, min, max));
  };

  return (
    <div className={cn("flex w-full items-center gap-3", disabled && "opacity-50", className)}>
      {startIcon && (
        <motion.span aria-hidden="true" className="flex text-fg-muted" style={{ x: startIconX, scale: startIconScale }}>
          {startIcon}
        </motion.span>
      )}

      <div
        className="relative flex h-11 flex-1 touch-pan-y select-none items-center"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
      >
        <div ref={trackRef} className="relative h-1.5 w-full">
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-full bg-surface-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
            style={{ scaleX: trackScaleX, scaleY: trackScaleY, originX: trackOrigin }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/70 to-accent"
              style={{ x: fillX }}
            />
          </motion.div>
        </div>

        <motion.div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue?.(value)}
          aria-orientation="horizontal"
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          className={cn(
            "absolute left-0 top-1/2 -ml-3 -mt-3 size-6 rounded-full bg-white",
            "shadow-[0_2px_10px_rgba(0,0,0,0.55),0_0_0_4px_rgba(99,102,241,0.18)]",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50",
          )}
          style={{ x: thumbX, scaleX: thumbScaleX, scaleY: thumbScaleY }}
        />
      </div>

      {endIcon && (
        <motion.span aria-hidden="true" className="flex text-fg-muted" style={{ x: endIconX, scale: endIconScale }}>
          {endIcon}
        </motion.span>
      )}
    </div>
  );
}
