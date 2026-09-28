/**
 * RBnB — Fonctions physiques pures (sans dépendance React), testables isolément.
 */

/**
 * Rubber-band à amortissement logarithmique : la résistance croît avec la traction.
 * @param excess distance tirée au-delà de la borne (px, signée)
 * @param limit débordement visuel maximal (px)
 */
export function rubberband(excess: number, limit: number): number {
  if (excess === 0 || limit <= 0) return 0;
  const c = limit * 0.45;
  const damped = c * Math.log1p(Math.abs(excess) / c);
  return Math.sign(excess) * Math.min(damped, limit);
}

/** Arrondit une valeur au pas le plus proche dans [min, max]. */
export function snapToStep(value: number, min: number, max: number, step: number): number {
  const snapped = Math.round((value - min) / step) * step + min;
  const decimals = (step.toString().split(".")[1] ?? "").length;
  return Number(Math.min(max, Math.max(min, snapped)).toFixed(decimals));
}

export interface BridgeGeometry {
  /** Largeur des barres (px). */
  width: number;
  /** Hauteur d'une barre (px). */
  height: number;
  /** Ordonnée du bas de la barre supérieure (px). */
  topEdge: number;
  /** Ordonnée du haut de la barre inférieure (px). */
  bottomEdge: number;
  /** Largeur de base du pont à ses attaches (px). */
  base: number;
  /** Ratio d'amincissement au centre (1 = aucun, NECK = amincissement maximal). */
  neckRatio: number;
  /** Abscisse du centre du pont (px). */
  centerX: number;
}

/**
 * Chemin SVG du pont liquide entre deux barres : deux attaches larges reliées par
 * un col concave dont la largeur est `base * neckRatio`.
 */
export function bridgePath({ topEdge, bottomEdge, base, neckRatio, centerX, height }: BridgeGeometry): string {
  // Les attaches remontent dans les barres pour une fusion Gooey sans couture.
  const overlap = height * 0.45;
  const top = topEdge - overlap;
  const bottom = bottomEdge + overlap;
  const mid = (topEdge + bottomEdge) / 2;
  const half = base / 2;
  const neck = Math.max(0.5, (base * neckRatio) / 2);
  const l = centerX - half;
  const r = centerX + half;

  return [
    `M ${l} ${top}`,
    `L ${r} ${top}`,
    `C ${r} ${topEdge}, ${centerX + neck} ${mid - (mid - topEdge) * 0.35}, ${centerX + neck} ${mid}`,
    `C ${centerX + neck} ${mid + (bottomEdge - mid) * 0.35}, ${r} ${bottomEdge}, ${r} ${bottom}`,
    `L ${l} ${bottom}`,
    `C ${l} ${bottomEdge}, ${centerX - neck} ${mid + (bottomEdge - mid) * 0.35}, ${centerX - neck} ${mid}`,
    `C ${centerX - neck} ${mid - (mid - topEdge) * 0.35}, ${l} ${topEdge}, ${l} ${top}`,
    "Z",
  ].join(" ");
}
