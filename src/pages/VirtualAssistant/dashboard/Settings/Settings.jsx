
import { useState } from "react";
const BG = "#E7E7E7";
const NEU_OUT = "0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)";
const NEU_IN = "inset 3px 3px 7px #CACAEC, inset -3px -3px 7px #fff";
const TXT = "#2a2a2a";
const SUB = "#888";
const PRIMARY = "#800000";
const Ico = ({ d, d2, size = 16, sw = 1.4 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>;
const inp = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid rgba(0,0,0,0.1)",
  borderRadius: 10,
  padding: "9px 13px",
  fontSize: 12,
  color: TXT,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box"
};
function Toggle({ on, onChange }) {
  return <div
    onClick={() => onChange(!on)}
    style={{ width: 42, height: 24, borderRadius: 99, background: on ? PRIMARY : "#ccc", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0, boxShadow: on ? "0 2px 6px rgba(128,0,0,0.35)" : "none" }}
  >
      <div style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </div>;
}
function SectionCard({ title, icon, children }) {
  return <div style={{ background: BG, borderRadius: 20, boxShadow: NEU_OUT, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: BG, boxShadow: NEU_IN, display: "flex", alignItems: "center", justifyContent: "center", color: PRIMARY, flexShrink: 0 }}>
          <Ico d={icon} size={15} sw={1.5} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: TXT }}>{title}</span>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>;
}
function FieldRow({ label, sub, children }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: TXT }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: SUB, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>;
}
function SaveBtn({ onClick, saving, saved }) {
  return <button
    onClick={onClick}
    disabled={saving}
    style={{ background: saved ? "#15803d" : PRIMARY, color: "#fff", border: "none", borderRadius: 12, padding: "10px 24px", fontSize: 12, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: saved ? "0 2px 8px rgba(21,128,61,0.3)" : "0 2px 8px rgba(128,0,0,0.3)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}
  >
      {saving ? "Saving\u2026" : saved ? "\u2713 Saved" : "Save Changes"}
    </button>;
}
function Settings() {
  const [firstName, setFirstName] = useState("Maria");
  const [lastName, setLastName] = useState("Santos");
  const [email, setEmail] = useState("maria.santos@email.com");
  const [phone, setPhone] = useState("+63 912 345 6789");
  const [savingAcct, setSavingAcct] = useState(false);
  const [savedAcct, setSavedAcct] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [savedPw, setSavedPw] = useState(false);
  const [notifMeeting, setNotifMeeting] = useState(true);
  const [notifAssess, setNotifAssess] = useState(true);
  const [notifRemind, setNotifRemind] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [savingNotif, setSavingNotif] = useState(false);
  const [savedNotif, setSavedNotif] = useState(false);
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Manila (UTC+8)");
  const [savingApp, setSavingApp] = useState(false);
  const [savedApp, setSavedApp] = useState(false);
  const save = (setSaving, setSaved) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 800);
  };
  const handleSavePw = () => {
    if (!currentPw || !newPw || !confirmPw) {
      setPwError("All password fields are required.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwError("");
    save(setSavingPw, setSavedPw);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };
  const selectStyle = {
    ...inp,
    appearance: "none",
    cursor: "pointer",
    paddingRight: 32,
    width: 220
  };
  return <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        input:focus, select:focus, textarea:focus { border-color: ${PRIMARY} !important; outline: none; }
        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16; }
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {
    /* Page Title */
  }
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: TXT }}>Settings</div>
        <div style={{ fontSize: 11.5, color: SUB, marginTop: 3 }}>Manage your account and preferences.</div>
      </div>

      <div className="settings-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {
    /* ── Account Information ── */
  }
        <SectionCard title="Account Information" icon="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: PRIMARY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TXT }}>{firstName} {lastName}</div>
              <div style={{ fontSize: 11, color: SUB }}>{email}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
    { label: "First Name", value: firstName, set: setFirstName },
    { label: "Last Name", value: lastName, set: setLastName }
  ].map((f) => <div key={f.label}>
                <label style={{ fontSize: 10.5, fontWeight: 600, color: SUB, display: "block", marginBottom: 5 }}>{f.label}</label>
                <input value={f.value} onChange={(e) => {
    f.set(e.target.value);
    setSavedAcct(false);
  }} style={inp} />
              </div>)}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 10.5, fontWeight: 600, color: SUB, display: "block", marginBottom: 5 }}>Email Address</label>
              <input value={email} onChange={(e) => {
    setEmail(e.target.value);
    setSavedAcct(false);
  }} style={inp} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 10.5, fontWeight: 600, color: SUB, display: "block", marginBottom: 5 }}>Phone Number</label>
              <input value={phone} onChange={(e) => {
    setPhone(e.target.value);
    setSavedAcct(false);
  }} style={inp} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveBtn onClick={() => save(setSavingAcct, setSavedAcct)} saving={savingAcct} saved={savedAcct} />
          </div>
        </SectionCard>

        {
    /* ── Change Password ── */
  }
        <SectionCard title="Change Password" icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z">
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {[
    { label: "Current Password", value: currentPw, set: setCurrentPw },
    { label: "New Password", value: newPw, set: setNewPw },
    { label: "Confirm Password", value: confirmPw, set: setConfirmPw }
  ].map((f) => <div key={f.label}>
                <label style={{ fontSize: 10.5, fontWeight: 600, color: SUB, display: "block", marginBottom: 5 }}>{f.label}</label>
                <div style={{ position: "relative" }}>
                  <input
    type={showPw ? "text" : "password"}
    value={f.value}
    onChange={(e) => {
      f.set(e.target.value);
      setPwError("");
      setSavedPw(false);
    }}
    placeholder="••••••••"
    style={{ ...inp, paddingRight: 38 }}
  />
                  <button
    onClick={() => setShowPw(!showPw)}
    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: SUB, display: "flex", alignItems: "center" }}
  >
                    {showPw ? <Ico
    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
    d2="M1 1l22 22"
    size={13}
    sw={1.5}
  /> : <Ico
    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"
    d2="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
    size={13}
    sw={1.5}
  />}
                  </button>
                </div>
              </div>)}
            {pwError && <div style={{ fontSize: 11, color: "#991b1b", background: "#fee2e2", borderRadius: 8, padding: "8px 12px" }}>{pwError}</div>}

            {
    /* Password strength */
  }
            {newPw.length > 0 && <div>
                <div style={{ fontSize: 10, color: SUB, marginBottom: 4 }}>Password strength</div>
                <div style={{ height: 4, background: BG, borderRadius: 99, boxShadow: NEU_IN, overflow: "hidden" }}>
                  <div style={{
    height: "100%",
    borderRadius: 99,
    transition: "width 0.3s, background 0.3s",
    width: newPw.length < 6 ? "25%" : newPw.length < 10 ? "60%" : "100%",
    background: newPw.length < 6 ? "#ef4444" : newPw.length < 10 ? "#f59e0b" : "#15803d"
  }} />
                </div>
                <div style={{ fontSize: 10, color: newPw.length < 6 ? "#ef4444" : newPw.length < 10 ? "#b45309" : "#15803d", marginTop: 3 }}>
                  {newPw.length < 6 ? "Weak" : newPw.length < 10 ? "Fair" : "Strong"}
                </div>
              </div>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveBtn onClick={handleSavePw} saving={savingPw} saved={savedPw} />
          </div>
        </SectionCard>

        {
    /* ── Notifications ── */
  }
        <SectionCard title="Notifications" icon="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0">
          <FieldRow label="Meeting Reminders" sub="Get notified before a Zoom meeting starts">
            <Toggle on={notifMeeting} onChange={(v) => {
    setNotifMeeting(v);
    setSavedNotif(false);
  }} />
          </FieldRow>
          <FieldRow label="Assessment Alerts" sub="Notify when a new assessment is assigned">
            <Toggle on={notifAssess} onChange={(v) => {
    setNotifAssess(v);
    setSavedNotif(false);
  }} />
          </FieldRow>
          <FieldRow label="Upcoming Reminders" sub="Remind me 1 hour before scheduled meetings">
            <Toggle on={notifRemind} onChange={(v) => {
    setNotifRemind(v);
    setSavedNotif(false);
  }} />
          </FieldRow>
          <FieldRow label="Email Notifications" sub="Receive notifications via email as well">
            <Toggle on={notifEmail} onChange={(v) => {
    setNotifEmail(v);
    setSavedNotif(false);
  }} />
          </FieldRow>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <SaveBtn onClick={() => save(setSavingNotif, setSavedNotif)} saving={savingNotif} saved={savedNotif} />
          </div>
        </SectionCard>

        {
    /* ── Preferences ── */
  }
        <SectionCard title="Preferences" icon="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3zM3.6 9h16.8M3.6 15h16.8M12 3a12 12 0 0 1 0 18M12 3a12 12 0 0 0 0 18">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 600, color: SUB, display: "block", marginBottom: 5 }}>Language</label>
              <div style={{ position: "relative" }}>
                <select value={language} onChange={(e) => {
    setLanguage(e.target.value);
    setSavedApp(false);
  }} style={selectStyle}>
                  <option>English</option>
                  <option>Filipino</option>
                </select>
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: SUB }}>
                  <Ico d="M6 9l6 6 6-6" size={13} sw={1.5} />
                </span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 600, color: SUB, display: "block", marginBottom: 5 }}>Timezone</label>
              <div style={{ position: "relative" }}>
                <select value={timezone} onChange={(e) => {
    setTimezone(e.target.value);
    setSavedApp(false);
  }} style={selectStyle}>
                  <option>Asia/Manila (UTC+8)</option>
                  <option>Asia/Singapore (UTC+8)</option>
                  <option>America/New_York (UTC-5)</option>
                  <option>America/Los_Angeles (UTC-8)</option>
                  <option>Europe/London (UTC+0)</option>
                  <option>Australia/Sydney (UTC+10)</option>
                </select>
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: SUB }}>
                  <Ico d="M6 9l6 6 6-6" size={13} sw={1.5} />
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveBtn onClick={() => save(setSavingApp, setSavedApp)} saving={savingApp} saved={savedApp} />
          </div>
        </SectionCard>

        {
    /* ── Danger Zone ── */
  }
        <div style={{ gridColumn: "1 / -1", background: BG, borderRadius: 20, boxShadow: NEU_OUT, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", color: "#991b1b", flexShrink: 0 }}>
              <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={15} sw={1.5} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#991b1b" }}>Danger Zone</span>
          </div>
          <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TXT }}>Deactivate Account</div>
              <div style={{ fontSize: 11, color: SUB, marginTop: 2 }}>Temporarily disable your VA account. You can reactivate it anytime.</div>
            </div>
            <button style={{ background: BG, border: "1.5px solid #fca5a5", color: "#991b1b", borderRadius: 12, padding: "9px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Deactivate
            </button>
          </div>
        </div>

      </div>
    </div>;
}
export {
  Settings as default
};
