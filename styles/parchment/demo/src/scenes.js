// =====================================================================
//  SCENES — suez-canal. One sheet (src/geo.js), six stations, no cuts.
//  The camera is the transition: close port -> whole ocean -> tight
//  isthmus -> wide reveal -> Asia -> the whole sheet.
// =====================================================================

// ---------- the sheet's land + sea ----------
function parSea() {
  // the sheet is sea: pale water with a fine hand-ruled wave grid
  fillAll(PAR.sea);
  ctx.save(); ctx.strokeStyle = PAR.seaLine; ctx.globalAlpha = 0.20; ctx.lineWidth = 1.4;
  for (let y = -10; y < H + 20; y += 26) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 20) { const yy = y + Math.sin(x * 0.03 + y * 0.05 + TT * 0.9) * 2.6; x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.stroke();
  }
  ctx.restore();
  // a few darker wave marks, sparse
  const R = RNG('waves', B);
  ctx.save(); ctx.strokeStyle = PAR.seaLine; ctx.globalAlpha = 0.26; ctx.lineWidth = 1.6;
  for (let i = 0; i < 26; i++) {
    const x = R.r(40, W - 40), y = R.r(60, H - 60);
    ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.quadraticCurveTo(x, y - 5, x + 9, y); ctx.stroke();
  }
  ctx.restore();
}

function parLandFill(P, key) {
  const Q = parSmooth(P, true, 2);
  ctx.save(); trace(Q, true);
  ctx.fillStyle = PAR.land; ctx.fill();
  ctx.clip();
  const bb = bbox(Q, 8);
  // bronze wash across the interior
  const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
  g.addColorStop(0, 'rgba(214,189,140,0.55)'); g.addColorStop(1, 'rgba(231,213,174,0.1)');
  ctx.fillStyle = g; ctx.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0);
  // the coastal band: a soft inner shadow, the way old charts weight a shore
  ctx.strokeStyle = PAR.landHatch; ctx.globalAlpha = 0.13; ctx.lineWidth = 26; trace(Q, true); ctx.stroke();
  ctx.globalAlpha = 0.10; ctx.lineWidth = 12; trace(Q, true); ctx.stroke(); ctx.globalAlpha = 1;
  // hatched shadow along the shore: antique maps shade the coast band
  hatch(bb, { key: key + ':h', a: -0.66, gap: 15, c: PAR.landHatch, w: 1.5, al: 0.30, dash: [8, 10], skip: [3, 16] });
  stipple(bb, { key: key + ':s', n: 120, c: PAR.landHatch, al: 0.16 });
  ctx.restore();
  // ink coast, doubled for weight
  ink(Q, { closed: true, w: 3.4, color: PAR.ink, key: key + ':c', amt: 0 });
}


// antique mountain glyphs: a tight cluster of little peaks with a hatched shadow side
function parRidge(pts, s, key) {
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  pts.forEach(([x, y], i) => {
    const R = RNG('ridge', key, i);
    for (let k = 0; k < 3; k++) {
      const px = x + (k - 1) * s * 0.9 + R.n(s * 0.22), py = y + R.n(s * 0.18);
      const w = s * R.r(0.62, 0.92), h = s * R.r(0.55, 0.85);
      ctx.beginPath(); ctx.moveTo(px - w, py); ctx.lineTo(px - w * 0.14, py - h); ctx.lineTo(px + w * 0.6, py - h * 0.6); ctx.lineTo(px + w, py);
      ctx.closePath(); ctx.fillStyle = 'rgba(214,189,140,0.85)'; ctx.fill();
      ctx.strokeStyle = PAR.ink; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.globalAlpha = 0.45; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px - w * 0.14, py - h); ctx.lineTo(px - w * 0.14, py);
      ctx.moveTo(px - w * 0.5, py - h * 0.45); ctx.lineTo(px - w * 0.5, py); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });
  ctx.restore();
}

// --- the land's relief: the antique map's range glyphs, drawn on the land ---
function parLandRelief() {
  parRidge([[150, 712]], 15, 'atlas');            // the Atlas
  parRidge([[392, 966]], 14, 'eth');              // the Ethiopian highlands
  parRidge([[472, 330]], 14, 'alps');             // the Alps
  parRidge([[706, 792]], 11, 'arab');             // Arabia's spine
  ctx.save(); ctx.strokeStyle = PAR.ink; ctx.lineWidth = 2;
  for (const [tx, ty] of [[210, 620], [742, 900]]) {
    ctx.beginPath(); ctx.moveTo(tx - 11, ty + 7); ctx.lineTo(tx - 11, ty - 4); ctx.lineTo(tx - 5, ty - 11); ctx.lineTo(tx + 1, ty - 4);
    ctx.lineTo(tx + 7, ty - 11); ctx.lineTo(tx + 13, ty - 4); ctx.lineTo(tx + 13, ty + 7); ctx.closePath(); ctx.stroke();
  }
  ctx.restore();
}

// --- the furniture, part 1: the chart's own texture (always on, any zoom) ---
function parRhumbs() {
  ctx.save(); ctx.globalAlpha = 0.10; ctx.strokeStyle = PAR.inkL; ctx.lineWidth = 1.2;
  for (const [cx, cy] of [[215, 690], [905, 1210]]) {
    for (let i = 0; i < 16; i++) { const a = i * TAU / 16 + 0.13; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 2400, cy + Math.sin(a) * 2400); ctx.stroke(); }
  }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.085; ctx.strokeStyle = PAR.inkL; ctx.lineWidth = 1;
  for (let i = 1; i < 7; i++) { ctx.beginPath(); ctx.moveTo(0, i * 270); ctx.lineTo(W, i * 270); ctx.stroke(); }
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(i * 270, 0); ctx.lineTo(i * 270, H); ctx.stroke(); }
  ctx.restore();
}

// --- the furniture, part 2: the ornaments, only where the whole sheet is in frame ---
function parOrnaments() {
  ctx.save(); ctx.strokeStyle = PAR.ink; ctx.lineWidth = 5; ctx.strokeRect(22, 22, W - 44, H - 44);
  ctx.lineWidth = 1.8; ctx.strokeRect(38, 38, W - 76, H - 76); ctx.restore();
  parCompass(150, 1690, 62);
  parMonster(150, 1150, 210, { key: 'atl' });
  // a rhumb rose in the Indian Ocean and a cartouche rule in the corner of the sheet
  parCompass(960, 820, 38);
}

// every scene draws the same sheet, then its own station's business
function parWorld(o = {}) {
  parSea();
  parRhumbs();
  if (o.sheet) parOrnaments();
  parLandFill(GEO.africa, 'afr');
  parLandFill(GEO.asia, 'asi');
  parLandFill(GEO.europe, 'eur');
  for (let i = 0; i < GEO.islands.length; i++) parLandFill(GEO.islands[i], 'isl' + i);
  parLandRelief();   // ranges and towns sit on the land, which is drawn above
  if (o.cut) {
    ink(GEO.cut, { w: 15, color: PAR.sea, key: 'cutW', amt: 0 });
    ink(GEO.cut, { w: 2.4, color: PAR.seaLine, key: 'cutE', amt: 0 });
  }
}

// the gold route, dashed, drawn on to frac
function parRoute(P, frac, o = {}) {
  if (frac <= 0) return;
  const Q = resample(subPath(parSmooth(P, false, 1), clamp(frac)), false, 10);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.setLineDash([17, 14]); ctx.lineDashOffset = -(TT * 22);
  ctx.strokeStyle = PAR.goldL; ctx.globalAlpha = o.al ?? 0.40; ctx.lineWidth = (o.w ?? 5) * 2.6; trace(Q, false); ctx.stroke();
  ctx.strokeStyle = PAR.gold; ctx.globalAlpha = (o.al ?? 0.95); ctx.lineWidth = o.w ?? 4.4; trace(Q, false); ctx.stroke();
  ctx.restore();
}


// a waterway: the polygon of path P drawn up to frac, with half-width hw
function parRibbon(P, frac, hw) {
  const Q = parSmooth(P, false, 1), S = subPath(Q, clamp(frac));
  if (S.length < 2) return null;
  const L = [], R = [];
  for (let i = 0; i < S.length; i++) {
    const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    const nx = -dy / d, ny = dx / d;
    L.push([S[i][0] + nx * hw, S[i][1] + ny * hw]);
    R.push([S[i][0] - nx * hw, S[i][1] - ny * hw]);
  }
  return { all: [...L, ...R.slice().reverse()], L, R };
}

// where the ship sits on a route at the current moment
function parShipOn(P, frac, s, o = {}) {
  const Q = parSmooth(P, false, 1), p = pointAt(Q, clamp(frac)), q = pointAt(Q, clamp(frac + 0.004));
  const ang = Math.atan2(q[1] - p[1], q[0] - p[0]);
  parShip(p[0], p[1], s, { key: o.key ?? 'ship', gold: o.gold !== false, flip: Math.cos(ang) >= 0 ? 1 : -1 });
}

// ---------------------------------------------------------------------
//  1. 0–5s  a European port: crates go aboard. Close, quiet, lamplit.
// ---------------------------------------------------------------------
function scenePort() {
  parWorld();
  // a lighter Mediterranean right here: the port sits in a lagoon of open water
  ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = '#f2ece0';
  trace(parSmooth([[176, 500], [420, 494], [470, 528], [430, 566], [176, 566]], true, 2), true); ctx.fill(); ctx.restore();
  // the quay: a stone jetty running out into the Mediterranean
  const quay = parSmooth([[176, 552], [286, 540], [298, 574], [186, 588]], true, 1);
  parShape(quay, PAR.vellumL, { raw: true, line: PAR.ink, w: 2.6 });
  ctx.save(); ctx.globalAlpha = 0.45; ctx.strokeStyle = PAR.inkL; ctx.lineWidth = 1.2;
  for (let i = 0; i < 7; i++) { const x = 190 + i * 15; ctx.beginPath(); ctx.moveTo(x, 519); ctx.lineTo(x - 4, 552); ctx.stroke(); }
  ctx.restore();
  // crates: two stacked, one being carried
  const box2 = (x, y, w2, h2, k) => parShape([[x, y], [x + w2, y - 2], [x + w2, y + h2], [x, y + h2 + 2]], PAR.vellumL, { key: k, line: PAR.ink, w: 2 });
  box2(200, 528, 30, 22, 'c1'); box2(232, 530, 26, 22, 'c2'); box2(206, 502, 26, 22, 'c3');
  // the loaders: one walking a crate to the ship, two watching
  const k = EZ.io(seg(TT, TIMELINE.cues.load, TIMELINE.cues.load + 2.4));
  parStickman(214 + 54 * k, 554, 52, { pose: 'carry', key: 'loader' });
  parStickman(254, 588, 50, { pose: 'wave', key: 'watcher' });
  parStickman(182, 592, 46, { pose: 'idle', key: 'watcher2' });
  // the ship at the quay, pennant gold
  parShip(330, 552, 132, { key: 'ship1', gold: true, flip: 1 });
  // a quay crane: a boom over the hold, the port's silhouette
  ctx.save(); ctx.strokeStyle = PAR.ink; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ink([[318, 548], [318, 470], [352, 470]], { w: 3.2, color: PAR.ink, key: 'crane', amt: 0 });
  ink([[318, 478], [300, 470]], { w: 2.4, color: PAR.ink, key: 'crane2', amt: 0 });
  const hookY = 486 + Math.sin(TT * TAU * 0.5) * 8;
  ink([[352, 470], [352, hookY]], { w: 1.2, color: PAR.inkL, key: 'hook', amt: 0 });
  parShape([[344, hookY], [360, hookY], [360, hookY + 12], [344, hookY + 12]], PAR.vellumL, { key: 'hookbox', line: PAR.ink, w: 1.6 });
  ctx.restore();
  // gulls
  for (let i = 0; i < 3; i++) {
    const gx = 350 + i * 44 + Math.sin(TT * 0.9 + i) * 12, gy = 470 - i * 20 + Math.cos(TT * 0.8 + i) * 6;
    ink([[gx - 8, gy], [gx, gy - 4], [gx + 8, gy]], { w: 1.8, color: PAR.ink, key: 'gull' + i, amt: 0 });
  }
  // diegetic toponomy, in the map's own hand
  parText('E U R O P E', 130, 350, 34, PAR.ink, { weight: 700, sp: 4 });
  parText('MARE NOSTRUM', 150, 478, 20, 'rgba(59,42,27,0.55)', { weight: 600, sp: 2 });
  parText('A F R I C A', 250, 700, 26, 'rgba(59,42,27,0.62)', { weight: 700, sp: 3 });
}

// ---------------------------------------------------------------------
//  2. 5–10s the old way: all the way round Africa.
// ---------------------------------------------------------------------
function sceneOldRoute() {
  parWorld({ sheet: true });
  const R = GEO.oldRoute, k = ev(TIMELINE.cues.sailOld, TIMELINE.cues.sailOldEnd - TIMELINE.cues.sailOld);   // 5.3 -> 10.0
  parRoute(R, k, { w: 4.6 });
  parShipOn(R, k * 0.995, 92, { key: 'ship2' });
  // gulls tracking the ship across the ocean: three, always a little further on
  for (let i = 0; i < 3; i++) {
    const f = mod(0.18 + TT * 0.035 + i * 0.07, 1), gp = pointAt(parSmooth(R, false, 1), f);
    const gx = gp[0] + 40 + i * 26 + Math.sin(TT * 1.1 + i) * 14, gy = gp[1] - 70 - i * 26 + Math.cos(TT * 0.9 + i) * 10;
    ink([[gx - 11, gy], [gx, gy - 6], [gx + 11, gy]], { w: 2.4, color: PAR.ink, key: 'gullO' + i, amt: 0 });
  }
  // the wake: short dashes falling behind the hull
  const sp = pointAt(parSmooth(R, false, 1), k * 0.995);
  for (let i = 0; i < 4; i++) {
    ctx.save(); ctx.strokeStyle = PAR.vellumL; ctx.globalAlpha = 0.55 - i * 0.1; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(sp[0] - 20 - i * 16, sp[1] + 6 + i * 3, 12 + i * 5, 0.5, 2.4); ctx.stroke(); ctx.restore();
  }
  // a second sail, closing from the west: the ocean is busy, this is a trade
  const o2 = mod((TT - 5.0) * 0.035, 1);
  if (o2 > 0.02) parShip(lerp(60, 300, o2), lerp(1200, 1120, o2), 58, { key: 'shipFar', flip: 1 });
  // a whale's spout, off the African coast: the mysterious life of the sheet
  const sp2 = ev(6.4, 0.9) * (1 - ev(7.5, 0.7));
  if (sp2 > 0) {
    ctx.save(); ctx.strokeStyle = PAR.vellumL; ctx.globalAlpha = 0.7 * sp2; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(150 + i * 7, 1210); ctx.quadraticCurveTo(144 + i * 9, 1180 - sp2 * 26, 152 + i * 6, 1160 - sp2 * 40); ctx.stroke(); }
    ctx.restore();
  }
  parText('A F R I C A', 268, 1064, 40, PAR.ink, { weight: 700, sp: 5 });
  parText('Cape of Good Hope', 196, 1492, 22, 'rgba(59,42,27,0.58)', { weight: 600 });
}

// ---------------------------------------------------------------------
//  3. 10–14s the isthmus: land blocks the way; diggers work the neck.
// ---------------------------------------------------------------------
function sceneIsthmus() {
  parWorld();
  // the surveyor's red line across the neck: the plan
  ink([[592, 540], [616, 574]], { w: 2.6, color: PAR.red, key: 'survey', frac: ev(TIMELINE.cues.survey, 0.6), amt: 0 });
  // diggers and their spoil
  for (let i = 0; i < 3; i++) {
    const x = 566 + i * 15, y = 592 + (i % 2) * 8;
    parStickman(x, y, 42, { pose: 'dig', key: 'dig' + i });
    const g = ev(TIMELINE.cues.dig + i * 0.1, 1.3);
    if (g > 0) {
      const R = RNG('dirt', i);
      ctx.save(); ctx.fillStyle = PAR.landHatch; ctx.globalAlpha = 0.55;
      for (let j = 0; j < 26; j++) { const a = R.r(0, TAU), r = R.r(1, 13) * g; ctx.beginPath(); ctx.arc(x + 12 + Math.cos(a) * r, y + 2 + Math.sin(a) * r * 0.45, R.r(0.8, 2.2), 0, TAU); ctx.fill(); }
      ctx.restore();
    }
  }
  // a stickman on the far shore pointing across
  parStickman(546, 560, 40, { pose: 'point', key: 'pointer' });
  parText('SUEZ', 668, 548, 25, PAR.ink, { weight: 700, sp: 3 });
  parText('Isthmus', 428, 646, 22, 'rgba(59,42,27,0.55)', { weight: 600 });
  parText('R E D   S E A', 636, 706, 19, 'rgba(59,42,27,0.6)', { weight: 600, sp: 2 });
  parText('MARE NOSTRUM', 446, 462, 17, 'rgba(59,42,27,0.5)', { weight: 600, sp: 2 });
}

// ---------------------------------------------------------------------
//  4. 14–17s the cut: water is drawn across the neck and the ends meet.
// ---------------------------------------------------------------------
function sceneCut() {
  parWorld();
  // the channel is cut from both ends at once, and the two seas run into each other
  const k = ev(TIMELINE.cues.cut, TIMELINE.cues.meet - TIMELINE.cues.cut);
  const N = [[594, 528], [600, 540], [606, 554]];      // from the Mediterranean down
  const Sd = [[616, 578], [611, 566], [604, 552]];      // from the Red Sea up
  const hw = 7 + 11 * k;
  const rA = parRibbon(N, clamp(k * 1.02), hw), rB = parRibbon(Sd, clamp(k * 1.02), hw);
  for (const r of [rA, rB]) {
    if (!r) continue;
    ctx.save(); trace(r.all, true); ctx.fillStyle = PAR.sea; ctx.fill();
    // banks only: the channel has no end caps, it opens into both seas
    ctx.strokeStyle = PAR.ink; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (r.L.length > 1) { trace(r.L, false); ctx.stroke(); trace(r.R, false); ctx.stroke(); }
    ctx.restore();
  }
  // a watchman on the bank, the only witness (background life in the held shot)
  parStickman(662, 596, 46, { pose: 'point', key: 'watchman' });
  // the meeting: a gold flash and three rings, once
  const meet = ev(TIMELINE.cues.meet, 0.9), fade = 1 - ev(TIMELINE.cues.meet + 0.3, 1.3);
  if (meet > 0) {
    ctx.save();
    ctx.strokeStyle = PAR.gold; ctx.fillStyle = PAR.gold;
    ctx.globalAlpha = 0.9 * fade;
    for (let i = 0; i < 3; i++) { ctx.lineWidth = 2.6 - i * 0.5; ctx.beginPath(); ctx.arc(605, 553, 10 + i * 13 + meet * 40, 0, TAU); ctx.stroke(); }
    ctx.globalAlpha = 0.55 * fade; ctx.beginPath(); ctx.arc(605, 553, 6, 0, TAU); ctx.fill();
    ctx.restore();
  }
  parText('SUEZ', 640, 540, 25, PAR.ink, { weight: 700, sp: 3 });
  parText('MARE NOSTRUM', 440, 462, 17, 'rgba(59,42,27,0.5)', { weight: 600, sp: 2 });
  parText('R E D   S E A', 636, 700, 19, 'rgba(59,42,27,0.6)', { weight: 600, sp: 2 });
}

// ---------------------------------------------------------------------
//  5. 17–24s the short way: Europe to Asia through the cut.
// ---------------------------------------------------------------------
function sceneNewRoute() {
  parWorld({ cut: true });
  const R = GEO.newRoute, k = ev(TIMELINE.cues.sailNew, TIMELINE.cues.sailNewEnd - TIMELINE.cues.sailNew);
  parRoute(R, k, { w: 4.6 });
  parShipOn(R, k * 0.995, 92, { key: 'ship3' });
  if (k > 0.6) parShip(688, 826, 62, { key: 'ship4', flip: 1 });
  if (k > 0.82) parShip(858, 1010, 54, { key: 'ship5', flip: 1 });
  // Asia receives: two dockers carry crates off the quay
  parShape(parSmooth([[850, 1160], [930, 1150], [938, 1176], [858, 1186]], true, 1), PAR.vellumL, { raw: true, line: PAR.ink, w: 2.2 });
  parStickman(872, 1154, 46, { pose: 'carry', key: 'asiaL' });
  parStickman(916, 1158, 44, { pose: 'carry', key: 'asiaL2' });
  parStickman(828, 1128, 42, { pose: 'wave', key: 'asiaW' });
  parText('A R A B I A', 806, 1042, 28, PAR.ink, { weight: 700, sp: 4 });
  parText('I N D I A', 872, 1288, 26, PAR.ink, { weight: 700, sp: 4 });
  parText('E U R O P E', 300, 470, 26, 'rgba(59,42,27,0.55)', { weight: 700, sp: 3 });
}

// ---------------------------------------------------------------------
//  6. 24–30s the whole sheet: the loop became a cut.
// ---------------------------------------------------------------------
function sceneReveal() {
  parWorld({ cut: true, sheet: true });
  // the old loop returns as a ghost — what the world used to cost
  const kOld = ev(TIMELINE.cues.ghost, 3.0);
  ctx.save(); ctx.globalAlpha = 0.26; ctx.setLineDash([10, 14]);
  ink(resample(subPath(parSmooth(GEO.oldRoute, false, 1), kOld), false, 10), { w: 3.4, color: PAR.inkL, key: 'ghostOld', amt: 0 });
  ctx.restore();
  // the cut route stays bright, with traffic
  parRoute(GEO.newRoute, ev(TIMELINE.cues.shortRoute, 1.2), { w: 4.6 });
  const R = parSmooth(GEO.newRoute, false, 1);
  for (let i = 0; i < 4; i++) {
    const f = mod(TT * 0.055 + i * 0.25, 1), p = pointAt(R, f), q = pointAt(R, Math.min(1, f + 0.004));
    parShip(p[0], p[1], 42 + (i % 2) * 8, { key: 'traffic' + i, gold: i === 0, flip: Math.cos(Math.atan2(q[1] - p[1], q[0] - p[0])) >= 0 ? 1 : -1 });
  }
  parText('E U R O P E', 270, 286, 36, PAR.ink, { weight: 700, sp: 4 });
  parText('A F R I C A', 248, 1146, 34, PAR.ink, { weight: 700, sp: 5 });
  parText('A S I A', 902, 1408, 28, PAR.ink, { weight: 700, sp: 4 });
  parText('SUEZ', 630, 568, 22, PAR.ink, { weight: 700, sp: 2 });
}
