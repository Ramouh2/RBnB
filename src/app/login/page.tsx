import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginExperience } from "@/components/auth/LoginExperience";
import { Reveal } from "@/components/motion/Reveal";
import { Logo } from "@/components/ui/Logo";
import { NoiseBackground } from "@/components/ui/NoiseBackground";
import { getDemoAccount, isDefaultDemoAccount } from "@/lib/auth/credentials";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace RBnB.",
};

/**
 * Page de connexion RBnB. La redirection « déjà connecté » est assurée par `src/proxy.ts`
 * (et non ici) : une Server Action qui pose le cookie re-rend cette page, et une redirection
 * à ce stade couperait la chorégraphie de succès de LiquidLogin.
 */
export default function LoginPage() {
  const demo = isDefaultDemoAccount() ? getDemoAccount() : null;

  return (
    <main className="relative isolate flex min-h-svh flex-1 flex-col overflow-hidden">
      <NoiseBackground className="-z-10" grain={0.08} />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" aria-label="Accueil RBnB" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <Logo />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-fg-secondary transition-tint hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-8">
        <Reveal inView={false} className="mb-12 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl">Bienvenue sur RBnB</h1>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-fg-secondary">
            Connectez-vous pour retrouver vos logements, réservations et revenus.
          </p>
        </Reveal>

        <div className="flex w-full max-w-md flex-col items-center">
          <LoginExperience />
        </div>

        {demo && (
          <Reveal inView={false} delay={0.2} className="mt-8 rounded-full border border-edge bg-surface-1/80 px-4 py-2 text-center text-xs text-fg-secondary">
            Compte de démonstration : <span className="font-medium text-fg">{demo.email}</span> ·{" "}
            <span className="font-mono text-fg">{demo.password}</span>
          </Reveal>
        )}
      </section>
    </main>
  );
}
