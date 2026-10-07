import type { NextConfig } from "next";

/** Configuración de runtime/build: API pública, imports optimizados e imágenes remotas permitidas. */
const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: nextPublicApiUrl ?? "http://localhost:4000",
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "sonner",
      "@tanstack/react-query",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
