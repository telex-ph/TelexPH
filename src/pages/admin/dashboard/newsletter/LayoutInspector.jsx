import { useState } from "react";

// Side-panel form for whatever is selected in the newsletter preview. It is built from the selected node's own shape,
// so every block type (story, kpis, timeline, cards, hero stats, footer columns...) gets fields without its own code.
const field = { width: "100%", boxSizing: "border-box", padding: "6px 8px", fontSize: 12, color: "var(--admin-text)", background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 6, fontFamily: "inherit" };
const lbl = { display: "grid", gap: 3, fontSize: 11, color: "var(--admin-text-sub)" };
const mini = { padding: "3px 7px", fontSize: 11, borderRadius: 5, cursor: "pointer", border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text)" };

const SKIP = new Set(["type", "img", "logo", "span", "cols", "blocks", "bg", "color", "align", "floats", "style", "h"]);
const LONG = new Set(["text", "subtitle", "note"]);
const MAX = { stats: 5, items: 8, columns: 4 };
const WORDS = { n: "Number", cite: "Source", accent: "Second line (brand colour)", eyebrow: "Small heading", sub: "Small line", tag: "Label chip" };
const nice = (k) => WORDS[k] || k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

// A new row for a list: same fields as the last one, with something visible in the key ones.
const blank = (rows, list) => {
  const out = {};
  for (const k of Object.keys(rows.at(-1) || (list === "stats" ? { value: "", label: "" } : { title: "", text: "" }))) out[k] = k === "n" ? String(rows.length + 1).padStart(2, "0") : k === "value" ? "0" : k === "title" ? "New" : "";
  return out;
};

function Text({ k, value, onChange }) {
  const Tag = LONG.has(k) ? "textarea" : "input";
  return <label style={lbl}>{nice(k)}<Tag style={{ ...field, resize: "vertical" }} rows={LONG.has(k) ? 3 : undefined} value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Rows({ k, rows, onChange }) {
  const [open, setOpen] = useState(0);
  const min = k === "stats" || k === "columns" ? 0 : 1;
  const set = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const swap = (i, d) => { const n = [...rows]; [n[i], n[i + d]] = [n[i + d], n[i]]; onChange(n); setOpen(i + d); };
  return <fieldset style={{ margin: 0, padding: 8, border: "1px solid var(--admin-border)", borderRadius: 8, display: "grid", gap: 6 }}>
      <legend style={{ fontSize: 11, color: "var(--admin-text-sub)", padding: "0 4px" }}>{nice(k)} ({rows.length})</legend>
      {rows.map((r, i) => <div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 6, background: "var(--admin-bg-soft)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 6px" }}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} style={{ ...mini, flex: 1, textAlign: "left", border: "none", background: "transparent", fontWeight: 600 }}>
              {i + 1}. {r.title || r.label || r.caption || r.value || r.date || "(empty)"}
            </button>
            <button type="button" disabled={i === 0} onClick={() => swap(i, -1)} style={mini} aria-label={`Move ${nice(k)} ${i + 1} up`}>↑</button>
            <button type="button" disabled={i === rows.length - 1} onClick={() => swap(i, 1)} style={mini} aria-label={`Move ${nice(k)} ${i + 1} down`}>↓</button>
            <button type="button" disabled={rows.length <= min} onClick={() => onChange(rows.filter((_, j) => j !== i))} style={{ ...mini, color: "var(--admin-danger)" }} aria-label={`Remove ${nice(k)} ${i + 1}`}>✕</button>
          </div>
          {open === i && <div style={{ display: "grid", gap: 6, padding: "0 8px 8px" }}>
              {Object.keys(r).filter((f) => !SKIP.has(f) && typeof r[f] === "string").map((f) => <Text key={f} k={f} value={r[f]} onChange={(v) => set(i, { [f]: v })} />)}
            </div>}
        </div>)}
      {rows.length < (k === "items" && rows[0] && "caption" in rows[0] ? 6 : MAX[k] || 8) && <button type="button" onClick={() => { onChange([...rows, blank(rows, k)]); setOpen(rows.length); }} style={mini}>+ Add {k === "stats" ? "number" : k === "columns" ? "column" : "item"}</button>}
    </fieldset>;
}

// node: the selected section/block. onChange(nextNode, coalesceKey): coalesceKey lets typing count as one undo step.
export function NodeForm({ node, onChange }) {
  const set = (k, v) => onChange({ ...node, [k]: v }, `${k}`);
  return <div style={{ display: "grid", gap: 10 }}>
      {Object.keys(node).filter((k) => !SKIP.has(k)).map((k) => {
        const v = node[k];
        if (typeof v === "string") return <Text key={k} k={k} value={v} onChange={(x) => set(k, x)} />;
        if (Array.isArray(v) && v.every((x) => typeof x === "string")) {
          return <label key={k} style={lbl}>{nice(k)} (blank line between paragraphs)
              <textarea style={{ ...field, resize: "vertical" }} rows={6} value={v.join("\n\n")} onChange={(e) => set(k, e.target.value.split(/\n\s*\n/))} />
            </label>;
        }
        if (Array.isArray(v)) return <Rows key={k} k={k} rows={v} onChange={(x) => onChange({ ...node, [k]: x })} />;
        return null;
      })}
      {node.type === "band" && <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
          <label style={lbl}>Background<input type="color" value={node.bg} onChange={(e) => set("bg", e.target.value)} aria-label="Banner background colour" style={{ width: 44, height: 28, padding: 0, border: "1px solid var(--admin-border)", borderRadius: 4 }} /></label>
          <label style={lbl}>Text<input type="color" value={node.color} onChange={(e) => set("color", e.target.value)} aria-label="Banner text colour" style={{ width: 44, height: 28, padding: 0, border: "1px solid var(--admin-border)", borderRadius: 4 }} /></label>
          <label style={lbl}>Align<select value={node.align} onChange={(e) => set("align", e.target.value)} style={{ ...field, width: "auto" }}>{["left", "center", "right"].map((a) => <option key={a} value={a}>{a}</option>)}</select></label>
        </div>}
    </div>;
}

export function ThemeForm({ theme, onChange }) {
  return <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {[["primary", "Main colour"], ["dark", "Dark colour"], ["text", "Text colour"]].map(([k, name]) => <label key={k} style={lbl}>{name}
          <input type="color" value={theme[k]} onChange={(e) => onChange({ ...theme, [k]: e.target.value }, `theme-${k}`)} style={{ width: 52, height: 30, padding: 0, border: "1px solid var(--admin-border)", borderRadius: 4 }} />
        </label>)}
    </div>;
}
