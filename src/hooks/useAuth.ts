"use client";

/**
 * hooks/useAuth.ts
 *
 * Convenience hook that returns the current auth state and guards.
 * Components that require authentication can call requireAuth()
 * which redirects to the connect flow if not connected.
 */

import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@/contexts/WalletContext";

export function useAuth() {
  const wallet = useWallet();
  const router = useRouter();
  const pathname = usePathname();

  function requireAuth() {
    if (!wallet.isConnected) {
      const redirect = encodeURIComponent(pathname);
      router.push(`/?connect=true&redirect=${redirect}`);
      return false;
    }
    return true;
  }

  return {
    ...wallet,
    requireAuth,
  };
}
