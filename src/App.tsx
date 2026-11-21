/**
 * @license MIT
 * ============================================================================
 * src/App.tsx — Root SolidJS Application & Interactive Wilderness Guide
 * Property: https://cedarrun.raggiesoft.com (raggiesoft-cedar-run)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL SOLIDJS & ACCESSIBILITY GUIDE):
 *   How SolidJS Reactivity Works (`createSignal`, `createMemo`, `<For>`, `<Show>`):
 *     If you have seen React before, SolidJS looks familiar at first glance
 *     because both use JSX (`<section class="...">`). However, under the hood,
 *     SolidJS works completely differently:
 *       1. Component functions (`export function App(...)`) run ONLY ONCE when
 *          mounted—they NEVER re-run on every click!
 *       2. `const [stageIdx, setStageIdx] = createSignal(0)` creates a reactive
 *          "Signal": calling `stageIdx()` (as a function!) inside JSX registers
 *          an exact pinpoint subscription on that single DOM text node or attribute.
 *          Calling `setStageIdx(2)` updates ONLY that exact DOM node in microseconds
 *          with zero Virtual DOM diffing!
 *       3. Notice SolidJS uses standard HTML attribute names (`class="..."` and
 *          `for="..."`) instead of React's `className` and `htmlFor`.
 *
 *   What Pages & Interactive Controls This File Renders:
 *     - Global sticky forest header with current-page indicator (`aria-current="page"`)
 *       and an accessible 3-button Sky Mode Switcher (`Auto`, `Daylight`, `Night Sky`)
 *       using `aria-pressed` so screen-reader and sighted visitors can experience
 *       both sun-dappled ponderosa daylight and Milky Way starlight at any time!
 *     - Six pre-rendered routes (`/`, `/triplets`, `/shelters`, `/crossroads`,
 *       `/sky-and-seasons`, `/songbook`) plus a genuine `/404` recovery screen.
 *     - Accessible WAI-ARIA Tablists (`role="tablist"`, `role="tab"`, `aria-selected`,
 *       Left/Right/Home/End keyboard arrow navigation, and `role="tabpanel"`) for
 *       stepping through Shelter Stages 1–4 and inspecting all 6 1975-style songs.
 *     - Global footer with CC BY-SA 4.0 / MIT licensing and mandatory Fictitious
 *       Persons & Entities Disclaimer.
 * ============================================================================
 */

import { createSignal, createMemo, onMount, For, Show } from 'solid-js';
import {
  BOOK_BASE,
  CDN_BASE,
  MUSIC_BASE,
  LORE_BASE,
  BACKSTAGE_BASE,
  SITE_ROUTES,
  TRIPLET_PROFILES,
  SHELTER_STAGES,
  CROSSROADS_FOOTHOLDS,
  SONGBOOK_ENTRIES
} from './data/cedarRunData';

export interface AppProps {
  /** Initial URL pathname passed during static build-time prerendering or client boot */
  initialPath?: string;
}

type SkyMode = 'auto' | 'light' | 'dark';

/**
 * Normalizes a URL path by stripping any trailing slash (except root `'/'`)
 * so `'/shelters/'` and `'/shelters'` match identically.
 */
function normalizeRoutePath(rawPath: string): string {
  if (!rawPath || rawPath === '/') return '/';
  const cleaned = rawPath.replace(/\/+$/, '');
  return cleaned || '/';
}

export function App(props: AppProps) {
  // 1. REACTIVE ROUTE SIGNAL (`currentPath`):
  // Initialized from `props.initialPath` during Node.js static prerendering,
  // and synced with `window.location.pathname` + `popstate` in the browser!
  const [currentPath, setCurrentPath] = createSignal<string>(
    normalizeRoutePath(props.initialPath || '/')
  );

  // 2. REACTIVE SKY MODE SIGNAL (`skyMode`: 'auto' | 'light' | 'dark'):
  // Lets visitors switch effortlessly between OS-automatic mode, sunlit pine
  // daylight, and starry Milky Way night canopy.
  const [skyMode, setSkyMode] = createSignal<SkyMode>('auto');

  // 3. INTERACTIVE SHELTER STAGE TAB SIGNAL (`0`..`3` -> Stages 1..4):
  const [activeStageIdx, setActiveStageIdx] = createSignal<number>(0);

  // 4. INTERACTIVE SONGBOOK TRACK TAB SIGNAL (`0`..`5` -> Tracks 01..06):
  const [activeSongIdx, setActiveSongIdx] = createSignal<number>(0);

  // `createMemo()` caches a derived calculation and only re-evaluates when `currentPath()` changes:
  const isKnownRoute = createMemo(() => {
    const p = currentPath();
    if (p === '/404' || p === '/404.html') return false;
    return SITE_ROUTES.some((r) => r.path === p);
  });

  // `onMount()` runs ONLY in the visitor's browser after hydration (never in Node.js SSR):
  onMount(() => {
    setCurrentPath(normalizeRoutePath(window.location.pathname));

    // Read any previously chosen Day/Night sky preference from `localStorage`
    try {
      const saved = localStorage.getItem('cedarrun_sky_mode');
      if (saved === 'light' || saved === 'dark') {
        setSkyMode(saved);
      }
    } catch {
      // Ignore storage errors in private-browsing contexts
    }

    // Keep `currentPath` synchronized if the user clicks browser Back / Forward buttons
    const onPopState = () => {
      setCurrentPath(normalizeRoutePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
  });

  /**
   * Updates `<html>`'s `data-forest-mode` attribute and saves the visitor's choice
   * so scrollbars, surfaces, and text colors switch cleanly with zero page reload.
   */
  function applySkyMode(nextMode: SkyMode) {
    setSkyMode(nextMode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-forest-mode', nextMode);
    }
    try {
      if (nextMode === 'auto') {
        localStorage.removeItem('cedarrun_sky_mode');
      } else {
        localStorage.setItem('cedarrun_sky_mode', nextMode);
      }
    } catch {
      // Ignore storage quota / privacy restrictions
    }
  }

  /**
   * Handles WAI-ARIA Left / Right / Home / End arrow-key navigation inside horizontal
   * `role="tablist"` bars ("selection follows focus", per modern accessibility standards).
   */
  function handleTabKeyDown(
    event: KeyboardEvent,
    currentIndex: number,
    totalCount: number,
    selectIndex: (idx: number) => void,
    tabIdPrefix: string
  ) {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % totalCount;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + totalCount) % totalCount;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = totalCount - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      selectIndex(nextIndex);
      const targetBtn = document.getElementById(`${tabIdPrefix}-${nextIndex}`);
      if (targetBtn) {
        targetBtn.focus();
        targetBtn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }

  // Reusable interactive Shelter Progression Explorer rendered on `/` and `/shelters`
  const renderShelterExplorer = () => (
    <div>
      {/* Accessible Horizontal Tablist for Shelter Stages 1–4 */}
      <div class="cr-tablist" role="tablist" aria-label="Shelter building progression stages">
        <For each={SHELTER_STAGES}>
          {(stage, idx) => (
            <button
              type="button"
              role="tab"
              id={`shelter-tab-${idx()}`}
              class="cr-tab"
              aria-selected={activeStageIdx() === idx() ? 'true' : 'false'}
              tabIndex={activeStageIdx() === idx() ? 0 : -1}
              onClick={() => setActiveStageIdx(idx())}
              onKeyDown={(e) =>
                handleTabKeyDown(e, idx(), SHELTER_STAGES.length, setActiveStageIdx, 'shelter-tab')
              }
            >
              {stage.label}
            </button>
          )}
        </For>
      </div>

      {/* Corresponding Tabpanels (All rendered in HTML for crawlers; inactive panels hidden) */}
      <For each={SHELTER_STAGES}>
        {(stage, idx) => (
          <div
            role="tabpanel"
            id={`shelter-panel-${idx()}`}
            aria-labelledby={`shelter-tab-${idx()}`}
            hidden={activeStageIdx() !== idx()}
          >
            <div class="cr-tabpanel-inner cr-grid-2">
              <div>
                <span class="cr-kicker">{stage.timeline}</span>
                <h3>{stage.headline}</h3>
                <p>{stage.summary}</p>
                <h4>Gathered &amp; Hand-Worked Materials</h4>
                <ul>
                  <For each={stage.materialsUsed}>{(item) => <li>{item}</li>}</For>
                </ul>
                <p>
                  <strong>Rain &amp; Night Comfort:</strong> {stage.rainAndWarmthNote}
                </p>
              </div>
              <figure class="cr-media-frame" style={{ margin: '0' }}>
                <img
                  src={stage.imageUrl}
                  alt={stage.imageAlt}
                  width="1200"
                  height="675"
                  loading="lazy"
                />
                <figcaption class="cr-caption">
                  Stage {stage.stageNumber}: {stage.headline}
                </figcaption>
              </figure>
            </div>
          </div>
        )}
      </For>
    </div>
  );

  // Reusable 3-Card Story Crossroads Foothold Grid rendered on `/` and `/crossroads`
  const renderCrossroadsGrid = () => (
    <div class="cr-grid-3">
      <For each={CROSSROADS_FOOTHOLDS}>
        {(foothold) => (
          <article class="cr-card">
            <div>
              <img
                src={foothold.imageUrl}
                alt={foothold.imageAlt}
                width="1200"
                height="675"
                loading="lazy"
              />
              <div class="cr-card-body">
                <span class="cr-kicker">{foothold.badge}</span>
                <h3>{foothold.title}</h3>
                <p>
                  <strong>Terrain:</strong> {foothold.locationSummary}
                </p>
                <p>
                  <strong>Shelter Plan:</strong> {foothold.shelterStrategy}
                </p>
                <p>
                  <strong>Wild Food &amp; Water:</strong> {foothold.forageAndWater}
                </p>
                <p>
                  <strong>When It Rains:</strong> {foothold.rainExperience}
                </p>
              </div>
            </div>
            <div class="cr-card-footer">
              <a href={foothold.bookRouteUrl} class="cr-btn cr-btn-primary" style={{ width: '100%' }}>
                Follow This Route in Book Reader &rarr;
              </a>
            </div>
          </article>
        )}
      </For>
    </div>
  );

  // Reusable Interactive 1975 Mountain-Folk Songbook Deck rendered on `/` and `/songbook`
  const renderSongbookDeck = () => (
    <div>
      <div class="cr-tablist" role="tablist" aria-label="Cedar Run 1975 acoustic songbook">
        <For each={SONGBOOK_ENTRIES}>
          {(song, idx) => (
            <button
              type="button"
              role="tab"
              id={`song-tab-${idx()}`}
              class="cr-tab"
              aria-selected={activeSongIdx() === idx() ? 'true' : 'false'}
              tabIndex={activeSongIdx() === idx() ? 0 : -1}
              onClick={() => setActiveSongIdx(idx())}
              onKeyDown={(e) =>
                handleTabKeyDown(e, idx(), SONGBOOK_ENTRIES.length, setActiveSongIdx, 'song-tab')
              }
            >
              {song.trackNumber}. {song.title}
            </button>
          )}
        </For>
      </div>

      <For each={SONGBOOK_ENTRIES}>
        {(song, idx) => (
          <div
            role="tabpanel"
            id={`song-panel-${idx()}`}
            aria-labelledby={`song-tab-${idx()}`}
            hidden={activeSongIdx() !== idx()}
          >
            <div class="cr-tabpanel-inner cr-grid-2">
              <div>
                <span class="cr-kicker">{song.chapterTieIn}</span>
                <h3>
                  Track {song.trackNumber}: {song.title}
                </h3>
                <p>
                  <strong>Musical Feel:</strong> {song.tempoAndFeel}
                </p>
                <p>
                  <strong>Arrangement:</strong> {song.instruments}
                </p>
                <p>{song.storyContext}</p>
                <div class="cr-btn-row">
                  <a href={song.chapterUrl} class="cr-btn cr-btn-primary">
                    Read Matching Chapter &rarr;
                  </a>
                  <a href={MUSIC_BASE} class="cr-btn">
                    Visit The Listening Room &rarr;
                  </a>
                </div>
              </div>
              <div>
                <h4>Campfire Lyric Notebook</h4>
                <blockquote class="cr-lyric-sheet" style={{ margin: '0' }}>
                  {song.excerptLyrics}
                </blockquote>
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  );

  return (
    <div>
      {/* Sticky Forest Navigation Header + Accessible Sky Mode Switcher */}
      <header class="cr-site-header">
        <div class="cr-container cr-header-inner">
          <a href="/" class="cr-brand" aria-label="Cedar Run Wilderness Launchpad — Home">
            <img
              src={`${CDN_BASE}/raggiesoft-books/images/logos/story-crossroads-seal-3way.svg`}
              alt="RaggieSoft Story Crossroads three-way signpost emblem"
              width="40"
              height="40"
              class="cr-brand-emblem"
            />
            <span>
              <span class="cr-brand-title">Cedar Run</span>
              <span class="cr-brand-sub">Colville Wilderness • Story Crossroads</span>
            </span>
          </a>

          <nav aria-label="Cedar Run sections">
            <ul class="cr-nav-list">
              <For each={SITE_ROUTES}>
                {(route) => (
                  <li>
                    <a
                      href={route.path}
                      class="cr-nav-link"
                      aria-current={currentPath() === route.path ? 'page' : undefined}
                    >
                      {route.navLabel}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </nav>

          {/* Accessible 3-Button Forest Sky Mode Switcher */}
          <div class="cr-sky-switcher" role="group" aria-label="Forest sky lighting mode">
            <button
              type="button"
              class="cr-sky-btn"
              aria-pressed={skyMode() === 'auto' ? 'true' : 'false'}
              onClick={() => applySkyMode('auto')}
            >
              Auto
            </button>
            <button
              type="button"
              class="cr-sky-btn"
              aria-pressed={skyMode() === 'light' ? 'true' : 'false'}
              onClick={() => applySkyMode('light')}
            >
              ☀️ Daylight
            </button>
            <button
              type="button"
              class="cr-sky-btn"
              aria-pressed={skyMode() === 'dark' ? 'true' : 'false'}
              onClick={() => applySkyMode('dark')}
            >
              🌌 Night Sky
            </button>
          </div>
        </div>
      </header>

      {/* Main Landmark Targeted by Skip Link */}
      <main id="main-content" tabIndex={-1}>
        <Show
          when={isKnownRoute()}
          fallback={
            /* Genuine 404 Not Found Recovery Screen */
            <section class="cr-section">
              <div class="cr-container">
                <div class="cr-tabpanel-inner" style={{ 'text-align': 'center' }}>
                  <span class="cr-kicker">Trail Marker Not Found • 404</span>
                  <h1>That Trail Washed Out Years Ago</h1>
                  <p class="cr-lead" style={{ 'margin-inline': 'auto' }}>
                    We couldn’t find that page along Cedar Run Creek. Head back to the main camp
                    clearing or jump straight into Episode 1 of the interactive novel.
                  </p>
                  <div class="cr-btn-row" style={{ 'justify-content': 'center' }}>
                    <a href="/" class="cr-btn cr-btn-primary">
                      Return to Forest Camp
                    </a>
                    <a href={BOOK_BASE} class="cr-btn">
                      Read Cedar Run on Book Reader
                    </a>
                    <a href={MUSIC_BASE} class="cr-btn">
                      Open The Listening Room
                    </a>
                  </div>
                </div>
              </div>
            </section>
          }
        >
          {/* ==============================================================
           * ROUTE 1: HOME LAUNCHPAD (`/`)
           * ============================================================== */}
          <Show when={currentPath() === '/'}>
            <section class="cr-hero">
              <div class="cr-container">
                <div class="cr-hero-card">
                  <div>
                    <span class="cr-kicker">
                      🌲 RaggieSoft Story Crossroads • Colville National Forest, June 2000
                    </span>
                    <h1 class="cr-hero-title">
                      Five Miles Past the Back Fence, Nobody Screams—and Nobody Splits Them Up.
                    </h1>
                    <p class="cr-lead">
                      All their lives, eighteen-year-old triplets{' '}
                      <strong>Luke, Tessa, and Sadie Bridger</strong> loved doing everything
                      together—and all their lives, their parents yelled at them to spread their
                      wings and go separate ways. Thrown out on their eighteenth birthday for
                      refusing to separate, they step through the back barbed-wire fence into a
                      million volcano-free acres of Northeast Washington forest with three canvas
                      packs, a dome tent, Grandpa Owen’s tool roll, and his 1974 acoustic guitar.
                    </p>
                    <div class="cr-btn-row">
                      <a href={`${BOOK_BASE}/e001/c001/p001`} class="cr-btn cr-btn-primary">
                        Start Reading Episode 1 &rarr;
                      </a>
                      <a href="/crossroads" class="cr-btn">
                        Explore the 3-Way Crossroads
                      </a>
                      <a href={MUSIC_BASE} class="cr-btn">
                        Visit The Listening Room
                      </a>
                    </div>
                  </div>

                  <figure class="cr-media-frame" style={{ margin: '0' }}>
                    <img
                      src={`${CDN_BASE}/raggiesoft-books/images/covers/og/cedar-run.jpg`}
                      alt="Cedar Run widescreen cover showing eighteen-year-old triplets Tessa, Luke, and Sadie Bridger sitting on a mossy cedar log over a clear mountain creek with their blue-and-white tent and campfire behind them, stamped with the three-way RaggieSoft Story Crossroads seal."
                      width="1376"
                      height="768"
                      fetchpriority="high"
                    />
                    <figcaption class="cr-caption">
                      An interactive branching novel where every path forward is a complete, coequal
                      wilderness story.
                    </figcaption>
                  </figure>
                </div>
              </div>
            </section>

            {/* Quick Triplet Trio Overview */}
            <section class="cr-section" aria-labelledby="home-triplets-heading">
              <div class="cr-container">
                <span class="cr-kicker">Six Hands, One Unbreakable Rule</span>
                <h2 id="home-triplets-heading">Meet Luke, Tessa, and Sadie Bridger</h2>
                <p class="cr-lead">
                  Fraternal brother Luke and his identical twin sisters Tessa and Sadie turn a
                  single blissful night away from shouting into a hand-built life in the deep woods.
                </p>
                <div class="cr-grid-3">
                  <For each={TRIPLET_PROFILES}>
                    {(t) => (
                      <article class="cr-card">
                        <div class="cr-card-body">
                          <span class="cr-kicker">{t.birthNote}</span>
                          <h3>{t.name}</h3>
                          <p>
                            <strong>{t.role}</strong>
                          </p>
                          <p>{t.bio}</p>
                          <p>
                            <strong>Musical Voice:</strong> {t.musicalVoice}
                          </p>
                        </div>
                        <div class="cr-card-footer">
                          <a href="/triplets">Full Field Pack &amp; Skills &rarr;</a>
                        </div>
                      </article>
                    )}
                  </For>
                </div>
              </div>
            </section>

            {/* Interactive 3-Way Crossroads Chooser Preview */}
            <section class="cr-section" aria-labelledby="home-crossroads-heading">
              <div class="cr-container">
                <span class="cr-kicker">First Story Crossroads • Pure Wilderness, Zero Towns</span>
                <h2 id="home-crossroads-heading">
                  Four Days of Oats Left: Where Do You Stake Their Claim?
                </h2>
                <p class="cr-lead">
                  At the end of Chapter 2, Luke, Tessa, and Sadie have scouted three completely
                  different natural footholds inside the Cedar Run basin—each with its own shelter
                  materials, wild food harvest, and sound when mountain rain begins to fall.
                </p>
                {renderCrossroadsGrid()}
              </div>
            </section>

            {/* Interactive 4-Stage Shelter Progression */}
            <section class="cr-section" aria-labelledby="home-shelter-heading">
              <div class="cr-container">
                <span class="cr-kicker">Hand-Built Homestead Progression</span>
                <h2 id="home-shelter-heading">From a Two-Person Nylon Tent to Cedar &amp; Stone</h2>
                <p class="cr-lead">
                  Step through all four stages to see how fallen western red cedar, Kettle Range
                  granite, and creek clay become a dry, warm refuge.
                </p>
                {renderShelterExplorer()}
              </div>
            </section>

            {/* Rain, Mild Snow & Pristine Milky Way Section */}
            <section class="cr-section" aria-labelledby="home-sky-heading">
              <div class="cr-container cr-grid-2" style={{ 'align-items': 'center' }}>
                <div>
                  <span class="cr-kicker">Soothing Rain &amp; Star-Filled Canopy</span>
                  <h2 id="home-sky-heading">
                    White Noise on Cedar Shakes—and the Milky Way Overhead
                  </h2>
                  <p>
                    Tucked inside a sheltered 1,900-foot river-bench valley of Colville National
                    Forest—hundreds of miles away from the Cascade volcanoes—Cedar Run enjoys long
                    golden summers, gentle mountain rains, and mild winters graced by occasional
                    quiet snowfalls that hush the pines without burying the valley.
                  </p>
                  <p>
                    After eighteen years in a loud, tense house, <strong>the triplets love the rain</strong>:
                    standing in warm summer showers splashing off their faces, or curling up dry
                    together listening to the steady white noise of rainwater pattering on their
                    roof. And when the clouds part after midnight—eighty miles from city glare—the{' '}
                    <strong>Milky Way</strong> blazes bright enough between the ponderosa crowns to
                    shimmer across the dark creek pools.
                  </p>
                  <div class="cr-btn-row">
                    <a href="/sky-and-seasons" class="cr-btn cr-btn-primary">
                      Explore Valley Weather &amp; Night Skies &rarr;
                    </a>
                  </div>
                </div>
                <figure class="cr-media-frame" style={{ margin: '0' }}>
                  <img
                    src={`${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/e001/jun_2000_cedar_run_milky_way_starry_sky.jpg`}
                    alt="Luke, Tessa, and Sadie Bridger wrapped in a shared wool camp blanket on the firelit porch of their split-cedar shelter after evening rain, looking up in awe at the bright Milky Way galaxy stretching between tall Colville National Forest pines."
                    width="1200"
                    height="675"
                    loading="lazy"
                  />
                  <figcaption class="cr-caption">
                    Eighty miles from any streetlamp, clear nights after rain reveal the full river
                    of stars above Cedar Run.
                  </figcaption>
                </figure>
              </div>
            </section>

            {/* Interactive 1975 Songbook Preview */}
            <section class="cr-section" aria-labelledby="home-songbook-heading">
              <div class="cr-container">
                <span class="cr-kicker">1970s Acoustic Singer-Songwriter Warmth</span>
                <h2 id="home-songbook-heading">The Cedar Run Campfire Songbook</h2>
                <p class="cr-lead">
                  Inspired by the warm 1975 era of fingerpicked acoustic guitars, upright parlor
                  pianos, and three-part harmonies—played on Grandpa Owen’s 1974 Clearwater guitar.
                </p>
                {renderSongbookDeck()}
              </div>
            </section>
          </Show>

          {/* ==============================================================
           * ROUTE 2: THE TRIPLETS (`/triplets`)
           * ============================================================== */}
          <Show when={currentPath() === '/triplets'}>
            <section class="cr-section">
              <div class="cr-container">
                <span class="cr-kicker">Character &amp; Pack Guide • Born June 20, 1982</span>
                <h1>Luke, Tessa, and Sadie Bridger</h1>
                <p class="cr-lead">
                  Fraternal brother Luke and identical twin sisters Tessa and Sadie left with only
                  what fit in three canvas packs—plus eighteen years of working seamlessly with six
                  hands.
                </p>

                <figure class="cr-media-frame" style={{ 'margin-block': '1.5rem 2.25rem' }}>
                  <img
                    src={`${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/e001/jun_2000_cedar_run_morning_creek_pool_folded_clothes_boulder.jpg`}
                    alt="Folded jeans, olive flannel, cream henley, striped tee, and leather boots stacked neatly dry on a sunlit granite boulder beside Cedar Run while Luke, Tessa, and Sadie laugh collarbone-deep in the brisk emerald snowmelt pool."
                    width="1200"
                    height="675"
                  />
                  <figcaption class="cr-caption">
                    Morning One on Cedar Run: keeping their only cotton clothes bone-dry on warm
                    granite boulders while washing eighteen years of house tension away in snowmelt.
                  </figcaption>
                </figure>

                <div class="cr-grid-3">
                  <For each={TRIPLET_PROFILES}>
                    {(t) => (
                      <article class="cr-card">
                        <div class="cr-card-body">
                          <span class="cr-kicker">{t.birthNote}</span>
                          <h2>{t.name}</h2>
                          <p>
                            <strong>{t.role}</strong>
                          </p>
                          <p>{t.bio}</p>
                          <p>
                            <strong>How to Spot at a Glance:</strong> {t.visualSignature}
                          </p>
                          <p>
                            <strong>Carried Past the Fence:</strong> {t.carriedInPack}
                          </p>
                          <h3>Wilderness Specialties</h3>
                          <ul>
                            <For each={t.wildernessSkills}>{(skill) => <li>{skill}</li>}</For>
                          </ul>
                        </div>
                        <div class="cr-card-footer">
                          <strong>Harmony Part:</strong> {t.musicalVoice}
                        </div>
                      </article>
                    )}
                  </For>
                </div>
              </div>
            </section>
          </Show>

          {/* ==============================================================
           * ROUTE 3: SHELTER & FORAGE (`/shelters`)
           * ============================================================== */}
          <Show when={currentPath() === '/shelters'}>
            <section class="cr-section">
              <div class="cr-container">
                <span class="cr-kicker">Wilderness Engineering &amp; Wild Pantry</span>
                <h1>How Their Makeshift Shelter Grows Over Time</h1>
                <p class="cr-lead">
                  Without felling live old-growth trees or visiting a single store, the triplets
                  build outward from their two-person dome tent using fallen western red cedar,
                  peeled Douglas fir, river stone, creek clay, willow traps, and wild mountain
                  harvests.
                </p>
                {renderShelterExplorer()}
              </div>
            </section>
          </Show>

          {/* ==============================================================
           * ROUTE 4: STORY CROSSROADS (`/crossroads`)
           * ============================================================== */}
          <Show when={currentPath() === '/crossroads'}>
            <section class="cr-section">
              <div class="cr-container">
                <span class="cr-kicker">RaggieSoft Story Crossroads • Three-Way Signpost</span>
                <h1>Three Footholds in Cedar Run Valley</h1>
                <p class="cr-lead">
                  In RaggieSoft Story Crossroads interactive novels, there are zero trap doors or
                  wrong answers—every option opens a complete, coequal storyline. Choose where Luke,
                  Tessa, and Sadie build their permanent camp at the end of Chapter 2:
                </p>
                <div style={{ 'margin-block': '1.5rem 2rem' }}>
                  <a href={`${BOOK_BASE}/e001/c002/p001`} class="cr-btn cr-btn-primary">
                    Read Chapter 2 Decision Scene on Book Reader &rarr;
                  </a>
                </div>
                {renderCrossroadsGrid()}
              </div>
            </section>
          </Show>

          {/* ==============================================================
           * ROUTE 5: RAIN, SNOW & MILKY WAY NIGHTS (`/sky-and-seasons`)
           * ============================================================== */}
          <Show when={currentPath() === '/sky-and-seasons'}>
            <section class="cr-section">
              <div class="cr-container">
                <span class="cr-kicker">Colville National Forest • Zero Volcanoes</span>
                <h1>Soothing Rain, Quiet Snowfalls &amp; The Milky Way Overhead</h1>
                <p class="cr-lead">
                  Northeast Washington’s Kettle River Range is ancient granite, pine, cedar, and
                  golden autumn tamarack—far removed from the Cascade volcanoes, and blessed with
                  some of the darkest, clearest night skies on the continent.
                </p>

                <figure class="cr-media-frame" style={{ 'margin-block': '1.5rem 2.25rem' }}>
                  <img
                    src={`${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/e001/jun_2000_cedar_run_milky_way_starry_sky.jpg`}
                    alt="Beneath a blazing Milky Way night sky framed by tall pines and western red cedars after evening rain, Luke, Tessa, and Sadie Bridger sit together under a wool camp blanket on the glowing firelit porch of their cedar shelter."
                    width="1200"
                    height="675"
                  />
                  <figcaption class="cr-caption">
                    Try clicking “🌌 Night Sky” at the top right to view the entire site in Cedar
                    Run’s starlit forest palette.
                  </figcaption>
                </figure>

                <div class="cr-grid-3">
                  <article class="cr-card">
                    <div class="cr-card-body">
                      <span class="cr-kicker">Sensory Sanctuary</span>
                      <h2>Why They Love the Rain</h2>
                      <p>
                        When summer or autumn clouds drift down the Kettle River draw, Luke, Tessa,
                        and Sadie don’t hide miserably—they welcome every drop. Cool rainwater
                        splashing off pine needles onto upturned faces feels clean and freeing, and
                        the steady white noise drumming against split-cedar shakes, granite eaves,
                        or bark shingles drowns out every memory of a loud house.
                      </p>
                    </div>
                  </article>

                  <article class="cr-card">
                    <div class="cr-card-body">
                      <span class="cr-kicker">Sheltered 1,900-Foot Bench</span>
                      <h2>Mild Winters &amp; Quiet Snow</h2>
                      <p>
                        Because Cedar Run winds through a low, wind-protected canyon bench rather
                        than a windswept mountain pass, winters stay genuinely survivable—mostly
                        misty emerald rain punctuated every so often by six to twelve inches of
                        silent, powdery snow that turns the red cedars into a hushed cathedral
                        before melting back into the creek.
                      </p>
                    </div>
                  </article>

                  <article class="cr-card">
                    <div class="cr-card-body">
                      <span class="cr-kicker">Looking Up Together</span>
                      <h2>Pristine Milky Way Skies</h2>
                      <p>
                        More than eighty miles from any city light dome, a midnight sky cleared by
                        evening rain unveils thousands of stars and the luminous silver-amber band
                        of the Milky Way stretching from ridge to ridge—bright enough to reflect in
                        Cedar Run’s calm trout pools while the three of them dream about what lies
                        out among the stars.
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </Show>

          {/* ==============================================================
           * ROUTE 6: 1975 SONGBOOK (`/songbook`)
           * ============================================================== */}
          <Show when={currentPath() === '/songbook'}>
            <section class="cr-section">
              <div class="cr-container">
                <span class="cr-kicker">Engine Room Records • Warm 1975 Folk-Rock Spirit</span>
                <h1>Songs from Cedar Run</h1>
                <p class="cr-lead">
                  Every evening once the hearth is banked, Sadie lifts Grandpa Owen Sawyer’s 1974
                  Clearwater steel-string guitar and all three triplets lock into warm, pastoral
                  three-part harmonies in the spirit of mid-1970s acoustic storytellers.
                </p>
                {renderSongbookDeck()}
              </div>
            </section>
          </Show>
        </Show>
      </main>

      {/* Global Ecosystem Footer & Mandatory Fictitious Persons & Entities Disclaimer */}
      <footer class="cr-footer">
        <div class="cr-container">
          <div class="cr-grid-2">
            <div>
              <h2 style={{ 'font-size': '1.15rem' }}>Cedar Run • A RaggieSoft Story Crossroads World</h2>
              <p>
                Written, produced, and published by <strong>Michael P. Ragsdale</strong> across{' '}
                <strong>RaggieSoft Story Crossroads</strong>, <strong>Ocean View Archives</strong>,
                and <strong>Engine Room Records</strong>.
              </p>
              <ul class="cr-pill-list">
                <li>
                  <a href={BOOK_BASE} class="cr-pill">
                    📚 Read on Book Reader
                  </a>
                </li>
                <li>
                  <a href={MUSIC_BASE} class="cr-pill">
                    🎧 Stream in The Listening Room
                  </a>
                </li>
                <li>
                  <a href={LORE_BASE} class="cr-pill">
                    🧭 Universal Lore Archive
                  </a>
                </li>
                <li>
                  <a href={BACKSTAGE_BASE} class="cr-pill">
                    🎬 RaggieSoft Backstage
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p>
                <strong>Open Licensing:</strong> Application source code is licensed under the{' '}
                <a href="https://opensource.org/licenses/MIT">MIT License</a>. Narrative chapters,
                characters, artwork, and lyrics are licensed under{' '}
                <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> (with
                commercial licensing inquiries via{' '}
                <a href="https://raggiesoft.com/raggiesoft-media/licensing/commercial">
                  RaggieSoft Media
                </a>
                ).
              </p>
            </div>
          </div>

          <div class="cr-disclaimer-box" role="note" aria-label="Fictitious entities disclaimer">
            <strong>Fictitious Persons &amp; Entities Disclaimer:</strong> Cedar Run is a work of
            creative fiction. All narrative characters (including Luke, Tessa, and Sadie Bridger,
            Owen Sawyer, and Richard and Evelyn Bridger), bands, biographies, universities
            (including CPI, VDU, The Forgers, and The Crucible), corporations (OmniCorp, Apex
            Records, Prairie Coachworks, Sainte-Claire, Clearwater), transit agencies (BRT, CVTA),
            in-universe legal filings, and events across the RaggieSoft network are fictitious. Any
            resemblance to actual persons, living or dead, businesses, or events is purely
            coincidental. Real-world public geographic names such as Colville National Forest and
            the Kettle River Range are used solely as geographic settings for fictional locations
            such as Cedar Run Creek.
          </div>
        </div>
      </footer>
    </div>
  );
}
