import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages: ["@brendhouse/design-system"],
  allowedDevOrigins: ["127.0.0.1"],
};
export default config;
