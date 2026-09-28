"use server";

import type { LiquidLoginCredentials, LiquidLoginResult } from "@/components/auth/LiquidLogin";
import { verifyCredentials } from "@/lib/auth/credentials";
import { createSession } from "@/lib/auth/session";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

/**
 * Connexion RBnB — validation et vérification strictement côté serveur.
 * Le mot de passe n'est jamais journalisé ni renvoyé.
 */
export async function signInAction(input: LiquidLoginCredentials): Promise<LiquidLoginResult> {
  const email = typeof input?.email === "string" ? normalizeEmail(input.email) : "";
  const password = typeof input?.password === "string" ? input.password : "";

  if (!isValidEmail(email)) {
    return { ok: false, error: "Saisissez une adresse email valide.", field: "email" };
  }
  if (password.length === 0 || password.length > 256) {
    return { ok: false, error: "Saisissez votre mot de passe.", field: "password" };
  }
  if (!verifyCredentials(email, password)) {
    return { ok: false, error: "Email ou mot de passe incorrect.", field: "password" };
  }

  const created = await createSession(email);
  if (!created) {
    return { ok: false, error: "Serveur RBnB non configuré (RBNB_AUTH_SECRET manquant)." };
  }
  return { ok: true };
}
