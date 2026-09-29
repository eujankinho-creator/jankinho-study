import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/api/**": [
      "./node_modules/@prisma/engines/**/*",
      "./node_modules/prisma/**/*",
      "./public/**/*",
    ],
  },
};

export default nextConfig;