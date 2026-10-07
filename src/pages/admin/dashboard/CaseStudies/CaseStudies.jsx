
import PageHeader from "@/components/PageHeader";
import React, { useState, useRef, useEffect } from "react";
import DashboardLoader, { Spinner, useInitialLoad } from "@/components/DashboardLoader";
import RichTextArea from "@/components/RichTextArea";
import { toHtml } from "@/lib/rich-text";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const PLACEHOLDER_COVERS = [
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80"
];
// ISO -> value for <input type="datetime-local"> in the admin's local time.
const toLocalInput = (iso) => {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
const transformBackendRecord = (item) => ({
  _id: item._id,
  title: item.title || "",
  subtitle: item.subtitle || "",
  authors: Array.isArray(item.authors) ? item.authors.map((a) => ({ name: a.name || "", image: a.image || "" })) : [],
  status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Draft",
  tags: Array.isArray(item.tags) ? item.tags : [],
  start: item.startDate ? new Date(item.startDate).toISOString().split("T")[0] : "",
  end: item.endDate ? new Date(item.endDate).toISOString().split("T")[0] : "",
  cover: item.cover || "",
  scheduleAt: item.scheduleDate ? toLocalInput(item.scheduleDate) : "",
  // challenge and solution are arrays of { title, text } — extract the text
  challenge: Array.isArray(item.challenge) ? item.challenge.map((c) => c.text || "").join("\n\n") : item.challenge || "",
  solution: Array.isArray(item.solution) ? item.solution.map((s) => s.text || "").join("\n\n") : item.solution || "",
  sections: Array.isArray(item.sections) ? item.sections.map((s) => ({
    topic: s.subtitle || s.title || s.topic || s.heading || "",
    content: s.text || s.content || s.body || s.description || ""
  })) : [{ topic: "", content: "" }]
});
const STATUS_OPTIONS = ["Active", "Draft", "Completed", "Scheduled"];
const CATEGORY_OPTIONS = ["Technology", "Healthcare", "Finance", "Marketing", "Operations", "Research", "Design", "Analytics"];
const STATUS_ICON_PATHS = {
  Active: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  Draft: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  Completed: "M5 13l4 4L19 7",
  Scheduled: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
};
const CATEGORY_ICON_PATHS = {
  Technology: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  Healthcare: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  Finance: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z",
  Marketing: "M3 11l18-5v12L3 14v-3zm0 0v7a2 2 0 002 2h1M8 11v9",
  Operations: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  Research: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z",
  Design: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h11a2 2 0 012 2v4M7 21h11a2 2 0 002-2v-4M7 21c1.5-4.5 4-4 4-4m9-9L11 17l-4 1 1-4L17 3z",
  Analytics: "M9 19V6l7 7-7 7zM3 3v18h18"
};
const LIB_CATEGORIES = ["All", "Technology", "Logistics", "Analytics", "Infrastructure"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const getDefaultForm = () => ({
  title: "",
  subtitle: "",
  authors: [{ name: "", image: "", imageFile: null }],
  status: "Draft",
  tags: [],
  startDate: "",
  endDate: "",
  scheduleAt: "",
  challenge: "",
  solution: "",
  sections: [{ topic: "", content: "" }]
});
const formatAuthors = (authors) => authors.map((a) => a.name).join(", ");
const getCardCover = (record, allRecords) => {
  if (record.cover) return record.cover;
  const idx = allRecords.findIndex((r) => r._id === record._id);
  return PLACEHOLDER_COVERS[idx % PLACEHOLDER_COVERS.length];
};
const getStatusStyle = (s) => {
  switch (s) {
    case "Active":
      return { bg: "color-mix(in srgb, var(--admin-accent) 10%, transparent)", color: "var(--admin-accent)", border: "1px solid color-mix(in srgb, var(--admin-accent) 25%, transparent)" };
    case "Completed":
      return { bg: "rgba(5,150,105,0.09)", color: "#059669", border: "1px solid rgba(5,150,105,0.22)" };
    case "Draft":
      return { bg: "rgba(100,100,100,0.09)", color: "#6b7280", border: "1px solid rgba(100,100,100,0.22)" };
    case "Scheduled":
      return { bg: "rgba(124,58,237,0.09)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.22)" };
    default:
      return { bg: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb" };
  }
};
const getCalendarDays = (month) => {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const firstDay = (new Date(y, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(y, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
};
const StatTile = ({ label, count, gradient, gradientLight, accentColor, accentColorLight, iconPath, change, changeUp, dark }) => <div
  style={{
    background: dark ? gradient : gradientLight,
    padding: "18px 20px 18px 20px",
    borderRadius: 20,
    border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.7)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
    transition: "transform .2s, box-shadow .2s",
    boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.07)",
    minHeight: 130
  }}
>
    <svg
  viewBox="0 0 300 140"
  xmlns="http://www.w3.org/2000/svg"
  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
  preserveAspectRatio="none"
>
      <path d="M300,0 L300,140 C280,140 260,120 255,95 C250,70 265,45 260,20 C257,8 300,0 300,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.10" />
      <path d="M300,0 L300,140 C270,140 240,115 232,82 C224,50 242,22 235,5 C300,0 300,0 300,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.14" />
      <path d="M300,0 L300,140 C255,140 215,108 205,70 C195,32 218,8 208,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.18" />
      <path d="M300,0 L300,140 C238,140 190,100 178,58 C166,16 192,0 182,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.22" />
      <path d="M300,0 L300,140 C220,140 165,92 152,48 C142,14 165,0 155,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.28" />
    </svg>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, borderRadius: "0 0 20px 20px", background: dark ? `linear-gradient(to right, ${accentColor}ff, ${accentColor}33)` : `linear-gradient(to right, ${accentColorLight}cc, ${accentColorLight}11)` }} />
    <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", margin: 0, color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", fontFamily: "'Poppins', sans-serif" }}>{label}</p>
      <div style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.75)", backdropFilter: "blur(6px)", border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.9)", color: dark ? accentColor : accentColorLight, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={iconPath} /></svg>
      </div>
    </div>
    <p style={{ position: "relative", fontSize: 34, fontWeight: 700, margin: "0 0 14px", lineHeight: 1, color: dark ? "#ffffff" : "#111827", fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.02em" }}>{count}</p>
    <div style={{ position: "relative", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: dark ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.65)", backdropFilter: "blur(4px)", border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.9)", color: changeUp ? dark ? "#34d399" : "#059669" : dark ? "#f87171" : "#dc2626", fontFamily: "'Poppins', sans-serif" }}>
        {changeUp ? "\u2191" : "\u2193"} {change.split(" ")[0]}
      </span>
      <span style={{ fontSize: 10, fontWeight: 400, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)", fontFamily: "'Poppins', sans-serif" }}>vs last month</span>
    </div>
  </div>;
const MiniCalendar = ({ records, subtleBg, borderColor, textSecondary, textMuted, onDayClick, onOpenCalendar }) => {
  const now = /* @__PURE__ */ new Date();
  const m = now.getMonth(), y = now.getFullYear(), today = now.getDate();
  const cells = getCalendarDays(m);
  const dateStr = (d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return <div style={{ padding: 14, borderRadius: 16, background: subtleBg, border: `1px solid ${borderColor}`, flex: 1, fontFamily: "'Poppins', sans-serif" }}>
      <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: textSecondary, margin: "0 0 12px", fontFamily: "'Poppins', sans-serif" }}>{MONTHS[m]} {y}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((d, i) => {
    if (!d) return <div key={i} />;
    const isToday = d === today;
    const ds = dateStr(d);
    const hasEv = records.some((r) => r.start === ds);
    return <div key={i} onClick={() => hasEv ? onDayClick(ds) : onOpenCalendar()} style={{ aspectRatio: "1", width: "100%", maxWidth: 40, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 10, borderRadius: 8, cursor: "pointer", fontWeight: isToday ? 700 : 400, background: isToday ? "var(--admin-accent)" : "transparent", color: isToday ? "#fff" : textMuted, fontFamily: "'Poppins', sans-serif", gap: 2 }}>
              {d}
              {hasEv && <div style={{ width: 4, height: 4, borderRadius: "50%", background: isToday ? "rgba(255,255,255,0.8)" : "#3b82f6" }} />}
            </div>;
  })}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${borderColor}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "var(--admin-accent)" }} />
          <span style={{ fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Today</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
          <span style={{ fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Has events</span>
        </div>
      </div>
    </div>;
};
const Backdrop = ({ children }) => <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, padding: 20, fontFamily: "'Poppins', sans-serif" }}>
    {children}
  </div>;
const ConfirmModal = ({ isOpen, isEdit, isLoading, onClose, onConfirm, cardBg, borderColor, textPrimary, textMuted }) => {
  if (!isOpen) return null;
  return <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, padding: "32px 28px", maxWidth: 420, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.28)", fontFamily: "'Poppins', sans-serif" }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: textPrimary, margin: "0 0 8px", fontFamily: "'Poppins', sans-serif" }}>{isEdit ? "Update case study?" : "Create case study?"}</h3>
        <p style={{ fontSize: 12, color: textMuted, margin: "0 0 28px", fontFamily: "'Poppins', sans-serif" }}>{isEdit ? "Save the changes to this case study?" : "Are you sure you want to create this case study?"}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
          <button onClick={onConfirm} disabled={isLoading} style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: isLoading ? 0.7 : 1, fontFamily: "'Poppins', sans-serif" }}>
            {isLoading ? "Saving\u2026" : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </Backdrop>;
};
const DeleteModal = ({ isOpen, isDeleting, targetTitle, onClose, onConfirm, cardBg, borderColor, textPrimary, textMuted }) => {
  if (!isOpen) return null;
  return <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, padding: "32px 28px", maxWidth: 420, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.28)", fontFamily: "'Poppins', sans-serif" }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: textPrimary, margin: "0 0 8px", fontFamily: "'Poppins', sans-serif" }}>Delete case study?</h3>
        <p style={{ fontSize: 12, color: textMuted, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif" }}>You are about to delete:</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-accent)", margin: "0 0 6px", fontFamily: "'Poppins', sans-serif" }}>"{targetTitle}"</p>
        <p style={{ fontSize: 11, color: textMuted, margin: "0 0 28px", fontFamily: "'Poppins', sans-serif" }}>This action cannot be undone.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none", background: "#dc2626", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: isDeleting ? 0.7 : 1, fontFamily: "'Poppins', sans-serif" }}>
            {isDeleting ? "Deleting\u2026" : "Delete"}
          </button>
        </div>
      </div>
    </Backdrop>;
};
const AI_IMAGE_STEPS = ["Analyzing prompt", "Creating cover image"];
const AiImageModal = ({ isOpen, prompt, onPromptChange, isExpanding, isGenerating, onExpandPrompt, onGenerate, onClose, cardBg, borderColor, textPrimary, textMuted, inputBg, isdarkmode }) => {
  if (!isOpen) return null;
  const busy = isExpanding || isGenerating;
  const stepIndex = isGenerating ? 1 : 0;
  return <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, padding: "32px 28px", maxWidth: 460, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.28)", fontFamily: "'Poppins', sans-serif" }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: textPrimary, margin: "0 0 8px", fontFamily: "'Poppins', sans-serif" }}>Generate cover image</h3>
        <p style={{ fontSize: 12, color: textMuted, margin: "0 0 18px", fontFamily: "'Poppins', sans-serif" }}>Describe the cover image you want, or type a rough idea and let AI expand it into a detailed prompt first.</p>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g., Customer support team collaborating in a modern office..."
          rows={4}
          disabled={busy}
          autoFocus
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${borderColor}`, background: inputBg, color: textPrimary, fontSize: 12, outline: "none", resize: "none", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", marginBottom: 10 }}
        />
        <button onClick={onExpandPrompt} disabled={busy || !prompt.trim()} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 12, fontWeight: 500, cursor: busy || !prompt.trim() ? "not-allowed" : "pointer", opacity: busy || !prompt.trim() ? 0.6 : 1, fontFamily: "'Poppins', sans-serif", marginBottom: busy ? 10 : 18 }}>
          {isExpanding ? <Spinner size={13} /> : <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
          {isExpanding ? "Generating prompt…" : "Generate Prompt"}
        </button>

        {busy && <div style={{ marginBottom: 18, padding: "22px 20px", borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ position: "relative", width: 52, height: 52, marginBottom: 6 }}>
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-accent)" }}><Spinner size={52} thickness={4} /></span>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" fill="none" stroke={textMuted} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
              {isExpanding ? "Expanding your prompt" : AI_IMAGE_STEPS[stepIndex] || "Generating…"}
            </p>
            <p style={{ fontSize: 11, color: textMuted, margin: "0 0 10px", fontFamily: "'Poppins', sans-serif" }}>
              {isGenerating ? "This usually takes 30-60 seconds." : "This only takes a few seconds."}
            </p>
            {isGenerating && <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                {AI_IMAGE_STEPS.map((step, i) => <React.Fragment key={step}>
                    {i > 0 && <div style={{ flex: 1, height: 1, background: i <= stepIndex ? "var(--admin-accent)" : borderColor }} />}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: i < stepIndex ? "var(--admin-accent)" : i === stepIndex ? "transparent" : borderColor, border: i === stepIndex ? "2px solid var(--admin-accent)" : "none" }}>
                        {i < stepIndex ? <svg width="10" height="10" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : i === stepIndex ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--admin-accent)" }} /> : null}
                      </div>
                      <span style={{ fontSize: 9, textAlign: "center", maxWidth: 72, color: i <= stepIndex ? textPrimary : textMuted, fontWeight: i === stepIndex ? 600 : 400, fontFamily: "'Poppins', sans-serif" }}>{step}</span>
                    </div>
                  </React.Fragment>)}
              </div>}
          </div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} disabled={busy} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 13, fontWeight: 500, cursor: busy ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
          <button onClick={onGenerate} disabled={busy || !prompt.trim()} style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: busy || !prompt.trim() ? "not-allowed" : "pointer", opacity: busy || !prompt.trim() ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'Poppins', sans-serif" }}>
            {isGenerating ? <Spinner size={13} /> : null}
            {isGenerating ? "Generating image…" : "Generate Image"}
          </button>
        </div>
      </div>
    </Backdrop>;
};
const PreviewModal = ({ isOpen, data, allRecords, onClose, onEdit, closeLabel, cardBg, borderColor, textPrimary, textMuted, textSecondary, subtleBg }) => {
  if (!isOpen || !data) return null;
  const st = getStatusStyle(data.status);
  const coverSrc = getCardCover(data, allRecords);
  return <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, maxWidth: 560, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.28)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ height: 200, background: `url(${coverSrc}) center/cover`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55))" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.35)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div style={{ position: "absolute", bottom: 12, left: 16, zIndex: 1 }}>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 10px", borderRadius: 6, background: "color-mix(in srgb, var(--admin-accent) 85%, transparent)", color: "#fff", fontFamily: "'Poppins', sans-serif" }}>Case study</span>
          </div>
        </div>
        <div style={{ padding: "22px 26px 30px" }}>
          {
    /* Title + Status */
  }
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: textPrimary, margin: "0 0 5px", fontFamily: "'Poppins', sans-serif" }}>{data.title}</h2>
              {data.subtitle && <p style={{ fontSize: 12, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{data.subtitle}</p>}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{data.status}</span>
          </div>

          {
    /* Authors */
  }
          {data.authors.length > 0 && <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 16px" }}>
              <div style={{ display: "flex" }}>
                {data.authors.map((a, i) => a.image ? <img key={i} src={a.image} alt={a.name} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: `2px solid ${cardBg}`, marginLeft: i === 0 ? 0 : -8, flexShrink: 0 }} /> : <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${cardBg}`, marginLeft: i === 0 ? 0 : -8, flexShrink: 0, background: "color-mix(in srgb, var(--admin-accent) 12%, transparent)", color: "var(--admin-accent)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif" }}>
                      {a.name.charAt(0).toUpperCase()}
                    </div>)}
              </div>
              <p style={{ fontSize: 12, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>By <strong style={{ color: textSecondary, fontFamily: "'Poppins', sans-serif" }}>{data.authors.map((a) => a.name).join(", ")}</strong></p>
            </div>}

          {
    /* Tags */
  }
          {data.tags.length > 0 && <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
              {data.tags.map((t) => <span key={t} style={{ fontSize: 10, padding: "3px 11px", borderRadius: 20, background: subtleBg, border: `1px solid ${borderColor}`, color: textMuted, fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>{t}</span>)}
            </div>}

          {
    /* Dates */
  }
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            {data.start && <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                📅 Started: <strong style={{ color: textSecondary, fontFamily: "'Poppins', sans-serif" }}>{data.start}</strong>
              </p>}
            {data.end && <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                🏁 Ended: <strong style={{ color: textSecondary, fontFamily: "'Poppins', sans-serif" }}>{data.end}</strong>
              </p>}
          </div>

          {
    /* Challenge */
  }
          {data.challenge && <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 12, background: subtleBg, border: `1px solid ${borderColor}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--admin-accent)", margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Poppins', sans-serif" }}>Challenge</p>
              <div className="rta-view" style={{ fontSize: 12, color: textMuted, lineHeight: 1.6, fontFamily: "'Poppins', sans-serif" }} dangerouslySetInnerHTML={{ __html: toHtml(data.challenge) }} />
            </div>}

          {
    /* Solution */
  }
          {data.solution && <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 12, background: subtleBg, border: `1px solid ${borderColor}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Poppins', sans-serif" }}>Solution</p>
              <div className="rta-view" style={{ fontSize: 12, color: textMuted, lineHeight: 1.6, fontFamily: "'Poppins', sans-serif" }} dangerouslySetInnerHTML={{ __html: toHtml(data.solution) }} />
            </div>}

          {
    /* Content Sections */
  }
          {data.sections && data.sections.some((s) => s.topic || s.content) && <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: textSecondary, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Poppins', sans-serif" }}>Content</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.sections.filter((s) => s.topic || s.content).map((s, i) => <div key={i} style={{ padding: "10px 14px", borderRadius: 10, background: subtleBg, border: `1px solid ${borderColor}` }}>
                    {s.topic && <p style={{ fontSize: 12, fontWeight: 600, color: textSecondary, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif" }}>{s.topic}</p>}
                    {s.content && <div className="rta-view" style={{ fontSize: 12, color: textMuted, lineHeight: 1.6, fontFamily: "'Poppins', sans-serif" }} dangerouslySetInnerHTML={{ __html: toHtml(s.content) }} />}
                  </div>)}
              </div>
            </div>}

          {
    /* Actions */
  }
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>{closeLabel || "Close"}</button>
            <button onClick={() => {
    onEdit(data);
    onClose();
  }} style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Edit this study</button>
          </div>
        </div>
      </div>
    </Backdrop>;
};
const CalendarModal = ({ isOpen, records, selectedMonthIndex, onClose, onMonthChange, onDateClick, cardBg, borderColor, textPrimary, textMuted, subtleBg }) => {
  if (!isOpen) return null;
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const m = selectedMonthIndex;
  const today = now.getDate();
  const isCurrentMonth = m === now.getMonth();
  const cells = getCalendarDays(m);
  const dateStr = (d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const monthPrefix = `${y}-${String(m + 1).padStart(2, "0")}`;
  const monthEvents = records.filter((r) => r.start.startsWith(monthPrefix));
  return <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, maxWidth: 560, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.28)", overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => onMonthChange(m === 0 ? 11 : m - 1)} style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${borderColor}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: textPrimary, margin: 0, minWidth: 160, textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>{MONTHS[m]} {y}</h3>
            <button onClick={() => onMonthChange(m === 11 ? 0 : m + 1)} style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${borderColor}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: "18px 24px 26px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {cells.map((d, i) => {
    if (!d) return <div key={i} />;
    const isToday = isCurrentMonth && d === today;
    const ds = dateStr(d);
    const evs = records.filter((r) => r.start === ds);
    return <div key={i} onClick={() => evs.length ? onDateClick(ds) : void 0} style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 10, cursor: evs.length ? "pointer" : "default", gap: 2, background: isToday ? "var(--admin-accent)" : subtleBg, border: isToday ? "none" : `1px solid transparent` }}>
                  <span style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? "#fff" : textMuted, fontFamily: "'Poppins', sans-serif" }}>{d}</span>
                  {evs.length > 0 && <div style={{ width: 4, height: 4, borderRadius: "50%", background: isToday ? "rgba(255,255,255,0.8)" : "#3b82f6", marginTop: 1 }} />}
                </div>;
  })}
          </div>
          {monthEvents.length > 0 && <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${borderColor}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: textMuted, margin: "0 0 10px", fontFamily: "'Poppins', sans-serif" }}>Events this month</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {monthEvents.map((r) => {
    const st = getStatusStyle(r.status);
    return <div key={r._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 13px", borderRadius: 12, background: subtleBg, border: `1px solid ${borderColor}` }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: "0 0 2px", fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                        <p style={{ fontSize: 10, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{r.start} · {formatAuthors(r.authors)}</p>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                    </div>;
  })}
              </div>
            </div>}
        </div>
      </div>
    </Backdrop>;
};
const DateModal = ({ isOpen, dateStr, studies, onClose, onSelectStudy, cardBg, borderColor, textPrimary, textMuted, subtleBg }) => {
  if (!isOpen) return null;
  return <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, maxWidth: 460, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.28)", overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Events on {dateStr}</h3>
            <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontFamily: "'Poppins', sans-serif" }}>{studies.length} case {studies.length === 1 ? "study" : "studies"} scheduled</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: "16px 22px 22px", display: "flex", flexDirection: "column", gap: 9 }}>
          {studies.map((r) => {
    const st = getStatusStyle(r.status);
    return <div key={r._id} style={{ padding: "12px 14px", borderRadius: 14, border: `1px solid ${borderColor}`, background: subtleBg, cursor: "pointer" }} onClick={() => {
      onSelectStudy(r);
      onClose();
    }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                    {r.subtitle && <p style={{ fontSize: 11, color: textMuted, margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.subtitle}</p>}
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>By <strong style={{ color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{formatAuthors(r.authors)}</strong></p>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                </div>
              </div>;
  })}
        </div>
      </div>
    </Backdrop>;
};
const Toast = ({ message, type }) => <div style={{ position: "fixed", top: 24, right: 24, zIndex: 2e3, padding: "14px 22px", borderRadius: 16, background: type === "success" ? "#059669" : "#dc2626", color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontFamily: "'Poppins', sans-serif" }}>
    {message}
  </div>;
function CaseStudies({ mode = "list" }) {
  const addMode = mode === "add";
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const authorFileRefs = useRef([]);
  const { isdarkmode: dark } = useDarkMode();
  const bg = "var(--admin-bg)";
  const cardBg = "var(--admin-surface)";
  const subtleBg = dark ? "rgba(255,255,255,0.03)" : "#f9fafb";
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const textPrimary = dark ? "#f0f0f0" : "#1f2937";
  const textSecondary = dark ? "#9ca3af" : "#374151";
  const textMuted = dark ? "#6b7280" : "#6b7280";
  const inputBg = dark ? "#161616" : "#ffffff";
  const hoverBg = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const [records, setRecords] = useState([]);
  const [isFetchingRecords, setIsFetchingRecords] = useState(true);
  const initialLoading = useInitialLoad(isFetchingRecords);
  const fetchRecords = async () => {
    try {
      setIsFetchingRecords(true);
      const res = await fetch(`${API_BASE_URL}/casestudies`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecords(data.map(transformBackendRecord));
    } catch (err) {
      console.error("Error fetching case studies:", err);
    } finally {
      setIsFetchingRecords(false);
    }
  };
  useEffect(() => {
    fetchRecords();
  }, []);
  const [form, setForm] = useState(getDefaultForm());
  const [coverPreview, setCoverPreview] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showAiImageModal, setShowAiImageModal] = useState(false);
  const [aiImagePrompt, setAiImagePrompt] = useState("");
  const [isExpandingPrompt, setIsExpandingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetchingFull, setIsFetchingFull] = useState(false);
  const fetchFullRecord = async (id) => {
    try {
      setIsFetchingFull(true);
      const res = await fetch(`${API_BASE_URL}/casestudies/${id}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch record");
      const data = await res.json();
      console.log("Full record from API:", data);
      return transformBackendRecord(data);
    } catch (err) {
      console.error("Error fetching full record:", err);
      return null;
    } finally {
      setIsFetchingFull(false);
    }
  };
  const [previewData, setPreviewData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateStudies, setSelectedDateStudies] = useState([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState((/* @__PURE__ */ new Date()).getMonth());
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("All");
  const [activeTagFilter, setActiveTagFilter] = useState("All");
  const [showFormOnly, setShowFormOnly] = useState(addMode);
  const [showCalendarPage, setShowCalendarPage] = useState(false);
  const [returnTo, setReturnTo] = useState("main");
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [eventPanelTab, setEventPanelTab] = useState("month");
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 768);
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowBottomSheet(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3e3);
  };
  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleTag = (tag) => setForm((prev) => ({
    ...prev,
    tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag]
  }));
  const addAuthor = () => setForm((prev) => ({ ...prev, authors: [...prev.authors, { name: "", image: "", imageFile: null }] }));
  const removeAuthor = (i) => setForm((prev) => ({ ...prev, authors: prev.authors.filter((_, idx) => idx !== i) }));
  const updateAuthorName = (i, name) => setForm((prev) => {
    const authors = [...prev.authors];
    authors[i] = { ...authors[i], name };
    return { ...prev, authors };
  });
  const updateAuthorImage = (i, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result;
      setForm((prev) => {
        const authors = [...prev.authors];
        authors[i] = { ...authors[i], image: preview, imageFile: file };
        return { ...prev, authors };
      });
    };
    reader.readAsDataURL(file);
  };
  const removeAuthorImage = (i) => setForm((prev) => {
    const authors = [...prev.authors];
    authors[i] = { ...authors[i], image: "", imageFile: null };
    return { ...prev, authors };
  });
  const addSection = () => {
    if (form.sections.length < 5)
      setForm((prev) => ({ ...prev, sections: [...prev.sections, { topic: "", content: "" }] }));
  };
  const removeSection = (i) => setForm((prev) => ({ ...prev, sections: prev.sections.filter((_, idx) => idx !== i) }));
  const updateSection = (i, key, val) => setForm((prev) => {
    const s = [...prev.sections];
    s[i] = { ...s[i], [key]: val };
    return { ...prev, sections: s };
  });
  const clearForm = () => {
    setForm(getDefaultForm());
    setCoverPreview("");
    setCoverFile(null);
    authorFileRefs.current = [];
    setIsEditMode(false);
    setEditingId(null);
  };
  const resetForm = () => {
    clearForm();
    setShowFormOnly(addMode);
    setShowCalendarPage(false);
    setShowAllEvents(false);
    setEventPanelTab("month");
  };
  const handleFile = (file) => {
    if (!file) return;
    setCoverFile(null);
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target?.result);
    reader.readAsDataURL(file);
  };
  const openAiImageModal = () => {
    setAiImagePrompt("");
    setShowAiImageModal(true);
  };
  const closeAiImageModal = () => {
    if (isExpandingPrompt || isGeneratingImage) return;
    setShowAiImageModal(false);
    setAiImagePrompt("");
  };
  const handleExpandImagePrompt = async () => {
    if (!aiImagePrompt.trim()) return;
    setIsExpandingPrompt(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ai/generate-blog`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "expand-prompt", prompt: aiImagePrompt.trim() })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Prompt generation failed");
      }
      const { data } = await res.json();
      if (data?.imagePrompt) setAiImagePrompt(data.imagePrompt);
    } catch (err) {
      showToast(err.message || "Prompt generation failed", "error");
    } finally {
      setIsExpandingPrompt(false);
    }
  };
  const handleGenerateAiImage = async () => {
    if (!aiImagePrompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ai/generate-image`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiImagePrompt.trim() })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Image generation failed");
      }
      const { dataUrl } = await res.json();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "ai-generated-cover.jpg", { type: blob.type || "image/jpeg" });
      setCoverFile(file);
      setCoverPreview(dataUrl);
      setShowAiImageModal(false);
      setAiImagePrompt("");
      showToast("Cover image generated!", "success");
    } catch (err) {
      showToast(err.message || "Image generation failed", "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };
  const inp = (overrides = {}) => ({
    width: "100%",
    padding: "8px 11px",
    borderRadius: 8,
    border: `1px solid ${borderColor}`,
    background: inputBg,
    color: textPrimary,
    fontSize: 12,
    outline: "none",
    fontWeight: 400,
    boxSizing: "border-box",
    transition: "border-color .15s",
    fontFamily: "'Poppins', sans-serif",
    ...overrides
  });
  const validAuthors = form.authors.filter((a) => a.name.trim().length >= 2);
  const handleSubmit = async () => {
    if (!form.title.trim() || validAuthors.length === 0) {
      showToast("Title and at least one author (2+ characters) are required.", "error");
      setShowConfirm(false);
      return;
    }
    if (form.status === "Scheduled" && (!form.scheduleAt || new Date(form.scheduleAt) <= /* @__PURE__ */ new Date())) {
      showToast("Pick a schedule date and time in the future.", "error");
      setShowConfirm(false);
      return;
    }
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", form.title);
      if (form.subtitle) formDataToSend.append("subtitle", form.subtitle);
      const authorsPayload = validAuthors.map((a) => ({
        name: a.name.trim(),
        image: a.imageFile ? "__NEW_FILE__" : a.image || ""
      }));
      formDataToSend.append("authors", JSON.stringify(authorsPayload));
      validAuthors.forEach((a) => {
        if (a.imageFile) formDataToSend.append("authorImages", a.imageFile);
      });
      formDataToSend.append("status", form.status.toLowerCase());
      if (form.tags.length > 0) formDataToSend.append("tags", form.tags.map((t) => t.toLowerCase()).join(","));
      if (form.startDate) formDataToSend.append("startDate", form.startDate);
      if (form.endDate) formDataToSend.append("endDate", form.endDate);
      if (form.status === "Scheduled") {
        formDataToSend.append("scheduleDate", new Date(form.scheduleAt).toISOString());
        formDataToSend.append("scheduleTime", form.scheduleAt.slice(11, 16));
      }
      formDataToSend.append("challenge", toHtml(form.challenge));
      formDataToSend.append("solution", toHtml(form.solution));
      form.sections.forEach((s, i) => {
        formDataToSend.append(`subtitle${i}`, s.topic);
        formDataToSend.append(`text${i}`, toHtml(s.content));
      });
      if (fileRef.current?.files?.[0]) {
        formDataToSend.append("cover", fileRef.current.files[0]);
      } else if (coverFile) {
        formDataToSend.append("cover", coverFile);
      }
      const url = isEditMode && editingId ? `${API_BASE_URL}/casestudies/${editingId}` : `${API_BASE_URL}/casestudies`;
      const method = isEditMode ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: formDataToSend, credentials: "include" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      showToast(isEditMode ? "Case study updated!" : "Case study created!", "success");
      await fetchRecords();
      setShowConfirm(false);
      const goBack = returnTo;
      resetForm();
      if (goBack === "calendar") {
        setShowCalendarPage(true);
        setShowFormOnly(false);
      }
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
      setShowConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleView = async (r) => {
    const full = await fetchFullRecord(r._id);
    setPreviewData(full ?? r);
    setShowPreview(true);
  };
  const handleEdit = async (r, from = "main") => {
    const full = await fetchFullRecord(r._id);
    const data = full ?? r;
    setForm({
      title: data.title,
      subtitle: data.subtitle,
      authors: data.authors.length > 0 ? data.authors.map((a) => ({ name: a.name, image: a.image, imageFile: null })) : [{ name: "", image: "", imageFile: null }],
      status: data.status,
      tags: data.tags,
      startDate: data.start,
      endDate: data.end,
      scheduleAt: data.scheduleAt,
      challenge: data.challenge,
      solution: data.solution,
      sections: data.sections.length > 0 ? data.sections : [{ topic: "", content: "" }]
    });
    setCoverPreview(data.cover);
    setIsEditMode(true);
    setEditingId(data._id);
    setShowFormOnly(true);
    setShowCalendarPage(false);
    setReturnTo(from);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/casestudies/${deleteTarget._id}/archive`, {
        method: "PATCH",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to archive");
      showToast("Case study archived.", "success");
      await fetchRecords();
      setShowDelete(false);
      setDeleteTarget(null);
    } catch (err) {
      showToast("Failed to archive case study.", "error");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleDayClick = (ds) => {
    const studies = records.filter((r) => r.start === ds);
    if (studies.length) {
      setSelectedDate(ds);
      setSelectedDateStudies(studies);
      setShowCalendar(false);
      setShowDateModal(true);
    }
  };
  const counts = {
    All: records.length,
    Active: records.filter((r) => r.status === "Active").length,
    Draft: records.filter((r) => r.status === "Draft").length,
    Completed: records.filter((r) => r.status === "Completed").length,
    Scheduled: records.filter((r) => r.status === "Scheduled").length
  };
  const filtered = records.filter((r) => {
    if (activeTab !== "All" && r.status !== activeTab) return false;
    if (activeTagFilter !== "All" && !r.tags.includes(activeTagFilter)) return false;
    const q = search.toLowerCase();
    if (search && !r.title.toLowerCase().includes(q) && !r.authors.some((a) => a.name.toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "alpha-asc") return a.title.localeCompare(b.title);
    if (sortBy === "alpha-desc") return b.title.localeCompare(a.title);
    if (sortBy === "date-oldest") return (a.start || "").localeCompare(b.start || "");
    return (b.start || "").localeCompare(a.start || "");
  });
  const card = {
    background: cardBg,
    border: `1px solid ${borderColor}`,
    borderRadius: 16,
    boxShadow: dark ? "0 1px 6px rgba(0,0,0,.4)" : "0 1px 6px rgba(0,0,0,.06)"
  };
  const lbl = {
    fontSize: 11,
    fontWeight: 600,
    color: textMuted,
    display: "block",
    marginBottom: 5,
    fontFamily: "'Poppins', sans-serif"
  };
  const modalTheme = { cardBg, borderColor, textPrimary, textMuted, textSecondary, subtleBg };
  const statTileConfigs = [
    { label: "Active", count: counts.Active, gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)", gradientLight: "linear-gradient(150deg, #c8dcff 0%, #dbeafe 50%, #bdd3ff 100%)", accentColor: "#60a5fa", accentColorLight: "#1d4ed8", iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", change: "+12.5% from Last Month", changeUp: true },
    { label: "Done", count: counts.Completed, gradient: "linear-gradient(135deg, #1a1a2e 0%, #1e1b4b 60%, #312e81 100%)", gradientLight: "linear-gradient(150deg, #d8ccff 0%, #e9d5ff 50%, #d4bfff 100%)", accentColor: "#a78bfa", accentColorLight: "#6d28d9", iconPath: "M5 13l4 4L19 7", change: "+8.2% from Last Month", changeUp: true },
    { label: "Draft", count: counts.Draft, gradient: "linear-gradient(135deg, #1a1a2e 0%, #1c1917 60%, #292524 100%)", gradientLight: "linear-gradient(150deg, #ffd8a8 0%, #ffedd5 50%, #fecb8a 100%)", accentColor: "#fb923c", accentColorLight: "#c2410c", iconPath: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", change: "-3.1% from Last Month", changeUp: false },
    { label: "Schedule", count: counts.Scheduled, gradient: "linear-gradient(135deg, #1a1a2e 0%, #14532d 60%, #166534 100%)", gradientLight: "linear-gradient(150deg, #a8f0cc 0%, #dcfce7 50%, #90eabc 100%)", accentColor: "#4ade80", accentColorLight: "#15803d", iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", change: "+15.3% from Last Month", changeUp: true }
  ];
  return <div className="cs-page-wrap" style={{ minHeight: "100vh", padding: "32px 24px", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
        *, *::before, *::after { font-family: var(--font-body) !important; box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { border-color: var(--admin-accent) !important; outline: none !important; box-shadow: none !important; }
        .cs-card { transition: transform .18s, box-shadow .18s, border-color .18s; }
        .cs-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.10) !important; border-color: rgba(0,0,0,.13) !important; }
        .arc-row:hover { background: ${hoverBg} !important; }
        .pill-btn:hover { opacity: .78; }
        .icon-btn:hover { opacity: .7; }
        .cs-card-img { transition: transform .35s ease; }
        .cs-card:hover .cs-card-img { transform: scale(1.04); }
        .stat-tile:hover { transform: translateY(-2px); }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        @media (max-width: 768px) {
          .cs-page-wrap { padding: 16px 12px !important; }
          .cs-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .cs-header-btn { width: 100% !important; justify-content: center !important; }
          .cs-top-row { grid-template-columns: 1fr !important; }
          .cs-stat-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .cs-form-cover-row { grid-template-columns: 1fr !important; }
          .cs-form-title-row { grid-template-columns: 1fr !important; }
          .cs-form-date-row { grid-template-columns: 1fr !important; }
          .cs-form-challenge-row { grid-template-columns: 1fr !important; }
          .cs-form-actions { flex-direction: column !important; }
          .cs-library-toolbar { flex-wrap: wrap !important; }
          .cs-library-search { width: 100% !important; }
          .cs-library-search input { width: 100% !important; }
          .cs-card-grid { grid-template-columns: 1fr 1fr !important; }
          .cs-list-header { display: none !important; }
          .cs-list-row { grid-template-columns: 40px 1fr 80px !important; }
          .cs-list-row-author, .cs-list-row-tags { display: none !important; }
          .cs-calendar-layout { grid-template-columns: 1fr !important; }
          .cs-calendar-events { order: 2; }
          .cs-calendar-grid { order: 1; }
          .cs-section-row { grid-template-columns: 1fr !important; }
          .cs-cell-events { display: flex; flex-direction: column; gap: 3; width: 100%; }
          .cs-cell-avatars { display: flex; align-items: center; }
          .cs-cell-dot { display: none; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 5px; height: 5px; border-radius: 50%; background: #3b82f6; }
          .cs-cell-events { display: none !important; }
          .cs-cell-avatars { display: none !important; }
          .cs-cell-dot { display: block !important; }
          .cs-cell-dot-today { background: rgba(255,255,255,0.85) !important; }
          .cs-cal-cell { height: 44px !important; min-height: 44px !important; max-height: 44px !important; overflow: hidden !important; position: relative !important; align-items: center !important; justify-content: center !important; flex-direction: row !important; padding: 0 !important; }
          .cs-cal-cell > span { position: absolute !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; margin: 0 !important; }
          .cs-cal-grid > div { height: 44px !important; min-height: 44px !important; max-height: 44px !important; }
          .cs-events-panel-desktop { display: none !important; }
          .cs-bottomsheet-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.45); display: none; align-items: center; justify-content: center; padding: 20px; }
          .cs-bottomsheet-overlay.active { display: flex; }
          .cs-bottomsheet { width: 100%; max-width: 420px; max-height: 80vh; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; animation: modalIn .22s cubic-bezier(.32,1.1,.6,1) both; }
          @keyframes modalIn { from { transform: scale(0.93); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        }
        @media (min-width: 769px) {
          .cs-events-panel-desktop { display: flex !important; }
          .cs-bottomsheet-overlay { display: none !important; }
        }
        @media (max-width: 480px) {
          .cs-stat-grid { grid-template-columns: 1fr !important; }
          .cs-card-grid { grid-template-columns: 1fr !important; }
          .cs-header h1 { font-size: 15px !important; }
        }
      `}</style>

      {toast && <Toast message={toast.msg} type={toast.type} />}

      {hoveredEvent && (() => {
    const { record: r, x, y } = hoveredEvent;
    const st = getStatusStyle(r.status);
    return <div style={{ position: "fixed", left: x, top: y - 8, transform: "translateX(-50%) translateY(-100%)", zIndex: 3e3, background: "var(--admin-surface)", border: `1px solid ${borderColor}`, borderRadius: 14, padding: "12px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", minWidth: 200, maxWidth: 260, pointerEvents: "none", fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)", width: 14, height: 7, overflow: "hidden" }}>
              <div style={{ width: 12, height: 12, background: "var(--admin-surface)", border: `1px solid ${borderColor}`, transform: "rotate(45deg)", margin: "-6px auto 0" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", lineHeight: 1.3 }}>{r.title}</p>
              <span style={{ fontSize: 8, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
            </div>
            {r.subtitle && <p style={{ fontSize: 10, color: textMuted, margin: "0 0 5px", fontFamily: "'Poppins', sans-serif" }}>{r.subtitle}</p>}
            <p style={{ fontSize: 10, color: textMuted, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif" }}>By <strong style={{ color: textSecondary }}>{formatAuthors(r.authors)}</strong></p>
            {r.start && <p style={{ fontSize: 10, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>📅 {r.start}</p>}
            {r.tags.length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 7 }}>
                {r.tags.slice(0, 3).map((t) => <span key={t} style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, background: subtleBg, border: `1px solid ${borderColor}`, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{t}</span>)}
              </div>}
          </div>;
  })()}

      <DashboardLoader isVisible={isFetchingFull} message="Loading case study…" />
      <DeleteModal isOpen={showDelete} isDeleting={isDeleting} targetTitle={deleteTarget?.title} onClose={() => setShowDelete(false)} onConfirm={handleDeleteConfirm} {...modalTheme} />
      <AiImageModal
        isOpen={showAiImageModal}
        prompt={aiImagePrompt}
        onPromptChange={setAiImagePrompt}
        isExpanding={isExpandingPrompt}
        isGenerating={isGeneratingImage}
        onExpandPrompt={handleExpandImagePrompt}
        onGenerate={handleGenerateAiImage}
        onClose={closeAiImageModal}
        {...modalTheme}
        inputBg={inputBg}
        isdarkmode={dark}
      />
      <PreviewModal isOpen={showPreview} data={previewData} allRecords={records} onClose={() => {
    setShowPreview(false);
    if (selectedDate) setShowBottomSheet(true);
  }} onEdit={(r) => handleEdit(r, showCalendarPage ? "calendar" : "main")} closeLabel={selectedDate ? "\u2190 Back to events" : "Close"} {...modalTheme} />
      <CalendarModal isOpen={showCalendar} records={records} selectedMonthIndex={selectedMonthIndex} onClose={() => setShowCalendar(false)} onMonthChange={setSelectedMonthIndex} onDateClick={handleDayClick} {...modalTheme} />
      <DateModal isOpen={showDateModal} dateStr={selectedDate} studies={selectedDateStudies} onClose={() => setShowDateModal(false)} onSelectStudy={(r) => {
    handleView(r);
  }} {...modalTheme} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={formRef}>

        {
    /* PAGE HEADER */
  }
        <PageHeader title={addMode ? "Add case study" : "Case study list"} subtitle="Manage your case studies / Create, edit, and organize your research projects with ease" actions={addMode ? null : showFormOnly || showCalendarPage ? <button onClick={() => {
    setShowFormOnly(false);
    setShowCalendarPage(false);
    setIsEditMode(false);
    setEditingId(null);
    setForm(getDefaultForm());
    authorFileRefs.current = [];
    setCoverPreview("");
    setCoverFile(null);
  }} className="cs-header-btn" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back to Case Studies
            </button> : null} />

        {
    /* TOP ROW */
  }
        {!showFormOnly && !showCalendarPage && <div className="cs-top-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)", gap: 16, marginBottom: 16, alignItems: "stretch" }}>
          <div style={{ ...card, padding: "22px 22px" }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Quick stats</p>
              <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Current system overview and counts</p>
            </div>
            <div className="cs-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 0 }}>
              {statTileConfigs.map((cfg, idx) => <div key={idx} className="stat-tile" style={{ transition: "transform .18s" }}>
                  <StatTile label={cfg.label} count={cfg.count} gradient={cfg.gradient} gradientLight={cfg.gradientLight} accentColor={cfg.accentColor} accentColorLight={cfg.accentColorLight} iconPath={cfg.iconPath} change={cfg.change} changeUp={cfg.changeUp} dark={dark} />
                </div>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, marginTop: 14, borderTop: `1px solid ${borderColor}` }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: textPrimary, margin: "0 0 2px", fontFamily: "'Poppins', sans-serif" }}>Total case studies</p>
                <p style={{ fontSize: 10, color: textMuted, margin: 0, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>All statuses combined</p>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: textPrimary, lineHeight: 1, fontFamily: "'Poppins', sans-serif" }}>{isFetchingRecords ? "\u2026" : records.length}</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontFamily: "'Poppins', sans-serif" }}>entries</span>
              </div>
            </div>
          </div>
          <div style={{ ...card, padding: "22px 22px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Timeline & events</p>
                <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Scheduled activities and research milestones</p>
              </div>
              <button onClick={() => setShowCalendarPage(true)} className="icon-btn" style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${borderColor}`, background: subtleBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted, flexShrink: 0 }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
              </button>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <MiniCalendar records={records} subtleBg={subtleBg} borderColor={borderColor} textSecondary={textSecondary} textMuted={textMuted} onDayClick={handleDayClick} onOpenCalendar={() => setShowCalendarPage(true)} />
            </div>
          </div>
        </div>}

        {
    /* FORM */
  }
        {(showFormOnly || isEditMode) && !showCalendarPage && <div className="cs-form-wrap" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>

          {
    /* STEP 1 — Cover & Basic Information */
  }
          <div style={{ ...card, padding: "22px 22px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, border: "1.5px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)", color: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>1</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Cover &amp; Basic Information</p>
                <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Add a compelling cover and essential details</p>
              </div>
            </div>
            <div className="cs-form-cover-row" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 18 }}>
              <div>
                <div onClick={() => fileRef.current?.click()} onDragOver={(e) => {
    e.preventDefault();
    setDragOver(true);
  }} onDragLeave={() => setDragOver(false)} onDrop={(e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }} style={{ border: `1.5px dashed ${dragOver ? "var(--admin-accent)" : borderColor}`, borderRadius: 14, cursor: "pointer", transition: "all .15s", overflow: "hidden", aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: dragOver ? "color-mix(in srgb, var(--admin-accent) 4%, transparent)" : subtleBg, position: "relative" }}>
                  {coverPreview ? <img src={coverPreview} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} /> : <>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "color-mix(in srgb, var(--admin-accent) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                        <svg width="18" height="18" fill="none" stroke="var(--admin-accent)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p style={{ fontSize: 12, color: textPrimary, margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>Upload cover image</p>
                      <p style={{ fontSize: 10, color: textMuted, margin: "5px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>PNG, JPG, WebP · Max 10MB</p>
                      <p style={{ fontSize: 10, color: textMuted, margin: "1px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Recommended: 16:9 ratio</p>
                    </>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files?.[0])} />
                <button type="button" onClick={openAiImageModal} style={{ width: "100%", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 0", borderRadius: 10, border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  Generate with AI
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="cs-form-title-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <span style={lbl}>Title <span style={{ color: "var(--admin-accent)" }}>*</span></span>
                    <input style={inp()} placeholder="Enter case study title..." value={form.title} onChange={(e) => updateForm("title", e.target.value)} />
                  </div>
                  <div>
                    <span style={lbl}>Subtitle</span>
                    <input style={inp()} placeholder="Enter a short subtitle (optional)..." value={form.subtitle} onChange={(e) => updateForm("subtitle", e.target.value)} />
                  </div>
                </div>
                <div>
                  <span style={lbl}>Status <span style={{ color: "var(--admin-accent)" }}>*</span></span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {STATUS_OPTIONS.map((s) => {
    const st = getStatusStyle(s);
    const sel = form.status === s;
    return <button key={s} className="pill-btn" onClick={() => updateForm("status", s)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: sel ? st.border : `1px solid ${borderColor}`, background: sel ? st.bg : "transparent", color: sel ? st.color : textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif" }}>
                          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={STATUS_ICON_PATHS[s]} /></svg>
                          {s}
                          {sel && <svg width="12" height="12" fill="none" stroke={st.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                        </button>;
  })}
                  </div>
                  {form.status === "Scheduled" && <div style={{ maxWidth: 320, marginTop: 14 }}>
                      <span style={lbl}>Schedule date &amp; time <span style={{ color: "var(--admin-accent)" }}>*</span></span>
                      <input type="datetime-local" style={inp()} value={form.scheduleAt} onChange={(e) => updateForm("scheduleAt", e.target.value)} />
                      <p style={{ fontSize: 10, color: textMuted, margin: "5px 0 0" }}>Becomes Active (visible on the public site) automatically at this time.</p>
                    </div>}
                </div>
              </div>
            </div>
          </div>

          {
    /* STEP 2 — Authors */
  }
          <div style={{ ...card, padding: "22px 22px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, border: "1.5px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)", color: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>2</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Authors <span style={{ color: "var(--admin-accent)" }}>*</span></p>
                  <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Add the people behind this case study</p>
                </div>
              </div>
              <button onClick={addAuthor} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--admin-accent)", background: "transparent", border: `1px solid ${borderColor}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontFamily: "'Poppins', sans-serif", flexShrink: 0 }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Add author
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {form.authors.map((a, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, background: subtleBg, border: `1px solid ${borderColor}` }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div onClick={() => authorFileRefs.current[i]?.click()} style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", cursor: "pointer", border: `1.5px dashed ${borderColor}`, background: inputBg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      {a.image ? <img src={a.image} alt={a.name || "author"} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <svg width="16" height="16" fill="none" stroke={textMuted} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    </div>
                    {a.image && <button onClick={() => removeAuthorImage(i)} style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, borderRadius: "50%", border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                        <svg width="8" height="8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>}
                    <input
    ref={(el) => {
      authorFileRefs.current[i] = el;
    }}
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={(e) => {
      const f = e.target.files?.[0];
      if (f) updateAuthorImage(i, f);
      e.target.value = "";
    }}
  />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input style={inp()} placeholder="Author name..." value={a.name} onChange={(e) => updateAuthorName(i, e.target.value)} />
                  </div>
                  {form.authors.length > 1 && <button onClick={() => removeAuthor(i)} className="icon-btn" style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>}
                </div>)}
            </div>
          </div>

          {
    /* STEP 3 — Details */
  }
          <div style={{ ...card, padding: "22px 22px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, border: "1.5px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)", color: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>3</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Details</p>
                <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Categorize and provide key information</p>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={lbl}>Categories <span style={{ color: "var(--admin-accent)" }}>*</span></span>
                {form.tags.length > 0 && <button onClick={() => updateForm("tags", [])} style={{ fontSize: 11, color: "var(--admin-accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>Clear</button>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORY_OPTIONS.map((t) => {
    const sel = form.tags.includes(t);
    return <button key={t} className="pill-btn" onClick={() => toggleTag(t)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: sel ? "1px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)" : `1px solid ${borderColor}`, background: sel ? "color-mix(in srgb, var(--admin-accent) 8%, transparent)" : "transparent", color: sel ? "var(--admin-accent)" : textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif" }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CATEGORY_ICON_PATHS[t]} /></svg>
                      {t}
                    </button>;
  })}
              </div>
            </div>

            <div className="cs-form-date-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
              <div>
                <span style={lbl}>Start date <span style={{ color: "var(--admin-accent)" }}>*</span></span>
                <input type="date" style={inp()} value={form.startDate} onChange={(e) => updateForm("startDate", e.target.value)} />
              </div>
              <div>
                <span style={lbl}>End date</span>
                <input type="date" style={inp()} value={form.endDate} onChange={(e) => updateForm("endDate", e.target.value)} />
              </div>
            </div>
            <div className="cs-form-challenge-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <span style={lbl}>Challenge <span style={{ color: "var(--admin-accent)" }}>*</span></span>
                <RichTextArea placeholder="Describe the challenge or problem..." value={form.challenge} onChange={(html) => updateForm("challenge", html)} minHeight={84} />
              </div>
              <div>
                <span style={lbl}>Solution <span style={{ color: "var(--admin-accent)" }}>*</span></span>
                <RichTextArea placeholder="Describe the solution and approach..." value={form.solution} onChange={(html) => updateForm("solution", html)} minHeight={84} />
              </div>
            </div>
          </div>

          {
    /* STEP 4 — Content Sections */
  }
          <div style={{ ...card, padding: "22px 22px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, border: "1.5px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)", color: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>4</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Content Sections</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Organize your case study content into sections</p>
                </div>
              </div>
              {form.sections.length < 5 && <button onClick={addSection} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--admin-accent)", background: "transparent", border: `1px solid ${borderColor}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontFamily: "'Poppins', sans-serif", flexShrink: 0 }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Add section
                </button>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {form.sections.map((s, i) => <div key={i} className="cs-section-row" style={{ display: "grid", gridTemplateColumns: "200px 1fr auto", gap: 12, padding: "14px 16px", borderRadius: 14, background: subtleBg, border: `1px solid ${borderColor}`, alignItems: "start" }}>
                  <div>
                    <span style={{ ...lbl, marginBottom: 6 }}>Topic {i + 1}</span>
                    <input style={inp()} placeholder="Topic title..." value={s.topic} onChange={(e) => updateSection(i, "topic", e.target.value)} />
                  </div>
                  <div>
                    <span style={{ ...lbl, marginBottom: 6 }}>Content</span>
                    <RichTextArea placeholder="Write content for this section..." value={s.content} onChange={(html) => updateSection(i, "content", html)} minHeight={60} />
                  </div>
                  {form.sections.length > 1 && <button onClick={() => removeSection(i)} className="icon-btn" style={{ marginTop: 21, width: 34, height: 34, borderRadius: 9, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>}
                </div>)}
              {form.sections.length < 5 && <button onClick={addSection} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", borderRadius: 12, border: `1.5px dashed ${borderColor}`, background: "transparent", color: textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Add another section
                </button>}
            </div>
          </div>

          <div className="cs-form-actions" style={{ display: "flex", gap: 10 }}>
            <button onClick={() => {
    if (isEditMode) {
      if (returnTo === "calendar") {
        resetForm();
        setShowCalendarPage(true);
      } else {
        resetForm();
      }
    } else {
      clearForm();
    }
  }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, flex: 1, padding: "13px 0", borderRadius: 12, border: `1px solid ${borderColor}`, background: cardBg, color: textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              {isEditMode ? "Cancel edit" : "Reset form"}
            </button>
            <button onClick={() => setShowConfirm(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, flex: 2, padding: "13px 0", borderRadius: 12, border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              {isEditMode ? "Update case study" : "Create case study"}
            </button>
          </div>
        </div>}

        {
    /* CALENDAR PAGE */
  }
        {showCalendarPage && (() => {
    const now = /* @__PURE__ */ new Date();
    const y = now.getFullYear();
    const m = selectedMonthIndex;
    const today = now.getDate();
    const isCurrentMonth = m === now.getMonth();
    const cells = getCalendarDays(m);
    const dateStrFn = (d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const monthPrefix = `${y}-${String(m + 1).padStart(2, "0")}`;
    const monthEvents = records.filter((r) => r.start.startsWith(monthPrefix));
    const todayStr = `${y}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const dayStr = selectedDate || todayStr;
    const dayEvents = records.filter((r) => r.start === dayStr);
    const dayLabel = selectedDate ? selectedDate : "Today";
    const EVENT_LIMIT = 5;
    const tabEvents = eventPanelTab === "today" ? dayEvents : monthEvents;
    const visibleEvents = showAllEvents ? tabEvents : tabEvents.slice(0, EVENT_LIMIT);
    const hasMore = tabEvents.length > EVENT_LIMIT;
    return <div className="cs-calendar-layout" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, alignItems: "start" }}>
              <div className="cs-calendar-events cs-events-panel-desktop" style={{ ...card, padding: "0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ background: "var(--admin-accent)", padding: "16px 18px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 7 }}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Events
                  </p>
                </div>
                <div style={{ height: 1, background: borderColor }} />
                <div style={{ display: "flex", borderBottom: `1px solid ${borderColor}` }}>
                  {["today", "month"].map((tab) => <button
      key={tab}
      onClick={() => {
        setEventPanelTab(tab);
        setShowAllEvents(false);
        if (tab === "month") {
          setSelectedDate("");
          setSelectedDateStudies([]);
        }
      }}
      style={{ flex: 1, padding: "9px 0", border: "none", background: "transparent", borderBottom: eventPanelTab === tab ? "2px solid var(--admin-accent)" : "2px solid transparent", color: eventPanelTab === tab ? "var(--admin-accent)" : textMuted, fontSize: 11, fontWeight: eventPanelTab === tab ? 600 : 400, cursor: "pointer", fontFamily: "'Poppins', sans-serif", transition: "all .15s" }}
    >
                      {tab === "today" ? dayLabel : MONTHS[m]}
                    </button>)}
                </div>
                <div style={{ padding: "10px 18px 6px" }}>
                  <p style={{ fontSize: 10, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{tabEvents.length} event{tabEvents.length !== 1 ? "s" : ""}{eventPanelTab === "today" ? ` \u2014 ${dayLabel}` : ` \u2014 ${MONTHS[m]}`}</p>
                </div>
                <div style={{ padding: "0 18px", overflowY: showAllEvents ? "auto" : "visible", maxHeight: showAllEvents ? 320 : "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {tabEvents.length === 0 ? <div style={{ padding: "28px 0", textAlign: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: subtleBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                        <svg width="16" height="16" fill="none" stroke={textMuted} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>No events</p>
                    </div> : visibleEvents.map((r) => {
      const st = getStatusStyle(r.status);
      return <div key={r._id} onClick={() => handleView(r)} style={{ padding: "10px 12px", borderRadius: 12, border: `1px solid ${borderColor}`, background: subtleBg, cursor: "pointer", transition: "all .15s", flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                          <span style={{ fontSize: 8, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                        </div>
                        <p style={{ fontSize: 10, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{r.start} · {formatAuthors(r.authors)}</p>
                      </div>;
    })}
                </div>
                {hasMore && <div style={{ padding: "10px 18px 16px" }}>
                    <button onClick={() => setShowAllEvents(!showAllEvents)} style={{ width: "100%", fontSize: 10, fontWeight: 500, color: "var(--admin-accent)", background: "color-mix(in srgb, var(--admin-accent) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--admin-accent) 18%, transparent)", borderRadius: 8, padding: "7px 0", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                      {showAllEvents ? `\u2191 Show less` : `\u2193 Show all ${tabEvents.length} events`}
                    </button>
                  </div>}
                {!hasMore && <div style={{ height: 16 }} />}
              </div>

              <div className="cs-calendar-grid" style={{ ...card, padding: "0", overflow: "hidden" }}>
                <div style={{ background: "var(--admin-accent)", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 7 }}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Timeline & Events
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => {
      setSelectedMonthIndex(m === 0 ? 11 : m - 1);
      setSelectedDate("");
      setSelectedDateStudies([]);
    }} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", minWidth: 110, textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>{MONTHS[m]} {y}</span>
                    <button onClick={() => {
      setSelectedMonthIndex(m === 11 ? 0 : m + 1);
      setSelectedDate("");
      setSelectedDateStudies([]);
    }} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
                <div style={{ height: 1, background: borderColor }} />
                <div style={{ padding: "16px 22px 20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: textMuted, padding: "4px 0", fontFamily: "'Poppins', sans-serif" }}>{d}</div>)}
                  </div>
                  <div className="cs-cal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 16 }}>
                    {cells.map((d, i) => {
      if (!d) return <div key={i} style={isMobile ? { height: 44, minHeight: 44 } : { minHeight: 72 }} />;
      const isToday = isCurrentMonth && d === today;
      const ds = dateStrFn(d);
      const evs = records.filter((r) => r.start === ds);
      const isSelected = selectedDate === ds;
      return <div
        key={i}
        className="cs-cal-cell"
        onClick={() => {
          if (isSelected) {
            setSelectedDate("");
            setSelectedDateStudies([]);
            setShowBottomSheet(false);
          } else {
            setSelectedDate(ds);
            setSelectedDateStudies(evs);
            setEventPanelTab("today");
            setShowAllEvents(false);
            setShowBottomSheet(true);
          }
        }}
        style={{ ...isMobile ? { height: 44, minHeight: 44, maxHeight: 44, overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 } : { minHeight: 72, maxHeight: 100, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "6px 7px", position: "relative" }, borderRadius: 10, cursor: "pointer", background: isToday ? "var(--admin-accent)" : isSelected ? "color-mix(in srgb, var(--admin-accent) 5%, transparent)" : subtleBg, border: isToday ? "none" : isSelected ? "1.5px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)" : evs.length ? "1px solid rgba(59,130,246,0.22)" : `1px solid ${borderColor}`, transition: "all .15s" }}
      >
                          <span style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, lineHeight: 1, color: isToday ? "#fff" : isSelected ? "var(--admin-accent)" : textMuted, flexShrink: 0, marginBottom: isMobile ? 0 : 3, fontFamily: "'Poppins', sans-serif" }}>{d}</span>
                          {evs.length > 0 && !isMobile && <div className="cs-cell-events">
                              <div onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredEvent({ record: evs[0], x: rect.left + rect.width / 2, y: rect.top });
      }} onMouseLeave={() => setHoveredEvent(null)} style={{ width: "100%", fontSize: 9, fontWeight: 500, color: isToday ? "rgba(255,255,255,0.9)" : "#3b82f6", background: isToday ? "rgba(255,255,255,0.18)" : "rgba(59,130,246,0.12)", borderRadius: 4, padding: "2px 5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", cursor: "pointer", maxWidth: "100%", flexShrink: 0 }}>{evs[0].title}</div>
                            </div>}
                          {evs.length > 0 && <div className={`cs-cell-dot${isToday ? " cs-cell-dot-today" : ""}`} />}
                          {evs.length > 1 && !isMobile && <div className="cs-cell-avatars" style={{ gap: 0, marginTop: "auto", paddingTop: 4 }}>
                              {evs.slice(1, 4).map((ev, idx) => <div key={ev._id} onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredEvent({ record: ev, x: rect.left + rect.width / 2, y: rect.top });
      }} onMouseLeave={() => setHoveredEvent(null)} style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, background: `hsl(${(idx * 75 + 190) % 360}, 52%, 58%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff", border: `1.5px solid ${isToday ? "rgba(255,255,255,0.4)" : cardBg}`, marginLeft: idx > 0 ? -5 : 0, fontFamily: "'Poppins', sans-serif", cursor: "pointer" }}>{ev.title.charAt(0).toUpperCase()}</div>)}
                              {evs.length > 4 && <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, background: isToday ? "rgba(255,255,255,0.22)" : dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, color: isToday ? "#fff" : textMuted, border: `1.5px solid ${isToday ? "rgba(255,255,255,0.4)" : cardBg}`, marginLeft: -5, fontFamily: "'Poppins', sans-serif" }}>+{evs.length - 4}</div>}
                            </div>}
                        </div>;
    })}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 12, borderTop: `1px solid ${borderColor}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "var(--admin-accent)" }} /><span style={{ fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Today</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} /><span style={{ fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Has events</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "color-mix(in srgb, var(--admin-accent) 8%, transparent)", border: "1.5px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)" }} /><span style={{ fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Selected</span></div>
                  </div>
                </div>
              </div>
            </div>;
  })()}

        {
    /* MOBILE BOTTOM SHEET */
  }
        {showCalendarPage && showBottomSheet && typeof window !== "undefined" && window.innerWidth <= 768 && <div className={`cs-bottomsheet-overlay${showBottomSheet ? " active" : ""}`} onClick={() => {
    setShowBottomSheet(false);
    setSelectedDate("");
    setSelectedDateStudies([]);
  }}>
            <div className="cs-bottomsheet" style={{ background: cardBg }} onClick={(e) => e.stopPropagation()}>
              <div style={{ background: "var(--admin-accent)", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 7 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {selectedDate || "Events"}
                </p>
                <button onClick={() => {
    setShowBottomSheet(false);
    setSelectedDate("");
    setSelectedDateStudies([]);
  }} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div style={{ height: 1, background: borderColor }} />
              <div style={{ display: "flex", borderBottom: `1px solid ${borderColor}` }}>
                {["today", "month"].map((tab) => {
    const m2 = selectedMonthIndex;
    const dayLabel2 = selectedDate || "Today";
    return <button key={tab} onClick={() => {
      setEventPanelTab(tab);
      if (tab === "month") {
        setSelectedDate("");
        setSelectedDateStudies([]);
      }
    }} style={{ flex: 1, padding: "9px 0", border: "none", background: "transparent", borderBottom: eventPanelTab === tab ? "2px solid var(--admin-accent)" : "2px solid transparent", color: eventPanelTab === tab ? "var(--admin-accent)" : textMuted, fontSize: 11, fontWeight: eventPanelTab === tab ? 600 : 400, cursor: "pointer", fontFamily: "'Poppins', sans-serif", transition: "all .15s" }}>
                      {tab === "today" ? dayLabel2 : MONTHS[m2]}
                    </button>;
  })}
              </div>
              <div style={{ padding: "8px 18px 4px" }}>
                <p style={{ fontSize: 10, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                  {(eventPanelTab === "today" ? selectedDateStudies : records.filter((r) => r.start.startsWith(`${(/* @__PURE__ */ new Date()).getFullYear()}-${String(selectedMonthIndex + 1).padStart(2, "0")}`))).length} events
                </p>
              </div>
              <div style={{ overflowY: "auto", flex: 1, padding: "0 18px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                {(() => {
    const monthPrefix2 = `${(/* @__PURE__ */ new Date()).getFullYear()}-${String(selectedMonthIndex + 1).padStart(2, "0")}`;
    const listEvents = eventPanelTab === "today" ? selectedDateStudies : records.filter((r) => r.start.startsWith(monthPrefix2));
    return listEvents.length === 0 ? <div style={{ padding: "28px 0", textAlign: "center" }}><p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>No events</p></div> : listEvents.map((r) => {
      const st = getStatusStyle(r.status);
      return <div key={r._id} onClick={() => {
        setShowBottomSheet(false);
        handleView(r);
      }} style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${borderColor}`, background: subtleBg, cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                          <span style={{ fontSize: 8, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                        </div>
                        {r.subtitle && <p style={{ fontSize: 11, color: textMuted, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif" }}>{r.subtitle}</p>}
                        <p style={{ fontSize: 10, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>By {formatAuthors(r.authors)} · {r.start}</p>
                      </div>;
    });
  })()}
              </div>
            </div>
          </div>}

        {
    /* LIBRARY */
  }
        {!showFormOnly && !showCalendarPage && <div style={{ ...card, overflow: "hidden" }}>
          <div className="cs-library-toolbar" style={{ padding: "13px 18px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Case study library</p>
              <p style={{ fontSize: 10, color: textMuted, margin: "2px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>All registered analysis and records</p>
            </div>
            <div style={{ flex: 1 }} />
            <div className="cs-library-search" style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: textMuted, pointerEvents: "none" }} width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search by title or author..." value={search} onChange={(e) => setSearch(e.target.value)} style={inp({ width: 210, paddingLeft: 30, fontSize: 11 })} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: textMuted, fontWeight: 400, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>Sort by</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={inp({ width: "auto", padding: "7px 10px", fontSize: 11 })}>
                <option value="date-newest">Newest first</option>
                <option value="date-oldest">Oldest first</option>
                <option value="alpha-asc">Name A → Z</option>
                <option value="alpha-desc">Name Z → A</option>
              </select>
            </div>
            <div style={{ width: 1, height: 20, background: borderColor }} />
            <div style={{ display: "flex", border: `1px solid ${borderColor}`, borderRadius: 8, overflow: "hidden" }}>
              <button onClick={() => setViewMode("grid")} style={{ padding: "6px 9px", border: "none", borderRight: `1px solid ${borderColor}`, background: viewMode === "grid" ? "var(--admin-accent)" : "transparent", color: viewMode === "grid" ? "#fff" : textMuted, cursor: "pointer", display: "flex", alignItems: "center", transition: "all .15s" }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode("list")} style={{ padding: "6px 9px", border: "none", background: viewMode === "list" ? "var(--admin-accent)" : "transparent", color: viewMode === "list" ? "#fff" : textMuted, cursor: "pointer", display: "flex", alignItems: "center", transition: "all .15s" }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>

          <div style={{ display: "flex", padding: "0 18px", borderBottom: `1px solid ${borderColor}`, background: subtleBg }}>
            {["All", "Active", "Draft", "Completed", "Scheduled"].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "9px 12px", border: "none", borderBottom: activeTab === tab ? "2px solid var(--admin-accent)" : "2px solid transparent", background: "transparent", color: activeTab === tab ? "var(--admin-accent)" : textMuted, fontSize: 11, fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>
                {tab}
                <span style={{ marginLeft: 5, fontSize: 9, padding: "1px 5px", borderRadius: 10, background: activeTab === tab ? "color-mix(in srgb, var(--admin-accent) 10%, transparent)" : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: activeTab === tab ? "var(--admin-accent)" : textMuted, fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>
                  {counts[tab]}
                </span>
              </button>)}
            <div style={{ flex: 1 }} />
            <span style={{ alignSelf: "center", fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>
              Showing <strong style={{ color: textSecondary, fontFamily: "'Poppins', sans-serif" }}>{filtered.length}</strong> of <strong style={{ color: textSecondary, fontFamily: "'Poppins', sans-serif" }}>{records.length}</strong>
            </span>
          </div>

          <div className="cs-tag-filter" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderBottom: `1px solid ${borderColor}`, flexWrap: "wrap", background: cardBg }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: textMuted, marginRight: 2, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>Category:</span>
            {LIB_CATEGORIES.map((tag) => {
    const sel = activeTagFilter === tag;
    return <button key={tag} className="pill-btn" onClick={() => setActiveTagFilter(tag)} style={{ padding: "3px 11px", borderRadius: 20, fontSize: 10, fontWeight: 500, cursor: "pointer", transition: "all .15s", border: sel ? "1px solid color-mix(in srgb, var(--admin-accent) 30%, transparent)" : `1px solid ${borderColor}`, background: sel ? "color-mix(in srgb, var(--admin-accent) 9%, transparent)" : subtleBg, color: sel ? "var(--admin-accent)" : textMuted, fontFamily: "'Poppins', sans-serif" }}>{tag}</button>;
  })}
          </div>

          <DashboardLoader isVisible={initialLoading} message="Loading case studies…" />

          {!initialLoading && filtered.length === 0 && <div style={{ padding: "48px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: textMuted, fontWeight: 500, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif" }}>No case studies found</p>
              <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{search ? "Try adjusting your search." : "Create your first case study above."}</p>
            </div>}

          {!initialLoading && filtered.length > 0 && viewMode === "grid" && <div className="cs-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, padding: 16 }}>
              {filtered.map((r) => {
    const st = getStatusStyle(r.status);
    const isBeingEdited = editingId === r._id;
    const coverSrc = getCardCover(r, records);
    return <div key={r._id} className="cs-card" style={{ border: `1px solid ${isBeingEdited ? "var(--admin-accent)" : borderColor}`, borderRadius: 14, overflow: "hidden", background: cardBg, display: "flex", flexDirection: "column" }}>
                    <div style={{ height: 140, position: "relative", overflow: "hidden", flexShrink: 0, background: "#e5e7eb" }}>
                      <img src={coverSrc} alt={r.title} className="cs-card-img" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => {
      const el = e.currentTarget;
      el.style.display = "none";
      const parent = el.parentElement;
      if (parent) parent.style.background = "linear-gradient(135deg,color-mix(in srgb, var(--admin-accent) 18%, transparent),color-mix(in srgb, var(--admin-accent) 4%, transparent))";
    }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.38) 100%)" }} />
                      <div style={{ position: "absolute", bottom: 8, left: 8 }}>
                        <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "3px 8px", borderRadius: 5, background: "color-mix(in srgb, var(--admin-accent) 88%, transparent)", color: "#fff", fontFamily: "'Poppins', sans-serif" }}>Case study</span>
                      </div>
                      {isBeingEdited && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: "var(--admin-accent)", color: "#fff", fontFamily: "'Poppins', sans-serif" }}>Editing</div>}
                    </div>
                    <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                      {r.subtitle && <p style={{ fontSize: 10, color: textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{r.subtitle}</p>}
                      <p style={{ fontSize: 10, color: textMuted, margin: 0, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>By <span style={{ color: textSecondary, fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>{formatAuthors(r.authors)}</span></p>
                      {r.tags.length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {r.tags.slice(0, 3).map((t) => <span key={t} style={{ fontSize: 8, fontWeight: 500, padding: "2px 7px", borderRadius: 4, background: subtleBg, border: `1px solid ${borderColor}`, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{t}</span>)}
                          {r.tags.length > 3 && <span style={{ fontSize: 9, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>+{r.tags.length - 3}</span>}
                        </div>}
                      <div style={{ flex: 1 }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 9, borderTop: `1px solid ${borderColor}`, marginTop: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => handleView(r)} style={{ padding: "4px 9px", borderRadius: 7, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>View</button>
                          <button onClick={() => handleEdit(r, "main")} style={{ padding: "4px 9px", borderRadius: 7, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Edit</button>
                          <button onClick={() => {
      setDeleteTarget(r);
      setShowDelete(true);
    }} style={{ padding: "4px 8px", borderRadius: 7, border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.07)", color: "#dc2626", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>;
  })}
            </div>}

          {!initialLoading && filtered.length > 0 && viewMode === "list" && <div>
              <div className="cs-list-header" style={{ display: "grid", gridTemplateColumns: "48px 2fr 1fr 2fr 110px 130px", gap: 14, padding: "9px 18px", background: subtleBg, fontSize: 9, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: `1px solid ${borderColor}`, fontFamily: "'Poppins', sans-serif" }}>
                <span>Cover</span><span>Title</span><span>Authors</span><span>Tags</span><span>Status</span><span style={{ textAlign: "right" }}>Actions</span>
              </div>
              {filtered.map((r, i) => {
    const st = getStatusStyle(r.status);
    const coverSrc = getCardCover(r, records);
    return <div key={r._id} className="arc-row cs-list-row" style={{ display: "grid", gridTemplateColumns: "48px 2fr 1fr 2fr 110px 130px", gap: 14, alignItems: "center", padding: "10px 18px", borderBottom: i < filtered.length - 1 ? `1px solid ${borderColor}` : "none", transition: "background .15s" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#e5e7eb" }}>
                      <img src={coverSrc} alt={r.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => {
      const el = e.currentTarget;
      el.style.display = "none";
      const parent = el.parentElement;
      if (parent) parent.style.background = "linear-gradient(135deg,color-mix(in srgb, var(--admin-accent) 18%, transparent),color-mix(in srgb, var(--admin-accent) 4%, transparent))";
    }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                      {r.subtitle && <p style={{ fontSize: 10, color: textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{r.subtitle}</p>}
                    </div>
                    <p className="cs-list-row-author" style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{formatAuthors(r.authors)}</p>
                    <div className="cs-list-row-tags" style={{ display: "flex", gap: 4, flexWrap: "wrap", minWidth: 0 }}>
                      {r.tags.slice(0, 2).map((t) => <span key={t} style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, background: subtleBg, border: `1px solid ${borderColor}`, color: textMuted, fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>{t}</span>)}
                      {r.tags.length > 2 && <span style={{ fontSize: 9, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>+{r.tags.length - 2}</span>}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, display: "inline-block", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <button onClick={() => handleView(r)} style={{ padding: "4px 9px", borderRadius: 7, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>View</button>
                      <button onClick={() => handleEdit(r, "main")} style={{ padding: "4px 9px", borderRadius: 7, border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Edit</button>
                      <button onClick={() => {
      setDeleteTarget(r);
      setShowDelete(true);
    }} style={{ padding: "4px 8px", borderRadius: 7, border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.07)", color: "#dc2626", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>;
  })}
              <div style={{ padding: "9px 18px", background: subtleBg, borderTop: `1px solid ${borderColor}`, fontSize: 10, color: textMuted, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
                {filtered.length} item{filtered.length !== 1 ? "s" : ""} displayed
                {activeTab !== "All" ? ` \xB7 filtered by "${activeTab}"` : ""}
                {activeTagFilter !== "All" ? ` \xB7 category "${activeTagFilter}"` : ""}
                {search ? ` \xB7 matching "${search}"` : ""}
              </div>
            </div>}
        </div>}

      </div>
    </div>;
}
export {
  CaseStudies as default
};
