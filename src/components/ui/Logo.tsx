import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

/** Monogramme RBnB : deux barres reliées par un pont liquide (écho du LiquidLogin). */
export function LogoMark({ className, size = 24 }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="8" fill="var(--rbnb-surface-2)" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="none" stroke="rgba(255,255,255,0.14)" />
      <rect x="7" y="7" width="18" height="7" rx="3.5" fill="var(--rbnb-fg-primary)" />
      <path
        d="M12.5 13.5 C14.5 15.6 14.5 16.4 12.5 18.5 L19.5 18.5 C17.5 16.4 17.5 15.6 19.5 13.5 Z"
        fill="var(--rbnb-fg-primary)"
      />
      <rect x="7" y="18" width="18" height="7" rx="3.5" fill="var(--rbnb-accent)" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 24 }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight text-fg", className)}>
      <LogoMark size={size} />
      <span className="text-[15px]">RBnB</span>
    </span>
  );
}
