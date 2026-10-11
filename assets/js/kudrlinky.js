/* Kudrlinky dovolit.si – podle předlohy z Claude Design (projekt „dovolit.si — web“, handoff Kudrlinky).
   Pravidla rychlosti: nic neblokuje vykreslení článku; velké ilustrace se stahují až těsně před tím, než je čtenářka
   uvidí (třešeň, podpis) nebo až když jsou potřeba (lavička po přihlášení, poděkování za reakci); nic nemění výšku
   stránky po načtení (místo je rezervované předem, nebo prvek leží jako vrstva / plovoucí lišta).
   Omezené animace (prefers-reduced-motion) řeší CSS v assets/css/index.css: kresba se jen postupně prolne, bez pohybu. */
import { twigBar, petals, petalsStatic, season as seasonFor } from './lib/kresba.js';

const article = document.querySelector('.gh-article[data-kd-assets]');
const content = document.querySelector('.gh-content');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const season = seasonFor(new Date());
const svgCache = {};

function assetUrl(name) {
    // data-kd-assets nese adresu jednoho souboru i s otiskem verze (?v=…), ostatní soubory leží vedle
    return article.dataset.kdAssets.replace('tresen-jaro.svg', name);
}

function loadSvg(name) {
    if (!svgCache[name]) {
        svgCache[name] = fetch(assetUrl(name)).then((r) => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.text();
        });
        // chybu zalogovat, kudrlinka se pak prostě nezobrazí
        svgCache[name].catch((e) => console.warn('kudrlinky: ' + name, e));
    }
    return svgCache[name];
}

function onVisible(el, opts, fn) {
    const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            fn();
        }
    }, opts);
    io.observe(el);
}

function storageGet(store, key) {
    try { return store.getItem(key); } catch (e) { return null; }
}
function storageSet(store, key, value) {
    try { value === null ? store.removeItem(key) : store.setItem(key, value); } catch (e) { /* soukromý režim */ }
}

/* Konec článku pro větvičku a „vítej zpátky“: podpis, jinak banner odběru, jinak oddělovač s třešní */
const articleEnd = content && (document.querySelector('.kd-podpis')
    || content.querySelector(':scope > .grad-bg')
    || document.querySelector('.divider-cherry'));

/* Rozměry stránky se čtou jen při změně velikosti (ResizeObserver), ne při každém snímku posouvání –
   čtení polohy prvku během posouvání nutí prohlížeč přepočítat rozvržení, dokud se načítají fotky */
const geo = { endY: 0, docH: 0, winH: 0 };
function measure() {
    geo.winH = window.innerHeight;
    geo.docH = document.documentElement.scrollHeight;
    geo.endY = articleEnd ? articleEnd.getBoundingClientRect().bottom + window.scrollY : geo.docH;
}

function articleProgress() {
    const span = geo.endY - geo.winH;
    return span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 1;
}

/* 1 · třešeň podle ročního období v oddělovači pod článkem */
function initCherry() {
    const divider = document.querySelector('.divider-cherry');
    if (!divider) return;
    onVisible(divider, { rootMargin: '600px 0px' }, () => {
        loadSvg('tresen-' + season + '.svg').then((svg) => {
            const box = document.createElement('div');
            box.className = 'kd-tresen';
            divider.classList.add('kd-tresen-on');
            divider.appendChild(box);
            // kreslit začne, až je ilustrace ze 30 % vidět, ať se nepřehraje mimo obraz
            onVisible(box, { threshold: 0.3 }, () => { box.innerHTML = svg; });
        }).catch(() => {});
    });
}

/* 2 · lístky při dočtení (banner odběru), jednou za návštěvu */
function initPetals() {
    const banner = content && content.querySelector(':scope > .grad-bg');
    if (!banner) return;
    onVisible(banner, { threshold: 0.3 }, () => {
        if (!reduce && storageGet(sessionStorage, 'kd-petals')) return;
        const layer = document.createElement('div');
        layer.className = 'kd-listky';
        layer.innerHTML = reduce ? petalsStatic(season, banner.clientWidth) : petals(season, banner.clientWidth, banner.clientHeight);
        banner.insertBefore(layer, banner.firstChild);
        if (!reduce) {
            storageSet(sessionStorage, 'kd-petals', '1');
            setTimeout(() => layer.remove(), 8000);
        }
    });
}

/* 3 · větvička místo čtecí lišty + 8 · vítej zpátky (sdílí jeden posluchač posouvání) */
function initScroll() {
    const bar = document.querySelector('.kd-vetvicka');
    const action = document.querySelector('.progress-action');
    const posKey = article && 'kd-pos-' + article.dataset.postId;
    let svg = null;
    let width = 0;
    let queued = false;
    let saveTimer = 0;

    let lines = [];
    let twigs = [];
    let lastP = -1;

    function draw() {
        if (!bar || window.innerWidth === width) return;
        width = window.innerWidth;
        bar.innerHTML = twigBar(width);
        svg = bar.firstChild;
        // stejné jako setTwig z předlohy, jen bez hledání prvků při každém posunu a se zápisem jen při změně
        lines = [...svg.querySelectorAll('[data-tw-line]')];
        twigs = [...svg.querySelectorAll('[data-tw]')].map((g) => ({ g, t: +g.getAttribute('data-tw'), on: false }));
        lastP = -1;
    }

    function paintTwig(p) {
        if (Math.abs(p - lastP) < 0.001) return;
        lastP = p;
        const offset = String(Math.round((1 - p) * 1000) / 1000);
        lines.forEach((l) => l.setAttribute('stroke-dashoffset', offset));
        twigs.forEach((tw) => {
            const on = tw.t >= 1 ? p >= 0.995 : p >= tw.t;
            if (on === tw.on) return;
            tw.on = on;
            tw.g.style.opacity = on ? 1 : 0;
            tw.g.style.transform = on ? 'none' : 'scale(.2)';
        });
    }

    function update() {
        queued = false;
        const p = articleProgress();
        if (svg) paintTwig(p);
        if (action) {
            const whole = window.scrollY / Math.max(1, geo.docH - geo.winH);
            action.classList.toggle('progress-active', whole >= 0.45 && whole <= 0.85);
        }
        if (posKey) {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => {
                if (p > 0.9) storageSet(localStorage, posKey, null);
                else if (p > 0.02) storageSet(localStorage, posKey, p.toFixed(3));
            }, 500);
        }
    }

    function schedule() {
        if (!queued) {
            queued = true;
            requestAnimationFrame(update);
        }
    }

    measure();
    if (bar && articleEnd) draw();
    new ResizeObserver(() => { measure(); schedule(); }).observe(document.body);
    window.addEventListener('resize', () => { measure(); draw(); schedule(); }, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    schedule();

    if (posKey) welcomeBack(parseFloat(storageGet(localStorage, posKey)));
}

function welcomeBack(saved) {
    if (!(saved >= 0.15 && saved <= 0.9) || location.hash) return;
    setTimeout(() => {
        if (window.scrollY > 200) return; // čtenářka už sama posouvá
        const box = document.createElement('div');
        box.className = 'kd-zpatky';
        box.setAttribute('role', 'status');
        box.innerHTML = '<div class="kd-zpatky__text"><strong class="font-display">Vítej zpátky</strong>'
            + '<span>Minule jsi skončila kousek dál.</span></div>'
            + '<button type="button" class="kd-zpatky__dal macaw-button font-display">Pokračovat</button>'
            + '<button type="button" class="kd-zpatky__zavrit" aria-label="Zavřít">×</button>';
        document.body.appendChild(box);
        requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('kd-zpatky--on')));
        const close = () => {
            box.classList.remove('kd-zpatky--on');
            setTimeout(() => box.remove(), 600);
        };
        box.querySelector('.kd-zpatky__dal').addEventListener('click', () => {
            measure();
            window.scrollTo({ top: Math.max(0, saved * (geo.endY - geo.winH) - 120), behavior: reduce ? 'auto' : 'smooth' });
            close();
        });
        box.querySelector('.kd-zpatky__zavrit').addEventListener('click', close);
        setTimeout(close, 10000);
    }, 1200);
}

/* 4 · lavička po přihlášení k odběru – vrstva přes banner, výška stránky se nemění */
function initBench() {
    const banner = content && content.querySelector(':scope > .grad-bg');
    const form = banner && banner.querySelector('form[data-members-form]');
    if (!form) return;
    const name = 'lavicka-' + season + '.svg';
    const email = form.querySelector('[data-members-email]');
    if (email) email.addEventListener('focus', () => loadSvg(name), { once: true });
    const mo = new MutationObserver(() => {
        if (!form.classList.contains('success')) return;
        mo.disconnect();
        const message = form.querySelector('.macaw-success-message');
        loadSvg(name).then((svg) => {
            const layer = document.createElement('div');
            layer.className = 'kd-lavicka';
            layer.setAttribute('role', 'status');
            layer.innerHTML = '<div class="kd-lavicka__kresba"></div>'
                + '<p class="kd-lavicka__nadpis font-display">Místo na lavičce je tvoje</p>'
                + '<p class="kd-lavicka__text"></p>';
            layer.querySelector('.kd-lavicka__text').textContent = message ? message.textContent.trim() : '';
            const room = banner.clientHeight - 150; // místo na kresbu po odečtení nadpisu a textu
            const drawing = layer.querySelector('.kd-lavicka__kresba');
            drawing.style.width = Math.max(120, Math.min(240, room * 1.2)) + 'px';
            drawing.innerHTML = svg;
            banner.appendChild(layer);
        }).catch(() => {});
    });
    mo.observe(form, { attributes: true, attributeFilter: ['class'] });
}

/* 6 · podpis Martiny – dopíše se, až k němu čtenářka dojede */
const PODPIS = '<svg viewBox="11 41 887 268" width="100%" style="display:block;overflow:visible" aria-hidden="true">'
    + '<defs><mask id="kd-podpis-maska" maskUnits="userSpaceOnUse" x="0" y="0" width="905" height="349">'
    + '<path d="M10 225C50 150 110 60 182 8L190 70L172 225" fill="none" stroke="#fff" stroke-width="75" stroke-linecap="round" stroke-linejoin="round" pathLength="1" data-anim="" style="animation:kd-draw .7s cubic-bezier(.45,.1,.4,1) .2s both"/>'
    + '<path d="M150 235C260 230 400 240 520 235S700 245 770 250" fill="none" stroke="#fff" stroke-width="210" stroke-linecap="round" stroke-linejoin="round" pathLength="1" data-anim="" style="animation:kd-draw 1.4s cubic-bezier(.45,.1,.4,1) .85s both"/>'
    + '<path d="M720 330C800 320 880 250 892 125" fill="none" stroke="#fff" stroke-width="60" stroke-linecap="round" stroke-linejoin="round" pathLength="1" data-anim="" style="animation:kd-draw .55s cubic-bezier(.45,.1,.4,1) 2.2s both"/>'
    + '</mask></defs><g transform="rotate(-8.5 452 175)"><g mask="url(#kd-podpis-maska)">'
    + '<image href="__PODPIS__" x="0" y="0" width="905" height="349" preserveAspectRatio="none"/></g></g></svg>';

function initSignature() {
    const box = document.querySelector('.kd-podpis__plocha');
    if (!box) return;
    let ready = null;
    onVisible(box, { rootMargin: '600px 0px' }, () => {
        const src = assetUrl('podpis-martina.webp');
        const img = new Image();
        img.src = src;
        ready = img.decode().then(() => src);
        ready.catch((e) => console.warn('kudrlinky: podpis', e));
    });
    onVisible(box, { threshold: 0.6 }, () => {
        (ready || Promise.reject(new Error('podpis nenačten'))).then((src) => {
            box.innerHTML = PODPIS.replace('__PODPIS__', src);
        }).catch(() => {});
    });
}

/* 9 · sdílet citát */
function initQuote() {
    if (!content) return;
    let pill = null;
    let timer = 0;
    let text = '';

    function hide() {
        if (pill) pill.classList.remove('kd-citat--on');
    }
    function place() {
        const sel = window.getSelection();
        if (!pill || !sel.rangeCount) return;
        const r = sel.getRangeAt(0).getBoundingClientRect();
        const w = pill.offsetWidth;
        const x = Math.min(window.innerWidth - w - 10, Math.max(10, r.left + r.width / 2 - w / 2));
        pill.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(r.bottom + 10) + 'px)';
    }
    function toast(msg) {
        const t = document.createElement('div');
        t.className = 'kd-toast';
        t.setAttribute('role', 'status');
        t.textContent = msg;
        document.body.appendChild(t);
        requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('kd-toast--on')));
        setTimeout(() => { t.classList.remove('kd-toast--on'); setTimeout(() => t.remove(), 400); }, 2400);
    }
    function share() {
        const canonical = document.querySelector('link[rel="canonical"]');
        const base = (canonical ? canonical.href : location.href).split('#')[0];
        const url = base + '#:~:text=' + encodeURIComponent(text.split(/\s+/).slice(0, 8).join(' '));
        window.getSelection().removeAllRanges();
        hide();
        if (navigator.share) {
            navigator.share({ text: '„' + text + '“', url }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => toast('Odkaz na citát máš ve schránce')).catch(() => {});
        }
    }

    document.addEventListener('selectionchange', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const sel = window.getSelection();
            const t = sel.toString().trim().replace(/\s+/g, ' ');
            const inside = sel.rangeCount && content.contains(sel.anchorNode) && content.contains(sel.focusNode);
            if (!inside || t.split(' ').length < 3) return hide();
            text = t;
            if (!pill) {
                pill = document.createElement('button');
                pill.type = 'button';
                pill.className = 'kd-citat font-display';
                pill.textContent = 'Sdílet citát';
                pill.addEventListener('mousedown', (e) => e.preventDefault());
                pill.addEventListener('click', share);
                document.body.appendChild(pill);
            }
            pill.classList.add('kd-citat--on');
            place();
        }, 150);
    });
    window.addEventListener('scroll', () => { if (pill && pill.classList.contains('kd-citat--on')) place(); }, { passive: true });
}

/* 10 · poděkování za reakci (Hyvor posílá událost „reaction“) – plovoucí, nic neposouvá */
function initThanks() {
    const comments = document.querySelector('hyvor-talk-comments');
    if (!comments) return;
    let box = null;
    let timer = 0;
    comments.addEventListener('reaction', () => {
        loadSvg('mini.svg').then((svg) => {
            if (invite(svg)) return;
            if (!box) {
                box = document.createElement('div');
                box.className = 'kd-dik';
                box.setAttribute('role', 'status');
                box.innerHTML = '<div class="kd-dik__kresba"></div><span class="font-display">Děkuju, že sis přisedla.</span>';
                document.body.appendChild(box);
            }
            box.querySelector('.kd-dik__kresba').innerHTML = svg; // znovu vložit = znovu nakreslit
            requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('kd-dik--on')));
            clearTimeout(timer);
            timer = setTimeout(() => box.classList.remove('kd-dik--on'), 4500);
        }).catch(() => {});
    });
}

/* 10b · pozvánka k odběru po reakci: místo krátkého poděkování plovoucí karta s tlačítkem (stejná jako „vítej zpátky“,
   leží přes stránku, čtený text se neposune). Jen nečlenkám, v jednom prohlížeči nanejvýš jednou, nikdy současně
   s „vítej zpátky“ a ne po odběru v téže návštěvě. Tlačítko otevře přihlášení Ghostu (Portal) přes #/portal/signup. */
const INVITE_KEY = 'kd-pozvanka-reakce';
function invite(svg) {
    if (!article || article.hasAttribute('data-kd-clen')) return false;
    if (storageGet(localStorage, INVITE_KEY) || document.querySelector('form[data-members-form].success')) return false;
    if (document.querySelector('.kd-zpatky--on')) return false;
    storageSet(localStorage, INVITE_KEY, '1');
    const card = document.createElement('div');
    card.className = 'kd-zpatky kd-dik-pozvanka';
    card.setAttribute('role', 'status');
    card.innerHTML = '<div class="kd-dik__kresba"></div>'
        + '<div class="kd-zpatky__text"><strong class="font-display">Děkuju, že sis přisedla.</strong>'
        + '<span>Chceš, ať ti příští dopis přijde rovnou do schránky?</span></div>'
        + '<a class="kd-zpatky__dal font-display" href="#/portal/signup">Chci</a>'
        + '<button type="button" class="kd-zpatky__zavrit" aria-label="Zavřít">×</button>';
    card.querySelector('.kd-dik__kresba').innerHTML = svg;
    const close = () => {
        card.classList.remove('kd-zpatky--on');
        setTimeout(() => card.remove(), 600);
    };
    card.querySelector('.kd-zpatky__zavrit').addEventListener('click', close);
    card.querySelector('.kd-zpatky__dal').addEventListener('click', () => setTimeout(close, 300));
    document.body.appendChild(card);
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('kd-zpatky--on')));
    setTimeout(close, 20000);
    return true;
}

/* Reakce „Jaký pocit ti zůstal po dočtení?“ vždy v jednom řádku. Blok kreslí Hyvor do otevřeného shadow DOM:
   pět tlačítek po 70 px a mezery 4 px se na telefon (352 px) nevešly a „Rozpor“ zůstal sám na dalším řádku. Zalamování
   je vypnuté a na úzkém displeji se zmenší jen boční okraje tlačítek, popisky zůstanou celé. */
function initReactionsRow() {
    if (!window.customElements || !document.querySelector('hyvor-talk-comments')) return;
    customElements.whenDefined('hyvor-talk-comments').then(() => {
        const root = document.querySelector('hyvor-talk-comments').shadowRoot;
        if (!root || root.querySelector('style[data-kd]')) return;
        const style = document.createElement('style');
        style.setAttribute('data-kd', '');
        // Hyvor dává tlačítku min-width 70 px; na úzkém displeji ho snížíme na pětinu šířky (okraje stránky 2×20 px)
        // a boční okraj tlačítka z 6 px až na 1 px – šířku pak drží celý popisek, ten se nikdy neořízne
        style.textContent = '.reactions{flex-wrap:nowrap;gap:0}'
            + '.reactions .reaction{flex:none;min-width:min(70px,calc((100vw - 40px)/5));padding-left:clamp(1px,calc((100vw - 300px)/16),6px);padding-right:clamp(1px,calc((100vw - 300px)/16),6px)}';
        root.appendChild(style);
    });
}

/* 11 · fotky v článku se jemně vynoří – jen ty, které jsou při načtení pod okrajem obrazovky
   (fotka viditelná hned po načtení se nikdy neskryje, takže neovlivní měření načtení stránky) */
function initPhotos() {
    if (!content || reduce || !('IntersectionObserver' in window)) return;
    const figures = [...content.querySelectorAll(':scope > figure')]
        .filter((f) => !f.hasAttribute('data-aos') && f.getBoundingClientRect().top > window.innerHeight);
    if (!figures.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            e.target.classList.add('kd-vynor--on');
        });
    }, { threshold: 0.3 });
    figures.forEach((f) => {
        f.classList.add('kd-vynor');
        io.observe(f);
    });
}

export function initKudrlinky() {
    if (!article || !('IntersectionObserver' in window)) return;
    const parts = [initScroll, initCherry, initPetals, initBench, initSignature, initQuote, initThanks, initReactionsRow, initPhotos];
    parts.forEach((fn) => {
        try { fn(); } catch (e) { console.warn('kudrlinky:', fn.name, e); }
    });
}
