import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { FONTS, TYPOGRAPHY, FONT_WEIGHTS } from "@/constant/styles";

// Shared FAQ accordion: blog posts and case studies both render their "Frequently Asked Questions" section with it.
const T = { primary: "#a10000", white: "#ffffff", borderLight: "#e4e4e7", textDark: "#0a0a0a", textBody: "rgba(0,0,0,0.60)" };

const URL_RE = /https?:\/\/[^\s<]+/g;
// Sanitize, turn bare URLs into links, and open every link in a new tab.
export const sanitizeHtml = (html) => {
  const clean = DOMPurify.sanitize(html || "", {
    ALLOWED_TAGS: ["p", "br", "ul", "ol", "li", "strong", "em", "b", "i", "u", "a", "h1", "h2", "h3", "h4", "blockquote", "code", "pre", "span"],
    ALLOWED_ATTR: ["href", "target", "rel"]
  });
  if (typeof document === "undefined") return clean;
  const tpl = document.createElement("template");
  tpl.innerHTML = clean;
  const walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_TEXT);
  const texts = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (!n.parentElement?.closest("a") && /https?:\/\//.test(n.data)) texts.push(n);
  for (const node of texts) {
    const frag = document.createDocumentFragment();
    let last = 0;
    for (const m of node.data.matchAll(URL_RE)) {
      const url = m[0].replace(/[.,;:!?)]+$/, "");
      frag.append(node.data.slice(last, m.index));
      const a = document.createElement("a");
      a.href = url;
      a.textContent = url;
      frag.append(a);
      last = m.index + url.length;
    }
    frag.append(node.data.slice(last));
    node.replaceWith(frag);
  }
  tpl.content.querySelectorAll("a[href]").forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
  return tpl.innerHTML;
};

function FaqItem({ question, answer, isOpen, onToggle }) {
  const answerRef = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (answerRef.current) setHeight(isOpen ? answerRef.current.scrollHeight : 0);
  }, [isOpen]);
  return <div style={{ borderRadius: "14px", border: `1px solid ${T.borderLight}`, background: T.white, overflow: "hidden", transition: "all 0.3s", boxShadow: isOpen ? "0 2px 12px rgba(0,0,0,0.06)" : "none" }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "14px", color: T.textDark, lineHeight: 1.5, flex: 1 }}>{question}</span>
        <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: isOpen ? T.primary : T.textDark, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.25s" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="2" y1="6" x2="10" y2="6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="6" y1="2" x2="6" y2="10" stroke="white" strokeWidth="1.8" strokeLinecap="round" style={{ transformOrigin: "6px 6px", transform: isOpen ? "scaleY(0)" : "scaleY(1)", transition: "transform 0.25s ease" }} />
          </svg>
        </span>
      </button>
      <div style={{ height: `${height}px` }} className="overflow-hidden transition-[height] duration-300 ease-in-out print:!h-auto">
        <div ref={answerRef}>
          <div style={{ margin: "0 20px", height: "1px", background: T.borderLight }} />
          <div className="px-5 py-4">
            <div
    style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", color: T.textBody, lineHeight: "1.85" }}
    className="[&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-3 [&_li]:leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold"
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(answer) }}
  />
          </div>
        </div>
      </div>
    </div>;
}
export function FaqSection({ content, sectionTitle, schema = true }) {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = React.useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const items = [];
    const h3s = doc.querySelectorAll("h3");
    if (h3s.length > 0) {
      h3s.forEach((h3) => {
        const question = h3.textContent?.trim() || "";
        let answerHtml = "";
        let sibling = h3.nextElementSibling;
        while (sibling && sibling.tagName !== "H3") {
          answerHtml += sibling.outerHTML;
          sibling = sibling.nextElementSibling;
        }
        if (question) items.push({ question, answer: answerHtml });
      });
      return items;
    }
    const paragraphs = Array.from(doc.querySelectorAll("p"));
    if (paragraphs.length > 0) {
      const hasQA = paragraphs.some((p) => /^Q[:\s]/i.test(p.textContent?.trim() || ""));
      if (hasQA) {
        let i = 0;
        while (i < paragraphs.length) {
          const pText = paragraphs[i].textContent?.trim() || "";
          if (/^Q[:\s]/i.test(pText)) {
            const strong = paragraphs[i].querySelector("strong, b");
            let question = strong ? strong.textContent?.trim() || "" : pText;
            question = question.replace(/^Q:\s*/i, "").trim();
            let answerHtml = "";
            if (i + 1 < paragraphs.length) {
              answerHtml = paragraphs[i + 1].outerHTML.replace(/^(<p[^>]*>)\s*A:\s*/i, "$1");
              i += 2;
            } else i += 1;
            if (question) items.push({ question, answer: answerHtml });
          } else i += 1;
        }
        if (items.length > 0) return items;
      }
    }
    // Editor format: question line ending in "?", answer <p>s, <p><br></p> between pairs,
    // optional trailing "Sources" block kept visible below the accordion.
    // ponytail: an answer line ending in "?" starts a new question; use <h3> questions if that bites.
    const nodes = Array.from(doc.body.childNodes);
    const html = (n) => n.outerHTML ?? Object.assign(doc.createElement("p"), { textContent: n.textContent }).outerHTML;
    const srcAt = nodes.findIndex((n) => /^sources:?$/i.test(n.textContent.trim()));
    for (const n of srcAt < 0 ? nodes : nodes.slice(0, srcAt)) {
      const t = n.textContent.trim();
      if (!t) continue;
      if (t.endsWith("?")) items.push({ question: t, answer: "" });
      else if (items.length) items[items.length - 1].answer += html(n);
    }
    if (items.length) {
      items.rest = srcAt < 0 ? "" : nodes.slice(srcAt).map(html).join("");
      return items;
    }
    const lis = doc.querySelectorAll("li");
    if (lis.length > 0) {
      lis.forEach((li) => {
        const strong = li.querySelector("strong, b");
        if (strong) {
          const q = strong.textContent?.trim() || "";
          strong.remove();
          items.push({ question: q, answer: li.innerHTML.trim() });
        } else {
          const t = li.textContent?.trim() || "";
          if (t) items.push({ question: t, answer: "" });
        }
      });
      return items;
    }
    return [];
  }, [content]);
  // FAQPage structured data for Google rich results; the prerender snapshot keeps it in the static HTML.
  const faqLd = React.useMemo(() => {
    const answered = faqs.filter((f) => f.answer);
    if (!answered.length) return null;
    const toText = (html) => new DOMParser().parseFromString(html, "text/html").body.textContent.trim();
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: answered.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: toText(f.answer) } }))
    };
  }, [faqs]);
  return <div className="my-10">
      {schema && faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
        <div style={{ width: "4px", height: "28px", backgroundColor: T.primary, borderRadius: "2px", flexShrink: 0, marginTop: "4px" }} />
        <h2 className="text-xl sm:text-2xl tracking-tight" style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: T.textDark, margin: 0 }}>
          {sectionTitle || "Frequently Asked Questions"}
        </h2>
      </div>
      {faqs.length > 0 ? <div className="space-y-2">
          {faqs.map((faq, i) => <FaqItem key={i} index={i} question={faq.question} answer={faq.answer} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />)}
          {faqs.rest && <div
    style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", color: T.textBody, lineHeight: "1.85" }}
    className="pt-4 [&_p]:mb-2 [&_strong]:font-bold [&_a]:underline [&_a]:underline-offset-2 [&_a]:break-all [&_a:hover]:opacity-70"
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(faqs.rest) }}
  />}
        </div> : <div
    style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", color: T.textBody, lineHeight: "1.85" }}
    className="[&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:font-bold [&_a]:underline [&_a]:underline-offset-2 [&_a]:break-all"
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
  />}
    </div>;
}
export function isFaqSection(title) {
  const l = title.toLowerCase();
  return l.includes("frequently asked") || l.includes("faq") || l.includes("common question") || l.includes("questions about");
}
