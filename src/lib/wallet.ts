/**
 * lib/wallet.ts
 *
 * Wallet utilities for novatip-web.
 * Wraps @novatip/sdk FreighterAdapter and exposes helpers used by
 * the WalletContext and TipForm.
 */

import {
  FreighterAdapter,
  getNetwork,
  TipSplitterClient,
  usdcToStroops,
  type NetworkConfig,
} from "@novatip/sdk";
import { signBlob } from "@stellar/freighter-api";
import { config } from "./config";

// ── Singleton instances ───────────────────────────────────────────────────────

export const freighter = new FreighterAdapter();

export function getNetworkConfig(): NetworkConfig {
  return getNetwork(config.stellar.network);
}

export function getTipSplitterClient(): TipSplitterClient {
  return new TipSplitterClient({
    contractId: config.stellar.tipSplitterContractId,
    network:    getNetworkConfig(),
  });
}

// ── Sign helper ───────────────────────────────────────────────────────────────

/**
 * Returns a signTransaction callback bound to the Freighter adapter
 * and the current network passphrase. Passed directly into SDK client methods.
 */
export function makeSignTransaction() {
  const network = getNetworkConfig();
  return (txXdr: string) => freighter.signTransaction(txXdr, network.passphrase);
}

// ── Amount helper (re-export for convenience) ─────────────────────────────────
export { usdcToStroops };

// ── Sign-in message helper ───────────────────────────────────────────────────

/**
 * Signs a SIWS nonce as a plain message (not a transaction) and returns the
 * detached Ed25519 signature as hex. verifyEd25519 on the backend checks the
 * signature against the raw nonce bytes, so it must never be wrapped in a
 * transaction envelope.
 */
export async function signNonce(nonce: string, accountToSign: string): Promise<string> {
  const signedBlob = await signBlob(nonce, { accountToSign });
  if (!signedBlob) {
    throw new Error("Wallet did not return a signature.");
  }
  return base64ToHex(signedBlob);
}

function base64ToHex(base64: string): string {
  const binary = atob(base64);
  let hex = "";
  for (let i = 0; i < binary.length; i++) {
    hex += binary.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return hex;
}
