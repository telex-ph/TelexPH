// Draws a version-2 newsletter design (see telexph-admin/src/newsletter/newsletter.design.js): ribbon, masthead,
// multi-column sections of rich blocks, call-to-action bands and a footer, plus free-placed elements (NewsletterFloats).
//
// It adapts to whatever width the page gives it: the design is a container (container queries) and every size is in
// em off a font-size that follows the container's width, so it fills a wide page and stacks on a narrow one.
//
// Photo slots (hero.img, photos.items[].img, image.img, masthead.logo) are empty until the admin uploads a picture.
// On the public page empty slots are simply left out; with `edit` they are shown as clickable boxes.
import { useState, useRef, useEffect } from "react";
import { getAt, setAt, same, NAMES } from "@/lib/newsletter-layout";
import FloatLayer, { CanvasHit, swallowClick } from "./NewsletterFloats";

const FONT = '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif';
const BLUE = "#2563eb";

const mix = (hex, amount) => { // blend a #rrggbb colour toward white
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (255 - v) * amount));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

// A block's or section's own box: { bg, pad, radius, border } (see cleanStyle in the server's newsletter.design.js).
const boxStyle = (s) => (s && (s.bg || s.pad || s.radius || s.border)
  ? { background: s.bg || undefined, padding: s.pad ? `${s.pad}em` : undefined, borderRadius: s.radius ? `${s.radius / 10}em` : undefined, border: s.border ? `2px solid ${s.border}` : undefined, boxSizing: "border-box" }
  : null);

// Layout editing (admin editor, `edit.onSelect` present): every section and block is selectable, can be dragged to a new
// spot and, in a multi-column row, resized from its side. `edit.toolbar(path, kind)` draws the floating toolbar.
let dragFrom = null; // { path, kind } of whatever is being dragged
function Sel({ path, kind, edit, noDrag, children }) {
  const [hint, setHint] = useState(null);
  if (!edit?.onSelect) return children;
  const on = same(edit.sel, path);
  const half = (e) => { const r = e.currentTarget.getBoundingClientRect(); return e.clientY > r.top + r.height / 2 ? "after" : "before"; };
  const mine = () => dragFrom?.kind === kind && !same(dragFrom.path, path);
  const cols = on && kind === "block" && path.length === 6 ? getAt(edit.design, path.slice(0, 3)) : null;
  const edge = cols && cols.length > 1 && edit.onSpan ? (path[3] === cols.length - 1 ? "w" : "e") : null; // the last column grows leftwards
  const resize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const unit = e.currentTarget.closest(".nl2").getBoundingClientRect().width / 12;
    const s0 = cols[path[3]].span;
    const x0 = e.clientX;
    let cur = s0;
    const move = (ev) => {
      const s = Math.round(s0 + ((edge === "e" ? 1 : -1) * (ev.clientX - x0)) / unit);
      if (s !== cur) { cur = s; edit.onSpan(path, s); }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", () => { window.removeEventListener("pointermove", move); if (cur !== s0) swallowClick(); }, { once: true });
  };
  return <div
    data-path={path.join(".")}
    className={`nl2-sel${on ? " on" : ""}${hint ? ` drop-${hint}` : ""}`}
    draggable={!edit.editing && !noDrag}
    onClick={(e) => { e.stopPropagation(); edit.onSelect(path); }}
    onDragStart={(e) => { e.stopPropagation(); dragFrom = { path, kind }; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", path.join(".")); }}
    onDragEnd={() => { dragFrom = null; setHint(null); }}
    onDragOver={(e) => { if (!mine()) return; e.preventDefault(); e.stopPropagation(); setHint(half(e)); }}
    onDragLeave={() => setHint(null)}
    onDrop={(e) => {
      if (!mine()) return;
      e.preventDefault(); e.stopPropagation();
      const at = path.at(-1) + (half(e) === "after" ? 1 : 0);
      setHint(null);
      edit.onMove(dragFrom.path, path.slice(0, -1), at);
      dragFrom = null;
    }}
  >
      {on && <span data-ui className="nl2-tag">{NAMES[getAt(edit.design, path)?.type] || kind}</span>}
      {on && edit.toolbar?.(path, kind)}
      {edge && <span data-ui role="presentation" className="nl2-edge" title="Drag to change the column width" onPointerDown={resize} style={edge === "e" ? { right: -7 } : { left: -7 }} />}
      {children}
    </div>;
}

// Text that can be typed over in the editor: double-click it, type, click away. Outside the editor it is plain text.
function Tx({ edit, path, value, as: Tag = "span", single, style, className }) {
  const [on, setOn] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!on || !ref.current) return;
    ref.current.focus();
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, [on]);
  if (!edit?.onText) return <Tag className={className} style={style}>{value}</Tag>;
  const done = (el) => {
    setOn(false);
    edit.onEditing?.(false);
    const v = el.innerText.replace(/\n$/, "");
    if (v !== value) edit.onText(path, v);
  };
  return <Tag
    ref={ref}
    className={className}
    contentEditable={on}
    suppressContentEditableWarning
    spellCheck={false}
    onDoubleClick={(e) => { e.stopPropagation(); setOn(true); edit.onEditing?.(true); }}
    onClick={on ? (e) => e.stopPropagation() : undefined}
    onBlur={on ? (e) => done(e.currentTarget) : undefined}
    onKeyDown={on ? (e) => {
      e.stopPropagation();
      if (e.key === "Escape") { e.currentTarget.innerText = value; e.currentTarget.blur(); }
      else if (single && e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
    } : undefined}
    style={on ? { ...style, outline: `2px solid ${BLUE}`, outlineOffset: 2, cursor: "text", userSelect: "text", borderRadius: 3 } : style}
  >{value}</Tag>;
}

const CSS = `
.nl2-sel{position:relative;cursor:pointer;border-radius:6px;min-width:0}
.nl2-sel:hover:not(:has(.nl2-sel:hover)){outline:2px dashed rgba(37,99,235,.6);outline-offset:3px}
.nl2-sel.on{outline:3px solid #2563eb!important;outline-offset:3px}
.nl2-sel.drop-before{box-shadow:0 -0.9em 0 -0.55em #2563eb}
.nl2-sel.drop-after{box-shadow:0 0.9em 0 -0.55em #2563eb}
.nl2-tag{position:absolute;top:-30px;left:0;z-index:6;background:#2563eb;color:#fff;font:600 11px/1 system-ui,sans-serif;padding:5px 8px;border-radius:5px 5px 0 0;pointer-events:none}
.nl2-edge{position:absolute;top:50%;width:9px;height:46px;margin-top:-23px;box-sizing:border-box;border-radius:5px;background:#fff;border:2px solid #2563eb;cursor:ew-resize;z-index:8;touch-action:none}
.nl2-sel [draggable=false]{-webkit-user-drag:none}
.nl2-canvas-hit{cursor:crosshair}
.nl2-float:hover{outline:1px dashed #2563eb}
.nl2 [data-marq]{outline:2px solid #2563eb}
.nl2{container-type:inline-size;container-name:nl2}
.nl2:not(.nl2-ed) .nl2-body{overflow-x:clip}
.nl2-body{font-size:1.4cqw;line-height:1.5}
.nl2-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:2.2em;align-items:start}
.nl2-flow{display:flex;flex-wrap:wrap;align-items:stretch;gap:1.4em}
.nl2-hero{aspect-ratio:1.5}
.nl2-span-6 .nl2-hero,.nl2-span-7 .nl2-hero{aspect-ratio:2}
.nl2-span-8 .nl2-hero,.nl2-span-9 .nl2-hero,.nl2-span-10 .nl2-hero,.nl2-span-11 .nl2-hero,.nl2-span-12 .nl2-hero{aspect-ratio:2.4}
@container nl2 (max-width:820px){
  .nl2-body{font-size:14px}
  .nl2-grid>*{grid-column:1/-1!important}
  .nl2-hero{aspect-ratio:1.7!important}
  .nl2-pad{padding-left:1.4em!important;padding-right:1.4em!important}
  .nl2:not(.nl2-ed) .nl2-floats:not(.nl2-keep){display:none}
}
.nl2 [data-slot]:focus-visible{outline:3px solid #2563eb;outline-offset:2px}
`;

const FILL = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
const Img = ({ img, style }) => <img src={img.url} alt="" loading="lazy" draggable={false} style={{ ...FILL, objectPosition: `${img.x}% ${img.y}%`, transform: `scale(${img.zoom})`, transformOrigin: `${img.x}% ${img.y}%`, ...style }} />;

const PhotoIcon = ({ size = "2em" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-8 8" /></svg>;

// One photo slot. Without `edit` it is the picture or nothing; with `edit` it is a clickable box.
function Slot({ img, path, edit, t, aspect = 4 / 3, radius = "0.6em", label = "Photo", style }) {
  const has = !!img?.url;
  if (!edit) return has ? <div style={{ position: "relative", overflow: "hidden", width: "100%", aspectRatio: aspect, borderRadius: radius, ...style }}><Img img={img} /></div> : null;
  const active = same(edit.active, path);
  const pick = () => edit.onPick(path, { open: !has });
  return <div
    data-slot
    data-pic={has ? "full" : "empty"}
    role="button"
    tabIndex={0}
    aria-label={has ? `Change ${label}` : `Add ${label}`}
    onClick={pick}
    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } }}
    style={{ position: "relative", overflow: "hidden", width: "100%", aspectRatio: aspect, borderRadius: radius, boxSizing: "border-box", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.3em", fontSize: "0.8em", fontWeight: 600, color: mix(t.p, 0.35), outline: active ? `3px solid ${t.p}` : "none", outlineOffset: 2, background: has ? "transparent" : `linear-gradient(135deg, ${mix(t.p, 0.93)}, ${mix(t.p, 0.82)})`, border: has ? "none" : `1px dashed ${mix(t.p, 0.5)}`, ...style }}
  >
      {has ? <Img img={img} /> : <><PhotoIcon /><span>Click to add {label}</span></>}
      {has && <span data-ui style={{ position: "absolute", top: "0.5em", right: "0.5em", background: "rgba(0,0,0,0.65)", color: "#fff", borderRadius: "1em", padding: "0.2em 0.8em", fontSize: "0.85em" }}>Change</span>}
    </div>;
}

function Eyebrow({ text, t, edit, path }) {
  if (!text) return null;
  return <div style={{ display: "flex", alignItems: "center", gap: "0.6em", fontSize: "0.72em", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: t.p, marginBottom: "1em" }}>
      <span style={{ width: "1.6em", height: 2, background: t.p, flexShrink: 0 }} /><Tx edit={edit} path={[...path, "eyebrow"]} value={text} single />
    </div>;
}

const Paras = ({ items, t, edit, path }) => items.map((p, i) => <Tx key={i} as="p" edit={edit} path={[...path, "paragraphs", i]} value={p} style={{ margin: "0 0 0.9em", fontSize: "0.95em", lineHeight: 1.75, color: t.body, whiteSpace: "pre-line" }} />);

const card = (t) => ({ background: "#fff", border: `1px solid ${t.line}`, borderRadius: "0.8em", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" });

function Hero({ b, t, path, edit }) {
  const active = same(edit?.active, [...path, "img"]);
  const pick = () => edit.onPick([...path, "img"]);
  return <div>
      <div
        className="nl2-hero"
        data-slot={edit ? "" : undefined}
        role={edit ? "button" : undefined}
        tabIndex={edit ? 0 : undefined}
        aria-label={edit ? (b.img ? "Change cover photo" : "Add cover photo") : undefined}
        onClick={edit ? pick : undefined}
        onKeyDown={edit ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } } : undefined}
        style={{ position: "relative", borderRadius: "1.1em", overflow: "hidden", background: `linear-gradient(135deg, ${t.d}, ${t.p})`, cursor: edit ? "pointer" : undefined, outline: active ? `3px solid ${t.p}` : "none", outlineOffset: 2 }}
      >
        {edit
          ? <span data-pic={b.img ? "full" : "empty"} style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden" }}>{b.img && <Img img={b.img} />}</span> // its own photo box, so "Ungroup" keeps a replaceable photo even when the cover is empty
          : b.img && <Img img={b.img} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.05) 70%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "0.5em", padding: "1.5em 1.6em", paddingBottom: b.stats.length ? "3em" : "1.5em" }}>
          {b.tag && <Tx edit={edit} path={[...path, "tag"]} value={b.tag} single style={{ alignSelf: "flex-start", background: t.p, color: "#fff", fontSize: "0.72em", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4em 0.9em", borderRadius: 3 }} />}
          {b.title && <Tx as="h2" edit={edit} path={[...path, "title"]} value={b.title} style={{ margin: 0, color: "#fff", fontSize: "2.2em", fontWeight: 800, lineHeight: 1.08 }} />}
          {b.subtitle && <Tx as="p" edit={edit} path={[...path, "subtitle"]} value={b.subtitle} style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: "0.85em" }} />}
        </div>
        {edit && <span data-ui style={{ position: "absolute", top: "0.8em", right: "0.8em", background: "rgba(0,0,0,0.65)", color: "#fff", borderRadius: "1em", padding: "0.25em 0.9em", fontSize: "0.75em", fontWeight: 600 }}>{b.img ? "Change cover photo" : "Click to add cover photo"}</span>}
      </div>
      {b.stats.length > 0 && <div data-g="stats" style={{ ...card(t), position: "relative", margin: "-2.4em 1.2em 0", padding: "1.1em 0.5em", display: "grid", gridTemplateColumns: `repeat(${b.stats.length}, minmax(0, 1fr))`, boxShadow: "0 6px 18px rgba(0,0,0,0.12)" }}>
          {b.stats.map((s, i) => <div key={i} style={{ textAlign: "center", padding: "0 0.4em", borderLeft: i ? `1px solid ${t.line}` : "none" }}>
              <Tx as="div" edit={edit} path={[...path, "stats", i, "value"]} value={s.value} single style={{ fontSize: "1.45em", fontWeight: 800, color: t.p, lineHeight: 1.2 }} />
              <Tx as="div" edit={edit} path={[...path, "stats", i, "label"]} value={s.label} single style={{ fontSize: "0.72em", color: t.muted, marginTop: "0.15em" }} />
            </div>)}
        </div>}
    </div>;
}

function Block({ b, t, path, edit }) {
  const at = (...k) => [...path, ...k];
  switch (b.type) {
    case "hero": return <Hero b={b} t={t} path={path} edit={edit} />;
    case "story": return <div>
        <Eyebrow text={b.eyebrow} t={t} edit={edit} path={path} />
        {(b.headline || b.accent) && <h2 style={{ margin: "0 0 0.6em", fontSize: "2.3em", fontWeight: 800, lineHeight: 1.15, color: t.text }}>
            {b.headline && <Tx edit={edit} path={at("headline")} value={b.headline} single />}{b.headline && b.accent && <br />}{b.accent && <Tx edit={edit} path={at("accent")} value={b.accent} single style={{ color: t.p }} />}
          </h2>}
        <Paras items={b.paragraphs} t={t} edit={edit} path={path} />
      </div>;
    case "quote": return <div style={{ display: "flex", gap: "0.9em", background: t.soft, border: `1px solid ${mix(t.p, 0.8)}`, borderRadius: "0.8em", padding: "1.3em 1.5em" }}>
        <span aria-hidden="true" style={{ fontFamily: "Georgia, serif", fontSize: "2.8em", lineHeight: 0.85, color: t.p, fontWeight: 700 }}>&ldquo;</span>
        <div>
          <Tx as="p" edit={edit} path={at("text")} value={b.text} style={{ margin: 0, fontSize: "1em", lineHeight: 1.65, fontStyle: "italic", color: t.text }} />
          {b.cite && <Tx as="p" edit={edit} path={at("cite")} value={b.cite} single style={{ margin: "0.6em 0 0", fontSize: "0.78em", fontWeight: 600, color: t.p }} />}
        </div>
      </div>;
    case "timeline": return <div>
        <Eyebrow text={b.eyebrow} t={t} edit={edit} path={path} />
        <div>
          {b.items.map((it, i) => {
            const last = i === b.items.length - 1;
            return <div key={i} data-g={i} style={{ position: "relative", paddingLeft: "2.2em", paddingBottom: last ? 0 : "1.6em" }}>
                {!last && <span aria-hidden="true" style={{ position: "absolute", left: "0.5em", top: "1.3em", bottom: 0, width: 2, background: mix(t.p, 0.75) }} />}
                <span aria-hidden="true" style={{ position: "absolute", left: 0, top: "0.2em", width: "1.15em", height: "1.15em", borderRadius: "50%", boxSizing: "border-box", border: `3px solid ${t.p}`, background: last ? t.p : "#fff" }} />
                <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", columnGap: "0.9em" }}>
                  {it.date && <Tx as="div" edit={edit} path={at("items", i, "date")} value={it.date} single style={{ fontSize: "0.72em", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: t.p }} />}
                  {it.title && <Tx as="div" edit={edit} path={at("items", i, "title")} value={it.title} single style={{ fontSize: "1.05em", fontWeight: 700, color: t.text }} />}
                </div>
                {it.text && <Tx as="div" edit={edit} path={at("items", i, "text")} value={it.text} style={{ fontSize: "0.85em", lineHeight: 1.6, color: t.muted, marginTop: "0.15em" }} />}
              </div>;
          })}
        </div>
      </div>;
    case "kpis": {
      if (b.tiles) return <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(b.items.length, 4)}, minmax(0, 1fr))`, gap: "0.9em" }}>
          {b.items.map((it, i) => <div key={i} data-g={i} style={{ borderRadius: "0.9em", padding: "1.1em 1.2em", background: i === 0 ? t.d : mix(t.text, 0.96), minWidth: 0 }}>
              <Tx as="div" edit={edit} path={at("items", i, "value")} value={it.value} single style={{ fontSize: "2.1em", fontWeight: 800, lineHeight: 1.05, color: i === 0 ? "#fff" : t.p }} />
              {it.label && <Tx as="div" edit={edit} path={at("items", i, "label")} value={it.label} single style={{ fontSize: "0.85em", marginTop: "0.4em", color: i === 0 ? "rgba(255,255,255,0.9)" : t.muted }} />}
            </div>)}
        </div>;
      const panel = !!(b.meta || b.bars?.length); // meta / bars make it a scorecard panel with Aug-vs-Oct bars
      const grid = <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${panel ? "8.5em" : "9em"}, 1fr))`, gap: "0.9em" }}>
          {b.items.map((it, i) => <div key={i} data-g={i} style={{ ...card(t), padding: "1.1em 1.2em" }}>
              <span aria-hidden="true" style={{ display: "block", width: "1em", height: 3, background: t.p, marginBottom: "0.6em" }} />
              <Tx as="div" edit={edit} path={at("items", i, "value")} value={it.value} single style={{ fontSize: "1.65em", fontWeight: 800, lineHeight: 1.1, color: t.text, whiteSpace: "nowrap" }} />
              {it.label && <Tx as="div" edit={edit} path={at("items", i, "label")} value={it.label} single style={{ fontSize: "0.8em", color: it.bar ? t.text : t.muted, fontWeight: it.bar ? 700 : 400, marginTop: "0.3em" }} />}
              {it.note && <Tx as="div" edit={edit} path={at("items", i, "note")} value={it.note} single style={{ fontSize: "0.72em", color: mix(t.text, 0.45), marginTop: "0.15em" }} />}
              {it.bar && <div style={{ display: "grid", gap: "0.4em", marginTop: "0.9em" }}>
                  {it.bar.map((v, k) => <div key={k} style={{ display: "flex", alignItems: "center", gap: "0.6em" }}>
                      <span style={{ width: "2.6em", fontSize: "0.6em", fontWeight: 700, letterSpacing: "0.08em", color: t.muted }}>{b.bars?.[k]}</span>
                      <span style={{ flex: 1, height: "0.55em", borderRadius: 99, background: t.line, overflow: "hidden" }}>
                        <span style={{ display: "block", width: `${v}%`, height: "100%", borderRadius: 99, background: k === it.bar.length - 1 ? t.p : mix(t.text, 0.75) }} />
                      </span>
                    </div>)}
                </div>}
            </div>)}
        </div>;
      if (!panel) return <div><Eyebrow text={b.eyebrow} t={t} edit={edit} path={path} />{grid}</div>;
      return <div style={{ ...card(t), borderLeft: `4px solid ${t.p}`, padding: "1.2em 1.3em" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1em", paddingBottom: "0.8em", marginBottom: "1em", borderBottom: `1px solid ${t.line}` }}>
            {b.eyebrow && <Tx edit={edit} path={at("eyebrow")} value={b.eyebrow} single style={{ fontSize: "0.72em", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: t.text }} />}
            {b.meta && <Tx edit={edit} path={at("meta")} value={b.meta} single style={{ fontSize: "0.72em", color: t.muted, whiteSpace: "nowrap" }} />}
          </div>
          {grid}
        </div>;
    }
    case "stat": return <div style={{ ...card(t), padding: "1em 1.2em", display: "flex", alignItems: "center", gap: "0.9em" }}>
        {b.icon
          ? <span aria-hidden="true" style={{ width: "2.4em", height: "2.4em", borderRadius: "50%", background: t.soft, color: t.p, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>{b.icon}</span>
          : <span aria-hidden="true" style={{ width: "0.5em", alignSelf: "stretch", borderRadius: 4, background: t.p, flexShrink: 0 }} />}
        <div>
          <div style={{ fontSize: "0.95em", color: t.text }}><strong style={{ fontSize: "1.4em", fontWeight: 800 }}><Tx edit={edit} path={at("value")} value={b.value} single /></strong> <Tx edit={edit} path={at("label")} value={b.label} single /></div>
          {b.note && <Tx as="div" edit={edit} path={at("note")} value={b.note} single style={{ fontSize: "0.75em", color: t.muted, marginTop: "0.15em" }} />}
        </div>
      </div>;
    case "cards": return <div>
        <Eyebrow text={b.eyebrow} t={t} edit={edit} path={path} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(8.4em, 1fr))", gap: "0.8em" }}>
          {b.items.map((it, i) => {
            const hot = i === 0 && b.items.length > 1;
            return <div key={i} data-g={i} style={{ ...card(t), padding: "1em 1.1em", background: hot ? t.p : "#fff", border: hot ? `1px solid ${t.p}` : card(t).border }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5em" }}>
                  <Tx as="div" edit={edit} path={at("items", i, "title")} value={it.title} single style={{ fontSize: "1.05em", fontWeight: 700, color: hot ? "#fff" : t.text, overflowWrap: "break-word", minWidth: 0 }} />
                  {it.n && <Tx as="div" edit={edit} path={at("items", i, "n")} value={it.n} single style={{ fontSize: "1.9em", fontWeight: 800, lineHeight: 1, color: hot ? "rgba(255,255,255,0.3)" : mix(t.p, 0.82) }} />}
                </div>
                <span aria-hidden="true" style={{ display: "block", width: "1.3em", height: 3, background: hot ? "#fff" : t.p, margin: "0.5em 0 0.6em" }} />
                {it.text && <Tx as="div" edit={edit} path={at("items", i, "text")} value={it.text} style={{ fontSize: "0.78em", lineHeight: 1.55, color: hot ? "rgba(255,255,255,0.88)" : t.muted }} />}
              </div>;
          })}
        </div>
      </div>;
    case "list": return <div style={{ ...card(t), padding: "1.2em" }}>
        {b.title && <Tx as="div" edit={edit} path={at("title")} value={b.title} single style={{ fontSize: "1.05em", fontWeight: 800, color: t.text, marginBottom: "0.8em" }} />}
        <div style={{ display: "grid", gap: "0.5em" }}>
          {b.items.map((it, i) => <div key={i} data-g={i} style={{ display: "flex", alignItems: "center", gap: "0.8em", background: mix(t.text, 0.97), borderRadius: "0.6em", padding: "0.6em 0.8em" }}>
              <span aria-hidden="true" style={{ width: "2em", height: "2em", borderRadius: "0.5em", background: "#fff", border: `1px solid ${t.line}`, color: t.p, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9em", fontWeight: 800, flexShrink: 0 }}>&#8623;</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Tx as="div" edit={edit} path={at("items", i, "title")} value={it.title} single style={{ fontSize: "0.85em", fontWeight: 700, color: t.text }} />
                {it.sub && <Tx as="div" edit={edit} path={at("items", i, "sub")} value={it.sub} single style={{ fontSize: "0.7em", color: t.muted }} />}
              </div>
              {it.tag && <Tx edit={edit} path={at("items", i, "tag")} value={it.tag} single style={{ fontSize: "0.6em", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.3em 0.7em", borderRadius: "0.4em", background: /^new$/i.test(it.tag) ? t.p : t.soft, color: /^new$/i.test(it.tag) ? "#fff" : t.p, flexShrink: 0 }} />}
            </div>)}
        </div>
      </div>;
    case "callout": return <div style={{ display: "flex", alignItems: "center", gap: "1em", background: t.soft, borderRadius: "0.9em", padding: "1.1em 1.3em" }}>
        <span aria-hidden="true" style={{ width: "2.6em", height: "2.6em", borderRadius: "50%", background: t.d, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>{b.icon || "↑"}</span>
        <div style={{ fontSize: "0.95em", lineHeight: 1.6, color: t.text, minWidth: 0 }}>
          {b.lead && <Tx as="div" edit={edit} path={at("lead")} value={b.lead} style={{ fontWeight: 700 }} />}
          {b.text && <Tx as="div" edit={edit} path={at("text")} value={b.text} />}
        </div>
      </div>;
    case "boxes": return <div style={{ display: "grid", gridTemplateColumns: `repeat(${b.items.length}, minmax(0, 1fr))`, gap: "1em" }}>
        {b.items.map((it, i) => {
          const solid = b.items.length > 1 && i === b.items.length - 1;
          return <div key={i} data-g={i} style={{ borderRadius: "0.9em", padding: "1.3em 1.4em", background: solid ? t.p : "#fff", border: `1px solid ${solid ? t.p : t.line}`, minWidth: 0 }}>
              {it.label && <Tx as="div" edit={edit} path={at("items", i, "label")} value={it.label} single style={{ fontSize: "0.72em", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: solid ? "#fff" : t.p, marginBottom: "0.7em" }} />}
              {it.text && <Tx as="div" edit={edit} path={at("items", i, "text")} value={it.text} style={{ fontSize: "0.9em", lineHeight: 1.6, color: solid ? "rgba(255,255,255,0.92)" : t.body }} />}
            </div>;
        })}
      </div>;
    case "photos": {
      const items = b.items.map((it, k) => ({ it, k })).filter(({ it }) => edit || it.img?.url);
      if (!items.length) return null;
      return <div>
          <Eyebrow text={b.eyebrow} t={t} edit={edit} path={path} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(11em, 1fr))", gap: "0.9em" }}>
            {items.map(({ it, k }) => <figure key={k} data-g={k} style={{ margin: 0 }}>
                <Slot img={it.img} path={[...path, "items", k, "img"]} edit={edit} t={t} aspect={4 / 3} label="photo" />
                {it.caption && <Tx as="figcaption" edit={edit} path={at("items", k, "caption")} value={it.caption} single style={{ fontSize: "0.78em", fontStyle: "italic", color: t.muted, marginTop: "0.5em" }} />}
              </figure>)}
          </div>
        </div>;
    }
    case "image":
      if (!edit && !b.img?.url) return null;
      return <figure style={{ margin: 0 }}>
          <Slot img={b.img} path={[...path, "img"]} edit={edit} t={t} aspect={16 / 9} radius="0.8em" label="photo" />
          {b.caption && <Tx as="figcaption" edit={edit} path={at("caption")} value={b.caption} single style={{ fontSize: "0.78em", fontStyle: "italic", color: t.muted, marginTop: "0.5em" }} />}
        </figure>;
    case "text": return <div>
        <Eyebrow text={b.eyebrow} t={t} edit={edit} path={path} />
        {b.title && <Tx as="h3" edit={edit} path={at("title")} value={b.title} single style={{ margin: "0 0 0.5em", fontSize: "1.35em", fontWeight: 700, color: t.text }} />}
        <Paras items={b.paragraphs} t={t} edit={edit} path={path} />
      </div>;
    default: return null;
  }
}

function Section({ s, t, index, edit }) {
  const pad = { padding: 0 }; // no side padding: the design sits on the page and lines up with the page's own edges
  const at = (...k) => ["sections", index, ...k];
  switch (s.type) {
    case "ribbon": return <Tx as="div" className="nl2-pad" edit={edit} path={at("text")} value={s.text} single style={{ background: t.p, color: "#fff", textAlign: "right", fontSize: "0.72em", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.9em 1.8em", borderRadius: "0.5em", marginBottom: "0.4em" }} />;
    case "masthead": {
      const logoPath = ["sections", index, "logo"];
      return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.2em", flexWrap: "wrap", padding: "1.6em 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
            {(s.logo?.url || edit) && <div style={{ width: s.pair ? "9em" : "7.5em" }}><Slot img={s.logo} path={logoPath} edit={edit} t={t} aspect={s.pair ? 2 : 3} radius="0.3em" label="logo" style={{ background: s.logo?.url ? "transparent" : undefined }} /></div>}
            {s.pair && (s.logo?.url || s.logo2?.url || edit) && <span aria-hidden="true" style={{ fontSize: "1.6em", color: t.muted }}>&times;</span>}
            {s.pair && (s.logo2?.url || edit) && <div style={{ width: "12em" }}><Slot img={s.logo2} path={["sections", index, "logo2"]} edit={edit} t={t} aspect={4} radius="0.3em" label="partner logo" style={{ background: s.logo2?.url ? "transparent" : undefined }} /></div>}
            {s.brand && !(s.pair && (s.logo?.url || s.logo2?.url)) && <Tx edit={edit} path={at("brand")} value={s.brand} single style={{ fontSize: "1.7em", fontWeight: 800, letterSpacing: "0.04em", color: t.text }} />}
          </div>
          {(s.label || s.sub) && <div style={{ textAlign: "right" }}>
              {s.label && <Tx as="div" edit={edit} path={at("label")} value={s.label} single style={{ fontSize: "0.72em", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: t.muted }} />}
              {s.sub && <Tx as="div" edit={edit} path={at("sub")} value={s.sub} single style={{ fontSize: "0.85em", color: t.p, marginTop: "0.15em" }} />}
            </div>}
        </div>;
    }
    case "columns": return <div className="nl2-grid" style={{ ...pad, paddingBottom: "2.2em" }}>
        {s.cols.map((c, ci) => <div key={ci} className={`nl2-span-${c.span}`} style={{ gridColumn: `span ${c.span}`, display: "flex", flexDirection: "column", gap: "1.9em", minWidth: 0, ...(c.bg ? { background: c.bg, borderRadius: "1.2em", padding: "1.5em" } : null) }}>
            {c.blocks.map((b, bi) => {
              const bp = ["sections", index, "cols", ci, "blocks", bi];
              const st = boxStyle(b.style);
              const inner = <Block b={b} t={t} path={bp} edit={edit} />;
              return <Sel key={bi} path={bp} kind="block" edit={edit}>{st ? <div style={st}>{inner}</div> : inner}</Sel>;
            })}
          </div>)}
      </div>;
    case "band": {
      const split = s.title && (s.text || s.subtitle);
      return <div style={pad}>
          <div style={{ position: "relative", overflow: "hidden", background: s.bg, color: s.color, borderRadius: "1.1em", padding: "2em 2.4em", textAlign: s.align, marginBottom: "2.2em" }}>
            <span aria-hidden="true" style={{ position: "absolute", right: "-3em", bottom: "-4.5em", width: "13em", height: "13em", borderRadius: "50%", border: "1.3em solid rgba(255,255,255,0.1)" }} />
            <div className={split ? "nl2-flow" : undefined} style={{ position: "relative", textAlign: split ? "left" : s.align }}>
              {s.title && <Tx as="h2" edit={edit} path={at("title")} value={s.title} style={{ margin: 0, fontSize: "2em", fontWeight: 800, lineHeight: 1.15 }} />}
              {split && <span aria-hidden="true" style={{ width: 1, background: "rgba(255,255,255,0.4)", alignSelf: "stretch" }} />}
              {(s.subtitle || s.text) && <div style={{ flex: split ? "1 1 18em" : undefined, alignSelf: "center" }}>
                  {s.subtitle && <Tx as="p" edit={edit} path={at("subtitle")} value={s.subtitle} style={{ margin: 0, fontSize: "1.05em", fontWeight: 600 }} />}
                  {s.text && <Tx as="p" edit={edit} path={at("text")} value={s.text} style={{ margin: s.subtitle ? "0.4em 0 0" : 0, fontSize: "0.95em", lineHeight: 1.6, opacity: 0.92, whiteSpace: "pre-line" }} />}
                </div>}
            </div>
          </div>
        </div>;
    }
    case "canvas": return <div style={{ position: "relative", height: `${s.h}cqw` }}><CanvasHit sec={index} edit={edit} /></div>;
    case "footer": return <div style={{ borderTop: `1px solid ${t.line}`, padding: "1.6em 0 1.8em" }}>
        {s.columns.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12em, 1fr))", gap: "1.4em", marginBottom: s.note ? "1em" : 0 }}>
            {s.columns.map((c, i) => <div key={i} data-g={i}>
                {c.title && <Tx as="div" edit={edit} path={at("columns", i, "title")} value={c.title} single style={{ fontSize: "0.9em", fontWeight: 700, color: t.text }} />}
                {c.text && <Tx as="div" edit={edit} path={at("columns", i, "text")} value={c.text} style={{ fontSize: "0.8em", lineHeight: 1.55, color: t.muted, marginTop: "0.15em" }} />}
              </div>)}
          </div>}
        {s.note && <Tx as="div" edit={edit} path={at("note")} value={s.note} style={{ fontSize: "0.75em", color: t.muted }} />}
      </div>;
    default: return null;
  }
}

// Headings and body copy need a dark, near-neutral colour; a saturated or light one (e.g. the brand red) is replaced.
const readable = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b < 110 && Math.max(r, g, b) - Math.min(r, g, b) < 40;
};

function NewsletterDesign({ design, edit }) {
  const th = design.theme;
  const ed = edit?.onSelect ? { ...edit, design } : edit; // the selection tag and toolbar need the design to name what is selected
  const text = readable(th.text) ? th.text : "#1f2937";
  const t = { p: th.primary, d: th.dark, text, body: mix(text, 0.25), muted: mix(text, 0.4), line: mix(text, 0.88), soft: th.soft || mix(th.primary, 0.93) };
  return <div className={`nl2${edit ? " nl2-ed" : ""}`} style={{ fontFamily: FONT, color: text, background: th.background || undefined }}>
      <style>{CSS}</style>
      <div className="nl2-body">
        {design.sections.map((s, i) => {
          const st = s.type === "columns" || s.type === "footer" || s.type === "masthead" ? boxStyle(s.style) : null;
          const inner = <Section s={s} t={t} index={i} edit={ed} />;
          return <div key={i} className="nl2-sec" data-sec={i} style={{ position: "relative" }}>
              <Sel path={["sections", i]} kind="section" edit={ed} noDrag={s.type === "canvas"}>{st ? <div style={st}>{inner}</div> : inner}</Sel>
              <FloatLayer floats={s.floats} sec={i} edit={ed} keep={s.type === "canvas"} />
            </div>;
        })}
      </div>
    </div>;
}
export { getAt, setAt };
export default NewsletterDesign;
