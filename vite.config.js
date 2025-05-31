import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React libraries
          react: ["react", "react-dom"],
          // Split routing libraries
          router: ["react-router", "react-router-dom"],
          // Split UI libraries
          ui: ["@radix-ui/react-alert-dialog", "@radix-ui/react-label", "@radix-ui/react-progress", "@radix-ui/react-select", "@radix-ui/react-slot", "@radix-ui/react-tabs", "@radix-ui/react-tooltip"],
          // Split data libraries
          data: ["@tanstack/react-query", "@tanstack/react-table", "@tanstack/match-sorter-utils"],
          // Split chart libraries
          charts: ["chart.js", "react-chartjs-2", "recharts"],
          // Split other large libraries
          utils: ["@faker-js/faker", "axios", "dayjs", "zod"]
        },
      },
    },
  },
});