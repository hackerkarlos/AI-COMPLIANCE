import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/ai/*.ts"],
      exclude: ["src/lib/ai/index.ts"],
      threshold: {
        lines: 60,
        branches: 50,
        functions: 60,
        statements: 60,
      },
    },
    // Prevent Next.js environment vars from polluting the test runner
    env: {
      ANTHROPIC_API_KEY: "test-api-key",
      NODE_ENV: "test",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});