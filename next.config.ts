import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/api/**": [
      "./src/generated/client/**/*",
      "./node_modules/.prisma/client/**/*",
    ],
  },

  outputFileTracingIncludes: {
    "/api/**": [
      "./src/generated/client/**/*",
    ],
  },
};

export default nextConfig;