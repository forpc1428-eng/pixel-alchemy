// ═════════════════════════════════════════════════════════════════════════════
//  ULTRA FORGE — the ONE file you (or your AI) edit to make this site yours.
//  Everything visible — name, colours, 3D scene, sections, HUD, SEO — comes from here.
//  After editing: open index.html via a local server (python -m http.server 8080).
// ═════════════════════════════════════════════════════════════════════════════
window.FORGE = {
  // ── Identity ────────────────────────────────────────────────────────────────
  name: 'Your Name',
  role: 'Creative Developer · Web · App · Software',
  tagline: 'I design and build websites, apps and software that feel alive — fast, cinematic and made to be remembered.',
  email: 'you@example.com',
  location: 'Earth · Remote worldwide',
  socials: [
    ['GitHub', 'https://github.com/'],
    ['LinkedIn', 'https://linkedin.com/'],
    ['Instagram', 'https://instagram.com/'],
  ],

  // ── Ultra Level (1–1000). See skills/ultra-levels. 1000 = every effect + gate. ──
  level: 1000,

  // ── 3D scene (WebGL2, zero dependencies) ──────────────────────────────────
  // 'blackhole' | 'nebula' | 'orb' | 'liquid' | 'aurora' | 'terrain'
  scene: 'blackhole',
  // Scroll story: the scene moves through these beats as the visitor scrolls (0→1).
  // Each scene interprets "progress" in its own way (fall in, fly through, morph…).

  // ── Palette (pick from library/palettes.json or invent). Hex only. ─────────
  palette: {
    bg: '#030305',        // deepest background
    ink: '#ecebe6',       // main text
    muted: '#8d8b86',     // secondary text
    accent: '#ffb46b',    // ONE accent: links, highlights, key light
    glow: '#ff7a2f',      // scene hot colour (disc, core, sun)
    cool: '#6f8cff',      // scene cool colour (rim, sky, shadow tint)
  },

  // ── Typography: 'editorial' (serif display) | 'grotesk' (all sans) | 'mono-tech' ──
  typeStyle: 'editorial',

  // ── Live HUD readouts (top bar). value(p) gets scroll progress 0..1 ─────────
  hud: [
    { label: 'Bending light', value: p => Math.round(Math.min(99, p * 140)) + '%' },
    { label: 'Distance', value: p => (64 * (1 - p) + 1).toFixed(2) + ' rs' },
    { label: 'Clock rate×', value: p => Math.sqrt(Math.max(0.0001, 1 - 1 / (64 * (1 - p) + 1.02))).toFixed(4) },
  ],

  hero: {
    kicker: 'Creative Developer · Web · App · Software',
    // Title lines; wrap a word in *stars* for the italic accent.
    lines: ['Your', '*Name*'],
    cue: 'Scroll to cross the event horizon',
  },

  // ── Sections, in order. `nav` = short menu label (omit to hide from menu). type: about | work | services | process | stats | quote | contact
  sections: [
    { type: 'about', id: 'about', nav: 'About', kicker: 'About', title: 'Where ideas *are born.*',
      body: 'I’m a creative developer. I turn ideas into websites, apps and software with cinematic motion, real-time 3D and interfaces that feel effortless on every screen.' },

    { type: 'stats', id: 'numbers', items: [
      ['60', 'fps on mid-range phones'], ['<2', 's to first frame'], ['100', 'Lighthouse target'], ['∞', 'attention to detail'],
    ] },

    { type: 'work', id: 'work', nav: 'Work', kicker: 'Selected work', title: 'Things I’ve *created.*',
      items: [
        { title: 'Event Horizon', meta: 'Website · WebGL · 2026', desc: 'A scroll journey through a black hole.', url: '#', hue: 28 },
        { title: 'Pocket Universe', meta: 'Android app · 2026', desc: 'A galaxy you can hold — offline, 60 fps.', url: '#', hue: 220 },
        { title: 'Stardust Studio', meta: 'Desktop software · 2026', desc: 'A tiny tool for big ideas.', url: '#', hue: 280 },
        { title: 'Liquid Commerce', meta: 'E-commerce · 3D product · 2026', desc: 'Product pages that feel like film.', url: '#', hue: 160 },
      ] },

    { type: 'services', id: 'services', nav: 'Services', kicker: 'What I build', title: 'One studio, *every screen.*',
      items: [
        ['Websites', 'Cinematic, fast, SEO-ready sites and landing pages.'],
        ['Mobile apps', 'Installable PWAs and Android APKs from one codebase.'],
        ['Desktop software', 'Windows, macOS and Linux apps with native installers.'],
        ['3D & motion', 'WebGL scenes, shaders, scroll storytelling, micro-interactions.'],
        ['Design systems', 'Colour, type, spacing and components that scale.'],
        ['Launch', 'Domains, hosting, analytics, CI — shipped, not just designed.'],
      ] },

    { type: 'process', id: 'process', nav: 'Process', kicker: 'Process', title: 'From idea to *orbit.*',
      items: [
        ['01', 'Discover', 'Goals, audience, references, constraints.'],
        ['02', 'Direct', 'Art direction, palette, type, motion language.'],
        ['03', 'Build', 'Production code, 3D, content, every breakpoint.'],
        ['04', 'Launch', 'Quality gate, performance, deploy, measure.'],
      ] },

    { type: 'quote', id: 'quote', text: 'Great work is a thousand small decisions made on purpose.', by: 'Studio principle' },

    { type: 'contact', id: 'contact', nav: 'Contact', kicker: 'Contact · Home', title: 'Every journey *ends at home.*',
      body: 'Have a website, app or software idea? Let’s build something that bends a little light.' },
  ],

  // ── SEO / sharing ──────────────────────────────────────────────────────────
  seo: {
    title: 'Your Name — Creative Developer',
    description: 'Fall into a black hole, cross the galaxy and arrive home. Websites, apps and software by Your Name.',
    url: 'https://example.com',
  },
};
