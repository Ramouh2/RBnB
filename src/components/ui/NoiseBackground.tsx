import { useId } from "react";
import { cn } from "@/lib/utils";

interface NoiseBackgroundProps {
  className?: string;
  /** Opacité du grain SVG (très faible par défaut). */
  grain?: number;
  /** Affiche le halo principal indigo. */
  glow?: boolean;
  /** Vignettage périphérique. */
  vignette?: boolean;
}

/**
 * Arrière-plan RBnB : profondeur sombre, glow diffus, radial-gradients subtils,
 * vignettage doux et grain SVG généré en code (feTurbulence — aucune image matricielle).
 * Composant statique : aucun coût d'animation.
 */
export function NoiseBackground({ className, grain = 0.06, glow = true, vignette = true }: NoiseBackgroundProps) {
  const filterId = `rbnb-noise-${useId().replace(/:/g, "")}`;

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-surface-0" />
      {glow && (
        <>
          <div
            className="absolute left-1/2 top-[-18%] h-[70%] w-[120%] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.07) 45%, transparent 75%)",
            }}
          />
          <div
            className="absolute bottom-[-30%] left-[-10%] h-[70%] w-[60%]"
            style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(56,189,248,0.07) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-[-25%] right-[-15%] h-[65%] w-[55%]"
            style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(168,85,247,0.07) 0%, transparent 70%)" }}
          />
        </>
      )}
      <svg className="absolute inset-0 h-full w-full mix-blend-soft-light" style={{ opacity: grain }}>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
      {vignette && (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.65) 100%)" }}
        />
      )}
    </div>
  );
}
