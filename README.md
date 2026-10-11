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
