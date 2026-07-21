
import { useState, useRef } from "react";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
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
function EditBlogs({ blog, onClose, onSave }) {
  const { isdarkmode } = useDarkMode();
  const fileRef = useRef(null);
  const actualFileRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");
  const [openSection, setOpenSection] = useState("details");
  const toggleSection = (key) => {
    setOpenSection((prev) => prev === key ? null : key);
  };
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
      if (mainContentTitle.trim() || mainContentText.trim()) {
        allMainContent.push({ title: mainContentTitle.trim(), content: mainContentText.trim() });
      }
      contentSections.forEach((s) => {
        if (s.title.trim() || s.content.trim()) allMainContent.push({ title: s.title.trim(), content: s.content.trim() });
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
        const response = await fetch(`https://telexph-admin.onrender.com/api/blogs/${blog._id}`, { method: "PATCH", credentials: "include", body: formData });
        if (!response.ok) {
          const e = await response.json();
          throw new Error(e.error || "Failed to update blog");
        }
      } else {
        const payload = { title: title.trim(), author: authorName.trim(), mainCategory, subcategory, shortDescription: shortDescription.trim(), mainContent: allMainContent, status };
        if (status === "scheduled" && scheduledDate) payload.scheduledDate = new Date(scheduledDate).toISOString();
        const response = await fetch(`https://telexph-admin.onrender.com/api/blogs/${blog._id}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
  const inputBase = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none text-[12px] font-normal ${isdarkmode ? "bg-[#202020] border-white/10 text-gray-300 placeholder-gray-600 focus:border-white/30" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-400"}`;
  const selectBase = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none text-[12px] cursor-pointer ${isdarkmode ? "bg-[#202020] border-white/10 text-gray-300 focus:border-white/30" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-gray-400"}`;
  const textareaBase = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none text-[12px] font-normal resize-none leading-relaxed ${isdarkmode ? "bg-[#202020] border-white/10 text-gray-300 placeholder-gray-600 focus:border-white/30" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-400"}`;
  const sectionCard = `rounded-xl border transition-all duration-500 overflow-hidden ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`;
  const labelCls = `uppercase tracking-widest transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`;
  const AccordionHeader = ({
    sectionKey,
    title: headerTitle,
    subtitle,
    rightSlot,
    labelStyle = false
  }) => {
    const isOpen = openSection === sectionKey;
    return <div
      onClick={() => toggleSection(sectionKey)}
      className={`flex items-center justify-between px-6 py-4 border-b cursor-pointer select-none transition-all duration-300 ${isdarkmode ? `border-white/5 ${isOpen ? "bg-[#202020]" : "bg-[#1a1a1a] hover:bg-[#202020]"}` : `border-gray-200 ${isOpen ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}`}
    >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            {labelStyle ? <>
                <p className={`uppercase tracking-widest transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 10, fontWeight: 500 }}>
                  {headerTitle}
                </p>
                <p className={`mt-0.5 transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 11, fontWeight: 400 }}>
                  {subtitle}
                </p>
              </> : <>
                <p className={`transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`} style={{ fontSize: 13, fontWeight: 600 }}>
                  {headerTitle}
                </p>
                <p className={`mt-0.5 transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 11, fontWeight: 400 }}>
                  {subtitle}
                </p>
              </>}
          </div>
          {rightSlot && <div onClick={(e) => e.stopPropagation()}>
              {rightSlot}
            </div>}
        </div>
        {
      /* Chevron */
    }
        <svg
      className={`w-4 h-4 ml-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"} ${isdarkmode ? "text-gray-500" : "text-gray-400"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>;
  };
  const CharCount = ({ value, max, min }) => {
    const trimmed = value.trim();
    const tooShort = trimmed.length > 0 && trimmed.length < min;
    const tooLong = max !== void 0 && trimmed.length > max;
    return <div className="flex justify-between items-center mt-1 px-1">
        <span className={`text-[9px] ${tooShort || tooLong ? "text-red-500" : "text-transparent select-none"}`}>
          {tooShort ? `Min ${min} chars required.` : tooLong ? `Max ${max} chars allowed.` : "."}
        </span>
        <span className={`text-[9px] ${tooLong ? "text-red-500" : isdarkmode ? "text-white/30" : "text-black/30"}`}>
          {max !== void 0 ? `${trimmed.length}/${max}` : `${trimmed.length} chars`}
        </span>
      </div>;
  };
  return <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      ` }} />

      <div className={`flex flex-col items-start justify-start p-8 space-y-8 min-h-screen transition-colors duration-500 ${isdarkmode ? "bg-[#0f0f0f]" : "bg-[#f8f9fa]"}`}>

        {
    /* â”€â”€ Page Header â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto">
          <div className={`flex items-center justify-between pb-6 border-b transition-colors duration-500 ${isdarkmode ? "border-white/5" : "border-gray-200"}`}>
            <div className="flex items-center gap-4">
              <button
    onClick={onClose}
    className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 transition-all ${isdarkmode ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
  >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h2
    className={`tracking-tight transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`}
    style={{ fontSize: 18, fontWeight: 500, margin: 0 }}
  >
                  Edit Blog Post
                </h2>
                <p
    className={`mt-1 transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`}
    style={{ fontSize: 12, fontWeight: 400, margin: "4px 0 0" }}
  >
                  Update your blog post details below
                </p>
              </div>
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
    /* Cover Image */
  }
            <div className={sectionCard}>
              <div className={`flex items-center justify-between px-6 py-4 border-b transition-all duration-500 ${isdarkmode ? "bg-[#202020] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <div>
                  <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>Featured Image</p>
                  <p className={`mt-0.5 transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 11, fontWeight: 400 }}>
                    Upload a new cover or keep existing
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleFileChange} className="hidden" />

                <div
    onClick={() => fileRef.current?.click()}
    className={`relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all ${imageError ? "border-red-400 bg-red-50/5" : selectedImage ? "border-[#800000]/40" : isdarkmode ? "border-white/10 hover:border-white/20 bg-[#202020]" : "border-gray-200 hover:border-gray-300 bg-gray-50"}`}
    style={{ aspectRatio: "16/9" }}
  >
                  {isCompressing ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5 text-[#800000]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span className={`text-[10px] ${isdarkmode ? "text-gray-400" : "text-gray-500"}`}>Compressing...</span>
                    </div> : selectedImage ? <>
                      <img src={selectedImage} alt="Cover preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[11px] font-medium">Click to change</span>
                      </div>
                    </> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${isdarkmode ? "bg-[#2a2a2a]" : "bg-gray-100"}`}>
                        <svg className={`w-5 h-5 ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className={`text-[11px] font-medium ${isdarkmode ? "text-gray-300" : "text-gray-600"}`}>Drop or click to upload</p>
                        <p className={`text-[10px] mt-0.5 ${isdarkmode ? "text-gray-600" : "text-gray-400"}`}>JPG, PNG, WEBP</p>
                      </div>
                    </div>}
                </div>
                {imageError && <p className="text-red-500 text-[10px]">{imageError}</p>}

                <button
    onClick={() => fileRef.current?.click()}
    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all ${isdarkmode ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Browse File
                </button>
              </div>
            </div>

            {
    /* Publishing Options â€” Accordion */
  }
            <div className={sectionCard}>
              <AccordionHeader
    sectionKey="publishing"
    title="Publishing Options"
    subtitle="Set status and schedule"
    labelStyle
  />
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === "publishing" ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-6 space-y-4">
                  <div>
                    <p className={labelCls} style={{ fontSize: 10, fontWeight: 500, marginBottom: 8 }}>Status</p>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectBase}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                  {status === "scheduled" && <div>
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500, marginBottom: 8 }}>Schedule Date</p>
                      <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={inputBase} />
                    </div>}
                </div>
              </div>
            </div>

            {
    /* Categories â€” Accordion */
  }
            <div className={sectionCard}>
              <AccordionHeader
    sectionKey="categories"
    title="Categories"
    subtitle="Assign topic and subcategory"
    labelStyle
  />
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === "categories" ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-6 space-y-4">
                  <div>
                    <p className={labelCls} style={{ fontSize: 10, fontWeight: 500, marginBottom: 8 }}>Main Category</p>
                    <select value={mainCategory} onChange={(e) => handleMainCategoryChange(e.target.value)} className={selectBase}>
                      <option value="">Select Category</option>
                      {Object.values(MAIN_CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {mainCategory && <div>
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500, marginBottom: 8 }}>Subcategory</p>
                      <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={selectBase}>
                        <option value="">Select Subcategory</option>
                        {getAvailableSubcategories().map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
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
    /* â”€â”€ Blog Details (Accordion) â”€â”€ */
  }
            <div className={sectionCard}>
              <AccordionHeader
    sectionKey="details"
    title="Blog Details"
    subtitle="Title, author, and description"
  />

              {
    /* Collapsible body */
  }
              <div
    className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === "details" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
  >
                <div className={`divide-y transition-all duration-500 ${isdarkmode ? "divide-white/5" : "divide-gray-100"}`}>

                  {
    /* Title row */
  }
                  <div className={`flex items-start gap-4 px-6 py-4 transition-all duration-300 ${isdarkmode ? "hover:bg-[#202020]" : "hover:bg-gray-50"}`}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>
                        Title <span className="text-[#800000]">â€¢</span>
                      </p>
                    </div>
                    <div className="flex-1">
                      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={HEADLINE_MAX} placeholder="Enter blog headline..." className={inputBase} />
                      <CharCount value={title} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                    </div>
                  </div>

                  {
    /* Author row */
  }
                  <div className={`flex items-start gap-4 px-6 py-4 transition-all duration-300 ${isdarkmode ? "hover:bg-[#202020]" : "hover:bg-gray-50"}`}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>
                        Author <span className="text-[#800000]">â€¢</span>
                      </p>
                    </div>
                    <div className="flex-1">
                      <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} maxLength={HEADLINE_MAX} placeholder="Enter author name..." className={inputBase} />
                      <CharCount value={authorName} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                    </div>
                  </div>

                  {
    /* Short Description row */
  }
                  <div className={`flex items-start gap-4 px-6 py-4 transition-all duration-300 ${isdarkmode ? "hover:bg-[#202020]" : "hover:bg-gray-50"}`}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>
                        Description <span className="text-[#800000]">â€¢</span>
                      </p>
                    </div>
                    <div className="flex-1">
                      <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} maxLength={SHORT_DESC_MAX} placeholder="Brief summary for listing card..." className={inputBase} />
                      <CharCount value={shortDescription} min={SHORT_DESC_MIN} max={SHORT_DESC_MAX} />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {
    /* â”€â”€ Content Body (Accordion) â”€â”€ */
  }
            <div className={sectionCard}>
              <AccordionHeader
    sectionKey="content"
    title="Content Body"
    subtitle="Main article content and sections"
  />

              <div
    className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === "content" ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
  >
                <div className={`divide-y transition-all duration-500 ${isdarkmode ? "divide-white/5" : "divide-gray-100"}`}>

                  {
    /* Main Title row */
  }
                  <div className={`flex items-start gap-4 px-6 py-4 transition-all duration-300 ${isdarkmode ? "hover:bg-[#202020]" : "hover:bg-gray-50"}`}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>Main Title</p>
                      <p className={`mt-0.5 transition-colors ${isdarkmode ? "text-gray-600" : "text-gray-400"}`} style={{ fontSize: 9, fontWeight: 400 }}>Required</p>
                    </div>
                    <div className="flex-1">
                      <input value={mainContentTitle} onChange={(e) => setMainContentTitle(e.target.value)} maxLength={HEADLINE_MAX} placeholder="Main Section Title..." className={inputBase} />
                      <CharCount value={mainContentTitle} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                    </div>
                  </div>

                  {
    /* Main Body row */
  }
                  <div className={`flex items-start gap-4 px-6 py-4 transition-all duration-300 ${isdarkmode ? "hover:bg-[#202020]" : "hover:bg-gray-50"}`}>
                    <div className="w-32 flex-shrink-0 pt-3">
                      <p className={labelCls} style={{ fontSize: 10, fontWeight: 500 }}>Main Body</p>
                      <p className={`mt-0.5 transition-colors ${isdarkmode ? "text-gray-600" : "text-gray-400"}`} style={{ fontSize: 9, fontWeight: 400 }}>
                        Est. {Math.ceil(getTotalWordCount() / 200) || 1} min read
                      </p>
                    </div>
                    <div className="flex-1">
                      <textarea value={mainContentText} onChange={(e) => setMainContentText(e.target.value)} placeholder="Write your main content here..." rows={7} className={textareaBase} />
                      <CharCount value={mainContentText} min={MAIN_CONTENT_MIN} />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {
    /* â”€â”€ Additional Sections (Accordion) â”€â”€ */
  }
            <div className={sectionCard}>
              <AccordionHeader
    sectionKey="additional"
    title="Additional Sections"
    subtitle="Optional extra content blocks"
    rightSlot={<button
      onClick={addContentSection}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${isdarkmode ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
      style={{ fontSize: 11, fontWeight: 500 }}
    >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Section
                  </button>}
  />

              <div
    className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === "additional" ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}
  >
                <div className={`divide-y transition-all duration-500 ${isdarkmode ? "divide-white/5" : "divide-gray-100"}`}>
                  {contentSections.map((section, i) => <div key={i} className={`px-6 py-5 transition-all duration-300 ${isdarkmode ? "hover:bg-[#202020]" : "hover:bg-gray-50"}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#800000] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[9px] font-bold">{i + 1}</span>
                          </div>
                          <p className={`transition-colors ${isdarkmode ? "text-gray-400" : "text-gray-600"}`} style={{ fontSize: 11, fontWeight: 500 }}>
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
                </div>
              </div>
            </div>

            {
    /* Footer */
  }
            <div className={`rounded-xl border transition-all duration-500 ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`}>
              <div className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-500 ${isdarkmode ? "bg-[#202020]" : "bg-gray-50"}`}>
                <p className={`transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 11, fontWeight: 400 }}>
                  Review your entry before saving.
                </p>
                <div className="flex items-center gap-3">
                  <button
    onClick={onClose}
    className={`px-5 py-2.5 rounded-lg border-2 transition-all ${isdarkmode ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-white"}`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                    Cancel
                  </button>
                  <button
    onClick={() => setShowConfirmModal(true)}
    disabled={!isFormValid() || isSubmitting}
    className={`px-8 py-2.5 rounded-lg transition-all ${isFormValid() && !isSubmitting ? "bg-[#800000] text-white hover:bg-[#6a0000] shadow-md" : isdarkmode ? "bg-[#2a2a2a] text-gray-600 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
    style={{ fontSize: 11, fontWeight: 500 }}
  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {
    /* â•â•â•â•â•â•â•â• Confirm Modal â•â•â•â•â•â•â•â• */
  }
      {showConfirmModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl w-full max-w-md overflow-hidden border transition-all duration-500 ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`}>
            <div className={`px-6 py-5 border-b transition-all duration-500 ${isdarkmode ? "bg-[#202020] border-white/5" : "bg-gray-50 border-gray-200"}`}>
              <p className={`transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`} style={{ fontSize: 13, fontWeight: 600 }}>Confirm Changes</p>
              <p className={`mt-0.5 transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 11, fontWeight: 400 }}>Are you sure you want to save changes to this blog post?</p>
            </div>
            <div className="flex gap-3 p-6">
              <button onClick={() => setShowConfirmModal(false)} disabled={isSubmitting} className={`flex-1 py-2.5 rounded-lg border-2 transition-all ${isdarkmode ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`} style={{ fontSize: 11, fontWeight: 500 }}>Cancel</button>
              <button onClick={handleFinalConfirm} disabled={isSubmitting} className="flex-1 py-2.5 rounded-lg bg-[#800000] text-white hover:bg-[#6a0000] transition-all disabled:opacity-50" style={{ fontSize: 11, fontWeight: 500 }}>{isSubmitting ? "Saving..." : "Confirm"}</button>
            </div>
          </div>
        </div>}

      {
    /* â•â•â•â•â•â•â•â• Success Modal â•â•â•â•â•â•â•â• */
  }
      {showSuccessModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl w-full max-w-md overflow-hidden border transition-all duration-500 ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`}>
            <div className={`px-6 py-5 border-b transition-all duration-500 ${isdarkmode ? "bg-[#202020] border-white/5" : "bg-gray-50 border-gray-200"}`}>
              <p className={`transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`} style={{ fontSize: 13, fontWeight: 600 }}>Success!</p>
              <p className={`mt-0.5 transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 11, fontWeight: 400 }}>Your blog post has been updated successfully.</p>
            </div>
            <div className="p-6">
              <button onClick={handleSuccessClose} className="w-full py-2.5 rounded-lg bg-[#800000] text-white hover:bg-[#6a0000] transition-all" style={{ fontSize: 11, fontWeight: 500 }}>Back to Blog List</button>
            </div>
          </div>
        </div>}

      {
    /* â•â•â•â•â•â•â•â• Error Modal â•â•â•â•â•â•â•â• */
  }
      {showErrorModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl w-full max-w-md overflow-hidden border transition-all duration-500 ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`}>
            <div className={`px-6 py-5 border-b transition-all duration-500 ${isdarkmode ? "bg-[#202020] border-white/5" : "bg-gray-50 border-gray-200"}`}>
              <p className={`transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`} style={{ fontSize: 13, fontWeight: 600 }}>Error</p>
              <p className={`mt-0.5 transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 11, fontWeight: 400 }}>{errorMessage || "Something went wrong. Please try again."}</p>
            </div>
            <div className="p-6">
              <button onClick={() => setShowErrorModal(false)} className="w-full py-2.5 rounded-lg bg-[#800000] text-white hover:bg-[#6a0000] transition-all" style={{ fontSize: 11, fontWeight: 500 }}>Close</button>
            </div>
          </div>
        </div>}
    </>;
}
export {
  EditBlogs as default
};
