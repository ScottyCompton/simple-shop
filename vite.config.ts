import react from "@vitejs/plugin-react"
import * as path from "node:path"
import { defineConfig } from "vitest/config"
import packageJson from "./package.json" with { type: "json" }
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@css": path.resolve(__dirname, "./src/css"),
      "@hooks": path.resolve(__dirname, "./src/app/hooks"),
      "@app/hooks": path.resolve(__dirname, "./src/app/hooks"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
  server: {
    open: true,
  },

  test: {
    root: import.meta.dirname,
    name: packageJson.name,
    environment: "jsdom",

    typecheck: {
      enabled: true,
      tsconfig: path.join(import.meta.dirname, "tsconfig.json"),
    },

    globals: true,
    watch: false,
    setupFiles: ["./src/setupTests.ts", "./src/__tests__/integration/setup.ts"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/__tests__/**",
        "src/setupTests.ts",
        "node_modules/**",
        "src/App.tsx",
        "src/main.tsx",
        "**/index.tsx",
        "**/ThemeTest.tsx",
        "src/utils/**",
        "src/app/createAppSlice.ts",
      ],
      reporter: ["text", "json", "html"],
    },
  },
})
