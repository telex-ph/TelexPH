import test from "node:test";
import assert from "node:assert/strict";
import { moveNode, removeNode, setSpan, duplicateNode, nudge, NEW_BLOCK } from "./newsletter-layout.js";

const b = (t) => ({ type: "text", title: t, paragraphs: [] });
const design = () => ({ sections: [{ type: "columns", cols: [{ span: 6, blocks: [b("a"), b("c")] }, { span: 6, blocks: [b("b")] }] }] });
const col = (i) => ["sections", 0, "cols", i, "blocks"];

test("moveNode across columns keeps the block and returns its new path", () => {
  const { design: d, path } = moveNode(design(), [...col(0), 0], col(1), 1);
  assert.deepEqual(d.sections[0].cols.map((c) => c.blocks.map((x) => x.title)), [["c"], ["b", "a"]]);
  assert.deepEqual(path, [...col(1), 1]);
});

test("moveNode inside one list accounts for the removed item", () => {
  const { design: d } = moveNode(design(), [...col(0), 0], col(0), 2);
  assert.deepEqual(d.sections[0].cols[0].blocks.map((x) => x.title), ["c", "a"]);
});

test("emptying a column removes it and hands its width to the first column", () => {
  const d = removeNode(design(), [...col(1), 0]);
  assert.equal(d.sections[0].cols.length, 1);
  assert.equal(d.sections[0].cols[0].span, 12);
});

test("setSpan trades width with the neighbour and refuses to go under 2", () => {
  const d = setSpan(design(), ["sections", 0, "cols", 0], 8);
  assert.deepEqual(d.sections[0].cols.map((c) => c.span), [8, 4]);
  assert.equal(setSpan(d, ["sections", 0, "cols", 0], 11), d);
});

test("duplicate and nudge work on a copy and never change the input", () => {
  const d0 = design();
  const { design: d, path } = duplicateNode(d0, [...col(0), 0]);
  assert.deepEqual(path, [...col(0), 1]);
  assert.equal(d0.sections[0].cols[0].blocks.length, 2);
  assert.deepEqual(nudge(d, [...col(0), 0], 1).sections[0].cols[0].blocks.map((x) => x.title), ["a", "a", "c"]);
});

test("new blocks have a type and something to show", () => {
  for (const [type, make] of Object.entries(NEW_BLOCK)) assert.equal(make().type, type);
});

import { patchFloat, moveFloatTo, reorderFloat, NEW_FLOAT } from "./newsletter-layout.js";

const withFloats = () => ({ sections: [{ type: "ribbon", text: "a", floats: [NEW_FLOAT.shape("star"), NEW_FLOAT.text("body"), NEW_FLOAT.emoji("⭐")] }, { type: "ribbon", text: "b" }] });

test("a floating element can be changed, sent to the back and moved onto another section", () => {
  const d = withFloats();
  const [a, b, c] = d.sections[0].floats;
  assert.equal(patchFloat(d, 0, 0, { x: 5 }).sections[0].floats[0].x, 5);
  assert.equal(d.sections[0].floats[0].x, a.x); // the input is not changed
  const back = reorderFloat(d, ["sections", 0, "floats", 2], "back");
  assert.deepEqual(back.design.sections[0].floats.map((f) => f.id), [c.id, a.id, b.id]);
  assert.deepEqual(back.path, ["sections", 0, "floats", 0]);
  assert.equal(reorderFloat(d, ["sections", 0, "floats", 2], "front").design, d); // already on top
  const moved = moveFloatTo(d, 0, 1, 1, { y: 9 });
  assert.equal(moved.design.sections[0].floats.length, 2);
  assert.equal(moved.design.sections[1].floats[0].id, b.id);
  assert.equal(moved.design.sections[1].floats[0].y, 9);
  assert.deepEqual(moved.path, ["sections", 1, "floats", 0]);
});

test("duplicating a floating element gives the copy its own id and a small offset", () => {
  const d = withFloats();
  const { design, path } = duplicateNode(d, ["sections", 0, "floats", 0]);
  const [orig, copy] = design.sections[0].floats;
  assert.notEqual(copy.id, orig.id);
  assert.equal(copy.x, orig.x + 2);
  assert.deepEqual(path, ["sections", 0, "floats", 1]);
});

import { patchFloats, removeFloats, setGroup, duplicateFloats, reorderFloats } from "./newsletter-layout.js";

test("several floating elements can be grouped, copied, reordered and removed together", () => {
  let d = withFloats();
  const ids = d.sections[0].floats.map((f) => f.id);
  d = setGroup(d, 0, [ids[0], ids[1]], "gx");
  assert.deepEqual(d.sections[0].floats.map((f) => f.g), ["gx", "gx", undefined]);
  assert.equal("g" in setGroup(d, 0, [ids[0]], undefined).sections[0].floats[0], false);
  const dup = duplicateFloats(d, 0, [ids[0], ids[1]]);
  assert.equal(dup.design.sections[0].floats.length, 5);
  const [c0, c1] = dup.design.sections[0].floats.slice(3);
  assert.equal(c0.g, c1.g);
  assert.notEqual(c0.g, "gx"); // the copy is a group of its own
  assert.deepEqual(reorderFloats(d, 0, [ids[0]], "front").sections[0].floats.map((f) => f.id), [ids[1], ids[2], ids[0]]);
  assert.equal(patchFloats(d, 0, { [ids[2]]: { x: 77 } }).sections[0].floats[2].x, 77);
  assert.deepEqual(removeFloats(d, 0, [ids[0], ids[2]]).sections[0].floats.map((f) => f.id), [ids[1]]);
});
