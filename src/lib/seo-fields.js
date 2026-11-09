// Pure helpers behind the admin SEO card (components/SeoFields.jsx). The fields and limits are the same as the
// posting API's (telexph-admin/src/content-api/seo-fields.js).

export const SEO_MAX = { metaTitle: 60, metaDescription: 155, coverAlt: 200, question: 300, answer: 3000, faq: 20 };
/** Newsletter issues: the FAQ becomes part of the page design, so the FAQ limits are tighter. */
export const NEWSLETTER_SEO_MAX = { ...SEO_MAX, question: 160, answer: 1500, faq: 10 };
const QUESTION_MIN = 3;

/** A meta description cut to SEO_MAX.metaDescription at a word boundary, for pages that fall back to longer text. */
export const clipDescription = (text) => {
  const max = SEO_MAX.metaDescription;
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : cut.length).replace(/[\s,;:.]+$/, "")}…`;
};

export const emptySeo = () => ({ metaTitle: "", metaDescription: "", coverAlt: "", faq: [] });

/** Form state from a saved blog or case study (older ones have none of these fields). */
export const seoFromRecord = (r) => ({
  metaTitle: r?.metaTitle || "",
  metaDescription: r?.metaDescription || "",
  coverAlt: r?.coverAlt || "",
  faq: (r?.faq || []).map((f) => ({ question: f.question || "", answer: f.answer || "" })),
});

const filled = (f) => f.question.trim() && f.answer.trim();
const touched = (f) => f.question.trim() || f.answer.trim();

/** A readable problem with the SEO fields, or "" when they can be saved. Used to hold back the save button. `max` = the limits (SEO_MAX by default). */
export function seoError(seo, max = SEO_MAX) {
  if (seo.metaTitle.trim().length > max.metaTitle) return "Meta title is too long.";
  if (seo.metaDescription.trim().length > max.metaDescription) return "Meta description is too long.";
  if (seo.coverAlt.trim().length > max.coverAlt) return "Cover image alt text is too long.";
  const rows = seo.faq.filter(touched);
  if (rows.length > max.faq) return `Use at most ${max.faq} FAQ questions.`;
  if (rows.some((f) => !filled(f))) return "Fill in both the question and the answer of each FAQ, or remove the empty one.";
  if (rows.some((f) => f.question.trim().length < QUESTION_MIN || f.question.trim().length > max.question || f.answer.trim().length > max.answer)) return "An FAQ question or answer is too short or too long.";
  return "";
}

const cleanFaq = (faq) => faq.filter(filled).map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }));

/** Plain object for a JSON PATCH. Always sent, so clearing a field in the form clears it on the server. */
export const seoPayload = (seo) => ({
  metaTitle: seo.metaTitle.trim(),
  metaDescription: seo.metaDescription.trim(),
  coverAlt: seo.coverAlt.trim(),
  faq: cleanFaq(seo.faq),
});

/** Same fields for a multipart form (faq travels as a JSON string). */
export function appendSeo(formData, seo) {
  const p = seoPayload(seo);
  formData.append("metaTitle", p.metaTitle);
  formData.append("metaDescription", p.metaDescription);
  formData.append("coverAlt", p.coverAlt);
  formData.append("faq", JSON.stringify(p.faq));
}

const FAQ_TITLE = "Frequently Asked Questions";
/** Sections of a saved post minus the FAQ section the server builds from the FAQ pairs (it is edited in this card instead). */
export const withoutGeneratedFaq = (sections, record, titleKey = "title") =>
  record?.faq?.length ? (sections || []).filter((s) => s[titleKey] !== FAQ_TITLE) : sections || [];
