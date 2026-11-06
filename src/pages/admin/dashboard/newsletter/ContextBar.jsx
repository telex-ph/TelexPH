import { FONTS } from "@/lib/newsletter-shapes";
import { NAMES } from "@/lib/newsletter-layout";
import { Icon, IconBtn, Sep, Swatch, Num } from "./editor-ui";

const PX = 12; // a text box's size is stored as % of the page width; shown as px on a 1200px page
const bar = { display: "flex", alignItems: "center", gap: 2, padding: "6px 14px", overflowX: "auto", minHeight: 46, boxSizing: "border-box", background: "var(--admin-surface)", borderBottom: "1px solid var(--admin-border)" };
const cap = { fontSize: 11, color: "var(--admin-text-sub)", margin: "0 4px 0 8px", whiteSpace: "nowrap" };

const Tag = ({ children }) => <span style={{ fontSize: 11, fontWeight: 700, color: "var(--admin-accent-text)", background: "var(--admin-accent-soft)", borderRadius: 6, padding: "4px 8px", marginRight: 8, whiteSpace: "nowrap" }}>{children}</span>;

function AlignButtons({ A, multi }) {
  return <>
      <IconBtn icon="alignl" label={multi ? "Align left edges" : "Align left"} onClick={() => A.align("left")} />
      <IconBtn icon="alignc" label={multi ? "Align centres" : "Centre on the page"} onClick={() => A.align("center")} />
      <IconBtn icon="alignr" label={multi ? "Align right edges" : "Align right"} onClick={() => A.align("right")} />
      <IconBtn icon="alignt" label={multi ? "Align top edges" : "Align to the top"} onClick={() => A.align("top")} />
      <IconBtn icon="alignm" label={multi ? "Align middles" : "Middle of the section"} onClick={() => A.align("middle")} />
      <IconBtn icon="alignb" label={multi ? "Align bottom edges" : "Align to the bottom"} onClick={() => A.align("bottom")} />
    </>;
}

// The bar under the title: it shows the controls for whatever is selected, like a design app's top toolbar.
// `A` holds the editor's actions; `node` is the selected thing and `kind` is "float", "block" or "section".
export default function ContextBar({ kind, node, A, multi, multiCol, canMoveUp, canMoveDown }) {
  if (!node) {
    return <div style={{ ...bar, fontSize: 12, color: "var(--admin-text-sub)" }}>
        <span style={{ whiteSpace: "nowrap" }}>Click anything to select it. Double-click text to type, or a photo to replace it. Drag a box to pick several.</span>
      </div>;
  }
  const set = (patch, key) => A.patch(patch, key);

  if (kind === "float" && multi) {
    return <div style={bar} role="toolbar" aria-label="Selected elements">
        <Tag>{A.count} selected</Tag>
        <button type="button" className="nle-ghost" onClick={() => A.group(`g${Math.random().toString(36).slice(2, 7)}`)} title="Move these together (Ctrl+G)"><Icon name="group" size={15} />Group</button>
        <button type="button" className="nle-ghost" style={{ marginLeft: 4 }} onClick={() => A.group(undefined)} title="Let them move on their own (Ctrl+Shift+G)"><Icon name="ungroup" size={15} />Ungroup</button>
        <Sep />
        <AlignButtons A={A} multi />
        <Sep />
        <span style={cap}>Opacity</span>
        <Num label="Opacity %" value={Math.round((node.opacity ?? 1) * 100)} min={5} max={100} width={54} onChange={(v) => set({ opacity: v / 100 }, "opacity")} />
        <Sep />
        <IconBtn icon="front" label="Bring to front" onClick={() => A.reorder("front")} />
        <IconBtn icon="back" label="Send to back" onClick={() => A.reorder("back")} />
        <Sep />
        <IconBtn icon="copy" label="Duplicate (Ctrl+D)" onClick={A.duplicate} />
        <IconBtn icon="trash" label="Delete (Del)" danger onClick={A.remove} />
      </div>;
  }

  const tag = <Tag>{NAMES[node.type] || node.type}</Tag>;

  if (kind === "float") {
    const lineShape = node.kind === "line" || node.kind === "arrow-line";
    return <div style={bar} role="toolbar" aria-label="Selected element">
        {tag}
        {node.type === "ftext" && <>
          <select aria-label="Font" className="nle-select" value={node.family} onChange={(e) => set({ family: e.target.value })} style={{ width: 112 }}>
            {Object.entries(FONTS).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}
          </select>
          <IconBtn icon="minus" label="Smaller text" onClick={() => set({ size: Math.max(0.5, Math.round((node.size - 0.1) * 100) / 100) }, "size")} />
          <Num label="Font size" value={Math.round(node.size * PX)} min={6} max={360} width={52} onChange={(v) => set({ size: v / PX }, "size")} />
          <IconBtn icon="plus" label="Bigger text" onClick={() => set({ size: Math.round((node.size + 0.1) * 100) / 100 }, "size")} />
          <Sep />
          <IconBtn icon="bold" label="Bold" on={node.weight >= 700} onClick={() => set({ weight: node.weight >= 700 ? 400 : 800 })} />
          <IconBtn icon="italic" label="Italic" on={node.italic} onClick={() => set({ italic: !node.italic })} />
          <IconBtn icon="underline" label="Underline" on={node.underline} onClick={() => set({ underline: !node.underline })} />
          <IconBtn label="Uppercase" on={node.upper} onClick={() => set({ upper: !node.upper })}>Aa</IconBtn>
          <Sep />
          {["left", "center", "right"].map((a) => <IconBtn key={a} icon={a} label={`Align text ${a}`} on={node.align === a} onClick={() => set({ align: a })} />)}
          <Sep />
          <Swatch label="Text colour" value={node.color} onChange={(v) => set({ color: v }, "color")} />
          <Swatch label="Text background" value={node.bg} onChange={(v) => set({ bg: v }, "bg")} clear />
        </>}
        {node.type === "shape" && <>
          {node.grad ? <>
            <span style={cap}>Gradient</span>
            <Swatch label="Gradient start colour" value={node.grad.stops[0].c} onChange={(v) => set({ grad: { ...node.grad, stops: node.grad.stops.map((s, i) => (i === 0 ? { ...s, c: v } : s)) } }, "grad0")} />
            <Swatch label="Gradient end colour" value={node.grad.stops.at(-1).c} onChange={(v) => set({ grad: { ...node.grad, stops: node.grad.stops.map((s, i, all) => (i === all.length - 1 ? { ...s, c: v } : s)) } }, "grad1")} />
            <span style={cap}>Angle</span>
            <Num label="Gradient angle" value={node.grad.angle} min={0} max={360} width={56} onChange={(v) => set({ grad: { ...node.grad, angle: v } }, "gradA")} />
            <button type="button" className="nle-ghost" style={{ marginLeft: 6 }} onClick={() => set({ grad: undefined, fill: node.grad.stops[0].c, fa: 1 })}>Solid</button>
          </> : <>
            <span style={cap}>{lineShape ? "Line" : "Fill"}</span>
            {lineShape
              ? <Swatch label="Line colour" value={node.stroke} onChange={(v) => set({ stroke: v }, "stroke")} />
              : <Swatch label="Fill colour" value={node.fill} onChange={(v) => set({ fill: v }, "fill")} clear />}
            {!lineShape && node.fill && <>
              <span style={cap}>Fill opacity</span>
              <Num label="Fill opacity %" value={Math.round((node.fa ?? 1) * 100)} min={0} max={100} width={54} onChange={(v) => set({ fa: v / 100 }, "fa")} />
            </>}
          </>}
          {!lineShape && <>
            <span style={cap}>Border</span>
            <Swatch label="Border colour" value={node.stroke} onChange={(v) => set({ stroke: v, sw: node.sw || 2 }, "stroke")} clear />
          </>}
          <span style={cap}>Width</span>
          <Num label="Border width" value={node.sw} min={0} max={20} step={0.5} width={50} onChange={(v) => set({ sw: v }, "sw")} />
          {(node.kind === "rounded" || node.kind === "rect") && <>
            <span style={cap}>Corners</span>
            <Num label="Corner radius" value={node.r} min={0} max={50} width={50} onChange={(v) => set({ r: v, kind: v > 0 ? "rounded" : "rect" }, "r")} />
          </>}
          {(node.kind === "rounded" || node.kind === "rect" || node.kind === "circle") && <IconBtn label="Soft shadow" on={node.shadow} onClick={() => set({ shadow: !node.shadow })}>Shadow</IconBtn>}
        </>}
        {node.type === "fpic" && <>
          <button type="button" className="nle-ghost" onClick={A.replacePhoto}><Icon name="image" size={15} />{node.img?.url ? "Replace photo" : "Add photo"}</button>
          <span style={cap}>Corners</span>
          <Num label="Corner radius" value={node.r} min={0} max={50} width={50} onChange={(v) => set({ r: v }, "r")} />
        </>}
        <Sep />
        <span style={cap}>Opacity</span>
        <Num label="Opacity %" value={Math.round((node.opacity ?? 1) * 100)} min={5} max={100} width={54} onChange={(v) => set({ opacity: v / 100 }, "opacity")} />
        <Sep />
        <AlignButtons A={A} />
        <Sep />
        <IconBtn icon="front" label="Bring to front (Ctrl+])" onClick={() => A.reorder("front")} />
        <IconBtn icon="back" label="Send to back (Ctrl+[)" onClick={() => A.reorder("back")} />
        <Sep />
        {node.g && <button type="button" className="nle-ghost" onClick={() => A.group(undefined)} title="Take this out of its group"><Icon name="ungroup" size={15} />Ungroup</button>}
        <IconBtn icon={node.locked ? "lock" : "unlock"} label={node.locked ? "Unlock" : "Lock position"} on={node.locked} onClick={() => set({ locked: !node.locked })} />
        <IconBtn icon="copy" label="Duplicate (Ctrl+D)" onClick={A.duplicate} />
        <IconBtn icon="trash" label="Delete (Del)" danger onClick={A.remove} />
      </div>;
  }

  if (node.type === "canvas") {
    return <div style={bar} role="toolbar" aria-label="Selected canvas">
        {tag}
        <IconBtn icon="up" label="Move up (Alt+Up)" disabled={!canMoveUp} onClick={() => A.shift(-1)} />
        <IconBtn icon="down" label="Move down (Alt+Down)" disabled={!canMoveDown} onClick={() => A.shift(1)} />
        <Sep />
        <span style={cap}>Height</span>
        <Num label="Canvas height (%)" value={node.h} min={2} max={700} step={1} width={64} onChange={(v) => A.patch({ h: v }, "h")} />
        <button type="button" className="nle-ghost" style={{ marginLeft: 6 }} onClick={A.fitCanvas}>Fit to elements</button>
        <Sep />
        <IconBtn icon="copy" label="Duplicate (Ctrl+D)" onClick={A.duplicate} />
        <IconBtn icon="trash" label="Delete (Del)" danger onClick={A.remove} />
      </div>;
  }

  const styled = kind === "block" || ["columns", "footer", "masthead"].includes(node.type);
  return <div style={bar} role="toolbar" aria-label={`Selected ${kind}`}>
      {tag}
      <IconBtn icon="up" label="Move up (Alt+Up)" disabled={!canMoveUp} onClick={() => A.shift(-1)} />
      <IconBtn icon="down" label="Move down (Alt+Down)" disabled={!canMoveDown} onClick={() => A.shift(1)} />
      {multiCol && <>
        <Sep />
        <IconBtn icon="minus" label="Narrower column" onClick={() => A.widen(-1)} />
        <span style={{ fontSize: 11, color: "var(--admin-text-sub)" }}>Width</span>
        <IconBtn icon="plus" label="Wider column" onClick={() => A.widen(1)} />
      </>}
      {styled && <>
        <Sep />
        <span style={cap}>Background</span>
        <Swatch label="Background colour" value={node.style?.bg || ""} onChange={(v) => A.patchStyle({ bg: v }, "bg")} clear />
      </>}
      {node.type === "band" && <>
        <Sep />
        <span style={cap}>Banner</span>
        <Swatch label="Banner colour" value={node.bg} onChange={(v) => set({ bg: v }, "bg")} />
        <Swatch label="Banner text colour" value={node.color} onChange={(v) => set({ color: v }, "color")} />
      </>}
      <Sep />
      <button type="button" className="nle-ghost" onClick={A.ungroupSection} title="Turn every piece of this section into its own element you can move and edit"><Icon name="ungroup" size={15} />Ungroup into elements</button>
      <Sep />
      <IconBtn icon="copy" label="Duplicate (Ctrl+D)" onClick={A.duplicate} />
      <IconBtn icon="trash" label="Delete (Del)" danger onClick={A.remove} />
    </div>;
}
