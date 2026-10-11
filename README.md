# Šablona blogu dovolit.si

Ghost šablona webu [dovolit.si](https://www.dovolit.si). Vychází ze šablony
[Macaw 1.5](https://iristhemes.com/themes/macaw) od Iris Themes (Handlebars, Tailwind 3, Rollup), licence MIT – viz [`LICENSE`](LICENSE).

## Nasazení

Push na `master` spustí GitHub Action [`deploy.yml`](.github/workflows/deploy.yml): `npm run zip` postaví `macaw1.zip`,
GScan ho zkontroluje a akce ho nahraje na Ghost(Pro). Žádný staging není – změny jdou přes pull request.

Název zipu `macaw1` neměnit: Ghost podle něj pozná šablonu a ukládá k ní nastavení z **Settings → Design**.
S jiným názvem by vznikla nová šablona s výchozím nastavením.

## Vývoj

```bash
npm install
npm run dev     # sleduje změny, CSS a JS do assets/built/
npm run build   # produkční build
npm run zip     # build + zip pro Ghost
npm run test    # GScan
```

Pro lokální Ghost symlinkni složku do `content/themes/` a šablonu aktivuj v **Settings**.

## Hlavní soubory

- [`default.hbs`](default.hbs) – kostra stránky
- [`index.hbs`](index.hbs) – úvodní stránka
- [`post.hbs`](post.hbs) – článek, včetně komentářů Hyvor Talk
- [`tag.hbs`](tag.hbs), [`author.hbs`](author.hbs) – archivy štítků a autorů
- [`partials/`](partials) – sdílené části (karty, fotky ve WebP, sociální sítě…)

## Osobní texty u článků

Pod perexem článku Martina řekne, kdy to psala, začne povídat a pozve na kafe; na kartách ve výpisech je věta podle
měsíce a úvod k článku (u každého jiný); nad komentáři dá slovo čtenářce. Každá část má jeden soubor v `partials/`:

| Soubor | Co dělá |
|---|---|
| `kd-uvod.hbs` | osobní úvod článku (1–3 věty), podle slugu; článek bez úvodu ho prostě nemá |
| `kd-pozvani.hbs` | pozvání podle délky čtení z Ghostu („Uvař si kafe. Než ho dopiješ, všechno ti povím.“) |
| `kd-datum-clanek.hbs`, `kd-datum-karta.hbs` | datum jako věta podle měsíce („Psala jsem ti to v říjnu 2026, s čajem v ruce.“ / „Z října 2026, psáno s čajem v ruce.“); vážné články jen měsíc a rok |
| `kd-clenky.hbs` | prosba u článku jen pro členky |
| `kd-pribeh-clanek.hbs`, `kd-pribeh-karta.hbs` | skládají části v hlavičce článku a na kartě |

Výzva nad komentáři („Můj pohled znáš. Jak to vidíš ty?“) je v `post.hbs`, jména těch, které už napsaly, a drobný
počet komentářů v hlavičce doplňuje skript `kdKomentare` v `default.hbs`.

**Úvod pro další článek:** v `partials/kd-uvod.hbs` přidej před `{{/match}}` řádek
`{{~else match slug "slug-clanku"}}<span class="kd-uvod">Text úvodu.</span>` (slug = adresa článku bez lomítek).
Text jen z toho, co v článku opravdu je, neopakovat perex, neprozradit pointu; schvaluje Martina.
