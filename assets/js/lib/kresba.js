/* Kresba větvičky (čtecí lišta) a padajících lístků za běhu – závisí na šířce okna, proto se negeneruje předem.
   Výňatek z generátoru ilustrací kudrlinky.js z Claude Design (projekt „dovolit.si — web“), funkce beze změny
   (setTwig nahrazuje rychlejší paintTwig v kudrlinky.js);
   ostatní ilustrace (třešeň, lavička, podpis, šálky) jsou předgenerované v assets/kudrlinky/. */
const GRN = '#6F8A4E', INK = '#C46542', CH = '#9D2235', TXT = '#111827', P1 = '#F5CFC6', P2 = '#F9DFD2', P3 = '#FBEBDD', LT = '#E09A72', SNOW = '#9CA3AF';
let R = Math.random, A = false, UID = 0;
function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rr = (a, b) => a + (b - a) * R(), f = n => Math.round(n * 100) / 100, pick = a => a[Math.floor(R() * a.length)];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]], rot = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
const pt = p => f(p[0]) + ' ' + f(p[1]);
function smooth(pts, closed) {
  const n = pts.length; if (n < 2) return '';
  let d = 'M' + pt(pts[0]);
  const g = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    d += 'C' + pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' + pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + pt(p2);
  }
  return d + (closed ? 'Z' : '');
}
function an(kind, t, dur, ease, extra) { return ` data-anim="" style="animation:${kind} ${f(dur)}s ${ease || 'cubic-bezier(.45,.05,.3,1)'} ${f(t)}s ${extra || 'both'}"`; }
function ln(d, o) {
  o = o || {};
  return `<path d="${d}" fill="none" stroke="${o.c || INK}" stroke-width="${o.w || 1}" stroke-linecap="round" stroke-linejoin="round"${o.op != null ? ` opacity="${o.op}"` : ''}${A && o.t != null ? ' pathLength="1"' + an('kd-draw', o.t, o.dur || .6) : ''}/>`;
}
function fl(d, fill, o) { o = o || {}; return `<path d="${d}" fill="${fill}"${o.op != null ? ` fill-opacity="${o.op}"` : ''}${A && o.t != null ? an('kd-fade', o.t, o.dur || .5, 'ease') : ''}/>`; }
function grp(inner, o) {
  o = o || {};
  if (!A) return o.hide ? '' : `<g>${inner}</g>`;
  if (!o.kind) return `<g>${inner}</g>`;
  const origin = o.originPx ? `transform-box:view-box;transform-origin:${f(o.originPx[0])}px ${f(o.originPx[1])}px` : `transform-box:fill-box;transform-origin:${o.origin || 'center'}`;
  return `<g data-anim=""${o.hide ? ' data-anim-hide=""' : ''} style="${origin};animation:${o.kind} ${f(o.dur || .6)}s ${o.ease || 'cubic-bezier(.2,.7,.3,1)'} ${f(o.t || 0)}s ${o.extra || 'both'}">${inner}</g>`;
}
function sk(pts, o) {
  o = o || {}; const j = o.j != null ? o.j : .3;
  let s = ln(smooth(pts.map(p => [p[0] + rr(-j, j), p[1] + rr(-j, j)])), o);
  if (o.hair !== false) s += ln(smooth(pts.map(p => [p[0] + rr(-j, j) * 1.7, p[1] + rr(-j, j) * 1.7])), Object.assign({}, o, { w: (o.w || 1) * .45, op: .55, t: o.t != null ? o.t + .08 : null }));
  return s;
}
function leaf(b, ang, L, W, o) {
  o = o || {}; const t = o.t; const a = ang * Math.PI / 180; const c = o.c || INK;
  const T = p => { const r = rot(p, a); return [b[0] + r[0], b[1] + r[1]]; };
  const w1 = W * rr(.9, 1.1), w2 = W * rr(.9, 1.1), bend = rr(-.12, .12) * W;
  const d = `M${pt(T([0, 0]))}C${pt(T([L * .22, -w1 * 1.05]))} ${pt(T([L * .68, -w1 * .9]))} ${pt(T([L, bend]))}C${pt(T([L * .7, w2 * .85]))} ${pt(T([L * .25, w2 * 1.05]))} ${pt(T([0, 0]))}Z`;
  let s = '';
  if (o.fill) s += fl(d, o.fill, { op: o.fop != null ? o.fop : 1, t: t != null ? t + .25 : null, dur: .6 });
  s += ln(d, { w: o.w || .8, c, t, dur: .55 });
  s += ln(smooth([T([0, 0]), T([L * .5, bend * .5 - .3]), T([L * .9, bend * .9])]), { w: .5, c, t: t != null ? t + .15 : null, dur: .4 });
  if (o.veins !== false) {
    const nv = Math.max(2, Math.round(L / 7));
    for (let k = 1; k <= nv; k++) {
      const s0 = k / (nv + 1.3), prof = Math.sin(Math.PI * Math.min(.95, s0 + .12));
      for (const sg of [-1, 1]) {
        const st = T([L * s0, bend * s0]), en = T([L * (s0 + .14), sg * (sg < 0 ? w1 : w2) * prof * .78 + bend * s0]);
        s += ln(`M${pt(st)}Q${pt(T([L * (s0 + .05), sg * W * .35 * prof + bend * s0]))} ${pt(en)}`, { w: .35, op: .8, c, t: t != null ? t + .3 + k * .04 : null, dur: .2 });
      }
    }
  }
  return s;
}
function petalD(c, r, a, w) {
  const T = p => { const q = rot(p, a); return [c[0] + q[0], c[1] + q[1]]; }; const n = rr(.08, .15) * r;
  return `M${pt(T([r * .08, 0]))}C${pt(T([r * .25, -r * .5 * w]))} ${pt(T([r * .9, -r * .62 * w]))} ${pt(T([r, -r * .14]))}L${pt(T([r - n, 0]))}L${pt(T([r, r * .14]))}C${pt(T([r * .9, r * .62 * w]))} ${pt(T([r * .25, r * .5 * w]))} ${pt(T([r * .08, 0]))}Z`;
}
function blossom(c, r, o) {
  o = o || {}; const t = o.t || 0; const a0 = rr(0, Math.PI * 2); let s = '';
  for (let k = 0; k < 5; k++) {
    const a = a0 + k * Math.PI * 2 / 5 + rr(-.12, .12), rk = r * rr(.9, 1.06), d = petalD(c, rk, a, rr(.85, 1));
    s += `<path d="${d}" fill="${k % 2 ? P3 : '#fff'}"/>`;
    s += `<path d="${petalD(c, rk * .5, a, .7)}" fill="${P1}" fill-opacity=".85"/>`;
    s += ln(d, { w: .55, c: CH, op: .9, t: t + k * .05, dur: .45 });
    s += ln(`M${pt(add(c, rot([r * .2, 0], a)))}L${pt(add(c, rot([rk * .6, rr(-.6, .6)], a)))}`, { w: .3, c: CH, op: .45, t: t + .3, dur: .2 });
  }
  for (let k = 0; k < 9; k++) {
    const a = rr(0, Math.PI * 2), l = r * rr(.3, .48), e = add(c, rot([l, 0], a));
    s += ln(`M${pt(add(c, rot([r * .08, 0], a)))}Q${pt(add(c, rot([l * .6, rr(-.8, .8)], a)))} ${pt(e)}`, { w: .35, c: INK, t: t + .4, dur: .2 });
    s += `<path d="M${pt(e)}l.01 0" stroke="${CH}" stroke-width="1.3" stroke-linecap="round"/>`;
  }
  return grp(s, { kind: 'kd-bloom', t, dur: .8 });
}
function fruit(c, r, o) {
  o = o || {}; const t = o.t || 0, pts = [], n = 10;
  for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / n; let rk = r * rr(.97, 1.03); if (k === 0) rk = r * .8; pts.push([c[0] + Math.cos(a) * rk * 1.04, c[1] + Math.sin(a) * rk]); }
  const d = smooth(pts, true); let s = `<path d="${d}" fill="${CH}"/>`;
  const nn = [.707, .707], v = [-.707, .707];
  for (let u = .22; u < .95; u += .11) { const h = Math.sqrt(1 - u * u) * r * .86, m = [c[0] + nn[0] * u * r, c[1] + nn[1] * u * r]; s += ln(`M${pt([m[0] - v[0] * h, m[1] - v[1] * h])}L${pt([m[0] + v[0] * h, m[1] + v[1] * h])}`, { w: Math.max(.35, r * .04), c: TXT, op: .4 }); }
  s += ln(d, { w: Math.max(.45, r * .06), c: TXT, op: .6 });
  s += ln(smooth([[c[0] - r * .58, c[1] - r * .02], [c[0] - r * .48, c[1] - r * .42], [c[0] - r * .16, c[1] - r * .6]]), { w: Math.max(.5, r * .1), c: '#fff', op: .9 });
  s += `<path d="M${pt([c[0] - r * .62, c[1] + r * .16])}l.01 0" stroke="#fff" stroke-width="${f(Math.max(.6, r * .09))}" stroke-linecap="round" opacity=".8"/>`;
  return grp(s, { kind: 'kd-pop', t, dur: .6 });
}
function flake(c, sz, o) {
  o = o || {}; let d = ''; const a0 = rr(0, 1);
  for (let k = 0; k < 3; k++) {
    const a = a0 + k * Math.PI / 3; d += `M${pt(add(c, rot([sz, 0], a)))}L${pt(add(c, rot([-sz, 0], a)))}`;
    for (const sg of [1, -1]) { const m = add(c, rot([sg * sz * .55, 0], a)); d += `M${pt(m)}l${pt(rot([sg * sz * .28, sz * .26], a))}M${pt(m)}l${pt(rot([sg * sz * .28, -sz * .26], a))}`; }
  }
  return ln(d, { w: o.w || .55, c: o.c || SNOW });
}

/* 3 · větvička místo čtecí lišty */
function twigBar(W) {
  R = rng(77); A = false; W = Math.max(200, Math.round(W));
  const yAt = x => 6 + Math.sin(x / 61) * 1.3 + Math.sin(x / 19 + 1) * .45;
  const pts = []; for (let x = -2; x <= W + 22; x += 20) pts.push([Math.min(x, W + 2), yAt(x)]);
  const d = smooth(pts), d2 = smooth(pts.map(p => [p[0], p[1] + .7]));
  let s = `<path d="${d}" fill="none" stroke="#e5e7eb" stroke-width="1" stroke-linecap="round"/>`;
  s += `<path data-tw-line="" d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
  s += `<path data-tw-line="" d="${d2}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none" stroke="${INK}" stroke-width=".5" opacity=".6" stroke-linecap="round"/>`;
  const gap = W < 600 ? 34 : 46; let i = 0;
  for (let x = gap * .7; x < W - 34; x += gap * rr(.8, 1.2)) {
    const up = i % 2 === 0, b = [x, yAt(x) + (up ? -.6 : .6)], isB = i % 4 === 3;
    const inner = isB ? blossom([x + 2, up ? b[1] - 3 : b[1] + 3.6], 3, {}) : leaf(b, up ? rr(-70, -40) : rr(35, 60), rr(5.5, 7), 2.1, { fill: INK, fop: .25, w: .6, veins: false });
    s += `<g data-tw="${f(x / W)}" style="opacity:0;transform:scale(.2);transform-box:fill-box;transform-origin:${up ? '0% 100%' : '0% 0%'};transition:opacity .35s ease,transform .6s cubic-bezier(.2,.9,.3,1.4)">${inner}</g>`; i++;
  }
  const ex = W - 16, ey = yAt(ex);
  const c = sk([[ex, ey], [ex - 3, ey + 3], [ex - 5, ey + 5.6]], { w: .7, hair: false, j: .05 }) + sk([[ex, ey], [ex + 2.6, ey + 3.3], [ex + 4, ey + 6.2]], { w: .7, hair: false, j: .05 }) + fruit([ex - 5, ey + 7.6], 2.5, {}) + fruit([ex + 4, ey + 8.2], 2.6, {}) + leaf([ex, ey], -35, 7, 2.2, { fill: INK, fop: .25, w: .5, veins: false });
  s += `<g data-tw="1" style="opacity:0;transform:scale(.2);transform-box:fill-box;transform-origin:50% 0%;transition:opacity .35s ease,transform .7s cubic-bezier(.2,.9,.3,1.5)">${c}</g>`;
  return `<svg width="${W}" height="16" viewBox="0 0 ${W} 16" style="display:block;overflow:visible" aria-hidden="true">${s}</svg>`;
}

/* 2 · lístky při dočtení */
function shape(season, sz, rot0) {
  A = false; let inner;
  if (season === 'jaro') { const d = petalD([2, 10], 16, 0, 1); inner = `<path d="${d}" fill="${pick(['#fff', P3, P2])}"/><path d="${petalD([2, 10], 8, 0, .7)}" fill="${P1}"/>` + ln(d, { w: .8, c: CH }); }
  else if (season === 'leto') inner = leaf([2, 10], 0, 16, 4.6, { fill: GRN, fop: .35, w: .9, c: GRN });
  else if (season === 'podzim') inner = leaf([2, 10], 0, 16, 4.8, { fill: pick([INK, LT, CH, LT]), fop: .75, w: .9 });
  else inner = flake([10, 10], 8, { w: 1, c: SNOW });
  return `<svg width="${f(sz)}" height="${f(sz)}" viewBox="0 0 20 20" style="display:block;overflow:visible;transform:rotate(${f(rot0 || 0)}deg)">${inner}</svg>`;
}
function petals(season, W, H) {
  R = rng(Math.floor(Math.random() * 1e6)); const n = W < 500 ? 7 : 10; let h = '';
  for (let i = 0; i < n; i++) {
    const x = i % 2 ? rr(W * .74, W * .95) : rr(W * .03, W * .26), del = rr(0, 1.4), dur = rr(3.8, 5.2), fd = rr(.9, 1.4), sz = rr(11, 16);
    h += `<div data-anim="" data-anim-hide="" style="position:absolute;left:${f(x)}px;top:-18px;--dx:${f(rr(-36, 36))}px;--fy:${f(H)}px;animation:kd-fall ${f(dur)}s cubic-bezier(.35,.1,.6,1) ${f(del)}s both"><div data-anim="" style="animation:kd-flutter ${f(fd)}s ease-in-out ${f(del)}s ${Math.ceil(dur / fd)} alternate both">${shape(season, sz, rr(0, 360))}</div></div>`;
  }
  return h;
}
function petalsStatic(season, W) {
  R = rng(5); const pos = [[.08, 8, 30], [.15, 14, -40], [.88, 10, 120]];
  return pos.map(([x, y, r]) => `<div style="position:absolute;left:${f(W * x)}px;top:${y}px">${shape(season, 16, r)}</div>`).join('');
}
function season(d) { const m = (d || new Date()).getMonth(); return m >= 2 && m <= 4 ? 'jaro' : m >= 5 && m <= 7 ? 'leto' : m >= 8 && m <= 10 ? 'podzim' : 'zima'; }

export { twigBar, petals, petalsStatic, season };
