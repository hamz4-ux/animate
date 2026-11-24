// =====================================================================
//  GEO — one parchment sheet, 1080x1920. The sheet is SEA; land is drawn
//  on top of it, as antique maps do. Relative geography is modern:
//    Mediterranean: a broad band W→E between Europe (N) and Africa (S),
//    closing at the Isthmus of Suez; Red Sea: a narrow strip running SE
//    between Africa (W) and Arabia (E); Gulf of Aden and the Arabian Sea
//    open E; India is SE; the Atlantic is the strip on the W edge (the
//    long way round leaves the sheet there and comes back at the Cape).
//  Outlines are smoothed with parSmooth() (Chaikin) so they read as coasts.
// =====================================================================

function parSmooth(P, closed = true, n = 2) {
  let Q = P;
  for (let k = 0; k < n; k++) {
    const out = [], m = Q.length, lim = closed ? m : m - 1;
    if (!closed) out.push(Q[0]);
    for (let i = 0; i < lim; i++) {
      const a = Q[i], b = Q[(i + 1) % m];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    if (!closed) out.push(Q[m - 1]);
    Q = out;
  }
  return Q;
}

const GEO = {
  // ---------- land ----------
  // Europe: the top band; its south coast scalloped into peninsulas
  europe: [[-60, -60], [1140, -60], [1140, 148], [1040, 166], [960, 180], [900, 224], [848, 234], [792, 220],
           [736, 252], [700, 304], [662, 334], [640, 382], [604, 412], [560, 404], [520, 432], [470, 426],
           [420, 458], [360, 444], [300, 472], [230, 454], [170, 478], [110, 460], [60, 432], [-60, 422]],
  // Africa: north coast W->E to the isthmus, the Red Sea's west shore SE,
  // the Horn, the Indian Ocean coast S, the Cape, the Atlantic coast N
  africa: [[-60, 552], [40, 538], [110, 554], [180, 546], [250, 564], [320, 554], [390, 572], [450, 564],
           [500, 580], [548, 558], [584, 544], [596, 552],
           [600, 580], [606, 616], [614, 656], [626, 700], [640, 744], [656, 786], [674, 820],
           [700, 834], [726, 826], [738, 846],
           [724, 878], [706, 926], [692, 976], [678, 1028], [662, 1080], [642, 1130], [618, 1180],
           [588, 1230], [552, 1280], [512, 1330], [466, 1378], [416, 1424], [360, 1464], [300, 1500],
           [238, 1524], [176, 1534], [120, 1522], [84, 1484], [62, 1432], [46, 1372], [36, 1302],
           [26, 1222], [20, 1136], [18, 1048], [26, 988], [44, 948], [64, 930], [62, 860], [66, 780],
           [70, 700], [70, 636], [66, 588], [40, 558], [-60, 552]],
  // Asia: the Levant, then the Red Sea's east shore SE, Arabia's south coast,
  // the Indian Ocean coast, India, up the right edge, back along the north
  asia: [[604, 412], [614, 452], [620, 496], [614, 524], [604, 548],
         [628, 566], [642, 604], [654, 648], [666, 692], [678, 736], [690, 780], [702, 822], [714, 852],
         [740, 866], [770, 892], [800, 908], [830, 952], [856, 1000], [872, 1080], [884, 1160],
         [862, 1252], [872, 1332], [898, 1400], [936, 1500], [974, 1620], [992, 1740], [1000, 1980],
         [1140, 1980], [1140, 148], [1040, 166], [960, 180], [900, 224], [848, 234], [792, 220],
         [736, 252], [700, 304], [662, 334], [640, 382]],
  // islands: two in the Mediterranean, Socotra in the Arabian Sea
  islands: [
    [[292, 506], [322, 500], [332, 512], [314, 522], [294, 518]],
    [[420, 512], [458, 506], [470, 514], [448, 522], [422, 520]],
    [[764, 942], [788, 934], [796, 948], [772, 956]],
  ],
  // the Isthmus: the pinch where the Mediterranean and the Red Sea nearly meet
  suez: [604, 552],
  // the cut, once dug: a channel from the Mediterranean into the Red Sea
  cut: [[594, 538], [604, 554], [614, 572]],
  // ---------- named places ----------
  port: [232, 528],
  asiaPort: [900, 1176],
  cape: [300, 1506],
  // ---------- the long way round (leaves the sheet at the W edge) ----------
  oldRoute: [[238, 530], [170, 522], [96, 516], [30, 524], [8, 580], [12, 700], [8, 830], [12, 960],
             [20, 1090], [30, 1215], [48, 1340], [84, 1444], [146, 1512], [220, 1544], [296, 1544],
             [366, 1512], [424, 1458], [474, 1390], [512, 1318], [546, 1238], [580, 1160], [616, 1082],
             [654, 1010], [690, 950], [724, 900], [757, 878], [800, 902], [838, 948], [858, 1024],
             [874, 1104], [890, 1180]],
  // ---------- the short way through the cut ----------
  newRoute: [[238, 530], [340, 536], [440, 530], [520, 524], [568, 528], [590, 540], [604, 554],
             [614, 572], [624, 612], [638, 660], [652, 708], [666, 756], [682, 802], [700, 836],
             [724, 862], [757, 878], [800, 902], [838, 948], [858, 1024], [874, 1104], [890, 1180]],
};

// camera stations: z = zoom, p = the world point held at the frame's centre
const STATIONS = {
  port:    { z: 2.6, p: [262, 512] },
  cape:    { z: 0.98, p: [430, 1040] },
  isthmus: { z: 3.0, p: [600, 556] },
  wide:    { z: 1.0, p: [520, 940] },
  asia:    { z: 1.95, p: [800, 960] },
  sheet:   { z: 1.0, p: [540, 980] },
};
