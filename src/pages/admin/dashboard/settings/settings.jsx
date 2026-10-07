
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import DashboardLoader, { Spinner, useInitialLoad } from "@/components/DashboardLoader";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
import AdminThemeGallery from "@/components/AdminThemeGallery";
import api from "@/lib/api/axios";
const getDepartmentName = (dept) => {
  const map = {
    1: "Compliance",
    2: "Innovation",
    3: "Marketing",
    4: "Recruitment",
    5: "Human Resources"
  };
  return map[dept] || "Unknown";
};
const getRoleName = (role) => {
  const map = { 1: "Main Administrator", 2: "Administrator" };
  return map[role] || "Unknown";
};
function EyeIcon({ open }) {
  return open ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg> : <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>;
}
function AdminSettings() {
  const router = useRouter();
  const { isdarkmode } = useDarkMode();
  const pageBg = "var(--admin-bg)";
  const cardBg = "var(--admin-surface)";
  const subtleBg = "var(--admin-bg-soft)";
  const borderColor = "var(--admin-border)";
  const textPrimary = "var(--admin-text)";
  const textMuted = "var(--admin-text-faint)";
  const inputBg = "var(--admin-bg-soft)";
  const [activetab, setactivetab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const initialLoading = useInitialLoad(loading);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [department, setDepartment] = useState(1);
  const [profilePicture, setProfilePicture] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const showToast = (msg, ok) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4e3);
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/me");
      setUserData(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setContactNumber(data.contactNumber || "");
      setDepartment(data.department || 1);
      setProfilePicture(data.profilePicture || "");
    } catch (err) {
      console.error("Error fetching user data:", err);
      showToast("Failed to load user data", false);
    } finally {
      setLoading(false);
    }
  };
  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      if (!userData) return;
      const updateData = { firstName, lastName, email, contactNumber, department };
      if (profilePicture) updateData.profilePicture = profilePicture;
      const { data: updatedUser } = await api.patch(`/users/${userData._id}`, updateData);
      setUserData(updatedUser);
      showToast("Profile updated successfully!", true);
    } catch (err) {
      console.error("Error updating profile:", err);
      const message = err.response?.data?.error || err.response?.data?.message || (err instanceof Error ? err.message : "Failed to update profile");
      showToast(message, false);
    } finally {
      setSaving(false);
    }
  };
  const handlePasswordChange = async () => {
    try {
      setPasswordError(null);
      setPasswordSuccess(null);
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError("All password fields are required");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }
      if (newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters long");
        return;
      }
      setSaving(true);
      const { data } = await api.post("/users/change-password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(data.message || "Password changed successfully!");
      showToast(data.message || "Password changed successfully!", true);
    } catch (err) {
      console.error("Error changing password:", err);
      const message = err.response?.data?.message || err.response?.data?.error || "Failed to change password. Please try again.";
      setPasswordError(message);
    } finally {
      setSaving(false);
    }
  };
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const getInitials = () => {
    if (!firstName && !lastName) return "?";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  const pwStrength = (p) => {
    if (!p) return 0;
    if (p.length < 6) return 1;
    if (p.length < 8) return 2;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) return 4;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return 3;
    return 2;
  };
  const strength = pwStrength(newPassword);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "#dc2626", "#B45309", "#0066CC", "#00A651"];
  const inp = (extra = {}) => ({
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: `1.5px solid ${borderColor}`,
    background: inputBg,
    color: textPrimary,
    fontSize: 12,
    fontWeight: 400,
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: 0,
    transition: "border-color .15s",
    ...extra
  });
  const navItems = [
    {
      id: "profile",
      label: "Profile Information",
      desc: "Name, email & department",
      icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
    },
    {
      id: "security",
      label: "Security Settings",
      desc: "Change your password",
      icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    },
    {
      id: "appearance",
      label: "Appearance",
      desc: "Dashboard theme",
      icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    }
  ];
  if (initialLoading) return <DashboardLoader isVisible message="Loading settings…" />;
  return <>
      <style>{`
        *, *::before, *::after { font-family: var(--font-body) !important; letter-spacing: 0 !important; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        input, textarea, select, option, button { font-family: var(--font-body) !important; letter-spacing: 0 !important; }
        input:focus, textarea:focus, select:focus { border-color: var(--admin-accent) !important; outline: none !important; box-shadow: none !important; }
        .as-nav:hover  { background: ${"var(--admin-bg-soft)"} !important; }
        .as-ghost:hover { background: ${"var(--admin-bg-hover)"} !important; }
        .as-upload:hover { opacity: 0.82; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: pageBg, padding: "32px", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

          {
    /* â”€â”€ Toast â”€â”€ */
  }
          {toast && <div style={{
    position: "fixed",
    top: 28,
    right: 28,
    zIndex: 999,
    background: toast.ok ? "#00A651" : "#dc2626",
    color: "#fff",
    padding: "13px 22px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
    display: "flex",
    alignItems: "center",
    gap: 8
  }}>
              {toast.ok ? <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg> : <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" /></svg>}
              {toast.msg}
            </div>}

          {
    /* â”€â”€ Page header â”€â”€ */
  }
          <PageHeader title="Admin Settings" subtitle="Configure your administrator account and security preferences." style={{ marginBottom: 4 }} />

          {
    /* â”€â”€ Profile summary banner â”€â”€ */
  }
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, padding: "20px 26px", boxShadow: "var(--admin-shadow-sm)", display: "flex", alignItems: "center", gap: 18 }}>
            {
    /* Avatar */
  }
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
    width: 58,
    height: 58,
    borderRadius: "50%",
    background: "var(--admin-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
    overflow: "hidden",
    border: `3px solid ${borderColor}`
  }}>
                {profilePicture ? <img src={profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials()}
              </div>
              <label htmlFor="avatar-top" style={{
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "var(--admin-accent)",
    color: "#fff",
    border: `2px solid ${cardBg}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  }}>
                <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </label>
              <input id="avatar-top" type="file" accept="image/*" onChange={handleProfilePictureUpload} style={{ display: "none" }} />
            </div>

            {
    /* Info */
  }
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: textPrimary, margin: 0 }}>
                {firstName || lastName ? `${firstName} ${lastName}`.trim() : "Administrator"}
              </p>
              <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {email || "\u2014"}
              </p>
            </div>

            {
    /* Role + Dept badges */
  }
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {userData && <>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 500, background: "color-mix(in srgb, var(--admin-accent) 8%, transparent)", color: "var(--admin-accent)", border: "1px solid color-mix(in srgb, var(--admin-accent) 13%, transparent)" }}>
                    {getRoleName(userData.role)}
                  </span>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 500, background: subtleBg, color: textMuted, border: `1px solid ${borderColor}` }}>
                    {getDepartmentName(userData.department)}
                  </span>
                </>}
            </div>
          </div>

          {
    /* â”€â”€ Two-col layout â”€â”€ */
  }
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, alignItems: "start" }}>

            {
    /* â”€â”€ Sidebar â”€â”€ */
  }
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: "hidden", boxShadow: "var(--admin-shadow-sm)" }}>
              {
    /* Sidebar header */
  }
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${borderColor}`, background: subtleBg }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: 0 }}>Navigation</p>
              </div>

              {
    /* Nav rows */
  }
              <div style={{ padding: "8px" }}>
                {navItems.map((item) => {
    const isActive = activetab === item.id;
    return <button
      key={item.id}
      className={isActive ? "" : "as-nav"}
      onClick={() => {
        setactivetab(item.id);
        setPasswordError(null);
        setPasswordSuccess(null);
      }}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 12,
        border: "none",
        background: isActive ? "var(--admin-accent)" : "transparent",
        color: isActive ? "#fff" : textMuted,
        cursor: "pointer",
        transition: "all .15s",
        textAlign: "left",
        marginBottom: 2
      }}
    >
                      <div style={{
      width: 30,
      height: 30,
      borderRadius: 9,
      flexShrink: 0,
      background: isActive ? "rgba(255,255,255,0.18)" : subtleBg,
      border: `1px solid ${isActive ? "rgba(255,255,255,0.18)" : borderColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: isActive ? "#fff" : textMuted
    }}>
                        {item.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 500, color: isActive ? "#fff" : textPrimary, margin: 0 }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: 10, color: isActive ? "rgba(255,255,255,0.65)" : textMuted, margin: "1px 0 0", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.desc}
                        </p>
                      </div>
                    </button>;
  })}
              </div>

              {
    /* Security note */
  }
              <div style={{ padding: "12px 18px", borderTop: `1px solid ${borderColor}`, background: subtleBg }}>
                <div style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <svg style={{ flexShrink: 0, color: textMuted, marginTop: 1 }} width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                  </svg>
                  <p style={{ fontSize: 10, color: textMuted, margin: 0, lineHeight: 1.5, fontWeight: 400 }}>
                    All changes are logged for security auditing.
                  </p>
                </div>
              </div>
            </div>

            {
    /* â”€â”€ Main panel â”€â”€ */
  }
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: "hidden", boxShadow: "var(--admin-shadow-sm)" }}>

              {
    /* Panel header */
  }
              <div style={{ padding: "16px 26px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: subtleBg }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0 }}>
                    {navItems.find((n) => n.id === activetab)?.label}
                  </p>
                  <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0", fontWeight: 400 }}>
                    {activetab === "profile" ? "Update your personal details and photo" : activetab === "security" ? "Manage your account password" : "Choose how your dashboard looks"}
                  </p>
                </div>
                <div style={{
    width: 32,
    height: 32,
    borderRadius: 9,
    background: "color-mix(in srgb, var(--admin-accent) 8%, transparent)",
    border: "1px solid color-mix(in srgb, var(--admin-accent) 12%, transparent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--admin-accent)"
  }}>
                  {navItems.find((n) => n.id === activetab)?.icon}
                </div>
              </div>

              {
    /* â•â•â•â•â•â•â•â•â•â•â•â• PROFILE TAB â•â•â•â•â•â•â•â•â•â•â•â• */
  }
              {activetab === "profile" && <div style={{ padding: "26px 28px" }}>

                  {
    /* Photo upload row */
  }
                  <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: "18px 22px", marginBottom: 26, display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{
    width: 68,
    height: 68,
    borderRadius: "50%",
    flexShrink: 0,
    background: "var(--admin-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 22,
    fontWeight: 700,
    overflow: "hidden",
    border: `3px solid ${borderColor}`
  }}>
                      {profilePicture ? <img src={profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: "0 0 3px" }}>Profile Photo</p>
                      <p style={{ fontSize: 10, color: textMuted, margin: "0 0 12px", fontWeight: 400 }}>
                        Recommended 400Ã—400px. JPG or PNG format.
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <label htmlFor="profile-upload" className="as-upload" style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 16px",
    borderRadius: 10,
    background: "var(--admin-accent)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    transition: "opacity .15s"
  }}>
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                          </svg>
                          Upload New Photo
                        </label>
                        <input id="profile-upload" type="file" accept="image/*" onChange={handleProfilePictureUpload} style={{ display: "none" }} />
                        <button
    className="as-ghost"
    onClick={() => setProfilePicture("")}
    style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 11, fontWeight: 400, cursor: "pointer", transition: "all .15s" }}
  >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {
    /* Form grid */
  }
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

                    {
    /* First Name */
  }
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 7px", textTransform: "uppercase" }}>First Name</p>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" style={inp()} />
                    </div>

                    {
    /* Last Name */
  }
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 7px", textTransform: "uppercase" }}>Last Name</p>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" style={inp()} />
                    </div>

                    {
    /* Admin Email */
  }
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 7px", textTransform: "uppercase" }}>Admin Email</p>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" style={inp()} />
                    </div>

                    {
    /* Contact Number */
  }
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 7px", textTransform: "uppercase" }}>Contact Number</p>
                      <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Enter contact number" style={inp()} />
                    </div>

                    {
    /* Department */
  }
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 7px", textTransform: "uppercase" }}>Department</p>
                      <select value={department} onChange={(e) => setDepartment(Number(e.target.value))} style={inp({ cursor: "pointer" })}>
                        <option value={1}>Compliance</option>
                        <option value={2}>Innovation</option>
                        <option value={3}>Marketing</option>
                        <option value={4}>Recruitment</option>
                        <option value={5}>Human Resources</option>
                      </select>
                    </div>

                    {
    /* Assigned Role (read-only) */
  }
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 7px", textTransform: "uppercase" }}>Assigned Role</p>
                      <div style={{ ...inp(), display: "flex", alignItems: "center", gap: 8, background: "var(--admin-bg-hover)", cursor: "default" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--admin-accent)", flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "var(--admin-accent)", fontWeight: 500 }}>
                          {userData ? getRoleName(userData.role) : "\u2014"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {
    /* Save footer */
  }
                  <div style={{ marginTop: 26, paddingTop: 18, borderTop: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400 }}>
                      Changes take effect immediately after saving.
                    </p>
                    <button
    onClick={handleProfileUpdate}
    disabled={saving}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "10px 24px",
      borderRadius: 12,
      border: "none",
      background: "var(--admin-accent)",
      color: "#fff",
      fontSize: 12,
      fontWeight: 500,
      cursor: saving ? "not-allowed" : "pointer",
      opacity: saving ? 0.7 : 1,
      transition: "all .15s",
      boxShadow: "0 4px 14px color-mix(in srgb, var(--admin-accent) 28%, transparent)"
    }}
  >
                      {saving ? <>
                          <Spinner size={12} />
                          Saving...
                        </> : <>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg>
                          Save Admin Changes
                        </>}
                    </button>
                  </div>
                </div>}

              {
    /* â•â•â•â•â•â•â•â•â•â•â•â• SECURITY TAB â•â•â•â•â•â•â•â•â•â•â•â• */
  }
              {activetab === "security" && <div style={{ padding: "26px 28px" }}>

                  {
    /* Error banner */
  }
                  {passwordError && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderRadius: 12, background: isdarkmode ? "rgba(220,38,38,0.1)" : "#fef2f2", border: "1px solid rgba(220,38,38,0.2)", marginBottom: 20 }}>
                      <svg width="13" height="13" fill="none" stroke="#dc2626" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" /></svg>
                      <p style={{ fontSize: 12, color: "#dc2626", margin: 0, fontWeight: 400 }}>{passwordError}</p>
                    </div>}

                  {
    /* Success banner */
  }
                  {passwordSuccess && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderRadius: 12, background: isdarkmode ? "rgba(0,166,81,0.1)" : "#f0fdf4", border: "1px solid rgba(0,166,81,0.2)", marginBottom: 20 }}>
                      <svg width="13" height="13" fill="none" stroke="#00A651" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg>
                      <p style={{ fontSize: 12, color: "#00A651", margin: 0, fontWeight: 400 }}>{passwordSuccess}</p>
                    </div>}

                  {
    /* Info card */
  }
                  <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "#0066CC14", border: "1px solid #0066CC20", display: "flex", alignItems: "center", justifyContent: "center", color: "#0066CC", flexShrink: 0 }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0 }}>Password Requirements</p>
                      <p style={{ fontSize: 10, color: textMuted, margin: "2px 0 0", fontWeight: 400 }}>
                        Minimum 8 characters. Mix of letters, numbers & symbols recommended.
                      </p>
                    </div>
                  </div>

                  {
    /* Password fields */
  }
                  <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 460 }}>

                    {
    /* Current password */
  }
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 7px", textTransform: "uppercase" }}>Current Password</p>
                      <div style={{ position: "relative" }}>
                        <input
    type={showCurrent ? "text" : "password"}
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    placeholder="Enter current password"
    style={inp({ paddingRight: 42 })}
  />
                        <button onClick={() => setShowCurrent(!showCurrent)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: textMuted, display: "flex", padding: 0 }}>
                          <EyeIcon open={showCurrent} />
                        </button>
                      </div>
                    </div>

                    {
    /* New password */
  }
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 7px", textTransform: "uppercase" }}>New Secure Password</p>
                      <div style={{ position: "relative" }}>
                        <input
    type={showNew ? "text" : "password"}
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    placeholder="Enter new password"
    style={inp({ paddingRight: 42 })}
  />
                        <button onClick={() => setShowNew(!showNew)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: textMuted, display: "flex", padding: 0 }}>
                          <EyeIcon open={showNew} />
                        </button>
                      </div>
                      {
    /* Strength indicator */
  }
                      {newPassword && <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center" }}>
                          {[1, 2, 3, 4].map((lvl) => <div key={lvl} style={{ height: 3, flex: 1, borderRadius: 2, transition: "all .25s", background: lvl <= strength ? strengthColors[strength] : borderColor }} />)}
                          <span style={{ fontSize: 10, color: strengthColors[strength] || textMuted, marginLeft: 4, whiteSpace: "nowrap", fontWeight: 500 }}>
                            {strengthLabels[strength]}
                          </span>
                        </div>}
                    </div>

                    {
    /* Confirm password */
  }
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 7px", textTransform: "uppercase" }}>Confirm New Password</p>
                      <div style={{ position: "relative" }}>
                        <input
    type={showConfirm ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Confirm new password"
    style={inp({ paddingRight: 42, borderColor: confirmPassword && confirmPassword !== newPassword ? "#dc2626" : void 0 })}
  />
                        <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: textMuted, display: "flex", padding: 0 }}>
                          <EyeIcon open={showConfirm} />
                        </button>
                      </div>
                      {confirmPassword && confirmPassword !== newPassword && <p style={{ fontSize: 10, color: "#dc2626", margin: "5px 0 0", fontWeight: 400, display: "flex", alignItems: "center", gap: 4 }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" /></svg>
                          Passwords do not match
                        </p>}
                    </div>
                  </div>

                  {
    /* Save footer */
  }
                  <div style={{ marginTop: 26, paddingTop: 18, borderTop: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400 }}>
                      You will remain logged in after changing your password.
                    </p>
                    <button
    onClick={handlePasswordChange}
    disabled={saving}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "10px 24px",
      borderRadius: 12,
      border: "none",
      background: "var(--admin-accent)",
      color: "#fff",
      fontSize: 12,
      fontWeight: 500,
      cursor: saving ? "not-allowed" : "pointer",
      opacity: saving ? 0.7 : 1,
      transition: "all .15s",
      boxShadow: "0 4px 14px color-mix(in srgb, var(--admin-accent) 28%, transparent)"
    }}
  >
                      {saving ? <>
                          <Spinner size={12} />
                          Updating...
                        </> : <>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                          Update Security
                        </>}
                    </button>
                  </div>
                </div>}

              {
    /* ═══════════ APPEARANCE TAB ═══════════ */
  }
              {activetab === "appearance" && <div style={{ padding: "26px 28px" }}>

                  {
    /* Info card */
  }
                  <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "color-mix(in srgb, var(--admin-accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--admin-accent) 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-accent-text)", flexShrink: 0 }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0 }}>Dashboard Theme</p>
                      <p style={{ fontSize: 10, color: textMuted, margin: "2px 0 0", fontWeight: 400 }}>
                        Applies instantly and is saved to your account. Only you see this change.
                      </p>
                    </div>
                  </div>

                  <AdminThemeGallery />
                </div>}

            </div>
          </div>

        </div>
      </div>
    </>;
}
export {
  AdminSettings as default
};
