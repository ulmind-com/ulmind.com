import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — never changes, aggressively cached
          "vendor-react": ["react", "react-dom"],
          // Routing
          "vendor-router": ["react-router-dom"],
          // Animation library — large, isolated
          "vendor-framer": ["framer-motion"],
          // UI primitives
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          // Icons — large static bundle
          "vendor-icons": ["lucide-react"],
        },
      },
    },
    // Raise warning limit slightly to avoid noise from legitimate large pages
    chunkSizeWarningLimit: 600,
  },
}));
