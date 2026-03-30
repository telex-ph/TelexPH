"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface PersonalInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  dob: string;
  gender: string;
}

interface ServiceSelection {
  services: string[];
  experienceLevel: string;
  availability: string;
  timezone: string;
  rate: string;
  startDate: string;
}

interface UploadedFile {
  file: File;
  label: string;
}

interface ResumeStep {
  resume: UploadedFile | null;
  coverLetter: string;
}

interface FormData {
  personal: PersonalInfo;
  service: ServiceSelection;
  resume: ResumeStep;
}

type Step = 1 | 2 | 3 | 4;
type FormErrors = Partial<Record<string, string>>;

interface StepDef {
  id: Step;
  label: string;
  icon: string;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const COUNTRIES: string[] = [
  "Philippines","United States","United Kingdom","Canada","Australia",
  "India","Singapore","Malaysia","New Zealand","Other",
];

const TIMEZONES: string[] = [
  "Philippine Standard Time (PHT, UTC+8)",
  "Eastern Time (ET, UTC-5/-4)",
  "Central Time (CT, UTC-6/-5)",
  "Mountain Time (MT, UTC-7/-6)",
  "Pacific Time (PT, UTC-8/-7)",
  "Greenwich Mean Time (GMT, UTC+0)",
  "Central European Time (CET, UTC+1)",
  "Australian Eastern Time (AEST, UTC+10)",
  "Singapore Standard Time (SST, UTC+8)",
  "India Standard Time (IST, UTC+5:30)",
];

interface ServiceGroup {
  category: string;
  icon: string;
  services: string[];
}

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    category: "Client Services",
    icon: "🤝",
    services: [
      "Customer Service Representative",
      "Technical Support Representative",
    ],
  },
  {
    category: "Web & Design",
    icon: "🎨",
    services: [
      "Web Development",
      "Social Media Management",
      "Video & Graphics Design",
    ],
  },
  {
    category: "Funnels & Systems",
    icon: "⚙️",
    services: [
      "Funnel Builder",
      "Website Builder",
      "Surveys & Forms System",
      "Document Signing System",
      "Booking & Appointment System",
      "Courses & Digital Products System",
    ],
  },
  {
    category: "Automation & AI",
    icon: "🤖",
    services: [
      "AI Builder (Chatbots / AI Systems)",
      "Automation Builder (Advanced Workflows)",
    ],
  },
  {
    category: "Marketing & CRM",
    icon: "📣",
    services: [
      "Email Marketing Management",
      "CRM System Setup & Management",
    ],
  },
  {
    category: "Platform Services",
    icon: "🏷️",
    services: [
      "Gray-Label Platform",
      "White-Label Platform",
    ],
  },
];

const STEPS: StepDef[] = [
  { id: 1, label: "Personal", icon: "personal" },
  { id: 2, label: "Services", icon: "services" },
  { id: 3, label: "Resume",   icon: "resume" },
  { id: 4, label: "Review",   icon: "review" },
];

// ─────────────────────────────────────────────
// STEP ICONS (SVG)
// ─────────────────────────────────────────────
const StepIcon: React.FC<{ name: string; color?: string }> = ({ name, color = "currentColor" }) => {
  const s = { width: 20, height: 20, stroke: color, fill: "none", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "personal") return (
    <svg viewBox="0 0 24 24" {...s}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
  if (name === "services") return (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
  if (name === "resume") return (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
  );
  if (name === "review") return (
    <svg viewBox="0 0 24 24" {...s}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  return null;
};

// ─────────────────────────────────────────────
// CSS — White & Maroon Theme
// ─────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --maroon:       #8B0000;
  --maroon-dark:  #5a0000;
  --maroon-deep:  #3a0000;
  --maroon-light: #b30000;
  --maroon-tint:  rgba(139,0,0,.06);
  --maroon-tint2: rgba(139,0,0,.11);

  --white:   #ffffff;
  --off:     #faf8f8;
  --surface: #ffffff;
  --border:  rgba(139,0,0,.11);
  --border2: rgba(139,0,0,.2);

  --text:   #1a0505;
  --text2:  rgba(26,5,5,.62);
  --text3:  rgba(26,5,5,.38);

  --success: #3db87a;
  --error:   #e05c6e;

  --r:    16px;
  --r-sm: 10px;
  --r-lg: 22px;
  --tr:   all .2s ease;

  --fs-body:  14px;
  --fs-label: 11px;
  --fs-small: 12px;
  --fs-head:  15px;
  --fs-sub:   13px;

  --sh-card:  0 2px 16px rgba(139,0,0,.08), 0 1px 4px rgba(139,0,0,.04);
  --sh-sm:    0 1px 6px rgba(139,0,0,.06);
  --sh-focus: 0 0 0 3px rgba(139,0,0,.16);
  --sh-input: inset 0 1px 3px rgba(139,0,0,.05);
}

html { scroll-behavior: smooth; }
body {
  font-family: 'Poppins', sans-serif;
  background: var(--off);
  color: var(--text);
  min-height: 100vh;
  font-size: var(--fs-body);
}

/* ── LAYOUT ── */
.va-root { background: var(--off); min-height: 100vh; }
.va-outer { display: flex; min-height: 100vh; width: 100%; }

/* ── LEFT PANEL ── */
.va-left {
  width: 380px; flex-shrink: 0;
  padding: 40px 28px 60px 32px;
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh; overflow-y: auto;
  background: linear-gradient(160deg, #8B0000 0%, #5a0000 40%, #3a0000 72%, #1a0000 100%);
  border-right: 1px solid var(--maroon-deep);
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.25) transparent;
}
.va-left::-webkit-scrollbar { width: 3px; }
.va-left::-webkit-scrollbar-track { background: transparent; border-radius: 99px; }
.va-left::-webkit-scrollbar-thumb { background: rgba(255,255,255,.3); border-radius: 99px; }
.va-left::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.55); }

.va-left-logo {
  width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
  background: rgba(255,255,255,.97);
  box-shadow: 0 4px 16px rgba(0,0,0,.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.45rem;
}
.va-left-title {
  font-size: 18px; font-weight: 800; color: #ffffff; line-height: 1.3; margin-bottom: 0;
}
.va-left-sub {
  font-size: 13px; font-weight: 400; color: rgba(255,255,255,.75);
  line-height: 1.7; margin-bottom: 28px;
}
.va-left-section { margin-bottom: 22px; }
.va-left-section-title {
  font-size: 10px; font-weight: 700; color: rgba(255,255,255,.5);
  text-transform: uppercase; letter-spacing: 1.6px;
  margin-bottom: 10px; padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,.15);
}
.va-step-list { display: flex; flex-direction: column; gap: 8px; }
.va-step-row {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 14px; border-radius: 10px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.1);
  transition: background .2s;
}
.va-step-row:hover { background: rgba(255,255,255,.13); }
.va-step-num {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,.97);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #8B0000;
  box-shadow: 0 2px 6px rgba(0,0,0,.2);
}
.va-step-info { flex: 1; min-width: 0; }
.va-step-info strong { display: block; font-size: 13px; font-weight: 400; color: #ffffff; }
.va-step-info span   { font-size: 11px; color: rgba(255,255,255,.6); font-weight: 300; margin-top: 1px; display: block; }

.va-benefit-list { display: flex; flex-direction: column; gap: 8px; }
.va-benefit-row {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 14px; border-radius: 10px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.1);
  transition: background .2s;
}
.va-benefit-row:hover { background: rgba(255,255,255,.13); }
.va-benefit-icon { font-size: 1.15rem; flex-shrink: 0; }
.va-benefit-text strong { display: block; font-size: 13px; font-weight: 400; color: #ffffff; }
.va-benefit-text span   { font-size: 11px; color: rgba(255,255,255,.6); font-weight: 300; line-height: 1.5; display: block; margin-top: 1px; }

/* ── DIVIDER ── */
.va-divider {
  width: 1px; flex-shrink: 0;
  background: linear-gradient(to bottom, transparent 0%, var(--border2) 10%, var(--border2) 90%, transparent 100%);
}

/* ── RIGHT ── */
.va-right {
  flex: 1; min-width: 0;
  padding: 48px 56px 80px 48px;
  overflow-y: auto; position: relative;
  background: var(--off);
}

/* ── BACK ICON ── */
.back-home-icon {
  position: fixed; top: 20px; right: 28px;
  width: 42px; height: 42px; border-radius: 50%;
  background: var(--white);
  box-shadow: var(--sh-card);
  border: 1px solid var(--border2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: var(--tr); z-index: 9999;
  color: var(--text2); text-decoration: none;
}
.back-home-icon:hover {
  background: var(--maroon); color: #fff;
  box-shadow: 0 4px 16px rgba(139,0,0,.3);
  border-color: var(--maroon); transform: translateX(-2px);
}
.back-home-icon:active { transform: translateX(0); }
.back-home-icon svg {
  width: 18px; height: 18px;
  stroke: currentColor; fill: none;
  stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}

.va-wrap { width: 100%; }

/* ── STEPPER ── */
.stepper {
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 52px; width: 100%;
}
.step-item {
  display: flex; flex-direction: column; align-items: center;
  flex-shrink: 0; position: relative;
}
.step-bubble {
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--white);
  border: 2px solid var(--border2);
  box-shadow: var(--sh-sm);
  display: flex; align-items: center; justify-content: center;
  transition: var(--tr); position: relative; z-index: 1; color: var(--text3);
}
.step-item.active .step-bubble {
  background: var(--maroon); border-color: var(--maroon);
  color: #fff; box-shadow: 0 4px 14px rgba(139,0,0,.35);
}
.step-item.done .step-bubble {
  background: #fff; border-color: var(--maroon);
  color: var(--maroon); box-shadow: var(--sh-sm);
}
.step-connector {
  width: 160px; flex-shrink: 0; height: 2px;
  background: var(--border2); border-radius: 2px; transition: var(--tr);
}
.step-connector.done { background: var(--maroon); opacity: .45; }
.step-lbl {
  font-size: var(--fs-label); font-weight: 600; color: var(--text3);
  text-transform: uppercase; letter-spacing: .6px;
  margin-top: 9px; text-align: center; white-space: nowrap;
  transition: var(--tr); position: absolute; top: 100%;
  left: 50%; transform: translateX(-50%);
}
.step-item.active .step-lbl { color: var(--maroon); }
.step-item.done   .step-lbl { color: var(--maroon); opacity: .6; }

/* ── CARD ── */
.card {
  background: var(--white);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-card);
  border: 1px solid var(--border);
  margin-bottom: 22px; overflow: hidden;
}
.card-head {
  padding: 18px 24px;
  display: flex; align-items: center; gap: 14px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(to right, var(--maroon-tint), transparent 60%);
}
.card-icon {
  width: 44px; height: 44px; flex-shrink: 0;
  border-radius: var(--r-sm);
  background: var(--maroon);
  box-shadow: 0 3px 10px rgba(139,0,0,.28);
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
}
.card-head h2 { font-size: var(--fs-head); font-weight: 700; color: var(--text); line-height: 1.3; }
.card-head p  { font-size: var(--fs-small); font-weight: 400; color: var(--text2); margin-top: 2px; }
.card-badge {
  margin-left: auto; flex-shrink: 0;
  background: var(--maroon);
  border-radius: 20px; padding: 5px 14px;
  font-size: var(--fs-label); font-weight: 600; color: #fff;
  letter-spacing: .4px; text-transform: uppercase; white-space: nowrap;
  box-shadow: 0 2px 8px rgba(139,0,0,.22);
}
.card-body { padding: 26px 24px; background: var(--white); }

/* ── NOTICE ── */
.notice {
  background: var(--maroon-tint);
  border-radius: var(--r-sm);
  border-left: 3px solid var(--maroon);
  padding: 12px 16px;
  font-size: var(--fs-small); font-weight: 500;
  line-height: 1.7; color: var(--text2); margin-bottom: 22px;
}
.notice b    { color: var(--error); font-weight: 700; }
.notice-warn { border-left-color: var(--error); background: rgba(224,92,110,.06); }

/* ── SECTION LABEL ── */
.sec-lbl {
  font-size: var(--fs-label); font-weight: 700; color: var(--maroon);
  text-transform: uppercase; letter-spacing: 1px;
  margin: 24px 0 14px; padding-bottom: 8px;
  border-bottom: 1px solid var(--border2);
}
.sec-lbl:first-child { margin-top: 0; }

/* ── GRIDS ── */
.grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px 20px; }
.grid-1 { display: grid; grid-template-columns: 1fr; gap: 16px; }
.col-2  { grid-column: span 2; }
.col-3  { grid-column: span 3; }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .va-left { width: 300px; padding: 32px 20px 48px 24px; }
  .va-right { padding: 40px 36px 80px 36px; }
}
@media (max-width: 960px) {
  .va-outer { flex-direction: column; }
  .va-left  { width: 100%; height: auto; position: static; padding: 28px 24px 24px; }
  .va-divider { width: 100%; height: 1px; }
  .va-right { padding: 32px 32px 80px; }
  .va-left-sub { margin-bottom: 18px; }
  .va-left-section { margin-bottom: 16px; }
  .stepper { margin-bottom: 48px; }
  .step-connector { width: 80px; }
}
@media (max-width: 720px) {
  .va-right { padding: 24px 20px 80px; }
  .grid-3 { grid-template-columns: 1fr 1fr; }
  .col-3  { grid-column: span 2; }
  .svc-grid { grid-template-columns: 1fr 1fr !important; }
  .step-connector { width: 56px; }
}
@media (max-width: 560px) {
  .va-right { padding: 20px 14px 80px; }
  .va-left  { padding: 18px 14px 20px; }
  .card-body { padding: 16px 14px; }
  .card-head { padding: 14px 16px; gap: 10px; }
  .card-badge { display: none; }
  .grid, .grid-3 { grid-template-columns: 1fr; }
  .col-2, .col-3 { grid-column: span 1; }
  .svc-grid { grid-template-columns: 1fr !important; }
  .step-connector { width: 36px; }
  .step-bubble { width: 42px; height: 42px; }
  .step-lbl { font-size: 9px; letter-spacing: .3px; }
  .form-nav { gap: 10px; }
  .btn { padding: 11px 22px; font-size: 13px; }
  .btn-submit { padding: 11px 28px; }
  .rev-tbl td { padding: 9px 14px; font-size: 12px; }
  .rev-tbl td:first-child { width: 38%; }
  .radio-row { gap: 7px; }
  .radio-chip { padding: 9px 12px; font-size: 13px; }
  .back-home-icon { top: 12px; right: 12px; width: 36px; height: 36px; }
  .success-wrap { padding: 36px 18px; }
  .success-wrap h2 { font-size: 18px; }
}
@media (max-width: 380px) {
  .va-right { padding: 16px 10px 80px; }
  .stepper { margin-bottom: 44px; }
  .step-connector { width: 24px; }
  .step-bubble { width: 38px; height: 38px; }
}

/* ── FIELD ── */
.field { display: flex; flex-direction: column; gap: 7px; }
.field > label {
  font-size: var(--fs-label); font-weight: 700; color: var(--text);
  text-transform: uppercase; letter-spacing: .5px;
}
.req  { color: var(--error); margin-left: 2px; }
.opt  { font-weight: 500; color: var(--text3); text-transform: none; font-size: var(--fs-label); letter-spacing: 0; margin-left: 4px; }
.hint { font-size: var(--fs-small); font-weight: 400; color: var(--text3); font-style: italic; }
.err-msg { font-size: var(--fs-small); color: var(--error); font-weight: 600; min-height: 16px; }

/* ── INPUTS ── */
input[type=text],
input[type=email],
input[type=tel],
input[type=date],
input[type=url],
select,
textarea {
  width: 100%; padding: 11px 15px;
  border: 1.5px solid var(--border2);
  border-radius: var(--r-sm);
  font-family: 'Poppins', sans-serif;
  font-size: var(--fs-body); font-weight: 500;
  color: var(--text);
  background: var(--white);
  outline: none; box-shadow: var(--sh-input);
  transition: border-color .2s, box-shadow .2s;
  -webkit-appearance: none; appearance: none;
}
input:focus, select:focus, textarea:focus {
  border-color: var(--maroon);
  box-shadow: var(--sh-focus);
}
input::placeholder, textarea::placeholder {
  color: var(--text3); font-weight: 400;
}
input.err, select.err, textarea.err {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(224,92,110,.14);
}
textarea { resize: vertical; min-height: 96px; line-height: 1.6; }
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238B0000' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-opacity='.55'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
  padding-right: 36px; cursor: pointer;
}

/* ── SERVICE GRID ── */
.svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
@media (max-width: 700px) { .svc-grid { grid-template-columns: 1fr 1fr; } }

.svc-group {
  background: var(--white);
  border-radius: var(--r);
  border: 1px solid var(--border);
  box-shadow: var(--sh-sm); overflow: hidden;
}
.svc-group-head {
  padding: 12px 14px;
  display: flex; align-items: center; gap: 9px;
  border-bottom: 1px solid var(--border);
  background: var(--maroon-tint);
}
.svc-group-icon { font-size: 1rem; flex-shrink: 0; }
.svc-group-name { font-size: var(--fs-small); font-weight: 700; color: var(--text); flex: 1; min-width: 0; }
.svc-count {
  flex-shrink: 0; background: var(--maroon);
  border-radius: 20px; padding: 2px 9px;
  font-size: var(--fs-label); font-weight: 700; color: #fff;
}
.svc-list { padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
.svc-chip {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 9px 10px; border-radius: var(--r-sm);
  cursor: pointer; transition: var(--tr); user-select: none;
  border: 1px solid transparent;
}
.svc-chip:hover { background: var(--maroon-tint); border-color: var(--border); }
.svc-chip.sel   { background: var(--maroon-tint2); border-color: var(--border2); }
.svc-chip input {
  width: 14px; height: 14px; flex-shrink: 0; margin-top: 2px;
  accent-color: var(--maroon); cursor: pointer;
  box-shadow: none; padding: 0; background: none; border: none;
}
.svc-chip-label {
  font-size: var(--fs-small); font-weight: 500; color: var(--text);
  line-height: 1.45; transition: color .15s;
}
.svc-chip.sel .svc-chip-label { color: var(--maroon); font-weight: 600; }

/* ── SELECTED PILLS ── */
.sel-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.sel-pill {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 13px;
  background: var(--maroon); border-radius: 20px;
  box-shadow: 0 2px 8px rgba(139,0,0,.22);
  font-size: var(--fs-small); font-weight: 600; color: #fff;
}
.sel-pill button {
  background: none; border: none; color: rgba(255,255,255,.7);
  cursor: pointer; font-size: .8rem; padding: 0; line-height: 1; transition: color .15s;
}
.sel-pill button:hover { color: #fff; }

/* ── RADIO CHIPS ── */
.radio-row { display: flex; flex-wrap: wrap; gap: 9px; }
.radio-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 15px; border-radius: var(--r-sm);
  background: var(--white); border: 1.5px solid var(--border2);
  box-shadow: var(--sh-sm);
  cursor: pointer; font-size: var(--fs-body); font-weight: 500; color: var(--text);
  transition: var(--tr); user-select: none;
}
.radio-chip:hover { border-color: var(--maroon); color: var(--maroon); background: var(--maroon-tint); }
.radio-chip.sel   { border-color: var(--maroon); color: var(--maroon); font-weight: 600; background: var(--maroon-tint); }
.radio-chip input {
  width: 14px; height: 14px; accent-color: var(--maroon); cursor: pointer;
  box-shadow: none; padding: 0; background: none; border: none;
}

/* ── CHECK ROW ── */
.check-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px; border-radius: var(--r-sm);
  background: var(--white); border: 1.5px solid var(--border);
  box-shadow: var(--sh-sm);
  cursor: pointer; transition: var(--tr); user-select: none;
}
.check-row:hover { border-color: var(--maroon); background: var(--maroon-tint); }
.check-row.sel   { border-color: var(--maroon); background: var(--maroon-tint); }
.check-row input {
  width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px;
  accent-color: var(--maroon); cursor: pointer;
  box-shadow: none; padding: 0; background: none; border: none;
}
.check-row-text { font-size: var(--fs-body); font-weight: 500; color: var(--text); line-height: 1.6; }

/* ── UPLOAD ── */
.upload-zone {
  background: var(--white);
  border: 2px dashed var(--border2);
  border-radius: var(--r); padding: 30px 20px;
  text-align: center; cursor: pointer; transition: var(--tr);
}
.upload-zone:hover  { border-color: var(--maroon); background: var(--maroon-tint); }
.upload-zone.filled { border-style: solid; border-color: var(--maroon); background: var(--maroon-tint); }
.upload-icon  { font-size: 1.9rem; margin-bottom: 8px; }
.upload-title { font-size: var(--fs-body); font-weight: 600; color: var(--text); }
.upload-sub   { font-size: var(--fs-small); font-weight: 400; color: var(--text3); margin-top: 4px; }
.file-tag {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 12px; padding: 6px 14px;
  background: var(--maroon); border-radius: 20px;
  box-shadow: 0 2px 8px rgba(139,0,0,.22);
  font-size: var(--fs-small); font-weight: 600; color: #fff;
}
.file-tag button {
  background: none; border: none; color: rgba(255,255,255,.7);
  cursor: pointer; font-size: .82rem; padding: 0; line-height: 1; transition: color .15s;
}
.file-tag button:hover { color: #fff; }
.doc-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.doc-pill {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; background: var(--white);
  border: 1px solid var(--border); border-radius: var(--r-sm);
  font-size: var(--fs-small); font-weight: 500; color: var(--text);
}
.doc-pill button { background: none; border: none; color: var(--error); cursor: pointer; font-size: .82rem; }

/* ── REVIEW ── */
.rev-wrap { display: flex; flex-direction: column; gap: 14px; }
.rev-block {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--r); overflow: hidden; box-shadow: var(--sh-sm);
}
.rev-block-head {
  padding: 12px 18px; display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(to right, var(--maroon-tint), transparent 60%);
}
.rev-block-head span:first-child { font-size: .95rem; }
.rev-block-head span:last-child { font-size: var(--fs-body); font-weight: 700; color: var(--text); }
table.rev-tbl { width: 100%; border-collapse: collapse; }
table.rev-tbl td { padding: 10px 18px; font-size: var(--fs-body); border-bottom: 1px solid var(--border); }
table.rev-tbl tr:last-child td { border-bottom: none; }
table.rev-tbl td:first-child {
  width: 33%; font-size: var(--fs-label); font-weight: 700;
  color: var(--maroon); text-transform: uppercase; letter-spacing: .5px;
}
table.rev-tbl td:last-child { color: var(--text); font-weight: 500; }

/* ── NAV ── */
.form-nav {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 28px; padding-top: 22px;
  border-top: 1px solid var(--border);
}
.btn {
  padding: 12px 30px; font-family: 'Poppins', sans-serif;
  font-size: var(--fs-body); font-weight: 600; border: none;
  border-radius: 50px; cursor: pointer; transition: var(--tr);
}
.btn-ghost {
  background: var(--white);
  border: 1.5px solid var(--border2);
  color: var(--text2); box-shadow: var(--sh-sm);
}
.btn-ghost:hover { border-color: var(--maroon); color: var(--maroon); background: var(--maroon-tint); }
.btn-next {
  background: var(--maroon); color: #fff; font-weight: 700;
  box-shadow: 0 4px 14px rgba(139,0,0,.3);
}
.btn-next:hover  { background: var(--maroon-light); box-shadow: 0 6px 20px rgba(139,0,0,.4); transform: translateY(-1px); }
.btn-next:active { transform: translateY(0); }
.btn-submit {
  background: linear-gradient(135deg, var(--success), #2aab74);
  box-shadow: 0 4px 14px rgba(61,184,122,.3);
  color: #fff; padding: 12px 38px; font-weight: 700; border: none;
}
.btn-submit:hover  { box-shadow: 0 6px 20px rgba(61,184,122,.4); transform: translateY(-1px); }
.btn-submit:active { transform: translateY(0); }

/* ── SUCCESS ── */
.success-wrap {
  background: var(--white); border-radius: var(--r-lg);
  border: 1px solid var(--border); box-shadow: var(--sh-card);
  text-align: center; padding: 56px 32px;
}
.success-ring {
  width: 86px; height: 86px; border-radius: 50%;
  background: var(--maroon-tint);
  border: 2px solid var(--maroon);
  display: flex; align-items: center; justify-content: center;
  font-size: 2.1rem; margin: 0 auto 22px;
  box-shadow: 0 4px 16px rgba(139,0,0,.15);
}
.success-wrap h2 { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 10px; }
.success-wrap p  { font-size: var(--fs-body); font-weight: 400; color: var(--text2); line-height: 1.7; max-width: 400px; margin: 0 auto 6px; }
.confirm-code {
  display: inline-block;
  background: var(--maroon-tint);
  border: 1.5px solid var(--maroon);
  border-radius: var(--r-sm); padding: 11px 28px; margin: 14px auto;
  font-family: monospace; font-size: 18px; font-weight: 800;
  color: var(--maroon); letter-spacing: 3px;
}

.divider { border: none; height: 1px; background: var(--border); margin: 22px 0; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-enter { animation: fadeUp .3s cubic-bezier(.16,1,.3,1); }
`;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const randCode = (): string => "VA-" + Math.random().toString(36).toUpperCase().slice(2, 10);

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────
interface FieldProps {
  label: string; required?: boolean; optional?: boolean;
  hint?: string; error?: string; children: React.ReactNode; className?: string;
}
const Field: React.FC<FieldProps> = ({ label, required, optional, hint, error, children, className }) => (
  <div className={`field${className ? " " + className : ""}`}>
    <label>
      {label}
      {required && <span className="req">*</span>}
      {optional && <span className="opt">(optional)</span>}
    </label>
    {children}
    {hint && <span className="hint">{hint}</span>}
    <span className="err-msg">{error ?? ""}</span>
  </div>
);

interface InpProps {
  value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; maxLength?: number; hasError?: boolean;
}
const Inp: React.FC<InpProps> = ({ value, onChange, placeholder, type = "text", maxLength, hasError }) => (
  <input type={type} value={value} onChange={onChange}
    placeholder={placeholder} maxLength={maxLength} className={hasError ? "err" : ""} />
);

interface SelProps {
  value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[]; placeholder?: string; hasError?: boolean;
}
const Sel: React.FC<SelProps> = ({ value, onChange, options, placeholder = "Select…", hasError }) => (
  <select value={value} onChange={onChange} className={hasError ? "err" : ""}>
    <option value="">{placeholder}</option>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

// ─────────────────────────────────────────────
// FILE UPLOADS
// ─────────────────────────────────────────────
interface SingleUploadProps {
  file: UploadedFile | null; onAdd: (f: File) => void; onRemove: () => void;
}
const SingleUpload: React.FC<SingleUploadProps> = ({ file, onAdd, onRemove }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className={`upload-zone${file ? " filled" : ""}`} onClick={() => ref.current?.click()}>
        <div className="upload-icon">{file ? "📎" : "📤"}</div>
        {file
          ? <><p className="upload-title">{file.file.name}</p><p className="upload-sub">Click to replace</p></>
          : <><p className="upload-title">Click to browse or drag & drop</p><p className="upload-sub">PDF, DOC, DOCX — max 10 MB</p></>
        }
      </div>
      {file && (
        <div style={{ textAlign: "center" }}>
          <span className="file-tag">
            📎 {file.file.name}
            <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
          </span>
        </div>
      )}
      <input ref={ref} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
        onChange={(e) => { if (e.target.files?.[0]) { onAdd(e.target.files[0]); e.target.value = ""; } }} />
    </div>
  );
};

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────
const INITIAL: FormData = {
  personal: {
    firstName: "", lastName: "", middleName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "", dob: "", gender: "",
  },
  service: {
    services: [], experienceLevel: "", availability: "",
    timezone: "", rate: "", startDate: "",
  },
  resume: { resume: null, coverLetter: "" },
};

// ─────────────────────────────────────────────
// PAGE 1
// ─────────────────────────────────────────────
interface P1Props {
  data: PersonalInfo; errors: FormErrors;
  set: (k: keyof PersonalInfo, v: string) => void; clrErr: (k: string) => void;
}
const Page1: React.FC<P1Props> = ({ data, errors, set, clrErr }) => (
  <div className="page-enter">
    <div className="card">
      <div className="card-head">
        <div className="card-icon">👤</div>
        <div><h2>Personal Information</h2><p>Tell us a bit about yourself</p></div>
        <span className="card-badge">Step 1 of 4</span>
      </div>
      <div className="card-body">
        <div className="notice">
          Fields marked <b>*</b> are required. Your information is kept confidential.
        </div>

        <p className="sec-lbl">Full Name</p>
        <div className="grid-3">
          <Field label="First Name" required error={errors.firstName}>
            <Inp value={data.firstName} hasError={!!errors.firstName} placeholder="Juan" maxLength={50}
              onChange={(e) => { set("firstName", e.target.value); clrErr("firstName"); }} />
          </Field>
          <Field label="Middle Name" optional>
            <Inp value={data.middleName} placeholder="D." maxLength={50}
              onChange={(e) => set("middleName", e.target.value)} />
          </Field>
          <Field label="Last Name" required error={errors.lastName}>
            <Inp value={data.lastName} hasError={!!errors.lastName} placeholder="dela Cruz" maxLength={50}
              onChange={(e) => { set("lastName", e.target.value); clrErr("lastName"); }} />
          </Field>
        </div>

        <p className="sec-lbl">Contact Details</p>
        <div className="grid">
          <Field label="Email Address" required error={errors.email}>
            <Inp type="email" value={data.email} hasError={!!errors.email} placeholder="juan@email.com" maxLength={100}
              onChange={(e) => { set("email", e.target.value); clrErr("email"); }} />
          </Field>
          <Field label="Phone / WhatsApp" required error={errors.phone}
            hint="Numbers, +, spaces only (e.g. +63 917 000 0000)">
            <Inp type="tel" value={data.phone} hasError={!!errors.phone} placeholder="+63 917 000 0000" maxLength={20}
              onChange={(e) => { const v = e.target.value.replace(/[^\d\s+\-()]/g, ""); set("phone", v); clrErr("phone"); }} />
          </Field>
        </div>

        <p className="sec-lbl">Address</p>
        <div className="grid">
          <Field label="Street Address" required error={errors.address} className="col-2">
            <Inp value={data.address} hasError={!!errors.address} placeholder="123 Rizal St, Brgy. San Antonio" maxLength={150}
              onChange={(e) => { set("address", e.target.value); clrErr("address"); }} />
          </Field>
          <Field label="City / Municipality" required error={errors.city}>
            <Inp value={data.city} hasError={!!errors.city} placeholder="Makati" maxLength={80}
              onChange={(e) => { set("city", e.target.value); clrErr("city"); }} />
          </Field>
          <Field label="State / Province" optional>
            <Inp value={data.state} placeholder="Metro Manila" maxLength={80}
              onChange={(e) => set("state", e.target.value)} />
          </Field>
          <Field label="ZIP / Postal Code" required error={errors.zip}>
            <Inp value={data.zip} hasError={!!errors.zip} placeholder="1200" maxLength={10}
              onChange={(e) => { const v = e.target.value.replace(/[^\d\-\s]/g, ""); set("zip", v); clrErr("zip"); }} />
          </Field>
          <Field label="Country" required error={errors.country}>
            <Sel value={data.country} hasError={!!errors.country}
              onChange={(e) => { set("country", e.target.value); clrErr("country"); }}
              options={COUNTRIES} placeholder="Select Country" />
          </Field>
        </div>

        <p className="sec-lbl">Personal Details</p>
        <div className="grid">
          <Field label="Date of Birth" required error={errors.dob}>
            <input type="date" value={data.dob}
              min="1924-01-01"
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
              className={errors.dob ? "err" : ""}
              onChange={(e) => { set("dob", e.target.value); clrErr("dob"); }} />
          </Field>
          <Field label="Gender" optional>
            <Sel value={data.gender} onChange={(e) => set("gender", e.target.value)}
              options={["Male", "Female", "Non-binary", "Prefer not to say"]} />
          </Field>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// PAGE 2
// ─────────────────────────────────────────────
interface P2Props {
  data: ServiceSelection; errors: FormErrors;
  set: (k: keyof ServiceSelection, v: string | string[]) => void; clrErr: (k: string) => void;
}
const Page2: React.FC<P2Props> = ({ data, errors, set, clrErr }) => {
  const toggle = (svc: string): void => {
    const next = data.services.includes(svc)
      ? data.services.filter((s) => s !== svc)
      : [...data.services, svc];
    set("services", next); clrErr("services");
  };

  return (
    <div className="page-enter">
      <div className="card">
        <div className="card-head">
          <div className="card-icon">🛠️</div>
          <div><h2>Services You're Applying For</h2><p>Select all VA services you can offer</p></div>
          <span className="card-badge">Step 2 of 4</span>
        </div>
        <div className="card-body">
          {errors.services && (
            <div className="notice notice-warn" style={{ marginBottom: 16 }}>
              <b>Please select at least one service</b> before continuing.
            </div>
          )}

          <p className="sec-lbl">Available Services — select all that apply</p>
          <div className="svc-grid">
            {SERVICE_GROUPS.map((g) => {
              const cnt = g.services.filter((s) => data.services.includes(s)).length;
              return (
                <div key={g.category} className="svc-group">
                  <div className="svc-group-head">
                    <span className="svc-group-icon">{g.icon}</span>
                    <span className="svc-group-name">{g.category}</span>
                    {cnt > 0 && <span className="svc-count">{cnt}</span>}
                  </div>
                  <div className="svc-list">
                    {g.services.map((svc) => (
                      <label key={svc} className={`svc-chip${data.services.includes(svc) ? " sel" : ""}`}>
                        <input type="checkbox" checked={data.services.includes(svc)} onChange={() => toggle(svc)} />
                        <span className="svc-chip-label">{svc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {data.services.length > 0 && (
            <>
              <p className="sec-lbl" style={{ marginTop: 22 }}>Selected ({data.services.length})</p>
              <div className="sel-pills">
                {data.services.map((s) => (
                  <span key={s} className="sel-pill">
                    {s}
                    <button type="button" onClick={() => toggle(s)}>✕</button>
                  </span>
                ))}
              </div>
            </>
          )}

          <hr className="divider" />
          <p className="sec-lbl">Work Preferences</p>
          <div className="grid">
            <Field label="Experience Level" required error={errors.experienceLevel}>
              <Sel value={data.experienceLevel} hasError={!!errors.experienceLevel}
                onChange={(e) => { set("experienceLevel", e.target.value); clrErr("experienceLevel"); }}
                options={["Entry Level (0–1 yr)", "Junior (1–2 yrs)", "Mid-Level (2–4 yrs)", "Senior (4–6 yrs)", "Expert (6+ yrs)"]} />
            </Field>
            <Field label="Availability" required error={errors.availability}>
              <Sel value={data.availability} hasError={!!errors.availability}
                onChange={(e) => { set("availability", e.target.value); clrErr("availability"); }}
                options={["Immediately", "Within 1 week", "Within 2 weeks", "Within 30 days", "60+ days"]} />
            </Field>
            <Field label="Timezone" required error={errors.timezone}>
              <Sel value={data.timezone} hasError={!!errors.timezone}
                onChange={(e) => { set("timezone", e.target.value); clrErr("timezone"); }}
                options={TIMEZONES} />
            </Field>
            <Field label="Expected Rate" required error={errors.rate} hint="e.g. $5/hr, $800/mo, $200/project">
              <Inp value={data.rate} hasError={!!errors.rate} placeholder="$5/hr" maxLength={30}
                onChange={(e) => { set("rate", e.target.value); clrErr("rate"); }} />
            </Field>
            <Field label="Earliest Start Date" optional className="col-2">
              <Inp type="date" value={data.startDate} onChange={(e) => set("startDate", e.target.value)} />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE 3
// ─────────────────────────────────────────────
interface P3Props {
  data: ResumeStep; errors: FormErrors;
  setResume: (f: File | null) => void; setCoverLetter: (v: string) => void; clrErr: (k: string) => void;
}
const Page3: React.FC<P3Props> = ({ data, errors, setResume, setCoverLetter, clrErr }) => (
  <div className="page-enter">
    <div className="card">
      <div className="card-head">
        <div className="card-icon">📄</div>
        <div><h2>Resume / CV</h2><p>Upload your resume and write a cover letter</p></div>
        <span className="card-badge">Step 3 of 4</span>
      </div>
      <div className="card-body">
        <div className="notice">
          Upload your most recent resume or CV. <b style={{ color: "var(--maroon)" }}>PDF format is preferred.</b> Max: 10 MB.
        </div>
        <p className="sec-lbl">Resume or CV <span style={{ color: "var(--error)" }}>*</span></p>
        <SingleUpload
          file={data.resume}
          onAdd={(f) => { setResume(f); clrErr("resume"); }}
          onRemove={() => setResume(null)}
        />
        {errors.resume && <p className="err-msg" style={{ marginTop: 6 }}>{errors.resume}</p>}

        <hr className="divider" />
        <p className="sec-lbl">Cover Letter <span className="opt">(optional)</span></p>
        <textarea
          value={data.coverLetter}
          onChange={(e) => { if (e.target.value.length <= 1500) setCoverLetter(e.target.value); }}
          placeholder="Introduce yourself — share your experience, your strengths as a Virtual Assistant, and why you're a great fit..."
          style={{ minHeight: 170 }}
          maxLength={1500}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <p className="hint">Tip: Mention the specific services you selected and tools you use.</p>
          <p className="hint" style={{ flexShrink: 0, marginLeft: 8 }}>{data.coverLetter.length} / 1500</p>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// PAGE 4 — REVIEW
// ─────────────────────────────────────────────
interface P4Props { formData: FormData; }
const Page4: React.FC<P4Props> = ({ formData: d }) => {
  type RevRow   = { label: string; value: string };
  type RevBlock = { icon: string; title: string; rows: RevRow[] };

  const blocks: RevBlock[] = [
    {
      icon: "👤", title: "Personal Information",
      rows: [
        { label: "Name", value: [d.personal.firstName, d.personal.middleName, d.personal.lastName].filter(Boolean).join(" ") || "—" },
        { label: "Email", value: d.personal.email || "—" },
        { label: "Phone", value: d.personal.phone || "—" },
        { label: "Address", value: [d.personal.address, d.personal.city, d.personal.state, d.personal.zip, d.personal.country].filter(Boolean).join(", ") || "—" },
        { label: "Date of Birth", value: d.personal.dob || "—" },
      ],
    },
    {
      icon: "🛠️", title: "Services Applied For",
      rows: [
        { label: "Services", value: d.service.services.length > 0 ? d.service.services.join(", ") : "—" },
        { label: "Experience", value: d.service.experienceLevel || "—" },
        { label: "Availability", value: d.service.availability || "—" },
        { label: "Timezone", value: d.service.timezone || "—" },
        { label: "Rate", value: d.service.rate || "—" },
        { label: "Start Date", value: d.service.startDate || "—" },
      ],
    },
    {
      icon: "📄", title: "Resume & Cover Letter",
      rows: [
        { label: "Resume", value: d.resume.resume ? `✓ ${d.resume.resume.file.name}` : "Not uploaded" },
        { label: "Cover Letter", value: d.resume.coverLetter ? d.resume.coverLetter.slice(0, 100) + (d.resume.coverLetter.length > 100 ? "…" : "") : "Not provided" },
      ],
    },
  ];

  return (
    <div className="page-enter">
      <div className="card">
        <div className="card-head">
          <div className="card-icon">✅</div>
          <div><h2>Review Your Application</h2><p>Confirm everything looks good before submitting</p></div>
          <span className="card-badge">Step 4 of 4</span>
        </div>
        <div className="card-body">
          <div className="notice" style={{ marginBottom: 20 }}>
            Please review carefully. Use <b style={{ color: "var(--maroon)" }}>Back</b> to make corrections.
          </div>
          <div className="rev-wrap">
            {blocks.map((b) => (
              <div key={b.title} className="rev-block">
                <div className="rev-block-head">
                  <span>{b.icon}</span>
                  <span>{b.title}</span>
                </div>
                <table className="rev-tbl">
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r.label}><td>{r.label}</td><td>{r.value}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// BACK HOME ICON
// ─────────────────────────────────────────────
const BackHomeIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" className="back-home-icon" onClick={onClick}
    title="Back to Homepage" aria-label="Back to Homepage">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
    </svg>
  </button>
);

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
const VAJobApplicationForm: React.FC = () => {
  const [page, setPage] = useState<Step>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [confirmCode, setConfirmCode] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>(INITIAL);

  useEffect(() => {
    const id = "va-white-maroon-v1";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id; tag.textContent = CSS;
      document.head.appendChild(tag);
    }
  }, []);

  const setPersonal = useCallback((k: keyof PersonalInfo, v: string): void => {
    setFormData((p) => ({ ...p, personal: { ...p.personal, [k]: v } }));
  }, []);

  const setService = useCallback((k: keyof ServiceSelection, v: string | string[]): void => {
    setFormData((p) => ({ ...p, service: { ...p.service, [k]: v } }));
  }, []);

  const setResumeFile = useCallback((f: File | null): void => {
    setFormData((p) => ({
      ...p,
      resume: { ...p.resume, resume: f ? { file: f, label: f.name } : null },
    }));
  }, []);

  const setCoverLetter = useCallback((v: string): void => {
    setFormData((p) => ({ ...p, resume: { ...p.resume, coverLetter: v } }));
  }, []);

  const clrErr = useCallback((k: string): void => {
    setErrors((p) => ({ ...p, [k]: "" }));
  }, []);

  const validate = (pg: Step): boolean => {
    const errs: FormErrors = {};
    const d = formData;

    if (pg === 1) {
      if (!d.personal.firstName.trim()) errs.firstName = "First name is required.";
      else if (d.personal.firstName.trim().length < 2) errs.firstName = "Must be at least 2 characters.";
      if (!d.personal.lastName.trim()) errs.lastName = "Last name is required.";
      else if (d.personal.lastName.trim().length < 2) errs.lastName = "Must be at least 2 characters.";
      if (!d.personal.email.trim()) errs.email = "Email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.personal.email.trim())) errs.email = "Enter a valid email address.";
      if (!d.personal.phone.trim()) errs.phone = "Phone number is required.";
      else if (d.personal.phone.replace(/\D/g, "").length < 7) errs.phone = "Enter a valid phone number.";
      if (!d.personal.address.trim()) errs.address = "Street address is required.";
      if (!d.personal.city.trim()) errs.city = "City is required.";
      if (!d.personal.zip.trim()) errs.zip = "ZIP / Postal code is required.";
      else if (d.personal.zip.trim().length < 3) errs.zip = "Enter a valid ZIP / postal code.";
      if (!d.personal.country) errs.country = "Please select your country.";
      if (!d.personal.dob) {
        errs.dob = "Date of birth is required.";
      } else {
        const dob = new Date(d.personal.dob);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear() -
          (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
        if (isNaN(dob.getTime())) errs.dob = "Enter a valid date.";
        else if (age < 18) errs.dob = "You must be at least 18 years old.";
        else if (age > 70) errs.dob = "Please enter a valid date of birth.";
      }
    }

    if (pg === 2) {
      if (d.service.services.length === 0) errs.services = "Please select at least one service.";
      if (!d.service.experienceLevel) errs.experienceLevel = "Please select your experience level.";
      if (!d.service.availability) errs.availability = "Please select your availability.";
      if (!d.service.timezone) errs.timezone = "Please select your timezone.";
      if (!d.service.rate.trim()) errs.rate = "Please enter your expected rate.";
      else if (d.service.rate.trim().length < 2) errs.rate = "Enter a valid rate (e.g. $5/hr, $800/mo).";
    }

    if (pg === 3) {
      if (!d.resume.resume) errs.resume = "Please upload your resume or CV before continuing.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = (): void => {
    if (!validate(page)) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setPage((p) => (p + 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goPrev = (): void => {
    setPage((p) => (p - 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  const submit = async (): Promise<void> => {
    setIsSubmitting(true); setSubmitError("");
    try {
      const payload = new FormData();
      payload.append("firstName",  formData.personal.firstName);
      payload.append("lastName",   formData.personal.lastName);
      payload.append("middleName", formData.personal.middleName);
      payload.append("email",      formData.personal.email);
      payload.append("phone",      formData.personal.phone);
      payload.append("address",    formData.personal.address);
      payload.append("city",       formData.personal.city);
      payload.append("state",      formData.personal.state);
      payload.append("zip",        formData.personal.zip);
      payload.append("country",    formData.personal.country);
      payload.append("dob",        formData.personal.dob);
      payload.append("gender",     formData.personal.gender);
      payload.append("services",         JSON.stringify(formData.service.services));
      payload.append("experienceLevel",  formData.service.experienceLevel);
      payload.append("availability",     formData.service.availability);
      payload.append("timezone",         formData.service.timezone);
      payload.append("rate",             formData.service.rate);
      payload.append("startDate",        formData.service.startDate);
      payload.append("coverLetter", formData.resume.coverLetter);
      if (formData.resume.resume?.file) payload.append("resume", formData.resume.resume.file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applicants`,
        { method: "POST", body: payload, credentials: "include" }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Submission failed. Please try again.");
      }

      const data = await res.json();
      setConfirmCode(data.confirmCode || randCode());
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepState = (id: number): "active" | "done" | "" => {
    if (id < page) return "done";
    if (id === page) return "active";
    return "";
  };

  const LeftPanel: React.FC = () => (
    <div className="va-left">
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
        <div className="va-left-logo">
          <span style={{ fontSize: "1.6rem" }}>⚡</span>
        </div>
        <div className="va-left-title">Want to Apply as a Virtual Assistant?</div>
      </div>
      <div className="va-left-sub">
        Turn your skills into a career. Work with global clients, earn in USD, and build the life you want — all from home.
      </div>

      <div className="va-left-section">
        <div className="va-left-section-title">Who We're Looking For</div>
        <div className="va-benefit-list">
          {[
            { icon: "💻", title: "Tech-Savvy Individuals", desc: "Comfortable with online tools & platforms" },
            { icon: "🗣️", title: "Strong Communicators", desc: "Clear written & verbal English skills" },
            { icon: "⏰", title: "Reliable & Self-Managed", desc: "Can work independently and meet deadlines" },
            { icon: "🌱", title: "Eager to Learn", desc: "Open to training and upskilling" },
          ].map((b) => (
            <div key={b.title} className="va-benefit-row">
              <span className="va-benefit-icon">{b.icon}</span>
              <div className="va-benefit-text">
                <strong>{b.title}</strong>
                <span>{b.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="va-left-section">
        <div className="va-left-section-title">How It Works</div>
        <div className="va-step-list">
          {[
            { n: "1", label: "Fill Out This Form", desc: "Takes about 5–10 minutes" },
            { n: "2", label: "We Review Your Profile", desc: "Within 3–5 business days" },
            { n: "3", label: "Interview & Skills Check", desc: "Short online interview" },
            { n: "4", label: "Get Onboarded", desc: "Start working with your first client" },
          ].map((s) => (
            <div key={s.n} className="va-step-row">
              <div className="va-step-num">{s.n}</div>
              <div className="va-step-info">
                <strong>{s.label}</strong>
                <span>{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="va-root">
        <div className="va-outer">
          <LeftPanel />
          <div className="va-divider" />
          <div className="va-right" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BackHomeIcon onClick={() => (window.location.href = "/")} />
            <div className="success-wrap" style={{ maxWidth: 460 }}>
              <div className="success-ring">🎉</div>
              <h2>Application Submitted!</h2>
              <p>Your Virtual Assistant application has been successfully received.</p>
              <div className="confirm-code">{confirmCode}</div>
              <p>
                We'll reach out to{" "}
                <strong style={{ color: "var(--maroon)" }}>{formData.personal.email}</strong>{" "}
                within 3–5 business days.
              </p>
              <p style={{ marginTop: 10, fontSize: "12px", color: "var(--text3)" }}>
                Thank you for applying!
              </p>
              <button type="button" className="btn btn-next" style={{ marginTop: 26 }}
                onClick={() => { setSubmitted(false); setFormData(INITIAL); setPage(1); setErrors({}); }}>
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="va-root">
      <div className="va-outer">
        <LeftPanel />
        <div className="va-divider" />
        <div className="va-right">
          <BackHomeIcon onClick={() => (window.location.href = "/")} />
          <div className="va-wrap">
            {/* STEPPER */}
            <div className="stepper">
              {STEPS.map((s, i) => {
                const st = stepState(s.id);
                const isLast = i === STEPS.length - 1;
                return (
                  <React.Fragment key={s.id}>
                    <div className={`step-item${st ? " " + st : ""}`}>
                      <div className="step-bubble">
                        {st === "done" ? (
                          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <StepIcon name={s.icon} color={st === "active" ? "#fff" : "currentColor"} />
                        )}
                      </div>
                      <span className="step-lbl">{s.label}</span>
                    </div>
                    {!isLast && <div className={`step-connector${st === "done" ? " done" : ""}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            {page === 1 && <Page1 data={formData.personal} errors={errors} set={setPersonal} clrErr={clrErr} />}
            {page === 2 && <Page2 data={formData.service} errors={errors} set={setService} clrErr={clrErr} />}
            {page === 3 && <Page3 data={formData.resume} errors={errors} setResume={setResumeFile} setCoverLetter={setCoverLetter} clrErr={clrErr} />}
            {page === 4 && <Page4 formData={formData} />}

            <div className="form-nav">
              {page > 1
                ? <button type="button" className="btn btn-ghost" onClick={goPrev}>← Back</button>
                : <span />
              }
              {page < 4 && (
                <button type="button" className="btn btn-next" onClick={goNext}>Continue →</button>
              )}
              {page === 4 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  {submitError && (
                    <span style={{ fontSize: "12px", color: "var(--error)", fontWeight: 600 }}>
                      ⚠ {submitError}
                    </span>
                  )}
                  <button
                    type="button" className="btn btn-submit" onClick={submit}
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                  >
                    {isSubmitting ? "Submitting…" : "✔ Submit Application"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VAJobApplicationForm;