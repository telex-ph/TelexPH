// Pure helpers for editing a newsletter design (version 2: sections -> cols -> blocks). No React, no DOM.
// Paths look like ["sections", 2, "cols", 0, "blocks", 1]. Every function returns a new design; the input is never changed.

export const getAt = (o, path) => path.reduce((v, k) => v?.[k], o);
export const setAt = (o, path, value) => {
  if (!path.length) return value;
  const [k, ...rest] = path;
  const copy = Array.isArray(o) ? [...o] : { ...o };
  copy[k] = setAt(o?.[k], rest, value);
  return copy;
};
export const same = (a, b) => !!a && !!b && a.length === b.length && a.every((k, i) => k === b[i]);

const parent = (path) => path.slice(0, -1);
const clone = (v) => JSON.parse(JSON.stringify(v));

// A column that lost all its blocks is dropped (its width goes to the first column left); a columns section with no
// columns is dropped too. Without this the editor would show empty gaps the public page never has.
export function prune(d) {
  const sections = d.sections.map((s) => {
    if (s.type !== "columns") return s;
    const cols = s.cols.filter((c) => c.blocks.length);
    if (cols.length && cols.length !== s.cols.length) {
      const lost = s.cols.reduce((n, c) => n + c.span, 0) - cols.reduce((n, c) => n + c.span, 0);
      cols[0] = { ...cols[0], span: cols[0].span + lost };
    }
    return { ...s, cols };
  }).filter((s) => s.type !== "columns" || s.cols.length);
  return { ...d, sections };
}

export function findPath(d, node, path = []) {
  if (d === node) return path;
  if (!d || typeof d !== "object") return null;
  for (const k of Object.keys(d)) {
    const hit = findPath(d[k], node, [...path, Array.isArray(d) ? Number(k) : k]);
    if (hit) return hit;
  }
  return null;
}

export const removeNode = (d, path) => prune(setAt(d, parent(path), getAt(d, parent(path)).filter((_, i) => i !== path.at(-1))));

export function insertNode(d, arrPath, index, node) {
  const arr = [...(getAt(d, arrPath) || [])];
  arr.splice(Math.max(0, Math.min(index, arr.length)), 0, node);
  return setAt(d, arrPath, arr);
}

// Move a section/block one place up (-1) or down (+1) inside its own list.
export function nudge(d, path, dir) {
  const arrPath = parent(path);
  const arr = [...getAt(d, arrPath)];
  const i = path.at(-1);
  const j = i + dir;
  if (j < 0 || j >= arr.length) return d;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return setAt(d, arrPath, arr);
}

// Move any node to `index` of the list at `toArrPath` (drag and drop). Returns { design, path } with the node's new path.
export function moveNode(d, fromPath, toArrPath, index) {
  const node = getAt(d, fromPath);
  const fromArr = parent(fromPath);
  const i = fromPath.at(-1);
  const at = same(fromArr, toArrPath) && i < index ? index - 1 : index;
  if (same(fromArr, toArrPath) && at === i) return { design: d, path: fromPath };
  const design = prune(insertNode(setAt(d, fromArr, getAt(d, fromArr).filter((_, k) => k !== i)), toArrPath, at, node));
  return { design, path: findPath(design, node) };
}

export const uid = () => Math.random().toString(36).slice(2, 8);

// Insert a copy right after the original. Returns { design, path } of the copy. A floating element gets its own id
// and sits a little to the side so the copy is visible.
export function duplicateNode(d, path) {
  const copy = clone(getAt(d, path));
  if (copy.id) { copy.id = uid(); copy.x += 2; copy.y += 2; }
  const design = insertNode(d, parent(path), path.at(-1) + 1, copy);
  return { design, path: findPath(design, copy) };
}

// Give a column a new width; the neighbour (next one, or previous for the last column) gives or takes the difference.
export function setSpan(d, colPath, span) {
  const cols = getAt(d, parent(colPath));
  const i = colPath.at(-1);
  const other = cols[i + 1] ? i + 1 : i - 1;
  if (other < 0) return d;
  const next = Math.round(span);
  const delta = next - cols[i].span;
  if (next < 2 || cols[other].span - delta < 2) return d;
  return setAt(setAt(d, [...parent(colPath), i, "span"], next), [...parent(colPath), other, "span"], cols[other].span - delta);
}

export const NEW_BLOCK = {
  hero: () => ({ type: "hero", tag: "Spotlight", title: "Big headline", subtitle: "Short line under it", stats: [{ value: "10", label: "Label" }, { value: "20", label: "Label" }, { value: "30", label: "Label" }] }),
  story: () => ({ type: "story", eyebrow: "THE STORY", headline: "Your headline", accent: "second line", paragraphs: ["Write your story here."] }),
  text: () => ({ type: "text", eyebrow: "", title: "Heading", paragraphs: ["Write something here."] }),
  quote: () => ({ type: "quote", text: "A sentence worth highlighting.", cite: "Name, role" }),
  timeline: () => ({ type: "timeline", eyebrow: "THE JOURNEY", items: [{ date: "MONTH", title: "First step", text: "What happened." }, { date: "MONTH", title: "Next step", text: "What happened." }] }),
  kpis: () => ({ type: "kpis", eyebrow: "SCORECARD", items: [{ value: "00", label: "Label", note: "" }, { value: "00", label: "Label", note: "" }] }),
  stat: () => ({ type: "stat", value: "0,000", label: "things done", note: "" }),
  cards: () => ({ type: "cards", eyebrow: "HIGHLIGHTS", items: [{ n: "01", title: "First", text: "Short description" }, { n: "02", title: "Second", text: "Short description" }] }),
  photos: () => ({ type: "photos", eyebrow: "MEET THE TEAM", items: [{ caption: "" }, { caption: "" }] }),
  image: () => ({ type: "image", caption: "" })
};

export const NEW_SECTION = {
  columns: () => ({ type: "columns", cols: [{ span: 12, blocks: [NEW_BLOCK.text()] }] }),
  band: () => ({ type: "band", bg: "#a10000", color: "#ffffff", align: "left", title: "", subtitle: "", text: "Thank you for reading." }),
  ribbon: () => ({ type: "ribbon", text: "COMPANY NEWSLETTER" }),
  masthead: () => ({ type: "masthead", brand: "TELEX", logo: undefined, label: "", sub: "" }),
  footer: () => ({ type: "footer", columns: [{ title: "", text: "" }], note: "" }),
  canvas: () => ({ type: "canvas", h: 40, floats: [] })
};

export const NAMES = { canvas: "Free canvas", ftext: "Text box", shape: "Shape", fpic: "Photo", ribbon: "Top strip", masthead: "Masthead", band: "Banner", columns: "Columns", footer: "Footer", hero: "Cover", story: "Story", quote: "Quote", timeline: "Timeline", kpis: "Scorecard", stat: "Big number", cards: "Cards", photos: "Photos", image: "Photo", text: "Text", list: "Checklist", callout: "Callout", boxes: "Boxes" };

// Short label for the layers list: the kind of node plus the first bit of text it has.
export function labelOf(node) {
  const bit = node.text || node.kind || node.title || node.headline || node.text || node.brand || node.eyebrow || node.value || node.note || node.paragraphs?.[0] || node.items?.[0]?.title || node.items?.[0]?.caption || node.columns?.[0]?.title || "";
  return { name: NAMES[node.type] || node.type, bit: String(bit).slice(0, 34) };
}

// ---- Floating elements: free-placed text boxes, shapes and photos that sit on a section (design.sections[i].floats).
// x, w are % of the page width; y, h are also % of the page width (so a shape keeps its proportions at any width);
// text boxes have no h (they grow with their text). Shapes: see newsletter-shapes.js.
export const NEW_FLOAT = {
  shape: (kind = "rect", color = "#a10000") => ({ id: uid(), type: "shape", kind, x: 38, y: 6, w: kind === "line" || kind === "arrow-line" ? 24 : 16, h: kind === "line" || kind === "arrow-line" ? 1 : 16, rot: 0, opacity: 1, fill: kind === "line" || kind === "arrow-line" ? "" : color, fa: 1, stroke: kind === "line" || kind === "arrow-line" ? color : "", sw: kind === "line" || kind === "arrow-line" ? 4 : 0, r: 14 }),
  text: (preset = "body") => ({ id: uid(), type: "ftext", x: 30, y: 6, w: 40, rot: 0, opacity: 1, ...{ heading: { text: "Add a heading", size: 4, weight: 800 }, sub: { text: "Add a subheading", size: 2.4, weight: 700 }, body: { text: "Add a little bit of body text", size: 1.5, weight: 400 } }[preset], italic: false, underline: false, upper: false, align: "left", color: "#282828", family: "sans", ls: 0, lh: 1.25, bg: "" }),
  emoji: (ch) => ({ id: uid(), type: "ftext", x: 44, y: 6, w: 12, rot: 0, opacity: 1, text: ch, size: 7, weight: 400, italic: false, underline: false, upper: false, align: "center", color: "#282828", family: "sans", ls: 0, lh: 1.1, bg: "" }),
  photo: (img) => ({ id: uid(), type: "fpic", x: 34, y: 6, w: 30, h: 20, rot: 0, opacity: 1, img, r: 0 })
};

export const patchFloat = (d, sec, i, patch) => setAt(d, ["sections", sec, "floats", i], { ...getAt(d, ["sections", sec, "floats", i]), ...patch });

// A float dragged onto another section moves to that section's list (on top). Returns { design, path }.
export function moveFloatTo(d, sec, i, toSec, patch) {
  const f = { ...getAt(d, ["sections", sec, "floats", i]), ...patch };
  const without = setAt(d, ["sections", sec, "floats"], getAt(d, ["sections", sec, "floats"]).filter((_, k) => k !== i));
  const design = insertNode(without, ["sections", toSec, "floats"], 9999, f);
  return { design, path: findPath(design, f) };
}

// Layer order is list order (last = on top). where: "front" | "back" | "forward" | "backward". Returns { design, path }.
export function reorderFloat(d, path, where) {
  const arrPath = path.slice(0, -1);
  const arr = [...getAt(d, arrPath)];
  const i = path.at(-1);
  const to = where === "front" ? arr.length - 1 : where === "back" ? 0 : Math.max(0, Math.min(arr.length - 1, i + (where === "forward" ? 1 : -1)));
  if (to === i) return { design: d, path };
  const [f] = arr.splice(i, 1);
  arr.splice(to, 0, f);
  return { design: setAt(d, arrPath, arr), path: [...arrPath, to] };
}

// ---- Several floating elements at once (all in one section). `ids` are element ids.
export const floatsOf = (d, sec) => d.sections[sec]?.floats || [];
const setFloats = (d, sec, list) => setAt(d, ["sections", sec, "floats"], list);

// patches: { [id]: patch }
export const patchFloats = (d, sec, patches) => setFloats(d, sec, floatsOf(d, sec).map((f) => (patches[f.id] ? { ...f, ...patches[f.id] } : f)));

export const removeFloats = (d, sec, ids) => setFloats(d, sec, floatsOf(d, sec).filter((f) => !ids.includes(f.id)));

// Elements with the same group id are selected and moved together. g = undefined takes them out of their group.
export function setGroup(d, sec, ids, g) {
  return setFloats(d, sec, floatsOf(d, sec).map((f) => {
    if (!ids.includes(f.id)) return f;
    const { g: _old, ...rest } = f; // eslint-disable-line no-unused-vars
    return g ? { ...rest, g } : rest;
  }));
}

// Copies go on top, a little to the side; a copied group stays a group of its own. Returns { design, ids }.
export function duplicateFloats(d, sec, ids) {
  const groups = {};
  const copies = floatsOf(d, sec).filter((f) => ids.includes(f.id)).map((f) => {
    const c = clone(f);
    c.id = uid();
    c.x += 2;
    c.y += 2;
    if (c.g) c.g = groups[c.g] ||= `g${uid()}`;
    return c;
  });
  return { design: setFloats(d, sec, [...floatsOf(d, sec), ...copies]), ids: copies.map((c) => c.id) };
}

// The chosen elements go to the front or back as one block, keeping their order among themselves.
export function reorderFloats(d, sec, ids, where) {
  const all = floatsOf(d, sec);
  const picked = all.filter((f) => ids.includes(f.id));
  const rest = all.filter((f) => !ids.includes(f.id));
  return setFloats(d, sec, where === "back" ? [...picked, ...rest] : [...rest, ...picked]);
}
