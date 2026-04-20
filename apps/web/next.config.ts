import type { NextConfig } from "next";

type EnvRemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
};

function parseRemotePatternsFromEnv(): EnvRemotePattern[] {
  const raw = process.env.NEXT_IMAGE_REMOTE_PATTERNS ?? "";
  if (!raw.trim()) return [];

  return raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((entry) => {
      const url = new URL(entry);
      const protocol = url.protocol.replace(":", "");
      if (protocol !== "http" && protocol !== "https") {
        throw new Error(`Unsupported protocol in NEXT_IMAGE_REMOTE_PATTERNS: ${entry}`);
      }
      return {
        protocol,
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
      };
    });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001",
      },
      ...parseRemotePatternsFromEnv(),
    ],
  },
};

export default nextConfig;
