"use client";

import { useSyncExternalStore } from "react";

/**
 * Détection réactive de `prefers-reduced-motion`, combinée à un override global
 * (piloté depuis /motion-playground) pour tester le mode réduit sans changer l'OS.
 */

export type ReducedMotionOverride = "system" | "reduce" | "full";

const QUERY = "(prefers-reduced-motion: reduce)";

let override: ReducedMotionOverride = "system";
const overrideListeners = new Set<() => void>();

export function setReducedMotionOverride(next: ReducedMotionOverride) {
  if (next === override) return;
  override = next;
  overrideListeners.forEach((listener) => listener());
}

function subscribeOverride(listener: () => void) {
  overrideListeners.add(listener);
  return () => {
    overrideListeners.delete(listener);
  };
}

function subscribeMedia(listener: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", listener);
  return () => mql.removeEventListener("change", listener);
}

export function useReducedMotionOverride(): ReducedMotionOverride {
  return useSyncExternalStore(
    subscribeOverride,
    () => override,
    () => "system",
  );
}

export function useSystemReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMedia,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/** `true` lorsque les mouvements doivent être réduits (OS ou override playground). */
export function useReducedMotion(): boolean {
  const system = useSystemReducedMotion();
  const current = useReducedMotionOverride();
  if (current === "system") return system;
  return current === "reduce";
}
