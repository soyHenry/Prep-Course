// Renders pinned frames of an icon in the official Skottie player into one contact-sheet PNG.
//
//   node scripts/snapshot.mjs bell [out.png] [--port 3030] [--frames 0,20,40]
//
// Requires the player running (`npm run dev`).
import { chromium } from "playwright-core";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const pi = args.indexOf("--port");
const port = pi >= 0 ? args.splice(pi, 2)[1] : "3030";
const fi = args.indexOf("--frames");
const pinned = fi >= 0 ? args.splice(fi, 2)[1].split(",").map(Number) : null;
const [name, out = resolve(root, `previews/${name}.png`)] = args;
if (!name) {
  console.error("Usage: node scripts/snapshot.mjs <icon-name> [out.png] [--port 3030] [--frames 0,20,40]");
  process.exit(1);
}

const { op } = JSON.parse(await readFile(resolve(root, `public/projects/brand-icons/${name}/lottie.json`), "utf8"));
const frames = pinned ?? [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1].map((f) => Math.min(op - 1, Math.round(f * (op - 1))));

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
// The player fits the scene into a square inset 100px from the top/bottom of the canvas.
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
const clip = { x: 100, y: 100, width: 700, height: 700 };
// Hide the player UI so only the rendered scene is captured.
await page.addInitScript(() => document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = "* { visibility: hidden !important } #main-canvas { visibility: visible !important }";
  document.head.append(style);
}));
const shots = [];
for (const f of frames) {
  await page.goto(`http://localhost:${port}/brand-icons/${name}?frame=${f}`, { waitUntil: "networkidle" });
  await page.waitForSelector("#main-canvas");
  await page.waitForTimeout(600);
  shots.push({ f, png: (await page.screenshot({ clip })).toString("base64") });
}
await page.setContent(`<body style="margin:0;display:flex;gap:8px;padding:8px;background:#fff;font:12px sans-serif">${
  shots.map((s) => `<figure style="margin:0;text-align:center"><img src="data:image/png;base64,${s.png}" width="200"><figcaption>frame ${s.f}</figcaption></figure>`).join("")
}</body>`);
await page.setViewportSize({ width: 8 + shots.length * 208, height: 250 });
await page.screenshot({ path: out });
await browser.close();
console.log(`✓ ${out}`);
