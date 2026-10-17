// Regenerates every icon listed in brand/icons.json with the current brand/identity.json.
import { buildIcon, loadIdentity, loadManifest } from "./make-icon.mjs";

const id = await loadIdentity();
const { icons } = await loadManifest();
for (const entry of icons) {
  const r = await buildIcon(entry, id);
  console.log(`✓ ${entry.name} (${entry.preset}, ${r.op} frames)`);
}
console.log(`${icons.length} icons rebuilt.`);
