import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function SectionHeader({ id, eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <Reveal className={cn("mx-auto flex max-w-2xl flex-col items-center text-center", className)}>
      <span className="rounded-full border border-edge bg-surface-1 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-fg-secondary">
        {eyebrow}
      </span>
      <h2 id={id} className="mt-4 text-3xl sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-relaxed text-fg-secondary">{description}</p>}
    </Reveal>
  );
}
