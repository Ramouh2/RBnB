/**
 * RBnB — Noyau physique du Motion Design System.
 *
 * Source de vérité unique des ressorts, constantes liquides et valeurs par défaut
 * de chaque composant motion. Les composants lisent ces valeurs et acceptent un
 * `configOverride` partiel pour être calibrés en direct depuis /motion-playground.
 */

export interface RbnbSpring {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
}

export const RBNB_SPRINGS = {
  default: { type: "spring", stiffness: 380, damping: 28, mass: 1 } as const,
  snappy: { type: "spring", stiffness: 480, damping: 32, mass: 0.8 } as const,
  command: { type: "spring", stiffness: 400, damping: 28, mass: 0.9 } as const,
  liquid: { type: "spring", stiffness: 55, damping: 11, mass: 1 } as const,
  bouncy: { type: "spring", stiffness: 450, damping: 16, mass: 0.8 } as const,
  rubber: { type: "spring", stiffness: 500, damping: 30, mass: 0.7 } as const,
  errorShake: { type: "spring", stiffness: 600, damping: 15, mass: 0.6 } as const,
} satisfies Record<string, RbnbSpring>;

export const RBNB_LIQUID_CONSTANTS = {
  k: 55,
  damping: 11,
  NECK: 0.34,
  PULL: 26,
  blurStdDeviation: 10,
  colorMatrix: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9",
} as const;

export const RBNB_MAGNETIC_DEFAULTS = {
  radius: 40,
  strength: 0.35,
  tapScale: 0.96,
} as const;

/** Transition « réduite » : fondu court sans rebond (prefers-reduced-motion). */
export const RBNB_REDUCED_TRANSITION = { type: "tween", duration: 0.14, ease: [0.22, 1, 0.36, 1] } as const;

/** Keyframes exactes de la secousse d'erreur (px). */
export const RBNB_SHAKE_KEYFRAMES = [0, -10, 10, -7, 7, -3, 3, 0] as const;

/** Construit un ressort Framer Motion à partir d'une config partielle. */
export function toSpring(config: { stiffness: number; damping: number; mass: number }): RbnbSpring {
  return { type: "spring", stiffness: config.stiffness, damping: config.damping, mass: config.mass };
}

/* ─────────────────────────────── Configs par composant ─────────────────────────────── */

export interface SpringParams {
  stiffness: number;
  damping: number;
  mass: number;
}

export interface MagneticButtonConfig extends SpringParams {
  /** Rayon magnétique autour du bouton (px). */
  radius: number;
  /** Intensité d'attraction (fraction de l'écart curseur ↔ centre). */
  strength: number;
  /** Compression au tap sur écran tactile / reduced motion. */
  tapScale: number;
  /** Squash & stretch au clic (desktop). */
  squashX: number;
  squashY: number;
  /** Opacité maximale du reflet radial (0–1). */
  glow: number;
}

export const RBNB_MAGNETIC_BUTTON_DEFAULTS: MagneticButtonConfig = {
  ...RBNB_MAGNETIC_DEFAULTS,
  squashX: 1.03,
  squashY: 0.95,
  stiffness: 380,
  damping: 25,
  mass: 1,
  glow: 0.55,
};

export interface LiquidConfig extends SpringParams {
  /** Ratio d'amincissement maximal du pont avant rupture. */
  neck: number;
  /** Tension (écart en px entre les barres) déclenchant la rupture. */
  pull: number;
  /** stdDeviation du feGaussianBlur Gooey. */
  blur: number;
  /** Pente et décalage alpha de la feColorMatrix (22 / -9). */
  alphaSlope: number;
  alphaOffset: number;
  /** Écart final entre les barres Email et Password (px) — doit dépasser `pull`. */
  gap: number;
  /** Délai avant déploiement automatique quand l'email devient valide (ms). */
  delay: number;
}

export const RBNB_LIQUID_DEFAULTS: LiquidConfig = {
  stiffness: RBNB_LIQUID_CONSTANTS.k,
  damping: RBNB_LIQUID_CONSTANTS.damping,
  mass: 1,
  neck: RBNB_LIQUID_CONSTANTS.NECK,
  pull: RBNB_LIQUID_CONSTANTS.PULL,
  blur: RBNB_LIQUID_CONSTANTS.blurStdDeviation,
  alphaSlope: 22,
  alphaOffset: -9,
  gap: 34,
  delay: 650,
};

export function liquidColorMatrix(config: Pick<LiquidConfig, "alphaSlope" | "alphaOffset">) {
  return `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${config.alphaSlope} ${config.alphaOffset}`;
}

export interface CommandBarConfig extends SpringParams {
  /** Durée d'affichage d'une notification / action (ms). */
  duration: number;
  /** Opacité du voile d'arrière-plan en mode ouvert. */
  backdrop: number;
}

export const RBNB_COMMAND_BAR_DEFAULTS: CommandBarConfig = {
  stiffness: RBNB_SPRINGS.command.stiffness,
  damping: RBNB_SPRINGS.command.damping,
  mass: RBNB_SPRINGS.command.mass,
  duration: 1800,
  backdrop: 0.55,
};

export interface SubmitButtonConfig extends SpringParams {
  tapScale: number;
  /** Nombre de micro-particules émises au succès. */
  particles: number;
  /** Distance de projection des particules (px). */
  intensity: number;
  /** Multiplicateur d'amplitude de la secousse d'erreur. */
  shake: number;
}

export const RBNB_SUBMIT_BUTTON_DEFAULTS: SubmitButtonConfig = {
  stiffness: RBNB_SPRINGS.default.stiffness,
  damping: RBNB_SPRINGS.default.damping,
  mass: RBNB_SPRINGS.default.mass,
  tapScale: 0.96,
  particles: 10,
  intensity: 30,
  shake: 1,
};

export interface SpotlightConfig extends SpringParams {
  /** Rayon du spotlight (px). */
  radius: number;
  /** Intensité de la bordure illuminée (0–1). */
  glow: number;
  /** Intensité du halo intérieur (0–1). */
  intensity: number;
  /** Inclinaison 3D maximale (deg) — bornée à 6. */
  rotation: number;
  /** Profondeur translateZ du contenu (px). */
  depth: number;
}

export const RBNB_SPOTLIGHT_DEFAULTS: SpotlightConfig = {
  stiffness: 300,
  damping: 30,
  mass: 0.6,
  radius: 360,
  glow: 0.55,
  intensity: 0.12,
  rotation: 5,
  depth: 14,
};

export interface ElasticSliderConfig extends SpringParams {
  /** Débordement visuel maximal au-delà des bornes (px). */
  maxOverflow: number;
  /** Compression du curseur à la saisie. */
  scale: number;
  /** Étirement maximal du curseur proportionnel à la vitesse. */
  intensity: number;
}

export const RBNB_ELASTIC_SLIDER_DEFAULTS: ElasticSliderConfig = {
  stiffness: RBNB_SPRINGS.rubber.stiffness,
  damping: RBNB_SPRINGS.rubber.damping,
  mass: RBNB_SPRINGS.rubber.mass,
  maxOverflow: 36,
  scale: 0.9,
  intensity: 0.35,
};

export interface AnimatedPriceConfig extends SpringParams {
  /** Flou vertical maximal pendant le roulement (px). */
  blur: number;
  /** Flou par unité de vitesse (chiffres/s). */
  intensity: number;
}

export const RBNB_ANIMATED_PRICE_DEFAULTS: AnimatedPriceConfig = {
  stiffness: 320,
  damping: 30,
  mass: 1,
  blur: 2.4,
  intensity: 0.06,
};

export interface PricingToggleConfig extends SpringParams {
  /** Étirement horizontal de la pilule pendant le glissement. */
  scale: number;
}

export const RBNB_PRICING_TOGGLE_DEFAULTS: PricingToggleConfig = {
  stiffness: RBNB_SPRINGS.default.stiffness,
  damping: RBNB_SPRINGS.default.damping,
  mass: 1.1,
  scale: 0.14,
};

export interface DiscountBadgeConfig extends SpringParams {
  /** Échelle du rebond d'apparition. */
  scale: number;
  /** Intensité de l'onde lumineuse (0–1). */
  glow: number;
}

export const RBNB_DISCOUNT_BADGE_DEFAULTS: DiscountBadgeConfig = {
  stiffness: RBNB_SPRINGS.bouncy.stiffness,
  damping: RBNB_SPRINGS.bouncy.damping,
  mass: RBNB_SPRINGS.bouncy.mass,
  scale: 1.18,
  glow: 0.7,
};

export interface ProCardConfig extends SpringParams {
  /** Durée d'un tour complet du Border Beam (s). */
  duration: number;
  /** Intensité du halo atmosphérique (0–1). */
  glow: number;
  /** Amplitude de la parallaxe interne (px). */
  intensity: number;
  /** Élévation au survol (px). */
  lift: number;
}

export const RBNB_PRO_CARD_DEFAULTS: ProCardConfig = {
  stiffness: 300,
  damping: 28,
  mass: 0.8,
  duration: 6,
  glow: 0.45,
  intensity: 8,
  lift: 6,
};

/** Fusionne un override partiel avec les valeurs par défaut (typé). */
export function withOverride<T extends object>(defaults: T, override?: Partial<T>): T {
  return override ? { ...defaults, ...override } : defaults;
}
