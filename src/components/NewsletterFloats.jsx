import { useState, useRef, useEffect } from "react";
import { SHAPES, FONTS } from "@/lib/newsletter-shapes";

// Free-placed elements (text boxes, shapes, photos) on one section of a newsletter design. Positions are % of the page
// width (see NEW_FLOAT in newsletter-layout.js), so a design looks the same at any width. On the public page they are
// drawn as they are saved; with `edit` they can be selected (click, Shift-click, or drag a box around them), dragged
// (also onto another section), resized, rotated and snapped to the page and to each other. Elements that share a group
// id `g` are picked and moved together; double-click to pick one of them.
const BLUE = "#2563eb";
const HANDLES = [["nw", -1, -1], ["n", 0, -1], ["ne", 1, -1], ["e", 1, 0], ["se", 1, 1], ["s", 0, 1], ["sw", -1, 1], ["w", -1, 0]];
const CURSOR = { nw: "nwse-resize", se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize", n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize" };
const SNAP = 0.8; // page-width % within which an edge sticks to a guide

// Cancel the one click the browser sends right after a drag ends (it is gone before the next timer tick).
export const swallowClick = () => {
  const stop = (e) => { e.stopPropagation(); e.preventDefault(); };
  window.addEventListener("click", stop, true);
  setTimeout(() => window.removeEventListener("click", stop, true), 0);
};

const rgba = (hex, a = 1) => {
  const n = parseInt((hex || "#000000").slice(1), 16);
  return a >= 1 ? hex : `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
const gradientCss = (g) => `linear-gradient(${g.angle}deg, ${g.stops.map((s) => `${rgba(s.c, s.a)} ${s.p}%`).join(", ")})`;

function ShapeBody({ f }) {
  const sh = SHAPES[f.kind] || SHAPES.rect;
  const line = `${(f.sw || 0) * 0.1}cqw`;
  const fa = f.fa ?? 1;
  if (f.kind === "rect" || f.kind === "rounded" || f.kind === "circle") {
    return <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: f.grad ? gradientCss(f.grad) : f.fill ? rgba(f.fill, fa) : "transparent", border: f.stroke && f.sw ? `${line} solid ${f.stroke}` : "none", borderRadius: f.kind === "circle" ? "50%" : f.kind === "rounded" ? `${f.r || 0}cqw` : 0, boxShadow: f.shadow ? "0 0.5cqw 1.5cqw rgba(0,0,0,0.12)" : undefined }} />;
  }
  return <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
      <path d={sh.d} fill={sh.line ? "none" : f.fill || "none"} fillOpacity={fa} stroke={f.stroke || "none"} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" style={{ strokeWidth: line }} />
    </svg>;
}

function TextBody({ f, editing, onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!editing || !ref.current) return;
    ref.current.focus();
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, [editing]);
  return <div
    ref={ref}
    contentEditable={editing}
    suppressContentEditableWarning
    spellCheck={false}
    onBlur={editing ? (e) => onDone(e.currentTarget.innerText.replace(/\n$/, "")) : undefined}
    onKeyDown={editing ? (e) => { e.stopPropagation(); if (e.key === "Escape") e.currentTarget.blur(); } : undefined}
    onPointerDown={editing ? (e) => e.stopPropagation() : undefined}
    style={{ fontSize: `${f.size}cqw`, fontWeight: f.weight, fontStyle: f.italic ? "italic" : "normal", textDecoration: f.underline ? "underline" : "none", textTransform: f.upper ? "uppercase" : "none", textAlign: f.align, color: f.color, fontFamily: (FONTS[f.family] || FONTS.sans).css, letterSpacing: `${f.ls || 0}em`, lineHeight: f.lh || 1.25, background: f.bg || "transparent", padding: f.bg ? "0.3em 0.6em" : 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere", outline: "none", cursor: editing ? "text" : undefined, userSelect: editing ? "text" : "none" }}
  >{f.text}</div>;
}

function PicBody({ f, edit }) {
  const img = f.img;
  return <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: `${f.r || 0}%`, background: img?.url ? "transparent" : edit ? "rgba(127,127,127,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.45)", fontSize: "1.2cqw", fontWeight: 600 }}>
      {img?.url
        ? <img src={img.url} alt="" draggable={false} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${img.x}% ${img.y}%`, transform: `scale(${img.zoom})`, transformOrigin: `${img.x}% ${img.y}%` }} />
        : edit ? "Double-click to add a photo" : null}
    </div>;
}

// The empty part of a free canvas. It only marks the spot: the editor draws the drag-select box (see "marquee" in PreviewModal).
export function CanvasHit({ edit }) {
  if (!edit?.onSelectFloats) return null;
  return <div data-canvas-hit style={{ position: "absolute", inset: 0 }} />;
}

export default function FloatLayer({ floats, sec, edit, keep }) {
  const [draft, setDraft] = useState(null); // { [index]: patch } while a gesture is running
  const [guides, setGuides] = useState([]);
  const [textEdit, setTextEdit] = useState(null); // id of the text box being typed in
  const layer = useRef(null);
  const autoEdit = edit?.autoEdit;
  useEffect(() => {
    if (autoEdit && floats?.some((f) => f.id === autoEdit)) { setTextEdit(autoEdit); edit.onAutoEdited?.(); }
  }, [autoEdit]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!floats?.length) return null;

  const own = !!edit?.sel && edit.sel[1] === sec && edit.sel[2] === "floats";
  const selIds = own ? edit.selIds || [floats[edit.sel[3]]?.id].filter(Boolean) : [];
  const multi = selIds.length > 1;
  const view = (f, i) => (draft?.[i] ? { ...f, ...draft[i] } : f);
  // A tint or gradient laid over a photo (the cover's dark fade) must not catch the click meant for the photo under it.
  const overlay = (f) => f.type === "shape" && (f.grad || (f.fa ?? 1) < 1) && floats.some((o) => o.type === "fpic" && o.x < f.x + f.w && o.x + o.w > f.x && o.y < f.y + f.h && o.y + o.h > f.y);

  const heightOf = (f) => {
    if (f.type !== "ftext") return f.h;
    const el = layer.current?.querySelector(`[data-float="${f.id}"]`);
    return el && el.offsetWidth ? (el.offsetHeight / el.offsetWidth) * f.w : 4;
  };

  const begin = (e, i, mode, handle) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const f = floats[i];
    if (mode === "move" && e.shiftKey) { e.preventDefault(); edit.onToggleFloat(sec, f.id); return; }
    let ids = selIds;
    if (!ids.includes(f.id)) { // a click picks the element, or its whole group
      ids = f.g ? floats.filter((x) => x.g === f.g).map((x) => x.id) : [f.id];
      edit.onSelectFloats(sec, ids);
    }
    if (textEdit === f.id || (mode !== "move" && ids.length > 1)) return;
    const movers = floats.map((x, k) => ({ x, k })).filter(({ x }) => ids.includes(x.id) && !x.locked);
    if (!movers.length) return; // everything picked is locked
    e.preventDefault();
    const root = e.currentTarget.closest("[data-float]");
    const page = root.closest(".nl2");
    const secEl = root.closest("[data-sec]");
    const u = page.getBoundingClientRect().width / 100; // screen px per 1% of page width
    const sr = secEl.getBoundingClientRect();
    const r = root.getBoundingClientRect();
    const h0 = heightOf(f);
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const th = ((f.rot || 0) * Math.PI) / 180;
    const cos = Math.cos(th);
    const sin = Math.sin(th);
    const sx = e.clientX;
    const sy = e.clientY;
    const others = floats.filter((x) => !ids.includes(x.id));
    const start = movers.map(({ x, k }) => ({ k, x: x.x, y: x.y, w: x.w, h: heightOf(x) }));
    let last = null;

    const move = (ev) => {
      if (!last && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 3) return; // a click, not a drag
      const dx = (ev.clientX - sx) / u;
      const dy = (ev.clientY - sy) / u;
      const g = [];
      if (mode === "move") {
        let mx = dx;
        let my = dy;
        if (!ev.altKey) {
          const minX = Math.min(...start.map((s) => s.x)) + dx;
          const maxX = Math.max(...start.map((s) => s.x + s.w)) + dx;
          const minY = Math.min(...start.map((s) => s.y)) + dy;
          const maxY = Math.max(...start.map((s) => s.y + s.h)) + dy;
          const secH = sr.height / u;
          const near = (edges, targets) => { let best = null; for (const a of edges) for (const t of targets) { const d = t - a; if (Math.abs(d) < SNAP && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, at: t }; } return best; };
          const bx = near([minX, (minX + maxX) / 2, maxX], [0, 50, 100, ...others.flatMap((o) => [o.x, o.x + o.w / 2, o.x + o.w])]);
          const by = near([minY, (minY + maxY) / 2, maxY], [0, secH / 2, secH, ...others.flatMap((o) => { const oh = heightOf(o); return [o.y, o.y + oh / 2, o.y + oh]; })]);
          if (bx) { mx += bx.d; g.push({ axis: "x", at: bx.at, len: secH }); }
          if (by) { my += by.d; g.push({ axis: "y", at: by.at }); }
        }
        last = Object.fromEntries(start.map((s) => [s.k, { x: s.x + mx, y: s.y + my }]));
      } else if (mode === "rotate") {
        let rot = ((Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI + 90 + 540) % 360 - 180;
        if (ev.shiftKey) rot = Math.round(rot / 15) * 15;
        else for (const a of [-180, -135, -90, -45, 0, 45, 90, 135, 180]) if (Math.abs(rot - a) < 3) rot = a;
        last = { [i]: { rot: Math.round(rot * 10) / 10 } };
      } else {
        const [, hx, hy] = handle;
        const lx = dx * cos + dy * sin; // pointer movement along the element's own axes
        const ly = -dx * sin + dy * cos;
        const corner = hx !== 0 && hy !== 0;
        let w = f.w;
        let h = h0;
        if (corner) {
          const s = Math.max(2 / f.w, ((f.w + hx * lx) / f.w + (h0 + hy * ly) / h0) / 2); // corners keep the proportions
          w = f.w * s;
          h = h0 * s;
        } else {
          if (hx) w = Math.max(2, f.w + hx * lx);
          if (hy) h = Math.max(0.4, h0 + hy * ly);
        }
        const ox = (hx * (w - f.w)) / 2; // the opposite side stays put, so the centre moves half the change
        const oy = (hy * (h - h0)) / 2;
        const ncx = f.x + f.w / 2 + ox * cos - oy * sin;
        const ncy = f.y + h0 / 2 + ox * sin + oy * cos;
        last = { [i]: { x: ncx - w / 2, y: ncy - h / 2, w, ...(f.type === "ftext" ? (corner ? { size: Math.round(f.size * (w / f.w) * 100) / 100 } : {}) : { h }) } };
      }
      setDraft(last);
      setGuides(g);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      setDraft(null);
      setGuides([]);
      if (!last) return;
      swallowClick(); // the click that ends a drag would land on a common ancestor and deselect the element
      const keys = Object.keys(last);
      if (keys.length > 1) return edit.onFloats(sec, Object.fromEntries(keys.map((k) => [floats[k].id, last[k]])));
      const k = Number(keys[0]);
      if (mode === "move") { // dropped on another section: it belongs there now
        const cyPx = sr.top + (last[k].y + start[0].h / 2) * u;
        const to = [...page.querySelectorAll("[data-sec]")].find((el) => { const b = el.getBoundingClientRect(); return cyPx >= b.top && cyPx <= b.bottom; });
        const idx = to ? Number(to.getAttribute("data-sec")) : sec;
        if (idx !== sec) return edit.onFloatTo(sec, k, idx, { x: last[k].x, y: (cyPx - to.getBoundingClientRect().top) / u - start[0].h / 2 });
      }
      edit.onFloat(sec, k, last[k]);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  };

  // The box around several picked elements.
  const picked = floats.map((f, i) => ({ f: view(f, i), i })).filter(({ f }) => selIds.includes(f.id));
  const bounds = multi && picked.length ? { x: Math.min(...picked.map(({ f }) => f.x)), y: Math.min(...picked.map(({ f }) => f.y)), r: Math.max(...picked.map(({ f }) => f.x + f.w)), b: Math.max(...picked.map(({ f }) => f.y + heightOf(f))) } : null;

  return <div ref={layer} className={`nl2-floats${keep ? " nl2-keep" : ""}`} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 0, zIndex: 2 }}>
      {floats.map((f0, i) => {
        const f = view(f0, i);
        const on = !!edit && selIds.includes(f.id);
        const typing = textEdit === f.id;
        return <div
          key={f.id || i}
          data-float={f.id}
          className={edit ? "nl2-float" : undefined}
          onPointerDown={edit ? (e) => begin(e, i, "move") : undefined}
          onClick={edit ? (e) => e.stopPropagation() : undefined}
          onDoubleClick={edit ? (e) => {
            e.stopPropagation();
            if (multi) return edit.onSelectFloats(sec, [f.id]); // step into the group
            if (f.locked) return;
            if (f.type === "ftext") setTextEdit(f.id); else if (f.type === "fpic") edit.onFloatPhoto?.(["sections", sec, "floats", i]);
          } : undefined}
          style={{ position: "absolute", left: `${f.x}%`, top: `${f.y}cqw`, width: `${f.w}%`, height: f.type === "ftext" ? undefined : `${f.h}cqw`, transform: f.rot ? `rotate(${f.rot}deg)` : undefined, opacity: f.opacity ?? 1, pointerEvents: edit && (on || !overlay(f)) ? "auto" : "none", cursor: edit ? (f.locked ? "pointer" : typing ? "text" : "move") : undefined, touchAction: "none" }}
        >
            {f.type === "shape" && <ShapeBody f={f} />}
            {f.type === "ftext" && <TextBody f={f} editing={typing} onDone={(text) => { setTextEdit(null); if (text !== f0.text) edit.onFloat(sec, i, { text: text || "Text" }); }} />}
            {f.type === "fpic" && <PicBody f={f} edit={edit} />}
            {on && !typing && <div style={{ position: "absolute", inset: -1, outline: multi ? `1px dashed ${BLUE}` : `2px solid ${BLUE}`, pointerEvents: "none" }} />}
            {on && !typing && !multi && !f.locked && <>
              {HANDLES.filter(([, hx, hy]) => f.type !== "ftext" || hy === 0 || hx !== 0).map((h) => <span
                key={h[0]}
                role="presentation"
                onPointerDown={(e) => begin(e, i, "resize", h)}
                style={{ position: "absolute", left: `${50 + h[1] * 50}%`, top: `${50 + h[2] * 50}%`, width: 10, height: 10, marginLeft: -5, marginTop: -5, boxSizing: "border-box", background: "#fff", border: `2px solid ${BLUE}`, borderRadius: h[1] && h[2] ? 2 : 5, cursor: CURSOR[h[0]], touchAction: "none" }}
              />)}
              <span role="presentation" onPointerDown={(e) => begin(e, i, "rotate")} style={{ position: "absolute", left: "50%", top: -30, width: 14, height: 14, marginLeft: -7, boxSizing: "border-box", borderRadius: "50%", background: "#fff", border: `2px solid ${BLUE}`, cursor: "grab", touchAction: "none" }} />
            </>}
          </div>;
      })}
      {bounds && <div style={{ position: "absolute", left: `${bounds.x}%`, top: `${bounds.y}cqw`, width: `${bounds.r - bounds.x}%`, height: `${bounds.b - bounds.y}cqw`, border: `2px solid ${BLUE}`, pointerEvents: "none", boxSizing: "border-box" }}>
          <span data-ui style={{ position: "absolute", top: -22, left: -2, background: BLUE, color: "#fff", font: "600 11px/1 system-ui, sans-serif", padding: "4px 7px", borderRadius: "5px 5px 0 0", whiteSpace: "nowrap" }}>{selIds.length} selected</span>
        </div>}
      {guides.map((g, k) => g.axis === "x"
        ? <div key={k} style={{ position: "absolute", left: `${g.at}%`, top: 0, width: 1, height: `${g.len}cqw`, background: "#ec4899", pointerEvents: "none" }} />
        : <div key={k} style={{ position: "absolute", top: `${g.at}cqw`, left: 0, height: 1, width: "100%", background: "#ec4899", pointerEvents: "none" }} />)}
    </div>;
}
