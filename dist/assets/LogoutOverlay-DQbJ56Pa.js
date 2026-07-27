import{j as e}from"./charts-CZnqqKLy.js";import{r as t,b as d}from"./react-D15L_eJl.js";import{I as p}from"./index-Ds_Y0K8E.js";const x=650;function b({portalLabel:i,accent:s="#800000",onDone:o,ready:r=!0}){const n=t.useRef(o);n.current=o;const[l,c]=t.useState(!1);t.useEffect(()=>c(!0),[]);const f=t.useRef(Date.now());return t.useEffect(()=>{if(!r)return;const a=Date.now()-f.current,m=Math.max(0,x-a),u=setTimeout(()=>n.current(),m);return()=>clearTimeout(u)},[r]),l?d.createPortal(e.jsxs("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-black",style:{opacity:1},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes loRingPop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes loDoorDraw {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes loRipple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes loLogoIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes loTextIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes loDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}}),e.jsx("div",{className:"absolute inset-0 opacity-[0.07] pointer-events-none",style:{backgroundImage:"radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",backgroundSize:"26px 26px"}}),e.jsx("div",{className:"absolute rounded-full blur-3xl pointer-events-none",style:{width:480,height:480,background:`${s}33`,top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}),e.jsxs("div",{className:"relative z-10 flex flex-col items-center px-6 text-center",children:[e.jsxs("div",{className:"relative mb-7 w-20 h-20 flex items-center justify-center",children:[e.jsx("span",{className:"absolute inset-0 rounded-full",style:{border:`2px solid ${s}`,animation:"loRipple 1.6s ease-out infinite"}}),e.jsx("div",{className:"relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl",style:{background:`linear-gradient(135deg, ${s}, #2a0000)`,animation:"loRingPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both"},children:e.jsx("svg",{width:"34",height:"34",viewBox:"0 0 24 24",fill:"none",children:e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",stroke:"#fff",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",strokeDasharray:"40",strokeDashoffset:"40",style:{animation:"loDoorDraw 0.5s ease-out 0.35s forwards"}})})})]}),e.jsx("div",{className:"mb-2 w-9 h-9 relative opacity-0",style:{animation:"loLogoIn 0.5s ease-out 0.15s forwards"},children:e.jsx(p,{src:"/images/Tlxlogo.webp",alt:"TelexPH logo",fill:!0,className:"object-contain",priority:!0})}),e.jsx("h1",{className:"text-2xl font-bold tracking-tight text-white mb-1.5 font-poppins opacity-0",style:{animation:"loTextIn 0.5s ease-out 0.25s forwards"},children:"Logging out"}),e.jsxs("p",{className:"text-sm text-gray-400 font-open-sans opacity-0",style:{animation:"loTextIn 0.5s ease-out 0.35s forwards"},children:["Signing you out of ",i]}),e.jsx("div",{className:"flex items-center gap-1.5 mt-6 opacity-0",style:{animation:"loTextIn 0.5s ease-out 0.45s forwards"},children:[0,1,2].map(a=>e.jsx("span",{className:"w-1.5 h-1.5 rounded-full",style:{background:s,animation:`loDotBounce 1s ease-in-out ${a*.15}s infinite`}},a))})]})]}),document.body):null}export{b as L};
