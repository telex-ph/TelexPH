import{j as e}from"./charts-CZnqqKLy.js";import{r as x,f as B}from"./react-D15L_eJl.js";const q=["Philippines","United States","United Kingdom","Canada","Australia","India","Singapore","Malaysia","New Zealand","Other"],O=["Philippine Standard Time (PHT, UTC+8)","Eastern Time (ET, UTC-5/-4)","Central Time (CT, UTC-6/-5)","Mountain Time (MT, UTC-7/-6)","Pacific Time (PT, UTC-8/-7)","Greenwich Mean Time (GMT, UTC+0)","Central European Time (CET, UTC+1)","Australian Eastern Time (AEST, UTC+10)","Singapore Standard Time (SST, UTC+8)","India Standard Time (IST, UTC+5:30)"],W=[{category:"Client Services",icon:"◈",services:["Customer Service Representative","Technical Support Representative"]},{category:"Web & Design",icon:"◉",services:["Web Development","Social Media Management","Video & Graphics Design"]},{category:"Funnels & Systems",icon:"◎",services:["Funnel Builder","Website Builder","Surveys & Forms System","Document Signing System","Booking & Appointment System","Courses & Digital Products System"]},{category:"Automation & AI",icon:"◆",services:["AI Builder (Chatbots / AI Systems)","Automation Builder (Advanced Workflows)"]},{category:"Marketing & CRM",icon:"◇",services:["Email Marketing Management","CRM System Setup & Management"]},{category:"Platform Services",icon:"◼",services:["Gray-Label Platform","White-Label Platform"]}],y=[{id:1,label:"Personal",icon:"01"},{id:2,label:"Services",icon:"02"},{id:3,label:"Resume",icon:"03"},{id:4,label:"Review",icon:"04"}],V=`
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

  /* ── Clean classic inputs ── */
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

/* ── LAYOUT ── */
.va-root { background: var(--off-white); min-height: 100vh; }
.va-outer { display: flex; width: 100%; min-height: 100vh; align-items: flex-start; }

/* ── LEFT PANEL ── */
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

/* ── RIGHT ── */
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

/* ── BACK ICON ── */
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

/* ── PAGE HEADER ── */
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

/* ── PROGRESS BAR ── */
.progress-track {
  height: 3px; background: var(--surface-2); border-radius: 99px; margin-bottom: 28px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: linear-gradient(90deg, var(--maroon-dk), var(--maroon-lt));
  border-radius: 99px; transition: width .5s cubic-bezier(.4,0,.2,1);
}

/* ── STEPPER ── */
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

/* ── SECTION LABEL ── */
.sec-lbl {
  font-size: 9.5px; font-weight: 700; color: var(--maroon);
  text-transform: uppercase; letter-spacing: 2.5px;
  margin: 30px 0 16px; padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
}
.sec-lbl::after { content: ''; flex: 1; height: 1px; background: var(--border-lt); }
.sec-lbl:first-child { margin-top: 0; }

/* ── CARD ── */
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

/* ── NOTICE ── */
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

/* ── GRIDS ── */
.grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 22px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px 22px; }
.grid-1 { display: grid; grid-template-columns: 1fr; gap: 18px; }
.col-2  { grid-column: span 2; }
.col-3  { grid-column: span 3; }

/* ── FIELD ── */
.field { display: flex; flex-direction: column; gap: 6px; }
.field > label {
  font-size: 11px; font-weight: 700; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 1.2px;
}
.req  { color: var(--maroon); margin-left: 2px; }
.opt  { font-weight: 500; color: var(--text-faint); text-transform: none; font-size: 10.5px; letter-spacing: 0; margin-left: 4px; }
.hint { font-size: 11px; font-weight: 400; color: var(--text-faint); }
.err-msg { font-size: 11px; color: var(--danger); font-weight: 600; min-height: 15px; display: flex; align-items: center; gap: 4px; }

/* ─────────────────────────────────────
   NEUMORPHIC INPUTS — inner shadow style
   matching reference: blur 30px, X/Y 18px,
   opacity 100%, color #D1D9E6
───────────────────────────────────── */
/* ─────────────────────────────────────
   NEUMORPHIC INPUTS — two inner shadows
   White: blur 50, X/Y -30, opacity 70%, #FFFFFF
   Dark:  blur 50, X/Y  30, opacity 16%, #0D2750
───────────────────────────────────── */
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

/* Error state — keep inner shadow, add red tint */
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

/* ── SERVICE GRID ── */
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

/* Checkbox inside svc-chip — keep native look, not neumorphic */
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

/* ── SELECTED PILLS ── */
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

/* ── UPLOAD ── */
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

/* ── REVIEW ── */
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

/* ── NAV ── */
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

/* ── SUCCESS ── */
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

/* ── RESPONSIVE ── */
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
`,$=()=>"VA-"+Math.random().toString(36).toUpperCase().slice(2,10),p=({label:a,required:i,optional:n,hint:d,error:t,children:o,className:h})=>e.jsxs("div",{className:`field${h?" "+h:""}`,children:[e.jsxs("label",{children:[a,i&&e.jsx("span",{className:"req",children:"*"}),n&&e.jsx("span",{className:"opt",children:"(optional)"})]}),o,d&&e.jsx("span",{className:"hint",children:d}),e.jsx("span",{className:"err-msg",children:t?e.jsxs(e.Fragment,{children:["⚠ ",t]}):""})]}),m=({value:a,onChange:i,placeholder:n,type:d="text",maxLength:t,hasError:o})=>e.jsx("input",{type:d,value:a,onChange:i,placeholder:n,maxLength:t,className:o?"err":""}),f=({value:a,onChange:i,options:n,placeholder:d="Select…",hasError:t})=>e.jsxs("select",{value:a,onChange:i,className:t?"err":"",children:[e.jsx("option",{value:"",children:d}),n.map(o=>e.jsx("option",{value:o,children:o},o))]}),G=({file:a,onAdd:i,onRemove:n})=>{const d=x.useRef(null);return e.jsxs("div",{children:[e.jsxs("div",{className:`upload-zone${a?" filled":""}`,onClick:()=>{var t;return(t=d.current)==null?void 0:t.click()},children:[e.jsx("span",{className:"upload-icon",children:a?"📎":"📄"}),a?e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"upload-title",children:a.file.name}),e.jsx("p",{className:"upload-sub",children:"Click to replace file"})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"upload-title",children:"Click to browse or drag & drop"}),e.jsx("p",{className:"upload-sub",children:"PDF, DOC, DOCX — max 10 MB"})]})]}),a&&e.jsx("div",{style:{textAlign:"center"},children:e.jsxs("span",{className:"file-tag",children:["✓ ",a.file.name,e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),n()},children:"✕"})]})}),e.jsx("input",{ref:d,type:"file",accept:".pdf,.doc,.docx",style:{display:"none"},onChange:t=>{var o;(o=t.target.files)!=null&&o[0]&&(i(t.target.files[0]),t.target.value="")}})]})},S={personal:{firstName:"",lastName:"",middleName:"",email:"",phone:"",address:"",city:"",state:"",zip:"",country:"",dob:"",gender:""},service:{services:[],experienceLevel:"",availability:"",timezone:"",rate:"",startDate:""},resume:{resume:null,coverLetter:""}},H=({data:a,errors:i,set:n,clrErr:d})=>e.jsx("div",{className:"page-enter",children:e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"card-head",children:[e.jsx("div",{className:"card-icon",children:"I"}),e.jsxs("div",{className:"card-head-text",children:[e.jsx("h2",{children:"Personal Information"}),e.jsx("p",{children:"Tell us a bit about yourself"})]}),e.jsx("span",{className:"card-badge",children:"Step 1 of 4"})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"notice notice-brand",children:[e.jsx("span",{className:"notice-icon",children:"ℹ"}),e.jsxs("span",{children:["Fields marked ",e.jsx("b",{children:"*"})," are required. Your information is kept strictly confidential."]})]}),e.jsx("p",{className:"sec-lbl",children:"Full Name"}),e.jsxs("div",{className:"grid-3",children:[e.jsx(p,{label:"First Name",required:!0,error:i.firstName,children:e.jsx(m,{value:a.firstName,hasError:!!i.firstName,placeholder:"Juan",maxLength:50,onChange:t=>{n("firstName",t.target.value),d("firstName")}})}),e.jsx(p,{label:"Middle Name",optional:!0,children:e.jsx(m,{value:a.middleName,placeholder:"D.",maxLength:50,onChange:t=>n("middleName",t.target.value)})}),e.jsx(p,{label:"Last Name",required:!0,error:i.lastName,children:e.jsx(m,{value:a.lastName,hasError:!!i.lastName,placeholder:"dela Cruz",maxLength:50,onChange:t=>{n("lastName",t.target.value),d("lastName")}})})]}),e.jsx("p",{className:"sec-lbl",children:"Contact Details"}),e.jsxs("div",{className:"grid",children:[e.jsx(p,{label:"Email Address",required:!0,error:i.email,children:e.jsx(m,{type:"email",value:a.email,hasError:!!i.email,placeholder:"juan@email.com",maxLength:100,onChange:t=>{n("email",t.target.value),d("email")}})}),e.jsx(p,{label:"Phone / WhatsApp",required:!0,error:i.phone,hint:"Numbers, +, spaces only (e.g. +63 917 000 0000)",children:e.jsx(m,{type:"tel",value:a.phone,hasError:!!i.phone,placeholder:"+63 917 000 0000",maxLength:20,onChange:t=>{const o=t.target.value.replace(/[^\d\s+\-()]/g,"");n("phone",o),d("phone")}})})]}),e.jsx("p",{className:"sec-lbl",children:"Address"}),e.jsxs("div",{className:"grid",children:[e.jsx(p,{label:"Street Address",required:!0,error:i.address,className:"col-2",children:e.jsx(m,{value:a.address,hasError:!!i.address,placeholder:"123 Rizal St, Brgy. San Antonio",maxLength:150,onChange:t=>{n("address",t.target.value),d("address")}})}),e.jsx(p,{label:"City / Municipality",required:!0,error:i.city,children:e.jsx(m,{value:a.city,hasError:!!i.city,placeholder:"Makati",maxLength:80,onChange:t=>{n("city",t.target.value),d("city")}})}),e.jsx(p,{label:"State / Province",optional:!0,children:e.jsx(m,{value:a.state,placeholder:"Metro Manila",maxLength:80,onChange:t=>n("state",t.target.value)})}),e.jsx(p,{label:"ZIP / Postal Code",required:!0,error:i.zip,children:e.jsx(m,{value:a.zip,hasError:!!i.zip,placeholder:"1200",maxLength:10,onChange:t=>{const o=t.target.value.replace(/[^\d\-\s]/g,"");n("zip",o),d("zip")}})}),e.jsx(p,{label:"Country",required:!0,error:i.country,children:e.jsx(f,{value:a.country,hasError:!!i.country,onChange:t=>{n("country",t.target.value),d("country")},options:q,placeholder:"Select Country"})})]}),e.jsx("p",{className:"sec-lbl",children:"Personal Details"}),e.jsxs("div",{className:"grid",children:[e.jsx(p,{label:"Date of Birth",required:!0,error:i.dob,children:e.jsx("input",{type:"date",value:a.dob,min:"1924-01-01",max:new Date(new Date().setFullYear(new Date().getFullYear()-18)).toISOString().split("T")[0],className:i.dob?"err":"",onChange:t=>{n("dob",t.target.value),d("dob")}})}),e.jsx(p,{label:"Gender",optional:!0,children:e.jsx(f,{value:a.gender,onChange:t=>n("gender",t.target.value),options:["Male","Female","Non-binary","Prefer not to say"]})})]})]})]})}),J=({data:a,errors:i,set:n,clrErr:d})=>{const t=o=>{const h=a.services.includes(o)?a.services.filter(g=>g!==o):[...a.services,o];n("services",h),d("services")};return e.jsx("div",{className:"page-enter",children:e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"card-head",children:[e.jsx("div",{className:"card-icon",children:"II"}),e.jsxs("div",{className:"card-head-text",children:[e.jsx("h2",{children:"Services You're Applying For"}),e.jsx("p",{children:"Select all VA services you can offer"})]}),e.jsx("span",{className:"card-badge",children:"Step 2 of 4"})]}),e.jsxs("div",{className:"card-body",children:[i.services&&e.jsxs("div",{className:"notice notice-warn",style:{marginBottom:16},children:[e.jsx("span",{className:"notice-icon",children:"⚠"}),e.jsxs("span",{children:[e.jsx("b",{children:"Please select at least one service"})," before continuing."]})]}),e.jsx("p",{className:"sec-lbl",children:"Available Services — select all that apply"}),e.jsx("div",{className:"svc-grid",children:W.map(o=>{const h=o.services.filter(g=>a.services.includes(g)).length;return e.jsxs("div",{className:"svc-group",children:[e.jsxs("div",{className:"svc-group-head",children:[e.jsx("span",{className:"svc-group-icon",children:o.icon}),e.jsx("span",{className:"svc-group-name",children:o.category}),h>0&&e.jsx("span",{className:"svc-count",children:h})]}),e.jsx("div",{className:"svc-list",children:o.services.map(g=>e.jsxs("label",{className:`svc-chip${a.services.includes(g)?" sel":""}`,children:[e.jsx("input",{type:"checkbox",checked:a.services.includes(g),onChange:()=>t(g)}),e.jsx("span",{className:"svc-chip-label",children:g})]},g))})]},o.category)})}),a.services.length>0&&e.jsxs(e.Fragment,{children:[e.jsxs("p",{className:"sec-lbl",style:{marginTop:24},children:["Selected (",a.services.length,")"]}),e.jsx("div",{className:"sel-pills",children:a.services.map(o=>e.jsxs("span",{className:"sel-pill",children:[o,e.jsx("button",{type:"button",onClick:()=>t(o),children:"✕"})]},o))})]}),e.jsx("hr",{className:"divider"}),e.jsx("p",{className:"sec-lbl",children:"Work Preferences"}),e.jsxs("div",{className:"grid",children:[e.jsx(p,{label:"Experience Level",required:!0,error:i.experienceLevel,children:e.jsx(f,{value:a.experienceLevel,hasError:!!i.experienceLevel,onChange:o=>{n("experienceLevel",o.target.value),d("experienceLevel")},options:["Entry Level (0–1 yr)","Junior (1–2 yrs)","Mid-Level (2–4 yrs)","Senior (4–6 yrs)","Expert (6+ yrs)"]})}),e.jsx(p,{label:"Availability",required:!0,error:i.availability,children:e.jsx(f,{value:a.availability,hasError:!!i.availability,onChange:o=>{n("availability",o.target.value),d("availability")},options:["Immediately","Within 1 week","Within 2 weeks","Within 30 days","60+ days"]})}),e.jsx(p,{label:"Timezone",required:!0,error:i.timezone,children:e.jsx(f,{value:a.timezone,hasError:!!i.timezone,onChange:o=>{n("timezone",o.target.value),d("timezone")},options:O})}),e.jsx(p,{label:"Expected Rate",required:!0,error:i.rate,hint:"e.g. $5/hr, $800/mo, $200/project",children:e.jsx(m,{value:a.rate,hasError:!!i.rate,placeholder:"$5/hr",maxLength:30,onChange:o=>{n("rate",o.target.value),d("rate")}})}),e.jsx(p,{label:"Earliest Start Date",optional:!0,className:"col-2",children:e.jsx(m,{type:"date",value:a.startDate,onChange:o=>n("startDate",o.target.value)})})]})]})]})})},X=({data:a,errors:i,setResume:n,setCoverLetter:d,clrErr:t})=>e.jsx("div",{className:"page-enter",children:e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"card-head",children:[e.jsx("div",{className:"card-icon",children:"III"}),e.jsxs("div",{className:"card-head-text",children:[e.jsx("h2",{children:"Resume / CV"}),e.jsx("p",{children:"Upload your resume and write a cover letter"})]}),e.jsx("span",{className:"card-badge",children:"Step 3 of 4"})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"notice notice-brand",children:[e.jsx("span",{className:"notice-icon",children:"ℹ"}),e.jsxs("span",{children:["Upload your most recent resume or CV. ",e.jsx("b",{children:"PDF format is preferred."})," Max file size: 10 MB."]})]}),e.jsxs("p",{className:"sec-lbl",children:["Resume or CV ",e.jsx("span",{style:{color:"var(--maroon)"},children:"*"})]}),e.jsx(G,{file:a.resume,onAdd:o=>{n(o),t("resume")},onRemove:()=>n(null)}),i.resume&&e.jsxs("p",{className:"err-msg",style:{marginTop:8},children:["⚠ ",i.resume]}),e.jsx("hr",{className:"divider"}),e.jsxs("p",{className:"sec-lbl",children:["Cover Letter ",e.jsx("span",{className:"opt",children:"(optional)"})]}),e.jsx("textarea",{value:a.coverLetter,onChange:o=>{o.target.value.length<=1500&&d(o.target.value)},placeholder:"Introduce yourself — share your experience, your strengths as a Virtual Assistant, and why you're a great fit...",style:{minHeight:190},maxLength:1500}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:8},children:[e.jsx("p",{className:"hint",children:"Tip: Mention the specific services you selected and tools you use."}),e.jsxs("p",{className:"hint",style:{flexShrink:0,marginLeft:8,color:a.coverLetter.length>1400?"var(--danger)":void 0},children:[a.coverLetter.length," / 1500"]})]})]})]})}),Z=({formData:a})=>{const i=[{icon:"◈",title:"Personal Information",rows:[{label:"Name",value:[a.personal.firstName,a.personal.middleName,a.personal.lastName].filter(Boolean).join(" ")||"—"},{label:"Email",value:a.personal.email||"—"},{label:"Phone",value:a.personal.phone||"—"},{label:"Address",value:[a.personal.address,a.personal.city,a.personal.state,a.personal.zip,a.personal.country].filter(Boolean).join(", ")||"—"},{label:"Date of Birth",value:a.personal.dob||"—"}]},{icon:"◎",title:"Services Applied For",rows:[{label:"Services",value:a.service.services.length>0?a.service.services.join(", "):"—"},{label:"Experience",value:a.service.experienceLevel||"—"},{label:"Availability",value:a.service.availability||"—"},{label:"Timezone",value:a.service.timezone||"—"},{label:"Rate",value:a.service.rate||"—"},{label:"Start Date",value:a.service.startDate||"—"}]},{icon:"◇",title:"Resume & Cover Letter",rows:[{label:"Resume",value:a.resume.resume?`✓ ${a.resume.resume.file.name}`:"Not uploaded"},{label:"Cover Letter",value:a.resume.coverLetter?a.resume.coverLetter.slice(0,100)+(a.resume.coverLetter.length>100?"…":""):"Not provided"}]}];return e.jsx("div",{className:"page-enter",children:e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"card-head",children:[e.jsx("div",{className:"card-icon",children:"IV"}),e.jsxs("div",{className:"card-head-text",children:[e.jsx("h2",{children:"Review Your Application"}),e.jsx("p",{children:"Confirm everything looks good before submitting"})]}),e.jsx("span",{className:"card-badge",children:"Step 4 of 4"})]}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"notice notice-brand",style:{marginBottom:24},children:[e.jsx("span",{className:"notice-icon",children:"👁"}),e.jsxs("span",{children:["Please review carefully. Use ",e.jsx("b",{children:"Back"})," to make corrections before submitting."]})]}),e.jsx("div",{className:"rev-wrap",children:i.map(n=>e.jsxs("div",{className:"rev-block",children:[e.jsxs("div",{className:"rev-block-head",children:[e.jsx("span",{children:n.icon}),e.jsx("span",{children:n.title})]}),e.jsx("table",{className:"rev-tbl",children:e.jsx("tbody",{children:n.rows.map(d=>e.jsxs("tr",{children:[e.jsx("td",{children:d.label}),e.jsx("td",{children:d.value})]},d.label))})})]},n.title))})]})]})})},P=({onClick:a})=>e.jsx("button",{type:"button",className:"back-home-icon",onClick:a,title:"Back to Homepage","aria-label":"Back to Homepage",children:e.jsxs("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("path",{d:"M19 12H5"}),e.jsx("path",{d:"M12 19l-7-7 7-7"})]})}),K=()=>{const[a,i]=x.useState(1),[n,d]=x.useState(!1),[t,o]=x.useState(""),[h,g]=x.useState({}),[c,u]=x.useState(S);x.useEffect(()=>{const s="va-plus-jakarta-modern-v3";if(!document.getElementById(s)){const r=document.createElement("style");r.id=s,r.textContent=V,document.head.appendChild(r)}},[]);const T=x.useCallback((s,r)=>{u(l=>({...l,personal:{...l.personal,[s]:r}}))},[]),L=x.useCallback((s,r)=>{u(l=>({...l,service:{...l.service,[s]:r}}))},[]),I=x.useCallback(s=>{u(r=>({...r,resume:{...r.resume,resume:s?{file:s,label:s.name}:null}}))},[]),A=x.useCallback(s=>{u(r=>({...r,resume:{...r.resume,coverLetter:s}}))},[]),w=x.useCallback(s=>{g(r=>({...r,[s]:""}))},[]),D=s=>{const r={},l=c;if(s===1)if(l.personal.firstName.trim()?l.personal.firstName.trim().length<2&&(r.firstName="Must be at least 2 characters."):r.firstName="First name is required.",l.personal.lastName.trim()?l.personal.lastName.trim().length<2&&(r.lastName="Must be at least 2 characters."):r.lastName="Last name is required.",l.personal.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.personal.email.trim())||(r.email="Enter a valid email address."):r.email="Email address is required.",l.personal.phone.trim()?l.personal.phone.replace(/\D/g,"").length<7&&(r.phone="Enter a valid phone number."):r.phone="Phone number is required.",l.personal.address.trim()||(r.address="Street address is required."),l.personal.city.trim()||(r.city="City is required."),l.personal.zip.trim()?l.personal.zip.trim().length<3&&(r.zip="Enter a valid ZIP / postal code."):r.zip="ZIP / Postal code is required.",l.personal.country||(r.country="Please select your country."),!l.personal.dob)r.dob="Date of birth is required.";else{const b=new Date(l.personal.dob),v=new Date,z=v.getFullYear()-b.getFullYear()-(v<new Date(v.getFullYear(),b.getMonth(),b.getDate())?1:0);isNaN(b.getTime())?r.dob="Enter a valid date.":z<18?r.dob="You must be at least 18 years old.":z>70&&(r.dob="Please enter a valid date of birth.")}return s===2&&(l.service.services.length===0&&(r.services="Please select at least one service."),l.service.experienceLevel||(r.experienceLevel="Please select your experience level."),l.service.availability||(r.availability="Please select your availability."),l.service.timezone||(r.timezone="Please select your timezone."),l.service.rate.trim()?l.service.rate.trim().length<2&&(r.rate="Enter a valid rate (e.g. $5/hr, $800/mo)."):r.rate="Please enter your expected rate."),s===3&&(l.resume.resume||(r.resume="Please upload your resume or CV before continuing.")),g(r),Object.keys(r).length===0},R=()=>{if(!D(a)){window.scrollTo({top:0,behavior:"smooth"});return}i(s=>s+1),window.scrollTo({top:0,behavior:"smooth"})},F=()=>{i(s=>s-1),window.scrollTo({top:0,behavior:"smooth"})},[j,k]=x.useState(!1),[N,C]=x.useState(""),M=async()=>{var s;k(!0),C("");try{const r=new FormData;r.append("firstName",c.personal.firstName),r.append("lastName",c.personal.lastName),r.append("middleName",c.personal.middleName),r.append("email",c.personal.email),r.append("phone",c.personal.phone),r.append("address",c.personal.address),r.append("city",c.personal.city),r.append("state",c.personal.state),r.append("zip",c.personal.zip),r.append("country",c.personal.country),r.append("dob",c.personal.dob),r.append("gender",c.personal.gender),r.append("services",JSON.stringify(c.service.services)),r.append("experienceLevel",c.service.experienceLevel),r.append("availability",c.service.availability),r.append("timezone",c.service.timezone),r.append("rate",c.service.rate),r.append("startDate",c.service.startDate),r.append("coverLetter",c.resume.coverLetter),(s=c.resume.resume)!=null&&s.file&&r.append("resume",c.resume.resume.file);const l=await fetch("https://telexph-admin.onrender.com/api/applicants",{method:"POST",body:r,credentials:"include"});if(!l.ok){const v=await l.json().catch(()=>({}));throw new Error(v.message||"Submission failed. Please try again.")}const b=await l.json();o(b.confirmCode||$()),d(!0),window.scrollTo({top:0,behavior:"smooth"})}catch(r){C(r instanceof Error?r.message:"Something went wrong.")}finally{k(!1)}},U=s=>s<a?"done":s===a?"active":"",Y=(a-1)/(y.length-1)*100,E=()=>e.jsxs("div",{className:"va-left",children:[e.jsxs("div",{className:"va-logo-row",children:[e.jsx("div",{className:"va-logo-mark",children:"VA"}),e.jsxs("div",{className:"va-brand-col",children:[e.jsx("div",{className:"va-brand",children:"Virtual Assistant"}),e.jsx("div",{className:"va-brand-sub",children:"Application Portal"})]})]}),e.jsxs("div",{className:"va-hero",children:[e.jsxs("div",{className:"va-tag",children:[e.jsx("span",{className:"va-tag-dot"}),"Now Hiring"]}),e.jsxs("h1",{className:"va-headline",children:["Want to be part",e.jsx("br",{}),"of ",e.jsx("em",{children:"our team?"})]}),e.jsx("p",{className:"va-subtext",children:"Work with global clients, earn in USD, and grow your skills — all on your own terms."})]}),e.jsx("div",{className:"va-divline"}),e.jsx("div",{className:"va-section-label",children:"Who We're Looking For"}),e.jsx("div",{className:"va-benefit-list",style:{marginBottom:28},children:[{icon:"◈",title:"Tech-Savvy Individuals",desc:"Comfortable with online tools & platforms"},{icon:"◉",title:"Strong Communicators",desc:"Clear written & verbal English skills"},{icon:"◎",title:"Reliable & Self-Managed",desc:"Can work independently and meet deadlines"},{icon:"◆",title:"Eager to Learn",desc:"Open to training and upskilling"}].map(s=>e.jsxs("div",{className:"va-benefit-row",children:[e.jsx("span",{className:"va-benefit-icon",children:s.icon}),e.jsxs("div",{className:"va-benefit-text",children:[e.jsx("strong",{children:s.title}),e.jsx("span",{children:s.desc})]})]},s.title))}),e.jsx("div",{className:"va-section-label",children:"How It Works"}),e.jsx("div",{className:"va-step-list",children:[{n:"1",label:"Fill Out This Form",desc:"Takes about 5–10 minutes"},{n:"2",label:"We Review Your Profile",desc:"Within 3–5 business days"},{n:"3",label:"Interview & Skills Check",desc:"Short online interview"},{n:"4",label:"Get Onboarded",desc:"Start working with your first client"}].map(s=>e.jsxs("div",{className:"va-step-row",children:[e.jsx("div",{className:"va-step-num",children:s.n}),e.jsxs("div",{className:"va-step-info",children:[e.jsx("strong",{children:s.label}),e.jsx("span",{children:s.desc})]})]},s.n))})]});return n?e.jsx("div",{className:"va-root",children:e.jsxs("div",{className:"va-outer",children:[e.jsx(E,{}),e.jsxs("div",{className:"va-right",style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[e.jsx(P,{onClick:()=>window.location.href="/"}),e.jsxs("div",{className:"success-wrap page-enter",children:[e.jsx("div",{className:"success-mark",children:"✓"}),e.jsx("h2",{children:"Application Received!"}),e.jsx("p",{children:"Your Virtual Assistant application has been successfully submitted."}),e.jsx("div",{className:"confirm-code",children:t}),e.jsxs("p",{children:["We'll reach out to"," ",e.jsx("strong",{style:{color:"var(--maroon)"},children:c.personal.email})," ","within 3–5 business days."]}),e.jsx("p",{style:{marginTop:10,fontSize:"12px",color:"var(--text-faint)"},children:"Save your reference code above for your records."}),e.jsx("button",{type:"button",className:"btn btn-next",style:{marginTop:28},onClick:()=>{d(!1),u(S),i(1),g({})},children:"Submit Another Application"})]})]})]})}):e.jsx("div",{className:"va-root",children:e.jsxs("div",{className:"va-outer",children:[e.jsx(E,{}),e.jsxs("div",{className:"va-right",children:[e.jsx(P,{onClick:()=>window.location.href="/"}),e.jsxs("div",{className:"va-wrap",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("p",{className:"page-eyebrow",children:"Virtual Assistant Application"}),e.jsxs("h1",{className:"page-title",children:[a===1&&"Your Identity",a===2&&"Your Skills",a===3&&"Your Documents",a===4&&"Final Review"]}),e.jsxs("p",{className:"page-desc",children:[a===1&&"We need a few personal details to get started.",a===2&&"Tell us what services you offer and your work preferences.",a===3&&"Share your resume and a brief introduction.",a===4&&"Take a moment to review everything before submitting."]})]}),e.jsx("div",{className:"progress-track",children:e.jsx("div",{className:"progress-fill",style:{width:`${Y}%`}})}),e.jsx("div",{className:"stepper",children:y.map((s,r)=>{const l=U(s.id),b=r===y.length-1;return e.jsxs(B.Fragment,{children:[e.jsxs("div",{className:`step-item${l?" "+l:""}`,children:[e.jsx("div",{className:"step-bubble",children:l==="done"?"✓":s.icon}),e.jsx("span",{className:"step-lbl",children:s.label})]}),!b&&e.jsx("div",{className:`step-connector${l==="done"?" done":""}`})]},s.id)})}),a===1&&e.jsx(H,{data:c.personal,errors:h,set:T,clrErr:w}),a===2&&e.jsx(J,{data:c.service,errors:h,set:L,clrErr:w}),a===3&&e.jsx(X,{data:c.resume,errors:h,setResume:I,setCoverLetter:A,clrErr:w}),a===4&&e.jsx(Z,{formData:c}),e.jsxs("div",{className:"form-nav",children:[a>1?e.jsx("button",{type:"button",className:"btn btn-ghost",onClick:F,children:"← Back"}):e.jsx("span",{}),a<4&&e.jsx("button",{type:"button",className:"btn btn-next",onClick:R,children:"Continue →"}),a===4&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"8px"},children:[N&&e.jsxs("span",{style:{fontSize:"12px",color:"var(--danger)",fontWeight:600},children:["⚠ ",N]}),e.jsx("button",{type:"button",className:"btn btn-submit",onClick:M,disabled:j,children:j?"Submitting…":"✔ Submit Application"})]})]})]})]})]})})};var ee=K;export{ee as default};
