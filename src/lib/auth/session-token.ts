import "server-only";

/**
 * Jetons de session RBnB : signature / vérification HMAC-SHA256 via Web Crypto.
 * Module pur (sans `next/headers`) : utilisable par les Server Components, Server Actions et le proxy.
 */

export const SESSION_COOKIE = "rbnb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours
const DEV_SECRET = "rbnb-dev-only-secret-do-not-use-in-production";

export interface RbnbSession {
  /** Identifiant de l'utilisateur (email normalisé). */
  sub: string;
  /** Expiration (secondes epoch). */
  exp: number;
}

export function getSecret(): string | null {
  const secret = process.env.RBNB_AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  return process.env.NODE_ENV === "production" ? null : DEV_SECRET;
}

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function isSession(value: unknown): value is RbnbSession {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.sub === "string" && typeof candidate.exp === "number";
}

export async function signSession(payload: RbnbSession, secret: string): Promise<string> {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = await crypto.subtle.sign("HMAC", await getKey(secret), new TextEncoder().encode(body));
  return `${body}.${Buffer.from(signature).toString("base64url")}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<RbnbSession | null> {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const valid = await crypto.subtle.verify(
    "HMAC",
    await getKey(secret),
    Buffer.from(signature, "base64url"),
    new TextEncoder().encode(body),
  );
  if (!valid) return null;
  try {
    const payload: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!isSession(payload) || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
