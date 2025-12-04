# Macaw Ghost Theme

Macaw is a Ghost Newsletter theme with a modern look. We did our best to design a beautiful theme that is simple to use and packed with cool features that will help you build your next newsletter or blog website.

&nbsp;

## First time using a Ghost theme?

Ghost uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes.

We've documented this theme pretty heavily so that it should be possible to work out what's going on just by reading the code and the comments. 
We also have a robust set of resources to help you build your next website:

- The official [theme documentation](https://iristhemes.com/documentation/macaw) is the complete resource for everything you need to know about Macaw Ghost theme development
- [Ghost Tutorials](https://ghost.org/tutorials/) offer a step-by-step guide to building the most common features in Ghost themes
- The [Ghost VS Code extension](https://marketplace.visualstudio.com/items?itemName=TryGhost.ghost) speeds up theme development and provides quick access to helpful info

&nbsp;

## Macaw theme features

✔️&nbsp;Quickly change the look and the feel of the website with Theme Options

✔️&nbsp;Change the font of the whole website with paired font combinations

✔️&nbsp;Narrow and wide post template - you pick what suits you best

✔️&nbsp;Stylish cover area where you can pitch your visitors with a nice punchline

✔️&nbsp;Nicely designed featured posts area

✔️&nbsp;Global Table of Contents

✔️&nbsp;Progress bar with the cool option of displaying action on the scroll

✔️&nbsp; Sharing a post on Facebook, Twitter, LinkedIn and Copy post URL

✔️&nbsp; And [more](https://iristhemes.com/themes/macaw)


&nbsp;

## Theme structure

The main files are:

- [`default.hbs`](default.hbs) - The main template file
- [`index.hbs`](index.hbs) - Used for the home page
- [`post.hbs`](post.hbs) - Used for individual posts
- [`page.hbs`](page.hbs) - Used for individual pages
- [`tag.hbs`](tag.hbs) - Used for tag archives
- [`author.hbs`](author.hbs) - Used for author archives
- [`custom-post-narrow-featured-image.hbs`](custom-post-narrow-featured-image.hbs) - Used for single post

&nbsp;

## Development guide

The Macaw theme provides a first-class development experience out of the box. 

&nbsp;

### Setup

To see realtime changes during development, symlink the Macaw theme folder to the `content/themes` folder in your local Ghost install. 

```bash
ln -s /path/to/macaw /ghost/content/themes/macaw
```

Restart Ghost and select the Macaw theme from **Settings**.

From the theme's root directory, install the dependencies:

```bash
npm install
```

If Node isn't installed, follow the [official Node installation guide](https://nodejs.org/).

&nbsp;

### Start development mode

From the Macaw theme folder, start development mode:

```bash
npm run dev
```

Changes you make to your styles, scripts, and Handlebars files will show up automatically in the browser. CSS and Javascript will be compiled and output to the `built` folder.

Press `ctrl + c` in the terminal to exit development mode.

&nbsp;

### Build, zip, and test your theme

Compile your CSS and JavaScript assets for production with the following command:

```bash
npm run build
```

Create a zip archive:

```bash
npm run zip
```

Use `gscan` to test your theme for compatibility with Ghost:

```bash
npm run test
```

&nbsp;


# Changelog

**Version 1.5 (25.12.2024)** 
New Features:

- Users can now select between Macaw Fonts, Ghost Fonts, or opt for locally hosted fonts to enhance typography flexibility and performance.

Bug Fixes:

- Minor tweaks of several visual bugs

**Version 1.4 (8.3.2024)** 

New Features:

- Introduced a new page template specifically designed for showcasing Memberships, enhancing the user experience for membership-related content.

Bug Fixes:

- Resolved several minor visual glitches for a smoother user interface.
- Corrected an issue with Social Network links, ensuring they now work as intended.
- Fixed a bug that caused incorrect dates to be displayed in archives, restoring accurate date representation.

**Version 1.3 (24.1.2024)** 

New Features:

- Added an Lightbox for post and page gallery and images

Bug Fixes:

- Minor tweaks of several visual bugs

**Version 1.2.1 (30.11.2023)** 

New Features:

- Added an option for Introduction area - you can now pick two layouts and to hide it

Bug Fixes:

- Streamlined CSS and JS: Numerous minor fixes like color changes when cover is not active and navigation bug on window resize have been fixed.


**Version 1.2.0 (16.11.2023)** 

New Features:

- Added an option to switch ON/OFF share buttons on single posts
- Added support for Ghost Recommendation feature and page template that lists Recommendations 
- Added option so users can switch ON/OFF post listing meta
- Added option so users can switch ON/OFF featured post listing meta

Bug Fixes:

- Streamlined CSS and JS: Numerous minor fixes have been implemented to enhance the overall look and feel of the theme.

**Version 1.1.0 (16.11.2023)** 

New Features:

- Archive Page Template: Introducing a new template dedicated to showcasing archives, making it easier for users to navigate through content history.
- Featured Area Options: Users now have the flexibility to choose between a Featured Slider, Grid layout, or the option to hide the Featured area altogether, allowing for a more personalized homepage appearance.
- Custom Featured Post Display: A new setting empowers users to determine the number of featured posts they want to showcase, enabling a tailored presentation of their most important content.

Enhancements:

- Diverse Post Listing Layouts: Users can now select from Big List, Small List, and Minimal List post layouts, which provide various options for displaying their posts according to personal preferences.
- Customizable Post Listing Display: An additional feature allows users to pick their desired post layout listing, enhancing the overall visual appeal and user experience.

Bug Fixes:

- Streamlined CSS and JS: Numerous minor fixes have been implemented to enhance the overall look and feel of the theme.

**Version 1.0.0 (16.11.2023)** 

Initial Release


## Copyright & License

Copyright (c) 2013-2023 Ghost Foundation - Released under the [MIT license](LICENSE).
