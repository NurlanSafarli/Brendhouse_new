import type { NextConfig } from "next";
const config: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@brendhouse/design-system", "@brendhouse/contracts"],
};
export default config;
