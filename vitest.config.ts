// import { defineConfig } from "vitest/config";

// export default defineConfig({
//   test: {
//     environment: "jsdom",
//     globals: true,
//     setupFiles: "./vitest.setup.ts",
//   },
// });

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.tsx"],
    exclude: ["tests/e2e/**"], // 🔥 REQUIRED
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});