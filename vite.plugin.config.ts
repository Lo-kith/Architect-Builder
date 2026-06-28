import { defineConfig } from 'vite';
import { resolve } from 'path';

// ─── Plugin main-thread build ─────────────────────────────────────────────────
// Builds src/plugin/controller.ts → dist/plugin/main.js
//
// Figma's plugin sandbox requires:
//   • A single self-contained IIFE (no import/export, no require())
//   • The `figma` global is injected by Figma at runtime — do NOT bundle it
//
// Usage:  npm run build:plugin
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // don't wipe the UI build
    // Target ES6 so esbuild fully transpiles ?. and ?? — Figma's sandbox predates these operators
    target: 'es6',
    lib: {
      entry: resolve(__dirname, 'src/plugin/controller.ts'),
      name: 'ArchitectPlugin',
      fileName: () => 'plugin/main.js',
      formats: ['iife'],
    },
    rollupOptions: {
      // `figma` is a global injected by Figma — exclude it from the bundle
      external: [],
      output: {
        globals: {},
        inlineDynamicImports: true,
      },
    },
    minify: true,
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
