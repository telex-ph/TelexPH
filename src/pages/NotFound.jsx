import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { hideBugReportWidget } from "@/shared/BugReportWidget";

function DotGrid({ className, dot = "bg-[#A10000]" }) {
  return (
    <div className={`grid grid-cols-5 grid-rows-4 gap-1.5 opacity-30 ${className}`}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} className={`h-1 w-1 rounded-full ${dot}`} />
      ))}
    </div>
  );
}

// Real CSS 3D box (not hand-plotted SVG points) — front and side faces are
// actual planes rotated/translated in 3D space, so the browser computes the
// perspective instead of it being approximated by eyeballed coordinates.
function BrowserWindow3D() {
  // Sized to sit correctly against the SVG badge layer at the illustration's
  // max-w-3xl width; scaled up together with the surrounding artwork.
  const width = 430;
  const height = 315;
  const depth = 96; // px — wide enough to still read clearly once foreshortened by the rotation below
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ perspective: "1800px", perspectiveOrigin: "50% 50%" }}
    >
      <div
        className="relative"
        style={{
          width,
          height,
          transformStyle: "preserve-3d",
          // Y-axis rotation only. Adding rotateX on top of a large rotateY
          // tilts the box around a diagonal axis, which reads as a skewed
          // parallelogram rather than an upright box turned to the side.
          transform: "rotateY(-28deg)",
        }}
      >
        {/* side face: a depth x height panel, rotated 90° around its own left
            edge, then slid to x = width - depth so that (after rotation) its
            hinge line lands exactly on the front face's right edge. Both
            faces share the same untransformed parent origin — front face is
            NOT pushed forward — so the two edges meet with no gap. */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: width - depth,
            top: 0,
            width: depth,
            height,
            // Round the LEFT corners: after the -90deg hinge below, the panel's
            // right edge is the seam shared with the front face and must stay
            // square, while its left edge becomes the box's far back edge.
            borderRadius: "16px 0 0 16px",
            // Hinge on the shared right edge. NEGATIVE 90deg swings the panel
            // backwards (away from the viewer); +90deg swings it forward, which
            // makes it stick out through the front face as a wedge.
            transformOrigin: "right center",
            transform: "rotateY(-90deg)",
            // Starts at exactly the front face's bottom colour (#f7f7f9) so the
            // shared seam has no lighter sliver between the two faces, then
            // fades darker as the panel recedes from the viewer.
            background: "linear-gradient(270deg, #f7f7f9, #c4c8cf)",
          }}
        >
          {/* Matches the front face's h-9 title bar so the dark band wraps
              continuously around the corner, with the far (left) corner
              rounded to follow the panel's own silhouette. */}
          <div
            className="h-12 w-full"
            style={{
              // Same gradient logic as the panel body: starts at the front
              // bar's exact colour so the corner has no visible step.
              background: "linear-gradient(270deg, #282828, #1a1a1a)",
              borderRadius: "16px 0 0 0",
            }}
          />
        </div>

        {/* front face */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: "16px 0 0 16px",
            background: "linear-gradient(180deg, #ffffff, #f7f7f9)",
            // Drop shadow lives on the face but is spread wide/soft enough to
            // read as the whole box's shadow rather than stopping dead at the
            // seam with the side panel.
            boxShadow: "0 30px 60px -15px rgba(161,0,0,0.28)",
          }}
        >
          <div className="flex h-12 items-center gap-2 bg-[#282828] px-5">
            <span className="h-3 w-3 rounded-full bg-[#e05252]" />
            <span className="h-3 w-3 rounded-full bg-[#e0b552]" />
            <span className="h-3 w-3 rounded-full bg-white" />
            <span className="ml-4 h-2.5 w-52 rounded-full bg-white/25" />
          </div>

          <div className="flex h-[calc(100%-3rem)] items-center justify-center">
            <div className="flex h-44 w-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200">
              <svg viewBox="0 0 80 96" className="h-24 w-24" fill="none">
                <path
                  d="M0 8 a8 8 0 0 1 8 -8 h42 l22 22 v66 a8 8 0 0 1 -8 8 h-56 a8 8 0 0 1 -8 -8 Z"
                  fill="#ffffff"
                  stroke="#A10000"
                  strokeWidth="2.5"
                />
                <path d="M50 0 L50 20 a2 2 0 0 0 2 2 h20 Z" fill="#fdeaea" stroke="#A10000" strokeWidth="2" strokeLinejoin="round" />
                <path d="M20 40 L30 50 M30 40 L20 50" stroke="#A10000" strokeWidth="3" strokeLinecap="round" />
                <path d="M42 40 L52 50 M52 40 L42 50" stroke="#A10000" strokeWidth="3" strokeLinecap="round" />
                <path d="M18 70 a18 18 0 0 1 36 0" stroke="#A10000" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorPanel() {
  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 660 580"
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="floorBlur" x="-50%" y="-150%" width="200%" height="400%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <radialGradient id="sphereGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f1f2f3" />
            <stop offset="100%" stopColor="#dcdedf" />
          </radialGradient>
        </defs>

        {/* single soft ambient floor shadow beneath the whole cluster */}
        <ellipse cx="330" cy="498" rx="170" ry="24" fill="#282828" opacity="0.18" filter="url(#floorBlur)" />

        {/* dashed orbit */}
        <ellipse cx="330" cy="330" rx="240" ry="215" stroke="#A10000" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="2 8" />

        {/* two spheres, tucked partially behind the window's left/right edges */}
        <circle className="animate-illo-float-slow" cx="188" cy="300" r="16" fill="url(#sphereGrad)" />
        <circle className="animate-illo-float-med" cx="440" cy="446" r="12" fill="url(#sphereGrad)" />

        {/* faint dashed guide circle behind the airplane */}
        <circle cx="140" cy="120" r="50" stroke="#A10000" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="2 7" />

        {/* folded paper airplane + dashed curved trail, upper-left */}
        <g className="animate-illo-float-slow">
          <path
            d="M36 186 C 76 144, 86 100, 110 70"
            stroke="#A10000"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeDasharray="1 8"
            strokeLinecap="round"
            fill="none"
          />
          <g transform="translate(88 46) rotate(-32)">
            <path d="M0 26 L52 0 L28 52 L20 30 L0 26Z" fill="#A10000" />
            <path d="M20 30 L52 0 L20 30Z" fill="#A10000" opacity="0.55" />
            <path d="M0 26 L20 30 L28 52" stroke="#530607" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.7" />
          </g>
        </g>

        {/* two thin outline x marks — set back from the box's top-left corner */}
        <path d="M178 166 l14 14 m-14 0 l14 -14" stroke="#A10000" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
        <path d="M206 142 l12 12 m-12 0 l12 -12" stroke="#b9bcc4" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <BrowserWindow3D />

      {/* Foreground layer — must paint OVER the 3D box, so it lives in its own
          SVG after <BrowserWindow3D /> rather than sharing the back layer. */}
      <svg
        viewBox="0 0 660 580"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="badgeShadowFg" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#A10000" floodOpacity="0.3" />
          </filter>
          <filter id="panelShadowFg" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#A10000" floodOpacity="0.24" />
          </filter>
        </defs>

        {/* warning triangle — pushed further down-left, clear of the box */}
        <g className="animate-illo-float-med" filter="url(#badgeShadowFg)">
          <rect x="62" y="446" width="76" height="76" rx="20" fill="#A10000" />
          <path d="M72 456 v56" stroke="#fff" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M100 470 L122 508 L78 508 Z" stroke="#fff" strokeWidth="4" strokeLinejoin="round" fill="none" />
          <path d="M100 482 v12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="500" r="2.2" fill="#fff" />
        </g>

        {/* question mark speech bubble — pushed further up-right, clear of the box */}
        <g className="animate-illo-float-fast" filter="url(#badgeShadowFg)">
          <path d="M520 148 h74 a12 12 0 0 1 12 12 v28 a12 12 0 0 1 -12 12 h-48 l-15 17 v-17 h-11 a12 12 0 0 1 -12 -12 v-28 a12 12 0 0 1 12 -12 Z" fill="#A10000" />
          <text x="569" y="184" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="21" fill="#fff" letterSpacing="1">
            ???
          </text>
        </g>

        {/* magnifying glass — pushed further down-right so it grazes rather
            than covers the box's bottom-right corner */}
        <g filter="url(#panelShadowFg)">
          <path d="M546 494 L572 520" stroke="#A10000" strokeWidth="22" strokeLinecap="round" />
          <circle cx="502" cy="450" r="58" fill="#fff" />
          <circle cx="502" cy="450" r="58" fill="none" stroke="#A10000" strokeWidth="12" />
          <path d="M485 433 L519 467 M519 433 L485 467" stroke="#A10000" strokeWidth="7" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundArt() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Opaque blob first so the line art below paints on top of it. */}
      <svg
        className="absolute -left-24 -top-24 h-[420px] w-[420px] opacity-70 sm:h-[480px] sm:w-[480px]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M60 40 C 160 -10, 300 10, 350 100 C 400 190, 340 280, 240 320 C 140 360, 20 320, -10 220 C -35 140, -30 90, 60 40 Z"
          fill="#eceded"
        />
      </svg>

      {/* LOST? watermark — page-level, well clear of the illustration */}
      <div className="absolute right-8 top-12 hidden text-right lg:block xl:right-16 xl:top-16">
        <p
          className="font-poppins-black text-7xl uppercase leading-none tracking-tight text-transparent xl:text-8xl"
          style={{ WebkitTextStroke: "1.5px rgba(161,0,0,0.28)" }}
        >
          Lost?
        </p>
        <div className="mt-3 flex items-center justify-end gap-2">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#A10000]/50" />
          <p className="font-open-sans text-base tracking-wide text-[#282828]/70">
            Let&apos;s get you back on track.
          </p>
        </div>
        <span className="mt-2 inline-block h-1 w-16 rounded-full bg-gradient-to-l from-[#A10000] to-[#530607]/20" />
      </div>

      {/* concentric arc rings, upper-centre */}
      <svg
        className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 opacity-[0.16]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="96" stroke="#A10000" strokeWidth="0.8" strokeDasharray="3 6" />
        <circle cx="100" cy="100" r="74" stroke="#A10000" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="52" stroke="#530607" strokeWidth="0.8" strokeDasharray="2 5" />
      </svg>

      {/* thin cross-hatch ticks scattered across the top band */}
      <svg className="absolute left-0 top-0 h-64 w-full opacity-[0.5]" viewBox="0 0 1400 260" fill="none">
        <path d="M300 60 l9 9 m-9 0 l9 -9" stroke="#A10000" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M560 30 l7 7 m-7 0 l7 -7" stroke="#282828" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M760 96 l8 8 m-8 0 l8 -8" stroke="#A10000" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M1080 48 l7 7 m-7 0 l7 -7" stroke="#282828" strokeOpacity="0.25" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="420" cy="120" r="3" fill="#A10000" fillOpacity="0.3" />
        <circle cx="880" cy="40" r="2.5" fill="#530607" fillOpacity="0.3" />
        <circle cx="1200" cy="130" r="3" fill="#A10000" fillOpacity="0.22" />
        {/* long sweeping hairline that ties the top band together */}
        <path
          d="M120 210 C 380 120, 700 250, 980 140 S 1320 60, 1400 92"
          stroke="#A10000"
          strokeOpacity="0.22"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>

      {/* small outlined square, rotated — top centre-left accent */}
      <div className="absolute left-[26%] top-16 hidden h-12 w-12 rotate-12 rounded-lg border border-[#A10000]/25 lg:block" />
      <div className="absolute left-[31%] top-28 hidden h-5 w-5 -rotate-12 rounded border border-[#530607]/25 lg:block" />

      <div
        className="absolute right-1/4 top-1/4 h-[300px] w-[300px] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: "radial-gradient(circle, #A10000 0%, transparent 70%)" }}
      />

      {/* corner dot grids: top-left red-tinted, top-right gray, both tight in the corner */}
      <DotGrid className="absolute left-3 top-3 scale-90 opacity-40" dot="bg-[#A10000]" />
      <DotGrid className="absolute right-3 top-3 scale-90" dot="bg-gray-400" />
      <DotGrid className="absolute left-6 bottom-6" dot="bg-[#A10000]" />

      {/* halftone dot texture fading in the transition zone near bottom-right, above the wave */}
      <svg className="absolute bottom-[26%] right-0 h-40 w-64 opacity-70" viewBox="0 0 260 160">
        <defs>
          <radialGradient id="halftoneFade" cx="70%" cy="30%" r="75%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="halftoneMask">
            <rect width="100%" height="100%" fill="url(#halftoneFade)" />
          </mask>
        </defs>
        <g mask="url(#halftoneMask)" fill="#9aa0a8">
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 13 }).map((_, c) => (
              <circle key={`h-${r}-${c}`} cx={c * 20 + 6} cy={r * 20 + 6} r="2" />
            ))
          )}
        </g>
      </svg>

      {/* bottom maroon wave, full width, with a separate red squiggle accent tracing above its edge */}
      <svg
        className="absolute bottom-0 left-0 h-[34%] w-full min-w-[900px]"
        viewBox="0 0 1600 500"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <clipPath id="waveClip">
            <path d="M0 260 C 260 120, 420 380, 700 300 S 1180 120, 1600 260 L1600 500 L0 500 Z" />
          </clipPath>
          <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b0809" />
            <stop offset="100%" stopColor="#530607" />
          </linearGradient>
        </defs>

        <path d="M0 260 C 260 120, 420 380, 700 300 S 1180 120, 1600 260 L1600 500 L0 500 Z" fill="url(#waveFill)" />

        {/* A single echo contour under the crest — enough to give the wave
            depth without turning the footer into a busy pattern. */}
        <g clipPath="url(#waveClip)">
          <path
            d="M0 296 C 260 156, 420 416, 700 336 S 1180 156, 1600 296"
            stroke="#ffffff"
            strokeOpacity="0.18"
            strokeWidth="1.8"
            fill="none"
          />
        </g>

        <path
          d="M0 242 C 260 102, 420 362, 700 282 S 1180 102, 1600 242"
          stroke="#c0392b"
          strokeWidth="1.75"
          strokeLinecap="round"
          opacity="0.7"
          fill="none"
        />
        <path
          d="M0 260 C 260 120, 420 380, 700 300 S 1180 120, 1600 260"
          stroke="#A10000"
          strokeWidth="3"
          opacity="0.6"
          fill="none"
        />
      </svg>

      {/* One quiet dot grid on the maroon, bottom-right — the footer's only
          ornament, mirroring the dot grids in the page's top corners. */}
      <div className="absolute bottom-12 right-14 hidden grid-cols-5 grid-rows-4 gap-2.5 opacity-30 lg:grid">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-white" />
        ))}
      </div>

      {/* bottom-left circular badge, sitting exactly where the wave begins to rise from the left edge */}
      <div className="absolute bottom-[25%] left-4 flex h-20 w-20 translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] ring-2 ring-[#A10000]/25 sm:h-24 sm:w-24">
        <svg viewBox="0 0 40 40" className="h-11 w-11 sm:h-12 sm:w-12" fill="none">
          <circle cx="17" cy="17" r="13" fill="none" stroke="#A10000" strokeWidth="3" />
          <path d="M12 12 L22 22 M22 12 L12 22" stroke="#A10000" strokeWidth="3" strokeLinecap="round" />
          <path d="M26.5 26.5 L34 34" stroke="#A10000" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      {/* bottom-right: three ">" chevrons above a 5x4 dot grid, in the white area above the wave */}
      <div className="absolute bottom-[38%] right-10 flex flex-col items-end gap-4 sm:bottom-[36%] sm:right-14">
        <div className="flex items-center">
          <ChevronRight className="h-8 w-8 text-[#A10000] sm:h-9 sm:w-9" strokeWidth={3} />
          <ChevronRight className="-ml-4 h-8 w-8 text-[#A10000] sm:h-9 sm:w-9" strokeWidth={3} />
          <ChevronRight className="-ml-4 h-8 w-8 text-[#A10000] sm:h-9 sm:w-9" strokeWidth={3} />
        </div>
        <DotGrid className="opacity-60" dot="bg-[#A10000]" />
      </div>
    </div>
  );
}

function NotFound() {
  useEffect(() => hideBugReportWidget(), []);

  return (
    <div className="relative flex min-h-screen items-center overflow-hidden bg-[#F5F5F4] py-12">
      <BackgroundArt />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:px-8">
        {/* translate (not negative margin) so shifting the copy left doesn't
            resize the grid track and drag the illustration along with it */}
        <div className="lg:-translate-x-8 xl:-translate-x-12">
          <p className="font-open-sans-bold mb-2 inline-block border-b-[3px] border-[#A10000] pb-1 text-base uppercase tracking-wide text-[#A10000] sm:text-lg">
            Oops!
          </p>
          <h1 className="font-poppins-black text-[8rem] leading-none text-[#282828] sm:text-[11rem]">
            4<span className="text-[#A10000]">0</span>4
          </h1>
          <h2 className="font-poppins-black mt-3 text-4xl text-[#282828] sm:text-5xl">
            Page Not Found
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-[#A10000]" />
            <span className="h-px w-full max-w-[300px] border-t border-dashed border-[#A10000]/40" />
          </div>
          <p className="font-open-sans mt-4 max-w-lg text-lg leading-relaxed text-[#282828]/75 sm:text-xl">
            We can&apos;t seem to find the page you&apos;re looking for. It
            may have been removed, had its name changed, or is temporarily
            unavailable.
          </p>
        </div>

        {/* Shifted right and the LOST? tag lifted out of the flow, so the
            artwork itself centres against the copy instead of being pushed
            down by the height of the tag above it. */}
        <div className="relative mx-auto hidden w-full max-w-3xl md:block lg:translate-x-8 xl:translate-x-14">
          <div className="aspect-[620/580] w-full">
            <ErrorPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export { NotFound as default };
