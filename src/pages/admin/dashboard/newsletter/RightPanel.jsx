import { NAMES, labelOf, same } from "@/lib/newsletter-layout";
import { NodeForm, ThemeForm } from "./LayoutInspector";
import { Swatch, Num, Icon } from "./editor-ui";

const card = { display: "grid", gap: 10, padding: 12, border: "1px solid var(--admin-border)", borderRadius: 10, background: "var(--admin-surface)" };
const lbl = { display: "grid", gap: 3, fontSize: 11, color: "var(--admin-text-sub)" };
const row = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 };
const small = { padding: "4px 9px", fontSize: 12, borderRadius: 6, cursor: "pointer", border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text)", fontFamily: "inherit" };

function Field({ label, children }) { return <label style={lbl}>{label}{children}</label>; }

// The panel on the right: exact numbers and the details of whatever is selected.
export default function RightPanel({ tab, setTab, layout, curPage, sel, kind, node, A, photo, multiCol, span, layoutTheme, onTheme }) {
  const Row = ({ path, node: n, depth, note }) => {
    const { name, bit } = labelOf(n);
    const on = !!sel && sel.page === curPage && same(sel.path, path);
    return <button type="button" className="nle-layer" aria-current={on} style={{ paddingLeft: 8 + depth * 14 }} onClick={() => A.choose(curPage, path, true)}>
        <strong style={{ fontWeight: 600 }}>{name}</strong>
        <span style={{ opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{bit}</span>
        {n.locked && <Icon name="lock" size={11} />}
        {note && <span style={{ opacity: 0.7, fontSize: 10 }}>{note}</span>}
      </button>;
  };
  const bg = layoutTheme?.background || "#ffffff";

  return <aside aria-label="Properties" style={{ display: "flex", flexDirection: "column", minHeight: 0, background: "var(--admin-surface)", borderLeft: "1px solid var(--admin-border)" }}>
      <div role="tablist" aria-label="Right panel" style={{ display: "flex", borderBottom: "1px solid var(--admin-border)", flexShrink: 0 }}>
        <button type="button" role="tab" className="nle-rtab" aria-selected={tab === "settings"} onClick={() => setTab("settings")}><Icon name="settings" size={17} />Page Settings</button>
        <button type="button" role="tab" className="nle-rtab" aria-selected={tab === "layers"} onClick={() => setTab("layers")}><Icon name="layers" size={17} />Layers</button>
      </div>
      <div className="nle-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 16, display: "grid", gap: 14, alignContent: "start" }}>
      {tab === "layers" && <div style={{ display: "grid", gap: 1 }}>
          <h3 className="nle-h" style={{ margin: "0 0 8px" }}>Layers on page {curPage + 1}</h3>
          <div style={{ display: "grid", gap: 6, padding: 10, marginBottom: 8, border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-bg-soft)" }}>
            <strong style={{ fontSize: 12, color: "var(--admin-text)" }}>Edit every element</strong>
            <span style={{ fontSize: 11, color: "var(--admin-text-sub)", lineHeight: 1.5 }}>Turns the sections into separate text, boxes and photos that you can move, resize and change one by one.</span>
            <button type="button" className="nle-ghost" onClick={A.ungroupPage} disabled={!layout?.sections}><Icon name="ungroup" size={15} />Ungroup the whole page</button>
          </div>
          {layout?.sections?.map((s, si) => <div key={si}>
              <Row path={["sections", si]} node={s} depth={0} />
              {s.type === "columns" && s.cols.map((c, ci) => c.blocks.map((b, bi) => <Row key={`${ci}-${bi}`} path={["sections", si, "cols", ci, "blocks", bi]} node={b} depth={1} note={s.cols.length > 1 ? `col ${ci + 1}` : ""} />))}
              {s.floats?.map((f, fi) => ({ f, fi })).reverse().map(({ f, fi }) => <Row key={f.id} path={["sections", si, "floats", fi]} node={f} depth={1} note={f.g ? "grouped" : ""} />)}
            </div>)}
          {!layout?.sections && <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)" }}>This page is an older format and can't be edited. Add a new page to build with the editor.</p>}
        </div>}

      {tab === "settings" && <>
      {photo && <div style={card}>
          <h3 className="nle-h">Photo</h3>
          <button type="button" className="nle-primary" disabled={!!photo.uploading} onClick={photo.replace}>{photo.img?.url ? "Replace photo" : "Upload photo"}</button>
          {photo.img?.url && <>
            <Field label="Zoom"><input type="range" min="1" max="3" step="0.05" value={photo.img.zoom} onChange={photo.adjust("zoom")} aria-label="Zoom" /></Field>
            <Field label="Left / right"><input type="range" min="0" max="100" step="1" value={photo.img.x} onChange={photo.adjust("x")} aria-label="Move left or right" /></Field>
            <Field label="Up / down"><input type="range" min="0" max="100" step="1" value={photo.img.y} onChange={photo.adjust("y")} aria-label="Move up or down" /></Field>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={photo.reset} style={small}>Reset</button>
              <button type="button" onClick={photo.remove} style={{ ...small, color: "var(--admin-danger)" }}>Remove photo</button>
            </div>
          </>}
          {photo.uploading && <div role="status" style={{ fontSize: 12, color: "var(--admin-text-sub)" }}>Uploading… {photo.uploading.pct}%</div>}
        </div>}

      {node && kind === "float" && A.count > 1 && <div style={card}>
          <h3 className="nle-h">{A.count} elements selected</h3>
          <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)", lineHeight: 1.6 }}>Drag any of them to move all together. Arrow keys nudge them. Use the bar above to align, group, duplicate or delete them. Double-click one to pick only that element.</p>
        </div>}

      {node && kind === "float" && A.count <= 1 && <>
        <div style={card}>
          <h3 className="nle-h">{NAMES[node.type]} · position and size</h3>
          <div style={row}>
            <Field label="X (%)"><Num label="X" value={node.x} min={-50} max={150} step={0.5} width="100%" onChange={(v) => A.patch({ x: v }, "x")} /></Field>
            <Field label="Y (%)"><Num label="Y" value={node.y} min={-50} max={400} step={0.5} width="100%" onChange={(v) => A.patch({ y: v }, "y")} /></Field>
            <Field label="Width (%)"><Num label="Width" value={node.w} min={1} max={150} step={0.5} width="100%" onChange={(v) => A.patch({ w: v }, "w")} /></Field>
            {node.type !== "ftext" && <Field label="Height (%)"><Num label="Height" value={node.h} min={0.2} max={150} step={0.5} width="100%" onChange={(v) => A.patch({ h: v }, "h")} /></Field>}
            <Field label="Rotation (°)"><Num label="Rotation" value={node.rot} min={-180} max={180} step={1} width="100%" onChange={(v) => A.patch({ rot: v }, "rot")} /></Field>
          </div>
        </div>

        {node.type === "ftext" && <div style={card}>
            <h3 className="nle-h">Text</h3>
            <Field label="Words"><textarea className="nle-input" style={{ height: 86, padding: 8, resize: "vertical" }} value={node.text} onChange={(e) => A.patch({ text: e.target.value || " " }, "text")} aria-label="Text" /></Field>
            <div style={row}>
              <Field label="Line height"><Num label="Line height" value={node.lh} min={0.8} max={3} step={0.05} width="100%" onChange={(v) => A.patch({ lh: v }, "lh")} /></Field>
              <Field label="Letter spacing"><Num label="Letter spacing" value={node.ls} min={-0.1} max={1} step={0.01} width="100%" onChange={(v) => A.patch({ ls: v }, "ls")} /></Field>
            </div>
          </div>}

        {node.type === "fpic" && node.img?.url && <div style={card}>
            <h3 className="nle-h">Crop</h3>
            <Field label="Zoom"><input type="range" min="1" max="3" step="0.05" value={node.img.zoom} onChange={(e) => A.patch({ img: { ...node.img, zoom: Number(e.target.value) } }, "zoom")} aria-label="Zoom" /></Field>
            <Field label="Left / right"><input type="range" min="0" max="100" step="1" value={node.img.x} onChange={(e) => A.patch({ img: { ...node.img, x: Number(e.target.value) } }, "px")} aria-label="Move left or right" /></Field>
            <Field label="Up / down"><input type="range" min="0" max="100" step="1" value={node.img.y} onChange={(e) => A.patch({ img: { ...node.img, y: Number(e.target.value) } }, "py")} aria-label="Move up or down" /></Field>
          </div>}

        <div style={card}>
          <h3 className="nle-h">Arrange</h3>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" style={small} onClick={() => A.reorder("front")}>To front</button>
            <button type="button" style={small} onClick={() => A.reorder("forward")}>Forward</button>
            <button type="button" style={small} onClick={() => A.reorder("backward")}>Backward</button>
            <button type="button" style={small} onClick={() => A.reorder("back")}>To back</button>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: "var(--admin-text-faint)", lineHeight: 1.5 }}>Arrow keys nudge it. Hold Shift for bigger steps, Alt while dragging to turn off snapping, Shift while rotating for 15° steps. Floating elements are hidden on phone-width screens.</p>
        </div>
      </>}

      {node && kind === "section" && node.type === "canvas" && <div style={card}>
          <h3 className="nle-h">Free canvas</h3>
          <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)", lineHeight: 1.6 }}>Every piece here is its own element. Drag a box around several to pick them, or click one to pick it (or its group). Set the height of this area in the bar above.</p>
        </div>}

      {node && kind !== "float" && !(kind === "section" && node.type === "canvas") && <>
        <div style={card}>
          <h3 className="nle-h">{NAMES[node.type] || node.type}</h3>
          {multiCol && <Field label={`Column width (${span} of 12)`}><input type="range" min="2" max="10" step="1" value={span} onChange={(e) => A.widen(Number(e.target.value) - span)} aria-label="Column width" /></Field>}
          <NodeForm key={A.nodeKey} node={node} onChange={A.patchNode} />
        </div>
        {(kind === "block" || ["columns", "footer", "masthead"].includes(node.type)) && <div style={card}>
            <h3 className="nle-h">Box style</h3>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
              <Field label="Background"><Swatch label="Background colour" value={node.style?.bg || ""} onChange={(v) => A.patchStyle({ bg: v }, "bg")} clear /></Field>
              <Field label="Outline"><Swatch label="Outline colour" value={node.style?.border || ""} onChange={(v) => A.patchStyle({ border: v }, "border")} clear /></Field>
              <Field label="Padding"><Num label="Padding" value={node.style?.pad || 0} min={0} max={6} step={0.25} width={60} onChange={(v) => A.patchStyle({ pad: v }, "pad")} /></Field>
              <Field label="Corners"><Num label="Corner radius" value={node.style?.radius || 0} min={0} max={50} step={1} width={60} onChange={(v) => A.patchStyle({ radius: v }, "radius")} /></Field>
            </div>
          </div>}
      </>}

      {!node && !photo && <>
        <div style={{ display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--admin-text)" }}>Background</h3>
          <div className="nle-seg">
            <button type="button" aria-pressed="true"><span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--admin-accent)" }} />Color</button>
            <button type="button" disabled title="Not available yet"><Icon name="image" size={14} />Image</button>
            <button type="button" disabled title="Not available yet"><Icon name="pattern" size={14} />Pattern</button>
          </div>
          {layoutTheme && <label className="nle-field" style={{ position: "relative", cursor: "pointer" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 84, height: 22, borderRadius: 6, background: bg, border: "1px solid var(--admin-border-strong)" }} />
              <span style={{ fontSize: 12, color: "var(--admin-text-sub)" }}>{bg.toUpperCase()}</span>
            </span>
            <Icon name="chev" size={16} />
            <input type="color" aria-label="Page background colour" value={bg} onChange={(e) => onTheme({ ...layoutTheme, background: e.target.value }, "theme-background")} style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
          </label>}
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--admin-text)" }}>Canvas Size</h3>
          <select className="nle-field" aria-label="Canvas size" disabled defaultValue="a4"><option value="a4">Default (A4)</option></select>
          <h3 style={{ margin: "6px 0 0", fontSize: 15, fontWeight: 700, color: "var(--admin-text)" }}>Margins</h3>
          <select className="nle-field" aria-label="Margins" disabled defaultValue="normal"><option value="normal">Normal</option></select>
        </div>
        <div style={card}>
          <h3 className="nle-h">Page colours</h3>
          {layoutTheme && <ThemeForm theme={layoutTheme} onChange={onTheme} />}
        </div>
        <div style={{ display: "flex", gap: 10, padding: 14, borderRadius: 12, background: "color-mix(in srgb, var(--admin-accent) 8%, var(--admin-surface))" }}>
          <span style={{ color: "var(--admin-accent)" }}><Icon name="info" size={20} /></span>
          <div><strong style={{ fontSize: 13, color: "var(--admin-text)" }}>Tip</strong>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--admin-text-sub)", lineHeight: 1.5 }}>You can resize elements freely by dragging the corners. Click anything to select it, double-click text to type over it.</p></div>
        </div>
      </>}
      </>}
      {A.error && <p role="alert" style={{ margin: 0, fontSize: 12, color: "var(--admin-danger)" }}>{A.error}</p>}
      </div>
    </aside>;
}
