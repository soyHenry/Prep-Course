// Generates a brand-consistent animated Lottie icon from an SVG source.
//
//   node scripts/make-icon.mjs lucide:bell
//   node scripts/make-icon.mjs tabler:heart --preset heartbeat --accent 0
//   node scripts/make-icon.mjs ./my-icon.svg --name my-icon --preset reveal,attention
//
// Every visual decision (canvas, stroke, colors, timing, easing) comes from
// brand/identity.json, so the whole family stays coherent. Each generated icon
// is recorded in brand/icons.json; `npm run icons:build` regenerates them all.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import svgpath from "svgpath";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const identityPath = resolve(root, "brand/identity.json");
const manifestPath = resolve(root, "brand/icons.json");
const outProject = resolve(root, "public/projects/brand-icons");

// ---------- source resolution ----------

function resolveSource(src) {
  const [lib, name] = src.includes(":") && !existsSync(src) ? src.split(":") : [null, src];
  if (lib === "lucide") return resolve(root, `node_modules/lucide-static/icons/${name}.svg`);
  if (lib === "tabler") return resolve(root, `node_modules/@tabler/icons/icons/outline/${name}.svg`);
  if (lib) throw new Error(`Unknown library "${lib}" (use lucide:, tabler: or a file path)`);
  return resolve(process.cwd(), src);
}

// ---------- SVG -> path data ----------

const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const num = (v, d = 0) => (v === undefined ? d : parseFloat(v));

function elementToPath(tag, a) {
  switch (tag) {
    case "path":
      return a.d;
    case "line":
      return `M${a.x1} ${a.y1}L${a.x2} ${a.y2}`;
    case "polyline":
    case "polygon": {
      const pts = a.points.trim().split(/[\s,]+/).map(Number);
      let d = `M${pts[0]} ${pts[1]}`;
      for (let i = 2; i < pts.length; i += 2) d += `L${pts[i]} ${pts[i + 1]}`;
      return tag === "polygon" ? d + "Z" : d;
    }
    case "circle":
    case "ellipse": {
      const cx = num(a.cx), cy = num(a.cy);
      const rx = num(a.rx ?? a.r), ry = num(a.ry ?? a.r);
      // Start at the top so draw-on reveals read clockwise like a clock hand.
      return `M${cx} ${cy - ry}A${rx} ${ry} 0 0 1 ${cx} ${cy + ry}A${rx} ${ry} 0 0 1 ${cx} ${cy - ry}Z`;
    }
    case "rect": {
      const x = num(a.x), y = num(a.y), w = num(a.width), h = num(a.height);
      let rx = num(a.rx ?? a.ry), ry = num(a.ry ?? a.rx);
      rx = Math.min(rx, w / 2);
      ry = Math.min(ry, h / 2);
      if (!rx || !ry) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
      return (
        `M${x + rx} ${y}H${x + w - rx}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}` +
        `V${y + h - ry}A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}` +
        `H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}` +
        `V${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`
      );
    }
  }
  return null;
}

export function parseSvg(svg) {
  const elements = [];
  for (const m of svg.matchAll(/<(path|circle|rect|line|polyline|polygon|ellipse)\b([^>]*?)\/?>/g)) {
    const a = attrs(m[2]);
    if (a.stroke === "none") continue; // e.g. Tabler's invisible bounding box
    const d = elementToPath(m[1], a);
    if (d) elements.push(d);
  }
  return elements;
}

// ---------- path data -> Lottie bezier ----------

const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const near = (p, q) => Math.abs(p[0] - q[0]) < 1e-3 && Math.abs(p[1] - q[1]) < 1e-3;
const r4 = (n) => Math.round(n * 1e4) / 1e4;
const rp = (p) => [r4(p[0]), r4(p[1])];

export function toBeziers(d) {
  const shapes = [];
  let cur = null, pt = [0, 0], start = [0, 0];
  const open = (p) => {
    cur = { v: [p], i: [[0, 0]], o: [[0, 0]], c: false };
    shapes.push(cur);
  };
  const lineTo = (p) => {
    if (!cur || cur.c) open(pt);
    cur.v.push(p); cur.i.push([0, 0]); cur.o.push([0, 0]);
    pt = p;
  };
  const curveTo = (c1, c2, p) => {
    if (!cur || cur.c) open(pt);
    cur.o[cur.o.length - 1] = sub(c1, pt);
    cur.v.push(p); cur.i.push(sub(c2, p)); cur.o.push([0, 0]);
    pt = p;
  };
  svgpath(d).abs().unarc().unshort().iterate((s) => {
    const [cmd, ...n] = s;
    if (cmd === "M") { pt = start = [n[0], n[1]]; open(pt); }
    else if (cmd === "L") lineTo([n[0], n[1]]);
    else if (cmd === "H") lineTo([n[0], pt[1]]);
    else if (cmd === "V") lineTo([pt[0], n[0]]);
    else if (cmd === "C") curveTo([n[0], n[1]], [n[2], n[3]], [n[4], n[5]]);
    else if (cmd === "Q") {
      const q = [n[0], n[1]], p = [n[2], n[3]];
      curveTo([pt[0] + (2 / 3) * (q[0] - pt[0]), pt[1] + (2 / 3) * (q[1] - pt[1])],
              [p[0] + (2 / 3) * (q[0] - p[0]), p[1] + (2 / 3) * (q[1] - p[1])], p);
    } else if (cmd === "Z" || cmd === "z") {
      if (cur && cur.v.length > 1 && near(cur.v[cur.v.length - 1], cur.v[0])) {
        cur.v.pop(); cur.o.pop();
        cur.i[0] = cur.i.pop();
      }
      if (cur) cur.c = true;
      pt = start;
    }
  });
  return shapes
    .filter((s) => s.v.length > 1)
    .map((s) => ({ v: s.v.map(rp), i: s.i.map(rp), o: s.o.map(rp), c: s.c }));
}

function bbox(shapes) {
  const xs = shapes.flatMap((s) => s.v.map((v) => v[0]));
  const ys = shapes.flatMap((s) => s.v.map((v) => v[1]));
  return (Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1);
}

// ---------- motion ----------

export const hex = (h) => {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1].map(r4);
};

/** Builds an animated property from [{t, v, ease?}] keyframes (ease applies leaving the key). */
export function animated(rawKeys, ease) {
  // Consecutive steps share a boundary frame; keep one key per frame (the later step's).
  const keys = rawKeys.filter((k, i) => rawKeys[i + 1]?.t !== k.t);
  if (keys.length < 2) return { a: 0, k: keys[0].v };
  return {
    a: 1,
    k: keys.map((key, idx) => {
      const k = { t: key.t, s: Array.isArray(key.v) ? key.v : [key.v] };
      if (idx < keys.length - 1) {
        const [x1, y1, x2, y2] = key.ease ?? ease;
        const dims = k.s.length;
        k.o = { x: Array(dims).fill(x1), y: Array(dims).fill(y1) };
        k.i = { x: Array(dims).fill(x2), y: Array(dims).fill(y2) };
      }
      return k;
    }),
  };
}

/** Each motion step appends keyframes starting at frame `t` and returns its duration. */
function motionSteps(id, ctx) {
  const m = id.motion, e = m.easing, S = ctx.scale, C = ctx.center;
  return {
    draw: (t) => {
      ctx.drawStart = t;
      return m.draw.duration + m.draw.stagger * (ctx.count - 1);
    },
    pop: (t) => {
      const d = m.pop.duration, up = S * (1 + m.pop.amount);
      ctx.scaleKeys.push({ t, v: [S, S], ease: e.out }, { t: t + d * 0.4, v: [up, up], ease: e.inOut }, { t: t + d, v: [S, S] });
      return d;
    },
    pulse: (t) => {
      const d = m.pulse.duration, a = S * (1 + m.pulse.amount), b = S * (1 + m.pulse.amount * 0.6);
      ctx.scaleKeys.push(
        { t, v: [S, S], ease: e.out }, { t: t + d * 0.2, v: [a, a], ease: e.inOut },
        { t: t + d * 0.45, v: [S, S], ease: e.out }, { t: t + d * 0.65, v: [b, b], ease: e.inOut },
        { t: t + d, v: [S, S] });
      return d;
    },
    wiggle: (t) => {
      const d = m.wiggle.duration, a = m.wiggle.angle;
      [0, a, -a * 0.7, a * 0.4, -a * 0.15, 0].forEach((v, i, arr) =>
        ctx.rotKeys.push({ t: t + (d * i) / (arr.length - 1), v, ease: e.inOut }));
      return d;
    },
    spin: (t) => {
      ctx.rotKeys.push({ t, v: 0, ease: e.inOut }, { t: t + m.spin.duration, v: 360 });
      return m.spin.duration;
    },
    bounce: (t) => {
      const d = m.bounce.duration, h = m.bounce.height * (S / 100);
      const sq = [S * 1.08, S * 0.92], st = [S * 0.94, S * 1.06];
      ctx.posKeys.push({ t, v: [C, C], ease: e.out }, { t: t + d * 0.45, v: [C, C - h], ease: [0.55, 0, 0.75, 0] },
                       { t: t + d * 0.8, v: [C, C], ease: e.out }, { t: t + d, v: [C, C] });
      ctx.scaleKeys.push({ t, v: [S, S], ease: e.out }, { t: t + d * 0.25, v: st, ease: e.inOut },
                         { t: t + d * 0.8, v: [S, S], ease: e.out }, { t: t + d * 0.88, v: sq, ease: e.out },
                         { t: t + d, v: [S, S] });
      return d;
    },
  };
}

// ---------- build ----------

export async function buildIcon(entry, id) {
  const svg = await readFile(resolveSource(entry.source), "utf8");
  const elements = parseSvg(svg).map(toBeziers).filter((s) => s.length);
  if (!elements.length) throw new Error(`No drawable elements in ${entry.source}`);

  const size = id.canvas.size, grid = id.grid.size;
  const ctx = {
    count: elements.length,
    scale: ((size - 2 * id.grid.padding) / grid) * 100,
    center: size / 2,
    drawStart: null, scaleKeys: [], rotKeys: [], posKeys: [],
  };

  const stepIds = entry.preset.split(",").flatMap((p) => id.presets[p] ?? [p]);
  const steps = motionSteps(id, ctx);
  let t = 0;
  for (const s of stepIds) {
    if (!steps[s]) throw new Error(`Unknown motion "${s}". Steps: ${Object.keys(steps)}; presets: ${Object.keys(id.presets)}`);
    t += steps[s](t);
  }
  const op = Math.round(t + id.motion.hold);

  // Two-tone rule: explicit accent indices, otherwise the smallest detail gets the secondary color.
  let accent = entry.accent;
  if (accent === undefined) {
    accent = elements.length > 1 ? [elements.map(bbox).reduce((mi, a, i, arr) => (a < arr[mi] ? i : mi), 0)] : [];
  }

  const caps = { butt: 1, round: 2, square: 3 }, joins = { miter: 1, round: 2, bevel: 3 };
  const colors = { primary: hex(id.colors.primary), secondary: hex(id.colors.secondary) };
  const groups = elements.map((shapes, idx) => {
    const role = accent.includes(idx) ? "secondary" : "primary";
    const it = shapes.map((ks, j) => ({ ty: "sh", nm: `Path ${j + 1}`, ks: { a: 0, k: ks } }));
    if (ctx.drawStart !== null) {
      const t0 = ctx.drawStart + idx * id.motion.draw.stagger;
      it.push({
        ty: "tm", nm: "Draw", m: 1, s: { a: 0, k: 0 }, o: { a: 0, k: 0 },
        e: animated([{ t: t0, v: 0 }, { t: t0 + id.motion.draw.duration, v: 100 }], id.motion.easing.out),
      });
    }
    it.push(
      { ty: "st", nm: "Stroke", c: { a: 0, k: colors[role], sid: role }, o: { a: 0, k: 100 },
        w: { a: 0, k: id.stroke.width, sid: "strokeWidth" }, lc: caps[id.stroke.cap], lj: joins[id.stroke.join], ml: 4 },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
    );
    return { ty: "gr", nm: `${role} ${idx + 1}`, it };
  });

  const S = ctx.scale, C = ctx.center, ease = id.motion.easing.inOut;
  const lottie = {
    v: "5.12.0", fr: id.canvas.fps, ip: 0, op, w: size, h: size,
    nm: `${entry.name} - ${entry.preset}`, ddd: 0, assets: [],
    slots: {
      primary: { p: { a: 0, k: colors.primary } },
      secondary: { p: { a: 0, k: colors.secondary } },
      strokeWidth: { p: { a: 0, k: id.stroke.width } },
    },
    layers: [{
      ddd: 0, ind: 1, ty: 4, nm: entry.name, sr: 1, ip: 0, op, st: 0, bm: 0,
      ks: {
        o: { a: 0, k: 100 },
        a: { a: 0, k: [grid / 2, grid / 2, 0] },
        p: ctx.posKeys.length ? animated(ctx.posKeys, ease) : { a: 0, k: [C, C, 0] },
        s: ctx.scaleKeys.length ? animated(ctx.scaleKeys, ease) : { a: 0, k: [S, S, 100] },
        r: ctx.rotKeys.length ? animated(ctx.rotKeys, ease) : { a: 0, k: 0 },
      },
      shapes: groups,
    }],
  };
  const controls = {
    controls: [
      { sid: "primary", label: "Primary color" },
      { sid: "secondary", label: "Secondary color" },
      { sid: "strokeWidth", label: "Stroke width", min: 0.5, max: 4, step: 0.25 },
    ],
  };

  const dir = resolve(outProject, entry.name);
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, "lottie.json"), JSON.stringify(lottie));
  await writeFile(resolve(dir, "controls.json"), JSON.stringify(controls, null, 2) + "\n");
  return { dir, op, elements: elements.length, accent };
}

export async function loadIdentity() {
  return JSON.parse(await readFile(identityPath, "utf8"));
}

export async function loadManifest() {
  return existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, "utf8")) : { icons: [] };
}

// ---------- CLI ----------

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const source = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
  if (!source) {
    console.error("Usage: node scripts/make-icon.mjs <lucide:name|tabler:name|file.svg> [--name n] [--preset reveal] [--accent 0,2]");
    process.exit(1);
  }
  const opt = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
  const entry = {
    name: opt("name") ?? basename(source.split(":").pop(), ".svg"),
    source,
    preset: opt("preset") ?? "reveal",
    ...(opt("accent") !== undefined && { accent: opt("accent") === "none" ? [] : opt("accent").split(",").map(Number) }),
  };
  const result = await buildIcon(entry, await loadIdentity());
  const manifest = await loadManifest();
  manifest.icons = manifest.icons.filter((i) => i.name !== entry.name).concat(entry);
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`✓ ${entry.name}: ${result.elements} elements, accent ${JSON.stringify(result.accent)}, ${result.op} frames -> ${result.dir}`);
}
