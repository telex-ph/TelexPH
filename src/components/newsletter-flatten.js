// "Ungroup": turns what a section looks like on screen into separate floating elements (text, boxes, lines, photos), so
// every piece can be moved, resized and edited on its own. It reads the real positions and styles from the page in the
// editor instead of knowing about each block type, so every block (and any new one) converts the same way.
//
// Pieces that came from the same block (or the same card / step / column inside it) get the same group id `g`, so they
// still select and move together until you double-click to pick one of them.
import { uid } from "@/lib/newsletter-layout";

const r2 = (n) => Math.round(n * 100) / 100;
const px = (v) => parseFloat(v) || 0;
const COLOR = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+)(%?))?\s*\)/;

function color(str) {
  const m = COLOR.exec(str || "");
  if (!m) return null;
  const h = (v) => Math.round(Number(v)).toString(16).padStart(2, "0");
  let a = m[4] === undefined ? 1 : Number(m[4]);
  if (m[5]) a /= 100;
  return { hex: `#${h(m[1])}${h(m[2])}${h(m[3])}`, a };
}

// "linear-gradient(135deg, rgb(..), rgba(..) 70%)" -> { angle, stops: [{ c, a, p }] }
function gradient(bg) {
  const m = /^linear-gradient\(([\s\S]*)\)$/.exec(bg || "");
  if (!m) return null;
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const ch of m[1]) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && !depth) { parts.push(cur.trim()); cur = ""; } else cur += ch;
  }
  parts.push(cur.trim());
  let angle = 180;
  if (/^-?[\d.]+deg$/.test(parts[0])) angle = ((parseFloat(parts.shift()) % 360) + 360) % 360;
  else if (parts[0].startsWith("to ")) angle = { "to top": 0, "to top right": 45, "to right": 90, "to bottom right": 135, "to bottom": 180, "to bottom left": 225, "to left": 270, "to top left": 315 }[parts.shift()] ?? 180;
  const stops = parts.slice(0, 4).map((p) => { const c = color(p); const at = /([\d.]+)%\s*$/.exec(p); return c && { c: c.hex, a: c.a, p: at ? Number(at[1]) : null }; }).filter(Boolean);
  if (stops.length < 2) return null;
  stops[0].p ??= 0;
  stops.at(-1).p ??= 100;
  for (let i = 1; i < stops.length - 1; i++) { // a stop without a position sits halfway between its neighbours
    if (stops[i].p !== null) continue;
    let j = i + 1;
    while (stops[j].p === null) j++;
    stops[i].p = stops[i - 1].p + (stops[j].p - stops[i - 1].p) / (j - i + 1);
  }
  return { angle, stops: stops.map((s) => ({ ...s, p: Math.round(s.p) })) };
}

const weightOf = (w) => { const n = Number(w) || 400; return n >= 850 ? 900 : n >= 750 ? 800 : n >= 650 ? 700 : n >= 550 ? 600 : 400; };
const familyOf = (f) => (/Poppins/i.test(f) ? "sans" : /Arial Black|Impact/i.test(f) ? "display" : /Courier|monospace/i.test(f) ? "mono" : /Brush|cursive|Script/i.test(f) ? "script" : /Georgia|serif/i.test(f) ? "serif" : "sans");

function imageOf(img) {
  const cs = getComputedStyle(img);
  const [x, y] = (cs.objectPosition || "50% 50%").split(" ").map((v) => Math.min(100, Math.max(0, parseFloat(v) || 50)));
  const m = /matrix\(([-\d.]+)/.exec(cs.transform || "");
  return { url: img.currentSrc || img.src, x: Math.round(x), y: Math.round(y), zoom: Math.min(3, Math.max(1, m ? Number(m[1]) : 1)) };
}

// One section element -> { h, floats }. `u` is the screen width of 1% of the page.
export function flattenSection(secEl, u) {
  const sr = secEl.getBoundingClientRect();
  const floats = [];
  const groups = new Map();
  const gid = (key) => { if (!groups.has(key)) groups.set(key, `g${groups.size + 1}`); return groups.get(key); };
  const rel = (r) => ({ x: r2((r.left - sr.left) / u), y: r2((r.top - sr.top) / u), w: r2(r.width / u), h: r2(r.height / u) });
  // Every piece is its own element (no group id), so it can be picked, replaced and deleted alone. Group them yourself with Ctrl+G.
  const add = (f) => floats.push({ id: uid(), rot: 0, opacity: 1, ...f });

  // Something inside an element that clips (overflow hidden) and reaches out of it was a decoration: leave it out.
  const clipped = (el, r) => {
    for (let a = el.parentElement; a && a !== secEl; a = a.parentElement) {
      if (getComputedStyle(a).overflow === "visible") continue;
      const ar = a.getBoundingClientRect();
      if (r.left < ar.left - 2 || r.right > ar.right + 2 || r.top < ar.top - 2 || r.bottom > ar.bottom + 2) return true;
    }
    return false;
  };

  const box = (el, r, cs, z, g) => {
    const bg = color(cs.backgroundColor);
    const grad = gradient(cs.backgroundImage);
    const widths = ["Top", "Right", "Bottom", "Left"].map((s) => (cs[`border${s}Style`] === "none" ? 0 : px(cs[`border${s}Width`]) * z));
    const colors = ["Top", "Right", "Bottom", "Left"].map((s) => color(cs[`border${s}Color`]));
    const hasBorder = widths.some((w) => w > 0.2);
    const shadow = cs.boxShadow && cs.boxShadow !== "none";
    if (!(bg?.a > 0) && !grad && !hasBorder && !shadow) return;
    const uniform = hasBorder && widths.every((w) => Math.abs(w - widths[0]) < 0.2) && colors.every((c) => c && c.hex === colors[0].hex);
    const rad = px(cs.borderTopLeftRadius) * z;
    const square = Math.abs(r.width - r.height) < 2;
    const kind = rad >= Math.min(r.width, r.height) / 2 - 0.5 && square ? "circle" : rad > 0.5 ? "rounded" : "rect";
    const shape = {
      type: "shape", kind, ...rel(r), r: Math.min(50, r2(rad / u)), fill: grad ? "" : bg?.hex || "", fa: grad ? 1 : bg?.a ?? 1,
      stroke: uniform ? colors[0].hex : "", sw: uniform ? r2((widths[0] / u) * 10) : 0, ...(shadow ? { shadow: true } : {}), ...(grad ? { grad } : {}), opacity: Math.max(0.05, Number(cs.opacity) || 1)
    };
    if (bg?.a > 0 || grad || uniform || shadow) add(shape, g);
    if (hasBorder && !uniform) { // borders on some sides only (a rule above a footer): thin boxes
      const sides = [["top", 0, { ...rel(r), h: r2(widths[0] / u) }], ["right", 1, { ...rel(r), x: r2((r.right - widths[1] - sr.left) / u), w: r2(widths[1] / u) }], ["bottom", 2, { ...rel(r), y: r2((r.bottom - widths[2] - sr.top) / u), h: r2(widths[2] / u) }], ["left", 3, { ...rel(r), w: r2(widths[3] / u) }]];
      for (const [, i, geom] of sides) if (widths[i] > 0.2 && colors[i]) add({ type: "shape", kind: "rect", ...geom, r: 0, fill: colors[i].hex, fa: colors[i].a, stroke: "", sw: 0 }, g);
    }
  };

  const text = (node, el, cs, z, g) => {
    const pre = /^pre/.test(cs.whiteSpace);
    const value = pre ? node.nodeValue.replace(/^\n+|\n+$/g, "") : node.nodeValue.replace(/\s+/g, " ").trim();
    if (!value) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter((q) => q.width > 0.5);
    if (!rects.length) return;
    const left = Math.min(...rects.map((q) => q.left));
    const right = Math.max(...rects.map((q) => q.right));
    const top = Math.min(...rects.map((q) => q.top));
    const bottom = Math.max(...rects.map((q) => q.bottom));
    if (clipped(node.parentElement, { left, right, top, bottom })) return;
    const fs = px(cs.fontSize) * z;
    const h1 = rects[0].height;
    const line = cs.lineHeight === "normal" ? h1 : px(cs.lineHeight) * z;
    const wide = right - left;
    const tol = bottom - top > h1 * 1.5 ? 1.5 : 0.03 * wide + 4; // a little slack so the text does not wrap differently
    const align = cs.textAlign === "center" ? "center" : cs.textAlign === "right" || cs.textAlign === "end" ? "right" : "left";
    const c = color(cs.color) || { hex: "#282828", a: 1 };
    add({
      type: "ftext", text: value, x: r2((left - (align === "center" ? tol / 2 : align === "right" ? tol : 0) - sr.left) / u), y: r2((top - (line - h1) / 2 - sr.top) / u), w: r2((wide + tol) / u),
      size: r2(fs / u), weight: weightOf(cs.fontWeight), italic: cs.fontStyle === "italic", underline: /underline/.test(cs.textDecorationLine), upper: cs.textTransform === "uppercase",
      align, color: c.hex, family: familyOf(cs.fontFamily), ls: cs.letterSpacing === "normal" ? 0 : r2((px(cs.letterSpacing) * z) / fs), lh: r2(line / fs), bg: "",
      opacity: Math.max(0.05, c.a * (Number(cs.opacity) || 1))
    }, g);
  };

  const visit = (el, ctx) => {
    if (el.hasAttribute("data-ui") || el.classList.contains("nl2-floats") || el.classList.contains("nl2-canvas-hit") || /^(svg|style|script|br)$/i.test(el.tagName)) return;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    let next = ctx;
    const path = el.getAttribute("data-path");
    if (path && path.split(".").length === 6) next = { block: path, item: null };
    const item = el.getAttribute("data-g");
    if (item !== null) next = { ...next, item: `${next.block}:${item}` };
    const g = gid(next.item || next.block || "section");
    const r = el.getBoundingClientRect();
    const z = el.offsetWidth ? r.width / el.offsetWidth : 1; // screen px per layout px (zoom)
    if (el.hasAttribute("data-pic")) { // a photo box of a block
      const img = el.querySelector("img");
      const rad = px(cs.borderTopLeftRadius) * z;
      add({ type: "fpic", ...rel(r), r: r2(Math.min(50, (rad / Math.max(1, Math.min(r.width, r.height))) * 100)), img: img ? imageOf(img) : undefined }, g);
      return;
    }
    if (el.tagName === "IMG") { // a photo that fills its frame: use the frame's box
      const p = el.parentElement;
      const pr = p.getBoundingClientRect();
      const rad = px(getComputedStyle(p).borderTopLeftRadius) * (p.offsetWidth ? pr.width / p.offsetWidth : 1);
      add({ type: "fpic", ...rel(pr), r: r2(Math.min(50, (rad / Math.max(1, Math.min(pr.width, pr.height))) * 100)), img: imageOf(el) }, g);
      return;
    }
    if (cs.display !== "contents" && (r.width > 0.3 || r.height > 0.3) && !clipped(el, r)) box(el, r, cs, z, g);
    for (const n of el.childNodes) {
      if (n.nodeType === 3) text(n, el, cs, z, g);
      else if (n.nodeType === 1) visit(n, next);
    }
  };

  const root = secEl.querySelector(":scope > .nl2-sel") || secEl;
  visit(root, { block: null, item: null });
  return { h: r2(sr.height / u), floats };
}

// A whole page layout -> the same layout with the chosen sections (all, or the indexes in `only`) turned into canvases.
export function flattenLayout(pageEl, layout, only) {
  const nl2 = pageEl.querySelector(".nl2");
  const u = nl2.getBoundingClientRect().width / 100;
  if (!only) return mergeIntoOneCanvas(pageEl, layout, u);
  return {
    ...layout,
    sections: layout.sections.map((s, i) => {
      if (s.type === "canvas" || (only && !only.includes(i))) return s;
      const el = pageEl.querySelector(`.nl2-sec[data-sec="${i}"]`);
      if (!el) return s;
      const { h, floats } = flattenSection(el, u);
      return { type: "canvas", h, floats: [...floats, ...(s.floats || [])] };
    })
  };
}

// The whole page as ONE canvas: every section's pieces stacked in order, so a drag-select box, move and align work across
// the whole page instead of inside one section. Sections that are already canvases are merged in as they are.
function mergeIntoOneCanvas(pageEl, layout, u) {
  const els = layout.sections.map((_, i) => pageEl.querySelector(`.nl2-sec[data-sec="${i}"]`));
  if (!els.length || els.some((e) => !e)) return layout;
  const top = els[0].getBoundingClientRect().top;
  const floats = [];
  layout.sections.forEach((s, i) => {
    const off = r2((els[i].getBoundingClientRect().top - top) / u);
    const own = s.type === "canvas" ? s.floats || [] : [...flattenSection(els[i], u).floats, ...(s.floats || [])];
    for (const f of own) floats.push({ ...f, y: r2(f.y + off) });
  });
  const h = r2((els.at(-1).getBoundingClientRect().bottom - top) / u);
  return { ...layout, sections: [{ type: "canvas", h, floats }] };
}
