/**
 * @license MIT
 * ============================================================================
 * src/entry-server.tsx — Build-Time Node.js Static HTML Renderer
 * Property: https://cedarrun.raggiesoft.com (raggiesoft-cedar-run)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL SOLIDJS SSG GUIDE):
 *   Why do we have both `entry-client.tsx` and `entry-server.tsx`?
 *     - `entry-server.tsx` (THIS FILE) runs once on our build machine during
 *       `npm run build`. It calls SolidJS's `renderToString()` and
 *       `generateHydrationScript()` to turn `<App initialPath={url} />` into
 *       finished HTML strings for every page (`index.html`, `/triplets`,
 *       `/shelters`, `/crossroads`, `/sky-and-seasons`, `/songbook`, `/404`).
 *     - That way, search engines, social-media link previews, and everyday
 *       visitors get complete HTML straight from Nginx with zero Node.js server
 *       needed in production!
 * ============================================================================
 */

import { generateHydrationScript, renderToString } from 'solid-js/web';
import { App } from './App';
import { SITE_ROUTES } from './data/cedarRunData';

export { SITE_ROUTES };

/**
 * Renders `<App />` for `routePath` into a static HTML string alongside Solid's
 * tiny inline `<script>` hydration bootstrap tag.
 */
export function renderRoute(routePath: string): { html: string; hydrationScript: string } {
  const html = renderToString(() => <App initialPath={routePath} />);
  const hydrationScript = generateHydrationScript();
  return { html, hydrationScript };
}
