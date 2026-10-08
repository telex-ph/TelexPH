import { useEffect, useState } from "react";
import { FONTS, FONT_WEIGHTS } from "@/constant/styles";

// The public site's loading screen (hourglass + percentage). fullScreen=false fits inside a page section.
const T = {
  primary: "#a10000",
  white: "#ffffff",
  borderLight: "#e4e4e7",
  textMuted: "rgba(0,0,0,0.35)"
};
function PageLoader({ fullScreen = true }) {
  const [pct, setPct] = useState(0);
  const [dots, setDots] = useState("");
  const [phase, setPhase] = useState(0);
  const [hgAngle, setHgAngle] = useState(0);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    let count = 0;
    const t = setInterval(() => {
      count = (count + 1) % 4;
      setDots(".".repeat(count));
    }, 500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    let current = 0;
    let timeout;
    const tick = () => {
      if (current < 99) {
        const jump = current < 30 ? Math.floor(Math.random() * 3) + 1 : current < 70 ? Math.floor(Math.random() * 2) + 1 : 1;
        current = Math.min(99, current + jump);
        setPct(current);
        setFlip(true);
        setTimeout(() => setFlip(false), 120);
      }
      const delay = current < 40 ? 120 : current < 75 ? 200 : current < 90 ? 350 : 600;
      timeout = setTimeout(tick, delay);
    };
    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    let p = 0;
    let flp = false;
    let raf;
    const animate = () => {
      if (!flp) {
        p += 0.012;
        setPhase(Math.min(1, p));
        if (p >= 1) {
          flp = true;
          setTimeout(() => {
            flp = false;
            p = 0;
            setHgAngle((a) => a + 180);
          }, 400);
        }
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);
  const topH = Math.max(0, 18 * (1 - phase));
  const botY = 44 - 18 * phase;
  const botH = 18 * phase;
  const dripY = 26 + phase * 6;
  const dripOpacity = phase > 0.05 && phase < 0.95 ? 0.7 : 0;
  const tens = Math.floor(pct / 10);
  const units = pct % 10;
  return <div className={`${fullScreen ? "h-screen" : "min-h-[50vh]"} w-full flex items-center justify-center bg-white`}>
      <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "40px",
      padding: "32px 48px",
      border: `1px solid ${T.borderLight}`,
      borderRadius: "20px",
      background: T.white
    }}
  >
        {
    /* ── Hourglass ── */
  }
        <svg
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    style={{
      transform: `rotate(${hgAngle}deg)`,
      transition: "transform 0.5s ease",
      flexShrink: 0
    }}
  >
          <defs>
            <clipPath id="sand-top-clip">
              <rect x="10" y="8" width="32" height={topH} />
            </clipPath>
            <clipPath id="sand-bot-clip">
              <rect x="10" y={botY} width="32" height={botH} />
            </clipPath>
          </defs>
          <path d="M10 8 Q10 22 26 26 Q42 22 42 8 Z" fill={T.primary} opacity="0.18" clipPath="url(#sand-top-clip)" />
          <path d="M10 8 Q10 22 26 26 Q42 22 42 8 Z" fill={T.primary} opacity="0.5" clipPath="url(#sand-top-clip)" />
          <path d="M26 26 Q10 30 10 44 L42 44 Q42 30 26 26 Z" fill={T.primary} opacity="0.5" clipPath="url(#sand-bot-clip)" />
          <path
    d="M10 6 L42 6 L42 8 Q42 22 26 26 Q10 30 10 44 L42 44 L42 46 L10 46 L10 44 Q10 30 26 26 Q42 22 42 8 L10 8 Z"
    fill="none"
    stroke={T.primary}
    strokeWidth="2.2"
    strokeLinejoin="round"
  />
          <line x1="8" y1="6" x2="44" y2="6" stroke={T.primary} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="46" x2="44" y2="46" stroke={T.primary} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy={dripY} r="1.5" fill={T.primary} opacity={dripOpacity} />
        </svg>

        {
    /* ── Text ── */
  }
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span style={{ fontFamily: FONTS.openSans, fontSize: "13px", color: T.textMuted, letterSpacing: "0.04em" }}>
            Please wait
          </span>
          <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "26px", color: T.primary, letterSpacing: "-0.01em" }}>
            Loading{dots}
          </span>
        </div>

        {
    /* ── Percentage counter ── */
  }
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>

          {
    /* Tens digit — static large */
  }
          <span
    style={{
      fontFamily: FONTS.openSans,
      fontWeight: FONT_WEIGHTS.medium,
      fontSize: "52px",
      color: T.primary,
      lineHeight: 1,
      minWidth: "32px",
      display: "inline-block",
      textAlign: "center"
    }}
  >
            {tens}
          </span>

          {
    /* Units digit — same size, flickers on change */
  }
          <span
    style={{
      fontFamily: FONTS.openSans,
      fontWeight: FONT_WEIGHTS.medium,
      fontSize: "52px",
      color: T.primary,
      lineHeight: 1,
      minWidth: "32px",
      display: "inline-block",
      textAlign: "center",
      opacity: flip ? 0.3 : 1,
      transition: flip ? "none" : "opacity 0.12s ease"
    }}
  >
            {units}
          </span>

          {
    /* Percent symbol */
  }
          <span
    style={{
      fontFamily: FONTS.openSans,
      fontWeight: FONT_WEIGHTS.medium,
      fontSize: "28px",
      color: T.primary,
      lineHeight: 1,
      marginLeft: "4px"
    }}
  >
            %
          </span>
        </div>
      </div>
    </div>;
}

export { PageLoader as default };
