import { getApiBaseUrl } from "@/lib/api-base";
import { getOrCreateVisitorSessionId, getVisitId, getVisitorEmail } from "@/lib/page-view-session";
/**
 * Record that this visitor submitted a form (a real conversion). Call it only after the submission succeeded.
 * `type` is shown in the admin Visitor Journey, e.g. "Contact form".
 */
function trackConversion(type, email) {
  if (typeof window === "undefined") return;
  const sessionId = getOrCreateVisitorSessionId();
  if (!sessionId) return;
  const known = (email || getVisitorEmail() || "").trim();
  const payload = {
    path: window.location.pathname,
    referrer: document.referrer || "",
    sessionId,
    visitId: getVisitId(),
    kind: "conversion",
    conversionType: type
  };
  if (known) payload.email = known.slice(0, 200);
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
  trackConversion
};
