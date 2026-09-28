import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  getSecret,
  signSession,
  verifySessionToken,
  type RbnbSession,
} from "./session-token";

/**
 * Session RBnB stateless : cookie httpOnly signé HMAC-SHA256 (Web Crypto), vérifié côté serveur.
 * Aucune dépendance tierce. Le secret provient de RBNB_AUTH_SECRET (obligatoire en production).
 */

export type { RbnbSession } from "./session-token";

/** Crée la session. Retourne `false` si le secret de signature n'est pas configuré. */
export async function createSession(sub: string): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const token = await signSession({ sub, exp }, secret);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return true;
}

export async function getSession(): Promise<RbnbSession | null> {
  // Lecture des cookies en premier : la route reste toujours dynamique, même sans secret configuré.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const secret = getSecret();
  if (!token || !secret) return null;
  return verifySessionToken(token, secret);
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
