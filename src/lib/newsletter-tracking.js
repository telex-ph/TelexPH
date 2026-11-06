import { useEffect, useState, useCallback, useRef } from "react";
import { getApiBaseUrl } from "@/lib/api-base";

const KEY = "telexph_nl_vid"; // anonymous id kept in this browser: how "unique" readers are counted
const PING_MS = 15000;
const IDLE_MS = 30000; // no scroll/mouse/key for this long = they walked away; stop counting time
const id = () => (crypto.randomUUID ? crypto.randomUUID() : `v${Date.now()}${Math.random().toString(36).slice(2, 12)}`);

function visitorId() {
  try {
    let v = localStorage.getItem(KEY);
    if (!v) { v = id(); localStorage.setItem(KEY, v); }
    return v;
  } catch {
    return ""; // storage blocked: skip tracking rather than count the same person many times
  }
}

// Tracks one open issue: a view, the time actually spent reading, how far they scrolled, and their like.
export function useNewsletterTracking(slug) {
  const [stats, setStats] = useState({ likes: 0, liked: false });
  const vid = useRef("");

  const post = useCallback((path, body, keepalive = false) => {
    if (!vid.current) return Promise.resolve(null);
    return fetch(`${getApiBaseUrl()}/newsletter/issues/${encodeURIComponent(slug)}/${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, keepalive,
      body: JSON.stringify({ visitorId: vid.current, ...body })
    }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    vid.current = visitorId();
    if (!vid.current) return;
    post("view", { referrer: document.referrer, utmSource: new URLSearchParams(location.search).get("utm_source") || "" }).then((s) => s && setStats(s));

    let active = 0, sent = 0, scroll = 0, scrollSent = -1, lastAct = Date.now();
    const act = () => {
      lastAct = Date.now();
      const h = document.documentElement;
      scroll = Math.max(scroll, Math.min(100, Math.round(((window.scrollY + window.innerHeight) / Math.max(h.scrollHeight, 1)) * 100)));
    };
    const events = ["scroll", "mousemove", "keydown", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, act, { passive: true }));
    act();
    const tick = setInterval(() => { if (document.visibilityState === "visible" && Date.now() - lastAct < IDLE_MS) active++; }, 1000);
    const flush = (keepalive) => {
      const seconds = active - sent;
      if (seconds < 1 && scroll === scrollSent) return;
      sent += seconds; scrollSent = scroll;
      post("engage", { seconds, scroll }, keepalive);
    };
    const ping = setInterval(() => flush(false), PING_MS);
    const onHide = () => { if (document.visibilityState === "hidden") flush(true); };
    const onLeave = () => flush(true);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onLeave);
    return () => {
      clearInterval(tick); clearInterval(ping);
      events.forEach((e) => window.removeEventListener(e, act));
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onLeave);
      flush(true);
    };
  }, [slug, post]);

  const toggleLike = () => {
    const liked = !stats.liked;
    setStats((s) => ({ likes: Math.max(0, s.likes + (liked ? 1 : -1)), liked })); // show it right away; the server answer corrects it
    post("like", { liked }).then((s) => s && setStats(s));
  };

  return { ...stats, toggleLike };
}
