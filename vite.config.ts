import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite" // <--- 1. IMPORTANTE

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- 2. AGREGAR AQUÍ
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})