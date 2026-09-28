/** Géométrie partagée des modules liquides RBnB (LiquidAuthInput, LiquidLogin). */

/** Hauteur d'une barre liquide (px) — cible tactile ≥ 44px. */
export const LIQUID_BAR_HEIGHT = 56;
/** Marge autour du calque Gooey pour le flou et les gouttes (px). */
export const LIQUID_PADDING = 28;
/** Largeur de la pilule compacte (soumission LiquidLogin). */
export const LIQUID_PILL_WIDTH = 132;

/** Chemin SVG d'un rectangle à coins entièrement arrondis (pilule). */
export function pillPath(x: number, y: number, width: number, height: number): string {
  const w = Math.max(width, 0);
  const r = Math.min(height / 2, w / 2);
  return [
    `M ${x + r} ${y}`,
    `H ${x + w - r}`,
    `A ${r} ${r} 0 0 1 ${x + w} ${y + r}`,
    `V ${y + height - r}`,
    `A ${r} ${r} 0 0 1 ${x + w - r} ${y + height}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${y + height - r}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join(" ");
}

/** Cône liquide attaché à une barre (moignon du pont après rupture). */
export function stubPath(centerX: number, edgeY: number, length: number, base: number, tip: number, direction: 1 | -1): string {
  if (length <= 0.5) return "";
  const edge = edgeY - direction * 14;
  const end = edgeY + direction * length;
  const half = base / 2;
  const tipHalf = Math.max(tip / 2, 0.5);
  return [
    `M ${centerX - half} ${edge}`,
    `L ${centerX + half} ${edge}`,
    `C ${centerX + half} ${edgeY}, ${centerX + tipHalf} ${end - direction * length * 0.4}, ${centerX + tipHalf} ${end}`,
    `L ${centerX - tipHalf} ${end}`,
    `C ${centerX - tipHalf} ${end - direction * length * 0.4}, ${centerX - half} ${edgeY}, ${centerX - half} ${edge}`,
    "Z",
  ].join(" ");
}
