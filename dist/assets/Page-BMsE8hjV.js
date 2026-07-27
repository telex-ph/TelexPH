import{j as e}from"./charts-CZnqqKLy.js";import{r as i}from"./react-D15L_eJl.js";function W(n){return n<640?"mobile":n<1024?"tablet":"desktop"}function a({d:n,d2:o,size:l=16,sw:d=1.4}){return e.jsxs("svg",{width:l,height:l,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:d,strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:n}),o&&e.jsx("path",{d:o})]})}const V=`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }

  .tab-btn {
    padding: 7px 16px; border-radius: 7px; border: none; font-size: 13px;
    font-weight: 600; cursor: pointer; background: transparent; color: #555;
    transition: all 0.18s; font-family: 'Poppins', sans-serif;
  }
  .tab-btn.active { background: #fff; color: #800000; box-shadow: 0 1px 4px rgba(0,0,0,0.13); }
  .tab-btn:hover:not(.active) { color: #800000; }

  .settings-card {
    background: #fff;
    border-radius: 14px;
    border: 1.5px solid #e0dcdc;
    margin-bottom: 16px;
    overflow: hidden;
  }
  .settings-card-header {
    padding: 16px 22px 12px;
    border-bottom: 1px solid #f0ecec;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .settings-card-body { padding: 20px 22px; }

  .field-row { display: flex; flex-wrap: wrap; gap: 12px; }

  .field-wrap { display: flex; flex-direction: column; gap: 5px; }
  .field-wrap label {
    font-size: 11px; color: #555; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .field-input {
    width: 100%; padding: 9px 12px; font-size: 13px;
    border: 1.5px solid #e0dcdc; border-radius: 9px; outline: none;
    background: #fafafa; color: #1a1a2e; font-family: 'Poppins', sans-serif;
    font-weight: 400; transition: border-color 0.15s, background 0.15s;
  }
  .field-input:focus { border-color: #800000; background: #fff; }

  .save-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 20px; border: none; border-radius: 9px;
    font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: 'Poppins', sans-serif; letter-spacing: 0.02em;
    transition: opacity 0.2s, background 0.3s;
  }
  .save-btn:hover { opacity: 0.88; }

  .pw-toggle {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #aaa;
    display: flex; padding: 0;
  }

  .avatar-upload-btn {
    position: absolute; bottom: 0; right: 0; width: 28px; height: 28px;
    border-radius: 50%; background: #800000; border: 2.5px solid #fff;
    color: #fff; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s;
  }
  .avatar-upload-btn:hover { background: #a02020; }

  .section-divider {
    display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
  }
  .section-divider span {
    font-size: 11px; color: #555; letter-spacing: 0.05em;
    font-weight: 700; text-transform: uppercase; white-space: nowrap;
  }
  .section-divider-line { flex: 1; height: 1px; background: #e8e4e4; }

  .danger-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 9px; border: 1.5px solid #dc2626;
    background: #fff5f5; color: #dc2626; font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: 'Poppins', sans-serif; transition: background 0.2s;
  }
  .danger-btn:hover { background: #fee2e2; }

  .notif-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid #f5f2f2;
  }
  .notif-row:last-child { border-bottom: none; }

  .toggle-track {
    width: 38px; height: 21px; border-radius: 99px; cursor: pointer;
    display: flex; align-items: center; padding: 3px;
    transition: background 0.2s; flex-shrink: 0;
  }
  .toggle-thumb {
    width: 15px; height: 15px; border-radius: 50%; background: #fff;
    transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
`;function f({label:n,value:o,onChange:l,type:d="text",flex:c}){const[x,h]=i.useState(!1),p=d==="password";return e.jsxs("div",{className:"field-wrap",style:{flex:c||"1 1 100%",minWidth:c?130:"unset"},children:[e.jsx("label",{children:n}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx("input",{className:"field-input",type:p&&!x?"password":"text",value:o,onChange:m=>l(m.target.value),style:{paddingRight:p?38:12}}),p&&e.jsx("button",{className:"pw-toggle",onClick:()=>h(!x),children:x?e.jsx(a,{d:"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",d2:"M1 1l22 22",size:14}):e.jsx(a,{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",d2:"M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",size:14})})]})]})}function X({on:n,onChange:o}){return e.jsx("div",{className:"toggle-track",style:{background:n?"#800000":"#d1cece"},onClick:()=>o(!n),children:e.jsx("div",{className:"toggle-thumb",style:{transform:n?"translateX(17px)":"translateX(0)"}})})}function j({onClick:n,saved:o}){return e.jsx("button",{className:"save-btn",onClick:n,style:{background:o?"#15803d":"linear-gradient(135deg,#800000,#a82020)",color:"#fff"},children:o?e.jsxs(e.Fragment,{children:[e.jsx(a,{d:"M20 6L9 17l-5-5",size:14})," Saved!"]}):e.jsxs(e.Fragment,{children:[e.jsx(a,{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z",d2:"M17 21v-8H7v8M7 3v5h8",size:14})," Save Changes"]})})}const Y="https://telexph-admin.onrender.com/api";function _(){const n=i.useRef(null),[o,l]=i.useState(null);i.useEffect(()=>{const t=n.current;if(!t)return;l(W(t.getBoundingClientRect().width));const r=new ResizeObserver(s=>l(W(s[0].contentRect.width)));return r.observe(t),()=>r.disconnect()},[]);const d=o==="mobile",[c,x]=i.useState("profile"),[h,p]=i.useState(!1),[m,w]=i.useState(null),k=i.useRef(null),[g,S]=i.useState(""),[y,z]=i.useState(""),[N,C]=i.useState(""),[L,P]=i.useState(""),[M,R]=i.useState(null),[I,T]=i.useState(""),[u,B]=i.useState(""),[b,E]=i.useState(""),[F,U]=i.useState({emailUpdates:!0,smsAlerts:!1,renewalReminders:!0,promotions:!1,securityAlerts:!0});i.useEffect(()=>{(async()=>{try{const r=await fetch(`${Y}/auth/client/me`,{method:"GET",credentials:"include"});if(r.ok){const s=await r.json();s.firstName&&S(s.firstName),s.lastName&&z(s.lastName),s.email&&C(s.email),s.contactNumber&&P(s.contactNumber),s.profilePicture&&R(s.profilePicture)}}catch(r){console.error("Failed to fetch profile:",r)}})()},[]);const H=t=>{w(t),setTimeout(()=>w(null),3e3)},v=()=>{p(!0),H("Your changes have been saved successfully!"),setTimeout(()=>p(!1),2500)},D=t=>{var A;const r=(A=t.target.files)==null?void 0:A[0];if(!r)return;const s=new FileReader;s.onload=()=>R(s.result),s.readAsDataURL(r)},G=g?g.charAt(0).toUpperCase():"?",$=g||y?`${g} ${y}`.trim():"Loading...",O=[{key:"emailUpdates",label:"Email Updates",sub:"Receive account updates via email"},{key:"smsAlerts",label:"SMS Alerts",sub:"Get text notifications on your phone"},{key:"renewalReminders",label:"Renewal Reminders",sub:"Be reminded before subscriptions expire"},{key:"promotions",label:"Promotions & Offers",sub:"Receive special deals and discounts"},{key:"securityAlerts",label:"Security Alerts",sub:"Get notified of suspicious activity"}];return e.jsxs("div",{ref:n,style:{fontFamily:"'Poppins',sans-serif",padding:d?12:24,background:"#fdfcfc",minHeight:"100vh",visibility:o===null?"hidden":"visible"},children:[e.jsx("style",{children:V}),m&&e.jsxs("div",{style:{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"#1a1a2e",color:"#fff",borderRadius:12,padding:"12px 22px",fontSize:13,fontWeight:600,zIndex:2e3,boxShadow:"0 8px 32px rgba(0,0,0,0.25)",display:"flex",alignItems:"center",gap:10,whiteSpace:"nowrap",letterSpacing:"0.01em"},children:[e.jsx(a,{d:"M20 6L9 17l-5-5",size:16}),m]}),e.jsxs("div",{style:{marginBottom:d?14:22},children:[e.jsx("p",{style:{fontSize:11,color:"#666",fontWeight:500,margin:"0 0 2px",letterSpacing:"0.06em",textTransform:"uppercase"},children:"Manage your account,"}),e.jsx("h1",{style:{fontSize:d?18:22,fontWeight:700,color:"#1a1a2e",margin:0,letterSpacing:"-0.02em"},children:"Account Settings"}),!d&&e.jsx("p",{style:{fontSize:13,color:"#555",fontWeight:400,margin:"3px 0 0"},children:"Update your profile and security preferences."})]}),e.jsx("div",{style:{display:"flex",gap:4,background:"#ede8e8",borderRadius:10,padding:4,marginBottom:20,width:"fit-content"},children:["profile","security","notifications"].map(t=>e.jsx("button",{className:`tab-btn ${c===t?"active":""}`,onClick:()=>x(t),children:t.charAt(0).toUpperCase()+t.slice(1)},t))}),c==="profile"&&e.jsxs("div",{children:[e.jsxs("div",{className:"settings-card",children:[e.jsxs("div",{className:"settings-card-header",children:[e.jsx("div",{style:{width:28,height:28,borderRadius:8,background:"#fff0f0",border:"1px solid #f0c8c8",display:"flex",alignItems:"center",justifyContent:"center",color:"#800000"},children:e.jsx(a,{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",d2:"M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",size:14,sw:1.8})}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#1a1a2e"},children:"Profile Photo"}),e.jsx("div",{style:{fontSize:11,color:"#555",fontWeight:400},children:"Click the camera icon to change your avatar"})]})]}),e.jsx("div",{className:"settings-card-body",children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:18},children:[e.jsxs("div",{style:{position:"relative",flexShrink:0},children:[e.jsx("div",{style:{width:76,height:76,borderRadius:"50%",background:"#800000",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,overflow:"hidden",border:"3px solid #f0eeee",boxShadow:"0 4px 16px rgba(128,0,0,0.25)"},children:M?e.jsx("img",{src:M,alt:"avatar",style:{width:"100%",height:"100%",objectFit:"cover"}}):G}),e.jsx("button",{className:"avatar-upload-btn",onClick:()=>{var t;return(t=k.current)==null?void 0:t.click()},children:e.jsx(a,{d:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z",d2:"M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",size:12})}),e.jsx("input",{ref:k,type:"file",accept:"image/*",style:{display:"none"},onChange:D})]}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:16,fontWeight:700,color:"#1a1a2e"},children:$}),e.jsx("div",{style:{fontSize:12,color:"#555",marginTop:3,fontWeight:400},children:N||"—"}),e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:5,marginTop:8,fontSize:11,fontWeight:600,color:"#15803d",background:"#dcfce7",borderRadius:6,padding:"3px 10px"},children:[e.jsx("span",{style:{width:5,height:5,borderRadius:"50%",background:"#16a34a"}}),"Active Account"]})]})]})})]}),e.jsxs("div",{className:"settings-card",children:[e.jsxs("div",{className:"settings-card-header",children:[e.jsx("div",{style:{width:28,height:28,borderRadius:8,background:"#fff0f0",border:"1px solid #f0c8c8",display:"flex",alignItems:"center",justifyContent:"center",color:"#800000"},children:e.jsx(a,{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",d2:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",size:14,sw:1.8})}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#1a1a2e"},children:"Personal Information"}),e.jsx("div",{style:{fontSize:11,color:"#555",fontWeight:400},children:"Update your name, email and contact details"})]})]}),e.jsx("div",{className:"settings-card-body",children:e.jsxs("div",{className:"field-row",children:[e.jsx(f,{label:"First Name",value:g,onChange:S,flex:"1 1 calc(50% - 6px)"}),e.jsx(f,{label:"Last Name",value:y,onChange:z,flex:"1 1 calc(50% - 6px)"}),e.jsx(f,{label:"Email Address",value:N,onChange:C}),e.jsx(f,{label:"Phone Number",value:L,onChange:P})]})})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:e.jsx(j,{onClick:v,saved:h})})]}),c==="security"&&e.jsxs("div",{children:[e.jsxs("div",{className:"settings-card",children:[e.jsxs("div",{className:"settings-card-header",children:[e.jsx("div",{style:{width:28,height:28,borderRadius:8,background:"#fff0f0",border:"1px solid #f0c8c8",display:"flex",alignItems:"center",justifyContent:"center",color:"#800000"},children:e.jsx(a,{d:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",size:14,sw:1.8})}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#1a1a2e"},children:"Change Password"}),e.jsx("div",{style:{fontSize:11,color:"#555",fontWeight:400},children:"Choose a strong password to keep your account safe"})]})]}),e.jsxs("div",{className:"settings-card-body",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsx(f,{label:"Current Password",value:I,onChange:T,type:"password"}),e.jsx(f,{label:"New Password",value:u,onChange:B,type:"password"}),e.jsx(f,{label:"Confirm Password",value:b,onChange:E,type:"password"})]}),u&&b&&u!==b&&e.jsxs("div",{style:{marginTop:12,fontSize:11,color:"#dc2626",fontWeight:600,display:"flex",alignItems:"center",gap:6,background:"#fff5f5",border:"1.5px solid #fecaca",borderRadius:8,padding:"8px 12px"},children:[e.jsx(a,{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",size:12,sw:2})," Passwords do not match."]}),u&&b&&u===b&&e.jsxs("div",{style:{marginTop:12,fontSize:11,color:"#15803d",fontWeight:600,display:"flex",alignItems:"center",gap:6,background:"#f0fdf4",border:"1.5px solid #bbf7d0",borderRadius:8,padding:"8px 12px"},children:[e.jsx(a,{d:"M20 6L9 17l-5-5",size:12,sw:2})," Passwords match!"]})]})]}),e.jsxs("div",{className:"settings-card",children:[e.jsxs("div",{className:"settings-card-header",children:[e.jsx("div",{style:{width:28,height:28,borderRadius:8,background:"#fff5f5",border:"1px solid #fecaca",display:"flex",alignItems:"center",justifyContent:"center",color:"#dc2626"},children:e.jsx(a,{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",size:14,sw:1.8})}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#dc2626"},children:"Danger Zone"}),e.jsx("div",{style:{fontSize:11,color:"#555",fontWeight:400},children:"Irreversible actions for your account"})]})]}),e.jsxs("div",{className:"settings-card-body",style:{display:"flex",flexWrap:"wrap",gap:10},children:[e.jsxs("button",{className:"danger-btn",children:[e.jsx(a,{d:"M18.36 6.64a9 9 0 1 1-12.73 0",d2:"M12 2v10",size:13,sw:2}),"Deactivate Account"]}),e.jsxs("button",{className:"danger-btn",children:[e.jsx(a,{d:"M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2",size:13,sw:2}),"Delete Account"]})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:e.jsx(j,{onClick:v,saved:h})})]}),c==="notifications"&&e.jsxs("div",{children:[e.jsxs("div",{className:"settings-card",children:[e.jsxs("div",{className:"settings-card-header",children:[e.jsx("div",{style:{width:28,height:28,borderRadius:8,background:"#fff0f0",border:"1px solid #f0c8c8",display:"flex",alignItems:"center",justifyContent:"center",color:"#800000"},children:e.jsx(a,{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",d2:"M13.73 21a2 2 0 0 1-3.46 0",size:14,sw:1.8})}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#1a1a2e"},children:"Notification Preferences"}),e.jsx("div",{style:{fontSize:11,color:"#555",fontWeight:400},children:"Choose what you want to be notified about"})]})]}),e.jsx("div",{className:"settings-card-body",style:{padding:"0 22px"},children:O.map(t=>e.jsxs("div",{className:"notif-row",children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:13,fontWeight:600,color:"#1a1a2e"},children:t.label}),e.jsx("div",{style:{fontSize:11,color:"#666",fontWeight:400,marginTop:2},children:t.sub})]}),e.jsx(X,{on:F[t.key],onChange:r=>U(s=>({...s,[t.key]:r}))})]},t.key))}),e.jsx("div",{style:{height:12}})]}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:e.jsx(j,{onClick:v,saved:h})})]})]})}function J(){return e.jsx(_,{})}export{J as default};
