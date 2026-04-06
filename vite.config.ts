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

  // 🔥 ESTA ES LA CONFIG DE TEST QUE TE FALTABA
  test: {
    globals: true,
    environment: "jsdom",

    // Evita errores como `global not found` en tests
    setupFiles: ["./src/test/setup.ts"],

    deps: {
      inline: ["vitest-axe"],
    },

    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
