import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages: ["@brendhouse/design-system", "@brendhouse/contracts"],
};
export default config;
