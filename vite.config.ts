import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("src/data/jobs.generated") || id.includes("src\\data\\jobs.generated")) return "jobs-data";
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react") || id.includes("react-dom")) return "react-vendor";
          if (id.includes("lucide-react") || id.includes("react-kino")) return "ui-vendor";
          return "data-vendor";
        },
      },
    },
  },
});
