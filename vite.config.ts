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
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // No manualChunks for three: naming it here pulls it into the entry's
  // static graph, which makes Vite emit a <link rel="modulepreload"> for the
  // ~1 MB bundle in index.html. The browser then downloads it before first
  // paint even though RobotScene is a dynamic import. Letting Rollup split it
  // from the dynamic import keeps it off the critical path.
}));
