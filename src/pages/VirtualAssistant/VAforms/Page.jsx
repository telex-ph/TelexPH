
import React, {
  useState,
  useRef,
  useEffect,
  useCallback
} from "react";
const COUNTRIES = [
  "Philippines",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Singapore",
  "Malaysia",
  "New Zealand",
  "Other"
];
const TIMEZONES = [
  "Philippine Standard Time (PHT, UTC+8)",
  "Eastern Time (ET, UTC-5/-4)",
  "Central Time (CT, UTC-6/-5)",
  "Mountain Time (MT, UTC-7/-6)",
  "Pacific Time (PT, UTC-8/-7)",
  "Greenwich Mean Time (GMT, UTC+0)",
  "Central European Time (CET, UTC+1)",
  "Australian Eastern Time (AEST, UTC+10)",
  "Singapore Standard Time (SST, UTC+8)",
  "India Standard Time (IST, UTC+5:30)"
];
const SERVICE_GROUPS = [
  {
    category: "Client Services",
    icon: "\u25C8",
    services: [
      "Customer Service Representative",
      "Technical Support Representative"
    ]
  },
  {
    category: "Web & Design",
    icon: "\u25C9",
    services: [
      "Web Development",
      "Social Media Management",
      "Video & Graphics Design"
    ]
  },
  {
    category: "Funnels & Systems",
    icon: "\u25CE",
    services: [
      "Funnel Builder",
      "Website Builder",
      "Surveys & Forms System",
      "Document Signing System",
      "Booking & Appointment System",
      "Courses & Digital Products System"
    ]
  },
  {
    category: "Automation & AI",
    icon: "\u25C6",
    services: [
      "AI Builder (Chatbots / AI Systems)",
      "Automation Builder (Advanced Workflows)"
    ]
  },
  {
    category: "Marketing & CRM",
    icon: "\u25C7",
    services: [
      "Email Marketing Management",
      "CRM System Setup & Management"
    ]
  },
  {
    category: "Platform Services",
    icon: "\u25FC",
    services: [
      "Gray-Label Platform",
      "White-Label Platform"
    ]
  }
];
const STEPS = [
  { id: 1, label: "Personal", icon: "01" },
  { id: 2, label: "Services", icon: "02" },
  { id: 3, label: "Resume", icon: "03" },
  { id: 4, label: "Review", icon: "04" }
];
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --maroon:        #800000;
  --maroon-lt:     #9a1a1a;
  --maroon-dk:     #5c0000;
  --maroon-mid:    #6b0000;
  --maroon-dim:    rgba(128,0,0,.08);
  --maroon-dim2:   rgba(128,0,0,.15);
  --maroon-dim3:   rgba(128,0,0,.04);
  --maroon-glow:   rgba(128,0,0,.22);

  --white:         #ffffff;
  --off-white:     #fdfcfc;
  --surface:       #f8f5f5;
  --surface-2:     #f2eeee;
  --border:        rgba(128,0,0,.12);
  --border-lt:     rgba(128,0,0,.07);

  --text:          #1c0808;
  --text-muted:    rgba(28,8,8,.52);
  --text-faint:    rgba(28,8,8,.32);

  --sidebar-bg:    linear-gradient(160deg, #6b0000 0%, #4a0000 60%, #3a0000 100%);
  --sidebar-solid: #5c0000;

  --white-dim:     rgba(255,255,255,.7);
  --white-faint:   rgba(255,255,255,.4);
  --white-wire:    rgba(255,255,255,.1);
  --white-subtle:  rgba(255,255,255,.06);

  --danger:        #c0392b;
  --ok:            #27ae60;

  --font: 'Plus Jakarta Sans', sans-serif;
  --tr: all .2s cubic-bezier(.4,0,.2,1);
  --tr-slow: all .35s cubic-bezier(.4,0,.2,1);
  --sh-maroon: 0 0 0 3px rgba(128,0,0,.15);
  --sh-card: 0 2px 4px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.08);
  --sh-card-hover: 0 4px 8px rgba(0,0,0,.08), 0 16px 40px rgba(0,0,0,.14), 0 2px 4px rgba(0,0,0,.06);
  --sh-btn: 0 4px 16px rgba(128,0,0,.3), 0 1px 3px rgba(128,0,0,.2);
  --radius: 12px;
  --radius-sm: 8px;
  --radius-xs: 6px;

  /* \u2500\u2500 Clean classic inputs \u2500\u2500 */
  --neu-radius: 8px;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font);
  background: var(--off-white);
  color: var(--text);
  min-height: 100vh;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* \u2500\u2500 LAYOUT \u2500\u2500 */
.va-root { background: var(--off-white); min-height: 100vh; }
.va-outer { display: flex; width: 100%; min-height: 100vh; align-items: flex-start; }

/* \u2500\u2500 LEFT PANEL \u2500\u2500 */
.va-left {
  width: 380px; flex-shrink: 0;
  background: var(--sidebar-solid);
  background-image: var(--sidebar-bg);
  padding: 48px 32px 64px 36px;
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh; overflow-y: auto;
  scrollbar-width: thin; scrollbar-color: var(--white-wire) transparent;
  border-right: 1px solid rgba(0,0,0,.18);
  box-shadow: 4px 0 32px rgba(0,0,0,.18);
}
.va-left::before {
  content: '';
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 80% 50% at 110% 10%, rgba(255,160,160,.1) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at -10% 80%, rgba(0,0,0,.25) 0%, transparent 60%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,.03)'/%3E%3C/svg%3E");
}
.va-left::-webkit-scrollbar { width: 3px; }
.va-left::-webkit-scrollbar-track { background: transparent; }
.va-left::-webkit-scrollbar-thumb { background: var(--white-wire); border-radius: 99px; }

.va-logo-row {
  display: flex; align-items: center; gap: 14px; margin-bottom: 40px;
  position: relative; z-index: 1;
}
.va-logo-mark {
  width: 50px; height: 50px; flex-shrink: 0;
  background: var(--white);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font); font-size: 17px; font-weight: 800;
  color: var(--maroon); letter-spacing: -1.5px;
  box-shadow: 0 4px 16px rgba(0,0,0,.25), 0 1px 3px rgba(0,0,0,.15);
}
.va-brand-col { display: flex; flex-direction: column; gap: 3px; }
.va-brand {
  font-size: 14px; font-weight: 700;
  color: var(--white); letter-spacing: -.3px; line-height: 1;
}
.va-brand-sub {
  font-size: 9.5px; font-weight: 600;
  color: rgba(255,255,255,.45); letter-spacing: 2px; text-transform: uppercase;
}

.va-hero { position: relative; z-index: 1; margin-bottom: 36px; }
.va-tag {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 20px; padding: 6px 14px;
  font-size: 9.5px; font-weight: 700; color: #ffcece;
  text-transform: uppercase; letter-spacing: 2px;
  margin-bottom: 18px;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.1);
}
.va-tag-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #ff7070;
  box-shadow: 0 0 8px rgba(255,112,112,.9), 0 0 16px rgba(255,112,112,.4);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px rgba(255,112,112,.9); }
  50% { opacity: .7; transform: scale(.75); box-shadow: 0 0 4px rgba(255,112,112,.5); }
}
.va-headline {
  font-size: 29px; font-weight: 800; line-height: 1.22;
  color: var(--white); margin-bottom: 14px; letter-spacing: -.7px;
}
.va-headline em { color: #ffb0b0; font-style: normal; }
.va-subtext {
  font-size: 13px; font-weight: 400; color: rgba(255,255,255,.65); line-height: 1.85;
}

.va-divline {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.05) 60%, transparent 100%);
  margin: 28px 0;
  position: relative; z-index: 1;
}

.va-section-label {
  font-size: 9px; font-weight: 800; color: rgba(255,176,176,.7);
  text-transform: uppercase; letter-spacing: 3px;
  margin-bottom: 14px;
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 8px;
}
.va-section-label::after {
  content: ''; flex: 1; height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,.1) 0%, transparent 100%);
}

.va-step-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 32px; position: relative; z-index: 1; }
.va-step-row {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.07);
  transition: background .2s;
}
.va-step-row:hover { background: rgba(255,255,255,.09); }
.va-step-num {
  width: 28px; height: 28px; flex-shrink: 0; border-radius: 8px;
  background: rgba(255,255,255,.15);
  border: 1px solid rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: var(--white); margin-top: 1px;
  box-shadow: 0 2px 6px rgba(0,0,0,.15);
}
.va-step-info strong { display: block; font-size: 12.5px; font-weight: 700; color: var(--white); letter-spacing: -.1px; }
.va-step-info span { font-size: 11px; font-weight: 400; color: rgba(255,255,255,.45); margin-top: 2px; display: block; }

.va-benefit-list { display: flex; flex-direction: column; gap: 4px; position: relative; z-index: 1; }
.va-benefit-row {
  display: flex; align-items: flex-start; gap: 13px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.07);
  transition: background .2s;
}
.va-benefit-row:hover { background: rgba(255,255,255,.09); }
.va-benefit-icon {
  font-size: 13px; flex-shrink: 0; color: #ffb0b0; margin-top: 1px;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,.08);
  border-radius: 7px; border: 1px solid rgba(255,255,255,.1);
}
.va-benefit-text strong { display: block; font-size: 12.5px; font-weight: 700; color: var(--white); letter-spacing: -.1px; }
.va-benefit-text span { font-size: 11px; font-weight: 400; color: rgba(255,255,255,.5); line-height: 1.6; display: block; margin-top: 2px; }

/* \u2500\u2500 RIGHT \u2500\u2500 */
.va-right {
  flex: 1; min-width: 0;
  background: var(--off-white);
  padding: 0 48px;
  position: relative;
  display: flex; justify-content: center;
}
.va-right::before {
  content: '';
  position: fixed; top: 0; right: 0;
  width: 50vw; height: 300px;
  background: radial-gradient(ellipse at top right, rgba(128,0,0,.04) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}

/* \u2500\u2500 BACK ICON \u2500\u2500 */
.back-home-icon {
  position: fixed; top: 22px; right: 28px;
  width: 40px; height: 40px;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: var(--tr); z-index: 9999;
  color: var(--maroon); text-decoration: none;
  box-shadow: var(--sh-card);
}
.back-home-icon:hover {
  background: var(--maroon); color: var(--white); border-color: var(--maroon);
  box-shadow: var(--sh-btn);
  transform: translateY(-1px);
}
.back-home-icon svg {
  width: 16px; height: 16px;
  stroke: currentColor; fill: none;
  stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}

.va-wrap { width: 100%; max-width: 860px; position: relative; z-index: 1; padding: 52px 0 100px; }

/* \u2500\u2500 PAGE HEADER \u2500\u2500 */
.page-header { margin-bottom: 36px; }
.page-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 10.5px; font-weight: 700; color: var(--maroon);
  text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 10px;
}
.page-eyebrow::before {
  content: '';
  display: inline-block; width: 16px; height: 2px;
  background: var(--maroon); border-radius: 2px; opacity: .5;
}
.page-title {
  font-size: 32px; font-weight: 800; line-height: 1.15;
  color: var(--text); margin-bottom: 8px; letter-spacing: -.6px;
}
.page-desc { font-size: 14px; font-weight: 400; color: var(--text-muted); line-height: 1.7; }

/* \u2500\u2500 PROGRESS BAR \u2500\u2500 */
.progress-track {
  height: 3px; background: var(--surface-2); border-radius: 99px; margin-bottom: 28px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: linear-gradient(90deg, var(--maroon-dk), var(--maroon-lt));
  border-radius: 99px; transition: width .5s cubic-bezier(.4,0,.2,1);
}

/* \u2500\u2500 STEPPER \u2500\u2500 */
.stepper {
  display: flex; align-items: center; margin-bottom: 44px;
}
.step-item { display: flex; align-items: center; gap: 10px; }
.step-bubble {
  width: 38px; height: 38px; flex-shrink: 0; border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--white);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  color: var(--text-faint); transition: var(--tr);
  box-shadow: var(--sh-card);
}
.step-item.active .step-bubble {
  background: var(--maroon); border-color: var(--maroon);
  color: var(--white); box-shadow: var(--sh-btn);
  transform: scale(1.05);
}
.step-item.done .step-bubble {
  background: var(--maroon-dim2); border-color: var(--maroon);
  color: var(--maroon);
}
.step-lbl {
  font-size: 11px; font-weight: 600; color: var(--text-faint);
  text-transform: uppercase; letter-spacing: 1px;
  transition: var(--tr); white-space: nowrap;
}
.step-item.active .step-lbl { color: var(--maroon); font-weight: 700; }
.step-item.done   .step-lbl { color: var(--maroon-lt); }
.step-connector {
  flex: 1; height: 2px;
  background: var(--border-lt);
  margin: 0 10px; transition: var(--tr); min-width: 20px;
  border-radius: 2px; overflow: hidden; position: relative;
}
.step-connector.done {
  background: linear-gradient(90deg, var(--maroon), rgba(128,0,0,.3));
}

/* \u2500\u2500 SECTION LABEL \u2500\u2500 */
.sec-lbl {
  font-size: 9.5px; font-weight: 700; color: var(--maroon);
  text-transform: uppercase; letter-spacing: 2.5px;
  margin: 30px 0 16px; padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
}
.sec-lbl::after { content: ''; flex: 1; height: 1px; background: var(--border-lt); }
.sec-lbl:first-child { margin-top: 0; }

/* \u2500\u2500 CARD \u2500\u2500 */
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 20px; overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,.04), 0 12px 32px rgba(0,0,0,.1), 0 2px 4px rgba(0,0,0,.06), 0 24px 64px rgba(0,0,0,.07);
  transition: var(--tr-slow);
  width: 100%;
}
.card:hover {
  box-shadow: 0 6px 10px rgba(0,0,0,.06), 0 20px 48px rgba(0,0,0,.13), 0 4px 8px rgba(0,0,0,.06), 0 32px 80px rgba(0,0,0,.09);
  transform: translateY(-1px);
}
.card-head {
  padding: 22px 28px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 16px;
  background: linear-gradient(135deg, var(--maroon-dk) 0%, var(--maroon) 60%, var(--maroon-lt) 100%);
  position: relative; overflow: hidden;
}
.card-head::before {
  content: '';
  position: absolute; top: -40px; right: -40px;
  width: 130px; height: 130px; border-radius: 50%;
  background: rgba(255,255,255,.04);
}
.card-head::after {
  content: '';
  position: absolute; bottom: -30px; right: 80px;
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(255,255,255,.03);
}
.card-icon {
  width: 40px; height: 40px; flex-shrink: 0; border-radius: var(--radius-sm);
  background: rgba(255,255,255,.18);
  border: 1px solid rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; color: var(--white);
  position: relative; z-index: 1;
}
.card-head-text { position: relative; z-index: 1; }
.card-head-text h2 {
  font-size: 17px; font-weight: 700; color: var(--white); line-height: 1.2; letter-spacing: -.2px;
}
.card-head-text p { font-size: 12px; font-weight: 400; color: rgba(255,255,255,.6); margin-top: 3px; }
.card-badge {
  margin-left: auto; flex-shrink: 0;
  background: rgba(255,255,255,.15);
  border: 1px solid rgba(255,255,255,.25);
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 10px; font-weight: 700; color: var(--white);
  letter-spacing: 1px; text-transform: uppercase; white-space: nowrap;
  position: relative; z-index: 1;
}
.card-body { padding: 28px; width: 100%; background: #f0f0f0; }

/* \u2500\u2500 NOTICE \u2500\u2500 */
.notice {
  background: var(--maroon-dim3);
  border: 1px solid var(--border);
  border-left: 3px solid var(--maroon);
  border-radius: var(--radius-xs);
  padding: 13px 16px;
  font-size: 12.5px; font-weight: 400;
  line-height: 1.75; color: var(--text-muted); margin-bottom: 24px;
  display: flex; align-items: flex-start; gap: 10px;
}
.notice-icon { font-size: 13px; flex-shrink: 0; margin-top: 1px; }
.notice b { color: var(--maroon); font-weight: 700; }
.notice-warn { border-left-color: var(--danger); background: rgba(192,57,43,.04); }
.notice-brand { border-left-color: var(--maroon); background: var(--maroon-dim3); }

/* \u2500\u2500 GRIDS \u2500\u2500 */
.grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 22px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px 22px; }
.grid-1 { display: grid; grid-template-columns: 1fr; gap: 18px; }
.col-2  { grid-column: span 2; }
.col-3  { grid-column: span 3; }

/* \u2500\u2500 FIELD \u2500\u2500 */
.field { display: flex; flex-direction: column; gap: 6px; }
.field > label {
  font-size: 11px; font-weight: 700; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 1.2px;
}
.req  { color: var(--maroon); margin-left: 2px; }
.opt  { font-weight: 500; color: var(--text-faint); text-transform: none; font-size: 10.5px; letter-spacing: 0; margin-left: 4px; }
.hint { font-size: 11px; font-weight: 400; color: var(--text-faint); }
.err-msg { font-size: 11px; color: var(--danger); font-weight: 600; min-height: 15px; display: flex; align-items: center; gap: 4px; }

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   NEUMORPHIC INPUTS \u2014 inner shadow style
   matching reference: blur 30px, X/Y 18px,
   opacity 100%, color #D1D9E6
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   NEUMORPHIC INPUTS \u2014 two inner shadows
   White: blur 50, X/Y -30, opacity 70%, #FFFFFF
   Dark:  blur 50, X/Y  30, opacity 16%, #0D2750
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
input[type=text],
input[type=email],
input[type=tel],
input[type=date],
input[type=url],
select,
textarea {
  width: 100%;
  padding: 11px 14px;
  border: none;
  border-radius: 14px;
  background: #E5E5E5 !important;
  background-color: #E5E5E5 !important;
  font-family: var(--font);
  font-size: 13.5px; font-weight: 400;
  color: #1c0808 !important;
  outline: none;
  transition: box-shadow .2s ease, background .15s;
  -webkit-appearance: none; appearance: none;
  color-scheme: light !important;

  /* Two inner shadows from reference */
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.16);
}

input:focus,
select:focus,
textarea:focus {
  background: #E0E0E0 !important;
  background-color: #E0E0E0 !important;
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.22),
    0 0 0 2.5px rgba(128,0,0,.35);
}

input:hover:not(:focus),
select:hover:not(:focus),
textarea:hover:not(:focus) {
  background: #E2E2E2 !important;
  background-color: #E2E2E2 !important;
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.20);
}

/* Autofill override */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
select:-webkit-autofill,
textarea:-webkit-autofill {
  -webkit-box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.16),
    0 0 0 1000px #E5E5E5 inset !important;
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.16),
    0 0 0 1000px #E5E5E5 inset !important;
  -webkit-text-fill-color: #1c0808 !important;
  background-color: #E5E5E5 !important;
  color-scheme: light !important;
}

select option {
  background: #ffffff !important;
  background-color: #ffffff !important;
  color: #1c0808 !important;
}

input::placeholder, textarea::placeholder { color: var(--text-faint); font-weight: 300; }

/* Error state \u2014 keep inner shadow, add red tint */
/* Error state */
input.err,
select.err,
textarea.err {
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.16),
    0 0 0 2.5px rgba(192,57,43,.4) !important;
}

textarea {
  resize: vertical; min-height: 100px; line-height: 1.7;
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.16);
}
textarea:focus {
  background: #E0E0E0 !important;
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.22),
    0 0 0 2.5px rgba(128,0,0,.35);
}

/* Custom select arrow */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23800000' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 14px center !important;
  padding-right: 36px; cursor: pointer;
}

/* Date picker icon */
input[type=date]::-webkit-calendar-picker-indicator {
  filter: invert(.1) sepia(1) hue-rotate(320deg) saturate(6);
  cursor: pointer; opacity: .45;
}
input[type=date]::-webkit-calendar-picker-indicator:hover { opacity: .9; }

/* \u2500\u2500 SERVICE GRID \u2500\u2500 */
.svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

.svc-group {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden; transition: var(--tr);
}
.svc-group:hover { border-color: rgba(128,0,0,.22); box-shadow: var(--sh-card-hover); }
.svc-group-head {
  padding: 11px 14px;
  display: flex; align-items: center; gap: 9px;
  background: linear-gradient(135deg, var(--maroon-dk) 0%, var(--maroon) 100%);
}
.svc-group-icon { font-size: .75rem; flex-shrink: 0; color: #ffb0b0; }
.svc-group-name { font-size: 11px; font-weight: 700; color: var(--white); flex: 1; min-width: 0; letter-spacing: -.1px; }
.svc-count {
  flex-shrink: 0; background: rgba(255,255,255,.2);
  border-radius: 10px; padding: 2px 9px;
  font-size: 10px; font-weight: 700; color: var(--white);
}
.svc-list { padding: 8px; display: flex; flex-direction: column; gap: 2px; }
.svc-chip {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 8px 10px; border-radius: var(--radius-xs);
  cursor: pointer; transition: background .15s; user-select: none;
  border: 1px solid transparent;
}
.svc-chip:hover { background: var(--maroon-dim3); border-color: var(--border); }
.svc-chip.sel   { background: var(--maroon-dim); border-color: rgba(128,0,0,.2); }

/* Checkbox inside svc-chip \u2014 keep native look, not neumorphic */
.svc-chip input[type=checkbox] {
  width: 13px; height: 13px; flex-shrink: 0; margin-top: 2px;
  accent-color: var(--maroon); cursor: pointer;
  box-shadow: none !important;
  padding: 0; background: none !important;
  border: none !important; border-radius: 0 !important;
}

.svc-chip-label {
  font-size: 12px; font-weight: 400; color: var(--text-muted);
  line-height: 1.45; transition: color .15s;
}
.svc-chip.sel .svc-chip-label { color: var(--maroon); font-weight: 600; }

/* \u2500\u2500 SELECTED PILLS \u2500\u2500 */
.sel-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.sel-pill {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 12px; border-radius: 20px;
  background: var(--maroon-dim); border: 1px solid rgba(128,0,0,.2);
  font-size: 11.5px; font-weight: 600; color: var(--maroon);
  transition: var(--tr);
}
.sel-pill:hover { background: var(--maroon-dim2); }
.sel-pill button {
  background: none; border: none; color: var(--maroon);
  cursor: pointer; font-size: .65rem; padding: 0; line-height: 1; opacity: .5; transition: opacity .15s;
}
.sel-pill button:hover { opacity: 1; }

/* \u2500\u2500 UPLOAD \u2500\u2500 */
.upload-zone {
  background: #E5E5E5;
  border: none;
  border-radius: 14px;
  padding: 40px 28px;
  text-align: center; cursor: pointer;
  transition: box-shadow .2s, background .15s;
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.16);
}
.upload-zone:hover {
  background: #E0E0E0;
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.20);
}
.upload-zone.filled {
  background: #E0E0E0;
  box-shadow:
    inset -30px -30px 50px rgba(255,255,255,.70),
    inset  30px  30px 50px rgba(13,39,80,.20),
    0 0 0 2.5px rgba(128,0,0,.25);
}
.upload-icon  { font-size: 28px; margin-bottom: 12px; display: block; }
.upload-title { font-size: 13.5px; font-weight: 600; color: var(--text); }
.upload-sub   { font-size: 11.5px; font-weight: 400; color: var(--text-faint); margin-top: 5px; }
.file-tag {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 14px; padding: 7px 16px; border-radius: 20px;
  background: var(--maroon-dim); border: 1px solid rgba(128,0,0,.2);
  font-size: 12px; font-weight: 600; color: var(--maroon);
}
.file-tag button {
  background: none; border: none; color: var(--maroon);
  cursor: pointer; font-size: .7rem; padding: 0; line-height: 1; opacity: .5; transition: opacity .15s;
}
.file-tag button:hover { opacity: 1; }

/* \u2500\u2500 REVIEW \u2500\u2500 */
.rev-wrap { display: flex; flex-direction: column; gap: 12px; }
.rev-block {
  background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden;
  transition: var(--tr);
}
.rev-block:hover { box-shadow: var(--sh-card-hover); }
.rev-block-head {
  padding: 13px 22px; display: flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, var(--maroon-dk) 0%, var(--maroon) 100%);
}
.rev-block-head span:first-child { font-size: .75rem; color: #ffb0b0; }
.rev-block-head span:last-child { font-size: 13px; font-weight: 700; color: var(--white); letter-spacing: -.1px; }
table.rev-tbl { width: 100%; border-collapse: collapse; }
table.rev-tbl td { padding: 11px 22px; font-size: 13px; border-bottom: 1px solid var(--border-lt); }
table.rev-tbl tr:last-child td { border-bottom: none; }
table.rev-tbl td:first-child {
  width: 32%; font-size: 10.5px; font-weight: 700;
  color: var(--text-faint); text-transform: uppercase; letter-spacing: .8px;
}
table.rev-tbl td:last-child { color: var(--text); font-weight: 500; }

/* \u2500\u2500 NAV \u2500\u2500 */
.form-nav {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 28px; padding-top: 24px;
  border-top: 1px solid var(--border-lt);
}
.btn {
  padding: 12px 28px; font-family: var(--font);
  font-size: 13px; font-weight: 700; border: none;
  cursor: pointer; transition: var(--tr);
  letter-spacing: .3px;
  border-radius: var(--radius-sm);
  display: inline-flex; align-items: center; gap: 8px;
}
.btn-ghost {
  background: var(--white); border: 1.5px solid var(--border); color: var(--text-muted);
}
.btn-ghost:hover {
  border-color: var(--maroon); color: var(--maroon); background: var(--maroon-dim3);
  transform: translateX(-2px);
}
.btn-next {
  background: var(--maroon); color: var(--white);
  box-shadow: var(--sh-btn);
}
.btn-next:hover  {
  background: var(--maroon-lt);
  box-shadow: 0 6px 22px rgba(128,0,0,.38);
  transform: translateY(-1px);
}
.btn-next:active { opacity: .9; transform: translateY(0); }
.btn-submit {
  background: linear-gradient(135deg, var(--maroon-dk) 0%, var(--maroon-lt) 100%);
  color: var(--white);
  padding: 13px 36px;
  box-shadow: var(--sh-btn);
}
.btn-submit:hover  {
  background: linear-gradient(135deg, var(--maroon) 0%, var(--maroon-lt) 100%);
  box-shadow: 0 6px 22px rgba(128,0,0,.38);
  transform: translateY(-1px);
}
.btn-submit:active { opacity: .9; transform: translateY(0); }
.btn-submit:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

/* \u2500\u2500 SUCCESS \u2500\u2500 */
.success-wrap {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  text-align: center; padding: 64px 48px;
  max-width: 520px;
  box-shadow: var(--sh-card-hover);
  position: relative; overflow: hidden;
}
.success-wrap::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, var(--maroon-dk), var(--maroon-lt));
}
.success-mark {
  width: 76px; height: 76px; border-radius: 50%;
  background: linear-gradient(135deg, var(--maroon-dk), var(--maroon-lt));
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; color: var(--white);
  margin: 0 auto 24px;
  box-shadow: 0 8px 28px rgba(128,0,0,.32);
}
.success-wrap h2 {
  font-size: 26px; font-weight: 800; color: var(--text); margin-bottom: 12px; letter-spacing: -.4px;
}
.success-wrap p { font-size: 13.5px; font-weight: 400; color: var(--text-muted); line-height: 1.8; max-width: 370px; margin: 0 auto 6px; }
.confirm-code {
  display: inline-block;
  background: var(--maroon-dim); border: 1.5px solid rgba(128,0,0,.2);
  border-radius: var(--radius-sm);
  padding: 12px 32px; margin: 18px auto;
  font-family: 'Courier New', monospace; font-size: 17px; font-weight: 700;
  color: var(--maroon); letter-spacing: 5px;
}

.divider { border: none; height: 1px; background: var(--border-lt); margin: 24px 0; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-enter { animation: fadeUp .3s cubic-bezier(.16,1,.3,1); }

/* \u2500\u2500 RESPONSIVE \u2500\u2500 */
@media (max-width: 1100px) {
  .va-left { width: 320px; padding: 36px 24px 52px 28px; }
  .va-right { padding: 0 32px; }
}
@media (max-width: 960px) {
  .va-outer { flex-direction: column; }
  .va-left  { width: 100%; height: auto; position: static; padding: 28px 24px 24px; }
  .va-right { padding: 0 24px; justify-content: flex-start; }
  .va-wrap  { padding: 36px 0 80px; }
  .stepper { margin-bottom: 36px; }
  .step-connector { min-width: 14px; }
  .va-headline { font-size: 26px; }
}
@media (max-width: 720px) {
  .va-right { padding: 0 16px; }
  .va-wrap  { padding: 24px 0 80px; }
  .grid-3 { grid-template-columns: 1fr 1fr; }
  .col-3  { grid-column: span 2; }
  .svc-grid { grid-template-columns: 1fr 1fr !important; }
  .step-lbl { display: none; }
  .step-connector { min-width: 8px; }
}
@media (max-width: 560px) {
  .va-right { padding: 0 10px; }
  .va-wrap  { padding: 18px 0 80px; }
  .va-left  { padding: 20px 16px; }
  .card-body { padding: 20px 16px; }
  .card-head { padding: 16px 18px; }
  .card-badge { display: none; }
  .grid, .grid-3 { grid-template-columns: 1fr; }
  .col-2, .col-3 { grid-column: span 1; }
  .svc-grid { grid-template-columns: 1fr !important; }
  .step-bubble { width: 34px; height: 34px; font-size: 11px; }
  .btn { padding: 11px 20px; font-size: 12px; }
  .btn-submit { padding: 11px 26px; }
  .rev-tbl td { padding: 9px 14px; font-size: 12px; }
  .back-home-icon { top: 12px; right: 12px; width: 36px; height: 36px; }
  .success-wrap { padding: 40px 20px; }
  .page-title { font-size: 26px; }
}
`;
const randCode = () => "VA-" + Math.random().toString(36).toUpperCase().slice(2, 10);
const Field = ({ label, required, optional, hint, error, children, className }) => <div className={`field${className ? " " + className : ""}`}>
    <label>
      {label}
      {required && <span className="req">*</span>}
      {optional && <span className="opt">(optional)</span>}
    </label>
    {children}
    {hint && <span className="hint">{hint}</span>}
    <span className="err-msg">{error ? <>⚠ {error}</> : ""}</span>
  </div>;
const Inp = ({ value, onChange, placeholder, type = "text", maxLength, hasError }) => <input
  type={type}
  value={value}
  onChange={onChange}
  placeholder={placeholder}
  maxLength={maxLength}
  className={hasError ? "err" : ""}
/>;
const Sel = ({ value, onChange, options, placeholder = "Select\u2026", hasError }) => <select value={value} onChange={onChange} className={hasError ? "err" : ""}>
    <option value="">{placeholder}</option>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>;
const SingleUpload = ({ file, onAdd, onRemove }) => {
  const ref = useRef(null);
  return <div>
      <div className={`upload-zone${file ? " filled" : ""}`} onClick={() => ref.current?.click()}>
        <span className="upload-icon">{file ? "\u{1F4CE}" : "\u{1F4C4}"}</span>
        {file ? <><p className="upload-title">{file.file.name}</p><p className="upload-sub">Click to replace file</p></> : <><p className="upload-title">Click to browse or drag & drop</p><p className="upload-sub">PDF, DOC, DOCX — max 10 MB</p></>}
      </div>
      {file && <div style={{ textAlign: "center" }}>
          <span className="file-tag">
            ✓ {file.file.name}
            <button type="button" onClick={(e) => {
    e.stopPropagation();
    onRemove();
  }}>✕</button>
          </span>
        </div>}
      <input
    ref={ref}
    type="file"
    accept=".pdf,.doc,.docx"
    style={{ display: "none" }}
    onChange={(e) => {
      if (e.target.files?.[0]) {
        onAdd(e.target.files[0]);
        e.target.value = "";
      }
    }}
  />
    </div>;
};
const INITIAL = {
  personal: {
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    dob: "",
    gender: ""
  },
  service: {
    services: [],
    experienceLevel: "",
    availability: "",
    timezone: "",
    rate: "",
    startDate: ""
  },
  resume: { resume: null, coverLetter: "" }
};
const Page1 = ({ data, errors, set, clrErr }) => <div className="page-enter">
    <div className="card">
      <div className="card-head">
        <div className="card-icon">I</div>
        <div className="card-head-text">
          <h2>Personal Information</h2>
          <p>Tell us a bit about yourself</p>
        </div>
        <span className="card-badge">Step 1 of 4</span>
      </div>
      <div className="card-body">
        <div className="notice notice-brand">
          <span className="notice-icon">ℹ</span>
          <span>Fields marked <b>*</b> are required. Your information is kept strictly confidential.</span>
        </div>

        <p className="sec-lbl">Full Name</p>
        <div className="grid-3">
          <Field label="First Name" required error={errors.firstName}>
            <Inp
  value={data.firstName}
  hasError={!!errors.firstName}
  placeholder="Juan"
  maxLength={50}
  onChange={(e) => {
    set("firstName", e.target.value);
    clrErr("firstName");
  }}
/>
          </Field>
          <Field label="Middle Name" optional>
            <Inp
  value={data.middleName}
  placeholder="D."
  maxLength={50}
  onChange={(e) => set("middleName", e.target.value)}
/>
          </Field>
          <Field label="Last Name" required error={errors.lastName}>
            <Inp
  value={data.lastName}
  hasError={!!errors.lastName}
  placeholder="dela Cruz"
  maxLength={50}
  onChange={(e) => {
    set("lastName", e.target.value);
    clrErr("lastName");
  }}
/>
          </Field>
        </div>

        <p className="sec-lbl">Contact Details</p>
        <div className="grid">
          <Field label="Email Address" required error={errors.email}>
            <Inp
  type="email"
  value={data.email}
  hasError={!!errors.email}
  placeholder="juan@email.com"
  maxLength={100}
  onChange={(e) => {
    set("email", e.target.value);
    clrErr("email");
  }}
/>
          </Field>
          <Field
  label="Phone / WhatsApp"
  required
  error={errors.phone}
  hint="Numbers, +, spaces only (e.g. +63 917 000 0000)"
>
            <Inp
  type="tel"
  value={data.phone}
  hasError={!!errors.phone}
  placeholder="+63 917 000 0000"
  maxLength={20}
  onChange={(e) => {
    const v = e.target.value.replace(/[^\d\s+\-()]/g, "");
    set("phone", v);
    clrErr("phone");
  }}
/>
          </Field>
        </div>

        <p className="sec-lbl">Address</p>
        <div className="grid">
          <Field label="Street Address" required error={errors.address} className="col-2">
            <Inp
  value={data.address}
  hasError={!!errors.address}
  placeholder="123 Rizal St, Brgy. San Antonio"
  maxLength={150}
  onChange={(e) => {
    set("address", e.target.value);
    clrErr("address");
  }}
/>
          </Field>
          <Field label="City / Municipality" required error={errors.city}>
            <Inp
  value={data.city}
  hasError={!!errors.city}
  placeholder="Makati"
  maxLength={80}
  onChange={(e) => {
    set("city", e.target.value);
    clrErr("city");
  }}
/>
          </Field>
          <Field label="State / Province" optional>
            <Inp
  value={data.state}
  placeholder="Metro Manila"
  maxLength={80}
  onChange={(e) => set("state", e.target.value)}
/>
          </Field>
          <Field label="ZIP / Postal Code" required error={errors.zip}>
            <Inp
  value={data.zip}
  hasError={!!errors.zip}
  placeholder="1200"
  maxLength={10}
  onChange={(e) => {
    const v = e.target.value.replace(/[^\d\-\s]/g, "");
    set("zip", v);
    clrErr("zip");
  }}
/>
          </Field>
          <Field label="Country" required error={errors.country}>
            <Sel
  value={data.country}
  hasError={!!errors.country}
  onChange={(e) => {
    set("country", e.target.value);
    clrErr("country");
  }}
  options={COUNTRIES}
  placeholder="Select Country"
/>
          </Field>
        </div>

        <p className="sec-lbl">Personal Details</p>
        <div className="grid">
          <Field label="Date of Birth" required error={errors.dob}>
            <input
  type="date"
  value={data.dob}
  min="1924-01-01"
  max={new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() - 18)).toISOString().split("T")[0]}
  className={errors.dob ? "err" : ""}
  onChange={(e) => {
    set("dob", e.target.value);
    clrErr("dob");
  }}
/>
          </Field>
          <Field label="Gender" optional>
            <Sel
  value={data.gender}
  onChange={(e) => set("gender", e.target.value)}
  options={["Male", "Female", "Non-binary", "Prefer not to say"]}
/>
          </Field>
        </div>
      </div>
    </div>
  </div>;
const Page2 = ({ data, errors, set, clrErr }) => {
  const toggle = (svc) => {
    const next = data.services.includes(svc) ? data.services.filter((s) => s !== svc) : [...data.services, svc];
    set("services", next);
    clrErr("services");
  };
  return <div className="page-enter">
      <div className="card">
        <div className="card-head">
          <div className="card-icon">II</div>
          <div className="card-head-text">
            <h2>Services You're Applying For</h2>
            <p>Select all VA services you can offer</p>
          </div>
          <span className="card-badge">Step 2 of 4</span>
        </div>
        <div className="card-body">
          {errors.services && <div className="notice notice-warn" style={{ marginBottom: 16 }}>
              <span className="notice-icon">⚠</span>
              <span><b>Please select at least one service</b> before continuing.</span>
            </div>}

          <p className="sec-lbl">Available Services — select all that apply</p>
          <div className="svc-grid">
            {SERVICE_GROUPS.map((g) => {
    const cnt = g.services.filter((s) => data.services.includes(s)).length;
    return <div key={g.category} className="svc-group">
                  <div className="svc-group-head">
                    <span className="svc-group-icon">{g.icon}</span>
                    <span className="svc-group-name">{g.category}</span>
                    {cnt > 0 && <span className="svc-count">{cnt}</span>}
                  </div>
                  <div className="svc-list">
                    {g.services.map((svc) => <label key={svc} className={`svc-chip${data.services.includes(svc) ? " sel" : ""}`}>
                        <input type="checkbox" checked={data.services.includes(svc)} onChange={() => toggle(svc)} />
                        <span className="svc-chip-label">{svc}</span>
                      </label>)}
                  </div>
                </div>;
  })}
          </div>

          {data.services.length > 0 && <>
              <p className="sec-lbl" style={{ marginTop: 24 }}>Selected ({data.services.length})</p>
              <div className="sel-pills">
                {data.services.map((s) => <span key={s} className="sel-pill">
                    {s}
                    <button type="button" onClick={() => toggle(s)}>✕</button>
                  </span>)}
              </div>
            </>}

          <hr className="divider" />
          <p className="sec-lbl">Work Preferences</p>
          <div className="grid">
            <Field label="Experience Level" required error={errors.experienceLevel}>
              <Sel
    value={data.experienceLevel}
    hasError={!!errors.experienceLevel}
    onChange={(e) => {
      set("experienceLevel", e.target.value);
      clrErr("experienceLevel");
    }}
    options={["Entry Level (0\u20131 yr)", "Junior (1\u20132 yrs)", "Mid-Level (2\u20134 yrs)", "Senior (4\u20136 yrs)", "Expert (6+ yrs)"]}
  />
            </Field>
            <Field label="Availability" required error={errors.availability}>
              <Sel
    value={data.availability}
    hasError={!!errors.availability}
    onChange={(e) => {
      set("availability", e.target.value);
      clrErr("availability");
    }}
    options={["Immediately", "Within 1 week", "Within 2 weeks", "Within 30 days", "60+ days"]}
  />
            </Field>
            <Field label="Timezone" required error={errors.timezone}>
              <Sel
    value={data.timezone}
    hasError={!!errors.timezone}
    onChange={(e) => {
      set("timezone", e.target.value);
      clrErr("timezone");
    }}
    options={TIMEZONES}
  />
            </Field>
            <Field label="Expected Rate" required error={errors.rate} hint="e.g. $5/hr, $800/mo, $200/project">
              <Inp
    value={data.rate}
    hasError={!!errors.rate}
    placeholder="$5/hr"
    maxLength={30}
    onChange={(e) => {
      set("rate", e.target.value);
      clrErr("rate");
    }}
  />
            </Field>
            <Field label="Earliest Start Date" optional className="col-2">
              <Inp type="date" value={data.startDate} onChange={(e) => set("startDate", e.target.value)} />
            </Field>
          </div>
        </div>
      </div>
    </div>;
};
const Page3 = ({ data, errors, setResume, setCoverLetter, clrErr }) => <div className="page-enter">
    <div className="card">
      <div className="card-head">
        <div className="card-icon">III</div>
        <div className="card-head-text">
          <h2>Resume / CV</h2>
          <p>Upload your resume and write a cover letter</p>
        </div>
        <span className="card-badge">Step 3 of 4</span>
      </div>
      <div className="card-body">
        <div className="notice notice-brand">
          <span className="notice-icon">ℹ</span>
          <span>Upload your most recent resume or CV. <b>PDF format is preferred.</b> Max file size: 10 MB.</span>
        </div>
        <p className="sec-lbl">Resume or CV <span style={{ color: "var(--maroon)" }}>*</span></p>
        <SingleUpload
  file={data.resume}
  onAdd={(f) => {
    setResume(f);
    clrErr("resume");
  }}
  onRemove={() => setResume(null)}
/>
        {errors.resume && <p className="err-msg" style={{ marginTop: 8 }}>⚠ {errors.resume}</p>}

        <hr className="divider" />
        <p className="sec-lbl">Cover Letter <span className="opt">(optional)</span></p>
        <textarea
  value={data.coverLetter}
  onChange={(e) => {
    if (e.target.value.length <= 1500) setCoverLetter(e.target.value);
  }}
  placeholder="Introduce yourself — share your experience, your strengths as a Virtual Assistant, and why you're a great fit..."
  style={{ minHeight: 190 }}
  maxLength={1500}
/>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <p className="hint">Tip: Mention the specific services you selected and tools you use.</p>
          <p className="hint" style={{ flexShrink: 0, marginLeft: 8, color: data.coverLetter.length > 1400 ? "var(--danger)" : void 0 }}>
            {data.coverLetter.length} / 1500
          </p>
        </div>
      </div>
    </div>
  </div>;
const Page4 = ({ formData: d }) => {
  const blocks = [
    {
      icon: "\u25C8",
      title: "Personal Information",
      rows: [
        { label: "Name", value: [d.personal.firstName, d.personal.middleName, d.personal.lastName].filter(Boolean).join(" ") || "\u2014" },
        { label: "Email", value: d.personal.email || "\u2014" },
        { label: "Phone", value: d.personal.phone || "\u2014" },
        { label: "Address", value: [d.personal.address, d.personal.city, d.personal.state, d.personal.zip, d.personal.country].filter(Boolean).join(", ") || "\u2014" },
        { label: "Date of Birth", value: d.personal.dob || "\u2014" }
      ]
    },
    {
      icon: "\u25CE",
      title: "Services Applied For",
      rows: [
        { label: "Services", value: d.service.services.length > 0 ? d.service.services.join(", ") : "\u2014" },
        { label: "Experience", value: d.service.experienceLevel || "\u2014" },
        { label: "Availability", value: d.service.availability || "\u2014" },
        { label: "Timezone", value: d.service.timezone || "\u2014" },
        { label: "Rate", value: d.service.rate || "\u2014" },
        { label: "Start Date", value: d.service.startDate || "\u2014" }
      ]
    },
    {
      icon: "\u25C7",
      title: "Resume & Cover Letter",
      rows: [
        { label: "Resume", value: d.resume.resume ? `\u2713 ${d.resume.resume.file.name}` : "Not uploaded" },
        { label: "Cover Letter", value: d.resume.coverLetter ? d.resume.coverLetter.slice(0, 100) + (d.resume.coverLetter.length > 100 ? "\u2026" : "") : "Not provided" }
      ]
    }
  ];
  return <div className="page-enter">
      <div className="card">
        <div className="card-head">
          <div className="card-icon">IV</div>
          <div className="card-head-text">
            <h2>Review Your Application</h2>
            <p>Confirm everything looks good before submitting</p>
          </div>
          <span className="card-badge">Step 4 of 4</span>
        </div>
        <div className="card-body">
          <div className="notice notice-brand" style={{ marginBottom: 24 }}>
            <span className="notice-icon">👁</span>
            <span>Please review carefully. Use <b>Back</b> to make corrections before submitting.</span>
          </div>
          <div className="rev-wrap">
            {blocks.map((b) => <div key={b.title} className="rev-block">
                <div className="rev-block-head">
                  <span>{b.icon}</span>
                  <span>{b.title}</span>
                </div>
                <table className="rev-tbl">
                  <tbody>
                    {b.rows.map((r) => <tr key={r.label}><td>{r.label}</td><td>{r.value}</td></tr>)}
                  </tbody>
                </table>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
const BackHomeIcon = ({ onClick }) => <button
  type="button"
  className="back-home-icon"
  onClick={onClick}
  title="Back to Homepage"
  aria-label="Back to Homepage"
>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
    </svg>
  </button>;
const VAJobApplicationForm = () => {
  const [page, setPage] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL);
  useEffect(() => {
    const id = "va-plus-jakarta-modern-v3";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
  }, []);
  const setPersonal = useCallback((k, v) => {
    setFormData((p) => ({ ...p, personal: { ...p.personal, [k]: v } }));
  }, []);
  const setService = useCallback((k, v) => {
    setFormData((p) => ({ ...p, service: { ...p.service, [k]: v } }));
  }, []);
  const setResumeFile = useCallback((f) => {
    setFormData((p) => ({
      ...p,
      resume: { ...p.resume, resume: f ? { file: f, label: f.name } : null }
    }));
  }, []);
  const setCoverLetter = useCallback((v) => {
    setFormData((p) => ({ ...p, resume: { ...p.resume, coverLetter: v } }));
  }, []);
  const clrErr = useCallback((k) => {
    setErrors((p) => ({ ...p, [k]: "" }));
  }, []);
  const validate = (pg) => {
    const errs = {};
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
        const today = /* @__PURE__ */ new Date();
        const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
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
  const goNext = () => {
    if (!validate(page)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setPage((p) => p + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goPrev = () => {
    setPage((p) => p - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const payload = new FormData();
      payload.append("firstName", formData.personal.firstName);
      payload.append("lastName", formData.personal.lastName);
      payload.append("middleName", formData.personal.middleName);
      payload.append("email", formData.personal.email);
      payload.append("phone", formData.personal.phone);
      payload.append("address", formData.personal.address);
      payload.append("city", formData.personal.city);
      payload.append("state", formData.personal.state);
      payload.append("zip", formData.personal.zip);
      payload.append("country", formData.personal.country);
      payload.append("dob", formData.personal.dob);
      payload.append("gender", formData.personal.gender);
      payload.append("services", JSON.stringify(formData.service.services));
      payload.append("experienceLevel", formData.service.experienceLevel);
      payload.append("availability", formData.service.availability);
      payload.append("timezone", formData.service.timezone);
      payload.append("rate", formData.service.rate);
      payload.append("startDate", formData.service.startDate);
      payload.append("coverLetter", formData.resume.coverLetter);
      if (formData.resume.resume?.file) payload.append("resume", formData.resume.resume.file);
      const res = await fetch(
        `https://telexph-admin.onrender.com/api/applicants`,
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
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const stepState = (id) => {
    if (id < page) return "done";
    if (id === page) return "active";
    return "";
  };
  const progressPct = (page - 1) / (STEPS.length - 1) * 100;
  const LeftPanel = () => <div className="va-left">
      <div className="va-logo-row">
        <div className="va-logo-mark">VA</div>
        <div className="va-brand-col">
          <div className="va-brand">Virtual Assistant</div>
          <div className="va-brand-sub">Application Portal</div>
        </div>
      </div>

      <div className="va-hero">
        <div className="va-tag">
          <span className="va-tag-dot" />
          Now Hiring
        </div>
        <h1 className="va-headline">
          Want to be part<br />of <em>our team?</em>
        </h1>
        <p className="va-subtext">
          Work with global clients, earn in USD, and grow your skills — all on your own terms.
        </p>
      </div>

      <div className="va-divline" />

      <div className="va-section-label">Who We're Looking For</div>
      <div className="va-benefit-list" style={{ marginBottom: 28 }}>
        {[
    { icon: "\u25C8", title: "Tech-Savvy Individuals", desc: "Comfortable with online tools & platforms" },
    { icon: "\u25C9", title: "Strong Communicators", desc: "Clear written & verbal English skills" },
    { icon: "\u25CE", title: "Reliable & Self-Managed", desc: "Can work independently and meet deadlines" },
    { icon: "\u25C6", title: "Eager to Learn", desc: "Open to training and upskilling" }
  ].map((b) => <div key={b.title} className="va-benefit-row">
            <span className="va-benefit-icon">{b.icon}</span>
            <div className="va-benefit-text">
              <strong>{b.title}</strong>
              <span>{b.desc}</span>
            </div>
          </div>)}
      </div>

      <div className="va-section-label">How It Works</div>
      <div className="va-step-list">
        {[
    { n: "1", label: "Fill Out This Form", desc: "Takes about 5\u201310 minutes" },
    { n: "2", label: "We Review Your Profile", desc: "Within 3\u20135 business days" },
    { n: "3", label: "Interview & Skills Check", desc: "Short online interview" },
    { n: "4", label: "Get Onboarded", desc: "Start working with your first client" }
  ].map((s) => <div key={s.n} className="va-step-row">
            <div className="va-step-num">{s.n}</div>
            <div className="va-step-info">
              <strong>{s.label}</strong>
              <span>{s.desc}</span>
            </div>
          </div>)}
      </div>
    </div>;
  if (submitted) {
    return <div className="va-root">
        <div className="va-outer">
          <LeftPanel />
          <div className="va-right" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BackHomeIcon onClick={() => window.location.href = "/"} />
            <div className="success-wrap page-enter">
              <div className="success-mark">✓</div>
              <h2>Application Received!</h2>
              <p>Your Virtual Assistant application has been successfully submitted.</p>
              <div className="confirm-code">{confirmCode}</div>
              <p>
                We'll reach out to{" "}
                <strong style={{ color: "var(--maroon)" }}>{formData.personal.email}</strong>{" "}
                within 3–5 business days.
              </p>
              <p style={{ marginTop: 10, fontSize: "12px", color: "var(--text-faint)" }}>
                Save your reference code above for your records.
              </p>
              <button
      type="button"
      className="btn btn-next"
      style={{ marginTop: 28 }}
      onClick={() => {
        setSubmitted(false);
        setFormData(INITIAL);
        setPage(1);
        setErrors({});
      }}
    >
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="va-root">
      <div className="va-outer">
        <LeftPanel />
        <div className="va-right">
          <BackHomeIcon onClick={() => window.location.href = "/"} />
          <div className="va-wrap">

            {
    /* PAGE HEADER */
  }
            <div className="page-header">
              <p className="page-eyebrow">Virtual Assistant Application</p>
              <h1 className="page-title">
                {page === 1 && "Your Identity"}
                {page === 2 && "Your Skills"}
                {page === 3 && "Your Documents"}
                {page === 4 && "Final Review"}
              </h1>
              <p className="page-desc">
                {page === 1 && "We need a few personal details to get started."}
                {page === 2 && "Tell us what services you offer and your work preferences."}
                {page === 3 && "Share your resume and a brief introduction."}
                {page === 4 && "Take a moment to review everything before submitting."}
              </p>
            </div>

            {
    /* PROGRESS BAR */
  }
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>

            {
    /* STEPPER */
  }
            <div className="stepper">
              {STEPS.map((s, i) => {
    const st = stepState(s.id);
    const isLast = i === STEPS.length - 1;
    return <React.Fragment key={s.id}>
                    <div className={`step-item${st ? " " + st : ""}`}>
                      <div className="step-bubble">
                        {st === "done" ? "\u2713" : s.icon}
                      </div>
                      <span className="step-lbl">{s.label}</span>
                    </div>
                    {!isLast && <div className={`step-connector${st === "done" ? " done" : ""}`} />}
                  </React.Fragment>;
  })}
            </div>

            {page === 1 && <Page1 data={formData.personal} errors={errors} set={setPersonal} clrErr={clrErr} />}
            {page === 2 && <Page2 data={formData.service} errors={errors} set={setService} clrErr={clrErr} />}
            {page === 3 && <Page3 data={formData.resume} errors={errors} setResume={setResumeFile} setCoverLetter={setCoverLetter} clrErr={clrErr} />}
            {page === 4 && <Page4 formData={formData} />}

            <div className="form-nav">
              {page > 1 ? <button type="button" className="btn btn-ghost" onClick={goPrev}>← Back</button> : <span />}
              {page < 4 && <button type="button" className="btn btn-next" onClick={goNext}>Continue →</button>}
              {page === 4 && <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  {submitError && <span style={{ fontSize: "12px", color: "var(--danger)", fontWeight: 600 }}>
                      ⚠ {submitError}
                    </span>}
                  <button
    type="button"
    className="btn btn-submit"
    onClick={submit}
    disabled={isSubmitting}
  >
                    {isSubmitting ? "Submitting\u2026" : "\u2714 Submit Application"}
                  </button>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
var stdin_default = VAJobApplicationForm;
export {
  stdin_default as default
};
