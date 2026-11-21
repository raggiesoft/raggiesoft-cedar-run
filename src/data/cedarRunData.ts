/**
 * @license MIT
 * ============================================================================
 * src/data/cedarRunData.ts — Typed Worldbuilding, Character, Shelter & Song Data
 * Property: https://cedarrun.raggiesoft.com (raggiesoft-cedar-run)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL TYPESCRIPT GUIDE):
 *   What is this file?
 *     Because Cedar Run uses a fast, zero-database architecture, all structured
 *     content for the worldbuilding launchpad—the three Bridger triplets, the
 *     four progressive shelter-building stages, the three Story Crossroads
 *     wilderness routes, the Kettle Range rain/snow/Milky Way weather guide,
 *     and the 1975-inspired acoustic songbook—lives right here in strongly
 *     typed TypeScript arrays and interfaces!
 *
 *   What does `export interface ...` do in TypeScript?
 *     An `interface` is a compile-time blueprint describing the exact shape of
 *     an object (for example, guaranteeing every `CrossroadsFoothold` has a
 *     `title`, `bookUrl`, `imageUrl`, and `imageAlt` for screen readers). At
 *     build time, TypeScript erases these interfaces completely so zero extra
 *     bytes are sent to the visitor's browser!
 * ============================================================================
 */

export const CDN_BASE = 'https://assets.raggiesoft.com';
export const BOOK_BASE = 'https://books.raggiesoft.com/cedar-run';
export const MUSIC_BASE = 'https://music.raggiesoft.com';
export const LORE_BASE = 'https://lore.raggiesoft.com';
export const BACKSTAGE_BASE = 'https://backstage.raggiesoft.com';

export interface RouteMeta {
  path: string;
  navLabel: string;
  /** Strictly <= 60 characters for OpenGraph & search titles */
  seoTitle: string;
  /** Strictly <= 155 characters for OpenGraph & search snippets */
  seoDescription: string;
  ogImage: string;
}

/**
 * Canonical route registry used by both the SolidJS navigation header AND
 * `scripts/prerender.mjs` (to generate static HTML + `sitemap.xml`).
 */
export const SITE_ROUTES: RouteMeta[] = [
  {
    path: '/',
    navLabel: 'Forest Camp',
    seoTitle: 'Cedar Run | Wilderness Story Crossroads & World Guide',
    seoDescription:
      'Step into Colville National Forest with eighteen-year-old triplets Luke, Tessa, and Sadie Bridger—explore their shelters, songs, and Story Crossroads.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/covers/og/cedar-run.jpg`
  },
  {
    path: '/triplets',
    navLabel: 'The Triplets',
    seoTitle: 'Luke, Tessa & Sadie Bridger | Cedar Run Field Guide',
    seoDescription:
      'Meet fraternal brother Luke and identical twin sisters Tessa and Sadie Bridger, plus Grandpa Owen Sawyer’s 1974 guitar and canvas tool roll.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/e001/jun_2000_cedar_run_night_one_campfire_tent.jpg`
  },
  {
    path: '/shelters',
    navLabel: 'Shelter & Forage',
    seoTitle: 'Building Shelter & Gathering Food | Cedar Run Guide',
    seoDescription:
      'Follow how Luke, Tessa, and Sadie expand a two-person nylon tent into a hand-built western red cedar and river-stone wilderness shelter.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/paths/jun_2000_route1_creek_bend_splitting_cedar_shakes.jpg`
  },
  {
    path: '/crossroads',
    navLabel: 'Story Crossroads',
    seoTitle: 'Three Footholds in the Valley | Story Crossroads',
    seoDescription:
      'Preview all three coequal wilderness paths in Cedar Run: the Creek-Bend Cedar Bench, the Granite Overhang, and the Forgotten Stone Springhouse.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/e001/jun_2000_cedar_run_scouting_three_footholds.jpg`
  },
  {
    path: '/sky-and-seasons',
    navLabel: 'Rain & Night Sky',
    seoTitle: 'Rain on Cedar & Milky Way Nights | Cedar Run Valley',
    seoDescription:
      'Experience Cedar Run’s sheltered Northeast Washington valley: soothing mountain rain on cedar shakes, starry Milky Way skies, and quiet snowfalls.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/e001/jun_2000_cedar_run_milky_way_starry_sky.jpg`
  },
  {
    path: '/songbook',
    navLabel: '1975 Songbook',
    seoTitle: 'Songs from Cedar Run | Three-Part Mountain Folk',
    seoDescription:
      'Read lyrics and story notes for the Bridger triplets’ warm 1970s-inspired acoustic guitar, parlor piano, and three-part sibling harmony songbook.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/covers/og/cedar-run.jpg`
  }
];

export interface TripletProfile {
  id: string;
  name: string;
  role: string;
  birthNote: string;
  visualSignature: string;
  wildernessSkills: string[];
  musicalVoice: string;
  carriedInPack: string;
  bio: string;
}

export const TRIPLET_PROFILES: TripletProfile[] = [
  {
    id: 'luke',
    name: 'Luke Bridger',
    role: 'Fraternal Triplet Brother • First-Person ("I") Narrator & Timber Framer',
    birthNote: 'Born June 20, 1982 (Age 18 in Summer 2000)',
    visualSignature:
      'Tousled sandy-brown hair bleached lighter by June sun, hazel-brown eyes, heather-gray crew shirt under a faded olive flannel overshirt, denim jeans, and weathered work boots.',
    wildernessSkills: [
      'Splitting straight western red cedar planks & roof shakes with froe and wooden maul',
      'Dry-stacking Kettle Range granite hearth walls & chimney flues',
      'Notching peeled Douglas fir stringers and ridgepoles'
    ],
    musicalVoice: 'Warm baritone-tenor harmony anchor and steady open-tuning rhythm guitar.',
    carriedInPack:
      'Grandpa Owen Sawyer’s waxed-canvas tool roll (shingle froe, hickory camp hatchet, curved drawknife, coiled bow-saw blade, chisels, whetstone, cordage, and trout hooks).',
    bio: 'Steady, observant, and fiercely protective of his sisters, Luke learned traditional timber framing and dry-stone masonry spending summers in Grandpa Owen’s workshop. When their parents demanded the three triplets scatter onto separate lives at eighteen, Luke stepped up to hold the barbed wire open into the forest instead.'
  },
  {
    id: 'tessa',
    name: 'Tessa Bridger',
    role: 'Identical Twin Sister #1 • Trail Mechanic, Forager & Hearth-Keeper',
    birthNote: 'Born June 20, 1982 (Age 18 in Summer 2000)',
    visualSignature:
      'Long chestnut-brown hair pulled half-back with a leather thong to stay clear of saw blades and campfire smoke, gray-hazel eyes, cream cotton henley under a tan canvas work vest, and a braided brown leather wrist cord.',
    wildernessSkills: [
      'Weaving passive red-osier willow funnel traps for cutthroat trout',
      'Foraging mountain huckleberries, wild strawberries, wild onions, nettles, and golden chanterelles',
      'Rigging storm-tight tarp ridgelines and bear-safe counterbalance food hangs'
    ],
    musicalVoice: 'Clear, earthy alto-mezzo twin harmony and percussive acoustic rhythm.',
    carriedInPack:
      'The weathered blue-and-white dome tent, ferrocerium fire-starter rod, braided nylon cordage, and half of their dry pantry oats and pinto beans.',
    bio: 'Direct, fearless, and happiest when solving a physical problem with her hands, Tessa turns anxiety into immediate motion. Give her an armful of willow switches, a pile of river stones, or a hillside of ripening huckleberries, and camp feels like a home before sundown.'
  },
  {
    id: 'sadie',
    name: 'Sadie Bridger',
    role: 'Identical Twin Sister #2 • Navigator, Camp Medic & Songwriter',
    birthNote: 'Born June 20, 1982 (Age 18 in Summer 2000)',
    visualSignature:
      'Exact identical twin face and gray-hazel eyes to Tessa with her chestnut-brown hair worn loose over her shoulders, navy-and-white striped crew tee under a soft burgundy cardigan, and a woven burgundy-and-navy thread bracelet.',
    wildernessSkills: [
      'Reading contour elevations, cold-air drainage, and spring seeps on Forest Service topo maps',
      'Wilderness first aid, water boiling & spring-trough food preservation',
      'Ration math and sun-drying wild berries on warm granite slabs'
    ],
    musicalVoice:
      'Crystalline 1970s-style soprano-mezzo lead vocal, fingerstyle acoustic guitar, and three-part harmony arranger.',
    carriedInPack:
      'Grandpa Owen’s 1974 Clearwater steel-string dreadnought guitar in its duct-taped black case, laminated quadrangle maps, scarred enamel kettle, and waterproof document pouch.',
    bio: 'Thoughtful and steel-spined beneath a quiet smile, Sadie sees terrain patterns and seasonal weather shifts three moves ahead. Every evening by the keyhole fire, her thumb-picked 1970s acoustic chords turn three tired eighteen-year-olds into a band.'
  }
];

export interface ShelterStage {
  stageNumber: number;
  id: string;
  label: string;
  timeline: string;
  headline: string;
  summary: string;
  materialsUsed: string[];
  rainAndWarmthNote: string;
  imageUrl: string;
  imageAlt: string;
}

export const SHELTER_STAGES: ShelterStage[] = [
  {
    stageNumber: 1,
    id: 'stage-1-dome-tent',
    label: 'Stage 1: Night-One Tent',
    timeline: 'Days 1–2 • Late June 2000',
    headline: 'Two-Person Dome Tent, Keyhole Fire & Nine Hours of Unbroken Peace',
    summary:
      'Five miles past the washed-out logging culvert, Luke, Tessa, and Sadie pitch their weathered blue-and-white nylon tent on dry russet pine duff twenty paces above Cedar Run, unzipping both sleeping bags into one shared quilt for the quietest night of their lives.',
    materialsUsed: [
      'Weathered blue-and-white fiberglass-pole dome tent',
      'Dry wrist-thick lower ponderosa branches & shredded cedar inner-bark tinder',
      'Keyhole stone fire ring dug down to bare mineral sand'
    ],
    rainAndWarmthNote:
      'Protected beneath a hundred-foot ponderosa canopy, with three sharp stars visible through the roof mesh vent and zero shouting anywhere in the dark.',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/e001/jun_2000_cedar_run_night_one_campfire_tent.jpg`,
    imageAlt:
      'Luke, Tessa, and Sadie Bridger sitting peacefully on a fallen log by a small stone campfire in front of their blue-and-white dome tent under twilight pines as Sadie plays acoustic guitar.'
  },
  {
    stageNumber: 2,
    id: 'stage-2-cedar-frame',
    label: 'Stage 2: Raised Timber Frame',
    timeline: 'Week 1 • Late June 2000',
    headline: 'Getting Off the Cold Ground With Windfall Cedar & Peeled Fir',
    summary:
      'Without felling a single live tree, the triplets buck seasoned corner blocks and split laser-straight red heartwood planks using Grandpa Owen’s steel froe and a hand-carved tamarack maul—lifting their sleeping deck eighteen inches clear of damp soil.',
    materialsUsed: [
      '80-foot wind-toppled western red cedar heartwood',
      'Peeled Douglas fir floor stringers & forked ridgepole uprights',
      'Spruce-root & cedar-bark lashings preserving their nylon cord'
    ],
    rainAndWarmthNote:
      'When summer rain sweeps down the Kettle Range, water runs harmlessly beneath the elevated cedar floorboards while the U-shaped stone hearth bounces heat inward.',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/paths/jun_2000_route1_creek_bend_splitting_cedar_shakes.jpg`,
    imageAlt:
      'Luke splitting straight western red cedar planks beside a raised timber lean-to frame while Tessa checks a woven willow fish trap at the emerald creek edge and Sadie lays river hearth stones.'
  },
  {
    stageNumber: 3,
    id: 'stage-3-stone-and-shakes',
    label: 'Stage 3: Stone, Clay & Bark Eaves',
    timeline: 'Weeks 2–6 • July–August 2000',
    headline: 'Weatherproof Walls, Natural Chimney Draft & The Rain-Listening Porch',
    summary:
      'Week by week, the shelter expands: overlapping split-cedar shakes and four-foot bark shingles overhead, dry-stacked granite wind-walls chinked tight with creek clay and moss, and wide front eaves where all three sit dry with Grandpa’s guitar during afternoon downpours.',
    materialsUsed: [
      'Two-on-one dry-stacked Kettle Range granite slabs',
      'Creek-seep gray clay kneaded with moss and pine needles for draft-proof chinking',
      'Overlapping split-cedar roof shakes weighted with binder poles'
    ],
    rainAndWarmthNote:
      'Steady Pacific Northwest rain drumming against thick cedar shakes creates a warm, rhythmic hush inside—turning rainy afternoons into the triplets’ favorite hours of the week.',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/paths/jun_2000_route2_granite_overhang_stone_wall_huckleberries.jpg`,
    imageAlt:
      'Luke, Tessa, and Sadie enclosing a dry south-facing granite rock overhang with stacked fieldstones and peeled lodgepole poles above a sunny wild huckleberry meadow.'
  },
  {
    stageNumber: 4,
    id: 'stage-4-four-season-sanctuary',
    label: 'Stage 4: Autumn & Snow Sanctuary',
    timeline: 'September–Winter 2000',
    headline: 'Sun-Dried Berries, Cold-Spring Storage & Quiet Mountain Snowfalls',
    summary:
      'In Cedar Run’s sheltered 1,900-foot valley bench, golden October tamaracks give way to mild, misty late-autumn rains and occasional hushed winter snowfalls—met with stacked dry tamarack cordwood, smoked trout, dried huckleberries, and radiant stone hearths.',
    materialsUsed: [
      '42-degree bubbling stone spring trough & slate-lined root cache',
      'Seasoned tamarack and Douglas fir cordwood stacked dry under extended eaves',
      'Sun-dried huckleberry leather, wild onion braids, and woven cedar-bough door curtains'
    ],
    rainAndWarmthNote:
      'When rain clears out at midnight—or six inches of quiet powder dusts the cedar boughs—the three wrap in wool blankets on the dry porch beneath a blazing horizon-to-horizon Milky Way.',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/e001/jun_2000_cedar_run_milky_way_starry_sky.jpg`,
    imageAlt:
      'Under a crystal-clear night sky blazing with the Milky Way galaxy between tall pines and cedars, Luke, Tessa, and Sadie sit wrapped in a wool blanket on the warm firelit porch of their cedar shelter.'
  }
];

export interface CrossroadsFoothold {
  id: string;
  badge: string;
  title: string;
  locationSummary: string;
  shelterStrategy: string;
  forageAndWater: string;
  rainExperience: string;
  bookRouteUrl: string;
  imageUrl: string;
  imageAlt: string;
}

export const CROSSROADS_FOOTHOLDS: CrossroadsFoothold[] = [
  {
    id: 'creek-bend-cedar-frame',
    badge: 'Option 1 • Creek-Bottom Terrace',
    title: 'The Creek-Bend Cedar Bench',
    locationSummary: 'Twenty feet above three linked emerald pools of Cedar Run Creek',
    shelterStrategy:
      'Use an eighty-foot wind-toppled western red cedar giant as a solid north back wall, splitting straight planks and roof shakes with Grandpa Owen’s froe for a raised timber cabin.',
    forageAndWater:
      'Woven red-osier willow funnel traps for pan-sized cutthroat trout, wild strawberries, thimbleberries, and boiled young nettle and fireweed greens.',
    rainExperience:
      'Rainwater patters across hand-split red-cedar shakes overhead while mist curls off the deep green pools twenty paces below the porch.',
    bookRouteUrl: `${BOOK_BASE}/paths/creek-bend-cedar-frame/e001/c003/p001`,
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/paths/jun_2000_route1_creek_bend_splitting_cedar_shakes.jpg`,
    imageAlt:
      'Luke splitting red-cedar planks beside the fallen giant cedar trunk while Tessa checks a woven willow fish trap in the emerald creek pool and Sadie builds a river-stone hearth.'
  },
  {
    id: 'granite-overhang-hearth',
    badge: 'Option 2 • Sunny South Slope',
    title: 'The South-Facing Granite Overhang',
    locationSummary: 'Half a mile upslope above five rolling acres of sunlit meadow',
    shelterStrategy:
      'Enclose a bone-dry, twelve-foot-deep bedrock cliff alcove with dry-stacked granite slabs, peeled lodgepole poles, and moss-clay chinking beneath a natural vertical rock chimney flue.',
    forageAndWater:
      'Gallons of sweet purple mountain huckleberries sun-dried on hot granite tables, crisp white wild-onion bulbs, and a cobble-lined cold spring seep sixty steps east.',
    rainExperience:
      'A silver curtain of rain falls just past the dry stone overhang lip into the berry meadow while ten thousand tons of sun-warmed granite radiate stored heat behind your back.',
    bookRouteUrl: `${BOOK_BASE}/paths/granite-overhang-hearth/e001/c003/p001`,
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/paths/jun_2000_route2_granite_overhang_stone_wall_huckleberries.jpg`,
    imageAlt:
      'Beneath a wide south-facing granite rock overhang overlooking a green huckleberry meadow, Luke, Tessa, and Sadie build a dry-stacked fieldstone front wall beside pots of wild huckleberries.'
  },
  {
    id: 'old-lookout-ridge',
    badge: 'Option 3 • High Tamarack Saddle',
    title: 'The Forgotten Stone Springhouse',
    locationSummary: 'Wind-sheltered Douglas fir and tamarack saddle at the upper springhead',
    shelterStrategy:
      'Hoist a sixteen-foot seasoned Douglas fir ridgepole, peeled tamarack rafters, and overlapping four-foot cedar-bark shingles atop four intact 1930s dry-stone walls.',
    forageAndWater:
      'Apricot-scented Pacific golden chanterelles from damp fir duff, wild red raspberries, lemony wood sorrel, and a 42-degree indoor stone spring trough that chills food naturally.',
    rainExperience:
      'Steady mountain rain whispers across thick cedar-bark shingles overhead while the crystal indoor spring trickles musically along the northern slate wall.',
    bookRouteUrl: `${BOOK_BASE}/paths/old-lookout-ridge/e001/c003/p001`,
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/cedar-run/paths/jun_2000_route3_forgotten_stone_springhouse_rafters.jpg`,
    imageAlt:
      'In a high mountain tamarack clearing, Luke and Tessa hoist peeled Douglas fir roof rafters onto mossy 1930s stone springhouse walls beside a bubbling stone water trough while Sadie hands up cedar bark.'
  }
];

export interface SongbookEntry {
  trackNumber: string;
  title: string;
  chapterTieIn: string;
  chapterUrl: string;
  tempoAndFeel: string;
  instruments: string;
  storyContext: string;
  excerptLyrics: string;
}

export const SONGBOOK_ENTRIES: SongbookEntry[] = [
  {
    trackNumber: '01',
    title: 'Cedar Run',
    chapterTieIn: 'Episode 1, Chapter 1 • Snowmelt and Red Cedar',
    chapterUrl: `${BOOK_BASE}/e001/c001/p002`,
    tempoAndFeel: '1975 Pastoral Mountain Folk-Rock Ballad • Warm Analog Tape',
    instruments:
      'Fingerpicked 6-string & shimmering 12-string acoustic guitars, rolling upright parlor piano, fretless bass, brushed snare, three-part sibling harmonies',
    storyContext:
      'Written after their very first silent night beyond the barbed-wire fence and their morning dip in the snowmelt granite pool—celebrating the nameless stream where nobody can split the three of them apart.',
    excerptLyrics: `Eighteen summers screaming through the hallway and the floor
Saying normal kids scatter when they reach an open door
So we shouldered canvas rucksacks and Grandpa's old guitar
Stepped across the back-fence wire beneath the evening star

Carry me up to Cedar Run
Where the cold spring meets the morning sun
Three voices rising through the tall green pine
No fence on the ridge, no dividing line`
  },
  {
    trackNumber: '02',
    title: 'Rain on Split Cedar',
    chapterTieIn: 'Sheltered Valley Rainstorms • All Three Footholds',
    chapterUrl: `${BOOK_BASE}/e001/c001/p001`,
    tempoAndFeel: 'Mellow 1975 Acoustic Fingerpicking & Rain-Hush Harmony',
    instruments:
      'Open-G Sitka spruce dreadnought guitar, soft wooden porch percussion, close twin-sister alto/soprano & brother baritone vocal blend',
    storyContext:
      'Captures why the triplets love afternoon rainstorms in Colville National Forest: cool rainwater splashing on upturned faces and steady white noise drumming overhead while they curl up dry together.',
    excerptLyrics: `Let the gray cloud settle down the Kettle River draw
Wash the sawdust off our knuckles, turn the pine duff soft and raw
Every drop upon the roof-shakes is a wall against the past
Just the white noise of the rainwater and peace that's built to last`
  },
  {
    trackNumber: '03',
    title: 'Straight Grain and Silver Water',
    chapterTieIn: 'Route 1 • The Creek-Bend Cedar Bench',
    chapterUrl: `${BOOK_BASE}/paths/creek-bend-cedar-frame/e001/c003/p001`,
    tempoAndFeel: 'Sunny Mid-Tempo 1970s Acoustic Storyteller Groove',
    instruments: 'Twin steel-string guitars, warm upright bass, bright acoustic lead fills',
    storyContext:
      'Scored to the crisp crack of Grandpa Owen’s shingle froe splitting straight red heartwood and Tessa lifting silver-gold cutthroat trout from her woven willow trap.',
    excerptLyrics: `Eighty feet of fallen heartwood seasoned ten years off the ground
Every plank splits straight as music when the wooden maul comes down
Willow basket in the riffle where the spotted cutthroat glide
Supper sizzling on green alder with my sisters at my side`
  },
  {
    trackNumber: '04',
    title: 'Huckleberry Sun (Three Walls of Stone)',
    chapterTieIn: 'Route 2 • The South-Facing Granite Overhang',
    chapterUrl: `${BOOK_BASE}/paths/granite-overhang-hearth/e001/c003/p001`,
    tempoAndFeel: 'Warm 1975 Canyon-Meadow Acoustic & Parlor Piano Ballad',
    instruments: 'Acoustic guitar arpeggios, warm upright piano chords, three-part chorus swell',
    storyContext:
      'Inspired by stained purple fingers in five acres of sunny mountain huckleberries and feeling the ancient granite cliff radiate stored daytime sunshine long after midnight.',
    excerptLyrics: `Ten thousand tons of granite soaking June light all day long
Breathing warmth back through the darkness like an ember in a song
Purple berries on the flat rock, wild onion in the pot
We got three walls built by glaciers and we love the roof we've got`
  },
  {
    trackNumber: '05',
    title: 'Sixty Years Under the Moss',
    chapterTieIn: 'Route 3 • The Forgotten Stone Springhouse',
    chapterUrl: `${BOOK_BASE}/paths/old-lookout-ridge/e001/c003/p001`,
    tempoAndFeel: 'Reflective 1975 High-Ridge Acoustic & Harmonica Waltz',
    instruments: '3/4 fingerpicked dreadnought guitar, gentle harmonica, soaring sibling harmonies',
    storyContext:
      'Sung beneath freshly peeled tamarack rafters atop the mossy 1930s fieldstone springhouse while forty-two-degree mountain water purls through the indoor stone trough.',
    excerptLyrics: `Whoever laid these gable stones back in nineteen-thirty-three
Left a doorway facing southward and a cold spring running free
Sixty summers under feather-moss waiting on the hill
For three kids to raise the ridgepole while the evening turns to still`
  },
  {
    trackNumber: '06',
    title: 'River of Stars Above the Pines',
    chapterTieIn: 'Clear Midnight After Rain • Looking Up Together',
    chapterUrl: `${BOOK_BASE}`,
    tempoAndFeel: 'Sweeping 1975 Nocturne • Cascading Piano & 12-String Shimmer',
    instruments:
      'Cascading acoustic piano, 12-string guitar harmonics, sustained vocal harmonies echoing into quiet forest night',
    storyContext:
      'After a late rain washes every speck of pollen from the Kettle Range air, Luke, Tessa, and Sadie sit wrapped in one wool blanket watching the Milky Way reflect in Cedar Run.',
    excerptLyrics: `Eighty miles from any streetlamp, after rain has washed the air
There's an ocean made of starlight hanging silver up the stair
Every world we used to dream of on a glowing living-room screen
Shining real above the cedars in the deepest night we've seen`
  }
];
