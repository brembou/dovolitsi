// Pozn.: 11. 10. 2026 vygenerováno stejnou logikou v headless Chromiu (prohlížečový DOMParser místo linkedom z npm).
// Vygeneruje odlehčené ilustrace z originálů v assets/kudrlinky/ (deterministicky – stejný výsledek při každém spuštění).
//   npm i -D linkedom   (jen pro tento skript)
//   node nastroje/generovat.mjs
// Výstup: assets/kudrlinky/paticka-<obdobi>.svg (bílá, patička), lavicka-lehka-<obdobi>.svg (výzva + uvítací stránka),
//         tresen-staticka-<obdobi>.svg (oddělovače na úvodní stránce, bez animace).
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import { DOMParser } from 'linkedom';
globalThis.DOMParser = DOMParser;
const { odlehcit, relPath } = createRequire(import.meta.url)('./odlehcit.js');

const DIR = 'assets/kudrlinky/';
const O = { keep: 0.8, keepSoft: 0.3, q: 0.75 };
const kb = (s) => (gzipSync(s).length / 1024).toFixed(1) + ' kB';
const count = (s) => (s.match(/<(path|g|use|circle)\b/g) || []).length;

function tresenStaticka(src) {
  const root = new DOMParser().parseFromString(src, 'image/svg+xml').documentElement;
  root.querySelectorAll('[data-anim-hide]').forEach((e) => e.remove());
  const order = [], map = {};
  const A = ['stroke', 'stroke-width', 'fill', 'opacity', 'fill-opacity', 'stroke-opacity', 'stroke-linecap'];
  for (const p of root.querySelectorAll('path')) {
    const k = A.map((n) => p.getAttribute(n) || '').join('|');
    if (!map[k]) { map[k] = []; order.push(k); }
    map[k].push(relPath(p.getAttribute('d'), 0.25));
  }
  let s = '';
  for (const k of order) {
    const [st, sw, fi, op, fo, so, lc] = k.split('|');
    s += `<path d="${map[k].join('')}" fill="${fi || 'none'}"${st ? ` stroke="${st}" stroke-width="${sw}"` : ''}${lc ? ' stroke-linecap="round" stroke-linejoin="round"' : ''}${op ? ` opacity="${op}"` : ''}${fo && fo !== '1' ? ` fill-opacity="${fo}"` : ''}${so ? ` stroke-opacity="${so}"` : ''}/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${root.getAttribute('viewBox')}" width="160" height="134">${s}</svg>`;
}

for (const se of ['jaro', 'leto', 'podzim', 'zima']) {
  const lav = readFileSync(DIR + `lavicka-${se}.svg`, 'utf8');
  const out = {
    [`lavicka-lehka-${se}.svg`]: odlehcit(lav, { ...O, id: 'kdk' }),
    [`paticka-${se}.svg`]: odlehcit(lav, { ...O, white: true, id: 'kdw' }),
    [`tresen-staticka-${se}.svg`]: tresenStaticka(readFileSync(DIR + `tresen-${se}.svg`, 'utf8')),
  };
  console.log(`lavicka-${se}.svg  ${kb(lav)}  ${count(lav)} prvků`);
  for (const [name, svg] of Object.entries(out)) {
    writeFileSync(DIR + name, svg);
    console.log(`  → ${name}  ${kb(svg)}  ${count(svg)} prvků`);
  }
}
