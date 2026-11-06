import React, { useState, useRef, useEffect } from "react";
import { Spinner } from "@/components/DashboardLoader";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
import { getApiBaseUrl } from "@/lib/api-base";
import { htmlToText } from "@/lib/rich-text";

const API_BASE = getApiBaseUrl();
export const HEADLINE_MAX = 125;
// Post headline only (becomes the <title>); author and section titles keep HEADLINE_MAX.
export const TITLE_MAX = 40;

const Icon = ({ d, className = "w-4 h-4" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>;
export const SparkleIcon = (p) => <Icon {...p} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />;
const ImageIcon = (p) => <Icon {...p} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />;
export const LayersIcon = (p) => <Icon {...p} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />;
const PaperclipIcon = (p) => <Icon className="w-3.5 h-3.5" {...p} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />;

// Plain-text snapshot of the blog form, used to let the AI base the cover image on the content.
export const blogContext = ({ title, shortDescription, mainContentTitle, mainContentText, contentSections }) => [
  title,
  shortDescription,
  mainContentTitle,
  htmlToText(mainContentText),
  ...contentSections.map((x) => `${x.title} ${htmlToText(x.content)}`)
].map((x) => (x || "").trim()).filter(Boolean).join("\n");
// Same idea for the case study form: title, subtitle, challenge, solution and sections as plain text.
export const caseStudyContext = ({ title, subtitle, challenge, solution, sections }) => [
  title,
  subtitle,
  htmlToText(challenge),
  htmlToText(solution),
  ...sections.map((x) => `${x.topic} ${htmlToText(x.content)}`)
].map((x) => (x || "").trim()).filter(Boolean).join("\n");
export const CS_TITLE_MAX = 125; // the case study title field's maxLength
const MIN_CONTEXT = 20;
const IMAGE_SOURCE_STEPS = ["Reading your blog", "Writing image prompt", "Creating cover image"];

async function post(path, body, fallback) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || err?.message || fallback);
  }
  return response.json();
}
const generateWithGemini = (mode, prompt, modelId) => post("/ai/generate-blog", { mode, prompt, modelId }, "Gemini API error");
async function generatePollinationsImage(prompt, modelId) {
  const { dataUrl: sourceDataUrl } = await post("/ai/generate-image", { prompt, modelId }, "Image generation failed");
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Center-crop to 16:9 (FLUX returns squares), max 1280px wide.
      const w = Math.min(img.width, 1280);
      const h = Math.round(w * 9 / 16);
      const srcH = Math.min(img.height, img.width * 9 / 16);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas error"));
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, (img.height - srcH) / 2, img.width, srcH, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
      canvas.toBlob((b) => {
        if (!b) return reject(new Error("Blob error"));
        resolve({ dataUrl, file: new File([b], "ai-generated.jpg", { type: "image/jpeg" }) });
      }, "image/jpeg", 0.88);
    };
    img.onerror = () => reject(new Error("Image load error"));
    img.src = sourceDataUrl;
  });
}

const MODAL_CONFIGS = {
  image: { title: "Generate AI Image", hint: "Enter a topic or description to generate a professional cover image.", placeholder: "e.g., Customer support team in a modern office...", withImageAttach: false, steps: ["Analyzing prompt", "Creating cover image"] },
  title: { title: "Generate Title", hint: "Enter a topic (or attach an image) to generate a catchy title.", placeholder: "e.g., Best outsourcing practices for e-commerce...", withImageAttach: true, steps: ["Analyzing topic", "Writing title"] },
  content: { title: "Write Content with AI", hint: "Describe what you want to write about and AI will draft the full content body.", placeholder: "e.g., Write about how BPO helps scale e-commerce businesses...", withImageAttach: true, steps: ["Analyzing topic", "Writing content", "Structuring sections"] },
  full: { title: "Generate Full Blog", hint: "Enter a content topic and a separate image description — AI will generate the title, description, all content sections, and a matching cover image.", placeholder: "e.g., How TelexPH helps startups reduce operational costs...", withImageAttach: false, steps: ["Analyzing prompts", "Writing content", "Structuring sections", "Creating cover image"] },
  expand: { title: "Generate Prompt", hint: "Enter a rough idea and AI will expand it into a detailed content prompt and image prompt, ready to use in Generate Full Blog.", placeholder: "e.g., BPO tips for small businesses...", withImageAttach: false, steps: ["Analyzing your idea", "Expanding into prompts"] }
};
const CS_MODAL_CONFIGS = {
  image: { ...MODAL_CONFIGS.image },
  title: { title: "Generate Title", hint: "Enter a topic (or attach an image) to generate a clear case study title.", placeholder: "e.g., How an online retailer cut response times during peak season...", withImageAttach: true, steps: MODAL_CONFIGS.title.steps },
  content: { title: "Write Case Study with AI", hint: "Describe the client situation and what you did. AI drafts the challenge, solution, and content sections.", placeholder: "e.g., A mid-size online retailer struggled with ticket backlogs during the holiday rush...", withImageAttach: true, steps: ["Analyzing topic", "Writing challenge & solution", "Structuring sections"] },
  full: { title: "Generate Full Case Study", hint: "Enter a case study topic and a separate image description. AI will generate the title, subtitle, challenge, solution, content sections, and a matching cover image.", placeholder: "e.g., Scaling customer support for a logistics company during peak season...", withImageAttach: false, steps: ["Analyzing prompts", "Writing case study", "Structuring sections", "Creating cover image"] },
  expand: { title: "Generate Prompt", hint: "Enter a rough idea and AI will expand it into a detailed content prompt and image prompt, ready to use in Generate Full Case Study.", placeholder: "e.g., Peak season support for an online store...", withImageAttach: false, steps: MODAL_CONFIGS.expand.steps }
};
const textareaBase =`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none text-[12px] font-normal resize-none leading-relaxed bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)] placeholder-[var(--admin-text-faint)] focus:border-[var(--admin-border-strong)]`;
const labelCls = `uppercase tracking-widest transition-colors text-[var(--admin-text-faint)]`;

// Polls GET /ai/usage every 10s (and after each generation). kind "" = text models, "image" = image models.
function useUsage(kind, modelId, refreshKey) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const load = () => {
      const params = new URLSearchParams();
      if (kind) params.set("kind", kind);
      if (modelId) params.set("modelId", modelId);
      fetch(`${API_BASE}/ai/usage?${params}`, { credentials: "include" })
        .then((r) => r.ok ? r.json() : null)
        .then((d) => d && setData(d))
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 1e4);
    return () => clearInterval(t);
  }, [kind, modelId, refreshKey]);
  return data;
}

// Dropdown of AI models with their daily usage. `usage` comes from GET /ai/usage.
function ModelPicker({ usage, onSelect, note }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);
  if (!usage) return null;
  return <div>
      <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>AI Model</p>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border-2 transition-all bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)] hover:border-[var(--admin-border-strong)]"
          style={{ fontSize: 11, fontWeight: 500 }}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-500" />
            {usage.models.find((m) => m.active)?.label || "Select model"}
          </span>
          <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && <div className="absolute left-0 right-0 top-full mt-1 rounded-lg border shadow-lg overflow-hidden z-20 border-[var(--admin-border)] bg-[var(--admin-surface)]">
            {usage.models.map((m) => <button
              key={m.id}
              type="button"
              onClick={() => {
                onSelect(m.id);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--admin-bg-hover)]"
            >
                <span className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.active ? "bg-green-500" : "bg-[var(--admin-border-strong)]"}`} />
                  <span className={m.active ? "text-[var(--admin-text)]" : "text-[var(--admin-text-sub)]"} style={{ fontSize: 11, fontWeight: m.active ? 600 : 400 }}>{m.label}</span>
                </span>
                <span className="text-[var(--admin-text-faint)]" style={{ fontSize: 10, fontWeight: 400 }}>{m.used}/{m.limit}</span>
              </button>)}
          </div>}
      </div>
      {note && <p className="mt-1.5 text-[var(--admin-text-faint)]" style={{ fontSize: 9, fontWeight: 400 }}>{note}</p>}
    </div>;
}

// Shared AI assistant for the blog Add/Edit forms.
// Pass the form's setters; `setCover(dataUrl, file)` receives a generated cover.
// getContext() returns blogContext(...) of the current form (cover image can be based on it).
// Returns { open(type), modal, usage }: render {modal}, call open("image"|"title"|"content"|"full"|"expand").
// Case study form: pass `caseStudy: { setSubtitle, setChallenge, setSolution, setSections }` (and getContext = caseStudyContext(...)).
// It then uses the cs-* prompts and fills challenge / solution / sections instead of the blog fields.
export function useBlogAi({ setTitle, setShortDescription, setMainContentTitle, setMainContentText, setContentSections, setCover, getContext, onError, caseStudy }) {
  const { isdarkmode } = useDarkMode();
  const cs = Boolean(caseStudy);
  const mode = (name) => (cs ? `cs-${name}` : name);
  const titleMax = cs ? CS_TITLE_MAX : TITLE_MAX;
  const modalImageRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalPrompt, setModalPrompt] = useState("");
  const [modalImagePrompt, setModalImagePrompt] = useState("");
  const [modalAttachedImage, setModalAttachedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState(null); // generated cover waiting for the admin to accept it
  const [imageSource, setImageSource] = useState("own"); // "content" = AI reads the blog, "own" = admin writes the prompt
  const [generationStepIndex, setGenerationStepIndex] = useState(0);
  const [modelId, setModelId] = useState(() => localStorage.getItem("aiModelId") || "");
  const [imageModelId, setImageModelId] = useState(() => localStorage.getItem("aiImageModelId") || "");
  const usage = useUsage("", modelId, isGenerating);
  const imageUsage = useUsage("image", imageModelId, isGenerating);

  const fromContent = imageSource === "content";
  const blocked = isGenerating || !(activeModal === "image" && fromContent) && !modalPrompt.trim() || activeModal === "full" && !modalImagePrompt.trim();
  const closeModal = () => {
    setPreview(null);
    setActiveModal(null);
    setModalPrompt("");
    setModalImagePrompt("");
    setModalAttachedImage(null);
  };
  const open = (type) => {
    closeModal();
    setImageSource(getContext().length >= MIN_CONTEXT ? "content" : "own");
    setActiveModal(type);
  };
  // Ask Gemini to turn the current blog content (+ optional admin direction) into an image prompt.
  const imagePromptFromBlog = async () => {
    const extra = modalPrompt.trim() ? `
Image direction from admin: ${modalPrompt.trim()}` : "";
    const { data } = await generateWithGemini(mode("expand-prompt"), `Create a cover image for this ${cs ? "case study" : "blog post"}:
${getContext().slice(0, 2000)}${extra}`, modelId);
    if (!data?.imagePrompt) throw new Error("AI did not return an image prompt. Please try again.");
    return data.imagePrompt;
  };
  const handleModalImageAttach = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setModalAttachedImage(reader.result);
    reader.readAsDataURL(file);
    if (modalImageRef.current) modalImageRef.current.value = "";
  };
  const suggestPrompt = async () => {
    setIsGenerating(true);
    setGenerationStepIndex(1);
    try {
      setModalPrompt(await imagePromptFromBlog());
      setImageSource("own");
    } catch (err) {
      closeModal();
      onError(err.message || "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStepIndex(0);
    }
  };
  const applyContent = (parsed) => {
    if (cs) {
      if (parsed.challenge) caseStudy.setChallenge(parsed.challenge);
      if (parsed.solution) caseStudy.setSolution(parsed.solution);
      if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        caseStudy.setSections(parsed.sections.slice(0, 5).map((s) => ({ topic: (s.topic || "").slice(0, HEADLINE_MAX), content: s.content || "" }))); // the form allows 5 sections
      }
      return;
    }
    if (parsed.mainContentTitle) setMainContentTitle(parsed.mainContentTitle.slice(0, HEADLINE_MAX));
    if (parsed.mainContentText) setMainContentText(parsed.mainContentText);
    if (Array.isArray(parsed.additionalSections) && parsed.additionalSections.length > 0) {
      setContentSections(parsed.additionalSections.map((s) => ({
        title: (s.title || "").slice(0, HEADLINE_MAX),
        content: s.content || ""
      })));
    }
  };
  const handleGenerate = async () => {
    if (blocked) return;
    setIsGenerating(true);
    setGenerationStepIndex(0);
    try {
      if (activeModal === "image") {
        setGenerationStepIndex(1);
        let prompt = modalPrompt;
        if (fromContent) {
          prompt = await imagePromptFromBlog();
          setGenerationStepIndex(2);
        }
        const { dataUrl, file } = await generatePollinationsImage(prompt, imageModelId);
        setPreview({ dataUrl, file, prompt });
      } else if (activeModal === "title") {
        setGenerationStepIndex(1);
        const { text } = await generateWithGemini(mode("title"), modalPrompt, modelId);
        setTitle((text || "").trim().slice(0, titleMax));
        closeModal();
      } else if (activeModal === "content") {
        setGenerationStepIndex(1);
        const { data: parsed } = await generateWithGemini(mode("content"), modalPrompt, modelId);
        setGenerationStepIndex(2);
        applyContent(parsed);
        closeModal();
      } else if (activeModal === "full") {
        let contentDone = false;
        setGenerationStepIndex(1);
        const [{ data: parsed }, imageResult] = await Promise.all([
          generateWithGemini(mode("full"), modalPrompt, modelId).then((r) => {
            contentDone = true;
            setGenerationStepIndex(3);
            return r;
          }),
          (async () => {
            const result = await generatePollinationsImage(modalImagePrompt, imageModelId).catch(() => null);
            if (contentDone) setGenerationStepIndex(3);
            return result;
          })()
        ]);
        if (parsed.title) setTitle(parsed.title.slice(0, titleMax));
        if (cs) {
          if (parsed.subtitle) caseStudy.setSubtitle(parsed.subtitle);
        } else if (parsed.shortDescription) setShortDescription(parsed.shortDescription);
        applyContent(parsed);
        if (imageResult) setCover(imageResult.dataUrl, imageResult.file);
        closeModal();
      } else if (activeModal === "expand") {
        setGenerationStepIndex(1);
        const { data: parsed } = await generateWithGemini(mode("expand-prompt"), modalPrompt, modelId);
        setModalPrompt(parsed.contentPrompt || modalPrompt);
        setModalImagePrompt(parsed.imagePrompt || "");
        setActiveModal("full");
      }
    } catch (err) {
      closeModal();
      onError(err.message || "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStepIndex(0);
    }
  };

  const baseCfg = activeModal ? (cs ? CS_MODAL_CONFIGS : MODAL_CONFIGS)[activeModal] : null;
  const isImageFromBlog = activeModal === "image" && fromContent;
  const cfg = baseCfg && { ...baseCfg, steps: isImageFromBlog ? IMAGE_SOURCE_STEPS : baseCfg.steps };
  const modal = cfg && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <input ref={modalImageRef} type="file" accept="image/*" onChange={handleModalImageAttach} className="hidden" />
      <div className="rounded-xl shadow-2xl w-full max-w-[460px] overflow-hidden border transition-all duration-500 bg-[var(--admin-surface)] border-[var(--admin-border)]">
        <div className="flex items-center justify-between px-6 py-5 border-b transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--admin-accent)] flex items-center justify-center flex-shrink-0">
              {activeModal === "image" ? <ImageIcon className="w-4 h-4 text-white" /> : activeModal === "full" ? <LayersIcon className="w-4 h-4 text-white" /> : <SparkleIcon className="w-4 h-4 text-white" />}
            </div>
            <div>
              <p className="text-[var(--admin-text)]" style={{ fontSize: 13, fontWeight: 600 }}>{cfg.title}</p>
              <p className="mt-0.5 text-[var(--admin-text-faint)]" style={{ fontSize: 10, fontWeight: 400 }}>Powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-[var(--admin-text-faint)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {preview && <div className="p-6 space-y-3">
            <img src={preview.dataUrl} alt="Generated cover preview" className="w-full rounded-lg border border-[var(--admin-border)]" style={{ aspectRatio: "16/9", objectFit: "cover" }} />
            <p className="text-[var(--admin-text-faint)]" style={{ fontSize: 10, fontWeight: 400 }}>Prompt used: {preview.prompt}</p>
          </div>}
        <div className={`p-6 space-y-4 ${preview ? "hidden" : ""}`}>
          {activeModal === "image" ? <ModelPicker
              usage={imageUsage}
              onSelect={(id) => {
                setImageModelId(id);
                localStorage.setItem("aiImageModelId", id);
              }}
              note="Falls back to a free image generator automatically if the selected model has no quota."
            /> : <ModelPicker
              usage={usage}
              onSelect={(id) => {
                setModelId(id);
                localStorage.setItem("aiModelId", id);
              }}
            />}

          <div className={`flex items-start gap-2 px-3 py-3 rounded-lg border ${isdarkmode ? "bg-blue-500/10 text-blue-300 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-100"}`} style={{ fontSize: 11, fontWeight: 400 }}>
            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {cfg.hint}
          </div>

          {activeModal === "image" && <div className="grid grid-cols-2 gap-2">
              {[["content", cs ? "Based on my case study" : "Based on my blog", "AI reads your content"], ["own", "My own prompt", "You describe the image"]].map(([key, label, sub]) => <button
                  key={key}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setImageSource(key)}
                  className={`text-left px-3 py-2.5 rounded-lg border-2 transition-all ${imageSource === key ? "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)]" : "border-[var(--admin-border)] hover:border-[var(--admin-border-strong)]"}`}
                >
                  <p className={imageSource === key ? "text-[var(--admin-accent-text)]" : "text-[var(--admin-text)]"} style={{ fontSize: 11, fontWeight: 600 }}>{label}</p>
                  <p className="text-[var(--admin-text-faint)]" style={{ fontSize: 10, fontWeight: 400 }}>{sub}</p>
                </button>)}
            </div>}

          <div>
            {activeModal === "full" && <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>Content Prompt</p>}
            {isImageFromBlog && <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>Extra direction (optional)</p>}
            <textarea value={modalPrompt} onChange={(e) => setModalPrompt(e.target.value)} placeholder={isImageFromBlog ? "e.g., bright office, no faces, red accents" : cfg.placeholder} rows={isImageFromBlog ? 2 : 4} autoFocus className={textareaBase} />
          </div>

          {activeModal === "full" && <div>
              <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>Image Prompt</p>
              <textarea value={modalImagePrompt} onChange={(e) => setModalImagePrompt(e.target.value)} placeholder="e.g., Modern BPO office with startup team collaborating..." rows={2} className={textareaBase} />
            </div>}

          {cfg.withImageAttach && <button
              onClick={() => modalImageRef.current?.click()}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${modalAttachedImage ? "border-green-400 text-green-500" : "border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-text)]"}`}
              style={{ fontSize: 10, fontWeight: 500 }}
            >
              <PaperclipIcon />
              {modalAttachedImage ? "✓ Image attached" : "Attach Image"}
            </button>}
        </div>

        {isGenerating && <div className="mx-6 mb-4 px-6 py-6 rounded-xl border flex flex-col items-center justify-center gap-1 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]">
            <div className="relative w-14 h-14 mb-2">
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-accent-text)" }}><Spinner size={14} thickness={4} /></span>
              <div className="absolute inset-0 flex items-center justify-center">
                <SparkleIcon className="w-5 h-5 text-[var(--admin-text-sub)]" />
              </div>
            </div>
            <p className="text-[var(--admin-text)]" style={{ fontSize: 14, fontWeight: 600 }}>{cfg.steps[generationStepIndex] || "Generating..."}</p>
            <p className="mb-3 text-[var(--admin-text-faint)]" style={{ fontSize: 11, fontWeight: 400 }}>This usually takes 30-60 seconds.</p>
            <div className="flex items-center w-full">
              {cfg.steps.map((step, i) => <React.Fragment key={step}>
                  {i > 0 && <div className={`flex-1 h-px ${i <= generationStepIndex ? "bg-[var(--admin-accent)]" : "bg-[var(--admin-border-strong)]"}`} />}
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${i < generationStepIndex ? "bg-[var(--admin-accent)]" : i === generationStepIndex ? "border-2 border-[var(--admin-accent)] bg-[var(--admin-bg-soft)]" : "bg-[var(--admin-border-strong)]"}`}>
                      {i < generationStepIndex ? <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg> : i === generationStepIndex ? <div className="w-2 h-2 rounded-full bg-[var(--admin-accent)]" /> : null}
                    </div>
                    <span className={`text-center ${i <= generationStepIndex ? "text-[var(--admin-text-sub)]" : "text-[var(--admin-text-faint)]"}`} style={{ fontSize: 9, fontWeight: i === generationStepIndex ? 600 : 400, maxWidth: 72 }}>{step}</span>
                  </div>
                </React.Fragment>)}
            </div>
          </div>}

        {preview && !isGenerating && <div className="flex gap-3 px-6 py-4 border-t border-[var(--admin-border)]">
            <button onClick={closeModal} className="flex-1 py-2.5 rounded-lg transition-all border-2 border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]" style={{ fontSize: 11, fontWeight: 500 }}>Discard</button>
            <button onClick={() => { setPreview(null); handleGenerate(); }} className="flex-1 py-2.5 rounded-lg transition-all border-2 border-[var(--admin-border)] text-[var(--admin-accent-text)] hover:bg-[var(--admin-bg-hover)]" style={{ fontSize: 11, fontWeight: 500 }}>Regenerate</button>
            <button onClick={() => { setCover(preview.dataUrl, preview.file); closeModal(); }} className="flex-1 py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] transition-all" style={{ fontSize: 11, fontWeight: 600 }}>Use this image</button>
          </div>}
        <div className={`flex gap-3 px-6 py-4 border-t transition-all duration-500 border-[var(--admin-border)] ${preview && !isGenerating ? "hidden" : ""}`}>
          <button onClick={closeModal} disabled={isGenerating} className="flex-1 py-2.5 rounded-lg transition-all border-2 border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]" style={{ fontSize: 11, fontWeight: 500 }}>
            Cancel
          </button>
          {isImageFromBlog && <button onClick={suggestPrompt} disabled={isGenerating} className="flex-1 py-2.5 rounded-lg transition-all border-2 border-[var(--admin-border)] text-[var(--admin-accent-text)] hover:bg-[var(--admin-bg-hover)]" style={{ fontSize: 11, fontWeight: 500 }}>
              Suggest prompt
            </button>}
          <button
            onClick={handleGenerate}
            disabled={blocked}
            className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${blocked ? "bg-[var(--admin-accent)]/40 text-white cursor-not-allowed" : "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)]"}`}
            style={{ fontSize: 11, fontWeight: 500 }}
          >
            {isGenerating ? <><Spinner /> Generating...</> : <><SparkleIcon className="w-3.5 h-3.5" /> Generate</>}
          </button>
        </div>
      </div>
    </div>;
  return { open, modal, usage };
}
