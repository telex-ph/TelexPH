
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
const MIN_VISIBLE_MS = 650;
function LogoutOverlay({
  portalLabel,
  accent = "#800000",
  onDone,
  ready = true
}) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shownAtRef = useRef(Date.now());
  useEffect(() => {
    if (!ready) return;
    const elapsed = Date.now() - shownAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const finish = setTimeout(() => onDoneRef.current(), remaining);
    return () => clearTimeout(finish);
  }, [ready]);
  if (!mounted) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{ opacity: 1 }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loRingPop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes loDoorDraw {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes loRipple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes loLogoIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes loTextIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes loDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      ` }} />

      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
      backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
      backgroundSize: "26px 26px"
    }} />
      <div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: 480, height: 480, background: `${accent}33`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
    />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="relative mb-7 w-20 h-20 flex items-center justify-center">
          <span
      className="absolute inset-0 rounded-full"
      style={{ border: `2px solid ${accent}`, animation: "loRipple 1.6s ease-out infinite" }}
    />
          <div
      className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${accent}, #2a0000)`,
        animation: "loRingPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both"
      }}
    >
            {
      /* Logout / door-out icon, drawn on entry */
    }
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="40"
      strokeDashoffset="40"
      style={{ animation: "loDoorDraw 0.5s ease-out 0.35s forwards" }}
    />
            </svg>
          </div>
        </div>

        <div
      className="mb-2 w-9 h-9 relative opacity-0"
      style={{ animation: "loLogoIn 0.5s ease-out 0.15s forwards" }}
    >
          <Image src="/images/Tlxlogo.webp" alt="TelexPH logo" fill className="object-contain" priority />
        </div>

        <h1
      className="text-2xl font-bold tracking-tight text-white mb-1.5 font-poppins opacity-0"
      style={{ animation: "loTextIn 0.5s ease-out 0.25s forwards" }}
    >
          Logging out
        </h1>
        <p
      className="text-sm text-gray-400 font-open-sans opacity-0"
      style={{ animation: "loTextIn 0.5s ease-out 0.35s forwards" }}
    >
          Signing you out of {portalLabel}
        </p>

        <div className="flex items-center gap-1.5 mt-6 opacity-0" style={{ animation: "loTextIn 0.5s ease-out 0.45s forwards" }}>
          {[0, 1, 2].map((i) => <span
      key={i}
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: accent, animation: `loDotBounce 1s ease-in-out ${i * 0.15}s infinite` }}
    />)}
        </div>
      </div>
    </div>,
    document.body
  );
}
export {
  LogoutOverlay as default
};
