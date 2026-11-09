
import PageHeader from "@/components/PageHeader";
import { useState, useRef } from "react";
import { Spinner } from "@/components/DashboardLoader";
import RichTextArea from "@/components/RichTextArea";
import { htmlToText, toHtml } from "@/lib/rich-text";
import { getApiBaseUrl } from "@/lib/api-base";
import { useBlogAi, blogContext, SparkleIcon, LayersIcon, HEADLINE_MAX, TITLE_MAX } from "@/components/BlogAiAssist";
import SeoFields, { emptySeo, appendSeo, seoError } from "@/components/SeoFields";

const API_BASE = getApiBaseUrl();
const MAIN_CATEGORIES = {
  MAIN_SERVICE: "Main Service Categories",
  INDUSTRY_INSIGHTS: "Industry-Specific Insights",
  BUSINESS_GROWTH: "Business Growth & Strategy",
  COMPANY_CULTURE: "Company Culture & Updates"
};
const SUBCATEGORIES = {
  "Main Service Categories": ["Customer Experience (CX)", "Back Office Solutions", "Virtual Assistance", "Sales & Lead Generation"],
  "Industry-Specific Insights": ["E-commerce Support", "Real Estate Outsourcing", "Healthcare BPO", "Tech & SaaS Scaling", "Logistics", "Food & Fresh Produce"],
  "Business Growth & Strategy": ["Scale Smarter", "Outsourcing 101", "Cost Optimization"],
  "Company Culture & Updates": ["TelexPH Life", "News & Press Releases"]
};
const HEADLINE_MIN = 5;
// Post headline only (becomes the <title>); author and section titles keep HEADLINE_MAX.
const SHORT_DESC_MIN = 5;
const MAIN_CONTENT_MIN = 25;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

// ── Layout helpers (same look as the Create Case Study form) ──────────────
const card = {
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  borderRadius: 16,
  boxShadow: "var(--admin-shadow-sm)"
};
const lbl = { fontSize: 12, fontWeight: 600, color: "var(--admin-text-sub)", display: "block", marginBottom: 6 };
const inp = (overrides = {}) => ({
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid var(--admin-border-strong)",
  background: "var(--admin-surface)",
  color: "var(--admin-text)",
  fontSize: 13,
  outline: "none",
  fontWeight: 400,
  boxSizing: "border-box",
  transition: "border-color .15s",
  ...overrides
});
const pillStyle = (sel) => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 10,
  border: sel ? "1px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)" : "1px solid var(--admin-border)",
  background: sel ? "color-mix(in srgb, var(--admin-accent) 8%, transparent)" : "transparent",
  color: sel ? "var(--admin-accent-text)" : "var(--admin-text-sub)",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all .15s"
});
const headerBtnBase = { display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 };
const headerBtnGhost = { ...headerBtnBase, border: "1px solid var(--admin-border)", background: "transparent", color: "var(--admin-text-sub)", fontWeight: 500 };
const headerBtnPrimary = { ...headerBtnBase, border: "none", background: "var(--admin-accent)", color: "var(--admin-text-on-accent)", fontWeight: 600 };
const ghostAccentBtn = { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--admin-accent-text)", background: "transparent", border: "1px solid var(--admin-border)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontWeight: 600, flexShrink: 0 };
const STATUS_OPTIONS = [
  { value: "draft", label: "Draft", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { value: "published", label: "Published", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { value: "scheduled", label: "Scheduled", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }
];
const StepHead = ({ n, title, subtitle, action }) => <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, border: "1.5px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)", color: "var(--admin-accent-text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{n}</div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--admin-text)", margin: 0 }}>{title}</p>
        <p style={{ fontSize: 12, color: "var(--admin-text-sub)", margin: "3px 0 0", fontWeight: 400 }}>{subtitle}</p>
      </div>
    </div>
    {action}
  </div>;

function AddBlogs() {
  const fileRef = useRef(null);
  const actualFileRef = useRef(null);
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [mainContentTitle, setMainContentTitle] = useState("");
  const [mainContentText, setMainContentText] = useState("");
  const [contentSections, setContentSections] = useState([{ title: "", content: "" }]);
  const [status, setStatus] = useState("draft");
  const [scheduledDate, setScheduledDate] = useState("");
  const [seo, setSeo] = useState(emptySeo());
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const ai = useBlogAi({
    setTitle, setShortDescription, setMainContentTitle, setMainContentText, setContentSections,
    getContext: () => blogContext({ title, shortDescription, mainContentTitle, mainContentText, contentSections }),
    setCover: (dataUrl, file) => {
      setSelectedImage(dataUrl);
      actualFileRef.current = file;
    },
    onError: (msg) => {
      setErrorMessage(msg);
      setShowErrorModal(true);
    }
  });
  const getTotalWordCount = () => {
    let n = (mainContentTitle + " " + htmlToText(mainContentText)).split(/\s+/).filter(Boolean).length;
    contentSections.forEach((s) => {
      n += (s.title + " " + htmlToText(s.content)).split(/\s+/).filter(Boolean).length;
    });
    return n;
  };
  const isFormValid = () => {
    const t = title.trim(), a = authorName.trim(), d = shortDescription.trim();
    const mt = mainContentTitle.trim(), mb = htmlToText(mainContentText);
    return !!(t.length >= HEADLINE_MIN && t.length <= TITLE_MAX && a.length >= HEADLINE_MIN && a.length <= HEADLINE_MAX && mainCategory && subcategory && d.length >= SHORT_DESC_MIN && (mt.length === 0 || mt.length >= HEADLINE_MIN && mt.length <= HEADLINE_MAX) && mb.length >= MAIN_CONTENT_MIN && (mt.length > 0 || mb.length > 0) && selectedImage && !imageError && contentSections.every((s) => {
      const st = s.title.trim(), sc = htmlToText(s.content);
      if (!st && !sc) return true;
      return (st.length === 0 || st.length >= HEADLINE_MIN && st.length <= HEADLINE_MAX) && (sc.length === 0 || sc.length >= MAIN_CONTENT_MIN);
    }) && (status !== "scheduled" || scheduledDate) && !seoError(seo));
  };
  const compressAndSetImage = (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Invalid file type. Only PNG, JPG, JPEG, and WebP are allowed.");
      return;
    }
    setImageError("");
    actualFileRef.current = file;
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 800;
        let w = img.width, h = img.height;
        if (w > maxWidth) {
          h = maxWidth / w * h;
          w = maxWidth;
        }
        canvas.width = w;
        canvas.height = h;
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          setSelectedImage(canvas.toDataURL("image/jpeg", 0.7));
          setIsCompressing(false);
        }
      };
    };
    reader.readAsDataURL(file);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) compressAndSetImage(file);
    if (fileRef.current) fileRef.current.value = "";
  };
  const resetForm = () => {
    setTitle("");
    setAuthorName("");
    setMainCategory("");
    setSubcategory("");
    setShortDescription("");
    setMainContentTitle("");
    setMainContentText("");
    setContentSections([{ title: "", content: "" }]);
    setStatus("draft");
    setScheduledDate("");
    setSeo(emptySeo());
    setSelectedImage(null);
    setImageError("");
    actualFileRef.current = null;
    if (fileRef.current) fileRef.current.value = "";
  };
  const handleFinalConfirm = async () => {
    if (!actualFileRef.current) {
      setErrorMessage("Please upload or generate a cover image.");
      setShowConfirmModal(false);
      setShowErrorModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const allMainContent = [];
      if (mainContentTitle.trim() || htmlToText(mainContentText)) {
        allMainContent.push({ title: mainContentTitle.trim(), content: toHtml(mainContentText) });
      }
      contentSections.forEach((s) => {
        if (s.title.trim() || htmlToText(s.content)) allMainContent.push({ title: s.title.trim(), content: toHtml(s.content) });
      });
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("author", authorName.trim());
      formData.append("mainCategory", mainCategory);
      formData.append("subcategory", subcategory);
      formData.append("shortDescription", shortDescription.trim());
      formData.append("mainContent", JSON.stringify(allMainContent));
      formData.append("status", status);
      formData.append("picture", actualFileRef.current);
      appendSeo(formData, seo);
      if (status === "scheduled" && scheduledDate) {
        formData.append("scheduledDate", new Date(scheduledDate).toISOString());
      }
      const response = await fetch(`${API_BASE}/blogs`, { method: "POST", credentials: "include", body: formData });
      if (!response.ok) {
        const e = await response.json();
        throw new Error(e.error || "Failed to create blog");
      }
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      resetForm();
    } catch (err) {
      setErrorMessage(err.message || "Failed to create blog");
      setShowConfirmModal(false);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const addContentSection = () => setContentSections([...contentSections, { title: "", content: "" }]);
  const removeContentSection = (i) => {
    if (contentSections.length > 1) setContentSections(contentSections.filter((_, idx) => idx !== i));
  };
  const updateContentSection = (i, field, val) => {
    const u = [...contentSections];
    u[i][field] = val;
    setContentSections(u);
  };
  const handleMainCategoryChange = (cat) => {
    setMainCategory(cat);
    setSubcategory("");
  };
  const getAvailableSubcategories = () => mainCategory ? SUBCATEGORIES[mainCategory] || [] : [];
  const CharCount = ({ value, max, min }) => {
    const trimmed = htmlToText(value);
    const tooShort = trimmed.length > 0 && trimmed.length < min;
    const tooLong = max !== void 0 && trimmed.length > max;
    return <div className="flex justify-between items-center mt-1 px-1">
        <span className={`text-[11px] ${tooShort || tooLong ? "text-red-500" : "text-transparent select-none"}`}>
          {tooShort ? `Min ${min} chars required.` : tooLong ? `Max ${max} chars allowed.` : "."}
        </span>
        <span className={`text-[11px] ${tooLong ? "text-red-500" : "text-[var(--admin-text-sub)]"}`}>
          {max !== void 0 ? `${trimmed.length}/${max}` : `${trimmed.length} chars`}
        </span>
      </div>;
  };
  return <>
      <style dangerouslySetInnerHTML={{ __html: `
        * { font-family: var(--font-body) !important; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      ` }} />

      <div style={{ padding: "32px 24px", minHeight: "100vh", background: "var(--admin-bg)" }}>
        <style>{`
          .ab-pill:hover { opacity: .78; }
          .ab-cover-row { display: grid; grid-template-columns: clamp(300px, 36%, 520px) 1fr; gap: 22px; }
          .ab-two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
          .ab-input:focus { border-color: var(--admin-accent) !important; }
          .ab-input::placeholder { color: var(--admin-text-sub); opacity: .6; }
          @media (max-width: 760px) {
            .ab-cover-row, .ab-two { grid-template-columns: 1fr; }
            .ab-header { flex-direction: column; align-items: flex-start !important; }
            .ab-actions { flex-direction: column; }
          }
        `}</style>

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* PAGE HEADER */}
          <PageHeader title="Create New Blog Post" subtitle="Share your insights and expertise with the community" actions={<>
              {ai.usage && <div
                style={{ display: "flex", flexDirection: "column", gap: 4, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--admin-border)", background: "var(--admin-surface)" }}
                title={ai.usage.models.map((m) => `${m.label}: ${m.used}/${m.limit}${m.active ? " (active)" : ""}`).join("\n")}
              >
                {ai.usage.models.map((m) => <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.active ? "bg-green-500" : "bg-[var(--admin-border-strong)]"}`} />
                  <span style={{ fontSize: 11, fontWeight: m.active ? 600 : 400, color: m.active ? "var(--admin-text)" : "var(--admin-text-sub)" }}>{m.label}</span>
                  <span style={{ fontSize: 11, color: "var(--admin-text-sub)" }}>{m.used}/{m.limit}</span>
                </div>)}
              </div>}
              <button onClick={() => ai.open("expand")} style={headerBtnGhost}>
                <SparkleIcon className="w-3.5 h-3.5" />
                Generate Prompt
              </button>
              <button onClick={() => ai.open("full")} style={headerBtnPrimary}>
                <LayersIcon className="w-3.5 h-3.5" />
                Generate Full Blog
              </button>
          </>} />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* STEP 1 — Cover & Basic Information */}
            <div style={{ ...card, padding: "22px 22px" }}>
              <StepHead n={1} title="Cover & Basic Information" subtitle="Add a compelling cover and essential details" />
              <div className="ab-cover-row">
                <div>
                  <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleFileChange} className="hidden" />
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{ position: "relative", border: `1.5px dashed ${imageError ? "var(--admin-danger)" : "var(--admin-border)"}`, borderRadius: 14, cursor: "pointer", overflow: "hidden", aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
                  >
                    {isCompressing ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--admin-accent-text)" }}>
                      <Spinner size={20} />
                      <span style={{ fontSize: 11, color: "var(--admin-text-sub)" }}>Compressing...</span>
                    </div> : selectedImage ? <>
                      <img src={selectedImage} alt="Cover preview" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white" style={{ fontSize: 11, fontWeight: 500 }}>Click to change</span>
                      </div>
                    </> : <>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "color-mix(in srgb, var(--admin-accent) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                        <svg width="18" height="18" fill="none" stroke="var(--admin-accent-text)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--admin-text)", margin: 0, fontWeight: 600 }}>Upload cover image</p>
                      <p style={{ fontSize: 11, color: "var(--admin-text-sub)", margin: "5px 0 0" }}>PNG, JPG, WebP</p>
                      <p style={{ fontSize: 11, color: "var(--admin-text-sub)", margin: "2px 0 0" }}>Recommended: 16:9 ratio</p>
                    </>}
                  </div>
                  {imageError && <p style={{ fontSize: 10, color: "var(--admin-danger)", margin: "6px 0 0" }}>{imageError}</p>}
                  <button type="button" onClick={() => ai.open("image")} style={{ width: "100%", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 0", borderRadius: 10, border: "none", background: "var(--admin-accent)", color: "var(--admin-text-on-accent)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    <SparkleIcon className="w-3.5 h-3.5" />
                    Generate with AI
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="ab-two">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ ...lbl, marginBottom: 0 }}>Title <span style={{ color: "var(--admin-accent-text)" }}>*</span></span>
                        <button type="button" onClick={() => ai.open("title")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--admin-accent-text)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                          <SparkleIcon className="w-3 h-3" />
                          AI Title
                        </button>
                      </div>
                      <input className="ab-input" style={inp()} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={TITLE_MAX} placeholder="e.g., Top 10 Hidden Gems in Palawan" />
                      <CharCount value={title} min={HEADLINE_MIN} max={TITLE_MAX} />
                    </div>
                    <div>
                      <span style={lbl}>Author <span style={{ color: "var(--admin-accent-text)" }}>*</span></span>
                      <input className="ab-input" style={inp()} value={authorName} onChange={(e) => setAuthorName(e.target.value)} maxLength={HEADLINE_MAX} placeholder="e.g., Admin Team" />
                      <CharCount value={authorName} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                    </div>
                  </div>
                  <div>
                    <span style={lbl}>Description <span style={{ color: "var(--admin-accent-text)" }}>*</span></span>
                    <input className="ab-input" style={inp()} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Brief summary for listing card..." />
                    <CharCount value={shortDescription} min={SHORT_DESC_MIN} />
                  </div>
                  <div>
                    <span style={lbl}>Status <span style={{ color: "var(--admin-accent-text)" }}>*</span></span>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {STATUS_OPTIONS.map((s) => <button key={s.value} type="button" className="ab-pill" onClick={() => setStatus(s.value)} style={pillStyle(status === s.value)}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                        {s.label}
                        {status === s.value && <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                      </button>)}
                    </div>
                  </div>
                  {status === "scheduled" && <div style={{ maxWidth: 320 }}>
                    <span style={lbl}>Schedule date <span style={{ color: "var(--admin-accent-text)" }}>*</span></span>
                    <input className="ab-input" type="datetime-local" style={inp()} value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                  </div>}
                </div>
              </div>
            </div>

            {/* STEP 2 — Categories */}
            <div style={{ ...card, padding: "22px 22px" }}>
              <StepHead n={2} title="Categories" subtitle="Assign a topic and subcategory" />
              <div style={{ marginBottom: mainCategory ? 18 : 0 }}>
                <span style={{ ...lbl, marginBottom: 8 }}>Main category <span style={{ color: "var(--admin-accent-text)" }}>*</span></span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.values(MAIN_CATEGORIES).map((c) => <button key={c} type="button" className="ab-pill" onClick={() => handleMainCategoryChange(c)} style={pillStyle(mainCategory === c)}>{c}</button>)}
                </div>
              </div>
              {mainCategory && <div>
                <span style={{ ...lbl, marginBottom: 8 }}>Subcategory <span style={{ color: "var(--admin-accent-text)" }}>*</span></span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {getAvailableSubcategories().map((s) => <button key={s} type="button" className="ab-pill" onClick={() => setSubcategory(s)} style={pillStyle(subcategory === s)}>{s}</button>)}
                </div>
              </div>}
            </div>

            {/* STEP 3 — Content Body */}
            <div style={{ ...card, padding: "22px 22px" }}>
              <StepHead
                n={3}
                title="Content Body"
                subtitle="Write the main section of your post"
                action={<button type="button" onClick={() => ai.open("content")} style={ghostAccentBtn}>
                  <SparkleIcon className="w-3 h-3" />
                  Write with AI
                </button>}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <span style={lbl}>Main title <span style={{ color: "var(--admin-accent-text)" }}>*</span></span>
                  <input className="ab-input" style={inp()} value={mainContentTitle} onChange={(e) => setMainContentTitle(e.target.value)} maxLength={HEADLINE_MAX} placeholder="Main section title..." />
                  <CharCount value={mainContentTitle} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ ...lbl, marginBottom: 0 }}>Main body <span style={{ color: "var(--admin-accent-text)" }}>*</span></span>
                    <span style={{ fontSize: 11, color: "var(--admin-text-sub)" }}>Est. {Math.ceil(getTotalWordCount() / 200) || 1} min read</span>
                  </div>
                  <RichTextArea value={mainContentText} onChange={setMainContentText} placeholder="Write your main content here..." minHeight={140} />
                  <CharCount value={mainContentText} min={MAIN_CONTENT_MIN} />
                </div>
              </div>
            </div>

            {/* STEP 4 — Extra Sections */}
            <div style={{ ...card, padding: "22px 22px" }}>
              <StepHead
                n={4}
                title="Extra Sections"
                subtitle="Organize the rest of your post into sections"
                action={<button type="button" onClick={addContentSection} style={ghostAccentBtn}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Add section
                </button>}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {contentSections.map((section, i) => <div key={i} style={{ padding: "14px 16px", borderRadius: 14, background: "var(--admin-bg-soft)", border: "1px solid var(--admin-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ ...lbl, marginBottom: 0 }}>Section {i + 1}</span>
                    {contentSections.length > 1 && <button type="button" onClick={() => removeContentSection(i)} aria-label={`Remove section ${i + 1}`} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid var(--admin-border)", background: "transparent", color: "var(--admin-text-faint)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <span style={lbl}>Title</span>
                      <input className="ab-input" style={inp()} value={section.title} onChange={(e) => updateContentSection(i, "title", e.target.value)} maxLength={HEADLINE_MAX} placeholder="Section title..." />
                      <CharCount value={section.title} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                    </div>
                    <div>
                      <span style={lbl}>Content</span>
                      <RichTextArea value={section.content} onChange={(html) => updateContentSection(i, "content", html)} placeholder="Section content..." minHeight={96} />
                      <CharCount value={section.content} min={MAIN_CONTENT_MIN} />
                    </div>
                  </div>
                </div>)}
                <button type="button" onClick={addContentSection} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", borderRadius: 12, border: "1.5px dashed var(--admin-border)", background: "transparent", color: "var(--admin-text-sub)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Add another section
                </button>
              </div>
            </div>

            {/* STEP 5 — SEO & search */}
            <SeoFields n={5} value={seo} onChange={setSeo} />

            {/* Actions */}
            <div className="ab-actions" style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={resetForm} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, flex: 1, padding: "13px 0", borderRadius: 12, border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text-sub)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reset form
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={!isFormValid() || isSubmitting}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, flex: 2, padding: "13px 0", borderRadius: 12, border: "none", background: isFormValid() && !isSubmitting ? "var(--admin-accent)" : "var(--admin-bg-soft)", color: isFormValid() && !isSubmitting ? "var(--admin-text-on-accent)" : "var(--admin-text-faint)", fontSize: 14, fontWeight: 700, cursor: isFormValid() && !isSubmitting ? "pointer" : "not-allowed", boxShadow: isFormValid() && !isSubmitting ? "var(--admin-shadow-sm)" : "none" }}
              >
                {isSubmitting ? <><Spinner size={14} /> Saving...</> : <>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Create blog post
                </>}
              </button>
            </div>

          </div>
        </div>
      </div>

      {ai.modal}

      {
    /* â•â•â•â•â•â•â•â• Confirm Modal â•â•â•â•â•â•â•â• */
  }
      {showConfirmModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl w-full max-w-md overflow-hidden border transition-all duration-500 bg-[var(--admin-surface)] border-[var(--admin-border)]`}>
            <div className={`px-6 py-5 border-b transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}>
              <p className={`transition-colors text-[var(--admin-text)]`} style={{ fontSize: 13, fontWeight: 600 }}>
                Confirm Submission
              </p>
              <p className={`mt-0.5 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 11, fontWeight: 400 }}>
                Are you ready to {status === "published" ? "publish" : status === "scheduled" ? "schedule" : "save"} this blog post?
              </p>
            </div>
            <div className="flex gap-3 p-6">
              <button
    onClick={() => setShowConfirmModal(false)}
    disabled={isSubmitting}
    className={`flex-1 py-2.5 rounded-lg border-2 transition-all border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                Cancel
              </button>
              <button
    onClick={handleFinalConfirm}
    disabled={isSubmitting}
    className="flex-1 py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] transition-all disabled:opacity-50"
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                {isSubmitting ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>}

      {
    /* â•â•â•â•â•â•â•â• Success Modal â•â•â•â•â•â•â•â• */
  }
      {showSuccessModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl w-full max-w-md overflow-hidden border transition-all duration-500 bg-[var(--admin-surface)] border-[var(--admin-border)]`}>
            <div className={`px-6 py-5 border-b transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}>
              <p className={`transition-colors text-[var(--admin-text)]`} style={{ fontSize: 13, fontWeight: 600 }}>
                Success!
              </p>
              <p className={`mt-0.5 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 11, fontWeight: 400 }}>
                Your blog post has been {status === "published" ? "published" : status === "scheduled" ? "scheduled" : "saved"} successfully.
              </p>
            </div>
            <div className="p-6">
              <button
    onClick={() => setShowSuccessModal(false)}
    className="w-full py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] transition-all"
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                Close
              </button>
            </div>
          </div>
        </div>}

      {
    /* â•â•â•â•â•â•â•â• Error Modal â•â•â•â•â•â•â•â• */
  }
      {showErrorModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl w-full max-w-md overflow-hidden border transition-all duration-500 bg-[var(--admin-surface)] border-[var(--admin-border)]`}>
            <div className={`px-6 py-5 border-b transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}>
              <p className={`transition-colors text-[var(--admin-text)]`} style={{ fontSize: 13, fontWeight: 600 }}>
                Error
              </p>
              <p className={`mt-0.5 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 11, fontWeight: 400 }}>
                {errorMessage || "Something went wrong. Please try again."}
              </p>
            </div>
            <div className="p-6">
              <button
    onClick={() => setShowErrorModal(false)}
    className="w-full py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] transition-all"
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                Close
              </button>
            </div>
          </div>
        </div>}
    </>;
}
// Shared with EditBlogs so both forms stay visually identical.
export {
  AddBlogs as default,
  MAIN_CATEGORIES, SUBCATEGORIES, HEADLINE_MIN, SHORT_DESC_MIN, MAIN_CONTENT_MIN, ALLOWED_IMAGE_TYPES,
  card, lbl, inp, pillStyle, headerBtnGhost, headerBtnPrimary, ghostAccentBtn, STATUS_OPTIONS, StepHead
};
