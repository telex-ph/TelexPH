import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Spinner } from "@/components/DashboardLoader";

// Shared building blocks for the admin login, OTP and password-reset screens.
// Brand colors come from --brand-* (always defined, never theme-swapped), because
// the auth card is white regardless of the dashboard theme the last user picked.
const RED = "var(--brand-red)";
const MAROON = "var(--brand-maroon)";

const ICONS = {
  mail: "M2.25 6.75c0-.414.336-.75.75-.75h18c.414 0 .75.336.75.75v10.5a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V6.75zM3 7l9 6 9-6",
  lock: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 10.5h10.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H6.75a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5z",
  shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  alert: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
  check: "M4.5 12.75l6 6 9-13.5",
  eye: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  eyeOff: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
  arrow: "M8.25 4.5l7.5 7.5-7.5 7.5",
  back: "M15 19l-7-7 7-7"
};

export function Icon({ name, className = "w-4 h-4", strokeWidth = 2 }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
    </svg>;
}

// Counts down from `seconds` after start(); used to rate-limit "Resend code".
export function useCooldown(seconds = 30) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1e3);
    return () => clearTimeout(id);
  }, [left]);
  return [left, () => setLeft(seconds)];
}

export function Alert({ children }) {
  if (!children) return null;
  return <div role="alert" className="animate-shake flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 font-open-sans">
      <Icon name="alert" className="w-4 h-4 mt-px shrink-0" />
      <span className="font-semibold leading-snug">{children}</span>
    </div>;
}

export function Header({ eyebrow, title, subtitle, center }) {
  return <div className={`mb-6 ${center ? "text-center" : "text-left"}`}>
      <div className={`flex items-center gap-2.5 mb-6 ${center ? "justify-center" : ""}`}>
        <span className="relative w-9 h-9 shrink-0">
          <Image src="/images/Tlxlogo.webp" alt="" fill className="object-contain" priority />
        </span>
        <span className="text-sm font-bold font-poppins text-gray-900 leading-none">Telex<span style={{ color: RED }}>PH</span>
          <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mt-1">Admin Portal</span>
        </span>
      </div>
      <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase mb-2 font-poppins" style={{ color: RED }}>
        <span className="w-5 h-0.5 rounded-full" style={{ background: RED }} />
        {eyebrow}
      </p>
      <h1 className="text-2xl sm:text-[28px] leading-tight font-black tracking-normal mb-2 font-poppins text-gray-900">
        {title}
      </h1>
      {subtitle && <p className="text-gray-500 text-sm leading-relaxed font-open-sans">{subtitle}</p>}
    </div>;
}

export function Field({ id, label, icon, right, className = "", capsHint, ...input }) {
  const [caps, setCaps] = useState(false);
  return <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-gray-700 mb-1.5 ml-0.5 font-poppins">
        {label}
      </label>
      <div className="relative">
        {icon && <Icon name={icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />}
        <input
    id={id}
    className={`w-full ${icon ? "pl-11" : "pl-4"} ${right ? "pr-12" : "pr-4"} py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 font-open-sans outline-none transition-all hover:border-gray-300 focus:bg-white focus:border-[var(--brand-red)] focus:ring-4 focus:ring-[var(--brand-red)]/10 disabled:opacity-60 ${className}`}
    {...input}
    onKeyUp={capsHint ? (e) => setCaps(e.getModifierState("CapsLock")) : input.onKeyUp}
    onBlur={(e) => {
      setCaps(false);
      input.onBlur?.(e);
    }}
  />
        {right}
      </div>
      {capsHint && caps && <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 mt-1.5 ml-0.5"><Icon name="alert" className="w-3.5 h-3.5" />Caps Lock is on</p>}
    </div>;
}

export function PasswordToggle({ shown, onClick }) {
  return <button
    type="button"
    onClick={onClick}
    aria-label={shown ? "Hide password" : "Show password"}
    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
  >
      <Icon name={shown ? "eyeOff" : "eye"} className="w-5 h-5" />
    </button>;
}

export function SubmitButton({ loading, loadingText, disabled, children, ...rest }) {
  return <button
    type="submit"
    disabled={loading || disabled}
    className="group relative overflow-hidden w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-white font-poppins transition-all shadow-[0_10px_24px_-10px_rgba(161,0,0,0.7)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(161,0,0,0.8)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    style={{ background: `linear-gradient(135deg, ${RED}, ${MAROON})` }}
    {...rest}
  >
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-[400%] group-disabled:hidden" />
      {loading ? <>
          <Spinner size={16} />
          {loadingText}
        </> : children}
    </button>;
}

export function LinkButton({ as: Tag = "button", className = "", ...props }) {
  return <Tag
    {...(Tag === "button" ? { type: "button" } : {})}
    className={`text-sm font-semibold font-poppins transition-colors hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed ${className}`}
    style={{ color: RED }}
    {...props}
  />;
}

// Six single-digit boxes. Handles typing, backspace, arrows, paste and SMS autofill
// (a whole code arriving in one box). `value` is always a plain digit string.
export function OtpInput({ value, onChange, disabled, autoFocus, invalid }) {
  const refs = useRef([]);
  const focus = (i) => refs.current[Math.max(0, Math.min(5, i))]?.focus();
  const commit = (next, focusAt) => {
    onChange(next.slice(0, 6));
    focus(focusAt);
  };
  return <div className="grid grid-cols-6 gap-2 sm:gap-2.5" role="group" aria-label="6-digit verification code">
      {Array.from({ length: 6 }, (_, i) => <input
    key={i}
    ref={(el) => refs.current[i] = el}
    value={value[i] || ""}
    inputMode="numeric"
    autoComplete={i === 0 ? "one-time-code" : "off"}
    aria-label={`Digit ${i + 1}`}
    autoFocus={autoFocus && i === 0}
    disabled={disabled}
    onFocus={(e) => e.target.select()}
    onChange={(e) => {
      const digits = e.target.value.replace(/\D/g, "");
      if (!digits) return commit(value.slice(0, i) + value.slice(i + 1), i);
      commit(value.slice(0, i) + digits + value.slice(i + digits.length), i + digits.length);
    }}
    onKeyDown={(e) => {
      if (e.key === "Backspace" && !value[i] && i > 0) {
        e.preventDefault();
        commit(value.slice(0, i - 1) + value.slice(i), i - 1);
      } else if (e.key === "ArrowLeft") focus(i - 1);
      else if (e.key === "ArrowRight") focus(i + 1);
    }}
    onPaste={(e) => {
      e.preventDefault();
      const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (digits) commit(digits, digits.length);
    }}
    className={`h-12 sm:h-14 min-w-0 w-full text-center text-xl font-bold font-poppins rounded-xl border bg-gray-50 text-gray-900 outline-none transition-all disabled:opacity-60 focus:bg-white focus:ring-4 focus:ring-[var(--brand-red)]/10 focus:border-[var(--brand-red)] ${invalid ? "border-red-400" : value[i] ? "border-[var(--brand-red)]/50 bg-white" : "border-gray-200"}`}
  />)}
    </div>;
}

// Right-hand illustration panel shared by every desktop auth screen.
export function IllustrationPanel() {
  return <div className="hidden md:flex md:w-1/2 relative items-center justify-center overflow-hidden flex-col border-l border-gray-100" style={{ background: "linear-gradient(160deg, #fff 0%, #faf5f5 55%, #f3e6e6 100%)" }}>
      <div className="relative z-10 w-full h-[60%] flex items-center justify-center px-8 pt-8">
        <div className="relative w-full h-full animate-illo-float-slow">
          <Image src="/images/log.jpg" alt="Admin portal illustration" fill className="object-contain mix-blend-multiply" priority />
        </div>
      </div>
      <div className="relative z-20 text-center px-10 pt-6 pb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide font-poppins mb-3" style={{ color: RED, background: "var(--admin-accent-soft)" }}>
          <Icon name="shield" className="w-3.5 h-3.5" />
          Restricted access
        </span>
        <p className="text-gray-500 text-[13px] max-w-[360px] mx-auto leading-relaxed font-open-sans">
          This system is strictly for administrative use. All access attempts are monitored and unauthorized entry is prohibited.
        </p>
      </div>
      <div className="absolute top-10 right-10 w-40 h-40 border rounded-full" style={{ borderColor: "var(--admin-accent-soft)" }} />
      <div className="absolute -bottom-[5%] -left-[5%] w-72 h-72 rounded-full blur-3xl" style={{ background: "var(--admin-accent-soft)" }} />
    </div>;
}

// Full-page background + white card. Children are the form side (left column).
export function AuthCard({ children }) {
  return <div className="h-dvh w-full relative flex items-center justify-center p-0 md:p-8 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image src="/images/background.webp" alt="" fill className="object-cover brightness-[0.4] contrast-[1.1]" priority quality={90} />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#530607]/40" />
      </div>
      <div className="relative z-10 w-full h-full md:h-auto md:min-h-[min(640px,92dvh)] md:max-w-5xl md:max-h-[92dvh] bg-white md:rounded-3xl shadow-[0_60px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row border border-white/10 font-open-sans animate-fade-in">
        <div className="w-full md:w-1/2 px-6 py-8 sm:px-10 md:px-14 flex flex-col justify-center bg-white z-20 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>
        <IllustrationPanel />
      </div>
    </div>;
}

const STRENGTH = [
  { label: "Too short", color: "bg-red-400" },
  { label: "Weak", color: "bg-orange-400" },
  { label: "Fair", color: "bg-yellow-400" },
  { label: "Good", color: "bg-lime-500" },
  { label: "Strong", color: "bg-green-500" }
];

export function scorePassword(pw) {
  if (pw.length < 8) return 0;
  return Math.max(1, [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length);
}

export function StrengthMeter({ password }) {
  if (!password) return null;
  const score = scorePassword(password);
  const { label, color } = STRENGTH[score];
  return <div className="mt-2 ml-0.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((n) => <span key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= score ? color : "bg-gray-200"}`} />)}
      </div>
      <p className="text-[11px] text-gray-500 mt-1 font-open-sans">Password strength: <span className="font-semibold text-gray-700">{label}</span></p>
    </div>;
}
