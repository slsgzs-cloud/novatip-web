/**
 * lib/authEvents.ts
 *
 * Tiny pub/sub so the plain-JS API client (lib/api.ts) can signal an
 * expired/invalid session without importing React context. WalletContext
 * subscribes and drops the session on any 401, from any endpoint.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

export function onUnauthorized(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitUnauthorized(): void {
  for (const listener of listeners) listener();
}
