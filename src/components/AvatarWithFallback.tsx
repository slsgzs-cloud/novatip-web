"use client";

import { useState } from "react";
import Image from "next/image";

interface AvatarWithFallbackProps {
  src:      string;
  alt:      string;
  fallback: string;
  className?: string;
  size?:    "sm" | "lg";
}

/**
 * Renders a creator avatar. If the custom URL fails to load (blocked by
 * the image optimizer, wrong MIME type, dead link, etc.) the component
 * falls back to a deterministic identicon so the page never shows a broken
 * image. The fallback is seeded by the avatar URL itself, so every creator
 * gets a consistent but distinct avatar even when the custom one is gone.
 */
export function AvatarWithFallback({ src, alt, fallback, className = "", size = "lg" }: AvatarWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const effectiveSrc = failed ? fallback : src;
  const effectiveAlt = failed ? `${alt} (fallback avatar)` : alt;

  return (
    <Image
      src={effectiveSrc}
      alt={effectiveAlt}
      fill
      className={`object-cover ${className}`}
      unoptimized
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
