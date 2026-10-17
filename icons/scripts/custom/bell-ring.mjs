// Hand-choreographed notification bell, the quality reference for the family.
//
// Markers (play them as segments, like Lordicon triggers):
//   "in"   0-40   stroke draws on, clapper pops in
//   "ring" 45-120 anticipation, damped swing from the top pivot, lagging clapper,
//                 two sound-wave pulses
//
//   node scripts/custom/bell-ring.mjs
import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { toBeziers, hex, animated, loadIdentity } from "../make-icon.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const id = await loadIdentity();
const E = id.motion.easing;
const swing = [0.45, 0, 0.55, 1];

const NAME = "bell-ring";
const OP = 120;
const IN = { t: 0, dr: 40 };
const RING = { t: 45, dr: 75 };

const paths = {
  body: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
  clapper: "M10.268 21a2 2 0 0 0 3.464 0",
  waveL: "M4 2C2.8 3.7 2 5.7 2 8",
  waveR: "M22 8c0-2.3-.8-4.3-2-6",
};

const colors = { primary: hex(id.colors.primary), secondary: hex(id.colors.secondary) };
const still = (k) => ({ a: 0, k });
const keys = (list, ease = swing) => animated(list.map(([t, v, e]) => ({ t, v, ...(e && { ease: e }) })), ease);

function group(d, role, trim) {
  const it = toBeziers(d).map((ks, j) => ({ ty: "sh", nm: `Path ${j + 1}`, ks: still(ks) }));
  if (trim) it.push({ ty: "tm", nm: "Trim", m: 1, o: still(0), ...trim });
  it.push(
    { ty: "st", nm: "Stroke", c: { a: 0, k: colors[role], sid: role }, o: still(100),
      w: { a: 0, k: id.stroke.width, sid: "strokeWidth" }, lc: 2, lj: 2, ml: 4 },
    { ty: "tr", p: still([0, 0]), a: still([0, 0]), s: still([100, 100]), r: still(0), o: still(100) },
  );
  return { ty: "gr", nm: role, it };
}

function layer(ind, nm, { parent, ks, shapes, ty = 4 }) {
  return {
    ddd: 0, ind, ty, nm, sr: 1, ip: 0, op: OP, st: 0, bm: 0,
    ...(parent && { parent }),
    ks: { o: still(100), r: still(0), p: still([0, 0, 0]), a: still([0, 0, 0]), s: still([100, 100, 100]), ...ks },
    ...(shapes && { shapes }),
  };
}

// --- root: maps the 24-unit grid onto the canvas, with a subtle squash on the anticipation
const S = ((id.canvas.size - 2 * id.grid.padding) / id.grid.size) * 100;
const C = id.canvas.size / 2;
const r = RING.t;
const rootLayer = layer(1, "root", {
  ty: 3,
  ks: {
    a: still([12, 12, 0]),
    p: still([C, C, 0]),
    s: keys([[r, [S, S, 100]], [r + 8, [S * 1.03, S * 0.96, 100], E.out], [r + 16, [S, S, 100]]], E.inOut),
  },
});

// --- bell body: swings from the hanger at the top, amplitude decaying like a real pendulum
const pivot = [12, 2.5, 0];
const swingKeys = [[r, 0], [r + 8, -7], [r + 18, 18], [r + 29, -14], [r + 40, 9], [r + 51, -5], [r + 61, 2], [r + 70, 0]];
const bell = layer(5, "bell", {
  parent: 1,
  ks: { a: still(pivot), p: still(pivot), r: keys(swingKeys) },
  shapes: [group(paths.body, "primary", {
    s: still(0),
    e: keys([[IN.t, 0], [IN.t + 30, 100]], E.out),
  })],
});

// --- clapper: hangs inside the bell and trails its swing by a few frames (follow-through)
const hinge = [12, 17, 0];
const clapper = layer(4, "clapper", {
  parent: 5,
  ks: {
    a: still(hinge),
    p: still(hinge),
    s: keys([[18, [0, 0, 100]], [30, [118, 118, 100], E.out], [38, [100, 100, 100]]], E.overshoot),
    r: keys([[r + 4, 0], [r + 13, 8], [r + 23, -16], [r + 34, 13], [r + 45, -8], [r + 56, 4], [r + 66, -1.5], [r + 74, 0]]),
  },
  shapes: [group(paths.clapper, "secondary")],
});

// --- sound waves: two pulses that draw out, drift away from the bell and fade
function wave(ind, nm, d, dir, anchor) {
  const pulses = [r + 12, r + 38]; // each pulse spans 25 frames; keep them from overlapping
  const op = [[0, 0]], trimE = [[0, 0]], trimS = [[0, 0]], pos = [[0, anchor]];
  for (const t of pulses) {
    const far = [anchor[0] + dir * 1.1, anchor[1] - 0.5, 0];
    op.push([t, 0], [t + 4, 100], [t + 16, 100], [t + 24, 0]);
    trimE.push([t, 0, E.out], [t + 10, 100], [t + 23, 100], [t + 24, 0]);
    trimS.push([t, 0], [t + 12, 0, E.inOut], [t + 23, 100], [t + 24, 0]);
    pos.push([t, anchor, E.out], [t + 24, far], [t + 25, anchor]);
  }
  return layer(ind, nm, {
    parent: 1,
    ks: { a: still(anchor), p: keys(pos, E.out), o: keys(op, E.inOut) },
    shapes: [group(d, "secondary", { s: keys(trimS, E.inOut), e: keys(trimE, E.out) })],
  });
}
const waveL = wave(2, "wave left", paths.waveL, -1, [3, 5, 0]);
const waveR = wave(3, "wave right", paths.waveR, 1, [21, 5, 0]);

const lottie = {
  v: "5.12.0", fr: id.canvas.fps, ip: 0, op: OP, w: id.canvas.size, h: id.canvas.size,
  nm: "Bell - in / ring", ddd: 0, assets: [],
  markers: [{ tm: IN.t, cm: "in", dr: IN.dr }, { tm: RING.t, cm: "ring", dr: RING.dr }],
  slots: {
    primary: { p: still(colors.primary) },
    secondary: { p: still(colors.secondary) },
    strokeWidth: { p: still(id.stroke.width) },
  },
  layers: [waveL, waveR, clapper, bell, rootLayer],
};

const dir = resolve(root, `public/projects/brand-icons/${NAME}`);
await mkdir(dir, { recursive: true });
await writeFile(resolve(dir, "lottie.json"), JSON.stringify(lottie));
await writeFile(resolve(dir, "controls.json"), JSON.stringify({
  controls: [
    { sid: "primary", label: "Primary color" },
    { sid: "secondary", label: "Secondary color" },
    { sid: "strokeWidth", label: "Stroke width", min: 0.5, max: 4, step: 0.25 },
  ],
}, null, 2) + "\n");
console.log(`✓ ${NAME} -> ${dir}`);
