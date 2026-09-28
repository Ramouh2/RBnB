"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { usePointerFine } from "@/hooks/usePointerFine";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  RBNB_REDUCED_TRANSITION,
  RBNB_SPOTLIGHT_DEFAULTS,
  RBNB_SPRINGS,
  withOverride,
  type SpotlightConfig,
} from "@/lib/motion/constants";
import { clamp, cn } from "@/lib/utils";

/* ───────────────────────────── Grille : coordonnées partagées ───────────────────────────── */

interface SpotlightGridContextValue {
  gridRef: RefObject<HTMLDivElement | null>;
  /** Position du curseur relative à la grille (px). */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** 1 quand le curseur survole la grille (amorti). */
  active: MotionValue<number>;
}

const SpotlightGridContext = createContext<SpotlightGridContextValue | null>(null);

type DivProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "style" | "children"
>;

interface SpotlightBentoGridProps extends DivProps {
  children: ReactNode;
}

/**
 * Grille Bento RBnB : partage la position du curseur avec toutes ses cartes afin que la lumière
 * diffuse légèrement sur les bordures des cartes voisines. Aucune mise à jour d'état React.
 */
export function SpotlightBentoGrid({ children, className, ...rest }: SpotlightBentoGridProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);
  const rawActive = useMotionValue(0);
  const active = useSpring(rawActive, { stiffness: 200, damping: 30, mass: 0.8 });

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
    rawActive.set(1);
  };

  return (
    <SpotlightGridContext.Provider value={{ gridRef, pointerX, pointerY, active }}>
      <div
        ref={gridRef}
        className={cn("relative", className)}
        onPointerMove={handleMove}
        onPointerLeave={() => rawActive.set(0)}
        {...rest}
      >
        {children}
      </div>
    </SpotlightGridContext.Provider>
  );
}

/* ───────────────────────────────────── Carte ───────────────────────────────────── */

export interface SpotlightBentoCardProps extends DivProps {
  children: ReactNode;
  configOverride?: Partial<SpotlightConfig>;
  /** Délai d'entrée à l'apparition dans le viewport (s). */
  delay?: number;
  /** Classes du conteneur de contenu. */
  contentClassName?: string;
}

interface Geometry {
  left: number;
  top: number;
  width: number;
  height: number;
}

function measureWithin(element: HTMLElement, ancestor: HTMLElement | null): Geometry {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = element;
  while (node && node !== ancestor) {
    left += node.offsetLeft;
    top += node.offsetTop;
    const parent: Element | null = node.offsetParent;
    if (!(parent instanceof HTMLElement)) break;
    node = parent;
  }
  return { left, top, width: element.offsetWidth, height: element.offsetHeight };
}

/**
 * Carte Bento premium de RBnB.
 * - Desktop : spotlight X/Y, bordure illuminée (diffusée aux voisines via SpotlightBentoGrid), tilt 3D ±6° max.
 * - Tactile : surface stable, halo fixe subtil, feedback au toucher.
 */
export function SpotlightBentoCard({
  children,
  className,
  contentClassName,
  configOverride,
  delay = 0,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: SpotlightBentoCardProps) {
  const config = withOverride(RBNB_SPOTLIGHT_DEFAULTS, configOverride);
  const maxTilt = clamp(config.rotation, 0, 6);
  const grid = useContext(SpotlightGridContext);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotion();
  const interactive = pointerFine && !reduced;

  const cardRef = useRef<HTMLDivElement | null>(null);
  const geometry = useRef<Geometry>({ left: 0, top: 0, width: 1, height: 1 });

  // Suivi autonome lorsque la carte est utilisée hors grille.
  const ownX = useMotionValue(-9999);
  const ownY = useMotionValue(-9999);
  const ownActive = useMotionValue(0);
  const ownActiveSpring = useSpring(ownActive, { stiffness: 200, damping: 30, mass: 0.8 });

  const sourceX = grid?.pointerX ?? ownX;
  const sourceY = grid?.pointerY ?? ownY;
  const gridActive = grid?.active ?? ownActiveSpring;

  const localX = useTransform(sourceX, (v) => (grid ? v - geometry.current.left : v));
  const localY = useTransform(sourceY, (v) => (grid ? v - geometry.current.top : v));

  const insideRaw = useMotionValue(0);
  const inside = useSpring(insideRaw, { stiffness: 260, damping: 30, mass: 0.6 });

  const tiltX = useTransform([localY, insideRaw], ([y, i]: number[]) =>
    i ? -((clamp(y / geometry.current.height, 0, 1) * 2 - 1) * maxTilt) : 0,
  );
  const tiltY = useTransform([localX, insideRaw], ([x, i]: number[]) =>
    i ? (clamp(x / geometry.current.width, 0, 1) * 2 - 1) * maxTilt : 0,
  );
  const tiltSpring = { stiffness: config.stiffness, damping: config.damping, mass: config.mass };
  const rotateX = useSpring(tiltX, tiltSpring);
  const rotateY = useSpring(tiltY, tiltSpring);
  const depth = useTransform(inside, (v) => v * config.depth);

  const borderLight = useMotionTemplate`radial-gradient(${config.radius}px circle at ${localX}px ${localY}px, rgba(165,180,252,${config.glow}), rgba(99,102,241,${config.glow * 0.35}) 35%, transparent 70%)`;
  const innerLight = useMotionTemplate`radial-gradient(${config.radius * 0.75}px circle at ${localX}px ${localY}px, rgba(255,255,255,${config.intensity}), transparent 70%)`;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const update = () => {
      geometry.current = measureWithin(card, grid?.gridRef.current ?? null);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(card);
    const gridElement = grid?.gridRef.current;
    if (gridElement) observer.observe(gridElement);
    return () => observer.disconnect();
  }, [grid]);

  const handleOwnMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (grid || event.pointerType === "touch" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    ownX.set(event.clientX - rect.left);
    ownY.set(event.clientY - rect.top);
    ownActive.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn("group/card relative rounded-2xl", className)}
      style={
        interactive
          ? { rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }
          : undefined
      }
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={reduced ? RBNB_REDUCED_TRANSITION : { ...RBNB_SPRINGS.default, delay }}
      whileTap={pointerFine ? undefined : { scale: 0.985 }}
      onPointerMove={handleOwnMove}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") insideRaw.set(1);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        insideRaw.set(0);
        if (!grid) ownActive.set(0);
        onPointerLeave?.(event);
      }}
      {...rest}
    >
      {/* Surface + spotlight intérieur */}
      <div className="surface-card absolute inset-0 overflow-hidden rounded-[inherit]">
        {pointerFine ? (
          <motion.div aria-hidden="true" className="absolute inset-0" style={{ background: innerLight, opacity: inside }} />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "radial-gradient(90% 60% at 18% 0%, rgba(129,140,248,0.10), transparent 70%)" }}
          />
        )}
      </div>

      {/* Bordure illuminée : la lumière déborde sur les cartes voisines de la grille */}
      {pointerFine && (
        <motion.div
          aria-hidden="true"
          className="mask-border pointer-events-none absolute inset-0 rounded-[inherit] p-px"
          style={{ background: borderLight, opacity: gridActive }}
        />
      )}

      <motion.div className={cn("relative h-full", contentClassName)} style={interactive ? { z: depth } : undefined}>
        {children}
      </motion.div>
    </motion.div>
  );
}
