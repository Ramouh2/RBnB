"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Logo } from "@/components/ui/Logo";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RBNB_REDUCED_TRANSITION, RBNB_SPRINGS } from "@/lib/motion/constants";

const LINKS = [
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/motion-playground", label: "Motion Lab" },
];

/** Navigation principale RBnB : pilule de survol partagée (layoutId) qui glisse entre les liens. */
export function SiteHeader() {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const pillId = `rbnb-nav-${useId().replace(/:/g, "")}`;

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-edge-subtle bg-surface-0/80 backdrop-blur-md">
      <nav aria-label="Navigation principale RBnB" className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Accueil RBnB" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <Logo />
        </Link>

        <ul className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
          {LINKS.map((link) => (
            <li key={link.href} className="relative">
              <Link
                href={link.href}
                onPointerEnter={() => setHovered(link.href)}
                onFocus={() => setHovered(link.href)}
                onBlur={() => setHovered(null)}
                className="relative block rounded-full px-4 py-2 text-sm text-fg-secondary transition-tint hover:text-fg focus-visible:outline-none"
              >
                {hovered === link.href && (
                  <motion.span
                    layoutId={pillId}
                    className="absolute inset-0 rounded-full bg-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                    transition={reduced ? RBNB_REDUCED_TRANSITION : RBNB_SPRINGS.snappy}
                    aria-hidden="true"
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-full px-3 py-2 text-sm text-fg-secondary transition-tint hover:text-fg sm:block">
            Connexion
          </Link>
          <MagneticButton href="/login" size="md" className="h-10 px-4">
            Essayer RBnB
          </MagneticButton>
        </div>
      </nav>
    </header>
  );
}
