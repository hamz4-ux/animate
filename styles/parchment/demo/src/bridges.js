// =====================================================================
//  CAMERAS + BRIDGES — parchment demo. Two stations, one pan, no cuts.
// =====================================================================
const ERA_BG = [PAR.paper, PAR.paper];
const BRIDGES = [];

function parPan(t, from, to, a, b) {
  const A = STATIONS[from], Bs = STATIONS[to], u = EZ.io(seg(t, a, b));
  const z = Math.exp(lerp(Math.log(A.z), Math.log(Bs.z), u));
  return camOf({ z, p: [lerp(A.p[0], Bs.p[0], u), lerp(A.p[1], Bs.p[1], u)], to: [W / 2, H / 2] });
}

function pieceCam(era, t) {
  if (era === 0) { const u = EZ.io(seg(t, 0.0, 2.8)), A = STATIONS.port; return camOf({ z: lerp(A.z * 0.9, A.z, u), p: A.p, to: [W / 2, H / 2] }); }
  if (t < 3.7) return parPan(t, 'port', 'cape', 2.55, 3.7);
  const u = EZ.io(seg(t, 3.7, 6.0)), A = STATIONS.cape;
  return camOf({ z: lerp(A.z, A.z * 1.1, u), p: [lerp(A.p[0], 420, u), lerp(A.p[1], 1150, u)], to: [W / 2, H / 2] });
}
