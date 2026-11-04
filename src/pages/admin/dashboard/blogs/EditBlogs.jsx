
import PageHeader from "@/components/PageHeader";
import { useState, useRef } from "react";
import { Spinner } from "@/components/DashboardLoader";
import RichTextArea from "@/components/RichTextArea";
import { htmlToText, toHtml } from "@/lib/rich-text";
import { getApiBaseUrl } from "@/lib/api-base";
import { useBlogAi, blogContext, SparkleIcon, LayersIcon, HEADLINE_MAX, TITLE_MAX } from "@/components/BlogAiAssist";
import {
  MAIN_CATEGORIES, SUBCATEGORIES, HEADLINE_MIN, SHORT_DESC_MIN, MAIN_CONTENT_MIN, ALLOWED_IMAGE_TYPES,
  card, lbl, inp, pillStyle, headerBtnGhost, headerBtnPrimary, ghostAccentBtn, STATUS_OPTIONS, StepHead
} from "./AddBlogs";

const API_BASE = getApiBaseUrl();

function EditBlogs({ blog, onClose, onSave }) {
  const fileRef = useRef(null);
  const actualFileRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");
  const parseExistingContent = () => {
    if (!blog.mainContent || !Array.isArray(blog.mainContent) || blog.mainContent.length === 0) {
      return { mainTitle: "", mainText: "", additionalSections: [{ title: "", content: "" }] };
    }
    const [first, ...rest] = blog.mainContent;
    return {
      mainTitle: first?.title || "",
      mainText: first?.content || "",
      additionalSections: rest.length > 0 ? rest : [{ title: "", content: "" }]
    };
  };
  const parsed = parseExistingContent();
  const [title, setTitle] = useState(blog.title || "");
  const [authorName, setAuthorName] = useState(blog.author || "");
  const [mainCategory, setMainCategory] = useState(blog.mainCategory || "");
  const [subcategory, setSubcategory] = useState(blog.subcategory || "");
  const [shortDescription, setShortDescription] = useState(blog.shortDescription || "");
  const [mainContentTitle, setMainContentTitle] = useState(parsed.mainTitle);
  const [mainContentText, setMainContentText] = useState(parsed.mainText);
  const [contentSections, setContentSections] = useState(parsed.additionalSections);
  const [status, setStatus] = useState(blog.status?.toLowerCase() || "draft");
  const [scheduledDate, setScheduledDate] = useState(
    blog.scheduledDate ? new Date(blog.scheduledDate).toISOString().slice(0, 16) : ""
  );
  const [selectedImage, setSelectedImage] = useState(blog.picture || null);
  const [imageChanged, setImageChanged] = useState(false);
  const ai = useBlogAi({
    setTitle, setShortDescription, setMainContentTitle, setMainContentText, setContentSections,
    getContext: () => blogContext({ title, shortDescription, mainContentTitle, mainContentText, contentSections }),
    setCover: (dataUrl, file) => {
      setSelectedImage(dataUrl);
      actualFileRef.current = file;
      setImageChanged(true);
      setImageError("");
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
    }) && (status !== "scheduled" || scheduledDate));
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Invalid file type. Only PNG, JPG, JPEG, and WebP are allowed.");
      if (fileRef.current) fileRef.current.value = "";
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
          setImageChanged(true);
          setIsCompressing(false);
        }
      };
    };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = "";
  };
  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    try {
      const allMainContent = [];
      if (mainContentTitle.trim() || htmlToText(mainContentText)) {
        allMainContent.push({ title: mainContentTitle.trim(), content: toHtml(mainContentText) });
      }
      contentSections.forEach((s) => {
        if (s.title.trim() || htmlToText(s.content)) allMainContent.push({ title: s.title.trim(), content: toHtml(s.content) });
      });
      if (imageChanged && actualFileRef.current) {
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("author", authorName.trim());
        formData.append("mainCategory", mainCategory);
        formData.append("subcategory", subcategory);
        formData.append("shortDescription", shortDescription.trim());
        formData.append("mainContent", JSON.stringify(allMainContent));
        formData.append("status", status);
        formData.append("picture", actualFileRef.current);
        if (status === "scheduled" && scheduledDate) formData.append("scheduledDate", new Date(scheduledDate).toISOString());
        const response = await fetch(`${API_BASE}/blogs/${blog._id}`, { method: "PATCH", credentials: "include", body: formData });
        if (!response.ok) {
          const e = await response.json();
          throw new Error(e.error || "Failed to update blog");
        }
      } else {
        const payload = { title: title.trim(), author: authorName.trim(), mainCategory, subcategory, shortDescription: shortDescription.trim(), mainContent: allMainContent, status };
        if (status === "scheduled" && scheduledDate) payload.scheduledDate = new Date(scheduledDate).toISOString();
        const response = await fetch(`${API_BASE}/blogs/${blog._id}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) {
          const e = await response.json();
          throw new Error(e.error || "Failed to update blog");
        }
      }
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update blog");
      setShowConfirmModal(false);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onSave();
    onClose();
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
  const canSave = isFormValid() && !isSubmitting;
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
          <PageHeader
            title="Edit Blog Post"
            subtitle="Update your blog post details below"
            before={<button
              onClick={onClose}
              aria-label="Back to blog list"
              style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--admin-border)", background: "transparent", color: "var(--admin-text-sub)", cursor: "pointer" }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>}
            actions={<>
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
            </>}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* STEP 1 — Cover & Basic Information */}
            <div style={{ ...card, padding: "22px 22px" }}>
              <StepHead n={1} title="Cover & Basic Information" subtitle="Update the cover and essential details" />
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

            {/* Actions */}
            <div className="ab-actions" style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, flex: 1, padding: "13px 0", borderRadius: 12, border: "1px solid var(--admin-border)", background: "var(--admin-surface)", color: "var(--admin-text-sub)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={!canSave}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, flex: 2, padding: "13px 0", borderRadius: 12, border: "none", background: canSave ? "var(--admin-accent)" : "var(--admin-bg-soft)", color: canSave ? "var(--admin-text-on-accent)" : "var(--admin-text-faint)", fontSize: 14, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed", boxShadow: canSave ? "var(--admin-shadow-sm)" : "none" }}
              >
                {isSubmitting ? <><Spinner size={14} /> Saving...</> : <>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Save changes
                </>}
              </button>
            </div>

          </div>
        </div>
      </div>

      {ai.modal}

      {/* Confirm Modal */}
      {showConfirmModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl shadow-2xl w-full max-w-md overflow-hidden border bg-[var(--admin-surface)] border-[var(--admin-border)]">
            <div className="px-6 py-5 border-b bg-[var(--admin-bg-soft)] border-[var(--admin-border)]">
              <p className="text-[var(--admin-text)]" style={{ fontSize: 13, fontWeight: 600 }}>Confirm Changes</p>
              <p className="mt-0.5 text-[var(--admin-text-faint)]" style={{ fontSize: 11, fontWeight: 400 }}>Are you sure you want to save changes to this blog post?</p>
            </div>
            <div className="flex gap-3 p-6">
              <button onClick={() => setShowConfirmModal(false)} disabled={isSubmitting} className="flex-1 py-2.5 rounded-lg border-2 transition-all border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]" style={{ fontSize: 11, fontWeight: 500 }}>Cancel</button>
              <button onClick={handleFinalConfirm} disabled={isSubmitting} className="flex-1 py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] transition-all disabled:opacity-50" style={{ fontSize: 11, fontWeight: 500 }}>{isSubmitting ? "Saving..." : "Confirm"}</button>
            </div>
          </div>
        </div>}

      {/* Success Modal */}
      {showSuccessModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl shadow-2xl w-full max-w-md overflow-hidden border bg-[var(--admin-surface)] border-[var(--admin-border)]">
            <div className="px-6 py-5 border-b bg-[var(--admin-bg-soft)] border-[var(--admin-border)]">
              <p className="text-[var(--admin-text)]" style={{ fontSize: 13, fontWeight: 600 }}>Success!</p>
              <p className="mt-0.5 text-[var(--admin-text-faint)]" style={{ fontSize: 11, fontWeight: 400 }}>Your blog post has been updated successfully.</p>
            </div>
            <div className="p-6">
              <button onClick={handleSuccessClose} className="w-full py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] transition-all" style={{ fontSize: 11, fontWeight: 500 }}>Back to Blog List</button>
            </div>
          </div>
        </div>}

      {/* Error Modal */}
      {showErrorModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl shadow-2xl w-full max-w-md overflow-hidden border bg-[var(--admin-surface)] border-[var(--admin-border)]">
            <div className="px-6 py-5 border-b bg-[var(--admin-bg-soft)] border-[var(--admin-border)]">
              <p className="text-[var(--admin-text)]" style={{ fontSize: 13, fontWeight: 600 }}>Error</p>
              <p className="mt-0.5 text-[var(--admin-text-faint)]" style={{ fontSize: 11, fontWeight: 400 }}>{errorMessage || "Something went wrong. Please try again."}</p>
            </div>
            <div className="p-6">
              <button onClick={() => setShowErrorModal(false)} className="w-full py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] transition-all" style={{ fontSize: 11, fontWeight: 500 }}>Close</button>
            </div>
          </div>
        </div>}
    </>;
}
export {
  EditBlogs as default
};
