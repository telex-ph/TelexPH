
import { useState, useRef } from "react";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
function AddAdmin() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const fileRef = useRef(null);
  const actualFileRef = useRef(null);
  const { isdarkmode } = useDarkMode();
  const pageBg = isdarkmode ? "#0f0f0f" : "#f8f9fa";
  const cardBg = isdarkmode ? "#1a1a1a" : "#ffffff";
  const subtleBg = isdarkmode ? "#202020" : "#f9fafb";
  const borderColor = isdarkmode ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const textPrimary = isdarkmode ? "#f0f0f0" : "#1f2937";
  const textMuted = isdarkmode ? "#6b7280" : "#6b7280";
  const inputBg = isdarkmode ? "#202020" : "#f9fafb";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const departments = [
    { id: 1, name: "Compliance", icon: "\u2696\uFE0F" },
    { id: 2, name: "Innovation", icon: "\u{1F4A1}" },
    { id: 3, name: "Marketing", icon: "\u{1F4E2}" },
    { id: 4, name: "Recruitment", icon: "\u{1F465}" },
    { id: 5, name: "Human Resources", icon: "\u{1F91D}" }
  ];
  const roles = [
    { id: 1, name: "Main Administrator" },
    { id: 2, name: "Administrator" }
  ];
  const tabs = [
    {
      label: "Personal Info",
      icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    },
    {
      label: "Role & Dept",
      icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    },
    {
      label: "Security",
      icon: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    }
  ];
  const inp = (extra = {}) => ({
    padding: "10px 14px",
    borderRadius: 12,
    border: `1.5px solid ${borderColor}`,
    background: inputBg,
    color: textPrimary,
    fontSize: 12,
    fontWeight: 400,
    outline: "none",
    width: "100%",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: 0,
    transition: "border-color .15s",
    ...extra
  });
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.");
      setShowErrorModal(true);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    actualFileRef.current = file;
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = maxWidth / width * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setSelectedImage(canvas.toDataURL("image/jpeg", 0.7));
          setIsCompressing(false);
        }
      };
    };
    reader.readAsDataURL(file);
  };
  const triggerBrowse = () => fileRef.current?.click();
  const isFormValid = () => firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "" && contactNumber.trim() !== "" && department !== "" && role !== "" && password.trim() !== "" && confirmPassword.trim() !== "" && password === confirmPassword;
  const handleFinalConfirm = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setShowConfirmModal(false);
      setShowErrorModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        contactNumber: contactNumber.trim(),
        department: Number(department),
        role: Number(role),
        password
      };
      if (selectedImage) payload.profilePicture = selectedImage;
      const API_BASE_URL = "https://telexph-admin.onrender.com/api";
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create admin");
      }
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setContactNumber("");
      setDepartment("");
      setRole("");
      setPassword("");
      setConfirmPassword("");
      setSelectedImage(null);
      actualFileRef.current = null;
      if (fileRef.current) fileRef.current.value = "";
      setActiveTab(0);
    } catch (error) {
      setErrorMessage(error.message || "Failed to create admin. Please try again.");
      setShowConfirmModal(false);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <>
      {
    /* â”€â”€ Global styles â”€â”€ */
  }
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        input, textarea, select, option, button { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; }
        input:focus, textarea:focus, select:focus { border-color: #800000 !important; outline: none !important; box-shadow: none !important; }
        .aa-pill:hover   { opacity: .78; }
        .aa-row:hover    { background: ${isdarkmode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"} !important; }
        .upload-zone:hover { border-color: #800000 !important; background: rgba(128,0,0,0.03) !important; }
        .aa-tab:hover    { background: ${isdarkmode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"} !important; }
        @keyframes spin  { to { transform: rotate(360deg) } }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }

        /* \u2500\u2500 Responsive: outer layout \u2500\u2500 */
        .aa-outer-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 20px;
          align-items: start;
        }

        /* \u2500\u2500 Responsive: two-column field rows \u2500\u2500 */
        .aa-2col       { display: grid; grid-template-columns: 1fr 1fr; }
        .aa-2col-head  { display: grid; grid-template-columns: 1fr 1fr; background: ${subtleBg}; border-bottom: 1px solid ${borderColor}; }
        .aa-cell-r     { border-left: 1px solid ${borderColor}; }
        .aa-hcell-r    { border-left: 1px solid ${borderColor}; }

        /* \u2500\u2500 Footer \u2500\u2500 */
        .aa-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          padding: 14px 24px;
          background: ${subtleBg};
          border-top: 1px solid ${borderColor};
        }

        /* \u2500\u2500 Tab label: hidden on very small screens \u2500\u2500 */
        .aa-tab-label { display: inline; }

        /* \u2550\u2550\u2550\u2550 Tablet \u2264 768px \u2550\u2550\u2550\u2550 */
        @media (max-width: 768px) {
          .aa-outer-grid {
            grid-template-columns: 1fr !important;
          }
          .aa-2col {
            grid-template-columns: 1fr !important;
          }
          .aa-2col-head {
            grid-template-columns: 1fr !important;
          }
          .aa-cell-r  { border-left: none !important; border-top: 1px solid ${borderColor}; }
          .aa-hcell-r { display: none; }
        }

        /* \u2550\u2550\u2550\u2550 Mobile \u2264 480px \u2550\u2550\u2550\u2550 */
        @media (max-width: 480px) {
          .aa-page-pad { padding: 16px !important; }
          .aa-tab-label { display: none; }
          .aa-tab-btn {
            padding: 12px !important;
            flex: 1;
            justify-content: center;
          }
          .aa-footer {
            flex-direction: column;
            align-items: stretch !important;
          }
          .aa-footer-note { text-align: center; }
          .aa-submit-btn  { width: 100%; justify-content: center !important; }
          .aa-modal-pad   { padding: 24px 18px !important; }
          .aa-modal-btns  { flex-direction: column !important; }
          .aa-modal-btns button { width: 100% !important; justify-content: center; }
        }
      `}</style>

      <div className="aa-page-pad" style={{ minHeight: "100vh", background: pageBg, padding: "32px", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

          {
    /* â”€â”€ Page header â”€â”€ */
  }
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0 }}>
              Add New Administrator
            </h2>
            <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400 }}>
              Create a new administrator account and assign their role and department.
            </p>
          </div>

          {
    /* â”€â”€ Outer grid â”€â”€ */
  }
          <div className="aa-outer-grid">

            {
    /* â•â• LEFT: Profile Picture â•â• */
  }
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: "hidden", boxShadow: isdarkmode ? "none" : "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ padding: "18px 24px", borderBottom: `1px solid ${borderColor}` }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0 }}>Profile Picture</p>
                <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400 }}>Optional â€” JPG, PNG, WEBP</p>
              </div>
              <div style={{ padding: "24px" }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} style={{ display: "none" }} />

                {selectedImage ? <div>
                    <img src={selectedImage} alt="Preview" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 14, marginBottom: 14, display: "block" }} />
                    <button
    onClick={() => {
      setSelectedImage(null);
      actualFileRef.current = null;
      if (fileRef.current) fileRef.current.value = "";
    }}
    style={{ width: "100%", padding: "9px", borderRadius: 10, border: `1.5px solid ${isdarkmode ? "rgba(220,38,38,0.3)" : "rgba(220,38,38,0.22)"}`, background: isdarkmode ? "rgba(220,38,38,0.08)" : "rgba(220,38,38,0.04)", color: "#dc2626", fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all .15s" }}
  >
                      Remove Image
                    </button>
                  </div> : <div
    className="upload-zone"
    onClick={triggerBrowse}
    style={{ border: `2px dashed ${isdarkmode ? "rgba(255,255,255,0.12)" : "#d1d5db"}`, borderRadius: 14, padding: "44px 20px", textAlign: "center", cursor: "pointer", transition: "all .15s" }}
  >
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: isdarkmode ? "rgba(255,255,255,0.06)" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                      <svg width="22" height="22" fill="none" stroke={textMuted} strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: "0 0 4px" }}>Click to upload</p>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>JPG, JPEG, PNG or WEBP</p>
                  </div>}

                {isCompressing && <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "9px 14px", borderRadius: 10, background: subtleBg }}>
                    <svg width="13" height="13" fill="none" stroke={textMuted} strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: "spin .8s linear infinite", flexShrink: 0 }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>Compressing image...</p>
                  </div>}
              </div>
            </div>

            {
    /* â•â• RIGHT: Tabbed card â•â• */
  }
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: "hidden", boxShadow: isdarkmode ? "none" : "0 2px 12px rgba(0,0,0,0.05)" }}>

              {
    /* â”€â”€ Tab bar â”€â”€ */
  }
              <div style={{ display: "flex", borderBottom: `1px solid ${borderColor}`, background: subtleBg }}>
                {tabs.map((tab, idx) => <button
    key={idx}
    className="aa-tab aa-tab-btn"
    onClick={() => setActiveTab(idx)}
    style={{
      padding: "13px 22px",
      fontSize: 11,
      fontWeight: activeTab === idx ? 500 : 400,
      color: activeTab === idx ? "#800000" : textMuted,
      cursor: "pointer",
      border: "none",
      borderBottom: activeTab === idx ? "2px solid #800000" : "2px solid transparent",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      gap: 7,
      transition: "all .15s"
    }}
  >
                    {tab.icon}
                    <span className="aa-tab-label">{tab.label}</span>
                  </button>)}
              </div>

              {
    /* â•â• TAB 0: Personal Information â•â• */
  }
              {activeTab === 0 && <>
                  <div className="aa-2col-head">
                    <div style={{ padding: "10px 24px" }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }}>First Name</span>
                    </div>
                    <div className="aa-hcell-r" style={{ padding: "10px 24px" }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }}>Last Name</span>
                    </div>
                  </div>
                  <div className="aa-row aa-2col" style={{ borderBottom: `1px solid ${borderColor}`, transition: "background .15s" }}>
                    <div style={{ padding: "16px 24px" }}>
                      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="Enter first name..." style={inp()} />
                    </div>
                    <div className="aa-cell-r" style={{ padding: "16px 24px" }}>
                      <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Enter last name..." style={inp()} />
                    </div>
                  </div>

                  {
    /* Last Name label on mobile (shown via stacking) */
  }
                  <div style={{ padding: "10px 24px", background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }}>Email Address</span>
                  </div>
                  <div className="aa-row" style={{ padding: "16px 24px", borderBottom: `1px solid ${borderColor}`, transition: "background .15s" }}>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email address..." style={inp()} />
                  </div>

                  <div style={{ padding: "10px 24px", background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }}>Contact Number</span>
                  </div>
                  <div className="aa-row" style={{ padding: "16px 24px", transition: "background .15s" }}>
                    <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} type="text" placeholder="Enter contact number..." style={inp()} />
                  </div>
                </>}

              {
    /* â•â• TAB 1: Role & Department â•â• */
  }
              {activeTab === 1 && <>
                  <div style={{ padding: "18px 24px", borderBottom: `1px solid ${borderColor}` }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: "0 0 10px" }}>Select Department</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {departments.map((dept) => {
    const sel = department === dept.id;
    return <button
      key={dept.id}
      className="aa-pill"
      onClick={() => setDepartment(dept.id)}
      style={{
        padding: "5px 14px",
        borderRadius: 8,
        border: sel ? "none" : `1px solid ${borderColor}`,
        background: sel ? "#800000" : subtleBg,
        color: sel ? "#fff" : textMuted,
        fontSize: 11,
        fontWeight: sel ? 500 : 400,
        cursor: "pointer",
        transition: "all .15s",
        boxShadow: sel ? "0 2px 8px rgba(128,0,0,0.3)" : "none"
      }}
    >
                            {dept.icon} {dept.name}
                          </button>;
  })}
                    </div>
                  </div>
                  <div style={{ padding: "18px 24px" }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: "0 0 10px" }}>Select Role</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {roles.map((r) => {
    const sel = role === r.id;
    return <button
      key={r.id}
      className="aa-pill"
      onClick={() => setRole(r.id)}
      style={{
        padding: "5px 14px",
        borderRadius: 8,
        border: sel ? "none" : `1px solid ${borderColor}`,
        background: sel ? "#800000" : subtleBg,
        color: sel ? "#fff" : textMuted,
        fontSize: 11,
        fontWeight: sel ? 500 : 400,
        cursor: "pointer",
        transition: "all .15s",
        boxShadow: sel ? "0 2px 8px rgba(128,0,0,0.3)" : "none"
      }}
    >
                            {r.name}
                          </button>;
  })}
                    </div>
                  </div>
                </>}

              {
    /* â•â• TAB 2: Security â•â• */
  }
              {activeTab === 2 && <>
                  <div className="aa-2col-head">
                    <div style={{ padding: "10px 24px" }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }}>Password</span>
                    </div>
                    <div className="aa-hcell-r" style={{ padding: "10px 24px" }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }}>Confirm Password</span>
                    </div>
                  </div>
                  <div className="aa-row aa-2col" style={{ borderBottom: `1px solid ${borderColor}`, transition: "background .15s" }}>
                    <div style={{ padding: "16px 24px" }}>
                      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password..." style={inp()} />
                    </div>
                    <div className="aa-cell-r" style={{ padding: "16px 24px" }}>
                      <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm password..." style={inp()} />
                    </div>
                  </div>

                  {password && confirmPassword && <div style={{ padding: "12px 24px" }}>
                      {password !== confirmPassword ? <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10, background: isdarkmode ? "rgba(220,38,38,0.08)" : "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.18)" }}>
                          <svg width="12" height="12" fill="none" stroke="#dc2626" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                          <p style={{ fontSize: 11, color: "#dc2626", margin: 0 }}>Passwords do not match</p>
                        </div> : <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10, background: isdarkmode ? "rgba(5,150,105,0.08)" : "rgba(5,150,105,0.05)", border: "1px solid rgba(5,150,105,0.18)" }}>
                          <svg width="12" height="12" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                          <p style={{ fontSize: 11, color: "#059669", margin: 0 }}>Passwords match</p>
                        </div>}
                    </div>}
                </>}

              {
    /* â”€â”€ Footer â€” always visible â”€â”€ */
  }
              <div className="aa-footer">
                <p className="aa-footer-note" style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontStyle: "italic" }}>
                  Review your entry before finalizing.
                </p>
                <button
    className="aa-submit-btn"
    onClick={() => setShowConfirmModal(true)}
    disabled={!isFormValid() || isSubmitting}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "7px 20px",
      borderRadius: 10,
      border: isFormValid() && !isSubmitting ? "none" : `1px solid ${borderColor}`,
      background: isFormValid() && !isSubmitting ? "#800000" : isdarkmode ? "rgba(255,255,255,0.06)" : "#f9fafb",
      color: isFormValid() && !isSubmitting ? "#fff" : textMuted,
      fontSize: 11,
      fontWeight: 500,
      cursor: isFormValid() && !isSubmitting ? "pointer" : "not-allowed",
      boxShadow: isFormValid() && !isSubmitting ? "0 2px 8px rgba(128,0,0,0.3)" : "none",
      transition: "all .15s"
    }}
  >
                  {isSubmitting ? <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: "spin .8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Creating...</> : <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Create Administrator</>}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {
    /* â•â• Confirm Modal â•â• */
  }
      {showConfirmModal && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: "100%", maxWidth: 500, boxShadow: "0 32px 80px rgba(0,0,0,0.32)", overflow: "hidden" }}>
            <div className="aa-modal-pad" style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0 }}>Confirm Creation</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400 }}>Are you ready to create this administrator account?</p>
                </div>
                <button onClick={() => setShowConfirmModal(false)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, marginBottom: 24, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", background: isdarkmode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)", borderBottom: `1px solid ${borderColor}` }}>
                  <div style={{ padding: "10px 18px", borderRight: `1px solid ${borderColor}` }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }}>Field</span>
                  </div>
                  <div style={{ padding: "10px 18px" }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }}>Value</span>
                  </div>
                </div>
                {[
    { label: "Name", val: `${firstName} ${lastName}` },
    { label: "Email", val: email },
    { label: "Contact", val: contactNumber },
    { label: "Department", val: departments.find((d) => d.id === department)?.name || "\u2014" },
    { label: "Role", val: roles.find((r) => r.id === role)?.name || "\u2014" }
  ].map(({ label, val }, idx, arr) => <div key={label} className="aa-row" style={{ display: "grid", gridTemplateColumns: "120px 1fr", borderBottom: idx < arr.length - 1 ? `1px solid ${borderColor}` : "none", transition: "background .15s" }}>
                    <div style={{ padding: "12px 18px", borderRight: `1px solid ${borderColor}` }}>
                      <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: 0 }}>{label}</p>
                    </div>
                    <div style={{ padding: "12px 18px" }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</p>
                    </div>
                  </div>)}
              </div>

              <div className="aa-modal-btns" style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
    onClick={() => setShowConfirmModal(false)}
    disabled={isSubmitting}
    style={{ padding: "11px 28px", borderRadius: 14, border: `1px solid ${borderColor}`, background: subtleBg, color: textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .15s" }}
  >
                  Cancel
                </button>
                <button
    onClick={handleFinalConfirm}
    disabled={isSubmitting}
    style={{ padding: "11px 32px", borderRadius: 14, border: "none", background: "#800000", color: "#fff", fontSize: 12, fontWeight: 500, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.75 : 1, transition: "all .15s", display: "flex", alignItems: "center", gap: 7 }}
  >
                  {isSubmitting ? <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: "spin .8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Creating...</> : "Confirm & Create"}
                </button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* â•â• Success Modal â•â• */
  }
      {showSuccessModal && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: "100%", maxWidth: 440, boxShadow: "0 32px 80px rgba(0,0,0,0.32)" }}>
            <div className="aa-modal-pad" style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0 }}>Account Created</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400 }}>Administrator account has been created successfully.</p>
                </div>
                <button onClick={() => setShowSuccessModal(false)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: "24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: isdarkmode ? "rgba(5,150,105,0.12)" : "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: "0 0 3px" }}>Success</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: 0 }}>The new admin can now log in with their credentials.</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => setShowSuccessModal(false)} style={{ padding: "11px 32px", borderRadius: 14, border: "none", background: "#800000", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .15s" }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* â•â• Error Modal â•â• */
  }
      {showErrorModal && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: "100%", maxWidth: 440, boxShadow: "0 32px 80px rgba(0,0,0,0.32)" }}>
            <div className="aa-modal-pad" style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0 }}>Something Went Wrong</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400 }}>Please review the error and try again.</p>
                </div>
                <button onClick={() => setShowErrorModal(false)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: "24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: isdarkmode ? "rgba(220,38,38,0.12)" : "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="#dc2626" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: "0 0 3px" }}>Error</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: 0, lineHeight: 1.6 }}>{errorMessage || "Something went wrong. Please try again."}</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => setShowErrorModal(false)} style={{ padding: "11px 32px", borderRadius: 14, border: "none", background: "#800000", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .15s" }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>}
    </>;
}
export {
  AddAdmin as default
};
