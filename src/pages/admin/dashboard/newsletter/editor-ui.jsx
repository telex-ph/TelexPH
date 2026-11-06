// Small building blocks for the newsletter editor: icons, buttons, colour swatch, number box. Colours are admin tokens.
import { useState, useEffect, useRef } from "react";

const ICONS = {
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/>',
  text: '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',
  shapes: '<path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="3.5"/>',
  blocks: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  pages: '<path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  copy: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  bold: '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
  italic: '<path d="M19 4h-9"/><path d="M14 20H5"/><path d="M15 4 9 20"/>',
  underline: '<path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M4 20h16"/>',
  left: '<path d="M21 5H3"/><path d="M15 12H3"/><path d="M17 19H3"/>',
  center: '<path d="M21 5H3"/><path d="M17 12H7"/><path d="M19 19H5"/>',
  right: '<path d="M21 5H3"/><path d="M21 12H9"/><path d="M21 19H7"/>',
  up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  down: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  front: '<path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/>',
  back: '<path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  alignl: '<path d="M4 3v18"/><rect x="8" y="6" width="12" height="4" rx="1"/><rect x="8" y="14" width="7" height="4" rx="1"/>',
  alignc: '<path d="M12 3v18"/><rect x="5" y="6" width="14" height="4" rx="1"/><rect x="8" y="14" width="8" height="4" rx="1"/>',
  alignt: '<path d="M3 4h18"/><rect x="6" y="8" width="4" height="12" rx="1"/><rect x="14" y="8" width="4" height="7" rx="1"/>',
  alignm: '<path d="M3 12h18"/><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="8" width="4" height="8" rx="1"/>',
  alignb: '<path d="M3 20h18"/><rect x="6" y="4" width="4" height="12" rx="1"/><rect x="14" y="9" width="4" height="7" rx="1"/>',
  group: '<rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="3 3"/><rect x="7" y="7" width="5" height="5" rx="1"/><rect x="12" y="12" width="5" height="5" rx="1"/>',
  ungroup: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/><path d="M15 5h4M17 3v4"/>',
  alignr: '<path d="M20 3v18"/><rect x="4" y="6" width="12" height="4" rx="1"/><rect x="9" y="14" width="7" height="4" rx="1"/>',
  back2: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  arrowr: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  fit: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
  pattern: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'
};

export function Icon({ name, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }} />;
}

// A square toolbar button. `on` shows it pressed (bold on, locked...).
export function IconBtn({ icon, label, onClick, on, disabled, children, danger, size = 32 }) {
  return <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={on === undefined ? undefined : !!on}
    disabled={disabled}
    onClick={onClick}
    className="nle-btn"
    style={{ minWidth: size, height: size, padding: children ? "0 8px" : 0, color: danger ? "var(--admin-danger)" : on ? "var(--admin-accent-text)" : "var(--admin-text)", background: on ? "var(--admin-accent-soft)" : "transparent" }}
  >{icon && <Icon name={icon} size={17} />}{children}</button>;
}

// A toolbar button that opens a small list of actions: items are [label, run, icon?]. Closes on an outside click.
export function Menu({ trigger, items, disabled, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const off = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, [open]);
  return <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button type="button" className="nle-tool" disabled={disabled} aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{trigger}<Icon name="chev" size={14} /></button>
      {open && <div role="menu" className="nle-menu">
          {items.map(([text, run, icon]) => <button key={text} type="button" role="menuitem" className="nle-menuitem" onClick={() => { setOpen(false); run(); }}>{icon && <Icon name={icon} size={15} />}{text}</button>)}
        </div>}
    </span>;
}

export const Sep = () => <span aria-hidden="true" style={{ width: 1, height: 22, background: "var(--admin-border)", margin: "0 6px", flexShrink: 0 }} />;

// A colour box. "" means no colour (shown struck through); `clear` adds an x to go back to none.
export function Swatch({ value, onChange, label, clear }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      <label title={label} className="nle-swatch" style={{ background: value || "var(--admin-surface)" }}>
        {!value && <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 46%, var(--admin-danger) 47% 53%, transparent 54%)" }} />}
        <input type="color" aria-label={label} value={value || "#ffffff"} onChange={(e) => onChange(e.target.value)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
      </label>
      {clear && value && <button type="button" aria-label={`Remove ${label}`} title="No colour" onClick={() => onChange("")} className="nle-btn" style={{ minWidth: 18, height: 18, color: "var(--admin-text-sub)" }}><Icon name="close" size={12} /></button>}
    </span>;
}

export function Num({ value, onChange, min = 0, max = 100, step = 1, label, width = 58 }) {
  const n = Number.isFinite(Number(value)) ? Number(value) : 0;
  const set = (v) => { const x = Math.min(max, Math.max(min, Number(v))); if (Number.isFinite(x)) onChange(Math.round(x * 100) / 100); };
  return <input type="number" aria-label={label} title={label} value={Math.round(n * 100) / 100} min={min} max={max} step={step} onChange={(e) => e.target.value !== "" && set(e.target.value)} className="nle-input" style={{ width }} />;
}

export const CSS = `
.nle-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:0;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;white-space:nowrap;flex-shrink:0}
.nle-btn:hover:not(:disabled){background:var(--admin-accent-soft)!important}
.nle-btn:disabled{opacity:.35;cursor:default}
.nle-btn:focus-visible,.nle-input:focus-visible,.nle-tab:focus-visible,.nle-tile:focus-visible{outline:2px solid var(--admin-accent);outline-offset:1px}
.nle-input{box-sizing:border-box;height:30px;padding:0 6px;font-size:12px;color:var(--admin-text);background:var(--admin-surface);border:1px solid var(--admin-border);border-radius:6px;font-family:inherit}
.nle-swatch{position:relative;display:inline-block;width:26px;height:26px;border-radius:6px;border:1px solid var(--admin-border-strong);overflow:hidden;cursor:pointer;flex-shrink:0}
.nle-select{height:30px;padding:0 6px;font-size:12px;color:var(--admin-text);background:var(--admin-surface);border:1px solid var(--admin-border);border-radius:6px;font-family:inherit}
.nle-primary{height:32px;padding:0 16px;border:0;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;color:var(--admin-text-on-accent);background:linear-gradient(135deg,var(--admin-accent),var(--admin-accent-hover));font-family:inherit}
.nle-primary:hover{filter:brightness(1.08)}
.nle-ghost{height:32px;padding:0 12px;border:1px solid var(--admin-border);border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:var(--admin-text);background:var(--admin-surface);font-family:inherit;display:inline-flex;align-items:center;gap:6px}
.nle-ghost:hover:not(:disabled){background:var(--admin-accent-soft)}
.nle-ghost:disabled{opacity:.4;cursor:default}
.nle-ghost[aria-pressed=true]{background:var(--admin-accent-soft);color:var(--admin-accent-text);border-color:var(--admin-accent)}
.nle-tab{display:flex;flex-direction:column;align-items:center;gap:5px;width:calc(100% - 16px);margin:6px 8px 0;padding:11px 2px 9px;border:0;border-radius:14px;background:transparent;cursor:pointer;color:var(--admin-text-sub);font-size:11px;font-weight:600;font-family:inherit}
.nle-tab:hover{color:var(--admin-text);background:var(--admin-bg-hover)}
.nle-tab[aria-selected=true]{color:var(--admin-text-on-accent);background:var(--admin-accent);box-shadow:0 4px 12px color-mix(in srgb,var(--admin-accent) 35%,transparent)}
.nle-tool{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 12px;border:0;border-radius:9px;background:transparent;color:var(--admin-text);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;white-space:nowrap}
.nle-tool:hover:not(:disabled){background:var(--admin-accent-soft)}
.nle-tool:disabled{opacity:.38;cursor:default}
.nle-tool[aria-pressed=true]{background:var(--admin-accent-soft);color:var(--admin-accent-text)}
.nle-menu{position:absolute;top:100%;left:0;margin-top:4px;min-width:176px;padding:4px;display:grid;background:var(--admin-surface);border:1px solid var(--admin-border);border-radius:10px;box-shadow:var(--admin-shadow-lg);z-index:30}
.nle-menuitem{display:flex;gap:8px;align-items:center;padding:8px 10px;border:0;border-radius:6px;background:transparent;color:var(--admin-text);font-size:12px;font-family:inherit;text-align:left;cursor:pointer}
.nle-menuitem:hover{background:var(--admin-accent-soft)}
.nle-lg{height:42px;padding:0 18px;border-radius:12px;font-size:14px}
.nle-saved{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 14px;border-radius:999px;background:color-mix(in srgb,#16a34a 10%,var(--admin-surface));color:#15803d;font-size:12px;font-weight:600}
.nle-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:3px;border-radius:10px;background:var(--admin-bg-soft);border:1px solid var(--admin-border)}
.nle-seg button{display:inline-flex;align-items:center;justify-content:center;gap:5px;height:30px;border:0;border-radius:8px;background:transparent;color:var(--admin-text-sub);font-size:12px;font-weight:600;font-family:inherit;cursor:pointer}
.nle-seg button[aria-pressed=true]{background:var(--admin-surface);color:var(--admin-text);box-shadow:var(--admin-shadow-md)}
.nle-seg button:disabled{opacity:.4;cursor:default}
.nle-field{display:flex;align-items:center;justify-content:space-between;width:100%;height:42px;padding:0 12px;box-sizing:border-box;border:1px solid var(--admin-border);border-radius:10px;background:var(--admin-surface);color:var(--admin-text);font-size:13px;font-family:inherit}
.nle-rtab{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:7px;height:46px;border:0;border-bottom:3px solid transparent;background:transparent;color:var(--admin-text-sub);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer}
.nle-rtab[aria-selected=true]{color:var(--admin-accent);border-bottom-color:var(--admin-accent)}
.nle-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 4px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-surface);color:var(--admin-text);cursor:pointer;font-size:10px;font-family:inherit}
.nle-tile:hover{border-color:var(--admin-accent);background:var(--admin-accent-soft)}
.nle-layer{display:flex;gap:6px;align-items:center;width:100%;text-align:left;padding:5px 8px;border:0;border-radius:6px;background:transparent;color:var(--admin-text);font-size:12px;cursor:pointer;font-family:inherit}
.nle-layer:hover{background:var(--admin-accent-soft)}
.nle-layer[aria-current=true]{background:var(--admin-accent);color:var(--admin-text-on-accent)}
.nle-h{margin:0;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--admin-text-sub)}
.nle-scroll{scrollbar-width:thin}
`;
