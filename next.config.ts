import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "placehold.co",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "4000",
  },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (apiUrl) {
  try {
    const parsed = new URL(apiUrl);
    remotePatterns.push({
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port || undefined,
    });
  } catch {
    // ignore invalid URL, falls back to the patterns above
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    // The backend serves uploads from the same private network as this app
    // (localhost in dev, and possibly an internal address in prod). Next's
    // image optimizer refuses to fetch from private/loopback IPs (SSRF
    // protection) regardless of remotePatterns, which silently breaks every
    // uploaded image. Skipping optimization avoids that server-side fetch
    // entirely — the browser loads the image directly instead.
    unoptimized: true,
  },
};

export default nextConfig;
