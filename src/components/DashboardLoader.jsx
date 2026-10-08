import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
// Brand tokens. The auth check shows this loader before the lazy Layout chunk (which also imports this) has loaded.
import "@/styles/admin-theme.css";

/**
 * The ONE loading animation for the admin dashboard (modeled on HostOps'
 * FetchingOverlay: full-screen blurred overlay, a random animated icon, a
 * title and a rotating hint).
 *
 *   <DashboardLoader isVisible={initialLoading} message="Loading blogs…" />
 *
 * <DashboardLoaderHost /> is mounted once in App.jsx and draws the overlay.
 *
 * Rules (see CLAUDE.md "Loading"):
 *  - Page open only. Wrap the page's loading flag in `useInitialLoad()` so
 *    refetches caused by filters/toggles never bring the overlay back.
 *  - Buttons that are busy (save, approve, restore…) use <Spinner />.
 *  - No other spinners, skeletons or "loading…" text in the dashboard.
 */

const HINTS = [
  "Warming up the server…",
  "Counting your views, one by one…",
  "Asking the database nicely…",
  "Almost there. Probably.",
  "Your numbers are on their way. No pressure.",
  "Giving the server a quick coffee break…",
  "Chasing the data down the wire…",
  "Teaching the dashboard to read…",
];

const shuffled = (n) => {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
let hintQueue = [];
let iconQueue = [];
const nextHint = () => {
  if (!hintQueue.length) hintQueue = shuffled(HINTS.length);
  return HINTS[hintQueue.pop()];
};

const EXIT_MS = 220;
const RED = "var(--brand-red)";
const MAROON = "var(--brand-maroon)";
const INK = "var(--brand-black)";
const TINT = "rgba(161, 0, 0, 0.18)";

const svgProps = { width: 160, height: 100, viewBox: "0 0 160 100", style: { overflow: "visible" } };

const ICONS = [
  // Rising bars (analytics)
  () => (
    <svg {...svgProps}>
      <line x1="30" y1="86" x2="130" y2="86" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i} x={36 + i * 20} y={30} width="12" height={56 - 0} rx="3"
          fill={i === 3 ? RED : MAROON}
          style={{ transformOrigin: `${42 + i * 20}px 86px`, animation: `_dl_bar 1.4s ${i * 0.15}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  ),
  // Envelope (messages)
  () => (
    <svg {...svgProps}>
      <g style={{ animation: "_dl_bounce 1.4s ease-in-out infinite" }}>
        <rect x="38" y="28" width="84" height="56" rx="8" fill={MAROON} />
        <polyline points="38,34 80,64 122,34" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="122" cy="28" r="9" fill={RED} style={{ animation: "_dl_pulse 1.2s infinite", transformOrigin: "122px 28px" }} />
    </svg>
  ),
  // Calendar with check
  () => (
    <svg {...svgProps}>
      <rect x="45" y="25" width="70" height="60" rx="6" fill={MAROON} />
      <rect x="45" y="25" width="70" height="18" rx="6" fill={RED} />
      <rect x="58" y="16" width="6" height="16" rx="2" fill={INK} />
      <rect x="96" y="16" width="6" height="16" rx="2" fill={INK} />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
        <rect key={`${r}-${c}`} x={53 + c * 15} y={50 + r * 12} width="10" height="9" rx="1.5" fill="rgba(255,255,255,0.35)" />
      )))}
      <g style={{ animation: "_dl_check 1.8s infinite", transformOrigin: "113px 78px" }}>
        <circle cx="113" cy="78" r="13" fill="#fff" stroke={RED} strokeWidth="2.5" />
        <polyline points="107,78 111,82 119,73" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  // Document with typing lines (blogs / case studies)
  () => (
    <svg {...svgProps}>
      <rect x="48" y="12" width="64" height="78" rx="6" fill="#fff" stroke={MAROON} strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i} x="58" y={28 + i * 14} width={i === 3 ? 22 : 44} height="6" rx="3" fill={i === 0 ? RED : TINT}
          style={{ transformOrigin: `58px ${31 + i * 14}px`, animation: `_dl_line 1.6s ${i * 0.25}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  ),
  // Headset (virtual assistants)
  () => (
    <svg {...svgProps}>
      <path d="M46 56 C46 28 114 28 114 56" fill="none" stroke={MAROON} strokeWidth="8" strokeLinecap="round" />
      <rect x="38" y="50" width="16" height="28" rx="7" fill={RED} />
      <rect x="106" y="50" width="16" height="28" rx="7" fill={RED} />
      <path d="M114 74 C114 88 96 90 84 90" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <circle cx="82" cy="90" r="4" fill={INK} />
      {[0, 1].map((i) => (
        <path
          key={i} d={`M${134 + i * 8} 54 Q${142 + i * 8} 64 ${134 + i * 8} 74`} fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round"
          style={{ animation: `_dl_wave 1.4s ${i * 0.3}s infinite` }}
        />
      ))}
    </svg>
  ),
  // Eye (page views)
  () => (
    <svg {...svgProps}>
      <path d="M22 50 Q80 -4 138 50 Q80 104 22 50 Z" fill="#fff" stroke={MAROON} strokeWidth="5" strokeLinejoin="round" />
      <g style={{ animation: "_dl_look 2.2s ease-in-out infinite" }}>
        <circle cx="80" cy="50" r="20" fill={RED} />
        <circle cx="80" cy="50" r="9" fill={INK} />
        <circle cx="86" cy="44" r="4" fill="#fff" />
      </g>
    </svg>
  ),
];
// One overlay for the whole app. <DashboardLoader> only REGISTERS a request;
// <DashboardLoaderHost> (mounted once in App) draws a single overlay while any
// request is open. Auth check -> route chunk -> user fetch -> page data used to
// each mount their own overlay, so the icon and text restarted at every
// hand-off (the "loader keeps retriggering on refresh" bug).
const GRACE_MS = 200; // keeps the overlay up across the gap between two hand-offs
const requests = new Map();
const listeners = new Set();
const EMPTY = [];
let snapshot = EMPTY;
const emit = () => {
  snapshot = [...requests.values()];
  listeners.forEach((l) => l());
};
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;
const nextIconIdx = () => {
  if (!iconQueue.length) iconQueue = shuffled(ICONS.length);
  return iconQueue.pop();
};

/** Declares "something is loading". Renders nothing; <DashboardLoaderHost> draws the overlay. */
export default function DashboardLoader({ isVisible, message = "Loading…", subMessage = null }) {
  const id = useId();
  useEffect(() => {
    if (!isVisible) return;
    requests.set(id, { message, subMessage });
    emit();
    return () => {
      requests.delete(id);
      emit();
    };
  }, [isVisible, id, message, subMessage]);
  return null;
}

/** Mount ONCE, outside any <Suspense>. Fades out EXIT_MS after the last request closes. */
export function DashboardLoaderHost() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const active = entries.length > 0;
  const [look, setLook] = useState(null); // icon + hint, picked once per appearance; null = not on screen
  const [exiting, setExiting] = useState(false);
  const lastEntry = useRef(null);
  if (active) lastEntry.current = entries[entries.length - 1]; // keep the text while fading out

  useEffect(() => {
    if (active) {
      setLook((l) => l ?? { iconIdx: nextIconIdx(), hint: nextHint() });
      setExiting(false);
      return;
    }
    const fade = setTimeout(() => setExiting(true), GRACE_MS);
    const remove = setTimeout(() => {
      setLook(null);
      setExiting(false);
    }, GRACE_MS + EXIT_MS);
    return () => {
      clearTimeout(fade);
      clearTimeout(remove);
    };
  }, [active]);

  if (!look) return null;
  const { message = "Loading…", subMessage = null } = lastEntry.current ?? {};
  const sub = subMessage ?? look.hint;

  return createPortal(
    <>
      <style>{`
        @keyframes _dl_in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes _dl_out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes _dl_up  { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes _dl_bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes _dl_pulse  { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.3); opacity: .7 } }
        @keyframes _dl_bar  { 0%,100% { transform: scaleY(.25) } 50% { transform: scaleY(1) } }
        @keyframes _dl_line { 0%,100% { transform: scaleX(.3); opacity: .5 } 50% { transform: scaleX(1); opacity: 1 } }
        @keyframes _dl_wave { 0%,100% { opacity: .2 } 50% { opacity: 1 } }
        @keyframes _dl_look { 0%,100% { transform: translateX(-9px) } 50% { transform: translateX(9px) } }
        @keyframes _dl_check { 0%,60% { opacity: 0; transform: scale(.5) } 80% { opacity: 1; transform: scale(1.2) } 100% { opacity: 1; transform: scale(1) } }
        @keyframes _dl_spin { to { transform: rotate(360deg) } }
      `}</style>
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "fixed", inset: 0, zIndex: 99999,
          background: "color-mix(in srgb, var(--admin-bg) 92%, transparent)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28,
          animation: exiting ? `_dl_out ${EXIT_MS}ms ease forwards` : "_dl_in .18s ease forwards",
        }}
      >
        {ICONS[look.iconIdx]()}
        <div style={{ textAlign: "center", animation: "_dl_up .25s ease forwards" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 17, color: "var(--admin-text)", margin: "0 0 6px" }}>{message}</h2>
          {sub && <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--admin-accent-text)", margin: 0 }}>{sub}</p>}
        </div>
      </div>
    </>,
    document.body
  );
}

/** Small inline spinner for busy buttons. Inherits the text color. */
export function Spinner({ size = 14, thickness = 2 }) {
  return (
    <>
      <style>{`@keyframes _dl_spin { to { transform: rotate(360deg) } }`}</style>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block", width: size, height: size, flexShrink: 0, borderRadius: "50%",
          border: `${thickness}px solid currentColor`, borderTopColor: "transparent", animation: "_dl_spin .7s linear infinite",
        }}
      />
    </>
  );
}

/**
 * True only for the page's FIRST load. Pass the page's own `loading` flag;
 * later refetches (filters, toggles, tab changes) return false, so the
 * overlay never reappears and the existing data stays on screen.
 */
export function useInitialLoad(loading) {
  const seen = useRef(false);
  const [done, setDone] = useState(false);
  if (loading) seen.current = true;
  useEffect(() => {
    if (!loading && seen.current) setDone(true);
  }, [loading]);
  return loading && !done;
}
