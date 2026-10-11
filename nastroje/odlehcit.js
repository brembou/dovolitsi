/* Odlehčení předgenerované kresby lavicka-<obdobi>.svg (2 500 prvků, ~97 kB gzip) na ~10 kB.
   1) květy/lístky (skupiny kd-pop) – ponechá se jen část (keep), deterministicky (stejný výsledek při každém spuštění)
   2) skupiny se seskupí do časových pásem po 0,3 s a v každém pásmu se cesty se stejným stylem slijí do jedné <path>
      → pár desítek prvků místo tisíců; animace pásma = kd-fade (vybarvení), kmen/větve/lavička si nechávají své kd-grow/rise2
   3) souřadnice se zaokrouhlí na mřížku q (0,5 jednotky viewBoxu ≈ 0,4 px na patičce) a přepíšou relativně
   white: true → bílá verze na terakotu (výplně květů zprůhlední, zůstane obrys – jako u bílého loga)
   anim: false → statická verze bez data-anim/animation (newsletter, náhledy)
   Běží v prohlížeči i v Node (potřebuje DOMParser – v Node přes linkedom/jsdom). */
const N = { M: 2, L: 2, C: 6, Q: 4, Z: 0 };
function relPath(d, q) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, qx = 0, qy = 0, out = '', cmd, first = true;
  const fmt = (v) => { v = Math.round(v * 10) / 10; let s = String(v); if (s.startsWith('0.')) s = s.slice(1); else if (s.startsWith('-0.')) s = '-' + s.slice(2); return s; };
  const join = (a) => a.map((s, j) => (j && s[0] !== '-' && !(s[0] === '.' && a[j - 1].includes('.')) ? ' ' : '') + s).join('');
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
    const U = cmd.toUpperCase(), isRel = cmd !== U, n = N[U];
    if (U === 'Z') { out += 'z'; cx = sx; cy = sy; qx = Math.round(sx / q) * q; qy = Math.round(sy / q) * q; continue; }
    const a = t.slice(i, i + n).map(Number); i += n;
    const abs = a.map((v, j) => (isRel ? v + (j % 2 ? cy : cx) : v));
    const QA = abs.map((v) => Math.round(v / q) * q);
    const r = first ? QA : QA.map((v, j) => v - (j % 2 ? qy : qx));
    out += (first ? 'M' : U.toLowerCase()) + join(r.map(fmt));
    first = false;
    cx = abs[n - 2]; cy = abs[n - 1]; qx = QA[n - 2]; qy = QA[n - 1];
    if (U === 'M') { sx = cx; sy = cy; cmd = isRel ? 'l' : 'L'; }
  }
  return out;
}
/* Body cesty jako seznam kotev (jen absolutní M/C/L/Q, tak je generátor zapisuje) */
function anchors(d) {
  const segs = [...d.matchAll(/([MCLQZ])([^MCLQZ]*)/g)].map((m) => [m[1], (m[2].match(/-?\d*\.?\d+/g) || []).map(Number)]);
  return segs;
}
const P = (p) => Math.round(p[0] * 100) / 100 + ' ' + Math.round(p[1] * 100) / 100;
function smoothClosed(pts) {
  const n = pts.length; let d = 'M' + P(pts[0]);
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += 'C' + P([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' + P([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + P(p2);
  }
  return d + 'Z';
}
/* Zjednodušení tvarů: okvětní lístek (C,C,L,L,C…) → 2 kvadratické oblouky + zářez; chomáč listí (≥7 C) → polovina kotev */
function zjednodusit(d) {
  const s = anchors(d);
  if (!s.length || s[0][0] !== 'M') return d;
  const ends = s.map(([c, a]) => (a.length >= 2 ? [a[a.length - 2], a[a.length - 1]] : null));
  const types = s.map((x) => x[0]).join('');
  if (/^MC+LLC+Z?$/.test(types)) {
    const iL = types.indexOf('L');
    const S = ends[0], P1 = ends[iL - 1], N = ends[iL], P2 = ends[iL + 1];
    const mid1 = ends[Math.max(1, Math.floor(iL / 2))], mid2 = ends[Math.min(ends.length - 2, iL + 1 + Math.ceil((types.length - iL - 2) / 2))];
    const c1 = [2 * mid1[0] - (S[0] + P1[0]) / 2, 2 * mid1[1] - (S[1] + P1[1]) / 2];
    const c2 = [2 * mid2[0] - (P2[0] + S[0]) / 2, 2 * mid2[1] - (P2[1] + S[1]) / 2];
    return 'M' + P(S) + 'Q' + P(c1) + ' ' + P(P1) + 'L' + P(N) + 'L' + P(P2) + 'Q' + P(c2) + ' ' + P(S) + 'Z';
  }
  if (/^MC{7,}Z$/.test(types)) {
    const pts = ends.slice(0, -1).filter((p, i) => i % 2 === 0);
    return smoothClosed(pts);
  }
  return d;
}
function odlehcit(src, { keep = 1, keepSoft = 0.5, simplify = true, q = 0.5, white = false, anim = true, seed = 7, id = 'kdk' } = {}) {
  const root = new DOMParser().parseFromString(src, 'image/svg+xml').documentElement;
  const out = [], bands = {};
  const col = (c) => (white && c && c !== 'none' ? '#fff' : c);
  const sigOf = (p) => {
    const st = p.getAttribute('stroke'), fill = p.getAttribute('fill');
    const f = white && fill === '#fff' && st ? 'none' : fill;
    return [col(st), p.getAttribute('stroke-width'), col(f), p.getAttribute('opacity'), p.getAttribute('fill-opacity'), p.getAttribute('stroke-linecap'), p.getAttribute('stroke-opacity')].join('|');
  };
  const emit = (map, style) => {
    let s = map.__uses || '';
    for (const [k, ds] of Object.entries(map)) {
      if (k === '__uses') continue;
      const [st, sw, fi, op, fo, lc, so] = k.split('|');
      s += `<path d="${ds.join('')}" fill="${fi || 'none'}"${st ? ` stroke="${st}" stroke-width="${sw}"` : ''}${so ? ` stroke-opacity="${so}"` : ''}${lc ? ' stroke-linecap="round" stroke-linejoin="round"' : ''}${op ? ` opacity="${op}"` : ''}${fo && fo !== '1' ? ` fill-opacity="${fo}"` : ''}/>`;
    }
    return anim && style ? `<g data-anim="" style="${style}">${s}</g>` : `<g>${s}</g>`;
  };
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  /* Květy: každý květ = 5 okvětních lístků + tečka uprostřed. Místo ~700 znaků na květ jeden <use> na sdílený
     symbol (vzatý z prvního květu kresby, tedy ručně kreslený), pootočený a zvětšený podle originálu. */
  let sym = null;
  const isPetal = (p) => p.getAttribute('fill') === '#fff' && p.getAttribute('stroke') && parseFloat(p.getAttribute('stroke-width')) < 0.5;
  const isDot = (p) => /l\.0\d 0"?$/.test(p.getAttribute('d')) || /l0?\.0\d 0$/.test(p.getAttribute('d'));
  const pathPts = (d) => (d.match(/-?\d*\.?\d+/g) || []).map(Number).reduce((a, v, i, arr) => (i % 2 ? a : a.concat([[v, arr[i + 1]]])), []);
  function blossoms(ps) {
    const dots = ps.filter(isDot).map((p) => { const n = pathPts(p.getAttribute('d')); return { c: n[0], petals: [], p }; });
    if (!dots.length) return { uses: '', rest: ps };
    const petals = ps.filter(isPetal);
    for (const pe of petals) {
      const s = pathPts(pe.getAttribute('d'))[0];
      let best = dots[0], bd = 1e9;
      for (const d of dots) { const dd = Math.hypot(d.c[0] - s[0], d.c[1] - s[1]); if (dd < bd) { bd = dd; best = d; } }
      best.petals.push(pe);
    }
    let uses = '';
    for (const b of dots) {
      if (!b.petals.length) continue;
      const pts = pathPts(b.petals[0].getAttribute('d'));
      let far = pts[0], fd = 0;
      for (const p of pts) { const dd = Math.hypot(p[0] - b.c[0], p[1] - b.c[1]); if (dd > fd) { fd = dd; far = p; } }
      const ang = Math.atan2(far[1] - b.c[1], far[0] - b.c[0]);
      if (!sym) {
        const ca = Math.cos(-ang), sa = Math.sin(-ang);
        const norm = (d) => d.replace(/(-?\d*\.?\d+)[ ,](-?\d*\.?\d+)/g, (m, x, y) => {
          const dx = (x - b.c[0]) / fd, dy = (y - b.c[1]) / fd;
          return (Math.round((dx * ca - dy * sa) * 100) / 100) + ' ' + (Math.round((dx * sa + dy * ca) * 100) / 100);
        });
        const pe0 = b.petals[0];
        const stc = white ? '#fff' : pe0.getAttribute('stroke');
        sym = { fd, html: `<symbol id="${id}" overflow="visible"><path d="${b.petals.map((p) => norm(p.getAttribute('d'))).join('')}" fill="${white ? 'none' : '#fff'}" stroke="${stc}" stroke-width="${(parseFloat(pe0.getAttribute('stroke-width')) / fd).toFixed(3)}"${!white && pe0.getAttribute('stroke-opacity') ? ` stroke-opacity="${pe0.getAttribute('stroke-opacity')}"` : ''}/><circle r="${(0.55 / fd).toFixed(3)}" fill="${white ? '#fff' : b.p.getAttribute('stroke')}"/></symbol>` };
      }
      const deg = Math.round(ang * 180 / Math.PI);
      const sc = Math.round(fd * 10) / 10;
      uses += `<use href="#${id}" transform="translate(${Math.round(b.c[0] * 2) / 2} ${Math.round(b.c[1] * 2) / 2})rotate(${deg})scale(${sc})"/>`;
    }
    return { uses, rest: ps.filter((p) => !isPetal(p) && !isDot(p)) };
  }
  for (const g of [...root.children]) {
    const st = g.getAttribute('style') || '';
    const m = st.match(/animation:(kd-[\w]+) ([\d.]+)s (.+?) ([\d.]+)s/);
    const kind = m ? m[1] : null;
    const ps = [...g.querySelectorAll('path')];
    if (kind === 'kd-pop' || (ps.length > 6 && kind !== 'kd-fade')) {
      if (rnd() > keep) continue;
      const key = (Math.round(parseFloat(m ? m[4] : 2) / 0.3) * 0.3).toFixed(1);
      const b = bands[key] || (bands[key] = {});
      const bl = blossoms(ps);
      if (bl.uses) b.__uses = (b.__uses || '') + bl.uses;
      for (const p of bl.rest) {
        const fo = parseFloat(p.getAttribute('fill-opacity') || '1');
        if (fo < 1 && rnd() > keepSoft) continue; // průsvitné druhé lístky – polovina stačí
        const d0 = p.getAttribute('d');
        const k = sigOf(p); (b[k] || (b[k] = [])).push(relPath(simplify ? zjednodusit(d0) : d0, q));
      }
      continue;
    }
    const map = {};
    for (const p of ps) { const k = sigOf(p); (map[k] || (map[k] = [])).push(relPath(p.getAttribute('d'), q)); }
    out.push(emit(map, st));
  }
  for (const t of Object.keys(bands).sort((a, b) => a - b)) out.push(emit(bands[t], `animation:kd-fade .6s ease ${t}s both`));
  return `<svg viewBox="${root.getAttribute('viewBox')}" width="100%" style="display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${sym ? '<defs>' + sym.html + '</defs>' : ''}${out.join('')}</svg>`;
}
if (typeof module !== 'undefined') module.exports = { odlehcit, relPath };
