import{j as e,R as C,A,C as T,X as R,Y as M,T as B,a as f}from"./charts-CZnqqKLy.js";import{r as n}from"./react-D15L_eJl.js";import{ae as D,af as u}from"./index-WTr94d4F.js";import{useDarkMode as V}from"./Layout-Dm6czqjh.js";import{L as I}from"./LoginWelcomeGate-B_e3PhRX.js";import"./pdf-ckwbz45p.js";import"./LogoutOverlay-TE9-pwaB.js";import"./LogoutConfirmModal-BMij5ozl.js";const E=["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80&fit=crop","https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80&fit=crop","https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80&fit=crop","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80&fit=crop","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80&fit=crop"],P=["#1e6e4a","#8b0f0f","#103f9e","#2d5a3d","#1e3a5a"];function O(){const g=D()==="/admin/dashboard/page-views",{isdarkmode:t}=V(),[b,y]=n.useState("2026-01-28"),[w,j]=n.useState([{name:"jan",views:0,likes:0},{name:"feb",views:0,likes:0},{name:"mar",views:0,likes:0},{name:"apr",views:0,likes:0},{name:"may",views:0,likes:0},{name:"jun",views:0,likes:0},{name:"jul",views:0,likes:0}]),[l,v]=n.useState({totalAllTime:0,totalUnique:0,daily:0,weekly:0,monthly:0,yearly:0}),[k,p]=n.useState(!0),[q,m]=n.useState(!0),[h,x]=n.useState(null),[d,N]=n.useState("all");n.useEffect(()=>{(async()=>{var i,s,o;try{m(!0),x(null);const r=await u.get("/dashboard/stats/casestudies-summary");v(r.data)}catch(r){((i=r.response)==null?void 0:i.status)!==401&&x(((o=(s=r.response)==null?void 0:s.data)==null?void 0:o.message)||r.message||"Unknown error")}finally{m(!1)}})()},[]),n.useEffect(()=>{(async()=>{try{p(!0);const i=await u.get(`/dashboard/engagement-metrics?resourceType=${d}`);j(i.data)}catch{}finally{p(!1)}})()},[d]),n.useEffect(()=>{if(h){const a=setTimeout(()=>x(null),5e3);return()=>clearTimeout(a)}},[h]);const $=[{label:"Total views",value:l.totalAllTime.toLocaleString(),subValue:`${l.totalUnique.toLocaleString()} unique visitors`,icon:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"rgba(255,255,255,0.9)",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"3",width:"20",height:"14",rx:"2"}),e.jsx("path",{d:"M8 21h8M12 17v4"})]})},{label:"Today",value:l.daily.toLocaleString(),subValue:"Views in the last 24 hours",icon:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"rgba(255,255,255,0.9)",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]})},{label:"This week",value:l.weekly.toLocaleString(),subValue:"Views in the last 7 days",icon:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"rgba(255,255,255,0.9)",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})},{label:"This month",value:l.monthly.toLocaleString(),subValue:"Views in the last 30 days",icon:e.jsx("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"rgba(255,255,255,0.9)",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})})},{label:"This year",value:l.yearly.toLocaleString(),subValue:"Views in the last 365 days",icon:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"rgba(255,255,255,0.9)",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"2",y1:"12",x2:"22",y2:"12"}),e.jsx("path",{d:"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"})]})}],S=[{customer:"john smith",date:"jan 25, 2026",amount:"$1,240",status:"completed"},{customer:"sarah jones",date:"jan 24, 2026",amount:"$890",status:"pending"},{customer:"mike wilson",date:"jan 23, 2026",amount:"$2,150",status:"completed"},{customer:"emma davis",date:"jan 22, 2026",amount:"$675",status:"completed"}],z=[{label:"revenue",value:"$12,482",change:"+12.5% from Last Month",up:!0},{label:"orders",value:"1,248",change:"+8.2% from Last Month",up:!0},{label:"avg. order",value:"$9.80",change:"-3.1% from Last Month",up:!1},{label:"customers",value:"892",change:"+15.3% from Last Month",up:!0}],L=[{country:"united states",percentage:85},{country:"united kingdom",percentage:62},{country:"canada",percentage:45},{country:"australia",percentage:30}],W=[{icon:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"12",y1:"1",x2:"12",y2:"23"}),e.jsx("path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"})]}),gradient:"linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",gradientLight:"linear-gradient(135deg, #e8f4fd 0%, #dbeafe 60%, #bfdbfe 100%)",accentColor:"#60a5fa",accentColorLight:"#1d4ed8"},{icon:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"}),e.jsx("line",{x1:"3",y1:"6",x2:"21",y2:"6"}),e.jsx("path",{d:"M16 10a4 4 0 0 1-8 0"})]}),gradient:"linear-gradient(135deg, #1a1a2e 0%, #1e1b4b 60%, #312e81 100%)",gradientLight:"linear-gradient(135deg, #f5f3ff 0%, #ede9fe 60%, #ddd6fe 100%)",accentColor:"#a78bfa",accentColorLight:"#6d28d9"},{icon:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"1",y:"4",width:"22",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"1",y1:"10",x2:"23",y2:"10"})]}),gradient:"linear-gradient(135deg, #1a1a2e 0%, #1c1917 60%, #292524 100%)",gradientLight:"linear-gradient(135deg, #fff7ed 0%, #ffedd5 60%, #fed7aa 100%)",accentColor:"#fb923c",accentColorLight:"#c2410c"},{icon:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})]}),gradient:"linear-gradient(135deg, #1a1a2e 0%, #14532d 60%, #166534 100%)",gradientLight:"linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)",accentColor:"#4ade80",accentColorLight:"#15803d"}];return e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }

        /* ─────────────────────────────────────────
           STAT CARD — gradient-over-image
        ───────────────────────────────────────── */
        .stat-img-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          /* height scales with viewport */
          height: 116px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: default;
        }
        @media (min-width: 480px)  { .stat-img-card { height: 126px; } }
        @media (min-width: 640px)  { .stat-img-card { height: 134px; } }
        @media (min-width: 1024px) { .stat-img-card { height: 144px; } }

        .stat-img-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.26);
        }
        .stat-img-card .card-photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.4s ease;
        }
        .stat-img-card:hover .card-photo { transform: scale(1.06); }
        .stat-img-card .card-overlay   { position: absolute; inset: 0; }
        .stat-img-card .card-body {
          position: relative;
          z-index: 3;
          padding: 11px 12px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 480px)  { .stat-img-card .card-body { padding: 12px 14px; } }
        @media (min-width: 640px)  { .stat-img-card .card-body { padding: 13px 15px; } }
        @media (min-width: 1024px) { .stat-img-card .card-body { padding: 14px 16px; } }

        .stat-img-card .card-label {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.92);
        }
        @media (min-width: 480px)  { .stat-img-card .card-label { font-size: 8.5px; } }
        @media (min-width: 640px)  { .stat-img-card .card-label { font-size: 9px; } }
        @media (min-width: 1024px) { .stat-img-card .card-label { font-size: 9.5px; } }

        .stat-img-card .card-icon-btn {
          width: 25px; height: 25px;
          border-radius: 6px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        @media (min-width: 640px)  { .stat-img-card .card-icon-btn { width: 28px; height: 28px; border-radius: 7px; } }
        @media (min-width: 1024px) { .stat-img-card .card-icon-btn { width: 30px; height: 30px; } }

        .stat-img-card .card-value {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        @media (min-width: 480px)  { .stat-img-card .card-value { font-size: 32px; } }
        @media (min-width: 640px)  { .stat-img-card .card-value { font-size: 36px; } }
        @media (min-width: 1024px) { .stat-img-card .card-value { font-size: 42px; letter-spacing: -1.5px; } }

        .stat-img-card .card-hint {
          font-size: 8.5px;
          font-weight: 400;
          color: rgba(255,255,255,0.7);
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        @media (min-width: 480px)  { .stat-img-card .card-hint { font-size: 9px; } }
        @media (min-width: 640px)  { .stat-img-card .card-hint { font-size: 10px; } }

        .stat-img-card .card-hint-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.72);
          flex-shrink: 0;
          display: inline-block;
        }
        @media (min-width: 640px) { .stat-img-card .card-hint-dot { width: 5px; height: 5px; } }

        /* ─────────────────────────────────────────
           PERFORMANCE MINI-CARDS
        ───────────────────────────────────────── */
        .perf-mini-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          transition: all 0.3s;
          padding: 14px;
        }
        @media (min-width: 480px)  { .perf-mini-card { padding: 16px; border-radius: 14px; } }
        @media (min-width: 640px)  { .perf-mini-card { padding: 18px; } }
        @media (min-width: 1024px) { .perf-mini-card { padding: 20px; border-radius: 16px; } }
        .perf-mini-card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.15); transform: translateY(-2px); }

        .perf-mini-value {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 8px;
          line-height: 1;
        }
        @media (min-width: 480px)  { .perf-mini-value { font-size: 22px; } }
        @media (min-width: 640px)  { .perf-mini-value { font-size: 24px; } }
        @media (min-width: 1024px) { .perf-mini-value { font-size: 26px; } }

        /* ─────────────────────────────────────────
           TABLE PADDING
        ───────────────────────────────────────── */
        .tbl-th { padding: 10px 14px; font-size: 9px; }
        .tbl-td { padding: 10px 14px; }
        @media (min-width: 480px)  { .tbl-th { padding: 11px 18px; font-size: 9.5px; } .tbl-td { padding: 11px 18px; } }
        @media (min-width: 640px)  { .tbl-th { padding: 12px 22px; font-size: 10px; }  .tbl-td { padding: 12px 22px; } }
        @media (min-width: 1024px) { .tbl-th { padding: 14px 32px; }                   .tbl-td { padding: 14px 32px; } }

        /* ─────────────────────────────────────────
           CARD PADDING
        ───────────────────────────────────────── */
        .card-inner { padding: 16px; }
        @media (min-width: 480px)  { .card-inner { padding: 20px; } }
        @media (min-width: 640px)  { .card-inner { padding: 24px; } }
        @media (min-width: 1024px) { .card-inner { padding: 32px; } }

        .card-hdr { padding: 14px 16px; }
        @media (min-width: 480px)  { .card-hdr { padding: 16px 20px; } }
        @media (min-width: 640px)  { .card-hdr { padding: 18px 24px; } }
        @media (min-width: 1024px) { .card-hdr { padding: 20px 32px; } }
      `}}),e.jsxs("div",{className:`flex flex-col items-start justify-start space-y-5 sm:space-y-6 lg:space-y-8 min-h-screen transition-colors duration-500 ${t?"bg-[#0f0f0f]":"bg-[#f8f9fa]"}`,children:[h&&e.jsx("div",{className:"fixed top-4 right-3 sm:top-8 sm:right-8 bg-red-600 text-white px-5 py-3 sm:px-8 sm:py-5 rounded-lg shadow-2xl z-50 border-2 border-red-500/20",style:{fontSize:12,fontWeight:500,maxWidth:"calc(100vw - 24px)"},children:h}),e.jsx("div",{className:"w-full max-w-7xl mx-auto",children:e.jsxs("div",{className:`flex items-center justify-between pb-4 sm:pb-5 lg:pb-6 border-b transition-colors duration-500 ${t?"border-white/5":"border-gray-200"}`,children:[e.jsxs("div",{children:[e.jsx("h2",{className:`tracking-tight transition-colors ${t?"text-white":"text-gray-800"}`,style:{fontSize:15,fontWeight:500,margin:0},children:g?"Page views analytics":"Dashboard overview"}),e.jsx("p",{className:`mt-1 transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontSize:11,fontWeight:400,margin:"4px 0 0"},children:g?"Case study views, engagement, and traffic metrics":"Key metrics and performance at a glance"})]}),e.jsx("input",{type:"date",value:b,onChange:a=>y(a.target.value),className:`hidden sm:block px-3 sm:px-5 py-2 sm:py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${t?"bg-[#202020] border-white/10 text-gray-300 focus:border-white/30":"bg-white border-gray-200 text-gray-700 focus:border-gray-400"}`,style:{fontSize:11,fontWeight:400}})]})}),e.jsx("div",{className:"w-full max-w-7xl mx-auto grid grid-cols-2 min-[480px]:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3",children:$.map((a,i)=>{const s=P[i],o=parseInt(s.slice(1,3),16),r=parseInt(s.slice(3,5),16),c=parseInt(s.slice(5,7),16);return e.jsxs("div",{className:"stat-img-card",children:[e.jsx("div",{className:"card-photo",style:{backgroundImage:`url(${E[i]})`}}),e.jsx("div",{className:"card-overlay",style:{background:`linear-gradient(to right,
                      rgb(${o},${r},${c}) 0%,
                      rgb(${o},${r},${c}) 38%,
                      rgba(${o},${r},${c},0.82) 55%,
                      rgba(${o},${r},${c},0.45) 72%,
                      rgba(${o},${r},${c},0.12) 100%
                    )`}}),e.jsx("div",{className:"card-overlay",style:{background:"linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)"}}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between"},children:[e.jsx("span",{className:"card-label",children:a.label}),e.jsx("div",{className:"card-icon-btn",children:a.icon})]}),e.jsxs("div",{children:[e.jsx("div",{className:"card-value",children:a.value}),e.jsxs("div",{className:"card-hint",children:[e.jsx("span",{className:"card-hint-dot"}),e.jsx("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:a.subValue})]})]})]})]},i)})}),e.jsxs("div",{className:"w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-3 sm:gap-4",children:[e.jsxs("div",{className:`card-inner rounded-xl border shadow-sm transition-all duration-500 ${t?"bg-[#1a1a1a] border-white/5":"bg-white border-gray-200"}`,children:[e.jsxs("div",{style:{marginBottom:20},children:[e.jsx("p",{className:`transition-colors ${t?"text-white":"text-gray-800"}`,style:{fontSize:13,fontWeight:600,margin:0},children:"Performance overview"}),e.jsx("p",{className:`mt-1 transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontSize:12,fontWeight:400,margin:"4px 0 0"},children:"Key business metrics compared to last month"})]}),e.jsx("div",{className:"grid grid-cols-2 gap-2 sm:gap-3",children:z.map((a,i)=>{const s=W[i];return e.jsxs("div",{className:"perf-mini-card",style:{background:t?s.gradient:s.gradientLight,border:t?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(0,0,0,0.06)"},children:[e.jsx("div",{style:{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:t?`radial-gradient(circle, ${s.accentColor}22 0%, transparent 70%)`:`radial-gradient(circle, ${s.accentColorLight}18 0%, transparent 70%)`,pointerEvents:"none"}}),e.jsxs("div",{className:"flex items-start justify-between mb-3 sm:mb-4",children:[e.jsx("p",{style:{fontSize:9,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",margin:0,color:t?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.45)"},children:a.label}),e.jsx("div",{style:{width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:t?`${s.accentColor}20`:`${s.accentColorLight}18`,color:t?s.accentColor:s.accentColorLight,flexShrink:0},children:s.icon})]}),e.jsx("p",{className:"perf-mini-value",style:{color:t?"#ffffff":"#111827"},children:a.value}),e.jsx("div",{style:{height:1,background:t?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)",marginBottom:10}}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:5,background:a.up?"rgba(5,150,105,0.15)":"rgba(220,38,38,0.15)",color:a.up?"#34d399":"#f87171"},children:[a.up?"↑":"↓"," ",a.change.split(" ")[0]]}),e.jsx("span",{style:{fontSize:10,fontWeight:400,color:t?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.4)"},children:"vs last month"})]})]},i)})})]}),e.jsxs("div",{className:`card-inner rounded-xl border shadow-sm transition-all duration-500 flex flex-col items-center ${t?"bg-[#1a1a1a] border-white/5":"bg-white border-gray-200"}`,children:[e.jsxs("div",{className:"w-full",style:{marginBottom:20},children:[e.jsx("p",{className:`transition-colors ${t?"text-white":"text-gray-800"}`,style:{fontSize:13,fontWeight:600,margin:0},children:"Popular Categories"}),e.jsx("p",{className:`mt-1 transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontSize:11,fontWeight:400,margin:"3px 0 0"},children:"Top content categories by engagement"})]}),e.jsxs("div",{style:{position:"relative",width:"min(160px, 44vw)",height:"min(160px, 44vw)",marginBottom:22},children:[e.jsxs("svg",{viewBox:"0 0 36 36",style:{width:"100%",height:"100%",transform:"rotate(-90deg)"},children:[e.jsx("circle",{cx:"18",cy:"18",r:"16",fill:"none",stroke:t?"#2a2a2a":"#f3f4f6",strokeWidth:"4"}),e.jsx("circle",{cx:"18",cy:"18",r:"16",fill:"none",stroke:"#800000",strokeWidth:"4",strokeDasharray:"75, 100"}),e.jsx("circle",{cx:"18",cy:"18",r:"16",fill:"none",stroke:"#f97316",strokeWidth:"4",strokeDasharray:"15, 100",strokeDashoffset:"-75"})]}),e.jsxs("div",{style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},children:[e.jsx("span",{className:`transition-colors ${t?"text-white":"text-gray-800"}`,style:{fontSize:22,fontWeight:700},children:"82%"}),e.jsx("span",{className:`uppercase tracking-widest transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontSize:9,fontWeight:500},children:"Growth"})]})]}),e.jsx("div",{className:"w-full flex flex-col gap-4",children:[{label:"Appliances",pct:"75%",color:"#800000"},{label:"Accessories",pct:"15%",color:"#f97316"}].map((a,i)=>e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{style:{width:10,height:10,borderRadius:"50%",background:a.color,flexShrink:0}}),e.jsx("span",{className:`transition-colors ${t?"text-gray-400":"text-gray-600"}`,style:{fontSize:11,fontWeight:400},children:a.label})]}),e.jsx("span",{className:`transition-colors ${t?"text-white":"text-gray-800"}`,style:{fontSize:11,fontWeight:600},children:a.pct})]},i))})]})]}),e.jsx("div",{className:"w-full max-w-7xl mx-auto",children:e.jsxs("div",{className:`card-inner rounded-xl border shadow-sm transition-all duration-500 ${t?"bg-[#1a1a1a] border-white/5":"bg-white border-gray-200"}`,children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:`transition-colors ${t?"text-white":"text-gray-800"}`,style:{fontSize:13,fontWeight:600,margin:0},children:"Engagement Metrics"}),e.jsxs("p",{className:`mt-1 transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontSize:10,fontWeight:400,margin:"3px 0 0"},children:[d==="all"&&"Views and Likes from Blogs & Case Studies",d==="blog"&&"Views and Likes from Blogs Only",d==="casestudy"&&"Views and Likes from Case Studies Only"]})]}),e.jsxs("div",{className:"flex items-center gap-3 sm:gap-4 flex-wrap",children:[e.jsx("div",{className:`flex gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-md border transition-all duration-500 ${t?"bg-[#202020] border-white/5":"bg-gray-50 border-gray-200"}`,children:["all","blog","casestudy"].map(a=>e.jsx("button",{onClick:()=>N(a),className:`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg transition-all ${d===a?"bg-[#800000] text-white shadow-md":t?"text-gray-400 hover:bg-white/5":"text-gray-600 hover:bg-gray-100"}`,style:{fontSize:10,fontWeight:d===a?500:400,whiteSpace:"nowrap"},children:a==="all"?"All":a==="blog"?"Blogs":"Case Studies"},a))}),[{color:"#800000",label:"views"},{color:"#6b7280",label:"likes"}].map(a=>e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:a.color}}),e.jsx("span",{className:`transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontSize:10,fontWeight:400},children:a.label})]},a.label)),k&&e.jsx("span",{className:`transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontSize:10,fontStyle:"italic"},children:"loading data..."})]})]}),e.jsx("div",{style:{height:"clamp(180px, 35vw, 280px)",width:"100%"},children:e.jsx(C,{width:"100%",height:"100%",children:e.jsxs(A,{data:w,children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"colorviews",x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"5%",stopColor:"#800000",stopOpacity:.12}),e.jsx("stop",{offset:"95%",stopColor:"#800000",stopOpacity:0})]})}),e.jsx(T,{strokeDasharray:"3 3",vertical:!1,stroke:t?"#2a2a2a":"#f3f4f6"}),e.jsx(R,{dataKey:"name",axisLine:!1,tickLine:!1,tick:{fontSize:10,fill:t?"#6b7280":"#9ca3af",fontWeight:400},dy:10}),e.jsx(M,{axisLine:!1,tickLine:!1,tick:{fontSize:10,fill:t?"#6b7280":"#9ca3af",fontWeight:400},width:30}),e.jsx(B,{contentStyle:{borderRadius:14,border:`1px solid ${t?"rgba(255,255,255,0.08)":"#e5e7eb"}`,boxShadow:"0 4px 16px rgba(0,0,0,.10)",fontSize:12,backgroundColor:t?"#1a1a1a":"#ffffff",color:t?"#f0f0f0":"#1f2937"}}),e.jsx(f,{type:"monotone",dataKey:"views",stroke:"#800000",strokeWidth:3,fillOpacity:1,fill:"url(#colorviews)"}),e.jsx(f,{type:"monotone",dataKey:"likes",stroke:"#6b7280",strokeWidth:2,fill:"transparent"})]})})})]})}),e.jsxs("div",{className:"w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 pb-6 sm:pb-8",children:[e.jsxs("div",{className:`rounded-xl border shadow-sm transition-all duration-500 overflow-hidden ${t?"bg-[#1a1a1a] border-white/5":"bg-white border-gray-200"}`,children:[e.jsxs("div",{className:`card-hdr flex items-center justify-between border-b transition-all duration-500 ${t?"bg-[#202020] border-white/5":"bg-gray-50 border-gray-200"}`,children:[e.jsxs("div",{children:[e.jsx("p",{className:`transition-colors ${t?"text-white":"text-gray-800"}`,style:{fontSize:13,fontWeight:600,margin:0},children:"Recent transactions"}),e.jsx("p",{className:`mt-1 transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontSize:11,fontWeight:400,margin:"3px 0 0"},children:"Latest customer orders and payments"})]}),e.jsx("button",{className:"px-3 sm:px-4 py-1.5 rounded-lg bg-[#800000] text-white hover:bg-[#600000] transition-all shrink-0",style:{fontSize:10,fontWeight:500},children:"View all"})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full",style:{minWidth:340},children:[e.jsx("thead",{children:e.jsx("tr",{className:`border-b transition-all duration-500 ${t?"border-white/5":"border-gray-100"}`,children:["Customer","Date","Amount","Status"].map(a=>e.jsx("th",{className:`tbl-th text-left uppercase tracking-widest transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontWeight:500},children:a},a))})}),e.jsx("tbody",{className:`divide-y transition-all duration-500 ${t?"divide-white/5":"divide-gray-100"}`,children:S.map((a,i)=>e.jsxs("tr",{className:`transition-all duration-300 ${t?"hover:bg-[#202020]":"hover:bg-gray-50"}`,children:[e.jsx("td",{className:"tbl-td",children:e.jsxs("div",{className:"flex items-center gap-2 sm:gap-3",children:[e.jsx("div",{className:`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${t?"bg-white/10":"bg-gray-100"}`,style:{fontSize:9,fontWeight:600,color:"#800000",textTransform:"uppercase"},children:a.customer.split(" ").map(s=>s[0]).join("")}),e.jsx("p",{className:`transition-colors ${t?"text-white":"text-gray-800"} whitespace-nowrap`,style:{fontSize:11,fontWeight:500,margin:0,textTransform:"capitalize"},children:a.customer})]})}),e.jsx("td",{className:"tbl-td",children:e.jsx("p",{className:`transition-colors ${t?"text-gray-400":"text-gray-500"} whitespace-nowrap`,style:{fontSize:11,fontWeight:400,margin:0},children:a.date})}),e.jsx("td",{className:"tbl-td",children:e.jsx("p",{className:`transition-colors ${t?"text-white":"text-gray-800"}`,style:{fontSize:12,fontWeight:600,margin:0},children:a.amount})}),e.jsx("td",{className:"tbl-td",children:e.jsx("span",{className:`px-3 py-1.5 rounded-md whitespace-nowrap ${a.status==="completed"?"bg-[#00A651] text-white":"bg-[#B45309] text-white"}`,style:{fontSize:10,fontWeight:500},children:a.status.charAt(0).toUpperCase()+a.status.slice(1)})})]},i))})]})})]}),e.jsxs("div",{className:`rounded-xl border shadow-sm transition-all duration-500 overflow-hidden ${t?"bg-[#1a1a1a] border-white/5":"bg-white border-gray-200"}`,children:[e.jsx("div",{className:`card-hdr flex items-center justify-between border-b transition-all duration-500 ${t?"bg-[#202020] border-white/5":"bg-gray-50 border-gray-200"}`,children:e.jsxs("div",{children:[e.jsx("p",{className:`transition-colors ${t?"text-white":"text-gray-800"}`,style:{fontSize:13,fontWeight:600,margin:0},children:"Regional performance"}),e.jsx("p",{className:`mt-1 transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontSize:11,fontWeight:400,margin:"3px 0 0"},children:"Traffic breakdown by country"})]})}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full",style:{minWidth:280},children:[e.jsx("thead",{children:e.jsx("tr",{className:`border-b transition-all duration-500 ${t?"border-white/5":"border-gray-100"}`,children:["Country","Share","Progress"].map(a=>e.jsx("th",{className:`tbl-th text-left uppercase tracking-widest transition-colors ${t?"text-gray-500":"text-gray-400"}`,style:{fontWeight:500},children:a},a))})}),e.jsx("tbody",{className:`divide-y transition-all duration-500 ${t?"divide-white/5":"divide-gray-100"}`,children:L.map((a,i)=>e.jsxs("tr",{className:`transition-all duration-300 ${t?"hover:bg-[#202020]":"hover:bg-gray-50"}`,children:[e.jsx("td",{className:"tbl-td",children:e.jsx("p",{className:`uppercase tracking-wide transition-colors ${t?"text-white":"text-gray-800"} whitespace-nowrap`,style:{fontSize:11,fontWeight:500,margin:0},children:a.country})}),e.jsx("td",{className:"tbl-td",children:e.jsxs("p",{className:`transition-colors ${t?"text-gray-300":"text-gray-700"}`,style:{fontSize:12,fontWeight:600,margin:0},children:[a.percentage,"%"]})}),e.jsx("td",{className:"tbl-td",style:{minWidth:100},children:e.jsx("div",{style:{height:6,width:"100%",borderRadius:99,background:t?"rgba(255,255,255,0.08)":"#f3f4f6",overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${a.percentage}%`,background:"#800000",borderRadius:99,transition:"width .4s ease"}})})})]},i))})]})})]})]})]})]})}function Q(){return e.jsxs(e.Fragment,{children:[e.jsx(I,{portalLabel:"Admin",accent:"#800000"}),e.jsx(O,{})]})}export{Q as default};
