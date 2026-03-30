"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Activity, Lock } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://telexph-admin.onrender.com";

const STATS = [
  { num: "2,400+", lbl: "Active VAs" },
  { num: "98%",    lbl: "Satisfaction" },
  { num: "150+",   lbl: "Clients" },
  { num: "$5M+",   lbl: "Paid out" },
];

const BAR_HEIGHTS = [45, 62, 50, 80, 58, 90, 70];

export default function VALoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [remember,     setRemember]     = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/va/authenticate`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || "Invalid email or password.");
        return;
      }
      router.push("/VirtualAssistant/dashboard");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.glowLine} />

      {/* Card */}
      <div style={styles.card}>

        {/* ── LEFT: Form ── */}
        <div style={styles.left}>

          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <Activity size={18} color="#fff" />
            </div>
            <span style={styles.brandName}>VAportal</span>
            <span style={styles.brandBadge}>Secure</span>
          </div>

          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subhead}>Sign in to your Virtual Assistant account</p>

          <form onSubmit={handleSignIn} style={styles.form}>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Email address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                style={styles.input}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#8B0000";
                  e.currentTarget.style.background  = "#fff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#f0e8e8";
                  e.currentTarget.style.background  = "#fdf8f8";
                }}
              />
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Password</label>
              <div style={styles.passWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  style={{ ...styles.input, paddingRight: "44px" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8B0000";
                    e.currentTarget.style.background  = "#fff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#f0e8e8";
                    e.currentTarget.style.background  = "#fdf8f8";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={styles.rowMeta}>
              <label style={styles.rememberLabel}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: "#8B0000", width: 14, height: 14, cursor: "pointer" }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => router.push("/VirtualAssistant/forgot-password")}
                style={styles.forgotBtn}
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitBtn,
                opacity: isLoading ? 0.65 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading
                ? <><Loader2 size={15} className="animate-spin" /> Signing in…</>
                : "Sign in"
              }
            </button>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Apply link */}
            <p style={styles.applyText}>
              New here?{" "}
              <button
                type="button"
                onClick={() => router.push("/VirtualAssistant/VAforms")}
                style={styles.applyLink}
              >
                Apply as a Virtual Assistant
              </button>
            </p>

          </form>
        </div>

        {/* ── RIGHT: Stats & Charts ── */}
        <div style={styles.right}>

          {/* Stat grid */}
          <div style={styles.statGrid}>
            {STATS.map((s) => (
              <div key={s.lbl} style={styles.statCard}>
                <div style={styles.statNum}>{s.num}</div>
                <div style={styles.statLbl}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={styles.chartBox}>
            <div style={styles.chartHeader}>
              <span style={styles.chartTitle}>Monthly earnings</span>
            </div>
            <div style={styles.chartVal}>$48,200</div>
            <div style={styles.chartChange}>↑ 12.4% this month</div>
            <div style={styles.bars}>
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.bar,
                    height: `${h}%`,
                    background: i === 5 ? "#8B0000" : "rgba(139,0,0,0.3)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sparkline */}
          <div style={styles.sparkBox}>
            <div style={styles.sparkLabel}>Task completion</div>
            <div style={styles.sparkRow}>
              <div>
                <div style={styles.sparkBig}>1,284</div>
                <div style={styles.sparkSub}>tasks this quarter</div>
              </div>
              <svg width="80" height="40" viewBox="0 0 80 40">
                <polyline
                  points="0,32 13,24 26,28 40,14 53,18 66,8 80,4"
                  fill="none"
                  stroke="#8B0000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="0,32 13,24 26,28 40,14 53,18 66,8 80,4 80,40 0,40"
                  fill="rgba(139,0,0,0.18)"
                  stroke="none"
                />
              </svg>
            </div>
          </div>

          {/* Notice */}
          <div style={styles.notice}>
            <Lock size={12} color="#8B0000" style={{ flexShrink: 0 }} />
            <span style={styles.noticeText}>
              VA portal only — all access is monitored and logged.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─────────────── Styles ─────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0000",
    padding: "32px 16px",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(160,0,0,0.4) 0%, transparent 70%)",
    top: -160,
    left: -120,
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(100,0,0,0.35) 0%, transparent 70%)",
    bottom: -100,
    right: -80,
    pointerEvents: "none",
  },
  glowLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    background:
      "linear-gradient(90deg, transparent, rgba(139,0,0,0.6), transparent)",
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: 880,
    display: "flex",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(139,0,0,0.25)",
  },

  /* ── LEFT ── */
  left: {
    flex: 1,
    background: "#fff",
    padding: "52px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 36,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    background: "#8B0000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 15,
    fontWeight: 500,
    color: "#1a0000",
    letterSpacing: "-0.3px",
  },
  brandBadge: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    background: "#fff0f0",
    color: "#8B0000",
    borderRadius: 4,
    padding: "2px 7px",
    border: "1px solid #f5caca",
  },
  heading: {
    fontSize: 28,
    fontWeight: 500,
    color: "#1a0000",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
    marginBottom: 6,
  },
  subhead: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 32,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8B0000",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #f0e8e8",
    background: "#fdf8f8",
    fontSize: 14,
    color: "#1a0000",
    outline: "none",
    transition: "border-color 0.15s, background 0.15s",
  },
  passWrap: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ccc",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  rowMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  rememberLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    fontSize: 13,
    color: "#888",
  },
  forgotBtn: {
    fontSize: 13,
    fontWeight: 500,
    color: "#8B0000",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  errorBox: {
    marginBottom: 16,
    padding: "10px 14px",
    borderRadius: 8,
    background: "#fff5f5",
    border: "1px solid #fecaca",
  },
  errorText: {
    fontSize: 12,
    color: "#b91c1c",
    fontWeight: 500,
    margin: 0,
  },
  submitBtn: {
    width: "100%",
    padding: 13,
    background: "#8B0000",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
    transition: "opacity 0.15s, transform 0.1s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#f0e8e8",
  },
  dividerText: {
    fontSize: 12,
    color: "#ccc",
  },
  applyText: {
    textAlign: "center",
    fontSize: 13,
    color: "#bbb",
    margin: 0,
  },
  applyLink: {
    color: "#8B0000",
    fontWeight: 500,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    padding: 0,
  },

  /* ── RIGHT ── */
  right: {
    width: 320,
    background: "#0d0000",
    padding: "40px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    borderLeft: "1px solid rgba(139,0,0,0.2)",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  statCard: {
    background: "rgba(139,0,0,0.12)",
    border: "1px solid rgba(139,0,0,0.2)",
    borderRadius: 12,
    padding: "14px 12px",
  },
  statNum: {
    fontSize: 20,
    fontWeight: 500,
    color: "#fff",
    marginBottom: 2,
  },
  statLbl: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  chartBox: {
    background: "rgba(139,0,0,0.08)",
    border: "1px solid rgba(139,0,0,0.18)",
    borderRadius: 14,
    padding: 16,
  },
  chartHeader: {
    marginBottom: 4,
  },
  chartTitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  chartVal: {
    fontSize: 22,
    fontWeight: 500,
    color: "#fff",
  },
  chartChange: {
    fontSize: 11,
    color: "#4caf7d",
    marginBottom: 14,
  },
  bars: {
    display: "flex",
    alignItems: "flex-end",
    gap: 5,
    height: 64,
  },
  bar: {
    flex: 1,
    borderRadius: "4px 4px 0 0",
    transition: "background 0.2s",
  },
  sparkBox: {
    background: "rgba(139,0,0,0.08)",
    border: "1px solid rgba(139,0,0,0.18)",
    borderRadius: 14,
    padding: 16,
  },
  sparkLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 10,
  },
  sparkRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sparkBig: {
    fontSize: 20,
    fontWeight: 500,
    color: "#fff",
  },
  sparkSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    marginTop: 2,
  },
  notice: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(139,0,0,0.1)",
    border: "1px solid rgba(139,0,0,0.2)",
    borderRadius: 10,
    padding: "10px 12px",
    marginTop: "auto",
  },
  noticeText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    lineHeight: 1.5,
  },
};