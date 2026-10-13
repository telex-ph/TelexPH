
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
const mix = (c, pct, base = "transparent") => `color-mix(in srgb, ${c} ${pct}%, ${base})`;
const LogoutIcon = ({ size = 20, stroke = 2 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>;
const Sparkle = ({ className, size = 16, style }) => <svg className={`absolute ${className}`} style={style} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12 6.2-.6 11.4-5.8 12-12z" />
  </svg>;
function LogoutConfirmModal({
  portalLabel,
  accent = "#800000",
  onConfirm,
  onCancel
}) {
  const [mounted, setMounted] = useState(false);
  const confirmRef = useRef(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    confirmRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);
  if (!mounted) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", animation: "lcFadeIn 0.15s ease-out" }}
      onClick={onCancel}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes lcFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lcPopIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lcFloat { 0%,100% { transform: rotate(-14deg) translateY(0); } 50% { transform: rotate(-14deg) translateY(-6px); } }
        @keyframes lcTwinkle { 0%,100% { opacity: .35; transform: scale(.8); } 50% { opacity: 1; transform: scale(1); } }
        .lc-btn { transition: transform .15s, background .15s, box-shadow .15s, opacity .15s; }
        .lc-btn:active { transform: scale(0.98); }
      ` }} />

      {
      /* Stop clicks inside the card from reaching the backdrop's onCancel. */
    }
      <div
      onClick={(e) => e.stopPropagation()}
      className="relative grid w-full max-w-[680px] grid-cols-1 overflow-hidden rounded-[32px] sm:grid-cols-[240px_1fr]"
      style={{
        background: `linear-gradient(135deg, var(--admin-surface), ${mix(accent, 6, "var(--admin-surface)")})`,
        border: "1px solid var(--admin-border)",
        boxShadow: "var(--admin-shadow-lg)",
        animation: "lcPopIn 0.2s cubic-bezier(0.34,1.3,0.64,1) both"
      }}
    >
        {
      /* Illustration panel (hidden on phones) */
    }
        <div
      aria-hidden="true"
      className="relative hidden min-h-[340px] overflow-hidden sm:block"
      style={{ background: `linear-gradient(160deg, ${accent}, var(--admin-accent-hover, ${accent}))` }}
    >
          <svg viewBox="0 0 240 480" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <ellipse cx="40" cy="330" rx="90" ry="110" fill="#000" opacity="0.16" />
            <path d="M-20,150 C40,120 70,60 130,30" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="1" />
            <path d="M0,480 L0,395 C55,370 100,320 128,250 C150,195 120,125 178,78 C208,54 232,24 240,0 L240,480 Z" style={{ fill: mix(accent, 9, "var(--admin-surface)") }} />
          </svg>

          <Sparkle className="left-[44px] top-[88px] text-white" size={18} style={{ animation: "lcTwinkle 2.4s ease-in-out infinite" }} />
          <Sparkle className="left-[26px] top-[270px] text-white" size={14} style={{ opacity: 0.8, animation: "lcTwinkle 2.4s ease-in-out .8s infinite" }} />
          <Sparkle className="right-[10px] top-[72px]" size={12} style={{ color: mix(accent, 35), animation: "lcTwinkle 2.4s ease-in-out 1.4s infinite" }} />
          <Sparkle className="bottom-[88px] right-[34px]" size={16} style={{ color: mix(accent, 35), animation: "lcTwinkle 2.4s ease-in-out .4s infinite" }} />

          <div
      className="absolute left-1/2 top-1/2 flex h-[124px] w-[124px] -translate-x-[48%] -translate-y-[58%] items-center justify-center rounded-[34px]"
      style={{
        background: "var(--admin-surface-raised, #fff)",
        color: accent,
        boxShadow: `0 22px 40px ${mix("#000", 28)}, inset 0 -6px 14px ${mix(accent, 10)}`,
        animation: "lcFloat 4s ease-in-out infinite"
      }}
    >
            <LogoutIcon size={64} stroke={1.8} />
          </div>
          <div className="absolute bottom-[78px] left-1/2 h-4 w-20 -translate-x-1/2 rounded-full blur-md" style={{ background: mix(accent, 45) }} />
        </div>

        {
      /* Content */
    }
        <div className="relative flex flex-col justify-center px-7 pb-7 pt-12 sm:px-9 sm:py-10">
          <button
      type="button"
      onClick={onCancel}
      aria-label="Close"
      className="lc-btn absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-[var(--admin-bg-hover)]"
      style={{ background: "var(--admin-bg-soft)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
    >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <h2 id="logout-confirm-title" className="pr-10 text-4xl leading-tight" style={{ color: "var(--admin-text)" }}>
            Log <span style={{ color: accent }}>out?</span>
          </h2>
          <p className="mt-3 max-w-[340px] text-[15px] leading-relaxed" style={{ color: "var(--admin-text-sub)" }}>
            You&apos;ll be signed out of {portalLabel} and returned to the login page.
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-2xl p-4" style={{ background: mix(accent, 9), border: `1px solid ${mix(accent, 12)}` }}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: mix(accent, 14), color: accent }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </span>
            <div>
              <p className="m-0 text-[13px] font-semibold" style={{ color: "var(--admin-text)" }}>Unsaved changes may be lost</p>
              <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--admin-text-sub)" }}>Make sure to save your work before logging out.</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
      type="button"
      onClick={onCancel}
      className="lc-btn flex-1 cursor-pointer rounded-full px-5 py-3.5 text-sm font-semibold hover:bg-[var(--admin-bg-hover)]"
      style={{ background: "var(--admin-surface)", border: "1.5px solid var(--admin-border-strong)", color: "var(--admin-text)" }}
    >
              Stay logged in
            </button>
            <button
      ref={confirmRef}
      type="button"
      onClick={onConfirm}
      className="lc-btn flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-none px-5 py-3.5 text-sm font-semibold hover:opacity-90"
      style={{ background: accent, color: "var(--admin-text-on-accent, #fff)", boxShadow: `0 10px 22px ${mix(accent, 38)}` }}
    >
              <LogoutIcon size={16} stroke={2.2} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
export {
  LogoutConfirmModal as default
};
