import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // ─── SMOOTH DEV EXPERIENCE ─────────────────────────────────────
    // HMR overlay disabled — keeps UI clean, errors go to console only
    hmr: {
      overlay: false,
    },
    // Disable watching node_modules to prevent unnecessary reloads
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
  },

  // ─── DEP PRE-BUNDLING ─────────────────────────────────────────────
  // Pre-bundle these heavy deps once so HMR touches only your src files —
  // this is the single biggest win for fast save → browser update.
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
    ],
    // Skip expensive ESM interop checks in dev — safe because all listed
    // packages are already ESM-compatible.
    esbuildOptions: {
      target: "esnext",
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ─── CSS ────────────────────────────────────────────────────────────
  css: {
    // Skip source-maps in dev — saves ~200 ms per CSS change
    devSourcemap: false,
  },

  // ─── PRODUCTION BUILD ────────────────────────────────────────────────
  build: {
    // Output hashed filenames so stale cache can never load old files
    rollupOptions: {
      output: {
        // Unique hash per chunk — browser is FORCED to fetch fresh on deploy
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks: {
          "vendor-react":  ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-framer": ["framer-motion"],
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
          "vendor-icons": ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
