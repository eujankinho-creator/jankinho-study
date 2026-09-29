import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/api/**": [
      "./src/generated/client/**/*",
      "./node_modules/.prisma/client/**/*",
    ],
  },
};

export default nextConfig;