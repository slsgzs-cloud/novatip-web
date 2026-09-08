/**
 * lib/jwt.ts
 *
 * Client-side JWT expiry check, used purely as a UX optimisation to skip a
 * guaranteed-failing round trip on rehydrate. The server remains the sole
 * authority on validity — this never replaces the 401 handling in
 * lib/authEvents.ts.
 */

export function isJwtExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const { exp } = JSON.parse(atob(padded)) as { exp?: number };

    if (typeof exp !== "number") return false;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}
