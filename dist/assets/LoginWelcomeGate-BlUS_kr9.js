import{j as e}from"./charts-CZnqqKLy.js";import{r as t,b as f}from"./react-D15L_eJl.js";import{I as m,v as u,y as d}from"./index-Ds_Y0K8E.js";function p({portalLabel:o,accent:a="#800000",onDone:r}){const n=t.useRef(r);return n.current=r,t.useEffect(()=>{const s=setTimeout(()=>n.current(),2200);return()=>clearTimeout(s)},[]),e.jsxs("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-black",style:{opacity:1},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes lsoRingPop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes lsoCheckDraw {
          from { stroke-dashoffset: 32; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes lsoRipple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes lsoLogoIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lsoTextIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsoDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}}),e.jsx("div",{className:"absolute inset-0 opacity-[0.07] pointer-events-none",style:{backgroundImage:"radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",backgroundSize:"26px 26px"}}),e.jsx("div",{className:"absolute rounded-full blur-3xl pointer-events-none",style:{width:480,height:480,background:`${a}33`,top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}),e.jsxs("div",{className:"relative z-10 flex flex-col items-center px-6 text-center",children:[e.jsxs("div",{className:"relative mb-7 w-20 h-20 flex items-center justify-center",children:[e.jsx("span",{className:"absolute inset-0 rounded-full",style:{border:`2px solid ${a}`,animation:"lsoRipple 1.6s ease-out infinite"}}),e.jsx("div",{className:"relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl",style:{background:`linear-gradient(135deg, ${a}, #2a0000)`,animation:"lsoRingPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both"},children:e.jsx("svg",{width:"34",height:"34",viewBox:"0 0 24 24",fill:"none",children:e.jsx("path",{d:"M5 12.5L10 17L19 7",stroke:"#fff",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",strokeDasharray:"32",strokeDashoffset:"32",style:{animation:"lsoCheckDraw 0.45s ease-out 0.35s forwards"}})})})]}),e.jsx("div",{className:"mb-2 w-9 h-9 relative opacity-0",style:{animation:"lsoLogoIn 0.5s ease-out 0.15s forwards"},children:e.jsx(m,{src:"/images/Tlxlogo.webp",alt:"TelexPH logo",fill:!0,className:"object-contain",priority:!0})}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-white mb-1.5 font-poppins opacity-0",style:{animation:"lsoTextIn 0.5s ease-out 0.25s forwards"},children:"Login successful"}),e.jsxs("p",{className:"text-sm text-gray-400 font-open-sans opacity-0",style:{animation:"lsoTextIn 0.5s ease-out 0.35s forwards"},children:["Taking you to your ",o," dashboard"]}),e.jsx("div",{className:"flex items-center gap-1.5 mt-6 opacity-0",style:{animation:"lsoTextIn 0.5s ease-out 0.45s forwards"},children:[0,1,2].map(s=>e.jsx("span",{className:"w-1.5 h-1.5 rounded-full",style:{background:a,animation:`lsoDotBounce 1s ease-in-out ${s*.15}s infinite`}},s))})]})]})}function x({portalLabel:o,accent:a}){const r=u(),n=d(),[s,l]=t.useState(()=>n.get("welcome")==="1"),[i,c]=t.useState(!1);return t.useEffect(()=>c(!0),[]),t.useEffect(()=>{s&&r.replace(window.location.pathname,{scroll:!1})},[s,r]),!s||!i?null:f.createPortal(e.jsx(p,{portalLabel:o,accent:a,onDone:()=>l(!1)}),document.body)}function b(o){return e.jsx(t.Suspense,{fallback:null,children:e.jsx(x,{...o})})}export{b as L};
