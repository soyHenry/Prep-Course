---
name: brand-icons
description: Create, regenerate, or restyle the project's own animated icon family (Lordicon-style, two-tone, Lottie). Use when asked for a new animated icon, to animate an SVG as a brand icon, to change the icon identity (colors, stroke, timing), or to preview/export icons from the icons/ folder.
---

# Brand Icons

Animated icons that share one identity, like Lordicon: same canvas, same stroke,
two colors, same motion vocabulary. Everything lives in `icons/`.

## Pieces

| Path | Role |
| --- | --- |
| `icons/brand/identity.json` | The identity: canvas, grid, stroke, primary/secondary colors, easing, motion timing, presets. Single source of truth. |
| `icons/brand/icons.json` | Manifest of every icon in the family (source SVG, preset, accent). |
| `icons/scripts/make-icon.mjs` | SVG → Lottie generator that applies the identity. |
| `icons/scripts/build-icons.mjs` | Regenerates the whole family after an identity change. |
| `icons/scripts/custom/*.mjs` | Hand-choreographed icons (multi-layer, markers). `bell-ring.mjs` is the quality reference. |
| `icons/scripts/snapshot.mjs` | Renders a frame strip in the official Skottie player for review. |
| `icons/public/projects/brand-icons/<name>/` | Output scenes (`lottie.json` + `controls.json`) viewable in the player. |

Icon sources available offline: `lucide:<name>` (lucide-static, ~2k icons) and
`tabler:<name>` (Tabler outline, ~5k icons), or any 24×24 stroke SVG file path.

## Workflow

1. Start the player if it is not running: `cd icons && npm run dev` (port 3030 by
   default; use the port Vite prints).
2. Generate: `cd icons && npm run icon -- lucide:bell --preset reveal,attention`.
   - `--name <slug>` output name (default: source name).
   - `--preset` comma list of presets or motion steps, played in sequence.
     Presets: `reveal` (draw + pop), `attention` (wiggle), `jump` (bounce),
     `loading` (spin), `heartbeat` (pulse). Steps: `draw pop wiggle bounce spin pulse`.
   - `--accent 0,2` element indices that use the secondary color. Default: the
     smallest element (the "detail"), like Lordicon's two-tone look. `--accent none`
     for mono.
3. Review: `npm run icons:snap -- <name>` writes `icons/previews/<name>.png`
   (frames 0 → end). Read the image; check the draw order, the accent choice,
   cropping, and the settle frame. Fix by changing preset/accent, not by hand-editing JSON.
4. Changing identity (brand colors, stroke, speed): edit `brand/identity.json`,
   then `npm run icons:build` to regenerate all icons.

## Identity rules (keep the family coherent)

- Use stroke icons on a 24-unit grid only; do not mix filled glyph sets.
- At most two colors: primary for the silhouette, secondary for one detail.
- Do not tune timing per icon; add a new preset in `identity.json` instead so
  every icon that uses it moves the same way.
- Icons are transparent; never add backgrounds.
- Hero icons get custom choreography like `custom/bell-ring.mjs`: anticipation,
  damped motion around a real pivot, a separate part with follow-through, and
  named markers per state (`in`, `hover`/`ring`...). Reuse its helpers and the
  identity values; never hard-code colors or stroke width.
- For a motion that the generator can't express (morphs, custom character motion),
  use the `text-to-lottie` skill on the same scene, keeping the `primary`,
  `secondary` and `strokeWidth` slots and the identity values.

## Using icons in a site

The `lottie.json` files are standard Lottie. Play them with `lottie-web` or
`@lottiefiles/dotlottie-web` (e.g. play on hover, like Lordicon's `trigger="hover"`).
The colors and stroke width are Lottie slots (`primary`, `secondary`, `strokeWidth`),
so players that support slots can recolor them at runtime.
