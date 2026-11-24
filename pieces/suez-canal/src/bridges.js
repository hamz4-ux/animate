
// =====================================================================
//  CAMERAS + BRIDGES — read by kit/morph.js
//  F1: no bridges (the camera is the transition). pieceCam() holds on a
//  station, then takes a ~1.0s eased pan to the next one.
// =====================================================================
const ERA_BG = [PAR.paper, PAR.paper, PAR.paper, PAR.paper, PAR.paper, PAR.paper];
const BRIDGES = [];

// an eased pan from one station to another over [a, b], then hold
function parPan(t, from, to, a, b) {
  const A = STATIONS[from], Bs = STATIONS[to], u = EZ.io(seg(t, a, b));
  const z = Math.exp(lerp(Math.log(A.z), Math.log(Bs.z), u));
  const x = lerp(A.p[0], Bs.p[0], u), y = lerp(A.p[1], Bs.p[1], u);
  return camOf({ z, p: [x, y], to: [W / 2, H / 2] });
}

function pieceCam(era, t) {
  // era 0  port: a slow push in from a little wider
  if (era === 0) {
    const u = EZ.io(seg(t, 0.0, 4.5)), A = STATIONS.port;
    const z = lerp(A.z * 0.82, A.z, u);
    return camOf({ z, p: A.p, to: [W / 2, H / 2] });
  }
  // era 1  the long way: pan out to the ocean, then keep drifting south with the ship
  if (era === 1) {
    if (t < 5.7) return parPan(t, 'port', 'cape', 4.55, 5.7);
    const u = EZ.io(seg(t, 5.7, 10.0)), A = STATIONS.cape;
    return camOf({ z: lerp(A.z, A.z * 1.12, u), p: [lerp(A.p[0], 400, u), lerp(A.p[1], 1200, u)], to: [W / 2, H / 2] });
  }
  // era 2  isthmus: pan from the wide ocean into the neck
  if (era === 2) return parPan(t, 'cape', 'isthmus', 9.55, 10.7);
  // era 3  the cut: hold tight, with a slow push so the held image still breathes
  if (era === 3) {
    const u = EZ.io(seg(t, 14.0, 17.0)), A = STATIONS.isthmus;
    return camOf({ z: lerp(A.z, A.z * 1.18, u), p: A.p, to: [W / 2, H / 2] });
  }
  // era 4  the short way: pull back to see the route, then pan east toward Asia
  if (era === 4) {
    if (t < 18.0) return parPan(t, 'isthmus', 'wide', 16.55, 17.7);
    return parPan(t, 'wide', 'asia', 20.6, 21.8);
  }
  // era 5  reveal: pull all the way back to the whole sheet, then keep closing in, slowly
  if (t < 25.2) return parPan(t, 'asia', 'wide', 23.55, 25.2);
  const u = EZ.io(seg(t, 25.2, 30.0)), A = STATIONS.wide;
  return camOf({ z: lerp(A.z, A.z * 1.07, u), p: [lerp(A.p[0], 640, u), lerp(A.p[1], 900, u)], to: [W / 2, H / 2] });
}
