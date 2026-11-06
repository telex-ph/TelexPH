import NewsletterDesign from "./NewsletterDesign";

// Renders a newsletter issue from the layout the AI read off the uploaded design.
// Shared by the public newsletter page and the admin preview so both always look the same.
const periodLabel = (period) => {
  const [y, m] = String(period || "").split("-").map(Number);
  return y && m ? new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
};

const TITLE = { header: "2.25rem", hero: "2.5rem", text: "1.5rem", quote: "1.5rem", columns: "1.5rem", footer: "0.875rem" };
const BODY = { quote: "1.5rem", footer: "0.75rem" };

// Photos and graphics can't be rebuilt as text, so show that slice of the original upload.
function Crop({ band, page }) {
  // Redesigned layouts carry their own picture per band; read-in pages crop from the page's upload.
  const src = band.src || (page.imageUrl && page.width && page.height ? page : null);
  if (!src) return null;
  const span = Math.max(0.01, band.y1 - band.y0);
  const posY = span >= 1 ? 0 : (band.y0 / (1 - span)) * 100;
  return <div
    role="img"
    aria-label="Newsletter graphic"
    style={{
      width: "100%",
      aspectRatio: `${src.width} / ${span * src.height}`,
      backgroundImage: `url("${src.imageUrl}")`,
      backgroundSize: "100% auto",
      backgroundPosition: `0 ${posY}%`,
      backgroundRepeat: "no-repeat"
    }}
  />;
}

function Band({ band, page }) {
  if (band.type === "image") return <Crop band={band} page={page} />;
  const small = band.type === "footer";
  return <div style={{ background: band.bg, color: band.color, textAlign: band.align, padding: small ? "16px 32px" : "36px 40px" }}>
      {band.title && <h2 style={{ fontSize: TITLE[band.type], fontWeight: 800, lineHeight: 1.2, margin: 0, color: band.type === "text" ? band.accent : band.color }}>{band.title}</h2>}
      {band.subtitle && <p style={{ fontSize: small ? "0.75rem" : "1.05rem", opacity: 0.85, margin: "8px 0 0" }}>{band.subtitle}</p>}
      {band.text && <p style={{ fontSize: BODY[band.type] || "1rem", fontStyle: band.type === "quote" ? "italic" : "normal", lineHeight: 1.7, margin: "12px 0 0", whiteSpace: "pre-line" }}>{band.text}</p>}
      {band.columns.length > 0 && <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginTop: band.title ? 20 : 0, textAlign: "left" }}>
          {band.columns.map((c, i) => <div key={i}>
              {c.title && <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: band.accent, margin: "0 0 6px" }}>{c.title}</h3>}
              {c.text && <p style={{ fontSize: "0.95rem", lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }}>{c.text}</p>}
            </div>)}
        </div>}
    </div>;
}

function Page({ page, n, edit }) {
  const layout = page.layout;
  if (layout?.sections) return <NewsletterDesign design={layout} edit={edit} />; // version 2 designs
  // No readable layout: show the upload as it is.
  if (!layout) return page.imageUrl ? <img src={page.imageUrl} alt={`Newsletter page ${n}`} className="block w-full" /> : null;
  return <div style={{ background: layout.background }}>
      {layout.bands.map((b, i) => <Band key={i} band={b} page={page} />)}
    </div>;
}

// `edit` turns the design into an editor (admin preview): { active, onPick(page, path, opts) } make photo slots clickable;
// { sel: {page, path}, onSelect(page, path), onMove(page, from, toArr, at), toolbar(page, path, kind) } make sections
// and blocks selectable and draggable.
// `only` (a page index) shows just that page, keeping page indexes in `edit` callbacks unchanged.
function NewsletterIssueView({ issue, showMeta = true, edit, only }) {
  const meta = [periodLabel(issue.period), issue.author && `By ${issue.author}`, issue.department && `${issue.department} Department`].filter(Boolean);
  const wide = (issue.pages || []).some((p) => p.layout?.sections); // multi-column designs need room
  return <article className={`mx-auto w-full ${wide ? "max-w-[1400px]" : "max-w-[820px]"}`}>
      {showMeta && <header className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">{issue.title || "Untitled issue"}</h2>
          {meta.length > 0 && <p className="mt-2 text-sm text-gray-500">{meta.join(" · ")}</p>}
        </header>}
      <div className="flex flex-col gap-12">
        {(issue.pages || []).map((p, i) => {
          if (only != null && i !== only) return null;
          const page = <Page page={p} n={i + 1} edit={edit && {
            ...edit,
            active: edit.active?.page === i ? edit.active.path : null,
            onPick: (path, opts) => edit.onPick(i, path, opts),
            sel: edit.sel?.page === i ? edit.sel.path : null,
            onSelect: edit.onSelect && ((path) => edit.onSelect(i, path)),
            onMove: edit.onMove && ((from, to, at) => edit.onMove(i, from, to, at)),
            toolbar: edit.toolbar && ((path, kind) => edit.toolbar(i, path, kind)),
            onText: edit.onText && ((path, v) => edit.onText(i, path, v)),
            onSpan: edit.onSpan && ((path, span) => edit.onSpan(i, path, span)),
            selIds: edit.sel?.page === i ? edit.sel.ids : null,
            onSelectFloats: edit.onSelectFloats && ((sec, ids) => edit.onSelectFloats(i, sec, ids)),
            onToggleFloat: edit.onToggleFloat && ((sec, id) => edit.onToggleFloat(i, sec, id)),
            onFloats: edit.onFloats && ((sec, map) => edit.onFloats(i, sec, map)),
            onFloat: edit.onFloat && ((sec, k, patch) => edit.onFloat(i, sec, k, patch)),
            onFloatTo: edit.onFloatTo && ((sec, k, to, patch) => edit.onFloatTo(i, sec, k, to, patch)),
            onFloatPhoto: edit.onFloatPhoto && ((path) => edit.onFloatPhoto(i, path)),
            autoEdit: edit.autoEdit?.page === i ? edit.autoEdit.id : null
          }} />;
          // Version-2 designs sit directly on the page with no frame; the older picture-like layouts keep a card.
          return p.layout?.sections ? <div key={i} data-page={i}>{page}</div> : <div key={i} className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">{page}</div>;
        })}
      </div>
    </article>;
}

export { periodLabel };
export default NewsletterIssueView;
