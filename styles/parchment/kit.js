// =====================================================================
//  styles/parchment/kit.js — antique cartography on old vellum.
//  Bone-pale vellum, sepia ink coastlines that boil on 2s, bronze landwash
//  with hatched shadow along the shores, pale sea hatch and a fine wave
//  grid, a single gold route, compass rose, rhumb lines, sea monster,
//  vignette + grain. Tiny ink stickmen and galleons.
//  Colour means one thing: GOLD = the route, SEA = water.
// =====================================================================
const PAR = {
  vellum: '#efe3c6', vellumD: '#e2d2ad', vellumL: '#f7efd9',
  land: '#e7d5ae', landD: '#d6bd8c', landHatch: '#a98a56',
  ink: '#3b2a1b', inkL: '#6d5334', inkFaint: 'rgba(59,42,27,0.5)',
  sea: '#aec2c1', seaD: '#8aa9a8', seaLine: '#6a8b89',
  gold: '#b07a1e', goldL: '#d9a53c',
  red: '#7d3a26',
};

// a filled shape in the medium. P world points; o: fill, line, w, key
function parShape(P, c, o = {}) {
  ctx.save(); trace(o.raw ? P : wobble(P, true, o.amt ?? 0.5, o.key ?? 'par', 9), true);
  ctx.fillStyle = c; ctx.fill();
  if (o.line !== false) { ctx.lineWidth = o.w ?? 3; ctx.strokeStyle = o.line || PAR.ink; ctx.lineJoin = 'round'; ctx.stroke(); }
  ctx.restore();
}

// serif map text, with write-on (o.frac 0..1) and letter-spacing
function parText(str, x, y, size, color, o = {}) {
  ctx.save();
  ctx.font = `${o.weight ?? 600} ${size}px ${o.font ?? '"DejaVu Serif", Georgia, "Times New Roman", serif'}`;
  ctx.fillStyle = color; ctx.textAlign = o.align ?? 'left';
  const sp = o.sp ?? 0, frac = clamp(o.frac ?? 1);
  let w = 0;
  for (const ch of str) w += ctx.measureText(ch).width + sp;
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  if (frac < 1) { ctx.beginPath(); ctx.rect(x0 - 6, y - size * 1.25, w * frac + 12, size * 1.7); ctx.clip(); }
  if (frac > 0) { let cx = x0; for (const ch of str) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + sp; } }
  ctx.restore(); return w;
}

// tiny minimalist stickman. h = full height in px. pose: idle | walk | wave | dig | carry | point
function parStickman(x, y, h, o = {}) {
  const key = o.key ?? 'man', pose = o.pose ?? 'idle';
  const lw = Math.max(1.8, h * 0.11), c = o.color || PAR.ink;
  const idle = Math.sin(TT * TAU * 0.8 + key.length) * h * 0.012;
  const stride = pose === 'walk' ? Math.sin(TT * TAU * 1.6 + key.length) * h * 0.16 : 0;
  const bob = pose === 'walk' ? Math.abs(Math.sin(TT * TAU * 1.6)) * h * 0.035 : idle;
  const headR = h * 0.095, headY = y - h + headR + bob, shY = y - h * 0.66 + bob, hipY = y - h * 0.34 + bob;
  ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.arc(x, headY, headR, 0, TAU); ctx.fill();                     // head
  ctx.beginPath(); ctx.moveTo(x, headY + headR); ctx.lineTo(x, hipY); ctx.stroke();   // spine
  ctx.beginPath();                                                                    // legs
  ctx.moveTo(x, hipY); ctx.lineTo(x - stride - h * 0.1, y);
  ctx.moveTo(x, hipY); ctx.lineTo(x + stride + h * 0.1, y); ctx.stroke();
  ctx.beginPath();                                                                    // arms
  if (pose === 'wave') {
    const wv = Math.sin(TT * TAU * 2.6) * h * 0.06;
    ctx.moveTo(x, shY); ctx.lineTo(x - h * 0.16, shY + h * 0.14);
    ctx.moveTo(x, shY); ctx.lineTo(x + h * 0.16, shY - h * 0.24 + wv);
  } else if (pose === 'dig') {
    const dg = Math.sin(TT * TAU * 2.4 + key.length) * h * 0.07;
    ctx.moveTo(x, shY); ctx.lineTo(x + h * 0.2, shY + h * 0.1 + dg);
    ctx.moveTo(x, shY); ctx.lineTo(x + h * 0.26, shY + h * 0.26 + dg);
  } else if (pose === 'carry') {
    ctx.moveTo(x, shY); ctx.lineTo(x - h * 0.22, shY + h * 0.06);
    ctx.moveTo(x, shY); ctx.lineTo(x + h * 0.22, shY + h * 0.06);
  } else if (pose === 'point') {
    const sw = Math.sin(TT * TAU * 0.8) * h * 0.03;
    ctx.moveTo(x, shY); ctx.lineTo(x - h * 0.16, shY + h * 0.18 + sw);
    ctx.moveTo(x, shY); ctx.lineTo(x + h * 0.26, shY - h * 0.06);
  } else {
    const sw = Math.sin(TT * TAU * 0.8 + key.length) * h * 0.03;
    ctx.moveTo(x, shY); ctx.lineTo(x - h * 0.16, shY + h * 0.18 + sw);
    ctx.moveTo(x, shY); ctx.lineTo(x + h * 0.16, shY + h * 0.18 - sw);
  }
  ctx.stroke();
  if (pose === 'dig') {   // the shovel
    const dg = Math.sin(TT * TAU * 2.4 + key.length) * h * 0.07;
    ctx.beginPath(); ctx.moveTo(x + h * 0.2, shY + h * 0.1 + dg); ctx.lineTo(x + h * 0.4, y - h * 0.02 + dg); ctx.stroke();
  }
  ctx.restore();
}

// ink galleon. s = hull length; flip 1 sails right, -1 left; gold pennant on the hero
function parShip(x, y, s, o = {}) {
  const key = o.key ?? 'ship', flip = o.flip ?? 1;
  const rock = Math.sin(TT * TAU * 0.55 + key.length * 2) * s * 0.025;
  ctx.save(); ctx.translate(x, y + rock); ctx.scale(flip, 1);
  const hull = parSmooth([[-s * 0.5, -s * 0.02], [-s * 0.34, s * 0.17], [s * 0.36, s * 0.17], [s * 0.52, -s * 0.02], [s * 0.3, -s * 0.06], [-s * 0.36, -s * 0.06]], true, 1);
  parShape(hull, PAR.ink, { raw: true, line: PAR.ink, w: Math.max(1.5, s * 0.02) });
  ctx.strokeStyle = PAR.ink; ctx.lineWidth = Math.max(1.5, s * 0.035); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-s * 0.1, 0); ctx.lineTo(-s * 0.1, -s * 0.66); ctx.moveTo(s * 0.22, 0); ctx.lineTo(s * 0.22, -s * 0.5); ctx.stroke();
  // sails: pale vellum bellied by the wind
  const sail = (ax, top, bot) => parShape(parSmooth([[ax, top], [ax + s * 0.04, bot], [ax + s * 0.03, (top + bot) / 2], [ax - s * 0.02, top]], true, 1), PAR.vellumL, { raw: true, w: Math.max(1.2, s * 0.018) });
  sail(-s * 0.1, -s * 0.62, -s * 0.1);
  sail(s * 0.22, -s * 0.46, -s * 0.1);
  // lateen fore-sail
  parShape([[s * 0.22, -s * 0.5], [s * 0.44, -s * 0.04], [s * 0.24, -s * 0.06]], PAR.vellumL, { raw: true, w: Math.max(1.2, s * 0.018) });
  if (o.gold) parShape([[s * 0.22, -s * 0.5], [s * 0.4, -s * 0.44], [s * 0.22, -s * 0.38]], PAR.gold, { raw: true, line: PAR.ink, w: 1.2 });
  ctx.restore();
}

// compass rose: 8-point star in a double ring
function parCompass(x, y, r) {
  ctx.save(); ctx.strokeStyle = PAR.ink; ctx.fillStyle = PAR.ink; ctx.lineWidth = Math.max(1.6, r * 0.045);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r * 0.74, 0, TAU); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = i * TAU / 8 - Math.PI / 2, L = i % 2 ? r * 0.42 : r * 0.66, w = r * 0.075;
    const ux = Math.cos(a), uy = Math.sin(a), vx = -uy, vy = ux;
    ctx.beginPath(); ctx.moveTo(x + ux * L, y + uy * L);
    ctx.lineTo(x + vx * w, y + vy * w); ctx.lineTo(x - ux * L * 0.22, y - uy * L * 0.22); ctx.lineTo(x - vx * w, y - vy * w);
    ctx.closePath(); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(x, y, r * 0.085, 0, TAU); ctx.fill();
  ctx.restore();
}

// sea monster: an arcing tail, a neck and a head (the mysterious touch)
function parMonster(x, y, s, o = {}) {
  const key = o.key ?? 'mon', sw = Math.sin(TT * TAU * 0.45 + key.length) * s * 0.05;
  ctx.save(); ctx.strokeStyle = PAR.ink; ctx.fillStyle = PAR.ink; ctx.lineWidth = Math.max(2, s * 0.07); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.62, y + s * 0.06); ctx.quadraticCurveTo(x - s * 0.13, y - s * 0.26, x + s * 0.12, y + s * 0.02); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + s * 0.12, y + s * 0.02); ctx.quadraticCurveTo(x + s * 0.26, y - s * 0.5 + sw, x + s * 0.56, y - s * 0.44 + sw); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x + s * 0.64, y - s * 0.42 + sw, s * 0.13, s * 0.09, 0.35, 0, TAU); ctx.fill();
  ctx.fillStyle = PAR.vellum; ctx.beginPath(); ctx.arc(x + s * 0.67, y - s * 0.45 + sw, s * 0.032, 0, TAU); ctx.fill();
  ctx.fillStyle = PAR.ink;
  ctx.beginPath(); ctx.moveTo(x - s * 0.3, y - s * 0.2); ctx.lineTo(x - s * 0.16, y - s * 0.42); ctx.lineTo(x - s * 0.06, y - s * 0.18); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - s * 0.08, y - s * 0.24); ctx.lineTo(x + s * 0.06, y - s * 0.44); ctx.lineTo(x + s * 0.14, y - s * 0.2); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// =====================================================================
//  STYLE — renderer hooks
// =====================================================================
const STYLE = {
  name: 'parchment',
  paper: PAR.vellum,
  backdrop(c) { fillAll(c); grain({ key: 'g', n: 2400 }); },
  window(P, key, src) {
    ctx.save(); trace(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore();
    ctx.save(); trace(P, true); ctx.lineWidth = 5; ctx.strokeStyle = PAR.ink; ctx.stroke(); ctx.restore();
  },
  blob(P, c, key) { parShape(P, c, { key, raw: true }); },
  hero(x, y, r, o) { SPARK_AT = toScreen(x, y); parShip(x, y, r * 1.7, { key: (o && o.key) || 'hero', gold: true, flip: (o && o.flip) || 1 }); },
  heroColor: PAR.gold,
  post() {
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.66);
    g.addColorStop(0, 'rgba(48,32,14,0)'); g.addColorStop(1, 'rgba(48,32,14,0.4)');
    ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  },
  ones: false,
};
