'use client'

import React, { useState, useRef } from 'react'
import { useDarkMode } from '../../layout'

// ─── Constants ────────────────────────────────────────────────────────────────
const MAIN_CATEGORIES = {
  MAIN_SERVICE: "Main Service Categories",
  INDUSTRY_INSIGHTS: "Industry-Specific Insights",
  BUSINESS_GROWTH: "Business Growth & Strategy",
  COMPANY_CULTURE: "Company Culture & Updates"
} as const;

const SUBCATEGORIES: Record<string, string[]> = {
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
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

interface ContentSection { title: string; content: string; }
type ModalType = 'image' | 'title' | 'content' | 'full' | null;

// ─── Micro Components ─────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const SparkleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ImageIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LayersIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const PaperclipIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

// ─── AI Helpers (Gemini) ──────────────────────────────────────────────────────

/**
 * Calls the Gemini 2.0 Flash model for text generation.
 * Uses NEXT_PUBLIC_GEMINI_API_KEY from your .env.local
 */
async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
      }),
    }
  );
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gemini API error');
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Generates a blog cover image using Pollinations.ai (100% free, no API key needed).
 */
async function generatePollinationsImage(prompt: string): Promise<{ dataUrl: string; file: File }> {
  const encoded = encodeURIComponent(`${prompt}, professional business blog cover, clean modern design`);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&seed=${Date.now()}&nologo=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Image generation failed');
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxW = 800;
      let w = img.width, h = img.height;
      if (w > maxW) { h = (maxW / w) * h; w = maxW; }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(blobUrl); return reject(new Error('Canvas error')); }
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      canvas.toBlob(b => {
        URL.revokeObjectURL(blobUrl);
        if (!b) return reject(new Error('Blob error'));
        resolve({ dataUrl, file: new File([b], 'ai-generated.jpg', { type: 'image/jpeg' }) });
      }, 'image/jpeg', 0.7);
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error('Image load error')); };
    img.src = blobUrl;
  });
}

// ─── Modal Config ─────────────────────────────────────────────────────────────
interface AIModalConfig {
  title: string;
  hint: string;
  placeholder: string;
  withImageAttach: boolean;
}
const MODAL_CONFIGS: Record<NonNullable<ModalType>, AIModalConfig> = {
  image:   { title: 'Generate AI Image',       hint: 'Enter a topic or description to generate a professional cover image.',                              placeholder: 'e.g., Customer support team in a modern office...', withImageAttach: false },
  title:   { title: 'Generate Title',           hint: 'Enter a topic (or attach an image) to generate a catchy title.',                                   placeholder: 'e.g., Best outsourcing practices for e-commerce...', withImageAttach: true  },
  content: { title: 'Write Content with AI',    hint: 'Describe what you want to write about and AI will draft the full content body.',                   placeholder: 'e.g., Write about how BPO helps scale e-commerce businesses...', withImageAttach: true  },
  full:    { title: 'Generate Full Blog',       hint: 'Enter a topic and AI will generate the title, description, and all content sections for you.',    placeholder: 'e.g., How TelexPH helps startups reduce operational costs...', withImageAttach: false },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AddBlogs() {
  const { isdarkmode } = useDarkMode();

  const fileRef = useRef<HTMLInputElement>(null);
  const actualFileRef = useRef<File | null>(null);
  const modalImageRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [mainContentTitle, setMainContentTitle] = useState('');
  const [mainContentText, setMainContentText] = useState('');
  const [contentSections, setContentSections] = useState<ContentSection[]>([{ title: '', content: '' }]);
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // UI state
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // AI modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalPrompt, setModalPrompt] = useState('');
  const [modalAttachedImage, setModalAttachedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ─── Style helpers ────────────────────────────────────────────────────────
  const cardShadow = { boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08)' };
  const dm = (dark: string, light: string) => isdarkmode ? dark : light;
  const labelCls = `text-[9px] font-bold tracking-widest uppercase ${dm('text-gray-400', 'text-gray-500')}`;
  const inputCls = `w-full bg-transparent outline-none text-[11px] ${dm('text-white placeholder-gray-600', 'text-gray-800 placeholder-gray-400')}`;
  const fieldBorder = `border-b ${dm('border-white/10', 'border-gray-200')}`;
  const purpleBtn = 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] text-white font-semibold transition-all bg-[#800000] hover:bg-[#6a0000] shadow-sm';
  const cyanBtn = 'flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] text-white font-semibold transition-all bg-[#800000] hover:bg-[#6a0000] shadow-sm';

  // ─── CharCount ────────────────────────────────────────────────────────────
  const CharCount = ({ value, max, min }: { value: string; max?: number; min: number }) => {
    const trimmed = value.trim();
    const tooShort = trimmed.length > 0 && trimmed.length < min;
    const tooLong = max !== undefined && trimmed.length > max;
    return (
      <div className="flex justify-between items-center mt-0.5 px-1">
        <span className={`text-[8px] ${(tooShort || tooLong) ? 'text-red-500' : 'text-transparent select-none'}`}>
          {tooShort ? `Min ${min} chars required.` : tooLong ? `Max ${max} chars allowed.` : '.'}
        </span>
        <span className={`text-[8px] ${tooLong ? 'text-red-500' : dm('text-white/30', 'text-black/30')}`}>
          {max !== undefined ? `${trimmed.length}/${max}` : `${trimmed.length} chars`}
        </span>
      </div>
    );
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getTotalWordCount = () => {
    let n = (mainContentTitle + ' ' + mainContentText).split(/\s+/).filter(Boolean).length;
    contentSections.forEach(s => { n += (s.title + ' ' + s.content).split(/\s+/).filter(Boolean).length; });
    return n;
  };

  const isFormValid = (): boolean => {
    const t = title.trim(), a = authorName.trim(), d = shortDescription.trim();
    const mt = mainContentTitle.trim(), mb = mainContentText.trim();
    return !!(
      t.length >= HEADLINE_MIN && t.length <= HEADLINE_MAX &&
      a.length >= HEADLINE_MIN && a.length <= HEADLINE_MAX &&
      mainCategory && subcategory &&
      d.length >= SHORT_DESC_MIN && d.length <= SHORT_DESC_MAX &&
      (mt.length === 0 || (mt.length >= HEADLINE_MIN && mt.length <= HEADLINE_MAX)) &&
      mb.length >= MAIN_CONTENT_MIN &&
      (mt.length > 0 || mb.length > 0) &&
      selectedImage && !imageError &&
      contentSections.every(s => {
        const st = s.title.trim(), sc = s.content.trim();
        if (!st && !sc) return true;
        return (st.length === 0 || (st.length >= HEADLINE_MIN && st.length <= HEADLINE_MAX)) &&
               (sc.length === 0 || sc.length >= MAIN_CONTENT_MIN);
      }) &&
      (status !== 'scheduled' || scheduledDate)
    );
  };

  // ─── Image Compress ───────────────────────────────────────────────────────
  const compressAndSetImage = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Invalid file type. Only PNG, JPG, JPEG, and WebP are allowed.');
      return;
    }
    setImageError('');
    actualFileRef.current = file;
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 800;
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
        canvas.width = w; canvas.height = h;
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          setSelectedImage(canvas.toDataURL('image/jpeg', 0.7));
          setIsCompressing(false);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) compressAndSetImage(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleModalImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setModalAttachedImage(reader.result as string);
    reader.readAsDataURL(file);
    if (modalImageRef.current) modalImageRef.current.value = '';
  };

  // ─── Modal ────────────────────────────────────────────────────────────────
  const openModal = (type: ModalType) => { setModalPrompt(''); setModalAttachedImage(null); setActiveModal(type); };
  const closeModal = () => { setActiveModal(null); setModalPrompt(''); setModalAttachedImage(null); };

  const handleGenerate = async () => {
    if (!modalPrompt.trim()) return;
    setIsGenerating(true);
    try {
      if (activeModal === 'image') {
        // ── Generate image via Pollinations.ai (free, no quota) ───────────
        const { dataUrl, file } = await generatePollinationsImage(modalPrompt);
        setSelectedImage(dataUrl);
        actualFileRef.current = file;
        closeModal();
      }
      else if (activeModal === 'title') {
        // ── Generate title via Gemini ─────────────────────────────────────
        const raw = await callGemini(
          'You are a professional blog title writer for TelexPH, a BPO company. Return ONLY the title text, nothing else. Max 40 characters.',
          `Write a catchy, professional blog title about: ${modalPrompt}`
        );
        setTitle(raw.replace(/^["']|["']$/g, '').trim().slice(0, HEADLINE_MAX));
        closeModal();
      }
      else if (activeModal === 'content') {
        // ── Generate content sections via Gemini ──────────────────────────
        const raw = await callGemini(
          'You are a professional blog content writer for TelexPH, a BPO company. Return ONLY a valid JSON object, no markdown, no backticks.',
          `Write blog content about: ${modalPrompt}
Return ONLY JSON:
{
  "mainContentTitle": "Title (5-40 chars)",
  "mainContentText": "Main body, 150+ words",
  "additionalSections": [
    { "title": "Section title (5-40 chars)", "content": "Section body 80+ words" },
    { "title": "Section title (5-40 chars)", "content": "Section body 80+ words" }
  ]
}`
        );
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        if (parsed.mainContentTitle) setMainContentTitle(parsed.mainContentTitle.slice(0, HEADLINE_MAX));
        if (parsed.mainContentText) setMainContentText(parsed.mainContentText);
        if (Array.isArray(parsed.additionalSections) && parsed.additionalSections.length > 0) {
          setContentSections(parsed.additionalSections.map((s: any) => ({
            title: (s.title || '').slice(0, HEADLINE_MAX),
            content: s.content || '',
          })));
        }
        closeModal();
      }
      else if (activeModal === 'full') {
        // ── Generate full blog via Gemini ─────────────────────────────────
        const raw = await callGemini(
          'You are a professional blog writer for TelexPH, a BPO company. Return ONLY a valid JSON object, no markdown, no backticks.',
          `Write a complete blog post about: ${modalPrompt}
Return ONLY JSON:
{
  "title": "Blog headline (5-40 chars)",
  "shortDescription": "Summary under 55 chars",
  "mainContentTitle": "Main section title (5-40 chars)",
  "mainContentText": "Main body, 150+ words",
  "additionalSections": [
    { "title": "Section title (5-40 chars)", "content": "Section body 80+ words" },
    { "title": "Section title (5-40 chars)", "content": "Section body 80+ words" }
  ]
}`
        );
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
        if (parsed.title) setTitle(parsed.title.slice(0, HEADLINE_MAX));
        if (parsed.shortDescription) setShortDescription(parsed.shortDescription.slice(0, SHORT_DESC_MAX));
        if (parsed.mainContentTitle) setMainContentTitle(parsed.mainContentTitle.slice(0, HEADLINE_MAX));
        if (parsed.mainContentText) setMainContentText(parsed.mainContentText);
        if (Array.isArray(parsed.additionalSections) && parsed.additionalSections.length > 0) {
          setContentSections(parsed.additionalSections.map((s: any) => ({
            title: (s.title || '').slice(0, HEADLINE_MAX),
            content: s.content || '',
          })));
        }
        closeModal();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Generation failed. Please try again.');
      closeModal();
      setShowErrorModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleFinalConfirm = async () => {
    if (!actualFileRef.current) {
      setErrorMessage('Please upload or generate a cover image.');
      setShowConfirmModal(false); setShowErrorModal(true); return;
    }
    setIsSubmitting(true);
    try {
      const allMainContent: { title: string; content: string }[] = [];
      if (mainContentTitle.trim() || mainContentText.trim()) {
        allMainContent.push({ title: mainContentTitle.trim(), content: mainContentText.trim() });
      }
      contentSections.forEach(s => {
        if (s.title.trim() || s.content.trim()) allMainContent.push({ title: s.title.trim(), content: s.content.trim() });
      });
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('author', authorName.trim());
      formData.append('mainCategory', mainCategory);
      formData.append('subcategory', subcategory);
      formData.append('shortDescription', shortDescription.trim());
      formData.append('mainContent', JSON.stringify(allMainContent));
      formData.append('status', status);
      formData.append('picture', actualFileRef.current);
      if (status === 'scheduled' && scheduledDate) {
        formData.append('scheduledDate', new Date(scheduledDate).toISOString());
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, { method: 'POST', credentials: 'include', body: formData });
      if (!response.ok) { const e = await response.json(); throw new Error(e.error || 'Failed to create blog'); }
      setShowConfirmModal(false); setShowSuccessModal(true);
      setTitle(''); setAuthorName(''); setMainCategory(''); setSubcategory('');
      setShortDescription(''); setMainContentTitle(''); setMainContentText('');
      setContentSections([{ title: '', content: '' }]);
      setStatus('draft'); setScheduledDate(''); setSelectedImage(null); setImageError('');
      actualFileRef.current = null;
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create blog');
      setShowConfirmModal(false); setShowErrorModal(true);
    } finally { setIsSubmitting(false); }
  };

  // ─── Section helpers ──────────────────────────────────────────────────────
  const addContentSection = () => setContentSections([...contentSections, { title: '', content: '' }]);
  const removeContentSection = (i: number) => { if (contentSections.length > 1) setContentSections(contentSections.filter((_, idx) => idx !== i)); };
  const updateContentSection = (i: number, field: 'title' | 'content', val: string) => { const u = [...contentSections]; u[i][field] = val; setContentSections(u); };
  const handleMainCategoryChange = (cat: string) => { setMainCategory(cat); setSubcategory(''); };
  const getAvailableSubcategories = () => mainCategory ? SUBCATEGORIES[mainCategory] || [] : [];

  const modalCfg = activeModal ? MODAL_CONFIGS[activeModal] : null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${dm('bg-[#0f0f0f]', 'bg-[#f4f5f7]')} transition-colors duration-500`}>
      <div className="max-w-[95rem] mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`bold-text ${dm('text-white', 'text-gray-900')}`}>Create New Blog Post</h1>
          <p className={`mt-1 text-[11px] ${dm('text-gray-400', 'text-gray-500')}`}>Share your insights and expertise with the community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Left Column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Blog Cover Image Card */}
            <div style={cardShadow} className={`${dm('bg-[#1a1a1a] border-white/10', 'bg-white border-gray-200')} rounded-2xl border p-5`}>
              <p className={`text-[9px] font-bold tracking-widest uppercase mb-3 ${dm('text-[#800000]', 'text-[#800000]')}`}>Blog Cover Image</p>

              <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleFileChange} className="hidden" />
              <input ref={modalImageRef} type="file" accept="image/*" onChange={handleModalImageAttach} className="hidden" />

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all ${
                  imageError ? 'border-red-400 bg-red-50/5'
                  : selectedImage ? 'border-[#800000]/40'
                  : dm('border-white/10 hover:border-white/20 bg-[#252525]', 'border-gray-200 hover:border-gray-300 bg-gray-50')
                }`}
                style={{ aspectRatio: '16/9' }}
              >
                {isCompressing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Spinner />
                    <span className={`text-[10px] ${dm('text-gray-400', 'text-gray-500')}`}>Compressing...</span>
                  </div>
                ) : selectedImage ? (
                  <>
                    <img src={selectedImage} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[11px] font-medium">Click to change</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dm('bg-[#2a2a2a]', 'bg-gray-100')}`}>
                      <svg className={`w-6 h-6 ${dm('text-gray-500', 'text-gray-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className={`text-[11px] font-semibold ${dm('text-gray-300', 'text-gray-700')}`}>Drop or Click to Upload</p>
                      <p className={`text-[9px] mt-0.5 ${dm('text-gray-600', 'text-gray-400')}`}>JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
              {imageError && <p className="text-red-500 text-[9px] mt-1.5">{imageError}</p>}

              {/* Image action buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => fileRef.current?.click()}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-semibold transition-all ${dm('bg-[#2a2a2a] text-white hover:bg-[#333]', 'bg-gray-900 text-white hover:bg-gray-800')}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M21 21l-4-4"/>
                  </svg>
                  Browse
                </button>
                <button
                  onClick={() => openModal('image')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-semibold text-white bg-[#800000] hover:bg-[#6a0000] transition-all`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Generate AI Image
                </button>
              </div>
            </div>

            {/* Publishing Options */}
            <div style={cardShadow} className={`${dm('bg-[#1a1a1a] border-white/10', 'bg-white border-gray-200')} rounded-2xl border p-5`}>
              <p className={`text-[9px] font-bold tracking-widest uppercase mb-4 ${dm('text-[#800000]', 'text-[#800000]')}`}>Publishing Options</p>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)}
                    className={`mt-1.5 w-full p-2.5 text-[10px] rounded-xl border ${dm('bg-[#252525] text-white border-white/10', 'bg-gray-50 text-gray-800 border-gray-200')}`}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                {status === 'scheduled' && (
                  <div>
                    <label className={labelCls}>Schedule Date</label>
                    <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
                      className={`mt-1.5 w-full p-2.5 text-[10px] rounded-xl border ${dm('bg-[#252525] text-white border-white/10', 'bg-gray-50 text-gray-800 border-gray-200')}`} />
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            <div style={cardShadow} className={`${dm('bg-[#1a1a1a] border-white/10', 'bg-white border-gray-200')} rounded-2xl border p-5`}>
              <p className={`text-[9px] font-bold tracking-widest uppercase mb-4 ${dm('text-[#800000]', 'text-[#800000]')}`}>Categories</p>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Main Category</label>
                  <select value={mainCategory} onChange={e => handleMainCategoryChange(e.target.value)}
                    className={`mt-1.5 w-full p-2.5 text-[10px] rounded-xl border ${dm('bg-[#252525] text-white border-white/10', 'bg-gray-50 text-gray-800 border-gray-200')}`}>
                    <option value="">Select Category</option>
                    {Object.values(MAIN_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {mainCategory && (
                  <div>
                    <label className={labelCls}>Subcategory</label>
                    <select value={subcategory} onChange={e => setSubcategory(e.target.value)}
                      className={`mt-1.5 w-full p-2.5 text-[10px] rounded-xl border ${dm('bg-[#252525] text-white border-white/10', 'bg-gray-50 text-gray-800 border-gray-200')}`}>
                      <option value="">Select Subcategory</option>
                      {getAvailableSubcategories().map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-8">
            <div style={cardShadow} className={`${dm('bg-[#1a1a1a] border-white/10', 'bg-white border-gray-200')} rounded-2xl border p-6 flex flex-col h-full`}>

              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <p className={`text-[9px] font-bold tracking-widest uppercase ${dm('text-[#800000]', 'text-[#800000]')}`}>Blog Details</p>
                <button onClick={() => openModal('full')} className={purpleBtn}>
                  <LayersIcon className="w-3.5 h-3.5" />
                  Generate Full Blog
                </button>
              </div>

              <div className="flex-grow space-y-6">

                {/* TITLE */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelCls}>Title <span className="text-[#800000]">•</span></label>
                    <button onClick={() => openModal('title')} className={cyanBtn}>
                      <SparkleIcon className="w-3 h-3" />
                      Auto-Generate
                    </button>
                  </div>
                  <div className={fieldBorder}>
                    <input value={title} onChange={e => setTitle(e.target.value)} maxLength={HEADLINE_MAX}
                      placeholder="e.g., Top 10 Hidden Gems in Palawan"
                      className={`${inputCls} py-2.5`} />
                  </div>
                  <CharCount value={title} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                </div>

                {/* AUTHOR + SHORT DESC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`${labelCls} block mb-1.5`}>Author <span className="text-[#800000]">•</span></label>
                    <div className={fieldBorder}>
                      <input value={authorName} onChange={e => setAuthorName(e.target.value)} maxLength={HEADLINE_MAX}
                        placeholder="e.g., Admin Team"
                        className={`${inputCls} py-2.5`} />
                    </div>
                    <CharCount value={authorName} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                  </div>
                  <div>
                    <label className={`${labelCls} block mb-1.5`}>Short Description <span className="text-[#800000]">•</span></label>
                    <div className={fieldBorder}>
                      <input value={shortDescription} onChange={e => setShortDescription(e.target.value)} maxLength={SHORT_DESC_MAX}
                        placeholder="Brief summary for listing card..."
                        className={`${inputCls} py-2.5`} />
                    </div>
                    <CharCount value={shortDescription} min={SHORT_DESC_MIN} max={SHORT_DESC_MAX} />
                  </div>
                </div>

                {/* CONTENT BODY */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelCls}>Content Body <span className="text-[#800000]">•</span></label>
                    <button onClick={() => openModal('content')} className={cyanBtn}>
                      <SparkleIcon className="w-3 h-3" />
                      Write with AI
                    </button>
                  </div>

                  {/* Main content block */}
                  <div className={`border rounded-xl p-4 space-y-3 ${dm('border-white/10 bg-[#212121]', 'border-gray-100 bg-gray-50/60')}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#800000]" />
                      <span className={`text-[9px] font-bold tracking-wider ${dm('text-gray-400', 'text-gray-500')}`}>MAIN SECTION (Required)</span>
                    </div>
                    <div>
                      <div className={fieldBorder}>
                        <input value={mainContentTitle} onChange={e => setMainContentTitle(e.target.value)} maxLength={HEADLINE_MAX}
                          placeholder="Main Section Title..."
                          className={`${inputCls} py-2`} />
                      </div>
                      <CharCount value={mainContentTitle} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                    </div>
                    <div>
                      <textarea value={mainContentText} onChange={e => setMainContentText(e.target.value)}
                        placeholder="Write your main content here..." rows={7}
                        className={`${inputCls} resize-none leading-relaxed`} />
                      <CharCount value={mainContentText} min={MAIN_CONTENT_MIN} />
                    </div>
                  </div>
                </div>

                {/* Additional Sections */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className={labelCls}>
                      Additional Sections
                      <span className={`ml-1 text-[8px] normal-case font-normal ${dm('text-gray-600', 'text-gray-400')}`}>(Optional)</span>
                    </label>
                    <span className={`text-[9px] ${dm('text-gray-500', 'text-gray-400')}`}>
                      Est. {Math.ceil(getTotalWordCount() / 200) || 1} min read
                    </span>
                  </div>

                  {contentSections.map((section, i) => (
                    <div key={i} className={`border rounded-xl p-4 space-y-3 relative ${dm('border-white/10 bg-[#212121]', 'border-gray-100 bg-gray-50/60')}`}>
                      {contentSections.length > 1 && (
                        <button onClick={() => removeContentSection(i)}
                          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[12px] text-red-400 bg-red-50 hover:bg-red-100 transition-colors">
                          ×
                        </button>
                      )}
                      <div>
                        <div className={fieldBorder}>
                          <input value={section.title} onChange={e => updateContentSection(i, 'title', e.target.value)}
                            maxLength={HEADLINE_MAX} placeholder="Section Title..."
                            className={`${inputCls} py-2`} />
                        </div>
                        <CharCount value={section.title} min={HEADLINE_MIN} max={HEADLINE_MAX} />
                      </div>
                      <div>
                        <textarea value={section.content} onChange={e => updateContentSection(i, 'content', e.target.value)}
                          placeholder="Section content..." rows={5}
                          className={`${inputCls} resize-none leading-relaxed`} />
                        <CharCount value={section.content} min={MAIN_CONTENT_MIN} />
                      </div>
                    </div>
                  ))}

                  <button onClick={addContentSection}
                    className={`w-full py-3 border-2 border-dashed rounded-xl text-[10px] transition-all ${dm('border-white/10 text-gray-500 hover:border-[#800000] hover:text-[#800000]', 'border-gray-200 text-gray-400 hover:border-[#800000] hover:text-[#800000]')}`}>
                    + Add Another Section
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className={`flex justify-between items-center pt-5 mt-6 border-t ${dm('border-white/10', 'border-gray-100')}`}>
                <p className={`text-[10px] italic ${dm('text-gray-500', 'text-gray-400')}`}>Review your entry before finalizing.</p>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!isFormValid() || isSubmitting}
                  className={`px-8 py-2.5 rounded-xl text-[10px] font-semibold transition-all ${
                    isFormValid() && !isSubmitting
                      ? 'bg-[#800000] text-white hover:bg-[#6a0000] shadow-md shadow-[#800000]/20'
                      : dm('bg-[#2a2a2a] text-gray-600 cursor-not-allowed', 'bg-gray-100 text-gray-400 cursor-not-allowed')
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Blog Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════ AI Generate Modal ════════ */}
      {activeModal && modalCfg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${dm('bg-[#1c1c1e]', 'bg-white')} rounded-2xl shadow-2xl w-full max-w-[460px]`}>

            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center flex-shrink-0 shadow-md">
                  {activeModal === 'image'
                    ? <ImageIcon className="w-5 h-5 text-white" />
                    : activeModal === 'full'
                    ? <LayersIcon className="w-5 h-5 text-white" />
                    : <SparkleIcon className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 className={`text-[13px] font-bold leading-tight ${dm('text-white', 'text-gray-900')}`}>{modalCfg.title}</h3>
                  <p className={`text-[9px] mt-0.5 ${dm('text-gray-500', 'text-gray-400')}`}>Powered by Gemini AI</p>
                </div>
              </div>
              <button onClick={closeModal}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[18px] leading-none transition-colors ${dm('text-gray-500 hover:text-white hover:bg-white/10', 'text-gray-400 hover:text-gray-700 hover:bg-gray-100')}`}>
                ×
              </button>
            </div>

            {/* Hint banner */}
            <div className={`mx-6 mb-4 flex items-start gap-2 px-3 py-2.5 rounded-xl text-[10px] leading-relaxed ${dm('bg-blue-500/10 text-blue-300 border border-blue-500/20', 'bg-blue-50 text-blue-600 border border-blue-100')}`}>
              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {modalCfg.hint}
            </div>

            {/* Prompt textarea */}
            <div className="px-6 pb-4">
              <textarea
                value={modalPrompt}
                onChange={e => setModalPrompt(e.target.value)}
                placeholder={modalCfg.placeholder}
                rows={4}
                autoFocus
                className={`w-full rounded-xl border p-3 text-[11px] outline-none resize-none leading-relaxed transition-colors ${
                  dm('bg-[#2a2a2a] border-white/10 text-white placeholder-gray-600 focus:border-[#800000]/50',
                     'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#800000] focus:bg-white')
                }`}
              />
            </div>

            {/* Attach image */}
            {modalCfg.withImageAttach && (
              <div className="px-6 pb-4">
                <button onClick={() => modalImageRef.current?.click()}
                  className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border transition-colors ${
                    modalAttachedImage
                      ? 'border-green-400 text-green-500'
                      : dm('border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200', 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700')
                  }`}>
                  <PaperclipIcon />
                  {modalAttachedImage ? '✓ Image attached' : 'Attach Image'}
                </button>
              </div>
            )}

            {/* Actions */}
            <div className={`flex gap-3 px-6 py-4 border-t ${dm('border-white/10', 'border-gray-100')}`}>
              <button onClick={closeModal} disabled={isGenerating}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-medium transition-colors ${dm('bg-[#2a2a2a] text-gray-300 hover:bg-[#333]', 'bg-gray-100 text-gray-600 hover:bg-gray-200')}`}>
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !modalPrompt.trim()}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  isGenerating || !modalPrompt.trim()
                    ? 'bg-[#800000]/40 cursor-not-allowed'
                    : 'bg-[#800000] hover:bg-[#6a0000] shadow-sm'
                }`}>
                {isGenerating ? <><Spinner /> Generating...</> : <><SparkleIcon className="w-3.5 h-3.5" /> Generate</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ Confirm Modal ════════ */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${dm('bg-[#1a1a1a]', 'bg-white')} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📝</div>
              <h3 className={`bold-text mb-2 ${dm('text-white', 'text-gray-900')}`}>Confirm Submission</h3>
              <p className={`text-[10px] ${dm('text-gray-400', 'text-gray-500')}`}>
                Are you ready to {status === 'published' ? 'publish' : status === 'scheduled' ? 'schedule' : 'save'} this blog post?
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} disabled={isSubmitting}
                className={`flex-1 py-3 rounded-xl text-[10px] ${dm('bg-[#2a2a2a] text-white hover:bg-[#333]', 'bg-gray-100 text-gray-700 hover:bg-gray-200')} transition-colors`}>
                Cancel
              </button>
              <button onClick={handleFinalConfirm} disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl text-[10px] bg-[#800000] text-white hover:bg-[#6a0000] transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ Success Modal ════════ */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${dm('bg-[#1a1a1a]', 'bg-white')} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">✅</div>
              <h3 className={`bold-text mb-2 ${dm('text-white', 'text-gray-900')}`}>Success!</h3>
              <p className={`text-[10px] ${dm('text-gray-400', 'text-gray-500')}`}>
                Your blog post has been {status === 'published' ? 'published' : status === 'scheduled' ? 'scheduled' : 'saved'} successfully.
              </p>
            </div>
            <button onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 rounded-xl text-[10px] bg-[#800000] text-white hover:bg-[#6a0000] transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ════════ Error Modal ════════ */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${dm('bg-[#1a1a1a]', 'bg-white')} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">❌</div>
              <h3 className={`bold-text mb-2 ${dm('text-white', 'text-gray-900')}`}>Error</h3>
              <p className={`text-[10px] ${dm('text-gray-400', 'text-gray-500')}`}>
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
            </div>
            <button onClick={() => setShowErrorModal(false)}
              className="w-full py-3 rounded-xl text-[10px] bg-[#800000] text-white hover:bg-[#6a0000] transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}