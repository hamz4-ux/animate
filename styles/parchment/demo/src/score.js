  // SCORE BODY — parchment demo: a drone, one pluck, a pulse as the ship sails.
  to = 'm';
  drone(0.0, 3.1, nz('D2'), 0.055, { att: 1.0, rel: 0.5 });
  pad(0.1, 3.0, ['D3', 'A3'], 0.022, { type: 'triangle', cut: 700, att: 0.8, rel: 0.5, send: 0.5 });
  pluck(0.5, nz('A4'), 0.10, -0.2, 0.9, 2200, 0.5);
  pad(3.0, 6.05, ['D2', 'A2', 'D3', 'F3'], 0.040, { type: 'sawtooth', cut: 1000, att: 0.3, rel: 0.8, send: 0.5 });
  for (let i = 0; i < 6; i++) bass(3.0 + i * 0.5, nz(i % 2 ? 'D2' : 'A2'), 0.09);
  to = 's';
  for (let i = 0; i < 4; i++) noiseHit(3.2 + i * 0.72, 0.4, 'bandpass', 700, 1.2, 0.035, -0.3, 0.3, 380);
