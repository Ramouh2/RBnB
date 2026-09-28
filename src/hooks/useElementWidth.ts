"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Largeur d'un élément (px), mesurée avant peinture puis suivie par ResizeObserver.
 * Ne provoque un re-render qu'au redimensionnement (jamais pendant une animation).
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const next = Math.round(entries[0]?.contentRect.width ?? element.offsetWidth);
      setWidth((previous) => (previous === next ? previous : next));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}
