import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  // Server-only business logic is loaded from the server package at runtime,
  // so the API and the page loaders share one module graph and one DB connection.
  ssr: {
    external: ["@moh/server", "mongoose", "sharp", "bcryptjs", "jsonwebtoken", "@aws-sdk/client-s3"],
  },
  server: {
    hmr: { port: 24678 },
  },
});
