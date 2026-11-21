/**
 * @license MIT
 * ============================================================================
 * vite.config.ts — Vite + SolidJS Static Site Generation (SSG) Configuration
 * Property: https://cedarrun.raggiesoft.com (raggiesoft-cedar-run)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL INTRO FOR NEW DEVELOPERS):
 *   What is this file, and how does SolidJS differ from React?
 *     Even though SolidJS files end in `.tsx` and use JSX tags (`<section>...</section>`),
 *     SolidJS does NOT use a Virtual DOM like React! Instead, `vite-plugin-solid`
 *     compiles JSX templates into direct, fine-grained DOM instructions (`document.createElement`
 *     and targeted text/attribute updates driven by `createSignal()`).
 *
 *   Why `hydratable: true` is enabled here:
 *     During `npm run build`, we run Vite twice:
 *       1. Client Build (`vite build`): Compiles browser CSS and tiny `~7 KB` SolidJS
 *          interactive bundles with `hydratable: true` so Solid attaches event listeners
 *          to our pre-rendered HTML instead of re-creating DOM elements from scratch.
 *       2. Server Prerender Build (`vite build --ssr src/entry-server.tsx` + `scripts/prerender.mjs`):
 *          Executes the exact same SolidJS components in Node.js at build time via
 *          `renderToString()` and writes complete, standalone `.html` pages (`index.html`,
 *          `triplets/index.html`, `shelters/index.html`, `crossroads/index.html`,
 *          `sky-and-seasons/index.html`, `songbook/index.html`, `404.html`, `sitemap.xml`)
 *          into `dist/` for ultra-fast Nginx static serving!
 * ============================================================================
 */

// Import Vite's typed configuration helper and the official SolidJS JSX compiler plugin.
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// Export the configuration object consumed by both `vite build` (client) and `vite build --ssr` (prerender).
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    // Enable SolidJS JSX transformation:
    // - `ssr: true` + `hydratable: true` tells Solid's compiler to emit hydration keys (`data-hk`)
    //   so build-time HTML rendered on Node.js connects seamlessly to browser signals on load!
    solidPlugin({
      ssr: true,
      solid: {
        hydratable: true,
        generate: isSsrBuild ? 'ssr' : 'dom'
      }
    })
  ],
  build: {
    // Emit modern ES2022 JavaScript into `dist/` for clean, compact production bundles.
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: !isSsrBuild
  },
  ssr: {
    // Bundle `solid-js` directly into the temporary `.ssr-temp` prerender script so Node.js
    // resolves Solid's server renderer cleanly during `scripts/prerender.mjs`.
    noExternal: ['solid-js']
  }
}));
