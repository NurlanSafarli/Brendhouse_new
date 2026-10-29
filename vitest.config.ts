import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    exclude: [
      ".pages-build/**",
      "pages-dist/**",
      "**/node_modules/**",
      "**/.next/**",
      "tests/browser/**",
      "tests/development/**",
      "tests/admin/**",
    ],
  },
});
