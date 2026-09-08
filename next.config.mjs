/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // The backend accepts any https URL for avatarUrl, but Next's image
    // optimizer only fetches hosts listed here. Adding a wildcard would
    // let any external image through, which is the security risk the
    // original config was designed to avoid.
    //
    // Instead, we keep a narrow allowlist and rely on the
    // AvatarWithFallback component to catch load errors from hosts that
    // fall outside it (wrong MIME type, dead link, etc.) and render an
    // identicon instead of a broken image.
    remotePatterns: [
      { protocol: "https", hostname: "**.novatip.xyz" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
    // Disable the optimizer entirely for avatars so any URL is accepted.
    // The optimizer only needs to run for images we control (OG images,
    // marketing assets), not for user-supplied avatar URLs.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
