import test from "node:test";
import assert from "node:assert/strict";
import { applySlotValues, readTextSlotValue } from "../src/lib/lottie.ts";

const TEXTS = [
  "alpha · beta · gamma",
  "café",
  "İ",
  "ç ğ ı ö ş ü",
  "complete ✓",
  "left → right",
];

const MOJIBAKE = ["Â·", "cafÃ©", "Ä°", "Ã§", "Ä", "Ä±", "Ã¶", "Å", "Ã¼", "â", "â"];

const textIds = TEXTS.map((_, index) => `text${index}`);

function makeDoc() {
  return {
    slots: Object.fromEntries([
      ["bgColor", { p: { a: 0, k: [0, 0, 0, 1] } }],
      // Text slots use `a:1` with keyframed documents; color/scalar slots stay `a:0`.
      ...textIds.map((id, index) => [id, { p: { a: 1, k: [textKeyframe(TEXTS[index])] } }]),
    ]),
    layers: textIds.map((id, index) => ({
      ty: 5,
      nm: `${id}-layer`,
      t: { d: { sid: id, k: [textKeyframe(TEXTS[index])] } },
    })),
  };
}

function textKeyframe(text) {
  return { t: 0, s: { t: text, f: "Inter", s: 32 } };
}

// Keyframed text slots must be `a:1`; `a:0` or missing `a` can render blank.
function textSlotsMissingAnimatedFlag(doc) {
  return Object.entries(doc.slots ?? {})
    .filter(([, def]) => typeof def?.p?.k?.[0]?.s?.t === "string")
    .filter(([, def]) => def.p.a !== 1)
    .map(([id]) => id);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function commitSlots(doc, overrides = {}) {
  return [
    { id: "bgColor", type: "color", value: [0.25, 0.5, 0.75, 1] },
    ...textIds.map((id) => ({ id, type: "text", value: overrides[id] ?? readTextSlotValue(doc, id) ?? "" })),
  ];
}

function assertTextIntegrity(doc, expected = TEXTS) {
  for (const [index, text] of expected.entries()) {
    const id = textIds[index];
    const values = [
      doc.slots[id].p.k[0].s.t,
      ...doc.layers.filter((layer) => layer.t?.d?.sid === id).map((layer) => layer.t.d.k[0].s.t),
    ];

    assert.ok(values.length > 1, `${id} should have a slot and a bound layer fallback`);
    for (const value of values) {
      assert.equal(value, text);
      for (const marker of MOJIBAKE) assert.equal(value.includes(marker), false);
    }
  }
}

test("non-text commits preserve Unicode text slots without CanvasKit text getters", () => {
  const doc = clone(makeDoc());
  const slots = commitSlots(doc);

  assert.deepEqual(slots.find((slot) => slot.id === "bgColor")?.value, [0.25, 0.5, 0.75, 1]);
  assertTextIntegrity(doc);

  applySlotValues(doc, slots);

  assert.deepEqual(doc.slots.bgColor.p.k, [0.25, 0.5, 0.75, 1]);
  assertTextIntegrity(doc);
});

test("text edits write both the slot document and bound layer fallback", () => {
  const doc = clone(makeDoc());
  const edited = "crème brûlée → done ✓";
  const slots = commitSlots(doc, { text1: edited });
  const expected = [...TEXTS];
  expected[1] = edited;

  applySlotValues(doc, slots);

  assertTextIntegrity(doc, expected);
});

test("keyframed text slots must be a:1 or Skottie renders them blank", () => {
  // The canonical fixture must model the render-safe shape.
  assert.deepEqual(textSlotsMissingAnimatedFlag(makeDoc()), []);

  // A missing `a` next to a keyframed text-document array is the blank-render footgun.
  const missingFlag = { slots: { headline: { p: { k: [textKeyframe("hi")] } } } };
  assert.deepEqual(textSlotsMissingAnimatedFlag(missingFlag), ["headline"]);

  // `a: 0` with a keyframe array is the same footgun and must be flagged.
  const staticFlag = { slots: { headline: { p: { a: 0, k: [textKeyframe("hi")] } } } };
  assert.deepEqual(textSlotsMissingAnimatedFlag(staticFlag), ["headline"]);

  // Color/scalar slots (a:0 + plain value) are not text slots and must not be flagged.
  const colorSlot = { slots: { bgColor: { p: { a: 0, k: [0, 0, 0, 1] } } } };
  assert.deepEqual(textSlotsMissingAnimatedFlag(colorSlot), []);
});
