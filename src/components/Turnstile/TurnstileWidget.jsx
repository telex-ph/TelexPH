
import { useEffect, useRef } from "react";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const SCRIPT_ID = "cf-turnstile-script";
function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve) => {
      if (window.turnstile) resolve();
      else existing.addEventListener("load", () => resolve());
    });
  }
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
function TurnstileWidget({ onVerify, onExpire, className, theme = "light" }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let cancelled = false;
    loadTurnstileScript().then(() => {
      if (cancelled || !window.turnstile || !containerRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current?.(),
        theme
      });
    });
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey, theme]);
  if (!siteKey) {
    return <p className="text-xs text-red-500 font-open-sans">
        Human verification is not configured (missing VITE_TURNSTILE_SITE_KEY).
      </p>;
  }
  return <div className="flex justify-center">
      <div ref={containerRef} className={className} />
    </div>;
}
export {
  TurnstileWidget as default
};
