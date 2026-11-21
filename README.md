# Cedar Run (`https://cedarrun.raggiesoft.com`)

Official Pacific Northwest wilderness worldbuilding launchpad for **Cedar Run** — uniting the interactive **RaggieSoft Story Crossroads** novel (`https://books.raggiesoft.com/cedar-run`), the Bridger triplets' field & shelter guide, Colville National Forest dark-sky & weather lore, and their 1975-inspired acoustic mountain-folk songbook (`https://music.raggiesoft.com`).

## Architecture Highlights
- **Framework:** **SolidJS 1.9 + TypeScript + Vite Static SSG** (`createSignal`, `createMemo`, fine-grained DOM reactivity without a Virtual DOM, pre-rendered at build time via `solid-js/web` `renderToString` + `generateHydrationScript` into pure static HTML inside `dist/`).
- **Accessibility & Pacific Northwest Adaptive Palette:** WCAG 2.1 AA / AAA contrast across both **Daylight Forest Canopy (`light`)** and **Bortle-1 Milky Way Night Canopy (`dark`)** modes (`color-scheme: light dark`, `@media (prefers-color-scheme: dark)`, `@media (forced-colors: active)`, and `prefers-reduced-motion: reduce`).
- **Licensing:** Source code licensed under **MIT**; narrative lore, characters, illustrations, and lyrics licensed under **CC BY-SA 4.0**.
