# Image Credits

All images are from [Unsplash](https://unsplash.com) under the
[Unsplash License](https://unsplash.com/license) (free for commercial &
non-commercial use, no attribution required — credit included here as good
practice). These are tasteful **placeholders** — swap them for the couple's
own photos by replacing the files (keep the same filenames) or editing paths
in `src/data/content.ts` and `src/render.ts`.

| File           | Subject                          | Source (Unsplash photo ID)            |
| -------------- | -------------------------------- | ------------------------------------- |
| `couple.jpg`   | Couple amid falling petals       | photo-1583939003579-730e3918a45a      |
| `rings.jpg`    | Gold wedding rings               | photo-1606800052052-a08af7148866      |
| `hands.jpg`    | Jaimala / blessing hands         | photo-1597157639073-69284dc0fdaf      |
| `sky.jpg`      | Soft pink sky (background wash)   | photo-1503455637927-730bce8583c0      |
| `hero-banner.jpg` | Couple "Just Married" (full-width hero banner) | **User-provided AI-generated image** — colour-graded & resized to match the festive palette (ImageMagick). Not from Unsplash. |

To replace: drop a new image with the same filename into this folder.

## Decorative artwork — `decor/*.svg`

Sourced via the [Iconify](https://iconify.design) API (downloaded locally):

| File(s)                                                                   | Set                | License                                                              |
| ------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------- |
| `lantern`                                                                 | Google **Noto Emoji** | [Apache 2.0](https://github.com/googlefonts/noto-emoji)           |
| `diya, blossom, cherry, hibiscus, rosette, lotus, sparkles, glowstar, confetti` | Microsoft **Fluent Emoji** | [MIT](https://github.com/microsoft/fluentui-emoji)        |
| `mandala` (flower-emblem)                                                 | **Game-icons.net** | [CC-BY 3.0](https://game-icons.net)                                  |

The lanterns/flowers/sparkles power both the 3D floating scene and the hanging
garland; the two `mandala-*` files are the rotating rangoli behind the hero.

To change which artwork floats, edit the `KINDS` list in
`src/three/FestiveScene.ts`; for the garland, the `order` array in
`src/render.ts`. New art: grab any icon as SVG from
`https://api.iconify.design/<set>:<icon>.svg` and drop it in here.
