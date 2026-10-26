import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: { NODE_ENV: "test", STORAGE_DRIVER: "local", SITE_URL: "http://moh.test" },
    testTimeout: 60_000,
    hookTimeout: 120_000,
    fileParallelism: false,
  },
});
