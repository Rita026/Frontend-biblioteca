/// <reference types="vitest/config" />

import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],

    // ❌ ELIMINADO -> Esta opción no existe en tu versión
    // deps: { include: ["vitest-axe"] },

    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
