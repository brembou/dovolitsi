/* Strom a třešeň podle ročního období na dalších místech webu (předloha Claude Design, projekt „Kudrlinky – další místa“).
   Patička, výzva u článků pro odběratelky, uvítací stránka /vitej-pod-tresni/. Oddělovače na úvodní stránce řeší jen CSS.
   Pravidla: místo na kresbu je rezervované v šabloně (aspect-ratio), kresba se stahuje až těsně před tím, než ji čtenářka
   uvidí, a vkládá se až po události load – nikdy nesoupeří s hlavní fotkou. Klidná verze: [data-anim] v index.css.
   Spouští se z assets/js/index.js (všechny stránky). */
const m = new Date().getMonth();
const season = m >= 2 && m <= 4 ? 'jaro' : m >= 5 && m <= 7 ? 'leto' : m >= 8 && m <= 10 ? 'podzim' : 'zima';

function afterLoad(fn) {
    const idle = () => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200));
    document.readyState === 'complete' ? idle() : window.addEventListener('load', idle, { once: true });
}

function draw(box) {
    // data-kd-src = {{asset "kudrlinky/<soubor>-jaro.svg"}} i s otiskem verze; jaro se nahradí aktuálním obdobím
    const url = box.dataset.kdSrc.replace('-jaro.svg', '-' + season + '.svg');
    let svg = null;
    let seen = false;
    let done = false;
    const put = () => { if (svg && seen && !done) { done = true; box.innerHTML = svg; } };
    const near = new IntersectionObserver((e) => {
        if (!e.some((x) => x.isIntersecting)) return;
        near.disconnect();
        fetch(url).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
            .then((t) => { svg = t; put(); })
            .catch((err) => { box.classList.add('kd-chyba'); console.warn('kudrlinky: ' + url, err); });
    }, { rootMargin: box.dataset.kdNear || '400px 0px' });
    // kreslit se začne, až je místo ze 40 % vidět – jednou, při dalším posouvání už jen stojí
    const vis = new IntersectionObserver((e) => {
        if (!e.some((x) => x.isIntersecting)) return;
        vis.disconnect();
        seen = true;
        put();
    }, { threshold: 0.4 });
    near.observe(box);
    vis.observe(box);
}

export function initKudrlinkyMista() {
    if (!('IntersectionObserver' in window) || !('fetch' in window)) return;
    const boxes = document.querySelectorAll('[data-kd-src].kd-misto');
    if (!boxes.length) return;
    document.documentElement.classList.add('kd-js');
    afterLoad(() => boxes.forEach((b) => { try { draw(b); } catch (e) { console.warn('kudrlinky:', e); } }));
}
