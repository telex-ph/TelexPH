import { getApiBaseUrl } from "@/lib/api-base";
import { getOrCreateVisitorSessionId, getVisitorEmail } from "@/lib/page-view-session";
function trackOutboundFunnelView(funnelUrl, options) {
  if (typeof window === "undefined") return;
  const path = funnelUrl?.trim();
  if (!path) return;
  const sessionId = getOrCreateVisitorSessionId();
  if (!sessionId) return;
  const email = getVisitorEmail();
  const payload = {
    path,
    referrer: typeof document !== "undefined" ? document.referrer || window.location.href || "" : "",
    sessionId,
    kind: "funnel"
  };
  if (email) payload.email = email;
  const label = options?.label?.trim();
  if (label) payload.funnelLabel = label.slice(0, 120);
  console.log(`[TrackFunnel] Recording view for ${path} (${label || "no label"})`);
  fetch(`${getApiBaseUrl()}/page-views/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "omit",
    keepalive: true
  }).catch(() => {
  });
}
export {
  trackOutboundFunnelView
};
