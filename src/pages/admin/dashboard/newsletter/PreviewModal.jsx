import { useState, useEffect, useRef } from "react";
import NewsletterIssueView from "@/components/NewsletterView";
import { getAt, setAt, removeNode, insertNode, nudge, moveNode, duplicateNode, setSpan, findPath, patchFloat, patchFloats, removeFloats, setGroup, duplicateFloats, reorderFloats, floatsOf, moveFloatTo, reorderFloat, uid, NEW_BLOCK, NEW_SECTION, NEW_FLOAT } from "@/lib/newsletter-layout";
import { flattenLayout } from "@/components/newsletter-flatten";
import { TEMPLATES } from "@/lib/newsletter-default-template";
import TemplateModal from "./TemplateModal";
import { swallowClick } from "@/components/NewsletterFloats";
import api from "@/lib/api/axios";
import { imageToUploadFile } from "./newsletterFiles";
import { Icon, IconBtn, Sep, Menu, CSS as UI_CSS } from "./editor-ui";
import ContextBar from "./ContextBar";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

const CSS = `${UI_CSS}
.nlp-body{display:grid;grid-template-columns:auto minmax(0,1fr) 260px;flex:1;min-height:0}
.nlp-body.plain{grid-template-columns:minmax(0,1fr)}
@media (max-width:1200px){.nlp-body{grid-template-columns:auto minmax(0,1fr) 240px}}`;

const SHEET = 1200; // width of the page sheet in the editor, in px at 100% zoom
const startsWith = (path, prefix) => prefix.every((k, i) => path[i] === k);
const kindOf = (path) => (path.length === 2 ? "section" : path[2] === "floats" ? "float" : "block");
const clone = (v) => JSON.parse(JSON.stringify(v));
const tint = (hex, t) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, "0")).join(""); // mix a #rrggbb with white
const ago = (at) => { const m = Math.floor((Date.now() - at) / 60000); return m < 1 ? "just now" : `${m}m ago`; }; // ponytail: only refreshes when the editor re-renders

// The newsletter editor: a design-app style workspace. Left: add things and see pages and layers. Top: tools for what is
// selected. Middle: the page, where everything can be clicked, dragged, resized, rotated and typed over. Right: exact
// settings. A newsletter can have several pages; every change goes through `commitPages`, which keeps undo and redo.
// `onPagesChange(pages)` receives the whole page list after every edit.
// `onSave(status)` (optional) saves the whole issue as "draft" or "published" and rejects with an Error whose message is shown;
// `savedAt` is when it was last saved (ms), for the "Saved ... ago" pill.
function PreviewModal({ open, onClose, issue, originals = [], onPagesChange, startPage = 0, maxPages = 8, onSave, savedAt }) {
  const [cur, setCur] = useState(0); // page being edited
  const [sel, setSel] = useState(null); // selected section, block or floating element: { page, path }
  const [active, setActive] = useState(null); // selected photo box of a block: { page, path }
  const [tab, setTab] = useState("rebuilt");
  const [leftTab, setLeftTab] = useState("elements");
  const [rightTab, setRightTab] = useState("settings");
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [fit, setFit] = useState(true);
  const [preview, setPreview] = useState(false);
  const [editing, setEditing] = useState(false); // typing into a piece of text
  const [autoEdit, setAutoEdit] = useState(null); // { page, id }: a text box that was just added starts in typing mode
  const [recent, setRecent] = useState([]);
  const [marq, setMarq] = useState(null); // the drag-select box being drawn, in the editor area's own pixels
  const [tplOpen, setTplOpen] = useState(false); // choosing a template for a new page
  const [up, setUp] = useState(null); // { pct } while uploading
  const [error, setError] = useState("");
  const [, bump] = useState(0);
  const hist = useRef({ undo: [], redo: [], key: "", at: 0 });
  const fileRef = useRef(null);
  const closeRef = useRef(null);
  const canvasRef = useRef(null);
  const keys = useRef(null);
  const intent = useRef(null); // what the next chosen photo is for
  const clip = useRef(null);
  const latest = useRef(null); // the newest actions, for callbacks that run after an await
  const auto = useRef(new Set()); // pages already ungrouped automatically

  useEffect(() => {
    if (!open) return;
    const before = document.activeElement;
    const onKey = (e) => keys.current?.(e);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      before?.focus?.();
    };
  }, [open]);
  useEffect(() => { if (open) setCur(startPage); }, [open, startPage]);
  useEffect(() => { if (open && !issue.pages.length) onClose(); }, [open, issue.pages.length, onClose]); // last page deleted
  useEffect(() => {
    if (open) return;
    setActive(null); setSel(null); setError(""); setTab("rebuilt"); setPreview(false); setEditing(false); setFit(true);
    hist.current = { undo: [], redo: [], key: "", at: 0 };
    auto.current = new Set();
  }, [open]);
  const layoutNow = issue.pages[cur]?.layout;
  useEffect(() => { // AI pages arrive as blocks: break each one into separate elements the first time it is shown
    if (!open || tab !== "rebuilt" || auto.current.has(cur) || !(layoutNow?.sections?.some((s) => s.type !== "canvas") || layoutNow?.sections?.length > 1)) return; // blocks, or several canvases: make it one canvas
    const p = cur;
    document.fonts.ready.then(() => requestAnimationFrame(() => {
      const a = latest.current;
      if (!a || a.curPage !== p || auto.current.has(p)) return; // moved on, or already done
      auto.current.add(p);
      a.ungroup();
    }));
  }, [open, tab, cur, layoutNow]);
  useEffect(() => { // "fit" keeps the whole page width visible as the window or panels change
    const el = canvasRef.current;
    if (!open || !el || !fit) return;
    const ro = new ResizeObserver(() => setZoom(Math.round(Math.min(1.5, Math.max(0.3, (el.clientWidth - 48) / SHEET)) * 100) / 100));
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, fit, tab]);
  if (!open) return null;

  const pages = issue.pages;
  const layoutOf = (p) => pages[p]?.layout;
  const curPage = Math.min(cur, Math.max(0, pages.length - 1));
  const curLayout = layoutOf(curPage);
  const editable = !!curLayout?.sections; // older-format pages (stacked bands) can be shown but not edited
  const node = sel ? getAt(layoutOf(sel.page), sel.path) : null;
  const kind = node ? kindOf(sel.path) : null;
  const ids = kind === "float" ? sel.ids || [node.id] : []; // the floating elements picked (several with Shift, a box or a group)
  const multi = ids.length > 1;
  const aLayout = active ? layoutOf(active.page) : null;
  const img = aLayout ? getAt(aLayout, active.path) : null;

  // ---- history: every edit goes through here. `coalesce` lets a burst of typing or dragging count as one undo step.
  const commitPages = (next, coalesce) => {
    const h = hist.current;
    const now = Date.now();
    if (!(coalesce && h.key === coalesce && now - h.at < 1200)) {
      h.undo.push({ pages, sel, cur: curPage });
      if (h.undo.length > 100) h.undo.shift();
    }
    h.key = coalesce || "";
    h.at = now;
    h.redo = [];
    onPagesChange(next);
    bump((n) => n + 1);
  };
  const commit = (page, layout, coalesce) => commitPages(pages.map((p, i) => (i === page ? { ...p, layout } : p)), coalesce);
  const travel = (from, to) => {
    const e = hist.current[from].pop();
    if (!e) return;
    hist.current[to].push({ pages, sel, cur: curPage });
    hist.current.key = "";
    onPagesChange(e.pages);
    setSel(e.sel);
    setActive(null);
    setCur(e.cur);
    bump((n) => n + 1);
  };
  const undo = () => travel("undo", "redo");
  const redo = () => travel("redo", "undo");

  // ---- pages
  const goto = (i) => { setCur(i); setSel(null); setActive(null); setError(""); };
  const addPage = (layout) => {
    if (pages.length >= maxPages) return setError(`A newsletter can have up to ${maxPages} pages.`);
    const at = curPage + 1;
    commitPages([...pages.slice(0, at), { layout }, ...pages.slice(at)]);
    goto(at);
  };
  const newPage = (k) => k === "template" ? setTplOpen(true) : addPage(k === "copy" ? clone(curLayout) : { version: 2, theme: curLayout?.theme || TEMPLATES[0].make().theme, sections: [NEW_SECTION.columns()] });
  const deletePage = () => { commitPages(pages.filter((_, i) => i !== curPage)); goto(Math.max(0, curPage - 1)); };
  const shiftPage = (d) => {
    const j = curPage + d;
    if (j < 0 || j >= pages.length) return;
    const n = [...pages];
    [n[curPage], n[j]] = [n[j], n[curPage]];
    commitPages(n);
    goto(j);
  };

  // ---- selection
  const reveal = (page, path) => setTimeout(() => {
    const id = kindOf(path) === "float" ? getAt(layoutOf(page), path)?.id : null;
    const q = id ? `[data-float="${id}"]` : `[data-path="${path.join(".")}"]`;
    canvasRef.current?.querySelector(`[data-page="${page}"] ${q}`)?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, 60);
  const choose = (page, path, scroll) => {
    const f = kindOf(path) === "float" ? getAt(layoutOf(page), path) : null;
    setSel({ page, path, ...(f ? { ids: [f.id] } : {}) });
    setActive((a) => (a && a.page === page && startsWith(a.path, path) ? a : null));
    if (scroll) reveal(page, path);
  };
  const pickSlot = (page, path, opts) => {
    setActive({ page, path });
    setError("");
    if (opts?.open) { intent.current = { type: "slot", page, path }; fileRef.current?.click(); } // an empty photo box opens the file picker right away
  };

  // ---- editing the selection
  const L = sel ? layoutOf(sel.page) : null;
  const patchNode = (next, key) => commit(sel.page, setAt(L, sel.path, next), key && `${sel.page}:${sel.path.join(".")}:${key}`);
  const patch = (p, key) => patchNode({ ...node, ...p }, key);
  const patchStyle = (p, key) => {
    const st = { bg: "", pad: 0, radius: 0, border: "", ...node.style, ...p };
    const rest = { ...node };
    delete rest.style;
    patchNode(st.bg || st.pad || st.radius || st.border ? { ...rest, style: st } : rest, `style:${key}`);
  };
  const remove = () => {
    commit(sel.page, kind === "float" ? removeFloats(L, sel.path[1], ids) : removeNode(L, sel.path));
    setSel(null);
    setActive(null);
  };
  const duplicate = () => {
    if (kind === "float") {
      const r = duplicateFloats(L, sel.path[1], ids);
      commit(sel.page, r.design);
      selectFloats(sel.page, sel.path[1], r.ids, r.design);
      return;
    }
    const r = duplicateNode(L, sel.path);
    commit(sel.page, r.design);
    setSel({ page: sel.page, path: r.path });
    reveal(sel.page, r.path);
  };
  const shift = (dir) => {
    const d = nudge(L, sel.path, dir);
    if (d === L) return;
    commit(sel.page, d);
    setSel({ page: sel.page, path: [...sel.path.slice(0, -1), sel.path.at(-1) + dir] });
  };
  const reorder = (where) => {
    if (multi) { // several move as one block
      const d = reorderFloats(L, sel.path[1], ids, where === "back" || where === "backward" ? "back" : "front");
      commit(sel.page, d);
      selectFloats(sel.page, sel.path[1], ids, d);
      return;
    }
    const r = reorderFloat(L, sel.path, where);
    if (r.design === L) return;
    commit(sel.page, r.design);
    setSel({ page: sel.page, path: r.path, ids });
  };
  const floatHeight = (page, f) => {
    if (f.type !== "ftext") return f.h;
    const el = canvasRef.current?.querySelector(`[data-page="${page}"] [data-float="${f.id}"]`);
    return el && el.offsetWidth ? (el.offsetHeight / el.offsetWidth) * f.w : 4;
  };
  const sectionHeight = (page, si) => {
    const root = canvasRef.current?.querySelector(`[data-page="${page}"]`);
    const sec = root?.querySelector(`.nl2-sec[data-sec="${si}"]`);
    const nl2 = root?.querySelector(".nl2");
    return sec && nl2 ? sec.offsetHeight / (nl2.offsetWidth / 100) : 100;
  };
  // One element lines up with the page; several line up with each other (the box around them).
  const align = (where) => {
    const si = sel.path[1];
    const picked = floatsOf(L, si).filter((f) => ids.includes(f.id));
    const box = multi
      ? { l: Math.min(...picked.map((f) => f.x)), r: Math.max(...picked.map((f) => f.x + f.w)), t: Math.min(...picked.map((f) => f.y)), b: Math.max(...picked.map((f) => f.y + floatHeight(sel.page, f))) }
      : { l: 0, r: 100, t: 0, b: sectionHeight(sel.page, si) };
    const patches = {};
    for (const f of picked) {
      const h = floatHeight(sel.page, f);
      patches[f.id] = where === "left" ? { x: box.l } : where === "right" ? { x: box.r - f.w } : where === "center" ? { x: (box.l + box.r - f.w) / 2 } : where === "top" ? { y: box.t } : where === "bottom" ? { y: box.b - h } : { y: (box.t + box.b - h) / 2 };
    }
    commit(sel.page, patchFloats(L, si, patches));
  };
  const group = (g) => commit(sel.page, setGroup(L, sel.path[1], ids, g));
  const patchAll = (p, key) => commit(sel.page, patchFloats(L, sel.path[1], Object.fromEntries(ids.map((id) => [id, p]))), key && `${sel.page}:${ids.join(",")}:${key}`);
  const setColSpan = (page, path, span) => {
    const lay = layoutOf(page);
    const colPath = path.slice(0, 4);
    if (span === getAt(lay, colPath).span) return;
    const d = setSpan(lay, colPath, span);
    if (d !== lay) commit(page, d, `span:${page}:${path.join(".")}`);
  };
  const moveTo = (page, from, toArr, at) => {
    const r = moveNode(layoutOf(page), from, toArr, at);
    if (r.design === layoutOf(page)) return;
    commit(page, r.design);
    setSel({ page, path: r.path });
  };

  // ---- canvas callbacks (the page number comes first)
  const onText = (page, path, value) => commit(page, setAt(layoutOf(page), path, value));
  const selectFloats = (page, sec, list, design) => {
    const first = floatsOf(design || layoutOf(page), sec).findIndex((f) => list.includes(f.id));
    if (first < 0) return;
    setSel({ page, path: ["sections", sec, "floats", first], ids: list });
    setActive(null);
  };
  const toggleFloat = (page, sec, id) => {
    const cur = sel && sel.page === page && sel.path[1] === sec && sel.path[2] === "floats" ? sel.ids || [] : [];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    if (next.length) selectFloats(page, sec, next); else { setSel(null); setActive(null); }
  };
  // Drag a box on empty space (the grey around the page, the page's margin, or an empty canvas) to pick every element it
  // touches, like Canva. The box is drawn under the pointer; elements light up while it passes over them; Shift adds to the pick.
  const marquee = (e) => {
    const t = e.target;
    const host = e.currentTarget;
    if (e.button !== 0 || !editable || preview || tab !== "rebuilt" || editing) return;
    if (t.closest(".nl2") && !t.hasAttribute("data-canvas-hit")) return; // on a block, not on empty space
    const wrap = host.parentElement;
    const wr = wrap.getBoundingClientRect();
    const z = wr.width / wrap.offsetWidth || 1; // screen px per CSS px (the editor zoom and the admin zoom)
    const hr = host.getBoundingClientRect();
    if ((e.clientX - hr.left) / z > host.clientWidth || (e.clientY - hr.top) / z > host.clientHeight) return; // the scroll bar
    e.preventDefault();
    const sx = e.clientX;
    const sy = e.clientY;
    const keep0 = e.shiftKey && kind === "float" ? ids : [];
    let on = false;
    const box = (ev) => {
      const x = Math.min(wr.right, Math.max(wr.left, ev.clientX));
      const y = Math.min(wr.bottom, Math.max(wr.top, ev.clientY));
      return { left: Math.min(sx, x), top: Math.min(sy, y), right: Math.max(sx, x), bottom: Math.max(sy, y) };
    };
    const mark = (r) => {
      const hit = [...host.querySelectorAll("[data-float]")].filter((el) => { const b = el.getBoundingClientRect(); return b.right > r.left && b.left < r.right && b.bottom > r.top && b.top < r.bottom; });
      host.querySelectorAll("[data-marq]").forEach((el) => { if (!hit.includes(el)) el.removeAttribute("data-marq"); });
      hit.forEach((el) => el.setAttribute("data-marq", ""));
      return hit;
    };
    const move = (ev) => {
      if (!on && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return;
      on = true;
      const r = box(ev);
      mark(r);
      setMarq({ left: (r.left - wr.left) / z, top: (r.top - wr.top) / z, width: (r.right - r.left) / z, height: (r.bottom - r.top) / z });
    };
    const up = (ev) => {
      window.removeEventListener("pointermove", move);
      setMarq(null);
      if (!on) return; // a plain click: the canvas click handler deselects
      swallowClick();
      const hit = mark(box(ev));
      host.querySelectorAll("[data-marq]").forEach((el) => el.removeAttribute("data-marq"));
      const bySec = {};
      hit.forEach((el) => { const s = Number(el.closest(".nl2-sec").getAttribute("data-sec")); (bySec[s] ||= []).push(el.getAttribute("data-float")); });
      const sec = Object.keys(bySec).map(Number).sort((a, b) => bySec[b].length - bySec[a].length)[0]; // one section at a time
      if (sec === undefined) { if (!keep0.length) { setSel(null); setActive(null); } return; }
      const keep = sel?.path?.[1] === sec ? keep0 : [];
      selectFloats(curPage, sec, [...new Set([...keep, ...bySec[sec]])]);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  };

  const onFloats = (page, sec, map) => commit(page, patchFloats(layoutOf(page), sec, map));
  const onFloat = (page, sec, k, p) => commit(page, patchFloat(layoutOf(page), sec, k, p));
  const onFloatTo = (page, sec, k, to, p) => {
    const r = moveFloatTo(layoutOf(page), sec, k, to, p);
    commit(page, r.design);
    setSel({ page, path: r.path });
  };

  // ---- adding things
  const addFloat = (f, typeNow) => {
    if (!editable) return setError("This page is an older format. Add a new page first.");
    const si = sel && sel.page === curPage ? sel.path[1] : Math.max(0, curLayout.sections.findIndex((s) => s.type === "columns"));
    const d = insertNode(curLayout, ["sections", si, "floats"], 9999, f);
    commit(curPage, d);
    setSel({ page: curPage, path: findPath(d, f), ids: [f.id] });
    setActive(null);
    if (typeNow) setAutoEdit({ page: curPage, id: f.id });
  };
  const addBlock = (type) => {
    if (!editable) return setError("This page is an older format. Add a new page first.");
    const made = NEW_BLOCK[type]();
    const p = sel?.page === curPage ? sel.path : null;
    let d;
    if (p?.length === 6) d = insertNode(curLayout, p.slice(0, -1), p.at(-1) + 1, made); // after the selected block
    else if (p?.length === 2 && getAt(curLayout, p).type === "columns") d = insertNode(curLayout, [...p, "cols", getAt(curLayout, p).cols.length - 1, "blocks"], 99, made);
    else d = insertNode(curLayout, ["sections"], p ? p[1] + 1 : curLayout.sections.length, { type: "columns", cols: [{ span: 12, blocks: [made] }] });
    commit(curPage, d);
    const path = findPath(d, made);
    setSel({ page: curPage, path });
    setActive(null);
    reveal(curPage, path);
  };
  const addSection = (type) => {
    if (!editable) return setError("This page is an older format. Add a new page first.");
    const made = NEW_SECTION[type]();
    const p = sel?.page === curPage ? sel.path : null;
    const d = insertNode(curLayout, ["sections"], p ? p[1] + 1 : curLayout.sections.length, made);
    commit(curPage, d);
    const path = findPath(d, made);
    setSel({ page: curPage, path });
    setActive(null);
    reveal(curPage, path);
  };
  const addPhoto = (url) => {
    const make = (h) => latest.current.addFloat({ ...NEW_FLOAT.photo({ url, x: 50, y: 50, zoom: 1 }), w: 30, h });
    const im = new Image();
    im.onload = () => make(Math.min(60, Math.max(8, (30 * im.naturalHeight) / im.naturalWidth)));
    im.onerror = () => make(20);
    im.src = url;
  };

  // ---- uploads (a photo for a box in a block, a replacement for a floating photo, or a new floating photo)
  const uploadFile = async (file) => {
    setError("");
    try {
      setUp({ pct: 0 });
      const ready = await imageToUploadFile(file); // any image type -> JPEG/PNG/WebP under 4MB
      const fd = new FormData();
      fd.append("image", ready);
      const { data } = await api.post("/newsletter/admin/image", fd, {
        timeout: 120000,
        headers: { "Content-Type": "multipart/form-data" }, // see readImage in Page.jsx: the shared axios default is JSON
        onUploadProgress: (e) => setUp({ pct: e.total ? Math.round((e.loaded / e.total) * 100) : 0 })
      });
      return data.url;
    } catch (e) {
      const status = e.response?.status;
      setError(
        e.response?.data?.error && status !== 404 ? e.response.data.error
          : status === 404 ? "The server doesn't have the photo upload route yet. Restart the telexph-admin server, then try again."
          : status === 401 || status === 403 ? "Your session has expired. Log in again, then try the upload."
          : !e.response ? "Couldn't reach the server. Check your connection and try again."
          : "Upload failed."
      );
      return null;
    } finally {
      setUp(null);
    }
  };
  const photoChosen = async (file) => {
    const it = intent.current;
    if (!file || !it) return;
    const url = await uploadFile(file);
    if (!url) return;
    setRecent((r) => [url, ...r.filter((x) => x !== url)].slice(0, 12));
    const a = latest.current;
    if (it.type === "add") return addPhoto(url);
    const lay = a.layoutOf(it.page);
    const path = it.type === "float" ? [...it.path, "img"] : it.path;
    const old = getAt(lay, path);
    a.commit(it.page, setAt(lay, path, { url, x: old?.x ?? 50, y: old?.y ?? 50, zoom: old?.zoom ?? 1 }));
  };
  const askPhoto = (it) => { intent.current = it; fileRef.current?.click(); };

  // "Ungroup": every piece of the chosen sections (or the whole page) becomes its own floating element.
  const ungroup = (only) => {
    const pageEl = canvasRef.current?.querySelector(`[data-page="${curPage}"]`);
    if (!pageEl || !editable) return;
    commit(curPage, flattenLayout(pageEl, curLayout, only));
    setSel(null);
    setActive(null);
  };
  const fitCanvas = () => {
    const si = sel.path[1];
    const bottom = Math.max(4, ...floatsOf(L, si).map((f) => f.y + floatHeight(sel.page, f)));
    patchNode({ ...node, h: Math.round((bottom + 2) * 10) / 10 }, "h");
  };

  latest.current = { addFloat, layoutOf, commit, ungroup, curPage };

  keys.current = (e) => {
    if (tplOpen) return; // the template picker owns the keyboard while it is open
    if (e.key === "Escape") {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return e.target.blur();
      return sel || active ? (setSel(null), setActive(null)) : onClose();
    }
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable) return;
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key.toLowerCase();
    if (mod && k === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && k === "y") { e.preventDefault(); redo(); return; }
    if (mod && k === "v" && clip.current && editable) {
      e.preventDefault();
      const { kind: ck, node: cn } = clip.current;
      const copy = clone(cn);
      if (ck === "float") { copy.id = uid(); copy.x += 2; copy.y += 2; addFloat(copy); } else if (ck === "block") {
        const p = sel?.page === curPage ? sel.path : null;
        const d = p?.length === 6 ? insertNode(curLayout, p.slice(0, -1), p.at(-1) + 1, copy) : insertNode(curLayout, ["sections", Math.max(0, curLayout.sections.findIndex((s) => s.type === "columns")), "cols", 0, "blocks"], 99, copy);
        commit(curPage, d);
        setSel({ page: curPage, path: findPath(d, copy) });
      }
      return;
    }
    if (mod && k === "a" && sel) { // pick every element of this section
      e.preventDefault();
      const si = sel.path[1];
      const all = floatsOf(layoutOf(sel.page), si).map((f) => f.id);
      if (all.length) selectFloats(sel.page, si, all);
      return;
    }
    if (!sel || !node) return;
    if (mod && k === "g" && kind === "float") { e.preventDefault(); group(e.shiftKey ? undefined : `g${uid()}`); return; }
    if (mod && k === "c" && kind !== "section" && !multi) { clip.current = { kind, node: clone(node) }; return; }
    if (mod && k === "d") { e.preventDefault(); duplicate(); }
    else if (mod && e.key === "]" && kind === "float") { e.preventDefault(); reorder("forward"); }
    else if (mod && e.key === "[" && kind === "float") { e.preventDefault(); reorder("backward"); }
    else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); remove(); }
    else if (kind === "float" && !node.locked && e.key.startsWith("Arrow")) {
      e.preventDefault();
      const step = e.shiftKey ? 1 : 0.2;
      const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
      const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
      const movers = floatsOf(L, sel.path[1]).filter((f) => ids.includes(f.id) && !f.locked);
      commit(sel.page, patchFloats(L, sel.path[1], Object.fromEntries(movers.map((f) => [f.id, { x: f.x + dx, y: f.y + dy }]))), `${sel.page}:${ids.join(",")}:nudge`);
    } else if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); shift(e.key === "ArrowUp" ? -1 : 1); }
  };

  // ---- what the panels need
  const colPath = sel && node && sel.path.length === 6 ? sel.path.slice(0, 4) : null;
  const col = colPath ? getAt(L, colPath) : null;
  const multiCol = !!colPath && getAt(L, sel.path.slice(0, 3)).length > 1;
  const siblings = node ? getAt(L, sel.path.slice(0, -1)) : [];
  const saveAs = async (status) => {
    setSaving(true);
    setError("");
    try { await onSave(status); } catch (e) { setError(e.message || "Could not save."); } finally { setSaving(false); }
  };
  const A = {
    patch: (p, key) => (multi ? patchAll(p, key) : patch(p, key)), patchNode, patchStyle, remove, duplicate, shift, reorder, align, error, recent, uploading: up,
    group, ungroupPage: () => ungroup(), ungroupSection: () => ungroup([sel.path[1]]), fitCanvas, count: ids.length,
    widen: (d) => setColSpan(sel.page, sel.path, col.span + d),
    replacePhoto: () => askPhoto({ type: "float", page: sel.page, path: sel.path }),
    uploadPhoto: () => askPhoto({ type: "add" }),
    addPhoto, addPhotoFrame: () => addFloat(NEW_FLOAT.photo(undefined)),
    addShape: (k) => addFloat(NEW_FLOAT.shape(k, curLayout?.theme?.primary || "#a10000")),
    addEmoji: (ch) => addFloat(NEW_FLOAT.emoji(ch)),
    addText: (preset) => addFloat(NEW_FLOAT.text(preset), true),
    // Text boxes have a fill but no outline, so the second button is a tinted one rather than an outlined one.
    addButton: (variant) => {
      const main = curLayout?.theme?.primary || "#a10000";
      addFloat({ ...NEW_FLOAT.text("body"), text: "Button", w: 16, align: "center", weight: 700, size: 1.6, color: variant === "solid" ? "#ffffff" : main, bg: variant === "solid" ? main : tint(main, 0.88) });
    },
    addBlock, addSection, choose, gotoPage: goto, newPage, shiftPage, deletePage,
    nodeKey: sel ? `${sel.page}:${sel.path.join(".")}` : ""
  };
  const photo = active && img !== undefined ? {
    img, uploading: up,
    replace: () => askPhoto({ type: "slot", page: active.page, path: active.path }),
    adjust: (key) => (e) => commit(active.page, setAt(aLayout, active.path, { ...img, [key]: Number(e.target.value) }), `${active.page}:photo:${key}`),
    reset: () => commit(active.page, setAt(aLayout, active.path, { ...img, x: 50, y: 50, zoom: 1 })),
    remove: () => commit(active.page, setAt(aLayout, active.path, undefined))
  } : null;

  const edit = editable && !preview ? { active, onPick: pickSlot, sel, onSelect: choose, onMove: moveTo, onText, onSpan: setColSpan, onFloat, onFloats, onFloatTo, onSelectFloats: selectFloats, onToggleFloat: toggleFloat, onFloatPhoto: (page, path) => askPhoto({ type: "float", page, path }), editing, onEditing: setEditing, autoEdit, onAutoEdited: () => setAutoEdit(null) } : undefined;
  const h = hist.current;
  const side = tab === "rebuilt" && editable && !preview;

  return <>
    <div
    role="dialog"
    aria-modal="true"
    aria-label="Newsletter editor"
    onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.62)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}
  >
      <style>{CSS}</style>
      <input ref={fileRef} type="file" accept="image/*,.heic,.heif,.tif,.tiff,.avif,.svg,.bmp,.gif" style={{ display: "none" }} aria-label="Choose a photo" onChange={(e) => { photoChosen(e.target.files?.[0]); e.target.value = ""; }} />
      <div style={{ width: "min(1900px, 100%)", height: "calc((100vh - 24px) / var(--admin-zoom, 1))", maxHeight: "100%", display: "flex", flexDirection: "column", background: "var(--admin-surface)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--admin-shadow-lg)" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid var(--admin-border)", background: "var(--admin-surface)", flexWrap: "wrap" }}>
          <button ref={closeRef} type="button" className="nle-btn" aria-label="Back to the newsletter form" title="Back" onClick={onClose} style={{ width: 40, height: 40, color: "var(--admin-text)" }}><Icon name="back2" size={22} /></button>
          <span aria-hidden="true" style={{ width: 1, height: 34, background: "var(--admin-border)" }} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--admin-text)" }}>{editable ? "Edit Newsletter" : "Preview"}</h2>
            <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)" }}>Page {curPage + 1} of {pages.length}</p>
          </div>
          <span style={{ flex: 1 }} />
          {onSave && <span className="nle-saved" role="status" style={savedAt ? undefined : { background: "var(--admin-bg-soft)", color: "var(--admin-text-sub)" }}><Icon name="check" size={16} />{savedAt ? `Saved ${ago(savedAt)}` : "Not saved yet"}</span>}
          {editable && tab === "rebuilt" && <button type="button" className="nle-ghost nle-lg" aria-pressed={preview} onClick={() => { setPreview((v) => !v); setSel(null); setActive(null); }}><Icon name="eye" size={18} />Preview</button>}
          {onSave && <button type="button" className="nle-ghost nle-lg" disabled={saving} onClick={() => saveAs("draft")}><Icon name="save" size={18} />Save Draft</button>}
          {onSave && <button type="button" className="nle-primary nle-lg" disabled={saving} onClick={() => saveAs("published")}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Icon name="send" size={18} />{saving ? "Saving…" : "Publish"}</span></button>}
        </header>

        {(side || originals.length > 0) && <div role="toolbar" aria-label="Editor tools" style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 20px", borderBottom: "1px solid var(--admin-border)", background: "var(--admin-surface)", flexWrap: "wrap" }}>
          <button type="button" className="nle-tool" disabled={!h.undo.length} onClick={undo} title="Undo (Ctrl+Z)"><Icon name="undo" size={17} />Undo</button>
          <button type="button" className="nle-tool" disabled={!h.redo.length} onClick={redo} title="Redo (Ctrl+Y)"><Icon name="redo" size={17} />Redo</button>
          <Sep />
          <Menu label="Align" disabled={kind !== "float"} trigger={<><Icon name="alignc" size={17} />Align</>} items={[["Align left", () => A.align("left"), "alignl"], ["Centre on the page", () => A.align("center"), "alignc"], ["Align right", () => A.align("right"), "alignr"], ["Align top", () => A.align("top"), "alignt"], ["Middle of the section", () => A.align("middle"), "alignm"], ["Align bottom", () => A.align("bottom"), "alignb"]]} />
          <Menu label="Arrange" disabled={kind !== "float"} trigger={<><Icon name="layers" size={17} />Arrange</>} items={[["Bring to front", () => A.reorder("front"), "front"], ["Bring forward", () => A.reorder("forward"), "up"], ["Send backward", () => A.reorder("backward"), "down"], ["Send to back", () => A.reorder("back"), "back"]]} />
          <Sep />
          <Menu label="Zoom" disabled={tab !== "rebuilt"} trigger={<><Icon name="search" size={17} />Zoom <span style={{ marginLeft: 6 }}>{Math.round(zoom * 100)}%</span></>} items={[0.5, 0.75, 1, 1.25, 1.5].map((z) => [`${z * 100}%`, () => { setFit(false); setZoom(z); }])} />
          <span style={{ flex: 1 }} />
          {originals.length > 0 && <>
            <button type="button" className="nle-tool" aria-pressed={tab === "rebuilt"} onClick={() => setTab("rebuilt")}>Rebuilt</button>
            <button type="button" className="nle-tool" aria-pressed={tab === "original"} onClick={() => setTab("original")}>Original upload</button>
            <Sep />
          </>}
          <button type="button" className="nle-tool" aria-pressed={fit} disabled={tab !== "rebuilt"} onClick={() => setFit(true)} title="Fit the page to the window"><Icon name="fit" size={17} />Fit</button>
        </div>}

        {side && node && <ContextBar kind={kind} node={node} A={A} multi={multi} multiCol={multiCol} canMoveUp={!!node && sel.path.at(-1) > 0} canMoveDown={!!node && sel.path.at(-1) < siblings.length - 1} />}

        <div className={`nlp-body${side ? "" : " plain"}`}>
          {side && <LeftPanel tab={leftTab} setTab={setLeftTab} pages={pages} curPage={curPage} layout={curLayout} A={A} />}

          <div style={{ position: "relative", minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <div ref={canvasRef} className="nle-scroll" onPointerDown={marquee} onClick={() => { setSel(null); setActive(null); }} style={{ flex: 1, overflow: "auto", scrollbarGutter: "stable", background: "var(--admin-bg-soft)" }}>
              {tab === "original" && originals.length ? <div style={{ display: "grid", gap: 16, maxWidth: 1100, margin: "0 auto", padding: "28px 32px" }}>
                  {originals.map((p, i) => <img key={i} src={p.imageUrl} alt={`Original page ${i + 1}`} style={{ width: "100%", borderRadius: 8 }} />)}
                </div> : <div style={{ padding: "28px 32px 90px", display: "flex", justifyContent: "center" }}>
                  <div style={{ width: SHEET, zoom, flexShrink: 0, background: curLayout?.theme?.background || "#fff", borderRadius: 4, boxShadow: "var(--admin-shadow-lg)", padding: "28px 44px", minHeight: 400 }}>
                    <NewsletterIssueView issue={issue} showMeta={false} edit={edit} only={curPage} />
                  </div>
                </div>}
            </div>
            {marq && <div aria-hidden="true" style={{ position: "absolute", ...marq, background: "rgba(37,99,235,0.12)", border: "1px solid #2563eb", pointerEvents: "none", zIndex: 7 }} />}
          </div>

          {side && <RightPanel tab={rightTab} setTab={setRightTab} layout={curLayout} curPage={curPage} sel={sel} kind={kind} node={node} A={A} photo={photo} multiCol={multiCol} span={col?.span} layoutTheme={curLayout?.theme} onTheme={(theme, key) => commit(curPage, { ...curLayout, theme }, key && `${curPage}:${key}`)} />}
        </div>
      </div>
    </div>
    <TemplateModal open={tplOpen} value={null} onPick={(id) => addPage(TEMPLATES.find((t) => t.id === id).make())} onClose={() => setTplOpen(false)} />
  </>;
}
export default PreviewModal;
