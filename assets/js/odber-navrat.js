/* Návrat k článku po potvrzení odběru. Potvrzovací odkaz Ghostu vede na uvítací stránku /vitej-pod-tresni/ (nastavení
   uvítací stránky pro zdarma členky), ne zpět na článek, kde se čtenářka přihlásila – nejčastěji „Tohle není moje“,
   které chtěla dočíst. Při přihlášení si proto zapamatujeme článek (jen v tomto prohlížeči) a na uvítací stránce
   z odkazu s adresou #clanek-odberu uděláme odkaz zpátky na něj. Když článek neznáme (potvrzení v jiném prohlížeči,
   třeba v aplikaci Gmail), odkaz zmizí a zůstane jen text. Spouští se z assets/js/index.js (všechny stránky). */
const KEY = 'kd-clanek-odberu';
const MAX_AGE = 7 * 24 * 3600 * 1000;

function get() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
}
function set(value) {
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (e) { /* soukromý režim */ }
}

function remember() {
    const article = document.querySelector('.gh-article[data-post-id]');
    if (!article || location.pathname.indexOf('/vitej-pod-tresni/') === 0) return;
    const save = () => {
        const h1 = document.querySelector('h1');
        set({ u: location.pathname, t: h1 ? h1.textContent.trim() : '', d: Date.now() });
    };
    // formuláře odběru (pod článkem, v liště, v patičce) i tlačítka, která otevřou přihlášení Ghostu (Portal)
    document.addEventListener('submit', (e) => { if (e.target.matches('form[data-members-form]')) save(); }, true);
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-portal^="signup"], a[href$="#/portal/signup"]')) save();
    }, true);
}

function linkBack() {
    const link = document.querySelector('.gh-content a[href$="#clanek-odberu"]');
    if (!link) return;
    const saved = get();
    if (saved && saved.u && Date.now() - saved.d < MAX_AGE) {
        link.href = saved.u;
        if (saved.t) link.title = saved.t;
        return;
    }
    link.replaceWith(...link.childNodes);
}

export function initOdberNavrat() {
    try { remember(); linkBack(); } catch (e) { console.warn('odber-navrat:', e); }
}
