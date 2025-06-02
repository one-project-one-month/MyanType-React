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
    outDir: "dist", // Change from "build" to "dist" for Vercel
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router", "react-router-dom"],
          ui: ["@radix-ui/react-alert-dialog", "@radix-ui/react-label", "@radix-ui/react-progress", "@radix-ui/react-select", "@radix-ui/react-slot", "@radix-ui/react-tabs", "@radix-ui/react-tooltip"],
          data: ["@tanstack/react-query", "@tanstack/react-table", "@tanstack/match-sorter-utils"],
          charts: ["chart.js", "react-chartjs-2", "recharts"],
          // Split the large utils chunk further
          faker: ["@faker-js/faker"],
          axios: ["axios"],
          misc: ["dayjs", "zod", "uuid", "clsx", "tailwind-merge"]
        },
      },
    },
  },
});