import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-edge-subtle">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 pb-28 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-fg-muted">La plateforme premium des hôtes. © {new Date().getFullYear()} RBnB.</p>
        </div>
        <nav aria-label="Liens de pied de page RBnB" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-secondary">
          <Link href="/#fonctionnalites" className="transition-tint hover:text-fg">
            Fonctionnalités
          </Link>
          <Link href="/#tarifs" className="transition-tint hover:text-fg">
            Tarifs
          </Link>
          <Link href="/motion-playground" className="transition-tint hover:text-fg">
            Motion Lab
          </Link>
          <Link href="/login" className="transition-tint hover:text-fg">
            Connexion
          </Link>
        </nav>
      </div>
    </footer>
  );
}
