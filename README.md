# Manesha & Alkesh — Wedding Invitation

A cheerful, colourful single-page wedding invitation with floating glowing
3D lanterns, drifting marigolds & blossoms, twinkling sparkles, a hanging
festive garland, and buttery smooth scrolling.

Built with **Vite + TypeScript + Three.js**, **GSAP/ScrollTrigger** (scroll
reveals) and **Lenis** (smooth scroll).

## Run it

```bash
npm install      # once
npm run dev      # local dev server (hot reload)
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

Open the printed `localhost` URL.

## Edit the wedding details

All copy lives in **one file** — `src/data/content.ts`. Change names, the date,
parents, the event list, bios and the closing message there; nothing else needs
touching.

## Swap the photos

Drop your own images into `public/images/` using the **same filenames** (or edit
the paths in `src/data/content.ts`):

| File         | Where it appears                |
| ------------ | ------------------------------- |
| `couple.jpg` | "Meet the couple" feature photo |
| `hands.jpg`  | "Families" section accent       |
| `rings.jpg`  | "A note from us" circular image |

Current images are tasteful placeholders from Unsplash — see
`public/images/CREDITS.md`.

## Tweak the look

- **Colours & fonts** — CSS variables at the top of `src/style.css`.
- **Floating lanterns / flowers / sparkles** — which artwork appears, how big,
  how often and which way it drifts: the `KINDS` list in
  `src/three/FestiveScene.ts`. Counts for desktop/mobile are just below it.
- **Hanging garland** — the `order` array in `src/render.ts`.
- **Decorative artwork** — the Twemoji SVGs in `public/images/decor/`
  (CC-BY, see `CREDITS.md`); drop in others and reference them by name.

## Notes

- Honours `prefers-reduced-motion` (dampens animation, disables smooth-scroll).
- Pauses the 3D render when the browser tab is hidden.
- Fully responsive; the petal count drops on small screens.

## Deploy

It's a static site — after `npm run build`, upload the `dist/` folder to
Netlify, Vercel, GitHub Pages, or any static host.
