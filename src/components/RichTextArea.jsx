import { useRef, useEffect } from "react";
import { sanitizeHtml, toHtml } from "@/lib/rich-text";

// Formatting toolbar + contentEditable field. `value`/`onChange` are HTML strings
// (plain text from older records or AI output is converted on load).
// ponytail: document.execCommand is deprecated but still works in every browser
// and needs no dependency; swap for Tiptap if it is ever removed.

const Icon = ({ d }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;

const TOOLS = [
  { id: "bold", label: "Bold (Ctrl+B)", node: <span style={{ fontWeight: 800 }}>B</span> },
  { id: "italic", label: "Italic (Ctrl+I)", node: <span style={{ fontStyle: "italic", fontWeight: 600 }}>I</span> },
  { id: "underline", label: "Underline (Ctrl+U)", node: <span style={{ textDecoration: "underline", fontWeight: 600 }}>U</span> },
  { id: "sep1" },
  { id: "h3", label: "Heading", node: <span style={{ fontWeight: 700 }}>H</span> },
  { id: "quote", label: "Quote", node: <Icon d="M3 21c3 0 7-1 7-8V5H3v8h4c0 3-2 4-4 4zM14 21c3 0 7-1 7-8V5h-7v8h4c0 3-2 4-4 4z" /> },
  { id: "sep2" },
  { id: "ul", label: "Bulleted list", node: <Icon d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /> },
  { id: "ol", label: "Numbered list", node: <Icon d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 14H4l2 2-2 2h2" /> },
  { id: "sep3" },
  { id: "link", label: "Insert link", node: <Icon d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1 1M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1-1" /> },
  { id: "clear", label: "Clear formatting", node: <Icon d="M4 7V4h16v3M9 20h6M12 4v16M3 3l18 18" /> }
];

function RichTextArea({ value, onChange, placeholder, minHeight = 120 }) {
  const ref = useRef(null);
  const lastHtml = useRef(null);

  // Only touch the DOM when the value changed from outside (reset, AI fill,
  // edit load) — typing already matches it, and rewriting would jump the caret.
  useEffect(() => {
    if (value !== lastHtml.current) {
      ref.current.innerHTML = toHtml(value);
      lastHtml.current = value;
    }
  }, [value]);

  const emit = () => {
    const el = ref.current;
    const html = el.textContent.trim() ? sanitizeHtml(el.innerHTML.replace(/<div>/g, "<p>").replace(/<\/div>/g, "</p>")) : "";
    lastHtml.current = html;
    onChange(html);
  };

  const exec = (cmd, arg) => {
    ref.current.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };

  const toggleBlock = (tag) => {
    const current = (document.queryCommandValue("formatBlock") || "").toLowerCase();
    exec("formatBlock", current === tag ? "p" : tag);
  };

  const run = (id) => {
    switch (id) {
      case "bold": case "italic": case "underline": return exec(id);
      case "h3": return toggleBlock("h3");
      case "quote": return toggleBlock("blockquote");
      case "ul": return exec("insertUnorderedList");
      case "ol": return exec("insertOrderedList");
      case "clear":
        ref.current.focus();
        document.execCommand("removeFormat");
        document.execCommand("unlink");
        return exec("formatBlock", "p");
      case "link": {
        const url = window.prompt("Link URL (https://…)");
        if (!url || !url.trim()) return;
        const href = /^(https?:\/\/|mailto:)/i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
        ref.current.focus();
        document.execCommand("createLink", false, href);
        ref.current.querySelectorAll("a").forEach((a) => {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        });
        return emit();
      }
    }
  };

  return <div className="rta" style={{ border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-surface)", overflow: "hidden" }}>
      <div role="toolbar" aria-label="Text formatting" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, padding: "4px 6px", borderBottom: "1px solid var(--admin-border)", background: "var(--admin-bg-soft)" }}>
        {TOOLS.map((t) => t.label ? <button
          key={t.id}
          type="button"
          title={t.label}
          aria-label={t.label}
          className="rta-btn"
          // keep the editor's selection/focus while clicking a tool
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run(t.id)}
        >{t.node}</button> : <span key={t.id} aria-hidden="true" style={{ width: 1, height: 16, background: "var(--admin-border)", margin: "0 4px" }} />)}
      </div>
      <div
        ref={ref}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className="rta-editor"
        style={{ minHeight }}
        onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
        onInput={emit}
        onBlur={() => {
          if (!ref.current.textContent.trim()) ref.current.innerHTML = "";
        }}
        onPaste={(e) => {
          e.preventDefault();
          const html = e.clipboardData.getData("text/html");
          if (html) document.execCommand("insertHTML", false, sanitizeHtml(html));
          else document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
          emit();
        }}
      />
    </div>;
}

export default RichTextArea;
