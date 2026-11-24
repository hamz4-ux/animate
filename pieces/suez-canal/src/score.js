  // SCORE BODY — suez-canal. A quiet, mysterious drone; one hit on the cut.
  // Source: the loop out (Europe -> Africa -> Asia) becomes a cut, so the
  // arc is: thin drone (build) -> a walking pulse (journey) -> picks (dig)
  // -> a hard stop (silence) -> chord stab + sub (gift) -> decay (goodbye).
  const T = TIMELINE, cu = T.cues;
  to = 'm';
  // 1. port: a low drone with one distant pluck, no rhythm yet
  drone(0.0, 5.1, nz('D2'), 0.055, { att: 1.2, rel: 0.6 });
  pad(0.2, 5.0, ['D3', 'A3'], 0.020, { type: 'triangle', cut: 700, att: 1.0, rel: 0.5, send: 0.55 });
  pluck(0.6, nz('A4'), 0.10, -0.2, 0.9, 2200, 0.5);
  pluck(2.1, nz('D4'), 0.07, 0.2, 0.9, 1800, 0.5);
  // 2. the long way: a slow walking pulse, the ship's effort
  drone(5.0, 10.1, nz('A2'), 0.055, { att: 0.5, rel: 0.5 });
  pad(5.0, 10.0, ['D3', 'F3', 'A3'], 0.024, { type: 'triangle', cut: 800, att: 0.7, rel: 0.6, send: 0.5 });
  for (let i = 0; i < 10; i++) { bass(5.0 + i * 0.5, nz(i % 2 ? 'D2' : 'A2'), 0.09); }
  for (let i = 0; i < 5; i++) pluck(5.25 + i * 1.0, nz('D4'), 0.06, i % 2 ? 0.3 : -0.3, 0.7, 2400, 0.45);
  to = 's';
  for (let i = 0; i < 6; i++) noiseHit(5.3 + i * 0.85, 0.5, 'bandpass', 700, 1.2, 0.035, -0.3, 0.3, 380);   // wind
  // 3. the isthmus: picks (dry noise), a rising unease
  to = 'm';
  pad(10.0, 14.0, ['D2', 'A2', 'C4'], 0.026, { type: 'sawtooth', cut: 620, att: 0.9, rel: 0.6, send: 0.5 });
  drone(10.0, 14.0, nz('D2'), 0.05, { att: 0.6, rel: 0.6 });
  to = 's';
  for (let i = 0; i < 16; i++) noiseHit(10.4 + i * 0.22, 0.075, 'bandpass', 1500 + (i % 3) * 600, 3, 0.07, -0.15 + (i % 2) * 0.3);   // picks
  to = 'm';
  // 4. the cut: a riser, then everything stops at 15.9
  riser(14.4, 15.6, 0.10);
  to = 's';
  noiseHit(14.6, 1.2, 'lowpass', 900, 0.8, 0.09, 0, 0.4, 260);   // the dig through
  to = 'm';
  pad(14.0, 15.75, ['D3', 'F3', 'A3', 'D4'], 0.030, { type: 'sawtooth', cut: 900, att: 0.6, rel: 0.2, send: 0.5 });
  drone(14.0, 15.7, nz('D2'), 0.045, { att: 0.3, rel: 0.2 });
  // 16.05–16.95: the held image in near silence (craft: 0.5-4s) — nothing but the room
  // 5. the short way: the payoff — chord stab + sub on 17.0, then full
  sub(17.0, 0.42);
  chime(17.0, [nz('D5'), nz('A5'), nz('D6')], 0.30);
  pad(17.0, 24.05, ['D2', 'A2', 'D3', 'F3', 'A3'], 0.050, { type: 'sawtooth', cut: 1400, att: 0.12, rel: 0.8, send: 0.6 });
  for (let i = 0; i < 14; i++) { bass(17.0 + i * 0.5, nz(i % 4 === 2 ? 'F2' : i % 2 ? 'A2' : 'D2'), 0.10); }
  [['D5', 0], ['A5', 0.5], ['F5', 1.0], ['E5', 1.5], ['D5', 2.0], ['A5', 2.5], ['D6', 3.0]].forEach(([n, dt]) => pluck(17.25 + dt, nz(n), 0.10, (dt / 3) * 0.5 - 0.25, 0.8, 3200, 0.5));
  to = 's';
  for (let i = 0; i < 8; i++) noiseHit(17.4 + i * 0.62, 0.12, 'highpass', 5200, 1.5, 0.030, 0.3);   // sails in the water
  to = 'm';
  // 6. the reveal: the pad decays away, one last pluck as the whole sheet shows
  pad(24.0, 29.4, ['D2', 'A2', 'D3', 'A3'], 0.034, { type: 'triangle', cut: 900, att: 1.2, rel: 2.2, send: 0.6 });
  drone(24.0, 29.6, nz('D2'), 0.035, { att: 0.8, rel: 2.0 });
  pluck(25.4, nz('D5'), 0.09, 0, 1.4, 2400, 0.7);
  pluck(27.2, nz('A4'), 0.07, -0.15, 1.6, 2000, 0.7);
  chime(28.2, [nz('D5'), nz('A5')], 0.13);
