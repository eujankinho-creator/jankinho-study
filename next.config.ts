import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/auth/login": [
      "./node_modules/.prisma/client/**/*",
    ],
    "/api/auth/cadastro": [
      "./node_modules/.prisma/client/**/*",
    ],
    "/api/**": [
      "./node_modules/.prisma/client/**/*",
    ],
  },
};

export default nextConfig;