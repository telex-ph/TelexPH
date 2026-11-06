import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PreviewModal from "./PreviewModal";
import NewsletterDesign from "@/components/NewsletterDesign";
import NewsletterIssueView from "@/components/NewsletterView";
import api from "@/lib/api/axios";
import { TEMPLATES } from "@/lib/newsletter-default-template";
import { kindOf, imageToUploadFile, pdfToImages, officeToContent, contentFromPages } from "./newsletterFiles";

import { NEWSLETTER_DEPARTMENTS as DEPARTMENTS } from "@/data/newsletter-departments";
const ACCEPT = "image/*,.heic,.heif,.tif,.tiff,.avif,.svg,.bmp,.gif,.ico,.pdf,.pptx,.docx,application/pdf";
const MAX_FILE_MB = 25; // everything is converted in the browser first; only a JPEG/PNG/WebP under 4MB is uploaded
const MAX_PAGES = 8;
const thisMonth = () => new Date().toISOString().slice(0, 7);
const EMPTY = () => ({ title: "", summary: "", author: "", department: "", coverUrl: "", period: thisMonth(), status: "draft" });

// How long each AI step takes with Gemini Flash-Lite (measured: ~6-13s per design image; layout ideas are a guess).
// Each browser learns its own average from real runs, and the progress bar's time estimate follows it.
// (The key has a "g" so the slower averages learned from the old Cloudflare AI are not reused.)
const DEFAULT_MS = { read: 10000, suggest: 25000 };
const loadAvg = (k) => Number(localStorage.getItem(`newsletter-ai-g-ms-${k}`)) || DEFAULT_MS[k];

const field = { width: "100%", boxSizing: "border-box", padding: "8px 10px", fontSize: 13, color: "var(--admin-text)", background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 6 };
const btn = (primary) => ({ padding: "8px 14px", fontSize: 13, borderRadius: 6, cursor: "pointer", border: primary ? "none" : "1px solid var(--admin-border)", background: primary ? "var(--admin-accent)" : "transparent", color: primary ? "var(--admin-text-on-accent)" : "var(--admin-text)" });
const card = { background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 8, padding: 16 };
const label = { display: "grid", gap: 4, fontSize: 12, color: "var(--admin-text-sub)" };
const h2 = { fontSize: 14, fontWeight: 500, color: "var(--admin-text)", margin: 0 };
const thumb = { width: 40, height: 52, objectFit: "cover", objectPosition: "top", borderRadius: 4, border: "1px solid var(--admin-border)", flexShrink: 0 };
const clock = (ms) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;
const Thumb = ({ page }) => page?.imageUrl
  ? <img src={page.imageUrl} alt="" style={thumb} />
  : <span aria-hidden="true" style={{ ...thumb, display: "inline-block", background: page?.layout?.theme?.primary || page?.layout?.bands?.[0]?.bg || "var(--admin-border)" }} />;

// Upload progress is real. The AI call is a single request with no progress of its own, so its share of
// the bar is an estimate that eases toward ~95% and only completes when the answer arrives.
function jobProgress(job, now) {
  const analyzeStart = job.analyzeStart ?? (now - job.start > 3000 ? job.start + 3000 : null);
  if (analyzeStart == null) return { frac: 0.1 * job.uploadPct, inAi: 0 };
  const inAi = now - analyzeStart;
  return { frac: 0.1 + 0.85 * (1 - Math.exp(-inAi / (job.avg * 0.55))), inAi };
}

function AiProgress({ job, now }) {
  const { frac, inAi } = jobProgress(job, now);
  const pct = Math.min(99, Math.round(((job.index + frac) / job.total) * 100));
  const late = inAi > job.avg * 1.3;
  const left = (job.total - job.index - 1) * job.avg + Math.max(0, job.avg - inAi);
  const step = job.analyzeStart == null && inAi === 0 ? "Uploading" : job.label;
  return <div style={{ ...card, display: "grid", gap: 8 }} role="status" aria-live="polite">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, color: "var(--admin-text)" }}>
        <span>{step}{job.total > 1 ? ` · ${job.index + 1} of ${job.total}` : ""} <span style={{ color: "var(--admin-text-sub)" }}>({job.name})</span></span>
        <strong>{pct}%</strong>
      </div>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={job.label} style={{ height: 8, borderRadius: 4, background: "var(--admin-border)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--admin-accent)", transition: "width 250ms linear" }} />
      </div>
      <div style={{ fontSize: 12, color: "var(--admin-text-sub)", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <span>Elapsed {clock(now - job.queueStart)}</span>
        <span>{late ? "Taking longer than usual, still working…" : `About ${Math.max(1, Math.round(left / 1000))}s left (estimate)`}</span>
      </div>
    </div>;
}

function DropZone({ disabled, onFiles }) {
  const [over, setOver] = useState(false);
  const input = useRef(null);
  const open = () => !disabled && input.current?.click();
  return <div
    role="button"
    tabIndex={disabled ? -1 : 0}
    aria-disabled={disabled}
    aria-label="Upload newsletter files"
    onClick={open}
    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
    onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }}
    onDragLeave={() => setOver(false)}
    onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) onFiles(e.dataTransfer.files); }}
    style={{ border: `2px dashed ${over ? "var(--admin-accent)" : "var(--admin-border-strong)"}`, background: over ? "var(--admin-accent-soft)" : "var(--admin-bg-soft)", borderRadius: 10, padding: "36px 20px", textAlign: "center", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, display: "grid", gap: 8, justifyItems: "center" }}
  >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--admin-accent)" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--admin-text)" }}>Drag and drop your newsletter files here</p>
      <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)" }}>Any image (PNG, JPG, WebP, GIF, BMP, TIFF, SVG, AVIF, HEIC…), PDF, PowerPoint (.pptx) or Word (.docx)</p>
      <span style={btn(true)}>Browse files</span>
      <input ref={input} type="file" multiple accept={ACCEPT} disabled={disabled} style={{ display: "none" }} onClick={(e) => e.stopPropagation()} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
    </div>;
}

// Shows a design at its real layout width, shrunk to whatever width the card has.
function ScaledPreview({ children, width = 1200, height = 440 }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0.3);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return <div ref={box} style={{ height, overflow: "hidden", borderRadius: 6, background: "#fff", border: "1px solid var(--admin-border)", position: "relative" }}>
      <div style={{ width, transform: `scale(${scale})`, transformOrigin: "top left", pointerEvents: "none" }} aria-hidden="true">{children}</div>
    </div>;
}

const STEPS = [
  { name: "Template" },
  { name: "Content", h: "Bring in your content", p: "Upload a design or document, or start from the template. The AI fills it in for you." },
  { name: "Details", h: "Tell readers what it is", p: "A clear title, the author and the department help people find your newsletter." },
  { name: "Cover Image", h: "Make it stand out", p: "The cover is the first thing readers see on the newsletter page." },
  { name: "Summary", h: "Almost there", p: "Add a short summary, choose whether it goes live, and review everything." }
];
const heroBg = "linear-gradient(120deg, var(--admin-accent), color-mix(in srgb, var(--admin-accent) 55%, #000))";

// Every template as a small picture of the real design; click to pick.
const TPL_W = 150;
const SLOTS = { active: null, onPick() {} };
const MemoDesign = memo(NewsletterDesign); // the six template pictures are heavy; do not redraw them on every click
function TemplateStrip({ value, onPick }) {
  const designs = useMemo(() => TEMPLATES.map((t) => t.make()), []);
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
      {TEMPLATES.map((t, i) => {
        const on = t.id === value;
        return <button key={t.id} type="button" aria-pressed={on} onClick={() => onPick(t.id)} style={{ width: TPL_W + 16, padding: 8, display: "grid", gap: 6, textAlign: "left", cursor: "pointer", fontFamily: "inherit", borderRadius: 10, background: "var(--admin-surface)", border: `2px solid ${on ? "var(--admin-accent)" : "var(--admin-border)"}`, position: "relative" }}>
            <div aria-hidden="true" style={{ width: TPL_W, height: 190, overflow: "hidden", background: "#fff", borderRadius: 6, border: "1px solid var(--admin-border)" }}>
              <div style={{ width: 1200, padding: "28px 44px", boxSizing: "border-box", transform: `scale(${TPL_W / 1200})`, transformOrigin: "top left", pointerEvents: "none" }}>
                <MemoDesign design={designs[i]} edit={SLOTS} />
              </div>
            </div>
            <strong style={{ fontSize: 12, color: "var(--admin-text)" }}>{t.name}</strong>
            {on && <span aria-hidden="true" style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "var(--admin-accent)", color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>}
          </button>;
      })}
    </div>;
}

const Envelope = () => <svg width="150" height="120" viewBox="0 0 150 120" aria-hidden="true">
  <rect x="15" y="30" width="120" height="80" rx="8" fill="var(--admin-accent)" />
  <rect x="30" y="14" width="90" height="60" rx="5" fill="#fff" opacity=".9" />
  <rect x="40" y="26" width="50" height="6" rx="3" fill="var(--admin-accent)" opacity=".35" />
  <rect x="40" y="40" width="70" height="6" rx="3" fill="var(--admin-accent)" opacity=".2" />
  <path d="M15 38 L75 82 L135 38" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round" opacity=".85" />
</svg>;

function NewsletterAdmin() {
  const navigate = useNavigate();
  const editParam = useSearchParams()[0].get("edit"); // ?edit=<issue id> from the newsletter list
  const [form, setForm] = useState(EMPTY);
  const [pages, setPages] = useState([]); // every page of the issue: { imageUrl?, width?, height?, layout }. Page 1, Page 2... in this order
  const [startPage, setStartPage] = useState(0); // which page the editor opens on
  const [officeContent, setOfficeContent] = useState(null); // text from PowerPoint/Word
  const [variants, setVariants] = useState(null); // AI layout suggestions
  const [tplId, setTplId] = useState(TEMPLATES[0].id); // the template the AI fills with an upload
  const chosenTemplate = () => (TEMPLATES.find((t) => t.id === tplId) || TEMPLATES[0]).make();
  const [editId, setEditId] = useState(null);
  const [step, setStep] = useState(1);
  const [source, setSource] = useState("upload"); // "template" | "upload"
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState(null); // when the editor last saved the issue (Save Draft)
  const [job, setJob] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const avgs = useRef({ read: loadAvg("read"), suggest: loadAvg("suggest") });

  const originals = pages.filter((s) => s.imageUrl);
  const working = !!job || !!note;

  useEffect(() => {
    if (!editParam) return;
    api.get("/newsletter/admin/issues")
      .then(({ data }) => { const i = data.find((x) => x._id === editParam); i ? edit(i) : setError("Issue not found."); })
      .catch((e) => setError(e.response?.data?.error || "Failed to load the issue."));
  }, [editParam]);
  useEffect(() => {
    if (!job) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [!!job]);

  const learn = (key, ms) => {
    avgs.current[key] = Math.round(avgs.current[key] * 0.5 + ms * 0.5);
    localStorage.setItem(`newsletter-ai-g-ms-${key}`, String(avgs.current[key]));
  };

  // One design image: the AI reads its content and the server puts it into the default template. Returns the page.
  const readImage = async (file, index, total, queueStart) => {
    const start = Date.now();
    setJob({ key: "read", label: "AI is reading the design and filling the default template", avg: avgs.current.read, total, index, name: file.name, start, queueStart, analyzeStart: null, uploadPct: 0 });
    const fd = new FormData();
    fd.append("image", file);
    fd.append("template", JSON.stringify(chosenTemplate()));
    const { data } = await api.post("/newsletter/admin/analyze", fd, {
      timeout: 180000,
      // The shared axios instance defaults to application/json, and axios then turns a FormData into JSON,
      // so the server never saw the file. Naming multipart here makes it send the real form (browser adds the boundary).
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => setJob((j) => {
        if (!j || j.index !== index || j.key !== "read") return j;
        const pct = e.total ? e.loaded / e.total : 0;
        return pct >= 1 ? { ...j, uploadPct: 1, analyzeStart: j.analyzeStart ?? Date.now() } : { ...j, uploadPct: pct };
      })
    });
    learn("read", Date.now() - start);
    return { imageUrl: data.imageUrl, width: data.width, height: data.height, layout: data.layout };
  };

  // Text from Word/PowerPoint has no design of its own: the AI puts it into the default template.
  const fillFromText = async (blocks) => {
    const start = Date.now();
    setJob({ key: "read", label: "AI is filling the default template", avg: avgs.current.read, total: 1, index: 0, name: "your text", start, queueStart: start, analyzeStart: start, uploadPct: 1 });
    try {
      const { data } = await api.post("/newsletter/admin/fill", { content: blocks, template: chosenTemplate() }, { timeout: 180000 });
      learn("read", Date.now() - start);
      setPages((p) => [...p, { layout: data.layout }]);
    } catch (e) {
      setError((prev) => `${prev} ${e.response?.data?.error || e.message}`.trim());
    } finally {
      setJob(null);
    }
  };

  // AI proposes other layouts for the same content (the first one is the default template filled with it).
  const suggest = async (office, readPages) => {
    const { content, theme } = contentFromPages(readPages);
    const start = Date.now();
    setJob({ key: "suggest", label: "AI is designing layouts", avg: avgs.current.suggest, total: 1, index: 0, name: "layout ideas", start, queueStart: start, analyzeStart: start, uploadPct: 1 });
    try {
      const { data } = await api.post("/newsletter/admin/suggest", { content: [...(office || []), ...content], theme, template: chosenTemplate() }, { timeout: 240000 });
      learn("suggest", Date.now() - start);
      setVariants(data.variants);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setJob(null);
    }
  };

  const handleFiles = async (fileList) => {
    const files = [...fileList];
    if (!files.length || working) return;
    const problems = [];
    const images = [];
    let office = null;
    const room = () => MAX_PAGES - pages.length - images.length;
    for (const f of files) {
      const kind = kindOf(f);
      if (!kind) { problems.push(`${f.name}: not supported. Use an image, PDF, PowerPoint (.pptx) or Word (.docx) file. Older .ppt/.doc files: save them as .pptx/.docx or PDF first.`); continue; }
      if (f.size > MAX_FILE_MB * 1024 * 1024) { problems.push(`${f.name}: larger than ${MAX_FILE_MB}MB.`); continue; }
      if (kind === "image") {
        if (room() <= 0) { problems.push(`A newsletter can have up to ${MAX_PAGES} pages. ${f.name} was skipped.`); continue; }
        try {
          setNote(`Preparing ${f.name}…`);
          images.push(await imageToUploadFile(f)); // GIF, BMP, TIFF, SVG, AVIF, HEIC... become a JPEG; big ones get shrunk
        } catch (e) {
          problems.push(`${f.name}: ${e.message}`);
        }
      } else if (kind === "pdf") {
        if (room() <= 0) { problems.push(`A newsletter can have up to ${MAX_PAGES} pages. ${f.name} was skipped.`); continue; }
        try {
          setNote(`Preparing ${f.name}…`);
          const { files: pageFiles, total } = await pdfToImages(f, room());
          images.push(...pageFiles);
          if (total > pageFiles.length) problems.push(`${f.name}: used the first ${pageFiles.length} of ${total} pages (max ${MAX_PAGES} per newsletter).`);
        } catch (e) {
          console.error("[newsletter] pdf", e);
          problems.push(`${f.name}: couldn't open this PDF.`);
        }
      } else {
        try {
          setNote(`Reading ${f.name}…`);
          const blocks = await officeToContent(f, kind);
          if (blocks.length) office = [...(office || []), ...blocks];
          else problems.push(`${f.name}: no text found in it.`);
        } catch (e) {
          console.error("[newsletter] office", e);
          problems.push(`${f.name}: couldn't read this file. Is it really a .${kind}?`);
        }
      }
    }
    setNote("");
    setError(problems.join(" "));

    const read = [];
    const queueStart = Date.now();
    for (let i = 0; i < images.length; i++) {
      try {
        read.push(await readImage(images[i], i, images.length, queueStart));
        setPages((p) => [...p, read.at(-1)]);
      } catch (e) {
        setError((prev) => `${prev} ${images[i].name}: ${e.response?.data?.error || e.message}`.trim());
      }
    }
    setJob(null);
    if (office) {
      setOfficeContent((prev) => [...(prev || []), ...office]);
      if (pages.length + read.length >= MAX_PAGES) setError((prev) => `${prev} A newsletter can have up to ${MAX_PAGES} pages, so the text from your document was not added.`.trim());
      else await fillFromText(office);
    }
  };

  const reset = () => { setForm(EMPTY()); setPages([]); setOfficeContent(null); setVariants(null); setEditId(null); setError(""); };
  const save = async (e) => {
    e.preventDefault();
    if (!pages.length) return setError("Upload a design first.");
    setBusy(true);
    setError("");
    try {
      const body = { ...form, pages };
      await (editId ? api.patch(`/newsletter/admin/issues/${editId}`, body) : api.post("/newsletter/admin/issues", body));
      reset();
      navigate("/admin/dashboard/newsletter/list");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save issue.");
    } finally {
      setBusy(false);
    }
  };
  const edit = (i) => {
    reset();
    setEditId(i._id);
    setForm({ title: i.title, summary: i.summary || "", author: i.author, department: i.department, coverUrl: i.coverUrl || "", period: i.period, status: i.status });
    setPages(i.pages);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const move = (idx, d) => setPages((p) => { const n = [...p]; [n[idx], n[idx + d]] = [n[idx + d], n[idx]]; return n; });
  const openEditor = (i = 0) => { setStartPage(i); setModalOpen(true); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const [coverBusy, setCoverBusy] = useState(false);
  const uploadCover = async (file) => {
    if (!file) return;
    setCoverBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", await imageToUploadFile(file));
      const { data } = await api.post("/newsletter/admin/image", fd, { timeout: 120000, headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, coverUrl: data.url }));
    } catch (e) {
      setError(`Cover image: ${e.response?.data?.error || e.message}`);
    } finally {
      setCoverBusy(false);
    }
  };
  const hasContent = pages.length > 0 || !!officeContent?.length;
  // A new page at the end; the editor opens on it. (An AI layout or the default template never replaces your other pages.)
  const addPage = (layout) => {
    if (pages.length >= MAX_PAGES) return setError(`A newsletter can have up to ${MAX_PAGES} pages.`);
    setPages([...pages, { layout }]);
    openEditor(pages.length);
  };

  const check = (n) => n === 2 && !pages.length ? "Add your content first: upload a design, or start from the template."
    : n === 3 && !(form.title.trim() && form.author.trim() && form.department && form.period) ? "Fill in the title, author, department and month." : "";
  const go = (n) => {
    for (let k = step; k < n; k++) { const m = check(k); if (m) { setError(m); setStep(k); return; } }
    setError("");
    setStep(n);
  };
  const onSubmit = (e) => { e.preventDefault(); step < STEPS.length ? go(step + 1) : save(e); };
  const cancel = () => navigate("/admin/dashboard/newsletter/list");
  // Save Draft / Publish inside the editor. The details (step 3) are needed first, so send the admin there if they are missing.
  const saveFromEditor = async (status) => {
    const m = check(3);
    if (m) { setModalOpen(false); setStep(3); setError(m); return; }
    const body = { ...form, pages, status };
    try {
      if (editId) await api.patch(`/newsletter/admin/issues/${editId}`, body);
      else setEditId((await api.post("/newsletter/admin/issues", body)).data._id);
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to save issue.");
    }
    setForm((f) => ({ ...f, status }));
    setSavedAt(Date.now());
    if (status === "published") navigate("/admin/dashboard/newsletter/list");
  };
  const dt = { color: "var(--admin-text-sub)" };
  const dd = { margin: 0 };
  const body = [null,
    // 1 Template
    <div key="1" style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {[["template", "Use Template", "Start with a ready-made design."], ["upload", "Upload Content", "Upload your own design or files."]].map(([k, t, d]) => <button key={k} type="button" aria-pressed={source === k} onClick={() => setSource(k)} style={{ padding: 18, borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "center", background: source === k ? "color-mix(in srgb, var(--admin-accent) 8%, var(--admin-surface))" : "var(--admin-surface)", border: `2px solid ${source === k ? "var(--admin-accent)" : "var(--admin-border)"}`, color: "var(--admin-text)" }}>
            <strong style={{ display: "block", fontSize: 14 }}>{t}</strong>
            <span style={{ fontSize: 12, color: "var(--admin-text-sub)" }}>{d}</span>
          </button>)}
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <strong style={{ fontSize: 13, color: "var(--admin-text)" }}>Choose a Template</strong>
        <TemplateStrip value={tplId} onPick={setTplId} />
      </div>
    </div>,
    // 2 Content
    <div key="2" style={{ display: "grid", gap: 16 }}>
      {source === "upload"
        ? <div style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--admin-text-sub)" }}>AI reads images and PDFs, and the text of PowerPoint or Word files, and puts the content into the template you picked.</span>
            <DropZone disabled={working} onFiles={handleFiles} />
          </div>
        : <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 12, color: "var(--admin-text-sub)" }}>
            <button type="button" disabled={working} onClick={() => addPage(chosenTemplate())} style={btn(true)}>Start from the {(TEMPLATES.find((t) => t.id === tplId) || TEMPLATES[0]).name} template</button>
            <span>Then edit the wording and photos yourself.</span>
          </div>}
            {note && <p role="status" style={{ margin: 0, fontSize: 13, color: "var(--admin-text-sub)" }}>{note}</p>}
            {job && <AiProgress job={job} now={now} />}

            {hasContent && <div style={{ display: "grid", gap: 8 }}>
                <h3 style={{ ...h2, fontSize: 13 }}>{pages.length ? `Pages (${pages.length})` : "Text from your file"}</h3>
                {pages.length > 0 && <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                    {pages.map((p, i) => <li key={(p.imageUrl || "p") + i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--admin-text)" }}>
                        <Thumb page={p} />
                        <span style={{ flex: 1 }}>Page {i + 1}{p.layout ? ` · ${(p.layout.sections || p.layout.bands || []).length} sections` : " · shown as uploaded"}</span>
                        <button type="button" disabled={working} onClick={() => openEditor(i)} style={btn(false)}>Edit</button>
                        <button type="button" disabled={i === 0 || working} onClick={() => move(i, -1)} style={btn(false)} aria-label={`Move page ${i + 1} up`}>↑</button>
                        <button type="button" disabled={i === pages.length - 1 || working} onClick={() => move(i, 1)} style={btn(false)} aria-label={`Move page ${i + 1} down`}>↓</button>
                        <button type="button" disabled={working} onClick={() => setPages((all) => all.filter((_, j) => j !== i))} style={{ ...btn(false), color: "var(--admin-danger)" }}>Remove</button>
                      </li>)}
                  </ul>}
                {!pages.length && <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)" }}>{officeContent.length} sections of text found, but they are not on a page yet. Use "Suggest better layouts with AI" below.</p>}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" disabled={working} onClick={() => suggest(officeContent, pages)} style={btn(!variants && !pages.length)}>{variants ? "Suggest again" : "Suggest better layouts with AI"}</button>
                  {pages.length > 0 && <button type="button" disabled={working} onClick={() => openEditor(0)} style={btn(true)}>Edit, preview and add photos</button>}
                </div>
              </div>}

            {variants && <div style={{ display: "grid", gap: 10 }}>
                <h3 style={{ ...h2, fontSize: 13 }}>AI layout suggestions</h3>
                {pages.length > 1 && <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)" }}>These combine the text of all {pages.length} pages into one layout. Adding one keeps your other pages.</p>}
                <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
                  {variants.map((v, i) => <div key={i} style={{ ...card, display: "grid", gap: 8, outline: pages.some((p) => p.layout === v.layout) ? "2px solid var(--admin-accent)" : "none" }}>
                      <ScaledPreview><NewsletterIssueView issue={{ pages: [{ layout: v.layout }] }} showMeta={false} /></ScaledPreview>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--admin-text)" }}>{v.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)" }}>{v.why}</p>
                      {(() => { const at = pages.findIndex((p) => p.layout === v.layout); return at >= 0
                        ? <button type="button" onClick={() => openEditor(at)} style={btn(false)}>Added as page {at + 1}. Edit</button>
                        : <button type="button" disabled={working} onClick={() => addPage(v.layout)} style={btn(true)}>{pages.length ? `Add as page ${pages.length + 1}` : "Use this layout"}</button>; })()}
                    </div>)}
                </div>
              </div>}
    </div>,
    // 3 Details
    <div key="3">
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <label style={label}>Title<input style={field} value={form.title} onChange={set("title")} required /></label>
              <label style={label}>Author name<input style={field} value={form.author} onChange={set("author")} required /></label>
              <label style={label}>Department
                <select style={field} value={form.department} onChange={set("department")} required>
                  <option value="" disabled>Select department</option>
                  {/* keep an old issue's legacy department selectable so editing it doesn't blank the field */}
                  {form.department && !DEPARTMENTS.includes(form.department) && <option value={form.department}>{form.department}</option>}
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label style={label}>Month<input style={field} type="month" value={form.period} onChange={set("period")} required /></label>
            </div>
    </div>,
    // 4 Cover
    <div key="4">
            <div style={{ ...label, marginTop: 12 }}>
              <span style={{ fontWeight: 600, color: "var(--admin-text)" }}>Cover image</span>
              <label style={{ display: "flex", alignItems: "center", gap: 16, padding: 12, border: "2px dashed var(--admin-border)", borderRadius: 8, cursor: coverBusy ? "wait" : "pointer", background: "var(--admin-surface)" }}>
                {form.coverUrl
                  ? <img src={form.coverUrl} alt="Cover preview" style={{ width: 160, height: 100, objectFit: "cover", borderRadius: 6, border: "1px solid var(--admin-border)" }} />
                  : <span style={{ width: 160, height: 100, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, background: "var(--admin-bg, #f4f4f2)", fontSize: 12 }}>No cover yet</span>}
                <span style={{ display: "grid", gap: 8, justifyItems: "start" }}>
                  <span style={{ fontSize: 12 }}>Shown on the public newsletter page. Landscape photo works best (16:10).</span>
                  <span style={btn(true)}>{coverBusy ? "Uploading…" : form.coverUrl ? "Change cover image" : "Upload cover image"}</span>
                </span>
                <input type="file" accept="image/*" disabled={coverBusy} style={{ display: "none" }} onChange={(e) => { uploadCover(e.target.files[0]); e.target.value = ""; }} />
                {form.coverUrl && !coverBusy && <button type="button" style={{ ...btn(false), marginLeft: "auto" }} onClick={(e) => { e.preventDefault(); setForm((f) => ({ ...f, coverUrl: "" })); }}>Remove</button>}
              </label>
            </div>
    </div>,
    // 5 Summary
    <div key="5" style={{ display: "grid", gap: 16 }}>
            <label style={label}>Short summary (optional, used for search results)<input style={field} value={form.summary} onChange={set("summary")} /></label>
      <label style={label}>Status
        <select style={field} aria-label="Status" value={form.status} onChange={set("status")}>
          <option value="draft">Draft</option>
          <option value="published">Published (visible on the website)</option>
        </select>
      </label>
      <dl style={{ ...card, margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 12, color: "var(--admin-text)" }}>
        <dt style={dt}>Title</dt><dd style={dd}>{form.title || "-"}</dd>
        <dt style={dt}>Author</dt><dd style={dd}>{form.author || "-"}</dd>
        <dt style={dt}>Department</dt><dd style={dd}>{form.department || "-"}</dd>
        <dt style={dt}>Month</dt><dd style={dd}>{form.period}</dd>
        <dt style={dt}>Pages</dt><dd style={dd}>{pages.length}</dd>
        <dt style={dt}>Cover</dt><dd style={dd}>{form.coverUrl ? <img src={form.coverUrl} alt="" style={{ width: 96, height: 60, objectFit: "cover", borderRadius: 4 }} /> : "None (a plain placeholder is shown)"}</dd>
      </dl>
    </div>
  ];

  return <div className="w-full">
      <div style={{ background: heroBg, borderRadius: 16, padding: "28px 28px 72px", display: "flex", alignItems: "center", gap: 18, color: "#fff" }}>
        <span aria-hidden="true" style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
        </span>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{editId ? "Edit Newsletter" : "Create Newsletter"}</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, opacity: .9 }}>Share important updates, news, and announcements with your audience.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} style={{ ...card, margin: "-48px 16px 0", padding: 0, position: "relative", overflow: "hidden" }}>
        <ol style={{ listStyle: "none", margin: 0, padding: "16px 12px 0", display: "flex", borderBottom: "1px solid var(--admin-border)", overflowX: "auto" }}>
          {STEPS.map((t, i) => {
            const n = i + 1, on = n === step, done = n < step;
            return <li key={t.name} style={{ flex: 1, minWidth: 90 }}>
                <button type="button" onClick={() => (editId || n <= step) && go(n)} aria-current={on ? "step" : undefined} style={{ width: "100%", padding: "0 4px 12px", border: "none", borderBottom: `3px solid ${on ? "var(--admin-accent)" : "transparent"}`, background: "transparent", cursor: "pointer", display: "grid", justifyItems: "center", gap: 6, fontFamily: "inherit", color: on ? "var(--admin-accent)" : "var(--admin-text-sub)", fontSize: 12, fontWeight: on ? 600 : 400 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: on || done ? "var(--admin-accent)" : "var(--admin-border)", color: on || done ? "#fff" : "var(--admin-text-sub)" }}>{done ? "✓" : n}</span>
                  {t.name}
                </button>
              </li>;
          })}
        </ol>

        {error && <p role="alert" style={{ color: "var(--admin-danger)", fontSize: 13, margin: 0, padding: "12px 20px 0" }}>{error}</p>}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: 16 }}>
          {step !== 1 && <aside style={{ flex: "1 1 240px", maxWidth: 340, borderRadius: 12, padding: 24, display: "grid", alignContent: "center", justifyItems: "center", textAlign: "center", gap: 12, background: "color-mix(in srgb, var(--admin-accent) 7%, var(--admin-surface))" }}>
            <Envelope />
            <h2 style={{ ...h2, fontSize: 18 }}>{STEPS[step - 1].h}</h2>
            <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-sub)" }}>{STEPS[step - 1].p}</p>
          </aside>}
          <section style={{ flex: "3 1 420px", minWidth: 0, display: "grid", gap: 16, alignContent: "start" }}>
            <h2 style={{ ...h2, fontSize: 16, borderLeft: "4px solid var(--admin-accent)", paddingLeft: 10 }}>{step === 1 ? "Newsletter Content" : STEPS[step - 1].name}</h2>
            {body[step]}
          </section>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "12px 16px 16px", borderTop: "1px solid var(--admin-border)" }}>
          <button type="button" disabled={working} onClick={cancel} style={btn(false)}>✕ Cancel</button>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 1 && <button type="button" disabled={working} onClick={() => go(step - 1)} style={btn(false)}>Back</button>}
            <button type="submit" disabled={busy || working || coverBusy} style={btn(true)}>{step < STEPS.length ? "Next Step →" : busy ? "Saving…" : editId ? "Save changes" : "Create newsletter"}</button>
          </div>
        </div>
      </form>
      <PreviewModal open={modalOpen} onClose={closeModal} issue={{ ...form, pages }} originals={originals} onPagesChange={setPages} startPage={startPage} maxPages={MAX_PAGES} onSave={saveFromEditor} savedAt={savedAt} />
    </div>;
}
export {
  NewsletterAdmin as default
};
