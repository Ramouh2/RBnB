"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(listener: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", listener);
  return () => mql.removeEventListener("change", listener);
}

/**
 * `true` sur un appareil à curseur précis (souris / trackpad).
 * Sur écran tactile, les effets dépendant du curseur (magnétisme, tilt 3D) sont désactivés.
 * Rendu serveur : `false` (état tactile, sans effet parasite).
 */
export function usePointerFine(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
