import{j as e}from"./charts-CZnqqKLy.js";import{r as p}from"./react-D15L_eJl.js";import{v as ce}from"./index-Ds_Y0K8E.js";import{useDarkMode as de}from"./Layout-C0zGPawu.js";import"./pdf-ckwbz45p.js";import"./LogoutOverlay-DQbJ56Pa.js";import"./LogoutConfirmModal-BMij5ozl.js";const $="https://telexph-admin.onrender.com/api",he=g=>g.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"");function le({toasts:g,onRemove:i}){return e.jsxs("div",{style:{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:10,fontFamily:"'Poppins', sans-serif"},children:[g.map(o=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,boxShadow:"0 4px 24px rgba(0,0,0,0.22)",background:o.type==="error"?"#b91c1c":"#166534",color:"#fff",fontSize:12,fontWeight:500,minWidth:260,maxWidth:360,animation:"toast-in 0.25s ease"},children:[o.type==="error"?e.jsx("svg",{width:"16",height:"16",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",style:{flexShrink:0},children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}):e.jsx("svg",{width:"16",height:"16",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",style:{flexShrink:0},children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),e.jsx("span",{style:{flex:1},children:o.message}),e.jsx("button",{onClick:()=>i(o.id),style:{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0,opacity:.7,lineHeight:1},children:"Ã—"})]},o.id)),e.jsx("style",{children:"@keyframes toast-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }"})]})}let se=0;const U={"ai-builder":e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"})}),automation:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})}),"booking-appointment":e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})}),"courses-products":e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"})}),crm:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"})}),csr:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"})}),"email-marketing":e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"})}),"funnel-builder":e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"})}),"gray-label":e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"})}),"social-media-management":e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"})}),"survey-forms":e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"})}),"tech-support":e.jsxs("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})]}),"web-development":e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"})})},L=g=>`url("data:image/svg+xml,${encodeURIComponent(g)}")`,ie={"ai-builder":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#312e81"/>
      </linearGradient>
      <radialGradient id="glow" cx="70%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#6366f1" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <rect width="400" height="110" fill="url(#glow)"/>
    <!-- Circuit lines -->
    <g stroke="#6366f1" stroke-opacity="0.3" stroke-width="1" fill="none">
      <path d="M20 55 H80 V30 H140"/>
      <path d="M140 30 H200 V70 H260"/>
      <path d="M260 70 H320 V40 H380"/>
      <path d="M80 55 V80 H160 V55"/>
      <path d="M220 70 V90 H300"/>
    </g>
    <!-- Circuit nodes -->
    <g fill="#818cf8">
      <circle cx="80" cy="55" r="3"/><circle cx="140" cy="30" r="3"/>
      <circle cx="200" cy="70" r="3"/><circle cx="260" cy="70" r="3"/>
      <circle cx="320" cy="40" r="3"/><circle cx="160" cy="55" r="3"/>
    </g>
    <!-- Brain icon outline -->
    <g transform="translate(290,20)" stroke="#a5b4fc" stroke-width="1.5" fill="none" stroke-opacity="0.6">
      <path d="M30 25 C30 15 20 10 15 15 C10 8 2 10 2 18 C-2 18 -2 28 4 28 C4 33 8 36 14 35 C14 38 18 40 22 38 C28 38 32 34 32 29 C36 27 36 20 30 25Z"/>
      <line x1="16" y1="15" x2="16" y2="35"/>
      <line x1="8" y1="20" x2="24" y2="20"/><line x1="8" y1="27" x2="24" y2="27"/>
    </g>
    <!-- Floating particles -->
    <g fill="#c7d2fe" fill-opacity="0.4">
      <circle cx="50" cy="20" r="1.5"/><circle cx="180" cy="15" r="2"/><circle cx="350" cy="85" r="1.5"/>
      <circle cx="130" cy="90" r="1"/><circle cx="370" cy="25" r="2.5"/><circle cx="240" cy="30" r="1"/>
    </g>
  </svg>`),automation:L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0c4a6e"/>
        <stop offset="100%" stop-color="#075985"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Gear large -->
    <g transform="translate(300,55)" stroke="#38bdf8" stroke-width="2" fill="none" stroke-opacity="0.5">
      <circle cx="0" cy="0" r="28"/>
      <circle cx="0" cy="0" r="12"/>
      <g stroke-width="6" stroke-linecap="round">
        <line x1="0" y1="-28" x2="0" y2="-22"/>
        <line x1="0" y1="22" x2="0" y2="28"/>
        <line x1="-28" y1="0" x2="-22" y2="0"/>
        <line x1="22" y1="0" x2="28" y2="0"/>
        <line x1="-20" y1="-20" x2="-16" y2="-16"/>
        <line x1="16" y1="16" x2="20" y2="20"/>
        <line x1="20" y1="-20" x2="16" y2="-16"/>
        <line x1="-16" y1="16" x2="-20" y2="20"/>
      </g>
    </g>
    <!-- Gear small -->
    <g transform="translate(258,82)" stroke="#7dd3fc" stroke-width="1.5" fill="none" stroke-opacity="0.4">
      <circle cx="0" cy="0" r="14"/><circle cx="0" cy="0" r="6"/>
      <g stroke-width="4" stroke-linecap="round">
        <line x1="0" y1="-14" x2="0" y2="-10"/>
        <line x1="0" y1="10" x2="0" y2="14"/>
        <line x1="-14" y1="0" x2="-10" y2="0"/>
        <line x1="10" y1="0" x2="14" y2="0"/>
      </g>
    </g>
    <!-- Flow arrows -->
    <g stroke="#38bdf8" stroke-width="1.5" fill="none" stroke-opacity="0.5">
      <path d="M20 55 Q60 30 100 55 Q140 80 180 55 Q220 30 260 55"/>
      <polygon points="255,50 265,55 255,60" fill="#38bdf8" fill-opacity="0.5"/>
    </g>
    <!-- Process boxes -->
    <g stroke="#7dd3fc" stroke-width="1" fill="rgba(14,165,233,0.1)" stroke-opacity="0.5" rx="4">
      <rect x="15" y="42" width="40" height="26" rx="4"/>
      <rect x="95" y="42" width="40" height="26" rx="4"/>
      <rect x="175" y="42" width="40" height="26" rx="4"/>
    </g>
    <g fill="#7dd3fc" fill-opacity="0.4" font-size="8" text-anchor="middle">
      <text x="35" y="59">START</text>
      <text x="115" y="59">PROC</text>
      <text x="195" y="59">END</text>
    </g>
  </svg>`),"booking-appointment":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#064e3b"/>
        <stop offset="100%" stop-color="#065f46"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Calendar grid -->
    <g transform="translate(270,10)" stroke="#34d399" stroke-width="1" fill="none" stroke-opacity="0.4">
      <rect x="0" y="0" width="110" height="90" rx="6"/>
      <line x1="0" y1="20" x2="110" y2="20"/>
      <!-- vertical lines -->
      <line x1="22" y1="20" x2="22" y2="90"/><line x1="44" y1="20" x2="44" y2="90"/>
      <line x1="66" y1="20" x2="66" y2="90"/><line x1="88" y1="20" x2="88" y2="90"/>
      <!-- horizontal lines -->
      <line x1="0" y1="38" x2="110" y2="38"/><line x1="0" y1="56" x2="110" y2="56"/>
      <line x1="0" y1="74" x2="110" y2="74"/>
      <!-- hook lines -->
      <line x1="18" y1="0" x2="18" y2="-8" stroke-width="2"/><line x1="92" y1="0" x2="92" y2="-8" stroke-width="2"/>
    </g>
    <!-- Highlighted day -->
    <rect x="314" y="38" width="22" height="18" rx="3" fill="#10b981" fill-opacity="0.4"/>
    <rect x="292" y="56" width="22" height="18" rx="3" fill="#10b981" fill-opacity="0.2"/>
    <!-- Checkmarks on booked days -->
    <g stroke="#6ee7b7" stroke-width="1.5" fill="none" stroke-opacity="0.7">
      <polyline points="317,47 321,51 327,44"/>
      <polyline points="295,65 299,69 305,62"/>
    </g>
    <!-- Clock face -->
    <g transform="translate(100,55)" stroke="#34d399" stroke-width="1.5" fill="none" stroke-opacity="0.5">
      <circle cx="0" cy="0" r="32"/>
      <line x1="0" y1="0" x2="0" y2="-20" stroke-width="2"/>
      <line x1="0" y1="0" x2="14" y2="8" stroke-width="2"/>
      <circle cx="0" cy="0" r="2" fill="#34d399" fill-opacity="0.6"/>
    </g>
    <!-- Dots around clock -->
    <g fill="#6ee7b7" fill-opacity="0.4">
      <circle cx="100" cy="22" r="1.5"/><circle cx="132" cy="55" r="1.5"/>
      <circle cx="100" cy="87" r="1.5"/><circle cx="68" cy="55" r="1.5"/>
    </g>
  </svg>`),"courses-products":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#78350f"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Stacked books -->
    <g transform="translate(270,15)">
      <!-- Book 3 (back) -->
      <rect x="10" y="60" width="90" height="14" rx="2" fill="#d97706" fill-opacity="0.3" stroke="#fbbf24" stroke-width="1" stroke-opacity="0.4"/>
      <line x1="20" y1="60" x2="20" y2="74" stroke="#fbbf24" stroke-opacity="0.5" stroke-width="2"/>
      <!-- Book 2 -->
      <rect x="5" y="42" width="90" height="14" rx="2" fill="#b45309" fill-opacity="0.4" stroke="#fbbf24" stroke-width="1" stroke-opacity="0.5"/>
      <line x1="16" y1="42" x2="16" y2="56" stroke="#fbbf24" stroke-opacity="0.6" stroke-width="2"/>
      <!-- Book 1 (front) -->
      <rect x="0" y="24" width="90" height="14" rx="2" fill="#92400e" fill-opacity="0.6" stroke="#fcd34d" stroke-width="1.5" stroke-opacity="0.7"/>
      <line x1="12" y1="24" x2="12" y2="38" stroke="#fcd34d" stroke-opacity="0.8" stroke-width="2"/>
      <!-- Open book top -->
      <path d="M5 5 Q50 15 95 5 L95 22 Q50 32 5 22Z" fill="#a16207" fill-opacity="0.5" stroke="#fcd34d" stroke-width="1" stroke-opacity="0.5"/>
      <line x1="50" y1="5" x2="50" y2="22" stroke="#fcd34d" stroke-opacity="0.4" stroke-width="1"/>
    </g>
    <!-- Play button / video course -->
    <g transform="translate(80,55)">
      <circle cx="0" cy="0" r="35" fill="rgba(217,119,6,0.15)" stroke="#fbbf24" stroke-width="1.5" stroke-opacity="0.5"/>
      <circle cx="0" cy="0" r="22" fill="rgba(217,119,6,0.2)" stroke="#fbbf24" stroke-width="1" stroke-opacity="0.4"/>
      <polygon points="-8,-12 18,0 -8,12" fill="#fbbf24" fill-opacity="0.6"/>
    </g>
    <!-- Stars -->
    <g fill="#fcd34d" fill-opacity="0.5">
      <text x="155" y="30" font-size="12">★</text>
      <text x="172" y="30" font-size="12">★</text>
      <text x="189" y="30" font-size="12">★</text>
      <text x="206" y="30" font-size="12">★</text>
      <text x="223" y="30" font-size="10">☆</text>
    </g>
    <!-- Progress bar -->
    <rect x="155" y="40" width="90" height="6" rx="3" fill="rgba(251,191,36,0.15)"/>
    <rect x="155" y="40" width="65" height="6" rx="3" fill="#f59e0b" fill-opacity="0.6"/>
    <text x="250" y="47" font-size="8" fill="#fcd34d" fill-opacity="0.6">72%</text>
  </svg>`),crm:L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e3a5f"/>
        <stop offset="100%" stop-color="#1e40af"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Network nodes -->
    <g stroke="#60a5fa" stroke-width="1" stroke-opacity="0.35" fill="none">
      <line x1="200" y1="55" x2="120" y2="25"/><line x1="200" y1="55" x2="280" y2="25"/>
      <line x1="200" y1="55" x2="100" y2="75"/><line x1="200" y1="55" x2="300" y2="80"/>
      <line x1="200" y1="55" x2="160" y2="90"/><line x1="200" y1="55" x2="340" y2="50"/>
      <line x1="120" y1="25" x2="50" y2="40"/><line x1="280" y1="25" x2="360" y2="15"/>
    </g>
    <!-- People avatars at nodes -->
    <g fill="#3b82f6" fill-opacity="0.5" stroke="#93c5fd" stroke-width="1" stroke-opacity="0.6">
      <circle cx="200" cy="55" r="10"/>
      <circle cx="120" cy="25" r="7"/><circle cx="280" cy="25" r="7"/>
      <circle cx="100" cy="75" r="6"/><circle cx="300" cy="80" r="6"/>
      <circle cx="160" cy="90" r="5"/><circle cx="340" cy="50" r="6"/>
      <circle cx="50" cy="40" r="5"/><circle cx="360" cy="15" r="5"/>
    </g>
    <!-- Center person icon -->
    <g fill="#bfdbfe" fill-opacity="0.6" transform="translate(200,55)">
      <circle cx="0" cy="-3" r="4"/><path d="M-6,8 Q0,4 6,8 L5,14 Q0,11 -5,14Z"/>
    </g>
    <!-- Bar chart inset -->
    <g transform="translate(18,30)">
      <rect x="0" y="30" width="10" height="35" fill="#3b82f6" fill-opacity="0.4" rx="2"/>
      <rect x="14" y="18" width="10" height="47" fill="#60a5fa" fill-opacity="0.5" rx="2"/>
      <rect x="28" y="38" width="10" height="27" fill="#3b82f6" fill-opacity="0.4" rx="2"/>
      <rect x="42" y="8" width="10" height="57" fill="#93c5fd" fill-opacity="0.6" rx="2"/>
    </g>
  </svg>`),csr:L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7f1d1d"/>
        <stop offset="100%" stop-color="#991b1b"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Headset -->
    <g transform="translate(280,20)" stroke="#fca5a5" stroke-width="2" fill="none" stroke-opacity="0.6">
      <path d="M10 30 Q10 5 40 5 Q70 5 70 30"/>
      <rect x="2" y="28" width="14" height="22" rx="6" fill="rgba(239,68,68,0.3)" stroke="#ef4444" stroke-width="1.5"/>
      <rect x="64" y="28" width="14" height="22" rx="6" fill="rgba(239,68,68,0.3)" stroke="#ef4444" stroke-width="1.5"/>
      <path d="M76 44 Q82 44 82 50 Q82 58 76 58" stroke-width="1.5"/>
    </g>
    <!-- Chat bubbles -->
    <g fill="rgba(239,68,68,0.15)" stroke="#fca5a5" stroke-width="1.5" stroke-opacity="0.5">
      <rect x="20" y="18" width="130" height="32" rx="12" ry="12"/>
      <polygon points="32,50 20,62 50,50"/>
    </g>
    <g fill="rgba(239,68,68,0.1)" stroke="#fca5a5" stroke-width="1" stroke-opacity="0.4">
      <rect x="30" y="65" width="110" height="26" rx="10" ry="10"/>
      <polygon points="120,65 140,55 128,65"/>
    </g>
    <!-- Dots inside bubbles (message) -->
    <g fill="#fca5a5" fill-opacity="0.5">
      <circle cx="55" cy="34" r="3"/><circle cx="70" cy="34" r="3"/><circle cx="85" cy="34" r="3"/>
      <circle cx="65" cy="78" r="2.5"/><circle cx="78" cy="78" r="2.5"/><circle cx="91" cy="78" r="2.5"/>
    </g>
    <!-- Stars / ratings -->
    <g fill="#fca5a5" fill-opacity="0.4" font-size="14">
      <text x="170" y="80">★★★★★</text>
    </g>
  </svg>`),"email-marketing":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4a044e"/>
        <stop offset="100%" stop-color="#6b21a8"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Large envelope -->
    <g transform="translate(260,18)" stroke="#c084fc" stroke-width="1.5" fill="rgba(168,85,247,0.15)" stroke-opacity="0.6">
      <rect x="0" y="0" width="120" height="80" rx="6"/>
      <polyline points="0,0 60,45 120,0" fill="none"/>
      <line x1="0" y1="80" x2="42" y2="42"/><line x1="120" y1="80" x2="78" y2="42"/>
    </g>
    <!-- Flying smaller envelopes -->
    <g stroke="#d8b4fe" stroke-width="1" fill="rgba(168,85,247,0.1)" stroke-opacity="0.4">
      <rect x="30" y="20" width="60" height="40" rx="4"/>
      <polyline points="30,20 60,38 90,20" fill="none"/>
    </g>
    <g stroke="#d8b4fe" stroke-width="1" fill="rgba(168,85,247,0.08)" stroke-opacity="0.35">
      <rect x="140" y="60" width="50" height="34" rx="3"/>
      <polyline points="140,60 165,74 190,60" fill="none"/>
    </g>
    <!-- Send trajectory dots -->
    <g fill="#d8b4fe" fill-opacity="0.45">
      <circle cx="210" cy="55" r="2.5"/><circle cx="230" cy="48" r="2"/><circle cx="248" cy="42" r="1.5"/>
    </g>
    <!-- Analytics lines -->
    <g stroke="#a855f7" stroke-width="1.5" fill="none" stroke-opacity="0.4">
      <polyline points="15,95 40,80 70,85 100,65 130,70 160,50 195,55"/>
    </g>
  </svg>`),"funnel-builder":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#431407"/>
        <stop offset="100%" stop-color="#7c2d12"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Funnel shape -->
    <g transform="translate(260,5)" fill-opacity="0.0" stroke-opacity="0.55">
      <!-- Stage 1 wide -->
      <rect x="0" y="0" width="120" height="22" rx="4" fill="rgba(251,146,60,0.35)" stroke="#fb923c" stroke-width="1.5"/>
      <!-- Stage 2 -->
      <rect x="15" y="26" width="90" height="18" rx="4" fill="rgba(251,146,60,0.28)" stroke="#fdba74" stroke-width="1.5"/>
      <!-- Stage 3 -->
      <rect x="28" y="48" width="64" height="16" rx="4" fill="rgba(251,146,60,0.22)" stroke="#fed7aa" stroke-width="1.5"/>
      <!-- Stage 4 narrow -->
      <rect x="40" y="68" width="40" height="14" rx="4" fill="rgba(251,146,60,0.18)" stroke="#fed7aa" stroke-width="1"/>
      <!-- Drop arrow -->
      <line x1="60" y1="82" x2="60" y2="96" stroke="#fb923c" stroke-width="2" stroke-opacity="0.6"/>
      <polygon points="53,93 60,103 67,93" fill="#fb923c" fill-opacity="0.6"/>
    </g>
    <!-- Stage labels -->
    <g fill="#fed7aa" fill-opacity="0.5" font-size="7" text-anchor="middle">
      <text x="320" y="15">AWARENESS</text>
      <text x="320" y="39">INTEREST</text>
      <text x="320" y="60">DECISION</text>
      <text x="320" y="79">ACTION</text>
    </g>
    <!-- Left: people icons flowing in -->
    <g fill="#fb923c" fill-opacity="0.35">
      <circle cx="60" cy="12" r="4"/><circle cx="80" cy="8" r="4"/><circle cx="100" cy="12" r="4"/>
      <circle cx="50" cy="5" r="3"/><circle cx="115" cy="7" r="3"/><circle cx="140" cy="10" r="3"/>
      <circle cx="160" cy="6" r="3.5"/><circle cx="180" cy="12" r="3"/><circle cx="30" cy="8" r="3"/>
    </g>
    <!-- Conversion rate chart -->
    <g transform="translate(20,40)">
      <rect x="0" y="0" width="12" height="50" fill="#f97316" fill-opacity="0.4" rx="2"/>
      <rect x="16" y="15" width="12" height="35" fill="#fb923c" fill-opacity="0.4" rx="2"/>
      <rect x="32" y="28" width="12" height="22" fill="#fdba74" fill-opacity="0.4" rx="2"/>
      <rect x="48" y="38" width="12" height="12" fill="#fed7aa" fill-opacity="0.4" rx="2"/>
    </g>
  </svg>`),"gray-label":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1f2937"/>
        <stop offset="100%" stop-color="#374151"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Brand shield / badge -->
    <g transform="translate(280,10)" stroke="#9ca3af" stroke-width="1.5" fill="rgba(156,163,175,0.12)" stroke-opacity="0.5">
      <path d="M45 0 L90 18 L90 55 Q90 85 45 95 Q0 85 0 55 L0 18 Z"/>
      <path d="M45 15 L75 28 L75 52 Q75 72 45 80 Q15 72 15 52 L15 28 Z" fill="rgba(156,163,175,0.08)"/>
      <!-- Crown -->
      <polyline points="25,48 35,35 45,44 55,35 65,48" fill="none" stroke="#d1d5db" stroke-opacity="0.6"/>
      <circle cx="25" cy="52" r="3" fill="#9ca3af" fill-opacity="0.5"/>
      <circle cx="45" cy="44" r="3" fill="#9ca3af" fill-opacity="0.5"/>
      <circle cx="65" cy="52" r="3" fill="#9ca3af" fill-opacity="0.5"/>
    </g>
    <!-- White label boxes with brand marks -->
    <g stroke="#6b7280" stroke-width="1" fill="rgba(107,114,128,0.1)" stroke-opacity="0.4">
      <rect x="20" y="20" width="80" height="55" rx="6"/>
      <rect x="30" y="28" width="60" height="8" rx="2" fill="rgba(156,163,175,0.2)"/>
      <rect x="30" y="42" width="40" height="4" rx="1" fill="rgba(156,163,175,0.15)"/>
      <rect x="30" y="50" width="50" height="4" rx="1" fill="rgba(156,163,175,0.15)"/>
      <rect x="30" y="58" width="35" height="4" rx="1" fill="rgba(156,163,175,0.12)"/>
    </g>
    <!-- Tag icon -->
    <g transform="translate(120,30)" stroke="#9ca3af" stroke-width="1.5" fill="none" stroke-opacity="0.5">
      <path d="M5 0 L35 0 L50 20 L35 40 L5 40 L5 0Z"/>
      <circle cx="12" cy="12" r="4"/>
    </g>
    <!-- Dotted pattern background texture -->
    <g fill="#6b7280" fill-opacity="0.12">
      <circle cx="200" cy="20" r="1.5"/><circle cx="220" cy="35" r="1.5"/><circle cx="240" cy="20" r="1.5"/>
      <circle cx="260" cy="35" r="1.5"/><circle cx="210" cy="55" r="1.5"/><circle cx="230" cy="70" r="1.5"/>
      <circle cx="250" cy="55" r="1.5"/><circle cx="180" cy="70" r="1.5"/><circle cx="195" cy="90" r="1"/>
    </g>
  </svg>`),"social-media-management":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#500724"/>
        <stop offset="100%" stop-color="#9d174d"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Phone mockup -->
    <g transform="translate(295,5)" stroke="#f9a8d4" stroke-width="1.5" fill="rgba(236,72,153,0.12)" stroke-opacity="0.5">
      <rect x="0" y="0" width="65" height="100" rx="10"/>
      <rect x="5" y="10" width="55" height="72" rx="4" fill="rgba(236,72,153,0.08)"/>
      <!-- Notch -->
      <rect x="20" y="2" width="25" height="6" rx="3" fill="rgba(236,72,153,0.2)"/>
      <!-- Image thumb -->
      <rect x="8" y="13" width="49" height="28" rx="2" fill="rgba(236,72,153,0.2)"/>
      <!-- Lines of text -->
      <rect x="8" y="45" width="35" height="3" rx="1" fill="rgba(249,168,212,0.3)"/>
      <rect x="8" y="52" width="49" height="3" rx="1" fill="rgba(249,168,212,0.2)"/>
      <rect x="8" y="59" width="40" height="3" rx="1" fill="rgba(249,168,212,0.2)"/>
      <!-- Like/comment row -->
      <circle cx="14" cy="74" r="4" fill="rgba(236,72,153,0.4)"/>
      <circle cx="26" cy="74" r="4" fill="rgba(236,72,153,0.3)"/>
      <rect x="35" y="70" width="18" height="8" rx="4" fill="rgba(236,72,153,0.25)"/>
    </g>
    <!-- Social platform icons (abstract) -->
    <g fill="none" stroke="#f472b6" stroke-width="1.5" stroke-opacity="0.5">
      <!-- Instagram-ish -->
      <rect x="30" y="20" width="40" height="40" rx="10" fill="rgba(236,72,153,0.1)"/>
      <circle cx="50" cy="40" r="12" fill="none"/>
      <circle cx="62" cy="28" r="3" fill="#f472b6" fill-opacity="0.5"/>
      <!-- Twitter-ish bird path -->
      <path d="M110 25 Q118 18 128 22 Q130 16 138 18 Q132 22 130 28 Q136 26 140 30 Q132 32 126 40 Q114 44 104 36 Q108 38 112 36 Q106 32 110 25Z" fill="rgba(236,72,153,0.2)"/>
      <!-- Facebook-ish f -->
      <rect x="170" y="20" width="36" height="40" rx="8" fill="rgba(236,72,153,0.1)"/>
      <path d="M186 60 L186 44 L182 44 L182 38 L186 38 L186 34 Q186 25 196 25 L200 25 L200 31 L196 31 Q193 31 193 34 L193 38 L200 38 L199 44 L193 44 L193 60Z" fill="#f472b6" fill-opacity="0.4"/>
    </g>
    <!-- Follower count / analytics -->
    <g fill="#fce7f3" fill-opacity="0.4" font-size="8" text-anchor="middle">
      <text x="50" y="72">12.4K</text>
      <text x="120" y="72">8.1K</text>
      <text x="188" y="72">24K</text>
    </g>
    <!-- Upward trend -->
    <g stroke="#f472b6" stroke-width="1.5" fill="none" stroke-opacity="0.45">
      <polyline points="20,95 50,88 90,90 130,78 170,82 210,68 250,72"/>
      <polygon points="245,68 255,72 245,76" fill="#f472b6" fill-opacity="0.45"/>
    </g>
  </svg>`),"survey-forms":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#042f2e"/>
        <stop offset="100%" stop-color="#134e4a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Clipboard form -->
    <g transform="translate(270,5)" stroke="#5eead4" stroke-width="1.5" fill="rgba(20,184,166,0.12)" stroke-opacity="0.5">
      <rect x="0" y="15" width="100" height="90" rx="6"/>
      <rect x="28" y="8" width="44" height="16" rx="5" fill="rgba(20,184,166,0.25)"/>
      <!-- Form lines -->
      <rect x="10" y="35" width="80" height="7" rx="2" fill="rgba(94,234,212,0.2)"/>
      <rect x="10" y="50" width="60" height="7" rx="2" fill="rgba(94,234,212,0.15)"/>
      <rect x="10" y="65" width="70" height="7" rx="2" fill="rgba(94,234,212,0.15)"/>
      <!-- Checkboxes -->
      <rect x="10" y="80" width="8" height="8" rx="2"/>
      <rect x="25" y="80" width="8" height="8" rx="2"/>
      <rect x="40" y="80" width="8" height="8" rx="2" fill="rgba(94,234,212,0.4)"/>
      <polyline points="42,83 44,86 48,81" fill="none" stroke="#2dd4bf" stroke-width="1.5"/>
    </g>
    <!-- Pie chart -->
    <g transform="translate(100,55)">
      <circle cx="0" cy="0" r="38" fill="none" stroke="#0d9488" stroke-width="1" stroke-opacity="0.3"/>
      <path d="M0 0 L0 -38 A38 38 0 0 1 33 -19 Z" fill="#14b8a6" fill-opacity="0.45"/>
      <path d="M0 0 L33 -19 A38 38 0 0 1 33 19 Z" fill="#0d9488" fill-opacity="0.3"/>
      <path d="M0 0 L33 19 A38 38 0 0 1 -38 0 Z" fill="#115e59" fill-opacity="0.4"/>
      <path d="M0 0 L-38 0 A38 38 0 0 1 0 -38 Z" fill="#0f766e" fill-opacity="0.35"/>
    </g>
    <!-- Percentage labels -->
    <g fill="#99f6e4" fill-opacity="0.5" font-size="8">
      <text x="30" y="30">28%</text>
      <text x="155" y="30">22%</text>
      <text x="155" y="85">35%</text>
      <text x="30" y="85">15%</text>
    </g>
  </svg>`),"tech-support":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Terminal window -->
    <g transform="translate(220,10)" stroke="#64748b" stroke-width="1" fill="rgba(30,41,59,0.8)" stroke-opacity="0.5">
      <rect x="0" y="0" width="165" height="90" rx="8"/>
      <!-- Title bar -->
      <rect x="0" y="0" width="165" height="20" rx="8" fill="rgba(51,65,85,0.8)"/>
      <rect x="0" y="12" width="165" height="8" fill="rgba(51,65,85,0.8)"/>
      <circle cx="12" cy="10" r="4" fill="#ef4444" fill-opacity="0.6"/>
      <circle cx="24" cy="10" r="4" fill="#f59e0b" fill-opacity="0.6"/>
      <circle cx="36" cy="10" r="4" fill="#22c55e" fill-opacity="0.6"/>
      <!-- Code lines -->
      <rect x="10" y="28" width="60" height="4" rx="1" fill="#38bdf8" fill-opacity="0.4"/>
      <rect x="75" y="28" width="40" height="4" rx="1" fill="#a78bfa" fill-opacity="0.4"/>
      <rect x="10" y="38" width="30" height="4" rx="1" fill="#4ade80" fill-opacity="0.4"/>
      <rect x="44" y="38" width="70" height="4" rx="1" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="10" y="48" width="50" height="4" rx="1" fill="#94a3b8" fill-opacity="0.3"/>
      <rect x="64" y="48" width="55" height="4" rx="1" fill="#f472b6" fill-opacity="0.35"/>
      <rect x="10" y="58" width="80" height="4" rx="1" fill="#38bdf8" fill-opacity="0.4"/>
      <rect x="10" y="68" width="45" height="4" rx="1" fill="#4ade80" fill-opacity="0.4"/>
      <!-- Cursor blink -->
      <rect x="59" y="68" width="8" height="4" rx="1" fill="#e2e8f0" fill-opacity="0.6"/>
      <rect x="10" y="78" width="30" height="4" rx="1" fill="#94a3b8" fill-opacity="0.2"/>
    </g>
    <!-- Wrench icon -->
    <g transform="translate(60,25)" stroke="#94a3b8" stroke-width="2" fill="none" stroke-opacity="0.5">
      <path d="M50 5 Q60 0 65 10 L45 35 L30 50 Q20 60 10 55 Q0 50 5 40 Q10 30 25 35 Z"/>
      <line x1="45" y1="35" x2="55" y2="45"/>
      <path d="M55 45 L70 60 Q75 65 70 70 Q65 75 60 70 L45 55 Z" fill="rgba(148,163,184,0.2)"/>
    </g>
    <!-- Signal/wifi waves -->
    <g stroke="#38bdf8" stroke-width="1.5" fill="none" stroke-opacity="0.4" stroke-linecap="round">
      <path d="M130 75 Q150 55 170 75"/>
      <path d="M122 83 Q150 48 178 83"/>
      <path d="M114 91 Q150 41 186 91"/>
      <circle cx="150" cy="88" r="3" fill="#38bdf8" fill-opacity="0.5"/>
    </g>
  </svg>`),"web-development":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#052e16"/>
        <stop offset="100%" stop-color="#14532d"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Browser mockup -->
    <g transform="translate(220,8)" stroke="#4ade80" stroke-width="1" fill="rgba(20,83,45,0.5)" stroke-opacity="0.45">
      <rect x="0" y="0" width="165" height="95" rx="8"/>
      <!-- Browser bar -->
      <rect x="0" y="0" width="165" height="22" rx="8" fill="rgba(21,128,61,0.3)"/>
      <rect x="0" y="14" width="165" height="8" fill="rgba(21,128,61,0.3)"/>
      <!-- URL bar -->
      <rect x="30" y="5" width="105" height="12" rx="4" fill="rgba(74,222,128,0.15)"/>
      <circle cx="12" cy="11" r="3" fill="#ef4444" fill-opacity="0.5"/>
      <circle cx="22" cy="11" r="3" fill="#f59e0b" fill-opacity="0.5"/>
      <!-- Content blocks -->
      <rect x="8" y="28" width="149" height="18" rx="3" fill="rgba(74,222,128,0.15)"/>
      <rect x="8" y="52" width="70" height="38" rx="3" fill="rgba(74,222,128,0.1)"/>
      <rect x="85" y="52" width="72" height="15" rx="2" fill="rgba(74,222,128,0.1)"/>
      <rect x="85" y="72" width="72" height="10" rx="2" fill="rgba(74,222,128,0.08)"/>
      <rect x="85" y="86" width="50" height="4" rx="1" fill="rgba(74,222,128,0.12)"/>
    </g>
    <!-- Code brackets and tags -->
    <g fill="none" stroke="#86efac" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round">
      <path d="M50 35 L30 55 L50 75"/>
      <path d="M80 35 L100 55 L80 75"/>
    </g>
    <g fill="#4ade80" fill-opacity="0.4" font-size="11" font-family="monospace">
      <text x="56" y="52">/&gt;</text>
      <text x="155" y="52">&lt;</text>
    </g>
    <!-- Floating HTML tags -->
    <g fill="#86efac" fill-opacity="0.3" font-size="8" font-family="monospace">
      <text x="15" y="15">&lt;html&gt;</text>
      <text x="15" y="95">&lt;/html&gt;</text>
      <text x="125" y="100">&lt;div&gt;</text>
    </g>
    <!-- Grid lines (responsive layout) -->
    <g stroke="#166534" stroke-width="0.5" stroke-opacity="0.4">
      <line x1="115" y1="28" x2="115" y2="95"/>
      <line x1="150" y1="8" x2="150" y2="22"/>
    </g>
  </svg>`),"survey-and-forms":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#042f2e"/>
        <stop offset="100%" stop-color="#134e4a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Clipboard -->
    <g transform="translate(260,5)" stroke="#5eead4" stroke-width="1.5" fill="rgba(20,184,166,0.12)" stroke-opacity="0.5">
      <rect x="0" y="15" width="110" height="90" rx="6"/>
      <rect x="30" y="8" width="50" height="16" rx="5" fill="rgba(20,184,166,0.25)"/>
      <rect x="10" y="35" width="90" height="7" rx="2" fill="rgba(94,234,212,0.2)"/>
      <rect x="10" y="50" width="70" height="7" rx="2" fill="rgba(94,234,212,0.15)"/>
      <rect x="10" y="65" width="80" height="7" rx="2" fill="rgba(94,234,212,0.15)"/>
      <rect x="10" y="82" width="9" height="9" rx="2"/>
      <rect x="26" y="82" width="9" height="9" rx="2"/>
      <rect x="42" y="82" width="9" height="9" rx="2" fill="rgba(94,234,212,0.4)"/>
      <polyline points="44,85 46,88 51,83" fill="none" stroke="#2dd4bf" stroke-width="1.5"/>
    </g>
    <!-- Pie chart -->
    <g transform="translate(95,55)">
      <circle cx="0" cy="0" r="38" fill="none" stroke="#0d9488" stroke-width="1" stroke-opacity="0.3"/>
      <path d="M0 0 L0 -38 A38 38 0 0 1 33 -19 Z" fill="#14b8a6" fill-opacity="0.45"/>
      <path d="M0 0 L33 -19 A38 38 0 0 1 33 19 Z" fill="#0d9488" fill-opacity="0.3"/>
      <path d="M0 0 L33 19 A38 38 0 0 1 -38 0 Z" fill="#115e59" fill-opacity="0.4"/>
      <path d="M0 0 L-38 0 A38 38 0 0 1 0 -38 Z" fill="#0f766e" fill-opacity="0.35"/>
    </g>
    <g fill="#99f6e4" fill-opacity="0.5" font-size="8">
      <text x="25" y="28">28%</text><text x="150" y="28">22%</text>
      <text x="150" y="88">35%</text><text x="25" y="88">15%</text>
    </g>
  </svg>`),"video-graphics-design":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1a0533"/>
        <stop offset="100%" stop-color="#2d1b69"/>
      </linearGradient>
      <radialGradient id="spot" cx="60%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <rect width="400" height="110" fill="url(#spot)"/>
    <!-- Film strip -->
    <g transform="translate(240,8)" stroke="#8b5cf6" stroke-width="1" fill="rgba(109,40,217,0.2)" stroke-opacity="0.5">
      <rect x="0" y="0" width="145" height="94" rx="4"/>
      <!-- Sprocket holes top -->
      <rect x="5" y="5" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="22" y="5" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="39" y="5" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="56" y="5" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="73" y="5" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="90" y="5" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="107" y="5" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="124" y="5" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <!-- Frames -->
      <rect x="5" y="22" width="40" height="28" rx="2" fill="rgba(139,92,246,0.2)"/>
      <rect x="52" y="22" width="40" height="28" rx="2" fill="rgba(139,92,246,0.15)"/>
      <rect x="99" y="22" width="40" height="28" rx="2" fill="rgba(167,139,250,0.2)"/>
      <!-- Sprocket holes bottom -->
      <rect x="5" y="77" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="22" y="77" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="39" y="77" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="56" y="77" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="73" y="77" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="90" y="77" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="107" y="77" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <rect x="124" y="77" width="12" height="12" rx="2" fill="rgba(139,92,246,0.3)"/>
      <!-- Play icon in middle frame -->
      <polygon points="56,30 68,36 56,42" fill="#a78bfa" fill-opacity="0.7"/>
    </g>
    <!-- Color palette circles -->
    <g fill-opacity="0.55">
      <circle cx="50" cy="35" r="18" fill="#ec4899"/>
      <circle cx="72" cy="35" r="18" fill="#f59e0b"/>
      <circle cx="61" cy="52" r="18" fill="#3b82f6"/>
    </g>
    <!-- Pen tool -->
    <g transform="translate(110,25)" stroke="#c4b5fd" stroke-width="1.5" fill="none" stroke-opacity="0.55">
      <path d="M10 60 L0 75 L15 70 Z" fill="rgba(196,181,253,0.3)"/>
      <path d="M10 60 L45 15 Q55 5 65 15 Q75 25 65 35 L30 70 Z"/>
      <line x1="25" y1="45" x2="55" y2="20"/>
    </g>
  </svg>`),"website-builder":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0c1a3a"/>
        <stop offset="100%" stop-color="#1e3a5f"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Browser frame -->
    <g transform="translate(215,8)" stroke="#3b82f6" stroke-width="1" fill="rgba(30,58,95,0.5)" stroke-opacity="0.5">
      <rect x="0" y="0" width="170" height="94" rx="8"/>
      <rect x="0" y="0" width="170" height="22" rx="8" fill="rgba(37,99,235,0.25)"/>
      <rect x="0" y="14" width="170" height="8" fill="rgba(37,99,235,0.25)"/>
      <circle cx="12" cy="11" r="3.5" fill="#ef4444" fill-opacity="0.5"/>
      <circle cx="22" cy="11" r="3.5" fill="#f59e0b" fill-opacity="0.5"/>
      <circle cx="32" cy="11" r="3.5" fill="#22c55e" fill-opacity="0.5"/>
      <rect x="42" y="5" width="100" height="12" rx="4" fill="rgba(59,130,246,0.2)"/>
      <!-- Hero block -->
      <rect x="8" y="28" width="154" height="22" rx="3" fill="rgba(59,130,246,0.2)"/>
      <!-- 3-col layout -->
      <rect x="8" y="56" width="46" height="32" rx="3" fill="rgba(59,130,246,0.12)"/>
      <rect x="61" y="56" width="46" height="32" rx="3" fill="rgba(59,130,246,0.12)"/>
      <rect x="114" y="56" width="48" height="32" rx="3" fill="rgba(59,130,246,0.15)"/>
    </g>
    <!-- Drag handle dots (builder UX) -->
    <g fill="#93c5fd" fill-opacity="0.4">
      <circle cx="222" cy="67" r="2"/><circle cx="222" cy="73" r="2"/><circle cx="222" cy="79" r="2"/>
      <circle cx="227" cy="67" r="2"/><circle cx="227" cy="73" r="2"/><circle cx="227" cy="79" r="2"/>
    </g>
    <!-- Globe / world icon -->
    <g transform="translate(80,55)" stroke="#60a5fa" stroke-width="1.5" fill="none" stroke-opacity="0.5">
      <circle cx="0" cy="0" r="38"/>
      <ellipse cx="0" cy="0" rx="18" ry="38"/>
      <line x1="-38" y1="0" x2="38" y2="0"/>
      <path d="M-35 -15 Q0 -8 35 -15"/>
      <path d="M-35 15 Q0 22 35 15"/>
    </g>
    <!-- Plus cursor (drag-drop add) -->
    <g stroke="#93c5fd" stroke-width="2" stroke-opacity="0.55" stroke-linecap="round">
      <line x1="170" y1="30" x2="170" y2="46"/>
      <line x1="162" y1="38" x2="178" y2="38"/>
    </g>
  </svg>`),"white-label":L(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="400" height="110" fill="url(#g)"/>
    <!-- Large shield -->
    <g transform="translate(265,5)" stroke="#94a3b8" stroke-width="1.5" fill="rgba(148,163,184,0.08)" stroke-opacity="0.5">
      <path d="M55 0 L110 22 L110 65 Q110 95 55 108 Q0 95 0 65 L0 22 Z"/>
      <path d="M55 16 L94 33 L94 62 Q94 83 55 93 Q16 83 16 62 L16 33 Z" fill="rgba(148,163,184,0.05)"/>
      <!-- Star / brand mark -->
      <polygon points="55,35 61,52 78,52 65,62 70,79 55,69 40,79 45,62 32,52 49,52" fill="rgba(148,163,184,0.3)" stroke="#cbd5e1" stroke-width="1"/>
    </g>
    <!-- Rebrand arrows (circular) -->
    <g transform="translate(85,55)" stroke="#64748b" stroke-width="1.5" fill="none" stroke-opacity="0.5">
      <path d="M0 -35 A35 35 0 1 1 -25 25"/>
      <polygon points="-30,18 -25,30 -18,20" fill="#64748b" fill-opacity="0.5"/>
    </g>
    <!-- Product boxes being rebranded -->
    <g stroke="#475569" stroke-width="1" fill="rgba(71,85,105,0.12)" stroke-opacity="0.45">
      <rect x="20" y="20" width="48" height="32" rx="5"/>
      <rect x="24" y="24" width="40" height="8" rx="2" fill="rgba(148,163,184,0.2)"/>
      <rect x="24" y="36" width="28" height="4" rx="1" fill="rgba(148,163,184,0.12)"/>
      <rect x="24" y="44" width="34" height="4" rx="1" fill="rgba(148,163,184,0.12)"/>
    </g>
    <g stroke="#475569" stroke-width="1" fill="rgba(71,85,105,0.18)" stroke-opacity="0.45">
      <rect x="140" y="20" width="48" height="32" rx="5"/>
      <rect x="144" y="24" width="40" height="8" rx="2" fill="rgba(203,213,225,0.25)"/>
      <rect x="144" y="36" width="28" height="4" rx="1" fill="rgba(203,213,225,0.15)"/>
      <rect x="144" y="44" width="34" height="4" rx="1" fill="rgba(203,213,225,0.15)"/>
    </g>
    <!-- Arrow between boxes -->
    <g stroke="#94a3b8" stroke-width="1.5" stroke-opacity="0.5" stroke-linecap="round">
      <line x1="72" y1="36" x2="136" y2="36"/>
      <polygon points="130,31 140,36 130,41" fill="#94a3b8" fill-opacity="0.5"/>
    </g>
    <!-- YOUR BRAND label -->
    <g fill="#cbd5e1" fill-opacity="0.35" font-size="7" text-anchor="middle">
      <text x="164" y="62">YOUR BRAND</text>
    </g>
  </svg>`)},xe={coursesproducts:"courses-products","csr-customer-service":"csr","csrcustomer-service":"csr",graylabel:"gray-label","social-media-management":"social-media-management",socialmediamanagement:"social-media-management","survey-forms":"survey-and-forms",surveyforms:"survey-and-forms","survey-and-forms":"survey-and-forms",surveyandforms:"survey-and-forms",techsupport:"tech-support",webdevelopment:"web-development",emailmarketing:"email-marketing",funnelbuilder:"funnel-builder",bookingappointment:"booking-appointment",aibuilder:"ai-builder",videographicsdesign:"video-graphics-design","video-graphics-design":"video-graphics-design",videographics:"video-graphics-design",websitebuilder:"website-builder","website-builder":"website-builder",whitelabel:"white-label","white-label":"white-label"},oe=g=>ie[g]??ie[xe[g]??""],fe="linear-gradient(135deg, rgba(128,0,0,0.14) 0%, rgba(160,0,0,0.07) 60%, transparent 100%)",q=e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})});function E({isdarkmode:g,value:i,onChange:o,onFileChange:l,onError:r}){const h=p.useRef(null),S=["image/png","image/jpeg","image/jpg","image/webp"],M=x=>{if(!S.includes(x.type)){r==null||r("Invalid file format uploaded. Only PNG, JPEG, JPG, and WEBP are accepted.");return}if(x.size>5*1024*1024){r==null||r("File size must be under 5MB.");return}l==null||l(x);const w=new FileReader;w.onload=()=>{typeof w.result=="string"&&o(w.result)},w.readAsDataURL(x)};return e.jsxs("div",{className:"w-full",children:[i?e.jsxs("div",{className:`relative rounded-lg overflow-hidden border ${g?"border-white/8":"border-gray-200"}`,style:{height:130},children:[e.jsx("img",{src:i,alt:"Cover",className:"w-full h-full object-cover"}),e.jsxs("div",{className:"absolute inset-0 bg-black/55 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity",children:[e.jsx("button",{type:"button",onClick:()=>{var x;return(x=h.current)==null?void 0:x.click()},className:"px-3 py-1.5 rounded text-[11px] font-medium bg-white text-gray-800 hover:bg-gray-100 transition-colors",style:{fontFamily:"'Poppins', sans-serif"},children:"Change"}),e.jsx("button",{type:"button",onClick:()=>{o(null),l==null||l(null)},className:"px-3 py-1.5 rounded text-[11px] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors",style:{fontFamily:"'Poppins', sans-serif"},children:"Remove"})]})]}):e.jsxs("div",{onClick:()=>{var x;return(x=h.current)==null?void 0:x.click()},onDrop:x=>{var v;x.preventDefault();const w=(v=x.dataTransfer.files)==null?void 0:v[0];w&&M(w)},onDragOver:x=>x.preventDefault(),className:`w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${g?"border-white/10 hover:border-[#800000]/50 bg-white/[0.02]":"border-gray-200 hover:border-[#800000]/40 bg-gray-50 hover:bg-white"}`,style:{height:110},children:[e.jsx("svg",{className:`w-6 h-6 ${g?"text-gray-600":"text-gray-400"}`,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})}),e.jsx("p",{className:`text-[11px] font-normal ${g?"text-gray-500":"text-gray-400"}`,style:{fontFamily:"'Poppins', sans-serif"},children:"Click or drag to upload"}),e.jsx("p",{className:`text-[10px] ${g?"text-gray-600":"text-gray-400"}`,style:{fontFamily:"'Poppins', sans-serif"},children:"PNG, JPG, WEBP Â· Max 5MB"})]}),e.jsx("input",{ref:h,type:"file",accept:"image/png,image/jpeg,image/jpg,image/webp",className:"hidden",onChange:x=>{var v;const w=(v=x.target.files)==null?void 0:v[0];w&&M(w),x.target.value=""}})]})}const D=g=>`w-full px-3 py-2 rounded-lg text-[11px] font-normal border outline-none transition-all duration-200 ${g?"bg-[#161616] text-[#f0f0f0] placeholder-[#6b7280] border-white/10 focus:border-[#800000]":"bg-white text-[#1f2937] placeholder-[#9ca3af] border-[#e5e7eb] focus:border-[#800000]"}`,z=g=>`block text-[10px] font-medium mb-1 uppercase tracking-wider ${g?"text-[#9ca3af]":"text-[#6b7280]"}`;function ge({isOpen:g,onClose:i,onSuccess:o,isdarkmode:l}){const[r,h]=p.useState({name:"",description:"",badge:"",coverPhoto:null,inactivePhoto:null,coverPhotoFile:null,inactivePhotoFile:null}),[S,M]=p.useState(!1),[x,w]=p.useState(""),[v,N]=p.useState([]),m=(c,n="error")=>{const k=++se;N(C=>[...C,{id:k,message:c,type:n}]),setTimeout(()=>N(C=>C.filter(A=>A.id!==k)),4e3)},R=c=>N(n=>n.filter(k=>k.id!==c)),P=c=>{/[0-9]/.test(c.key)&&c.preventDefault()};p.useEffect(()=>{g||(h({name:"",description:"",badge:"",coverPhoto:null,inactivePhoto:null,coverPhotoFile:null,inactivePhotoFile:null}),w(""),N([]))},[g]);const T=async c=>{c.preventDefault(),w(""),M(!0);try{const n=new FormData;n.append("serviceId",he(r.name)),n.append("name",r.name),n.append("description",r.description),n.append("badge",r.badge),r.coverPhotoFile&&n.append("coverPhoto",r.coverPhotoFile),r.inactivePhotoFile&&n.append("inactivePhoto",r.inactivePhotoFile);const k=await fetch(`${$}/services`,{method:"POST",credentials:"include",body:n}),C=k.headers.get("content-type");if(C&&C.includes("application/json")){const A=await k.json();if(!k.ok)throw new Error(A.error||"Failed to create service");o(),i()}else throw new Error(`Server error: received non-JSON response (${k.status})`)}catch(n){w(n instanceof Error?n.message:"An error occurred"),console.error("Submit error:",n)}finally{M(!1)}};return g?e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",style:{fontFamily:"'Poppins', sans-serif"},children:[e.jsx(le,{toasts:v,onRemove:R}),e.jsx("div",{className:"absolute inset-0 bg-black/60 backdrop-blur-sm",onClick:i}),e.jsxs("div",{className:`relative w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border ${l?"bg-[#111] border-white/5":"bg-white border-gray-100"}`,children:[e.jsxs("div",{className:"relative px-8 pt-8 pb-4",children:[e.jsx("div",{className:"absolute top-0 left-0 w-1.5 h-full bg-[#800000]"}),e.jsx("h2",{className:"text-[18px] font-semibold tracking-tight",style:{color:l?"#fff":"#111",margin:0},children:"New System Service"}),e.jsx("p",{className:"text-[11px] text-gray-400 mt-1 font-normal",children:"Registry update protocol"})]}),e.jsxs("form",{onSubmit:T,className:"px-8 pb-8 space-y-5",children:[x&&e.jsx("p",{className:"text-[10px] text-red-500 bg-red-500/10 p-2 rounded",children:x}),e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Cover Photo (optional)"}),e.jsx(E,{isdarkmode:l,value:r.coverPhoto,onChange:c=>h(n=>({...n,coverPhoto:c})),onFileChange:c=>h(n=>({...n,coverPhotoFile:c})),onError:c=>m(c,"error")})]}),e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Inactive Photo (optional)"}),e.jsx(E,{isdarkmode:l,value:r.inactivePhoto,onChange:c=>h(n=>({...n,inactivePhoto:c})),onFileChange:c=>h(n=>({...n,inactivePhotoFile:c})),onError:c=>m(c,"error")})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Service Name"}),e.jsx("input",{type:"text",required:!0,value:r.name,onChange:c=>{const n=c.target.value.replace(/[0-9]/g,"");h(k=>({...k,name:n}))},onKeyDown:P,className:D(l),placeholder:"e.g. CRM"})]}),e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Category Badge"}),e.jsx("input",{type:"text",required:!0,value:r.badge,onChange:c=>{const n=c.target.value.replace(/[0-9]/g,"");h(k=>({...k,badge:n}))},onKeyDown:P,className:D(l),placeholder:"e.g. Sales"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Service Description"}),e.jsx("textarea",{required:!0,value:r.description,onChange:c=>h(n=>({...n,description:c.target.value})),rows:3,className:`${D(l)} resize-none`,placeholder:"Describe what this service does..."})]}),e.jsxs("div",{className:"flex items-center gap-3 pt-4",children:[e.jsx("button",{type:"button",onClick:i,className:`flex-1 py-2.5 text-[11px] font-medium border rounded-lg transition-all ${l?"border-white/10 text-gray-400 hover:text-white":"border-gray-200 text-gray-500 hover:bg-gray-50"}`,children:"Cancel"}),e.jsx("button",{type:"submit",disabled:S,className:"flex-[2] py-2.5 text-[11px] font-medium text-white rounded-lg transition-all shadow-lg disabled:opacity-60",style:{background:"#800000"},children:S?"Registering...":"Register Service"})]})]})]})]}):null}function pe({isOpen:g,onClose:i,onSuccess:o,isdarkmode:l,service:r}){const[h,S]=p.useState({name:"",description:"",badge:"",coverPhoto:null,inactivePhoto:null,coverPhotoFile:null,inactivePhotoFile:null}),[M,x]=p.useState(!1),[w,v]=p.useState(!1),[N,m]=p.useState(""),[R,P]=p.useState(!1),[T,c]=p.useState([]),n=(s,a="error")=>{const j=++se;c(W=>[...W,{id:j,message:s,type:a}]),setTimeout(()=>c(W=>W.filter(H=>H.id!==j)),4e3)},k=s=>c(a=>a.filter(j=>j.id!==s)),C=s=>{/[0-9]/.test(s.key)&&s.preventDefault()};p.useEffect(()=>{r&&(S({name:r.name??"",description:r.description??"",badge:r.badge??"",coverPhoto:r.coverPhoto??null,inactivePhoto:r.inactivePhoto??null,coverPhotoFile:null,inactivePhotoFile:null}),P(!1),m(""))},[r]);const A=async s=>{if(s.preventDefault(),!!r){m(""),x(!0);try{const a=new FormData;a.append("name",h.name),a.append("description",h.description),a.append("badge",h.badge),h.coverPhotoFile?a.append("coverPhoto",h.coverPhotoFile):h.coverPhoto===null&&a.append("coverPhoto",""),h.inactivePhotoFile?a.append("inactivePhoto",h.inactivePhotoFile):h.inactivePhoto===null&&a.append("inactivePhoto","");const j=await fetch(`${$}/services/${r._id}`,{method:"PATCH",credentials:"include",body:a}),W=j.headers.get("content-type");if(W&&W.includes("application/json")){const H=await j.json();if(!j.ok)throw new Error(H.error||"Failed to update service");o(),i()}else throw new Error(`Server error: received HTML instead of JSON (${j.status}). Check your backend route.`)}catch(a){m(a instanceof Error?a.message:"An error occurred"),console.error("Update error:",a)}finally{x(!1)}}},F=async()=>{if(r){v(!0),m("");try{const s=await fetch(`${$}/services/${r._id}`,{method:"DELETE",credentials:"include"});if(!s.ok){const a=await s.json().catch(()=>({}));throw new Error(a.error||"Failed to delete service")}o(),i()}catch(s){m(s instanceof Error?s.message:"An error occurred"),console.error("Delete error:",s)}finally{v(!1),P(!1)}}};return!g||!r?null:e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",style:{fontFamily:"'Poppins', sans-serif"},children:[e.jsx(le,{toasts:T,onRemove:k}),e.jsx("div",{className:"absolute inset-0 bg-black/60 backdrop-blur-sm",onClick:i}),e.jsxs("div",{className:`relative w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border ${l?"bg-[#111] border-white/5":"bg-white border-gray-100"}`,children:[e.jsxs("div",{className:"relative px-8 pt-8 pb-4",children:[e.jsx("div",{className:"absolute top-0 left-0 w-1.5 h-full bg-[#800000]"}),e.jsx("h2",{className:"text-[18px] font-semibold tracking-tight",style:{color:l?"#fff":"#111",margin:0},children:"Modify Configuration"}),e.jsxs("p",{className:"text-[9px] font-mono mt-1 text-[#800000] font-bold uppercase tracking-tighter",children:["ref: ",r.serviceId]})]}),e.jsxs("form",{onSubmit:A,className:"px-8 pb-8 space-y-5",children:[N&&e.jsx("p",{className:"text-[10px] text-red-500 bg-red-500/10 p-2 rounded",children:N}),e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Cover Photo (optional)"}),e.jsx(E,{isdarkmode:l,value:h.coverPhoto,onChange:s=>S(a=>({...a,coverPhoto:s})),onFileChange:s=>S(a=>({...a,coverPhotoFile:s})),onError:s=>n(s,"error")})]}),e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Inactive Photo (optional)"}),e.jsx(E,{isdarkmode:l,value:h.inactivePhoto,onChange:s=>S(a=>({...a,inactivePhoto:s})),onFileChange:s=>S(a=>({...a,inactivePhotoFile:s})),onError:s=>n(s,"error")})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Display Name"}),e.jsx("input",{type:"text",required:!0,value:h.name,onChange:s=>{const a=s.target.value.replace(/[0-9]/g,"");S(j=>({...j,name:a}))},onKeyDown:C,className:D(l)})]}),e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Category Badge"}),e.jsx("input",{type:"text",required:!0,value:h.badge,onChange:s=>{const a=s.target.value.replace(/[0-9]/g,"");S(j=>({...j,badge:a}))},onKeyDown:C,className:D(l)})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:z(l),children:"Service Description"}),e.jsx("textarea",{required:!0,value:h.description,onChange:s=>S(a=>({...a,description:s.target.value})),rows:4,className:`${D(l)} resize-none`})]}),R&&e.jsxs("div",{className:`rounded-lg p-3 border text-[11px] ${l?"bg-red-950/30 border-red-900/40 text-red-400":"bg-red-50 border-red-200 text-red-600"}`,children:[e.jsxs("p",{className:"font-medium mb-2",children:['Delete "',r.name,'"? This action cannot be undone.']}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{type:"button",onClick:()=>P(!1),className:`flex-1 py-1.5 rounded text-[10px] font-medium border transition-all ${l?"border-white/10 text-gray-400 hover:text-white":"border-gray-200 text-gray-500 hover:bg-gray-100"}`,children:"Cancel"}),e.jsx("button",{type:"button",onClick:F,disabled:w,className:"flex-[2] py-1.5 rounded text-[10px] font-medium text-white bg-red-600 hover:bg-red-700 transition-all disabled:opacity-60",children:w?"Deleting...":"Yes, Delete Service"})]})]}),e.jsxs("div",{className:"flex items-center gap-3 pt-4",children:[!R&&e.jsxs("button",{type:"button",onClick:()=>P(!0),className:`py-2.5 px-3 text-[11px] font-medium border rounded-lg transition-all ${l?"border-red-900/40 text-red-500 hover:bg-red-950/30":"border-red-200 text-red-500 hover:bg-red-50"}`,children:[e.jsx("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",style:{display:"inline",marginRight:4},children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})}),"Delete"]}),e.jsx("button",{type:"button",onClick:i,className:`flex-1 py-2.5 text-[11px] font-medium border rounded-lg transition-all ${l?"border-white/10 text-gray-400 hover:text-white":"border-gray-200 text-gray-500 hover:bg-gray-50"}`,children:"Discard"}),e.jsx("button",{type:"submit",disabled:M,className:"flex-[2] py-2.5 text-[11px] font-medium text-white rounded-lg transition-all shadow-lg disabled:opacity-60",style:{background:"#800000"},children:M?"Updating...":"Commit Changes"})]})]})]})]})}function ye(){const g=ce(),{isdarkmode:i}=de(),[o,l]=p.useState(!1);p.useEffect(()=>{const t=()=>l(window.innerWidth<640);return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]);const[r,h]=p.useState([]),[S,M]=p.useState(!0),[x,w]=p.useState(""),[v,N]=p.useState("grid"),[m,R]=p.useState("all"),[P,T]=p.useState("alpha-asc"),[c,n]=p.useState(!1),[k,C]=p.useState(!1),[A,F]=p.useState(null);p.useEffect(()=>{s()},[]);const s=async()=>{try{M(!0);const t=await fetch(`${$}/services`,{credentials:"include"});if(!t.ok)throw new Error("Failed to fetch");h(await t.json())}catch(t){console.error(t)}finally{M(!1)}},a=async(t,f)=>{t.stopPropagation();const d=r.find(b=>b.serviceId===f);if(d)try{const b=await fetch(`${$}/services/${d._id}/toggle`,{method:"PATCH",headers:{"Content-Type":"application/json"},credentials:"include"});if(b.status===401){alert("Session expired."),g.push("/admin/login");return}if(!b.ok)throw new Error("Failed to toggle");const te=await b.json();h(ne=>ne.map(re=>re._id===te._id?te:re))}catch(b){console.error(b),alert("Failed to update service status")}},j=async(t,f)=>{t.stopPropagation();try{const d=await fetch(`${$}/services/${f._id}`,{credentials:"include"});if(d.ok){const b=await d.json();F(b)}else F(f)}catch{F(f)}C(!0)},W=()=>{C(!1),setTimeout(()=>F(null),200)},B=(t=>{const f=[...t];switch(P){case"alpha-asc":return f.sort((d,b)=>d.name.localeCompare(b.name));case"alpha-desc":return f.sort((d,b)=>b.name.localeCompare(d.name));case"date-newest":return f.sort((d,b)=>new Date(b.updatedAt??b.createdAt??0).getTime()-new Date(d.updatedAt??d.createdAt??0).getTime());case"date-oldest":return f.sort((d,b)=>new Date(d.updatedAt??d.createdAt??0).getTime()-new Date(b.updatedAt??b.createdAt??0).getTime());default:return f}})(r.filter(t=>{const f=x.toLowerCase(),d=t.name.toLowerCase().includes(f)||t.description.toLowerCase().includes(f)||t.badge.toLowerCase().includes(f),b=m==="all"||m==="active"&&t.isActive||m==="inactive"&&!t.isActive;return d&&b})),Y=r.filter(t=>t.isActive).length,K=r.filter(t=>!t.isActive).length,G=i?"#1a1a1a":"#ffffff",y=i?"rgba(255,255,255,0.08)":"#e5e7eb",I=i?"#f0f0f0":"#1f2937",Q=i?"#9ca3af":"#6b7280",u=i?"#6b7280":"#9ca3af",ae=i?"rgba(255,255,255,0.04)":"#f9fafb",J=i?"rgba(255,255,255,0.03)":"#f9fafb",X=i?"#161616":"#ffffff";if(S)return e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"'Poppins', sans-serif"},children:e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{width:36,height:36,border:"2px solid",borderColor:`${y} ${y} ${y} #800000`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px"}}),e.jsx("p",{style:{fontSize:13,color:u,fontWeight:400},children:"Loading services..."}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg) } }"})]})});const ee={background:G,border:`1px solid ${y}`,borderRadius:16},O=t=>({display:"inline-flex",alignItems:"center",gap:6,fontSize:11,fontWeight:500,padding:"4px 12px",borderRadius:20,border:`1px solid ${t?"rgba(0,188,125,0.2)":"rgba(241,161,13,0.2)"}`,background:t?"rgba(0,188,125,0.08)":"rgba(241,161,13,0.08)",color:t?"#00bc7d":"#f1a10d",whiteSpace:"nowrap"}),Z=t=>({position:"relative",width:38,height:22,borderRadius:11,border:"none",outline:"none",cursor:"pointer",transition:"background 0.3s",background:t?"#800000":i?"rgba(255,255,255,0.12)":"#d1d5db",flexShrink:0}),V=t=>({position:"absolute",top:2,left:t?18:2,width:18,height:18,borderRadius:"50%",background:"#ffffff",boxShadow:"0 1px 3px rgba(0,0,0,0.25)",transition:"left 0.3s"}),_=t=>({width:48,height:48,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:t?"linear-gradient(135deg, #800000, #a00000)":"rgba(255, 255, 255, 0.08)",backdropFilter:t?void 0:"blur(8px)",WebkitBackdropFilter:t?void 0:"blur(8px)",border:t?void 0:"1px solid rgba(255,255,255,0.10)",color:t?"#ffffff":"#9ca3af",flexShrink:0});return e.jsxs("div",{style:{minHeight:"100vh",fontFamily:"'Poppins', sans-serif"},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        * { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }
        .svc-row:hover { background: ${ae} !important; }
        .edit-btn { opacity: 0; transition: opacity 0.15s; }
        .svc-card:hover .edit-btn { opacity: 1; }
        .svc-row:hover .edit-btn { opacity: 1; }
        .svc-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .svc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,${i?"0.4":"0.10"}) !important;
          border-color: ${i?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.10)"};
        }
        .toggle-btn:active { transform: scale(0.92); }
      `}}),e.jsxs("div",{style:{maxWidth:1400,margin:"0 auto",padding:o?"20px 16px":"32px 24px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",flexDirection:o?"column":"row",justifyContent:"space-between",gap:16,marginBottom:28,paddingBottom:24,borderBottom:`1px solid ${y}`},children:[e.jsxs("div",{children:[e.jsx("h1",{style:{fontSize:18,fontWeight:500,color:I,margin:0,lineHeight:1.3},children:"Services Management"}),e.jsx("p",{style:{fontSize:12,color:u,margin:"4px 0 0",fontWeight:400},children:"Configure and manage all available services"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,width:o?"100%":"auto",justifyContent:o?"space-between":"flex-end"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderRadius:8,border:`1px solid ${y}`,background:G,fontSize:11},children:[e.jsx("span",{style:{color:u,fontWeight:400},children:"Total"}),e.jsx("strong",{style:{color:I,fontWeight:500},children:r.length}),e.jsx("span",{style:{width:1,height:12,background:y}}),e.jsx("span",{style:{width:7,height:7,borderRadius:"50%",background:"#00bc7d"}}),e.jsx("span",{style:{color:Q,fontWeight:500},children:Y}),e.jsx("span",{style:{width:1,height:12,background:y}}),e.jsx("span",{style:{width:7,height:7,borderRadius:"50%",background:"#f1a10d"}}),e.jsx("span",{style:{color:Q,fontWeight:500},children:K})]}),e.jsxs("button",{onClick:()=>n(!0),style:{display:"flex",alignItems:"center",gap:7,padding:o?"7px 12px":"9px 18px",borderRadius:8,background:"linear-gradient(135deg, #800000, #a00000)",color:"#fff",fontSize:o?11:12,fontWeight:500,border:"none",cursor:"pointer",transition:"opacity 0.15s"},onMouseOver:t=>t.currentTarget.style.opacity="0.88",onMouseOut:t=>t.currentTarget.style.opacity="1",children:[e.jsx("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2.5,d:"M12 4v16m8-8H4"})}),"Add Service"]})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:o?"column":"row",flexWrap:o?"nowrap":"wrap",alignItems:o?"stretch":"center",gap:12,marginBottom:24},children:[e.jsxs("div",{style:{position:"relative",width:o?"100%":220},children:[e.jsx("input",{type:"text",placeholder:"Search services...",value:x,onChange:t=>w(t.target.value),style:{width:"100%",paddingLeft:32,paddingRight:12,paddingTop:8,paddingBottom:8,borderRadius:8,border:`1px solid ${y}`,background:X,color:I,fontSize:12,outline:"none",transition:"border-color 0.15s",fontWeight:400},onFocus:t=>t.target.style.borderColor="#800000",onBlur:t=>t.target.style.borderColor=y}),e.jsx("svg",{style:{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:u,pointerEvents:"none"},width:"14",height:"14",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})]}),e.jsx("div",{style:{display:"flex",border:`1px solid ${y}`,borderRadius:8,overflow:"hidden",background:G,width:o?"100%":"auto"},children:[["all","All",r.length],["active","Active",Y],["inactive","Inactive",K]].map(([t,f,d],b)=>e.jsxs("button",{onClick:()=>R(t),style:{display:"flex",alignItems:"center",justifyContent:"center",flex:o?1:void 0,gap:6,padding:"8px 14px",fontSize:11,fontWeight:500,borderTop:"none",borderBottom:"none",borderRight:"none",borderLeftWidth:b>0?1:0,borderLeftStyle:"solid",borderLeftColor:y,cursor:"pointer",transition:"all 0.15s",background:m===t?"#800000":"transparent",color:m===t?"#ffffff":u},children:[f,e.jsx("span",{style:{fontSize:9,padding:"1px 6px",borderRadius:10,fontWeight:500,background:m===t?"rgba(255,255,255,0.22)":i?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)",color:m===t?"#fff":u},children:d})]},t))}),!o&&e.jsx("span",{style:{width:1,height:24,background:y}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,width:o?"100%":"auto",justifyContent:o?"space-between":"flex-start"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:11,color:u,fontWeight:400},children:"Sort by"}),e.jsxs("select",{value:P,onChange:t=>T(t.target.value),style:{fontSize:11,padding:"7px 10px",borderRadius:8,border:`1px solid ${y}`,background:X,color:I,outline:"none",cursor:"pointer",fontWeight:400},children:[e.jsx("option",{value:"alpha-asc",children:"Name A â†’ Z"}),e.jsx("option",{value:"alpha-desc",children:"Name Z â†’ A"}),e.jsx("option",{value:"date-newest",children:"Newest First"}),e.jsx("option",{value:"date-oldest",children:"Oldest First"})]})]}),o&&e.jsx("div",{style:{display:"flex",border:`1px solid ${y}`,borderRadius:8,overflow:"hidden",background:G},children:[["grid","M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"],["list","M4 6h16M4 12h16M4 18h16"]].map(([t,f],d)=>e.jsx("button",{onClick:()=>N(t),title:`${t.charAt(0).toUpperCase()+t.slice(1)} view`,style:{padding:"7px 12px",borderTop:"none",borderBottom:"none",borderRight:"none",borderLeftWidth:d>0?1:0,borderLeftStyle:"solid",borderLeftColor:y,background:v===t?"#800000":"transparent",color:v===t?"#fff":u,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center"},children:e.jsx("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:f})})},t))})]}),!o&&e.jsx("div",{style:{flex:1}}),!o&&e.jsxs("span",{style:{fontSize:11,color:u,fontWeight:400},children:["Showing"," ",e.jsx("strong",{style:{color:Q,fontWeight:500},children:B.length})," of"," ",e.jsx("strong",{style:{color:Q,fontWeight:500},children:r.length})]}),!o&&e.jsx("span",{style:{width:1,height:24,background:y}}),!o&&e.jsx("div",{style:{display:"flex",border:`1px solid ${y}`,borderRadius:8,overflow:"hidden",background:G},children:[["grid","M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"],["list","M4 6h16M4 12h16M4 18h16"]].map(([t,f],d)=>e.jsx("button",{onClick:()=>N(t),title:`${t.charAt(0).toUpperCase()+t.slice(1)} view`,style:{padding:"7px 10px",borderTop:"none",borderBottom:"none",borderRight:"none",borderLeftWidth:d>0?1:0,borderLeftStyle:"solid",borderLeftColor:y,background:v===t?"#800000":"transparent",color:v===t?"#fff":u,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center"},children:e.jsx("svg",{width:"14",height:"14",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:f})})},t))})]}),B.length===0&&e.jsxs("div",{style:{...ee,padding:"64px 32px",textAlign:"center"},children:[e.jsx("div",{style:{width:52,height:52,borderRadius:14,background:i?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:u},children:e.jsx("svg",{width:"24",height:"24",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})}),e.jsx("h3",{style:{fontSize:14,fontWeight:500,color:I,margin:"0 0 6px"},children:"No services found"}),e.jsx("p",{style:{fontSize:12,color:u,margin:0,fontWeight:400},children:"Try adjusting your search or filter criteria"})]}),B.length>0&&v==="grid"&&e.jsx("div",{style:{display:"grid",gridTemplateColumns:o?"1fr":"repeat(auto-fill, minmax(280px, 1fr))",gap:o?14:20},children:B.map(t=>e.jsxs("div",{className:"svc-card",style:{background:i?"#1a1a1a":"#ffffff",border:`1px solid ${y}`,borderRadius:16,overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:i?"0 1px 4px rgba(0,0,0,0.35)":"0 2px 8px rgba(0,0,0,0.08)",position:"relative"},children:[e.jsxs("div",{style:{position:"relative",height:115,margin:"-1px -1px 0 -1px",borderRadius:"16px 16px 0 0",overflow:"hidden",background:oe(t.serviceId)?`${oe(t.serviceId)} center/cover no-repeat`:fe,backgroundColor:"#111827",flexShrink:0},children:[e.jsx("div",{style:{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.50) 100%)"}}),e.jsx("div",{style:{position:"absolute",bottom:14,left:16,..._(t.isActive),boxShadow:"0 2px 8px rgba(0,0,0,0.30)"},children:U[t.serviceId]||q}),e.jsxs("div",{style:{position:"absolute",top:12,right:12,display:"flex",alignItems:"center",gap:6},children:[e.jsx("span",{style:{fontSize:9,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em",padding:"3px 8px",borderRadius:6,background:"rgba(0,0,0,0.45)",color:"#e5e7eb",backdropFilter:"blur(4px)"},children:t.badge}),e.jsx("button",{className:"edit-btn",onClick:f=>j(f,t),style:{padding:"5px",borderRadius:7,border:"none",background:"rgba(0,0,0,0.45)",color:"#e5e7eb",cursor:"pointer",display:"flex",alignItems:"center",backdropFilter:"blur(4px)",transition:"background 0.2s"},children:e.jsx("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})})})]})]}),e.jsxs("div",{style:{padding:"16px 18px 14px",display:"flex",flexDirection:"column",gap:10,flex:1,background:i?"#1a1a1a":"#ffffff"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("h3",{style:{fontSize:14,fontWeight:600,color:i?"#f9fafb":"#111827",margin:"0 0 6px",lineHeight:1.35},children:t.name}),e.jsx("p",{style:{fontSize:12,color:i?"#9ca3af":"#6b7280",lineHeight:1.6,margin:0,fontWeight:400,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"},children:t.description})]}),e.jsx("div",{children:e.jsxs("span",{style:O(t.isActive),children:[e.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:t.isActive?"#00bc7d":"#f1a10d",flexShrink:0}}),t.isActive?"Active":"Inactive"]})})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",borderTop:`1px solid ${i?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.07)"}`,background:i?"#151515":"#f9fafb"},children:[e.jsx("span",{style:{fontSize:10,color:u,fontFamily:"monospace",fontWeight:400},children:t.serviceId}),e.jsx("button",{className:"toggle-btn",onClick:f=>a(f,t.serviceId),style:Z(t.isActive),children:e.jsx("span",{style:V(t.isActive)})})]})]},t._id))}),B.length>0&&v==="list"&&e.jsxs("div",{style:{...ee,overflow:"hidden"},children:[!o&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"2fr 1fr 3fr 130px 90px",gap:16,padding:"10px 20px",borderBottom:`1px solid ${y}`,background:J,fontSize:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em",color:u},children:[e.jsx("span",{children:"Service"}),e.jsx("span",{children:"Category"}),e.jsx("span",{children:"Description"}),e.jsx("span",{children:"Status"}),e.jsx("span",{style:{textAlign:"right"},children:"Actions"})]}),B.map((t,f)=>o?e.jsxs("div",{className:"svc-row",style:{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:f!==B.length-1?`1px solid ${y}`:"none",transition:"background 0.15s"},children:[e.jsx("div",{style:{..._(t.isActive),width:40,height:40,borderRadius:11,flexShrink:0},children:U[t.serviceId]||q}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:3},children:[e.jsx("p",{style:{fontSize:13,fontWeight:500,color:I,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t.name}),e.jsxs("span",{style:O(t.isActive),children:[e.jsx("span",{style:{width:5,height:5,borderRadius:"50%",background:t.isActive?"#00bc7d":"#f1a10d",flexShrink:0}}),t.isActive?"Active":"Inactive"]})]}),e.jsx("p",{style:{fontSize:11,color:u,margin:0,fontWeight:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t.description})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,flexShrink:0},children:[e.jsx("button",{className:"edit-btn",onClick:d=>j(d,t),style:{padding:"6px 8px",borderRadius:6,border:"none",background:i?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)",color:u,cursor:"pointer",display:"flex",alignItems:"center",opacity:1},children:e.jsx("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})})}),e.jsx("button",{className:"toggle-btn",onClick:d=>a(d,t.serviceId),style:Z(t.isActive),children:e.jsx("span",{style:V(t.isActive)})})]})]},t._id):e.jsxs("div",{className:"svc-row",style:{display:"grid",gridTemplateColumns:"2fr 1fr 3fr 130px 90px",gap:16,alignItems:"center",padding:"14px 20px",borderBottom:f!==B.length-1?`1px solid ${y}`:"none",transition:"background 0.15s",position:"relative"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,minWidth:0},children:[e.jsx("div",{style:{..._(t.isActive),width:36,height:36,borderRadius:10},children:U[t.serviceId]||q}),e.jsxs("div",{style:{minWidth:0},children:[e.jsx("p",{style:{fontSize:13,fontWeight:500,color:I,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t.name}),e.jsx("p",{style:{fontSize:10,color:u,margin:"2px 0 0",fontFamily:"monospace",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:400},children:t.serviceId})]})]}),e.jsx("span",{style:{fontSize:9,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em",padding:"3px 8px",borderRadius:4,background:i?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)",color:u,alignSelf:"center",width:"fit-content"},children:t.badge}),e.jsx("p",{style:{fontSize:12,color:u,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:400},children:t.description}),e.jsxs("span",{style:O(t.isActive),children:[e.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:t.isActive?"#00bc7d":"#f1a10d",flexShrink:0}}),t.isActive?"Active":"Inactive"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8},children:[e.jsx("button",{className:"edit-btn",onClick:d=>j(d,t),style:{padding:"5px 7px",borderRadius:6,border:"none",background:i?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)",color:u,cursor:"pointer",display:"flex",alignItems:"center"},children:e.jsx("svg",{width:"13",height:"13",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})})}),e.jsx("button",{className:"toggle-btn",onClick:d=>a(d,t.serviceId),style:Z(t.isActive),children:e.jsx("span",{style:V(t.isActive)})})]})]},t._id)),e.jsxs("div",{style:{padding:"10px 20px",borderTop:`1px solid ${y}`,background:J,fontSize:10,color:u,fontWeight:400},children:[B.length," service",B.length!==1?"s":""," displayed",m!=="all"&&` · filtered by "${m}"`,x&&` · matching "${x}"`]})]})]}),e.jsx(ge,{isOpen:c,onClose:()=>n(!1),onSuccess:s,isdarkmode:i}),e.jsx(pe,{isOpen:k,onClose:W,onSuccess:s,isdarkmode:i,service:A})]})}function Le(){return e.jsx("div",{className:"w-full",children:e.jsx(ye,{})})}export{Le as default};
