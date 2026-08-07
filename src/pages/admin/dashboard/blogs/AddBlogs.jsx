
import React, { useState, useRef } from "react";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";

const API_BASE =
  import.meta.env.VITE_API_ORIGIN || "/api";
const MAIN_CATEGORIES = {
  MAIN_SERVICE: "Main Service Categories",
  INDUSTRY_INSIGHTS: "Industry-Specific Insights",
  BUSINESS_GROWTH: "Business Growth & Strategy",
  COMPANY_CULTURE: "Company Culture & Updates"
};
const SUBCATEGORIES = {
  "Main Service Categories": ["Customer Experience (CX)", "Back Office Solutions", "Virtual Assistance", "Sales & Lead Generation"],
  "Industry-Specific Insights": ["E-commerce Support", "Real Estate Outsourcing", "Healthcare BPO", "Tech & SaaS Scaling"],
  "Business Growth & Strategy": ["Scale Smarter", "Outsourcing 101", "Cost Optimization"],
  "Company Culture & Updates": ["TelexPH Life", "News & Press Releases"]
};
const HEADLINE_MIN = 5;
const HEADLINE_MAX = 40;
const SHORT_DESC_MIN = 5;
const SHORT_DESC_MAX = 55;
const MAIN_CONTENT_MIN = 25;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const Spinner = () => <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>;
const SparkleIcon = ({ className = "w-4 h-4" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
/>
  </svg>;
const ImageIcon = ({ className = "w-4 h-4" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
/>
  </svg>;
const LayersIcon = ({ className = "w-4 h-4" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
/>
  </svg>;
const PaperclipIcon = ({ className = "w-3.5 h-3.5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
/>
  </svg>;
const CustomDropdown = ({ value, onChange, options, placeholder = "Select...", isdarkmode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selected = options.find((o) => o.value === value);
  return <div ref={ref} className="relative w-full">
      <button
    type="button"
    onClick={() => setOpen((prev) => !prev)}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none text-[12px] bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)] hover:border-[var(--admin-border-strong)] ${open ? "border-[var(--admin-border-strong)]" : ""}`}
  >
        <span className={selected ? "" : "text-[var(--admin-text-faint)]"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
    className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} text-[var(--admin-text-faint)]`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && <div className={`absolute z-30 mt-1.5 w-full rounded-lg border shadow-lg overflow-hidden transition-all duration-200 bg-[var(--admin-surface)] border-[var(--admin-border)]`}>
          {options.map((opt) => <button
    key={opt.value}
    type="button"
    onClick={() => {
      onChange(opt.value);
      setOpen(false);
    }}
    className={`w-full text-left px-4 py-2.5 text-[12px] transition-all duration-150 flex items-center gap-2 ${opt.value === value ? "bg-[var(--admin-accent)] text-white" : "text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]"}`}
  >
              {opt.value === value && <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>}
              <span className={opt.value === value ? "" : "ml-5"}>{opt.label}</span>
            </button>)}
        </div>}
    </div>;
};
async function generateWithGemini(mode, prompt, modelId) {
  const response = await fetch(`${API_BASE}/ai/generate-blog`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, prompt, modelId })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || "Gemini API error");
  }
  return response.json();
}
async function generatePollinationsImage(prompt, modelId) {
  const response = await fetch(`${API_BASE}/ai/generate-image`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, modelId })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || "Image generation failed");
  }
  const { dataUrl: sourceDataUrl } = await response.json();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxW = 800;
      let w = img.width, h = img.height;
      if (w > maxW) {
        h = maxW / w * h;
        w = maxW;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Canvas error"));
      }
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      canvas.toBlob((b) => {
        if (!b) return reject(new Error("Blob error"));
        resolve({ dataUrl, file: new File([b], "ai-generated.jpg", { type: "image/jpeg" }) });
      }, "image/jpeg", 0.7);
    };
    img.onerror = () => {
      reject(new Error("Image load error"));
    };
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
const TABS = [
  {
    key: "details",
    label: "Blog Details",
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
  },
  {
    key: "content",
    label: "Content Body",
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
  },
  {
    key: "sections",
    label: "Extra Sections",
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
  }
];
function AddBlogs() {
  const { isdarkmode } = useDarkMode();
  const fileRef = useRef(null);
  const actualFileRef = useRef(null);
  const modalImageRef = useRef(null);
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [publishingOpen, setPublishingOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [modalPrompt, setModalPrompt] = useState("");
  const [modalImagePrompt, setModalImagePrompt] = useState("");
  const [modalAttachedImage, setModalAttachedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepIndex, setGenerationStepIndex] = useState(0);
  const [aiUsage, setAiUsage] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(() => localStorage.getItem("aiModelId") || "");
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const modelMenuRef = useRef(null);
  const [aiImageUsage, setAiImageUsage] = useState(null);
  const [selectedImageModelId, setSelectedImageModelId] = useState(() => localStorage.getItem("aiImageModelId") || "");
  const [isImageModelMenuOpen, setIsImageModelMenuOpen] = useState(false);
  const imageModelMenuRef = useRef(null);
  React.useEffect(() => {
    const fetchUsage = () => {
      const qs = selectedModelId ? `?modelId=${encodeURIComponent(selectedModelId)}` : "";
      fetch(`${API_BASE}/ai/usage${qs}`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setAiUsage(data))
        .catch(() => {});
    };
    fetchUsage();
    const interval = setInterval(fetchUsage, 1e4);
    return () => clearInterval(interval);
  }, [isGenerating, selectedModelId]);
  React.useEffect(() => {
    const fetchImageUsage = () => {
      const params = new URLSearchParams({ kind: "image" });
      if (selectedImageModelId) params.set("modelId", selectedImageModelId);
      fetch(`${API_BASE}/ai/usage?${params}`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setAiImageUsage(data))
        .catch(() => {});
    };
    fetchImageUsage();
    const interval = setInterval(fetchImageUsage, 1e4);
    return () => clearInterval(interval);
  }, [isGenerating, selectedImageModelId]);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target)) {
        setIsModelMenuOpen(false);
      }
      if (imageModelMenuRef.current && !imageModelMenuRef.current.contains(e.target)) {
        setIsImageModelMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectModel = (id) => {
    setSelectedModelId(id);
    localStorage.setItem("aiModelId", id);
    setIsModelMenuOpen(false);
  };
  const selectImageModel = (id) => {
    setSelectedImageModelId(id);
    localStorage.setItem("aiImageModelId", id);
    setIsImageModelMenuOpen(false);
  };
  const getTotalWordCount = () => {
    let n = (mainContentTitle + " " + mainContentText).split(/\s+/).filter(Boolean).length;
    contentSections.forEach((s) => {
      n += (s.title + " " + s.content).split(/\s+/).filter(Boolean).length;
    });
    return n;
  };
  const isFormValid = () => {
    const t = title.trim(), a = authorName.trim(), d = shortDescription.trim();
    const mt = mainContentTitle.trim(), mb = mainContentText.trim();
    return !!(t.length >= HEADLINE_MIN && t.length <= HEADLINE_MAX && a.length >= HEADLINE_MIN && a.length <= HEADLINE_MAX && mainCategory && subcategory && d.length >= SHORT_DESC_MIN && d.length <= SHORT_DESC_MAX && (mt.length === 0 || mt.length >= HEADLINE_MIN && mt.length <= HEADLINE_MAX) && mb.length >= MAIN_CONTENT_MIN && (mt.length > 0 || mb.length > 0) && selectedImage && !imageError && contentSections.every((s) => {
      const st = s.title.trim(), sc = s.content.trim();
      if (!st && !sc) return true;
      return (st.length === 0 || st.length >= HEADLINE_MIN && st.length <= HEADLINE_MAX) && (sc.length === 0 || sc.length >= MAIN_CONTENT_MIN);
    }) && (status !== "scheduled" || scheduledDate));
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
  const handleModalImageAttach = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setModalAttachedImage(reader.result);
    reader.readAsDataURL(file);
    if (modalImageRef.current) modalImageRef.current.value = "";
  };
  const openModal = (type) => {
    setModalPrompt("");
    setModalImagePrompt("");
    setModalAttachedImage(null);
    setActiveModal(type);
  };
  const closeModal = () => {
    setActiveModal(null);
    setModalPrompt("");
    setModalImagePrompt("");
    setModalAttachedImage(null);
  };
  const handleGenerate = async () => {
    if (!modalPrompt.trim()) return;
    if (activeModal === "full" && !modalImagePrompt.trim()) return;
    setIsGenerating(true);
    setGenerationStepIndex(0);
    try {
      if (activeModal === "image") {
        setGenerationStepIndex(1);
        const { dataUrl, file } = await generatePollinationsImage(modalPrompt, selectedImageModelId);
        setSelectedImage(dataUrl);
        actualFileRef.current = file;
        closeModal();
      } else if (activeModal === "title") {
        setGenerationStepIndex(1);
        const { text } = await generateWithGemini("title", modalPrompt, selectedModelId);
        setTitle((text || "").trim().slice(0, HEADLINE_MAX));
        closeModal();
      } else if (activeModal === "content") {
        setGenerationStepIndex(1);
        const { data: parsed } = await generateWithGemini("content", modalPrompt, selectedModelId);
        setGenerationStepIndex(2);
        if (parsed.mainContentTitle) setMainContentTitle(parsed.mainContentTitle.slice(0, HEADLINE_MAX));
        if (parsed.mainContentText) setMainContentText(parsed.mainContentText);
        if (Array.isArray(parsed.additionalSections) && parsed.additionalSections.length > 0) {
          setContentSections(parsed.additionalSections.map((s) => ({
            title: (s.title || "").slice(0, HEADLINE_MAX),
            content: s.content || ""
          })));
        }
        closeModal();
      } else if (activeModal === "full") {
        let contentDone = false;
        setGenerationStepIndex(1);
        const [{ data: parsed }, imageResult] = await Promise.all([
          generateWithGemini("full", modalPrompt, selectedModelId).then((r) => {
            contentDone = true;
            setGenerationStepIndex(3);
            return r;
          }),
          (async () => {
            const result = await generatePollinationsImage(modalImagePrompt, selectedImageModelId).catch(() => null);
            if (contentDone) setGenerationStepIndex(3);
            return result;
          })()
        ]);
        if (parsed.title) setTitle(parsed.title.slice(0, HEADLINE_MAX));
        if (parsed.shortDescription) setShortDescription(parsed.shortDescription.slice(0, SHORT_DESC_MAX));
        if (parsed.mainContentTitle) setMainContentTitle(parsed.mainContentTitle.slice(0, HEADLINE_MAX));
        if (parsed.mainContentText) setMainContentText(parsed.mainContentText);
        if (Array.isArray(parsed.additionalSections) && parsed.additionalSections.length > 0) {
          setContentSections(parsed.additionalSections.map((s) => ({
            title: (s.title || "").slice(0, HEADLINE_MAX),
            content: s.content || ""
          })));
        }
        if (imageResult) {
          setSelectedImage(imageResult.dataUrl);
          actualFileRef.current = imageResult.file;
        }
        closeModal();
      } else if (activeModal === "expand") {
        setGenerationStepIndex(1);
        const { data: parsed } = await generateWithGemini("expand-prompt", modalPrompt, selectedModelId);
        setModalPrompt(parsed.contentPrompt || modalPrompt);
        setModalImagePrompt(parsed.imagePrompt || "");
        setActiveModal("full");
      }
    } catch (err) {
      setErrorMessage(err.message || "Generation failed. Please try again.");
      closeModal();
      setShowErrorModal(true);
    } finally {
      setIsGenerating(false);
      setGenerationStepIndex(0);
    }
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
      if (mainContentTitle.trim() || mainContentText.trim()) {
        allMainContent.push({ title: mainContentTitle.trim(), content: mainContentText.trim() });
      }
      contentSections.forEach((s) => {
        if (s.title.trim() || s.content.trim()) allMainContent.push({ title: s.title.trim(), content: s.content.trim() });
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
      setSelectedImage(null);
      setImageError("");
      actualFileRef.current = null;
      if (fileRef.current) fileRef.current.value = "";
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
  const modalCfg = activeModal ? MODAL_CONFIGS[activeModal] : null;
  const CharCount = ({ value, max, min }) => {
    const trimmed = value.trim();
    const tooShort = trimmed.length > 0 && trimmed.length < min;
    const tooLong = max !== void 0 && trimmed.length > max;
    return <div className="flex justify-between items-center mt-1 px-1">
        <span className={`text-[9px] ${tooShort || tooLong ? "text-red-500" : "text-transparent select-none"}`}>
          {tooShort ? `Min ${min} chars required.` : tooLong ? `Max ${max} chars allowed.` : "."}
        </span>
        <span className={`text-[9px] ${tooLong ? "text-red-500" : "text-[var(--admin-text-faint)]"}`}>
          {max !== void 0 ? `${trimmed.length}/${max}` : `${trimmed.length} chars`}
        </span>
      </div>;
  };
  const inputBase = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none text-[12px] font-normal bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)] placeholder-[var(--admin-text-faint)] focus:border-[var(--admin-border-strong)]`;
  const selectBase = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none text-[12px] cursor-pointer bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)] focus:border-[var(--admin-border-strong)]`;
  const textareaBase = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none text-[12px] font-normal resize-none leading-relaxed bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)] placeholder-[var(--admin-text-faint)] focus:border-[var(--admin-border-strong)]`;
  const sectionCard = `rounded-xl border transition-all duration-500 overflow-hidden bg-[var(--admin-surface)] border-[var(--admin-border)]`;
  const sectionHeader = `flex items-center justify-between px-6 py-4 border-b transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`;
  const labelCls = `uppercase tracking-widest transition-colors text-[var(--admin-text-faint)]`;
  const dividerCls = `divide-y transition-all duration-500 divide-[var(--admin-border)]`;
  const rowHoverCls = `flex items-start gap-4 px-6 py-4 transition-all duration-300 hover:bg-[var(--admin-bg-hover)]`;
  return <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      ` }} />

      <div className={`flex flex-col items-start justify-start p-8 space-y-8 min-h-screen transition-colors duration-500 bg-[var(--admin-bg)]`}>

        {
    /* â”€â”€ Page Header â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto">
          <div className={`flex items-center justify-between pb-6 border-b transition-colors duration-500 border-[var(--admin-border)]`}>
            <div>
              <h2
    className={`tracking-tight transition-colors text-[var(--admin-text)]`}
    style={{ fontSize: 18, fontWeight: 500, margin: 0 }}
  >
                Create New Blog Post
              </h2>
              <p
    className={`mt-1 transition-colors text-[var(--admin-text-faint)]`}
    style={{ fontSize: 12, fontWeight: 400, margin: "4px 0 0" }}
  >
                Share your insights and expertise with the community
              </p>
            </div>
            <div className="flex items-center gap-3">
              {aiUsage && <div
    className={`flex flex-col gap-1 px-3 py-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]`}
    title={aiUsage.models.map((m) => `${m.label}: ${m.used}/${m.limit}${m.active ? " (active)" : ""}`).join("\n")}
  >
                  {aiUsage.models.map((m) => <div key={m.id} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.active ? "bg-green-500" : "bg-[var(--admin-border-strong)]"}`} />
                      <span className={`${m.active ? "text-[var(--admin-text)]" : "text-[var(--admin-text-faint)]"}`} style={{ fontSize: 10, fontWeight: m.active ? 600 : 400 }}>
                        {m.label}
                      </span>
                      <span className={"text-[var(--admin-text-faint)]"} style={{ fontSize: 10, fontWeight: 400 }}>
                        {m.used}/{m.limit}
                      </span>
                    </div>)}
                </div>}
              <button
    onClick={() => openModal("expand")}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 transition-all border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                <SparkleIcon className="w-3.5 h-3.5" />
                Generate Prompt
              </button>
              <button
    onClick={() => openModal("full")}
    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[#6a0000] transition-all shadow-sm"
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                <LayersIcon className="w-3.5 h-3.5" />
                Generate Full Blog
              </button>
            </div>
          </div>
        </div>

        {
    /* â”€â”€ Main Grid â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

          {
    /* â”€â”€ Left Column â”€â”€ */
  }
          <div className="lg:col-span-4 space-y-4">

            {
    /* Blog Cover Image */
  }
            <div className={sectionCard}>
              <div className={sectionHeader}>
                <div>
                  <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>Blog Cover Image</p>
                  <p className={`mt-0.5 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 11, fontWeight: 400 }}>
                    Upload or generate a cover photo
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleFileChange} className="hidden" />
                <input ref={modalImageRef} type="file" accept="image/*" onChange={handleModalImageAttach} className="hidden" />

                {
    /* Drop zone */
  }
                <div
    onClick={() => fileRef.current?.click()}
    className={`relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all ${imageError ? "border-red-400 bg-red-50/5" : selectedImage ? "border-[var(--admin-accent)]/40" : "border-[var(--admin-border)] hover:border-[var(--admin-border-strong)] bg-[var(--admin-bg-soft)]"}`}
    style={{ aspectRatio: "16/9" }}
  >
                  {isCompressing ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Spinner />
                      <span className={`text-[10px] text-[var(--admin-text-faint)]`}>Compressing...</span>
                    </div> : selectedImage ? <>
                      <img src={selectedImage} alt="Cover preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[11px] font-medium">Click to change</span>
                      </div>
                    </> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center bg-[var(--admin-bg-hover)]`}>
                        <svg className={`w-5 h-5 text-[var(--admin-text-faint)]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className={`text-[11px] font-medium text-[var(--admin-text-sub)]`}>Drop or click to upload</p>
                        <p className={`text-[10px] mt-0.5 text-[var(--admin-text-faint)]`}>JPG, PNG, WEBP</p>
                      </div>
                    </div>}
                </div>
                {imageError && <p className="text-red-500 text-[10px]">{imageError}</p>}

                {
    /* Image action buttons */
  }
                <div className="grid grid-cols-2 gap-2">
                  <button
    onClick={() => fileRef.current?.click()}
    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all border-2 border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Browse
                  </button>
                  <button
    onClick={() => openModal("image")}
    className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[#6a0000] transition-all"
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    AI Image
                  </button>
                </div>
              </div>
            </div>

            {
    /* Publishing Options — Accordion */
  }
            <div className={`${sectionCard} ${publishingOpen ? "!overflow-visible" : ""}`}>
              <button
    type="button"
    onClick={() => setPublishingOpen((prev) => !prev)}
    className={`w-full flex items-center justify-between px-6 py-4 transition-all duration-300 hover:bg-[var(--admin-bg-hover)] ${!publishingOpen ? "rounded-xl" : `border-b border-[var(--admin-border)]`}`}
  >
                <div className="text-left">
                  <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>Publishing Options</p>
                  <p className={`mt-0.5 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 11, fontWeight: 400 }}>
                    Set status and schedule
                  </p>
                </div>
                <svg
    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${publishingOpen ? "rotate-180" : ""} text-[var(--admin-text-faint)]`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${publishingOpen ? "max-h-none opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                <div className="p-6 space-y-4">
                  <div>
                    <p className={labelCls} style={{ fontSize: 10, fontWeight: 500, marginBottom: 8 }}>Status</p>
                    <CustomDropdown
    value={status}
    onChange={(val) => setStatus(val)}
    options={[
      { value: "draft", label: "Draft" },
      { value: "published", label: "Published" },
      { value: "scheduled", label: "Scheduled" }
    ]}
    placeholder="Select Status"
    isdarkmode={isdarkmode}
  />
                  </div>
                  {status === "scheduled" && <div>
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500, marginBottom: 8 }}>Schedule Date</p>
                      <input
    type="datetime-local"
    value={scheduledDate}
    onChange={(e) => setScheduledDate(e.target.value)}
    className={inputBase}
  />
                    </div>}
                </div>
              </div>
            </div>

            {
    /* Categories — Accordion */
  }
            <div className={`${sectionCard} ${categoriesOpen ? "!overflow-visible" : ""}`}>
              <button
    type="button"
    onClick={() => setCategoriesOpen((prev) => !prev)}
    className={`w-full flex items-center justify-between px-6 py-4 transition-all duration-300 hover:bg-[var(--admin-bg-hover)] ${!categoriesOpen ? "rounded-xl" : `border-b border-[var(--admin-border)]`}`}
  >
                <div className="text-left">
                  <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>Categories</p>
                  <p className={`mt-0.5 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 11, fontWeight: 400 }}>
                    Assign topic and subcategory
                  </p>
                </div>
                <svg
    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${categoriesOpen ? "rotate-180" : ""} text-[var(--admin-text-faint)]`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${categoriesOpen ? "max-h-none opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                <div className="p-6 space-y-4">
                  <div>
                    <p className={labelCls} style={{ fontSize: 10, fontWeight: 500, marginBottom: 8 }}>Main Category</p>
                    <CustomDropdown
    value={mainCategory}
    onChange={handleMainCategoryChange}
    options={Object.values(MAIN_CATEGORIES).map((c) => ({ value: c, label: c }))}
    placeholder="Select Category"
    isdarkmode={isdarkmode}
  />
                  </div>
                  {mainCategory && <div>
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500, marginBottom: 8 }}>Subcategory</p>
                      <CustomDropdown
    value={subcategory}
    onChange={setSubcategory}
    options={getAvailableSubcategories().map((s) => ({ value: s, label: s }))}
    placeholder="Select Subcategory"
    isdarkmode={isdarkmode}
  />
                    </div>}
                </div>
              </div>
            </div>

          </div>

          {
    /* â”€â”€ Right Column â”€â”€ */
  }
          <div className="lg:col-span-8 space-y-4">

            {
    /* â”€â”€ Tabbed Panel â”€â”€ */
  }
            <div className={sectionCard}>

              {
    /* Tab Bar */
  }
              <div className={`flex items-center border-b transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}>
                {TABS.map((tab) => {
    const isActive = activeTab === tab.key;
    return <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key)}
      className={`relative flex items-center gap-2 px-5 py-4 transition-all duration-200 ${isActive ? "text-[var(--admin-text)]" : "text-[var(--admin-text-faint)] hover:text-[var(--admin-text-sub)]"}`}
      style={{ fontSize: 12, fontWeight: isActive ? 600 : 400 }}
    >
                      {tab.icon}
                      {tab.label}
                      {
      /* Active indicator */
    }
                      {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--admin-accent)] rounded-full" />}
                    </button>;
  })}

                {
    /* Right-side action button per tab */
  }
                <div className="ml-auto px-4">
                  {activeTab === "details" && <button
    onClick={() => openModal("title")}
    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[#6a0000] transition-all"
    style={{ fontSize: 10, fontWeight: 500 }}
  >
                      <SparkleIcon className="w-3 h-3" />
                      AI Title
                    </button>}
                  {activeTab === "content" && <button
    onClick={() => openModal("content")}
    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[#6a0000] transition-all"
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                      <SparkleIcon className="w-3.5 h-3.5" />
                      Write with AI
                    </button>}
                  {activeTab === "sections" && <button
    onClick={addContentSection}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Section
                    </button>}
                </div>
              </div>

              {
    /* â”€â”€ Tab: Blog Details â”€â”€ */
  }
              {activeTab === "details" && <div className={dividerCls}>
                  {
    /* Title row */
  }
                  <div className={rowHoverCls}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>
                        Title <span className="text-[var(--admin-accent)]">•</span>
                      </p>
                    </div>
                    <div className="flex-1">
                      <input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    maxLength={HEADLINE_MAX}
    placeholder="e.g., Top 10 Hidden Gems in Palawan"
    className={inputBase}
  />
                      <CharCount value={title} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                    </div>
                  </div>

                  {
    /* Author row */
  }
                  <div className={rowHoverCls}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>
                        Author <span className="text-[var(--admin-accent)]">•</span>
                      </p>
                    </div>
                    <div className="flex-1">
                      <input
    value={authorName}
    onChange={(e) => setAuthorName(e.target.value)}
    maxLength={HEADLINE_MAX}
    placeholder="e.g., Admin Team"
    className={inputBase}
  />
                      <CharCount value={authorName} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                    </div>
                  </div>

                  {
    /* Short Description row */
  }
                  <div className={rowHoverCls}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>
                        Description <span className="text-[var(--admin-accent)]">•</span>
                      </p>
                    </div>
                    <div className="flex-1">
                      <input
    value={shortDescription}
    onChange={(e) => setShortDescription(e.target.value)}
    maxLength={SHORT_DESC_MAX}
    placeholder="Brief summary for listing card..."
    className={inputBase}
  />
                      <CharCount value={shortDescription} min={SHORT_DESC_MIN} max={SHORT_DESC_MAX} />
                    </div>
                  </div>
                </div>}

              {
    /* â”€â”€ Tab: Content Body â”€â”€ */
  }
              {activeTab === "content" && <div className={dividerCls}>
                  {
    /* Main Section Title row */
  }
                  <div className={rowHoverCls}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>Main Title</p>
                      <p className={`mt-0.5 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 9, fontWeight: 400 }}>Required</p>
                    </div>
                    <div className="flex-1">
                      <input
    value={mainContentTitle}
    onChange={(e) => setMainContentTitle(e.target.value)}
    maxLength={HEADLINE_MAX}
    placeholder="Main Section Title..."
    className={inputBase}
  />
                      <CharCount value={mainContentTitle} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                    </div>
                  </div>

                  {
    /* Main Content Text row */
  }
                  <div className={rowHoverCls}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>Main Body</p>
                      <p className={`mt-0.5 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 9, fontWeight: 400 }}>
                        Est. {Math.ceil(getTotalWordCount() / 200) || 1} min read
                      </p>
                    </div>
                    <div className="flex-1">
                      <textarea
    value={mainContentText}
    onChange={(e) => setMainContentText(e.target.value)}
    placeholder="Write your main content here..."
    rows={6}
    className={textareaBase}
  />
                      <CharCount value={mainContentText} min={MAIN_CONTENT_MIN} />
                    </div>
                  </div>
                </div>}

              {
    /* â”€â”€ Tab: Additional Sections â”€â”€ */
  }
              {activeTab === "sections" && <div className={dividerCls}>
                  {contentSections.map((section, i) => <div key={i} className={`px-6 py-5 transition-all duration-300 hover:bg-[var(--admin-bg-hover)]`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[var(--admin-accent)] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[9px] font-bold">{i + 1}</span>
                          </div>
                          <p className={`transition-colors text-[var(--admin-text-sub)]`} style={{ fontSize: 11, fontWeight: 500 }}>
                            Section {i + 1}
                          </p>
                        </div>
                        {contentSections.length > 1 && <button
    onClick={() => removeContentSection(i)}
    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-all"
    style={{ fontSize: 10, fontWeight: 500 }}
  >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>Section Title</p>
                          <input
    value={section.title}
    onChange={(e) => updateContentSection(i, "title", e.target.value)}
    maxLength={HEADLINE_MAX}
    placeholder="Section Title..."
    className={inputBase}
  />
                          <CharCount value={section.title} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                        </div>
                        <div>
                          <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>Section Content</p>
                          <textarea
    value={section.content}
    onChange={(e) => updateContentSection(i, "content", e.target.value)}
    placeholder="Section content..."
    rows={4}
    className={textareaBase}
  />
                          <CharCount value={section.content} min={MAIN_CONTENT_MIN} />
                        </div>
                      </div>
                    </div>)}
                </div>}

            </div>

            {
    /* Footer / Submit */
  }
            <div className={`rounded-xl border transition-all duration-500 bg-[var(--admin-surface)] border-[var(--admin-border)]`}>
              <div className={`flex items-center justify-between px-6 py-4 transition-all duration-500 bg-[var(--admin-bg-soft)] rounded-xl`}>
                <p className={`transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 11, fontWeight: 400 }}>
                  Review your entry before finalizing.
                </p>
                <button
    onClick={() => setShowConfirmModal(true)}
    disabled={!isFormValid() || isSubmitting}
    className={`px-8 py-2.5 rounded-lg transition-all ${isFormValid() && !isSubmitting ? "bg-[var(--admin-accent)] text-white hover:bg-[#6a0000] shadow-md" : "bg-[var(--admin-bg-soft)] text-[var(--admin-text-faint)] cursor-not-allowed"}`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                  {isSubmitting ? "Saving..." : "Save Blog Entry"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {
    /* â•â•â•â•â•â•â•â• AI Generate Modal â•â•â•â•â•â•â•â• */
  }
      {activeModal && modalCfg && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl w-full max-w-[460px] overflow-hidden border transition-all duration-500 bg-[var(--admin-surface)] border-[var(--admin-border)]`}>
            {
    /* Modal Header */
  }
            <div className={`flex items-center justify-between px-6 py-5 border-b transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--admin-accent)] flex items-center justify-center flex-shrink-0">
                  {activeModal === "image" ? <ImageIcon className="w-4 h-4 text-white" /> : activeModal === "full" ? <LayersIcon className="w-4 h-4 text-white" /> : <SparkleIcon className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className={`transition-colors text-[var(--admin-text)]`} style={{ fontSize: 13, fontWeight: 600 }}>
                    {modalCfg.title}
                  </p>
                  <p className={`mt-0.5 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 10, fontWeight: 400 }}>
                    Powered by Gemini AI
                  </p>
                </div>
              </div>
              <button
    onClick={closeModal}
    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-[var(--admin-text-faint)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]`}
  >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {
    /* AI Model switcher — text models for text modes, image models for the image mode */
  }
              {activeModal === "image" ? aiImageUsage && <div>
                  <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>AI Model</p>
                  <div className="relative" ref={imageModelMenuRef}>
                    <button
    type="button"
    onClick={() => setIsImageModelMenuOpen((v) => !v)}
    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border-2 transition-all bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)] hover:border-[var(--admin-border-strong)]`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-500" />
                        {aiImageUsage.models.find((m) => m.active)?.label || "Select model"}
                      </span>
                      <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isImageModelMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isImageModelMenuOpen && <div
    className={`absolute left-0 right-0 top-full mt-1 rounded-lg border shadow-lg overflow-hidden z-20 border-[var(--admin-border)] bg-[var(--admin-surface)]`}
  >
                        {aiImageUsage.models.map((m) => <button
    key={m.id}
    type="button"
    onClick={() => selectImageModel(m.id)}
    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--admin-bg-hover)]`}
  >
                            <span className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.active ? "bg-green-500" : "bg-[var(--admin-border-strong)]"}`} />
                              <span className={`${m.active ? "text-[var(--admin-text)]" : "text-[var(--admin-text-sub)]"}`} style={{ fontSize: 11, fontWeight: m.active ? 600 : 400 }}>
                                {m.label}
                              </span>
                            </span>
                            <span className={"text-[var(--admin-text-faint)]"} style={{ fontSize: 10, fontWeight: 400 }}>
                              {m.used}/{m.limit}
                            </span>
                          </button>)}
                      </div>}
                  </div>
                  <p className={`mt-1.5 text-[var(--admin-text-faint)]`} style={{ fontSize: 9, fontWeight: 400 }}>
                    Falls back to a free image generator automatically if the selected model has no quota.
                  </p>
                </div> : aiUsage && <div>
                  <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>AI Model</p>
                  <div className="relative" ref={modelMenuRef}>
                    <button
    type="button"
    onClick={() => setIsModelMenuOpen((v) => !v)}
    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border-2 transition-all bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)] hover:border-[var(--admin-border-strong)]`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-500" />
                        {aiUsage.models.find((m) => m.active)?.label || "Select model"}
                      </span>
                      <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isModelMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isModelMenuOpen && <div
    className={`absolute left-0 right-0 top-full mt-1 rounded-lg border shadow-lg overflow-hidden z-20 border-[var(--admin-border)] bg-[var(--admin-surface)]`}
  >
                        {aiUsage.models.map((m) => <button
    key={m.id}
    type="button"
    onClick={() => selectModel(m.id)}
    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--admin-bg-hover)]`}
  >
                            <span className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.active ? "bg-green-500" : "bg-[var(--admin-border-strong)]"}`} />
                              <span className={`${m.active ? "text-[var(--admin-text)]" : "text-[var(--admin-text-sub)]"}`} style={{ fontSize: 11, fontWeight: m.active ? 600 : 400 }}>
                                {m.label}
                              </span>
                            </span>
                            <span className={"text-[var(--admin-text-faint)]"} style={{ fontSize: 10, fontWeight: 400 }}>
                              {m.used}/{m.limit}
                            </span>
                          </button>)}
                      </div>}
                  </div>
                </div>}

              {
    /* Hint */
  }
              <div className={`flex items-start gap-2 px-3 py-3 rounded-lg border ${isdarkmode ? "bg-blue-500/10 text-blue-300 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-100"}`} style={{ fontSize: 11, fontWeight: 400 }}>
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {modalCfg.hint}
              </div>

              {
    /* Prompt */
  }
              <div>
                {activeModal === "full" && <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>Content Prompt</p>}
                <textarea
    value={modalPrompt}
    onChange={(e) => setModalPrompt(e.target.value)}
    placeholder={modalCfg.placeholder}
    rows={4}
    autoFocus
    className={textareaBase}
  />
              </div>

              {
    /* Image Prompt (Generate Full Blog only) */
  }
              {activeModal === "full" && <div>
                  <p className={`mb-2 ${labelCls}`} style={{ fontSize: 10, fontWeight: 500 }}>Image Prompt</p>
                  <textarea
    value={modalImagePrompt}
    onChange={(e) => setModalImagePrompt(e.target.value)}
    placeholder="e.g., Modern BPO office with startup team collaborating..."
    rows={2}
    className={textareaBase}
  />
                </div>}

              {
    /* Attach image */
  }
              {modalCfg.withImageAttach && <button
    onClick={() => modalImageRef.current?.click()}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${modalAttachedImage ? "border-green-400 text-green-500" : "border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-text)]"}`}
    style={{ fontSize: 10, fontWeight: 500 }}
  >
                  <PaperclipIcon />
                  {modalAttachedImage ? "\u2713 Image attached" : "Attach Image"}
                </button>}
            </div>

            {isGenerating && modalCfg && <div className={`mx-6 mb-4 px-6 py-6 rounded-xl border flex flex-col items-center justify-center gap-1 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}>
                <div className="relative w-14 h-14 mb-2">
                  <svg className="w-14 h-14 animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 56 56" fill="none">
                    <circle cx="28" cy="28" r="24" stroke={"var(--admin-border)"} strokeWidth="4" />
                    <circle cx="28" cy="28" r="24" stroke="var(--admin-accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="110" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <SparkleIcon className={`w-5 h-5 text-[var(--admin-text-sub)]`} />
                  </div>
                </div>
                <p className={`text-[var(--admin-text)]`} style={{ fontSize: 14, fontWeight: 600 }}>
                  {modalCfg.steps[generationStepIndex] || "Generating..."}
                </p>
                <p className={`mb-3 text-[var(--admin-text-faint)]`} style={{ fontSize: 11, fontWeight: 400 }}>
                  This usually takes 30-60 seconds.
                </p>
                <div className="flex items-center w-full">
                  {modalCfg.steps.map((step, i) => <React.Fragment key={step}>
                      {i > 0 && <div className={`flex-1 h-px ${i <= generationStepIndex ? "bg-[var(--admin-accent)]" : "bg-[var(--admin-border-strong)]"}`} />}
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div
    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${i < generationStepIndex ? "bg-[var(--admin-accent)]" : i === generationStepIndex ? `border-2 border-[var(--admin-accent)] bg-[var(--admin-bg-soft)]` : "bg-[var(--admin-border-strong)]"}`}
  >
                          {i < generationStepIndex ? <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg> : i === generationStepIndex ? <div className="w-2 h-2 rounded-full bg-[var(--admin-accent)]" /> : null}
                        </div>
                        <span className={`text-center ${i <= generationStepIndex ? "text-[var(--admin-text-sub)]" : "text-[var(--admin-text-faint)]"}`} style={{ fontSize: 9, fontWeight: i === generationStepIndex ? 600 : 400, maxWidth: 72 }}>
                          {step}
                        </span>
                      </div>
                    </React.Fragment>)}
                </div>
              </div>}
            {
    /* Actions */
  }
            <div className={`flex gap-3 px-6 py-4 border-t transition-all duration-500 border-[var(--admin-border)]`}>
              <button
    onClick={closeModal}
    disabled={isGenerating}
    className={`flex-1 py-2.5 rounded-lg transition-all border-2 border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                Cancel
              </button>
              <button
    onClick={handleGenerate}
    disabled={isGenerating || !modalPrompt.trim() || (activeModal === "full" && !modalImagePrompt.trim())}
    className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${isGenerating || !modalPrompt.trim() || (activeModal === "full" && !modalImagePrompt.trim()) ? "bg-[var(--admin-accent)]/40 text-white cursor-not-allowed" : "bg-[var(--admin-accent)] text-white hover:bg-[#6a0000]"}`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                {isGenerating ? <><Spinner /> Generating...</> : <><SparkleIcon className="w-3.5 h-3.5" /> Generate</>}
              </button>
            </div>
          </div>
        </div>}

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
    className="flex-1 py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[#6a0000] transition-all disabled:opacity-50"
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
    className="w-full py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[#6a0000] transition-all"
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
    className="w-full py-2.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[#6a0000] transition-all"
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                Close
              </button>
            </div>
          </div>
        </div>}
    </>;
}
export {
  AddBlogs as default
};
