/* ═════════════════════════════════════════════════════════════════════════════
   ULTRA FORGE — page orchestration. Reads window.FORGE (config.js), builds the DOM,
   drives the 3D engine from scroll, and runs every micro-interaction.
   You rarely need to edit this file — edit config.js instead.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const F = window.FORGE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const qs = new URLSearchParams(location.search);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOBILE = qs.get('m') === '1' || (qs.get('m') !== '0' && (matchMedia('(pointer: coarse)').matches || innerWidth < 760));
  const finePointer = matchMedia('(pointer: fine)').matches && !reduced && !MOBILE;
  const level = Math.max(1, Math.min(1000, +(qs.get('level') || F.level || 1000)));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rich = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');   // *word* → italic accent

  root.classList.remove('no-js');
  root.classList.toggle('mobile', MOBILE);
  root.classList.add('type-' + (F.typeStyle || 'editorial'));
  root.dataset.level = level;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // ── palette → CSS tokens ────────────────────────────────────────────────
  const pal = Object.assign({ bg: '#030305', ink: '#ecebe6', muted: '#8d8b86', accent: '#ffb46b', glow: '#ff7a2f', cool: '#6f8cff' }, F.palette);
  Object.entries(pal).forEach(([k, v]) => root.style.setProperty('--' + k, v));
  $('meta[name=theme-color]').setAttribute('content', pal.bg);

  // ── SEO ─────────────────────────────────────────────────────────────────
  if (F.seo) {
    document.title = F.seo.title || document.title;
    const set = (sel, v) => v && $(sel) && $(sel).setAttribute('content', v);
    set('meta[name=description]', F.seo.description);
    const ld = $('#ld'); if (ld) ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: F.name, jobTitle: F.role, email: F.email, url: F.seo.url, sameAs: (F.socials || []).map(s => s[1]) }); set('meta[property="og:title"]', F.seo.title); set('meta[property="og:description"]', F.seo.description);
  }

  // ── loader progress (fonts + shader) ────────────────────────────────────
  const pctEl = $('#pct'); let pct = 0, goal = 30;
  const tick = () => { pct += (goal - pct) * 0.12; pctEl.textContent = Math.min(100, Math.round(pct)); if (!root.classList.contains('loaded')) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  let revealed = false;
  function reveal() {
    if (revealed) return; revealed = true; goal = 100; pctEl.textContent = '100';
    setTimeout(() => { root.classList.add('loaded'); observe(); }, reduced ? 0 : 250);
  }
  setTimeout(reveal, 3500); // never hang

  // ── identity ────────────────────────────────────────────────────────────
  $$('[data-name]').forEach(el => el.textContent = F.name || 'Your Name');
  $('#year').textContent = new Date().getFullYear();
  const hero = F.hero || {};
  $('#heroKicker').textContent = hero.kicker || F.role || '';
  $('#heroTagline').textContent = F.tagline || '';
  $('#heroCue').textContent = hero.cue || 'Scroll';
  let d = 0;
  $('#heroTitle').innerHTML = (hero.lines || [F.name || 'Your Name']).map(line => {
    const italic = /^\*.*\*$/.test(line); const txt = line.replace(/^\*|\*$/g, '');
    const chars = [...txt].map(c => `<span class="ch" style="--d:${(d += 38)}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
    return `<span class="line">${italic ? `<em>${chars}</em>` : chars}</span>`;
  }).join('');
  $('#heroTitle').setAttribute('aria-label', (hero.lines || []).join(' ').replace(/\*/g, ''));

  // ── HUD ─────────────────────────────────────────────────────────────────
  const hud = (F.hud || []).slice(0, 3);
  $('#hud').innerHTML = hud.map(h => `<div><dt>${esc(h.label)}</dt><dd>—</dd></div>`).join('');
  const hudVals = $$('#hud dd');

  // ── sections ────────────────────────────────────────────────────────────
  const host = $('#sections'); let side = 0;
  const R = {
    about: s => panel(s, `<p class="body reveal">${rich(s.body || '')}</p>`),
    stats: s => `<section class="sec center" id="${s.id}"><div class="panel wide"><div class="stats">${s.items.map(([n, l], i) =>
      `<div class="stat reveal" style="--i:${i}"><b data-count="${esc(n)}">${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}</div></div></section>`,
    work: s => panel(s, `<div class="work">${s.items.map((w, i) =>
      `<a class="card reveal" style="--i:${i};--h:${w.hue ?? 30}" href="${esc(w.url || '#')}" ${/^https?:/.test(w.url || '') ? 'target="_blank" rel="noopener"' : ''}>
         <div class="art" aria-hidden="true"></div><span class="tag">${esc(w.meta || '')}</span>
         <div class="meta"><h3>${esc(w.title)}</h3><p>${esc(w.desc || '')}</p></div></a>`).join('')}</div>`, true),
    services: s => marquee(s.items.map(x => x[0])) + panel(s, `<div class="svc">${s.items.map(([t, p], i) =>
      `<div class="reveal" style="--i:${i}"><h3>${esc(t)}</h3><p>${esc(p)}</p></div>`).join('')}</div>`, true),
    process: s => panel(s, `<ol class="steps">${s.items.map(([n, t, p], i) =>
      `<li class="reveal" style="--i:${i}"><b>${esc(n)}</b><strong>${esc(t)}</strong><span>${esc(p)}</span></li>`).join('')}</ol>`),
    quote: s => `<section class="sec center" id="${s.id}"><blockquote class="quote reveal">“${rich(s.text)}”<cite>${esc(s.by || '')}</cite></blockquote></section>`,
    contact: s => panel(s, `<p class="body reveal">${rich(s.body || '')}</p>
      <a class="mail reveal" href="mailto:${esc(F.email)}">${esc(F.email)}</a>
      <div class="row reveal"><a class="btn primary magnetic" href="mailto:${esc(F.email)}">Start a project →</a><button class="btn magnetic" id="copyMail" type="button">Copy email</button></div>
      <div class="socials reveal">${(F.socials || []).map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join('')}${F.location ? `<span class="muted">${esc(F.location)}</span>` : ''}</div>`),
  };
  function panel(s, inner, wide) {
    const right = !wide && (side++ % 2 === 1);
    return `<section class="sec ${right ? 'right' : ''}" id="${s.id}"><div class="panel ${wide ? 'wide' : ''}">
      ${s.kicker ? `<p class="kicker reveal">${esc(s.kicker)}</p>` : ''}${s.title ? `<h2 class="reveal">${rich(s.title)}</h2>` : ''}${inner}</div></section>`;
  }
  function marquee(words) {
    const run = words.map(w => `<span>${esc(w)}</span>`).join('');
    return `<div class="marquee" aria-hidden="true"><div>${run}${run}</div></div>`;
  }
  host.innerHTML = (F.sections || []).map(s => (R[s.type] || (() => ''))(s)).join('');

  // ── nav ─────────────────────────────────────────────────────────────────
  const navItems = (F.sections || []).filter(s => s.nav);
  $('#nav').innerHTML = navItems.map(s => `<a href="#${s.id}">${esc(s.nav || s.kicker.split('·')[0].trim().split(' ').pop())}</a>`).join('');
  const navLinks = $$('#nav a');
  const menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => { const open = root.classList.toggle('menu-open'); menuBtn.setAttribute('aria-expanded', open); });
  navLinks.forEach(a => a.addEventListener('click', () => { root.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') root.classList.remove('menu-open'); });

  // ── 3D engine ───────────────────────────────────────────────────────────
  const canvas = $('#scene');
  const scene = qs.get('scene') || F.scene || 'blackhole';
  // framing: desktop → subject right of the text; phone → subject high and smaller, above the title
  const portrait = () => MOBILE || innerWidth < 900;
  const shiftFor = () => portrait() ? [0, 0.2] : [0.28, 0.02];
  const zoomFor = () => portrait() ? 1.45 : 1;
  let engine = null;
  if (level >= 300 && window.UltraEngine) {
    try { engine = UltraEngine.create(canvas, { scene, palette: pal, mobile: MOBILE, reduced, shift: shiftFor(), zoom: zoomFor(), preserve: qs.has('shot') }); } catch (e) { console.error(e); }
  }
  if (engine) {
    goal = 70;
    engine.onfail = () => { root.classList.add('no-webgl'); reveal(); };
    engine.onFirstFrame(() => { (document.fonts ? document.fonts.ready : Promise.resolve()).then(reveal); });
    engine.start();
    window.__ultra = engine;
    addEventListener('resize', () => engine.setShift(shiftFor(), zoomFor()));
  } else { root.classList.add('no-webgl'); (document.fonts ? document.fonts.ready : Promise.resolve()).then(reveal); }

  // ── scroll → progress, HUD, nav state, idle cue ─────────────────────────
  const bar = $('.progress');
  let idleT = 0;
  function onScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / max));
    bar.style.setProperty('--p', p);
    engine && engine.setProgress(p);
    engine && engine.setDim(scrollY > innerHeight * 0.5 ? 1 : 0);
    hudVals.forEach((el, i) => { try { el.textContent = hud[i].value(p); } catch (e) { el.textContent = '—'; } });
    root.classList.toggle('scrolled', scrollY > 40);
    root.classList.remove('idle'); clearTimeout(idleT);
    idleT = setTimeout(() => { if (scrollY < max - 10) root.classList.add('idle'); }, 2600);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const startAt = parseFloat(qs.get('u'));
  if (!isNaN(startAt)) requestAnimationFrame(() => { scrollTo(0, startAt * (document.documentElement.scrollHeight - innerHeight)); engine && engine.jump(startAt); onScroll(); });
  else scrollTo(0, 0);

  const secObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('.sec').forEach(s => secObs.observe(s));

  // ── reveal-on-view + counters ───────────────────────────────────────────
  function observe() {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      $$('[data-count]', e.target).forEach(countUp);
      if (e.target.matches('[data-count]')) countUp(e.target);
    }), { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  }
  function countUp(el) {
    const raw = el.dataset.count, m = raw.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!m || reduced) return;
    const to = parseFloat(m[2]), t0 = performance.now(), dur = 1400;
    const step = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = m[1] + (to % 1 ? (to * e).toFixed(1) : Math.round(to * e)) + m[3]; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // ── pointer: scene parallax, cursor, magnetic buttons, card tilt ────────
  const cur = $('#cursor');
  if (finePointer && level >= 600) root.classList.add('has-cursor');
  addEventListener('pointermove', e => {
    const nx = e.clientX / innerWidth * 2 - 1, ny = -(e.clientY / innerHeight * 2 - 1);
    engine && !MOBILE && engine.setPointer(nx, ny);
    if (cur) cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  }, { passive: true });
  document.addEventListener('pointerover', e => root.classList.toggle('hovering', !!e.target.closest('a,button,.card')));
  if (finePointer && level >= 500) {
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect();
        b.style.setProperty('--bx', (e.clientX - r.left - r.width / 2) * .25 + 'px'); b.style.setProperty('--by', (e.clientY - r.top - r.height / 2) * .35 + 'px'); });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
    });
    $$('.card').forEach(c => {
      c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--ry', (x - .5) * 8 + 'deg'); c.style.setProperty('--rx', (.5 - y) * 8 + 'deg');
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%'); });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }

  // ── copy email + toast ──────────────────────────────────────────────────
  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); };
  const cm = $('#copyMail');
  cm && cm.addEventListener('click', () => (navigator.clipboard ? navigator.clipboard.writeText(F.email) : Promise.reject()).then(() => toast('Email copied'), () => toast(F.email)));

  // ── PWA (installable on Android/desktop; offline after first visit) ─────
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !qs.has('nosw') && level >= 400)
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
})();
