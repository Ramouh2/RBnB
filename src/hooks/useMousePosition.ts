"use client";

import { useEffect, type RefObject } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

export interface MousePosition {
  /** Coordonnées viewport du curseur. */
  clientX: MotionValue<number>;
  clientY: MotionValue<number>;
  /** Coordonnées locales (px) relatives au coin haut-gauche de l'élément. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Coordonnées normalisées -1 → 1 depuis le centre de l'élément (0 hors survol). */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  /** 1 pendant le survol de l'élément, 0 sinon. */
  inside: MotionValue<number>;
}

export interface UseMousePositionOptions {
  enabled?: boolean;
  /** `element` : suivi pendant le survol ; `window` : suivi global du curseur. */
  scope?: "element" | "window";
  /** Les contacts tactiles sont ignorés par défaut (pas d'effet de survol bloqué). */
  includeTouch?: boolean;
}

/**
 * Suivi du curseur exclusivement en MotionValues : aucun re-render React à 60Hz.
 */
export function useMousePosition<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { enabled = true, scope = "element", includeTouch = false }: UseMousePositionOptions = {},
): MousePosition {
  const clientX = useMotionValue(0);
  const clientY = useMotionValue(0);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const inside = useMotionValue(0);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    const target: HTMLElement | Window = scope === "window" ? window : element;

    const handleMove = (event: PointerEvent) => {
      if (!includeTouch && event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const isInside = localX >= 0 && localY >= 0 && localX <= rect.width && localY <= rect.height;

      clientX.set(event.clientX);
      clientY.set(event.clientY);
      x.set(localX);
      y.set(localY);
      nx.set(isInside ? (localX / rect.width) * 2 - 1 : 0);
      ny.set(isInside ? (localY / rect.height) * 2 - 1 : 0);
      inside.set(isInside ? 1 : 0);
    };

    const handleLeave = () => {
      nx.set(0);
      ny.set(0);
      inside.set(0);
    };

    target.addEventListener("pointermove", handleMove as EventListener, { passive: true });
    element.addEventListener("pointerleave", handleLeave);
    return () => {
      target.removeEventListener("pointermove", handleMove as EventListener);
      element.removeEventListener("pointerleave", handleLeave);
    };
  }, [ref, enabled, scope, includeTouch, clientX, clientY, x, y, nx, ny, inside]);

  return { clientX, clientY, x, y, nx, ny, inside };
}
