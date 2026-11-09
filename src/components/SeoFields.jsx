// "SEO & search" card for the admin blog and case-study forms. The fields and limits are the same as the
// posting API's (telexph-admin/src/content-api), so a draft made by the API can be checked and edited here
// before it is approved. Styled only with admin tokens so it works in every dashboard theme.

import { SEO_MAX, seoError } from "@/lib/seo-fields";

// Helpers live in lib/seo-fields.js (plain JS, unit-tested); re-exported so the forms import everything from here.
export { SEO_MAX, NEWSLETTER_SEO_MAX, emptySeo, seoFromRecord, seoError, seoPayload, appendSeo, withoutGeneratedFaq } from "@/lib/seo-fields";

const lbl = { fontSize: 12, fontWeight: 600, color: "var(--admin-text-sub)", display: "block", marginBottom: 6 };
const hint = { fontSize: 11, color: "var(--admin-text-sub)", margin: "5px 0 0", fontWeight: 400 };
const input = {
  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--admin-border-strong)",
  background: "var(--admin-surface)", color: "var(--admin-text)", fontSize: 13, outline: "none", fontWeight: 400, boxSizing: "border-box",
};
const iconBtn = {
  width: 34, height: 34, borderRadius: 9, border: "1px solid var(--admin-border)", background: "transparent",
  color: "var(--admin-text-faint)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
};

function Counter({ value, max }) {
  const n = value.trim().length;
  return <span style={{ fontSize: 11, color: n > max ? "var(--admin-danger)" : "var(--admin-text-sub)", flexShrink: 0 }}>{n}/{max}</span>;
}

function Field({ label, value, max, hintText, children }) {
  return <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
        <span style={{ ...lbl, marginBottom: 0 }}>{label}</span>
        <Counter value={value} max={max} />
      </div>
      {children}
      {hintText && <p style={hint}>{hintText}</p>}
    </div>;
}

export default function SeoFields({ n, value, onChange, max = SEO_MAX }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const setFaq = (i, patch) => set({ faq: value.faq.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });
  const error = seoError(value, max);
  return <div style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 16, boxShadow: "var(--admin-shadow-sm)", padding: 22 }}>
      <style>{`
        .sf-input:focus { border-color: var(--admin-accent) !important; }
        .sf-input::placeholder { color: var(--admin-text-sub); opacity: .6; }
        .sf-add:hover { background: var(--admin-accent-soft); }
      `}</style>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
        {n !== undefined && <div style={{ width: 30, height: 30, borderRadius: 9, border: "1.5px solid color-mix(in srgb, var(--admin-accent) 35%, transparent)", color: "var(--admin-accent-text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{n}</div>}
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--admin-text)", margin: 0 }}>SEO &amp; search</p>
          <p style={{ fontSize: 12, color: "var(--admin-text-sub)", margin: "3px 0 0", fontWeight: 400 }}>How this page looks in Google and to screen readers. Blank fields fall back to the title and description.</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Meta title" value={value.metaTitle} max={max.metaTitle} hintText="The title shown in search results.">
          <input className="sf-input" style={input} value={value.metaTitle} onChange={(e) => set({ metaTitle: e.target.value })} placeholder="e.g., Cut Average Handle Time by 20%" />
        </Field>
        <Field label="Meta description" value={value.metaDescription} max={max.metaDescription} hintText="One or two sentences shown under the title in search results.">
          <textarea className="sf-input" rows={3} style={{ ...input, resize: "vertical", fontFamily: "inherit" }} value={value.metaDescription} onChange={(e) => set({ metaDescription: e.target.value })} placeholder="e.g., How a TelexPH support team reduced handle time by 20% in six weeks." />
        </Field>
        <Field label="Cover image alt text" value={value.coverAlt} max={max.coverAlt} hintText="Describe the cover image in a short sentence, for screen readers and image search.">
          <input className="sf-input" style={input} value={value.coverAlt} onChange={(e) => set({ coverAlt: e.target.value })} placeholder="e.g., Support agents working at their desks" />
        </Field>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
            <span style={{ ...lbl, marginBottom: 0 }}>FAQ</span>
            <span style={{ fontSize: 11, color: "var(--admin-text-sub)" }}>{value.faq.length}/{max.faq}</span>
          </div>
          <p style={{ ...hint, margin: "0 0 10px" }}>Question and answer pairs. They show as an accordion at the end of the page and feed Google's FAQ results.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {value.faq.map((f, i) => <div key={i} style={{ padding: "14px 16px", borderRadius: 14, background: "var(--admin-bg-soft)", border: "1px solid var(--admin-border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ ...lbl, marginBottom: 0 }}>Question {i + 1}</span>
                  <button type="button" onClick={() => set({ faq: value.faq.filter((_, idx) => idx !== i) })} aria-label={`Remove question ${i + 1}`} style={iconBtn}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input className="sf-input" style={input} value={f.question} maxLength={max.question} onChange={(e) => setFaq(i, { question: e.target.value })} placeholder="Question, e.g., How long did it take?" aria-label={`FAQ question ${i + 1}`} />
                  <textarea className="sf-input" rows={3} style={{ ...input, resize: "vertical", fontFamily: "inherit" }} value={f.answer} maxLength={max.answer} onChange={(e) => setFaq(i, { answer: e.target.value })} placeholder="Answer, in plain text" aria-label={`FAQ answer ${i + 1}`} />
                </div>
              </div>)}
            {value.faq.length < max.faq && <button type="button" className="sf-add" onClick={() => set({ faq: [...value.faq, { question: "", answer: "" }] })} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", borderRadius: 12, border: "1.5px dashed var(--admin-border)", background: "transparent", color: "var(--admin-text-sub)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Add a question
              </button>}
          </div>
        </div>
        {error && <p role="alert" style={{ fontSize: 12, color: "var(--admin-danger)", margin: 0 }}>{error}</p>}
      </div>
    </div>;
}
