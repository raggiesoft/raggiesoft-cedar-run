/**
 * @license MIT
 * ============================================================================
 * src/entry-client.tsx — Browser Hydration Entrypoint for SolidJS
 * Property: https://cedarrun.raggiesoft.com (raggiesoft-cedar-run)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL SOLIDJS GUIDE):
 *   What happens when `cedarrun.raggiesoft.com` loads in a visitor's browser?
 *     1. Nginx sends pre-rendered HTML immediately so the visitor reads the page
 *        in milliseconds—even before JavaScript finishes downloading!
 *     2. Once this tiny script loads, `hydrate(() => <App />, mountEl)` attaches
 *        SolidJS click/keyboard listeners (`Sky Mode`, `Shelter Stage` tabs, and
 *        `Songbook` tabs) directly onto the existing HTML elements without
 *        re-creating or flashing the page.
 *     3. During local `npm run dev` (when `mountEl` is empty), it falls back to
 *        `render(() => <App />, mountEl)` for instant Hot Module Replacement.
 * ============================================================================
 */

import { hydrate, render } from 'solid-js/web';
import { App } from './App';
import './styles/forest.css';

const mountEl = document.getElementById('app');

if (mountEl) {
  // If `scripts/prerender.mjs` already populated `#app` with static HTML, hydrate in place;
  // otherwise (`vite dev`), mount fresh into `#app`.
  const hasPrerenderedHtml = mountEl.firstElementChild !== null;
  if (hasPrerenderedHtml) {
    hydrate(() => <App initialPath={window.location.pathname} />, mountEl);
  } else {
    render(() => <App initialPath={window.location.pathname} />, mountEl);
  }
}
