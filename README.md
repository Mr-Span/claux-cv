# CLAUX — Claudiu Șpan

Professional portfolio and personal engineering workshop: automation, software, autonomous systems, mechanical design, 3D printing and electronics.

Website: **https://mr-span.github.io/claux-cv/**

## Development

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Build and preview locally at the root URL:

```sh
npm run build
npm run preview
```

## Publication

Push to `main` to build and deploy through GitHub Actions. The workflow sets `SITE_BASE_PATH=/claux-cv/`, prerenders the pages, and publishes `dist` to GitHub Pages. In repository Settings → Pages, the publishing source is GitHub Actions.

To reproduce the published path locally, set `SITE_BASE_PATH=/claux-cv/` for both `npm run build` and `npm run preview`. The normal local build uses `/`.

Routes include the homepage, `/workshop/`, `/work/automation/`, `/work/code/`, `/work/quadyx/` and the archived `/previous/` view. Contact uses a locally generated brief and LinkedIn; it does not submit or store visitor input.

## Content and assets

- `src/content/`: professional content, Workshop projects and page metadata.
- `src/workshop/`: compact project gallery, native technical disclosures and an optional 3D model viewer.
- `src/sitePaths.ts`: URLs relative to the configured hosting directory.
- `scripts/prerender.mjs`: static HTML generation.

The 3D models load only after activation. CAD checks, physical prototypes and planned work are labelled separately.

Original cable-chain geometry: [Sergiu_I / Thingiverse 3668667](https://www.thingiverse.com/thing:3668667), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See `public/models/workshop/ATTRIBUTION.txt`. Font licenses are retained in `public/fonts/`. Production CLAUX brand assets are included unchanged.

This repository contains the website sources and selected public assets. Local research, private editorial notes, credentials and previous repository history are excluded.
