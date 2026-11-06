import { useState } from "react";
import { SHAPES, EMOJI } from "@/lib/newsletter-shapes";
import { NAMES } from "@/lib/newsletter-layout";
import NewsletterDesign from "@/components/NewsletterDesign";
import { Icon } from "./editor-ui";

const TABS = [["elements", "grid", "Elements"], ["text", "text", "Text"], ["photos", "image", "Photos"], ["shapes", "shapes", "Shapes"], ["stickers", "smile", "Stickers"], ["uploads", "upload", "Uploads"], ["pages", "pages", "Pages"]];
const BLOCKS = [["story", "Headline with a story"], ["text", "Heading and paragraphs"], ["hero", "Cover with big numbers"], ["quote", "A highlighted sentence"], ["timeline", "Dated steps"], ["kpis", "Scorecard numbers"], ["stat", "One big number"], ["cards", "Numbered boxes"], ["photos", "Row of photos"], ["image", "One wide photo"]];
const SECTIONS = [["canvas", "Blank free-form area"], ["columns", "Row of columns"], ["band", "Colour banner"], ["ribbon", "Strip at the top"], ["masthead", "Logo row"], ["footer", "Contacts and small print"]];
const QUICK_SHAPES = ["rect", "circle", "triangle", "star"];
const QUICK_STICKERS = ["⭐", "❤️", "📣", "🔔"];
const ILLUSTRATIONS = [["📅", "Calendar"], ["📧", "Envelope"], ["📈", "Chart"]];
const TEXT_STYLES = [["heading", "Heading", 26, 800], ["sub", "Subheading", 18, 700], ["body", "Body Text", 18, 500]];

function ShapePreview({ kind, size = 34 }) {
  const sh = SHAPES[kind];
  return <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ color: "var(--admin-accent)" }}>
      {kind === "rounded" ? <rect x="6" y="14" width="88" height="72" rx="18" fill="currentColor" /> : kind === "rect" ? <rect x="6" y="6" width="88" height="88" fill="currentColor" /> : sh.line ? <path d={sh.d} fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /> : <path d={sh.d} fill="currentColor" />}
    </svg>;
}

// A shrunken look at a page for the Pages tab.
function Thumb({ layout }) {
  return <div style={{ height: 120, overflow: "hidden", background: "#fff", borderRadius: 6, position: "relative", border: "1px solid var(--admin-border)" }}>
      {layout?.sections && <div aria-hidden="true" style={{ width: 1200, transform: "scale(0.19)", transformOrigin: "top left", pointerEvents: "none" }}><NewsletterDesign design={layout} /></div>}
    </div>;
}

const Heading = ({ title, onAll }) => <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 10px" }}>
    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--admin-text)" }}>{title}</h3>
    {onAll && <button type="button" onClick={onAll} style={{ border: 0, background: "transparent", cursor: "pointer", color: "var(--admin-text)", fontSize: 12, fontWeight: 600, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}>See all <Icon name="arrowr" size={13} /></button>}
  </div>;

const tile = { height: 54, fontSize: 24 };

export default function LeftPanel({ tab, setTab, pages, curPage, layout, A }) {
  const [q, setQ] = useState("");
  const [tip, setTip] = useState(true);
  const needle = q.trim().toLowerCase();
  const has = (...words) => !needle || words.some((w) => w.toLowerCase().includes(needle));
  const shapesAll = Object.entries(SHAPES);

  const textStyles = <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {TEXT_STYLES.filter(([k, l]) => has(l, "text")).map(([k, l, size, weight]) => <button key={k} type="button" className="nle-tile" style={{ height: 84, gap: 6, borderRadius: 12 }} onClick={() => A.addText(k)}>
          <span style={{ fontSize: size, fontWeight: weight, fontFamily: "Poppins, sans-serif", color: k === "heading" ? "var(--admin-text)" : "var(--admin-text-sub)", lineHeight: 1 }}>Aa</span>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{l}</span>
        </button>)}
    </div>;
  const shapeTile = (k) => <button key={k} type="button" className="nle-tile" style={{ ...tile, borderRadius: 12 }} onClick={() => A.addShape(k)} title={`Add ${SHAPES[k].label.toLowerCase()}`} aria-label={`Add ${SHAPES[k].label.toLowerCase()}`}><ShapePreview kind={k} size={26} /></button>;
  const stickerTile = (ch) => <button key={ch} type="button" className="nle-tile" style={{ ...tile, borderRadius: 12 }} aria-label={`Add ${ch}`} onClick={() => A.addEmoji(ch)}>{ch}</button>;
  const grid4 = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 };
  const upload = <div style={{ display: "grid", gap: 8 }}>
      <button type="button" className="nle-primary" onClick={A.uploadPhoto} disabled={!!A.uploading}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="upload" size={15} />Upload a photo</span></button>
      {A.uploading && <p role="status" style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)" }}>Uploading… {A.uploading.pct}%</p>}
      {A.recent.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {A.recent.map((u) => <button key={u} type="button" className="nle-tile" style={{ padding: 0, overflow: "hidden", height: 84, borderRadius: 12 }} onClick={() => A.addPhoto(u)} aria-label="Add this photo"><img src={u} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></button>)}
      </div>}
      <p style={{ margin: 0, fontSize: 11, color: "var(--admin-text-sub)", lineHeight: 1.5 }}>To swap a photo already on the page, double-click it.</p>
    </div>;

  return <div style={{ display: "flex", minHeight: 0, borderRight: "1px solid var(--admin-border)", background: "var(--admin-surface)" }} className="nlp-left">
      <div role="tablist" aria-label="Add and arrange" aria-orientation="vertical" style={{ width: 68, flexShrink: 0, borderRight: "1px solid var(--admin-border)", background: "var(--admin-surface)", paddingTop: 6, overflowY: "auto" }}>
        {TABS.map(([key, icon, label]) => <button key={key} type="button" role="tab" aria-selected={tab === key} className="nle-tab" onClick={() => setTab(key)}><Icon name={icon} size={20} />{label}</button>)}
      </div>
      <div className="nle-scroll" role="tabpanel" style={{ width: 244, overflowY: "auto", padding: 12, display: "grid", gap: 18, alignContent: "start" }}>
        {tab === "elements" && <>
          <label style={{ position: "relative", display: "block" }}>
            <span style={{ position: "absolute", left: 12, top: 12, color: "var(--admin-text-sub)", display: "flex" }}><Icon name="search" size={16} /></span>
            <input type="search" className="nle-input" aria-label="Search elements" placeholder="Search elements..." value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "100%", height: 42, paddingLeft: 36, borderRadius: 12, fontSize: 13 }} />
          </label>
          {has("text styles", "heading", "subheading", "body") && <div><Heading title="Text Styles" />{textStyles}</div>}
          {has("shapes", ...QUICK_SHAPES.map((k) => SHAPES[k].label)) && <div><Heading title="Shapes" onAll={() => setTab("shapes")} />
            <div style={grid4}>{QUICK_SHAPES.map(shapeTile)}</div></div>}
          {has("stickers", "emoji") && <div><Heading title="Stickers" onAll={() => setTab("stickers")} />
            <div style={grid4}>{QUICK_STICKERS.map(stickerTile)}</div></div>}
          {has("buttons", "button") && <div><Heading title="Buttons" />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button type="button" className="nle-primary" style={{ height: 40, borderRadius: 999, flex: 1 }} onClick={() => A.addButton("solid")}>Button</button>
              <button type="button" onClick={() => A.addButton("soft")} style={{ height: 40, flex: 1, borderRadius: 999, border: "2px solid var(--admin-accent)", background: "var(--admin-surface)", color: "var(--admin-accent)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Button</button>
              <button type="button" className="nle-primary" style={{ width: 40, height: 40, padding: 0, borderRadius: "50%" }} aria-label="Add an arrow" onClick={() => A.addShape("arrow")}><Icon name="arrowr" size={18} /></button>
            </div></div>}
          {has("illustrations", ...ILLUSTRATIONS.map(([, l]) => l)) && <div><Heading title="Illustrations" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {ILLUSTRATIONS.map(([ch, l]) => <button key={ch} type="button" className="nle-tile" style={{ height: 76, fontSize: 34, borderRadius: 12 }} aria-label={`Add ${l.toLowerCase()}`} onClick={() => A.addEmoji(ch)}>{ch}</button>)}
            </div></div>}
          {!needle && <details><summary className="nle-h" style={{ cursor: "pointer" }}>Ready-made blocks</summary>
            <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
              {[...BLOCKS.map((b) => [...b, A.addBlock]), ...SECTIONS.map((s) => [...s, A.addSection])].map(([t, d, add]) => <button key={t} type="button" className="nle-tile" style={{ alignItems: "flex-start", textAlign: "left", padding: "8px 10px", gap: 1 }} onClick={() => add(t)}><strong style={{ fontSize: 12 }}>{NAMES[t]}</strong><span style={{ color: "var(--admin-text-sub)" }}>{d}</span></button>)}
            </div>
          </details>}
          {tip && !needle && <div style={{ position: "relative", display: "flex", gap: 10, padding: 14, borderRadius: 12, background: "color-mix(in srgb, var(--admin-accent) 8%, var(--admin-surface))" }}>
            <span style={{ color: "var(--admin-accent)" }}><Icon name="bulb" size={20} /></span>
            <div><strong style={{ fontSize: 13, color: "var(--admin-text)" }}>Pro Tip</strong>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--admin-text-sub)", lineHeight: 1.5 }}>Drag and drop elements onto your canvas.</p></div>
            <button type="button" aria-label="Dismiss tip" onClick={() => setTip(false)} style={{ position: "absolute", top: 8, right: 8, border: 0, background: "transparent", cursor: "pointer", color: "var(--admin-text-sub)", display: "flex" }}><Icon name="close" size={14} /></button>
          </div>}
        </>}

        {tab === "text" && <div><Heading title="Text Styles" />{textStyles}</div>}

        {tab === "photos" && <div><Heading title="Photos" />{upload}</div>}

        {tab === "uploads" && <div><Heading title="Uploads" />
          {A.recent.length === 0 && !A.uploading ? <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--admin-text-sub)" }}>Photos you upload in this editor show up here.</p> : null}
          {upload}</div>}

        {tab === "shapes" && <div><Heading title="Shapes and lines" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {shapesAll.map(([k, s]) => <button key={k} type="button" className="nle-tile" style={{ borderRadius: 12, height: 76 }} onClick={() => A.addShape(k)} title={`Add ${s.label.toLowerCase()}`}><ShapePreview kind={k} />{s.label}</button>)}
          </div></div>}

        {tab === "stickers" && <div><Heading title="Stickers" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {EMOJI.map((ch) => <button key={ch} type="button" className="nle-btn" style={{ height: 44, fontSize: 24 }} aria-label={`Add ${ch}`} onClick={() => A.addEmoji(ch)}>{ch}</button>)}
          </div></div>}

        {tab === "pages" && <div style={{ display: "grid", gap: 10 }}>
          <Heading title={`Pages (${pages.length})`} />
          {pages.map((p, i) => <button key={i} type="button" onClick={() => A.gotoPage(i)} aria-current={i === curPage} style={{ display: "grid", gap: 4, padding: 6, textAlign: "left", cursor: "pointer", borderRadius: 10, border: `2px solid ${i === curPage ? "var(--admin-accent)" : "var(--admin-border)"}`, background: "var(--admin-surface)", fontFamily: "inherit" }}>
              <Thumb layout={p.layout} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text)" }}>Page {i + 1}</span>
            </button>)}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" className="nle-ghost" onClick={() => A.newPage("blank")}>+ Blank</button>
            <button type="button" className="nle-ghost" onClick={() => A.newPage("template")}>+ Template</button>
            <button type="button" className="nle-ghost" onClick={() => A.newPage("copy")} disabled={!layout?.sections}>+ Copy</button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" className="nle-ghost" onClick={() => A.shiftPage(-1)} disabled={curPage === 0}>◀ Earlier</button>
            <button type="button" className="nle-ghost" onClick={() => A.shiftPage(1)} disabled={curPage === pages.length - 1}>Later ▶</button>
            <button type="button" className="nle-ghost" style={{ color: "var(--admin-danger)" }} onClick={A.deletePage}>Delete page</button>
          </div>
        </div>}
      </div>
    </div>;
}
