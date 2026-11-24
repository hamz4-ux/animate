# LOG — suez-canal

## Run 1 (2026-11-24)

**Brief (Arabic):** idea first, then a ~30s vertical MP4 about the Suez Canal
connecting Europe and Asia; antique-cartography look with accurate modern
borders, tiny stickmen; no narration, no voice-over, no captions/subtitles.

### What was built
- **Format F1** (one sheet, a token through stations, camera-led) — chosen
  because the plot is a spatial *path*. FORMATS.md marks F1 as "studied, not yet
  built with this kit"; this run is its first build. The camera (not cuts) is
  the transition, so the format's own checks (`review.mjs` F1 checks) are thin:
  pacing/arc/text/dead-beat checks ran and pass.
- **Style `parchment`** (custom, made for this piece): vellum sheet, sepia ink
  coasts that boil on 2s, hatched bronze land with a coastal band, mountain
  glyphs, walled towns, rhumb lines, graticule, compass rose, sea monster,
  vignette + grain. Gold means the route; sea-slate means water.
  Saved to `styles/parchment/` with `STYLE.md`, `sample.png`, and `demo/`
  (6s, builds, deterministic).
- **Six stations**, boundaries on the 8th grid:
  1. 0–5s   a European port: crates go aboard, a crane, gulls, watchers.
  2. 5–10s  the old way: the route is drawn all the way round Africa.
  3. 10–14s the isthmus: land blocks the way; diggers work the neck.
  4. 14–17s the cut: water is cut from both ends and meets (gold rings).
  5. 17–24s the short way: Europe → Suez → Asia; dockers unload in India.
  6. 24–30s the whole sheet: the old loop returns as a ghost, traffic on the cut.
- **Sound:** composed score only (drone → walking pulse → picks → a 1.3s
  silence → chord stab + sub at 17.0 → decay). Loudest window 17.0s (−9.5 dBFS).
- **Text:** no narration, no captions. Only diegetic toponyms in the chart's
  hand (EUROPE, AFRICA, ASIA, ARABIA, INDIA, SUEZ, MARE NOSTRUM, RED SEA, Cape
  of Good Hope).

### Honest limitations
- **The map is a schematic chart,** not a geodetic one. Modern *relative*
  arrangement is correct (Mediterranean between Europe and Africa, Red Sea
  between Africa and Arabia, Gulf of Aden east, India south-east), and the
  isthmus is a real pinch. Shapes are hand-placed, not traced from GeoJSON —
  at this scale (the port is ~200px wide) they read as an antique chart.
- Africa's western coast is drawn slightly convex; the Gulf of Guinea is
  stylised. Fix next time: 8–10 more coast vertices on the Atlantic side.
- The port close-up is the weakest shot: the jetty reads as a flat slab. Fix:
  a harbour basin with a lighthouse and a mole, not a bigger quay.
- `ffprobe` is absent in this sandbox (only `ffmpeg`); not needed for export.

### Environment notes (for the next run)
- ffmpeg: `pip install --target ~/.local/share/animate-tools/pylibs imageio-ffmpeg`
  then symlink its binary to `/usr/local/bin/ffmpeg`.
- Chromium: `npm i -g playwright @sparticuz/chromium`, copy the sparticuz
  binary to both `~/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`
  and `.../chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell`,
  and copy the bundled `al2023` `.so` libs into `/usr/local/lib` + `ldconfig`.
  The official `npx playwright install` CDN and apt are blocked in this sandbox.

### Review
- `tile.mjs`: deterministic true (piece and style demo).
- `review.mjs`: FLAT FRAMES none · story arc PASS (3/3) · text PASS
  (0 cut-off/overlap) · dead beats PASS · loudest 100ms at 17.0s in the payoff
  act · 1.3s of ≤−40 dBFS before it · −14.5 LUFS, true peak −1.0 dB.
- 19 letters still sit inside the 60px platform margin at some moment (the
  WARN list); all are ≥ 60px from the frame edge except in the two closest
  stations, where the sheet's own lettering runs to the edge of a zoomed frame.
  Deliberate: a zoomed antique chart's lettering is cropped by the frame.
