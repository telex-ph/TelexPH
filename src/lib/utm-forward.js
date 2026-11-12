// First-touch UTMs on telexph.com, forwarded to links that go to intl.telexph.com (where the booking form is).
// Same rules as firstAttr in public/intl/booking.js: the first tagged visit is kept 30 days and never overwritten.
const KEY = "telexFirstAttr";
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const VALUE_RE = /^[A-Za-z0-9 _.\-+:,()]{1,300}$/;
const KEEP_MS = 30 * 86400e3;
const INTL_HOST = "intl.telexph.com";

/** The record to keep ({ at, utm_*... }), or null when neither the saved record nor the URL has a UTM. */
export function firstAttr(saved, q, now) {
  const age = saved ? now - saved.at : NaN;
  if (age >= 0 && age < KEEP_MS && UTM.some((k) => saved[k])) return saved;
  const rec = { at: now };
  UTM.forEach((k) => {
    const v = String(q.get(k) || "").trim();
    if (VALUE_RE.test(v)) rec[k] = v;
  });
  return Object.keys(rec).length > 1 ? rec : null;
}

/** href with the saved UTMs when it points to intl; any other link, or nothing saved, is left as is. */
export function intlHref(href, saved, base) {
  let url;
  try { url = new URL(href, base); } catch { return href; }
  if (url.hostname !== INTL_HOST || !saved) return href;
  UTM.forEach((k) => (saved[k] ? url.searchParams.set(k, saved[k]) : url.searchParams.delete(k)));
  return url.toString();
}

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};

export function saveFirstTouch(search) {
  try {
    const saved = read();
    const first = firstAttr(saved, new URLSearchParams(search), Date.now());
    if (first && first !== saved) localStorage.setItem(KEY, JSON.stringify(first));
  } catch { /* storage blocked: nothing to forward */ }
}

/** For window.open() links; <a> links are handled by forwardClick. */
export const withFirstTouch = (href) => intlHref(href, firstAttr(read(), new URLSearchParams(), Date.now()), location.href);

/** click/auxclick listener: rewrites an intl link just before the browser follows it. */
export function forwardClick(e) {
  const a = e.target?.closest?.("a[href]");
  if (!a) return;
  const next = withFirstTouch(a.href);
  if (next !== a.href) a.href = next;
}
