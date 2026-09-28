"use client";

import { ArrowRight, Wand2 } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { NoiseBackground } from "@/components/ui/NoiseBackground";

export function CallToAction() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pb-24 sm:px-6">
      <Reveal className="relative isolate overflow-hidden rounded-2xl border border-edge px-6 py-16 text-center shadow-lg sm:px-12">
        <NoiseBackground className="-z-10" vignette={false} />
        <h2 id="cta-title" className="mx-auto max-w-2xl text-3xl sm:text-4xl">
          Prêt à piloter vos logements avec RBnB&nbsp;?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-fg-secondary">
          Créez votre espace en quelques secondes. Aucune carte bancaire requise pour démarrer.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MagneticButton href="/login" size="lg">
            Créer mon espace RBnB
            <ArrowRight className="size-4" aria-hidden="true" />
          </MagneticButton>
          <MagneticButton href="/motion-playground" size="lg" variant="ghost">
            <Wand2 className="size-4" aria-hidden="true" />
            Explorer le Motion Lab
          </MagneticButton>
        </div>
      </Reveal>
    </section>
  );
}
