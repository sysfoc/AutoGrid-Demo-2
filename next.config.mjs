import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
    serverExternalPackages: ["sharp"],
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "petbazar.com.pk",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    unoptimized: true,
  },
}

export default withNextIntl(nextConfig)