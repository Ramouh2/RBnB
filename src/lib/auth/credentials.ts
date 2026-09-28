import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { normalizeEmail } from "@/lib/validation";

/**
 * Fournisseur d'identifiants RBnB (compte de démonstration).
 * Point d'extension unique : remplacer `verifyCredentials` par une base de données ou un fournisseur d'auth.
 */

export const RBNB_DEMO_EMAIL_DEFAULT = "demo@rbnb.app";
export const RBNB_DEMO_PASSWORD_DEFAULT = "rbnb-demo-2026";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

/** Comparaison à temps constant (empreintes de longueur fixe). */
function safeEqual(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

export function getDemoAccount() {
  return {
    email: normalizeEmail(process.env.RBNB_DEMO_EMAIL ?? RBNB_DEMO_EMAIL_DEFAULT),
    password: process.env.RBNB_DEMO_PASSWORD ?? RBNB_DEMO_PASSWORD_DEFAULT,
  };
}

/** Vrai si le compte de démonstration public (non personnalisé) est actif : ses identifiants peuvent être affichés. */
export function isDefaultDemoAccount(): boolean {
  return (process.env.RBNB_DEMO_PASSWORD ?? RBNB_DEMO_PASSWORD_DEFAULT) === RBNB_DEMO_PASSWORD_DEFAULT;
}

export function verifyCredentials(email: string, password: string): boolean {
  const account = getDemoAccount();
  const emailMatches = safeEqual(normalizeEmail(email), account.email);
  const passwordMatches = safeEqual(password, account.password);
  return emailMatches && passwordMatches;
}
