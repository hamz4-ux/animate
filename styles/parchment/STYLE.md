# parchment — antique cartography on old vellum

A custom 2D style made for *Suez — one cut through the desert* (2026-11-24).
It is the old European chart: a vellum sheet, ink coastlines, hatched land,
a gold route, a compass rose, sea monsters — and modern relative geography.

**The look:** bone-pale vellum, sepia ink, bronze landwash, a pale slate sea
with a hand-ruled wave grid. Coastlines are ink and wobble on 2s (the boil).
Land is shaded at the shore with a soft inner band and a hatched shadow, with
tiny antique mountain glyphs, walled towns, rhumb lines and a graticule. A
gold dashed route is the only bright colour; it means *the way between seas*.

## Palette (one meaning per colour)
| name | hex | means |
|---|---|---|
| vellum | `#efe3c6` | the sheet (paper), the blank a morph happens on |
| land | `#e7d5ae` | land, washed with `#d6bd8c` toward the shore |
| sea | `#aec2c1` | water (sea fill), lines `#6a8b89` |
| ink | `#3b2a1b` | every coast, hull, stickman, letter |
| gold | `#b07a1e` / `#d9a53c` | **the route** — never decoration |
| red | `#7d3a26` | a surveyor's line, the plan |

## Line and texture
- Coasts: 2 passes of Chaikin on the raw polyline (`parSmooth`), then `ink`
  at `w: 3.4` with `amt: 0` (the smoothing *is* the hand).
- Inside land: a diagonal bronze gradient, hatching at `a: -0.66`, `gap: 15`,
  `al: 0.30`, plus a stipple at `al: 0.16`; a light `lineWidth: 26` stroke of
  the coastline clipped inside the land gives the coastal band its weight.
- Sea: a 26px wave grid at `al: 0.20` whose phase moves on `TT`, plus ~26
  hand-drawn wave ticks reseeded on `B`.
- Every frame ends with `STYLE.post()`: a radial vignette (0.40 at the edges)
  and `grain()` from the `backdrop` hook.

## Characters
- **Stickman** (`parStickman`): a filled head dot, a single spine, two legs and
  two arms, `lineWidth = h * 0.11`. Poses: `idle`, `walk`, `wave`, `dig`,
  `carry`, `point`. Idle life: a bob and a sway on `TT`. Never more than ~6
  on screen — they are tiny witnesses, not the subject.
- **Galleon** (`parShip`): an ink hull, two masts, pale vellum sails bellied by
  the wind, a gold pennant on the hero ship only. Rocks on `TT`; `flip` faces
  it along its route.

## Motion habits
- Motion on 2s (`ones: false`): boil, waves, bobbing, sail rock.
- The camera does the storytelling: eased `parPan` holds, then ~1.1s pans.
- Routes are drawn on with `subPath`, gold dashes flowing with
  `lineDashOffset = -TT * 22`.

## Frame checklist
1. Is the sheet's furniture there (rhumb lines, graticule, border)? On a close
   station the border may be out of frame — that is fine, the rhumbs are not.
2. Does gold appear **only** on a route or a route's ship?
3. Is every coastline doubled/weighted, and is the land hatched?
4. Is there background life (a gull, a wave tick, the monster, a blinking
   bob) even in a held frame?
5. At phone size: is every letter ≥ 20px in world units at the zoom it is
   shown? (Toponyms read at ~11px on a 360px contact sheet.)
6. Is a tiny figure present where a human action is described?

## Do / Don't
- **Do** let the map be the hero. **Don't** put a character in the middle of a
  wide shot — the route and the seas are the subject.
- **Do** keep toponyms in the chart's own hand (serif caps, letter-spaced,
  `rgba(59,42,27,...)`), never as a modern caption.
- **Don't** letter-space the sheet's seas so wide that a zoomed camera cuts a
  word (test at the station's zoom, not at z=1).
- **Don't** shade the sea darker than the land: the land must read as the lit
  surface on a phone.

## Hooks (contract)
`paper`, `backdrop`, `window`, `blob`, `hero`, `heroColor`, `post`, `ones` —
implemented in `kit.js`. No bridges are used by this piece (F1, camera-led), so
`window`/`blob`/`hero` exist only to keep the contract intact.

## Proven on
`pieces/suez-canal` — 30s, 9:16, six camera stations on one sheet, 720 frames,
deterministic (`tile.mjs`), reviewed (story arc PASS, text PASS, dead beats PASS).
Weakest shot: the port close-up — the quay reads as a flat slab at 2.5× zoom;
the fix is a proper harbour basin with a lighthouse, not a bigger jetty.
