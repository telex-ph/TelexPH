const STORAGE_KEY = "telexph_site_vid";
const EMAIL_STORAGE_KEY = "telexph_site_email";

export function getOrCreateVisitorSessionId(): string {
  
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `v_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function setVisitorEmail(email: string): void {
  if (typeof window === "undefined") return;
  const clean = (email || "").trim();
  try {
    if (!clean) {
      localStorage.removeItem(EMAIL_STORAGE_KEY);
      return;
    }
    localStorage.setItem(EMAIL_STORAGE_KEY, clean.slice(0, 200));
  } catch {}
}

export function getVisitorEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return (localStorage.getItem(EMAIL_STORAGE_KEY) || "").trim();
  } catch {
    return "";
  }
}
