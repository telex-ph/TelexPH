const STORAGE_KEY = "telexph_site_vid";
const EMAIL_STORAGE_KEY = "telexph_site_email";
const VISIT_KEY = "telexph_site_visit";
// A visit ends after 30 minutes without activity. Keep in sync with VISIT_GAP_SEC in the API's site-page-view.controller.js.
const VISIT_IDLE_MS = 30 * 60 * 1e3;
function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `v_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}
function getOrCreateVisitorSessionId() {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = newId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
/** Id of the visitor's current visit. Call it once per tracked event: it also marks the visit as active. */
function getVisitId(now = Date.now()) {
  if (typeof window === "undefined") return "";
  try {
    let visit = JSON.parse(localStorage.getItem(VISIT_KEY) || "null");
    if (!visit?.id || now - visit.last > VISIT_IDLE_MS) visit = { id: newId() };
    visit.last = now;
    localStorage.setItem(VISIT_KEY, JSON.stringify(visit));
    return visit.id;
  } catch {
    return "";
  }
}
function setVisitorEmail(email) {
  if (typeof window === "undefined") return;
  const clean = (email || "").trim();
  try {
    if (!clean) {
      localStorage.removeItem(EMAIL_STORAGE_KEY);
      return;
    }
    localStorage.setItem(EMAIL_STORAGE_KEY, clean.slice(0, 200));
  } catch {
  }
}
function getVisitorEmail() {
  if (typeof window === "undefined") return "";
  try {
    return (localStorage.getItem(EMAIL_STORAGE_KEY) || "").trim();
  } catch {
    return "";
  }
}
export {
  getVisitId,
  getOrCreateVisitorSessionId,
  getVisitorEmail,
  setVisitorEmail
};
