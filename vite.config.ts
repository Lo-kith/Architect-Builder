import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'path';

// ─── UI build ─────────────────────────────────────────────────────────────────
//
// `npm run dev`   → hot-reloading preview at localhost:5173 (no singlefile)
// `npm run build` → inlines ALL JS + CSS into dist/index.html (required for Figma)
//
// Why singlefile? Figma's plugin iframe CSP blocks type="module" scripts,
// so external asset files never load. Inlining bypasses this completely.
//
// Plugin main thread → npm run build:plugin  (vite.plugin.config.ts → IIFE)
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // Only inline on build — skip during dev so HMR still works
    ...(command === 'build' ? [viteSingleFile()] : []),
  ],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Required by vite-plugin-singlefile to inline assets
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        inlineDynamicImports: true,
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}));
