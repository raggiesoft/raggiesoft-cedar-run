#!/usr/bin/env node
/**
 * @license MIT
 * ============================================================================
 * scripts/prerender.mjs — Static Site Generator, OpenGraph & Sitemap Compiler
 * Property: https://cedarrun.raggiesoft.com (raggiesoft-cedar-run)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL NODE.JS BUILD SCRIPT GUIDE):
 *   What does this script do at the end of `npm run build`?
 *     1. Reads the Vite-compiled `dist/index.html` template (which already has
 *        hashed `/assets/*.css` and `/assets/*.js` tags injected by Vite).
 *     2. Imports our compiled SolidJS server renderer (`.ssr-temp/entry-server.js`).
 *     3. Loops through all 6 canonical routes (`/`, `/triplets`, `/shelters`,
 *        `/crossroads`, `/sky-and-seasons`, `/songbook`) PLUS `/404.html`:
 *          - Renders the SolidJS HTML via `renderRoute(route.path)`.
 *          - Injects `<title>`, `<meta name="description">`, `<link rel="canonical">`,
 *            complete OpenGraph (`og:*`) + Twitter Card meta tags, and Schema.org
 *            `WebSite` / `CreativeWork` JSON-LD!
 *          - Writes both `dist/<slug>.html` AND `dist/<slug>/index.html` so Nginx
 *            `try_files $uri $uri.html $uri/index.html =404;` serves clean URLs
 *            in microseconds!
 *     4. Generates `dist/sitemap.xml`, `dist/robots.txt`, and our IndexNow
 *        verification key (`dist/726167676965736f6674696e6465786e.txt`), then
 *        deletes `.ssr-temp/` so `dist/` is 100% pure static production files!
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const ssrDir = path.join(projectRoot, '.ssr-temp');

const SITE_ORIGIN = 'https://cedarrun.raggiesoft.com';
const INDEXNOW_KEY = '726167676965736f6674696e6465786e';

/**
 * Escapes `<`, `>`, `&`, and `"` inside HTML attribute strings so titles and
 * descriptions with ampersands or quotes always produce valid HTML5.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Builds the route-specific `<head>` SEO, OpenGraph, Twitter Card, Favicon, and
 * Schema.org JSON-LD block (strictly enforcing <= 60 char title & <= 155 char description).
 */
function buildSeoHeadBlock({ seoTitle, seoDescription, canonicalUrl, ogImage, noindex = false }) {
  if (seoTitle.length > 60) {
    throw new Error(`SEO Title exceeds 60 characters (${seoTitle.length}): "${seoTitle}"`);
  }
  if (seoDescription.length > 155) {
    throw new Error(
      `SEO Description exceeds 155 characters (${seoDescription.length}): "${seoDescription}"`
    );
  }

  const robotsContent = noindex ? 'noindex,follow' : 'index,follow';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: 'Cedar Run — RaggieSoft Story Crossroads World',
        description:
          'Official Pacific Northwest wilderness worldbuilding guide, shelter progression explorer, and 1975 acoustic songbook for Cedar Run.',
        inLanguage: 'en-US',
        creator: {
          '@type': 'Person',
          name: 'Michael P. Ragsdale',
          url: 'https://michaelpragsdale.com'
        },
        publisher: {
          '@type': 'Organization',
          name: 'RaggieSoft',
          url: 'https://raggiesoft.com'
        }
      },
      {
        '@type': 'Book',
        '@id': 'https://books.raggiesoft.com/cedar-run#book',
        name: 'Cedar Run',
        url: 'https://books.raggiesoft.com/cedar-run',
        author: {
          '@type': 'Person',
          name: 'Michael P. Ragsdale',
          url: 'https://michaelpragsdale.com'
        },
        genre: ['Interactive Fiction', 'Wilderness Survival', 'Contemporary Literary Fiction'],
        inLanguage: 'en-US',
        license: 'https://creativecommons.org/licenses/by-sa/4.0/'
      }
    ]
  };

  const lines = [
    `<title>${escapeHtml(seoTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(seoDescription)}" />`,
    `<meta name="robots" content="${robotsContent}" />`,
    ...(noindex ? [] : [`<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`]),
    `<link rel="icon" type="image/svg+xml" href="https://assets.raggiesoft.com/raggiesoft-books/images/logos/story-crossroads-seal-3way.svg" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Cedar Run — RaggieSoft Story Crossroads" />`,
    `<meta property="og:title" content="${escapeHtml(seoTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(seoDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta property="og:image:alt" content="Cedar Run — Luke, Tessa, and Sadie Bridger in Colville National Forest" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seoTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seoDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
  ];

  return lines.join('\n    ');
}

async function main() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing client build template at ${templatePath}. Run 'vite build' first.`);
  }
  const baseTemplate = fs.readFileSync(templatePath, 'utf-8');

  // Dynamically import the Vite-compiled SSR module from `.ssr-temp/`
  const ssrEntryFile = fs
    .readdirSync(ssrDir)
    .find((f) => f.startsWith('entry-server.') && (f.endsWith('.js') || f.endsWith('.mjs')));
  if (!ssrEntryFile) {
    throw new Error(`Could not locate compiled entry-server bundle inside ${ssrDir}`);
  }
  const ssrModuleUrl = pathToFileURL(path.join(ssrDir, ssrEntryFile)).href;
  const { renderRoute, SITE_ROUTES } = await import(ssrModuleUrl);

  const todayIso = new Date().toISOString().slice(0, 10);
  const sitemapUrls = [];

  // 1. Pre-render every canonical route in `SITE_ROUTES`
  for (const route of SITE_ROUTES) {
    const canonicalUrl = route.path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route.path}`;
    const { html, hydrationScript } = renderRoute(route.path);
    const headBlock = buildSeoHeadBlock({
      seoTitle: route.seoTitle,
      seoDescription: route.seoDescription,
      canonicalUrl,
      ogImage: route.ogImage,
      noindex: false
    });

    const fullHtml = baseTemplate
      .replace('<!--SSR_HEAD-->', headBlock)
      .replace('<!--SSR_HYDRATION-->', hydrationScript)
      .replace('<!--SSR_OUTLET-->', html);

    if (route.path === '/') {
      fs.writeFileSync(path.join(distDir, 'index.html'), fullHtml, 'utf-8');
    } else {
      const slug = route.path.replace(/^\//, '');
      // Write both `dist/<slug>.html` AND `dist/<slug>/index.html` for clean static routing
      fs.writeFileSync(path.join(distDir, `${slug}.html`), fullHtml, 'utf-8');
      const nestedDir = path.join(distDir, slug);
      fs.mkdirSync(nestedDir, { recursive: true });
      fs.writeFileSync(path.join(nestedDir, 'index.html'), fullHtml, 'utf-8');
    }

    sitemapUrls.push(canonicalUrl);
    console.log(`  ✓ Prerendered ${route.path} -> ${canonicalUrl}`);
  }

  // 2. Pre-render genuine `noindex` HTTP 404 page (`dist/404.html`)
  {
    const { html, hydrationScript } = renderRoute('/404');
    const head404 = buildSeoHeadBlock({
      seoTitle: 'Trail Not Found (404) | Cedar Run',
      seoDescription:
        'That forest trail could not be found. Return to the Cedar Run camp guide or read Episode 1 on RaggieSoft Book Reader.',
      canonicalUrl: `${SITE_ORIGIN}/404`,
      ogImage: 'https://assets.raggiesoft.com/raggiesoft-books/images/covers/og/cedar-run.jpg',
      noindex: true
    });
    const html404 = baseTemplate
      .replace('<!--SSR_HEAD-->', head404)
      .replace('<!--SSR_HYDRATION-->', hydrationScript)
      .replace('<!--SSR_OUTLET-->', html);
    fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8');
    console.log('  ✓ Prerendered /404.html (noindex,follow)');
  }

  // 3. Emit `sitemap.xml`, `robots.txt`, and IndexNow verification key
  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapUrls.map(
      (loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${todayIso}</lastmod>\n  </url>`
    ),
    '</urlset>',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');

  const robotsTxt = [
    '# Cedar Run Wilderness Launchpad (https://cedarrun.raggiesoft.com)',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.join(distDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf-8');

  // 4. Remove temporary `.ssr-temp/` directory
  fs.rmSync(ssrDir, { recursive: true, force: true });
  console.log(
    `✅ Cedar Run SolidJS Static SSG build complete (${sitemapUrls.length} canonical routes + 404.html + sitemap.xml).`
  );
}

main().catch((err) => {
  console.error('❌ Cedar Run prerender failed:', err);
  process.exit(1);
});
