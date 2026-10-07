import DOMPurify from "dompurify";

// Same allow-list the public blog page renders with, so what the editor
// produces is exactly what visitors see.
const SANITIZE = {
  ALLOWED_TAGS: ["p", "br", "ul", "ol", "li", "strong", "em", "b", "i", "u", "a", "h1", "h2", "h3", "h4", "blockquote", "code", "pre", "span"],
  ALLOWED_ATTR: ["href", "target", "rel"]
};
const HTML_RE = /<\/?(p|br|ul|ol|li|strong|em|b|i|u|a|h[1-4]|blockquote|code|pre|span|div)\b/i;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const sanitizeHtml = (html) => DOMPurify.sanitize(html || "", SANITIZE);

// Content saved before the toolbar existed is plain text with newlines.
// Anything without tags becomes paragraphs; HTML passes through sanitized.
export const toHtml = (value) => {
  if (!value || !value.trim()) return "";
  if (HTML_RE.test(value)) return sanitizeHtml(value);
  return value.trim().split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");
};

// Visible text only — for char/word counts, validation and short previews.
export const htmlToText = (value) => {
  if (!value) return "";
  if (!HTML_RE.test(value)) return value.replace(/\s+/g, " ").trim();
  const el = document.createElement("div");
  el.innerHTML = sanitizeHtml(value.replace(/<\/(p|li|h[1-4]|blockquote|pre)>|<br\s*\/?>/gi, " "));
  return el.textContent.replace(/\s+/g, " ").trim();
};
