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
    outDir: "build", // Match Render's Publish Directory
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB to reduce warnings
    rollupOptions: {
      output: {
        manualChunks: {
          // Example: Split vendor libraries into a separate chunk
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
