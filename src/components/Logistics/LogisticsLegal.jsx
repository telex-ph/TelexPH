import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Printer, Mail, ArrowRight } from "lucide-react";
import LogisticsNav from "./LogisticsNav";
import LogisticsFooter from "./LogisticsFooter";
import TitleHero from "@/components/About/TitleHero";
import { hideBugReportWidget } from "@/shared/BugReportWidget";
import { COLORS } from "@/constant/styles";
import { LEGAL_UPDATED, LEGAL_EMAIL, PRIVACY, TERMS } from "@/data/logistics-legal";

const RED = COLORS.primary;
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

/* Print / "Save as PDF": plain white document, no site chrome, cards that never split across pages. */
const PRINT_CSS = `
@page { size: A4; margin: 14mm 12mm; }
@media print {
  html, body { background: #fff !important; }
  .legal-noprint { display: none !important; }
  .legal-root { background: #fff !important; min-height: 0 !important; }
  .legal-hero { background: #fff !important; padding-top: 0 !important; border-bottom: 3px solid #a10000; }
  .legal-hero, .legal-hero * { color: #1c1c1c !important; }
  .legal-hero h1 { font-size: 30pt !important; }
  .legal-body { display: block !important; padding: 16px 0 0 !important; max-width: none !important; }
  .legal-card { opacity: 1 !important; transform: none !important; box-shadow: none !important; break-inside: avoid; page-break-inside: avoid; border: 1px solid #d9d9d9 !important; padding: 16px 18px !important; margin-bottom: 12px; }
  .legal-card h2 { font-size: 15pt !important; }
  .legal-card ul, .legal-card p { font-size: 10.5pt !important; line-height: 1.6 !important; }
  .legal-content { padding-left: 0 !important; }
  .legal-facts { background: #f4f4f4 !important; border-top: 0 !important; }
  a { text-decoration: none !important; }
}
`;

/* Shared layout for the logistics Privacy Policy and Terms pages. `doc` comes from data/logistics-legal.js. */
const LogisticsLegal = ({ doc }) => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(doc.sections[0].id);
  const other = doc === PRIVACY ? TERMS : PRIVACY;

  useEffect(() => hideBugReportWidget(), []);

  // highlight the contents entry for the section under the header
  useEffect(() => {
    const onScroll = () => {
      let current = doc.sections[0].id;
      for (const s of doc.sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 190) current = s.id;
      }
      // the footer follows the last section, so the page never scrolls far enough to bring its top
      // up to the header: treat the last section as current once it is fully on screen
      const last = document.getElementById(doc.sections[doc.sections.length - 1].id);
      if (last && last.getBoundingClientRect().bottom <= window.innerHeight) current = last.id;
      setActive((prev) => (prev === current ? prev : current));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [doc]);

  // keep the active chip of the mobile strip in view
  useEffect(() => {
    document.getElementById(`chip-${active}`)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: "smooth" });
  };

  return (
    <div className="legal-root min-h-screen bg-[#f8f9fa]" style={{ backgroundImage: "repeating-linear-gradient(90deg,rgba(0,0,0,.035) 0,rgba(0,0,0,.035) 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,rgba(0,0,0,.035) 0,rgba(0,0,0,.035) 1px,transparent 1px,transparent 56px)" }}>
      <style>{PRINT_CSS}</style>
      <div className="legal-noprint"><LogisticsNav /></div>
      <main>
        {/* ---------- title ---------- */}
        <TitleHero
          className="legal-hero"
          ghost={doc.ghost}
          title={doc.title}
          intro={doc.intro}
          meta={`Last updated: ${LEGAL_UPDATED}`}
          crumbs={[{ label: "Home", href: "/" }, { label: "Logistics", href: "/logistics" }, { label: doc.title }]}
        />

        {/* ---------- mobile contents strip ---------- */}
        <div className="legal-noprint sticky top-[60px] z-20 border-b border-gray-200 bg-white/90 backdrop-blur lg:hidden">
          <div className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {doc.sections.map((s, i) => (
              <a key={s.id} id={`chip-${s.id}`} href={`#${s.id}`} onClick={(e) => go(e, s.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${active === s.id ? "bg-[#a10000] text-white" : "bg-gray-100 text-gray-600"}`}>
                {i + 1}. {s.heading}
              </a>
            ))}
          </div>
        </div>

        {/* ---------- body ---------- */}
        <div className="legal-body mx-auto grid w-full max-w-[1200px] gap-10 px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:grid-cols-[260px_1fr]">
          <aside className="legal-noprint hidden lg:block">
            <div className="sticky top-[150px]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">On this page</p>
              <nav aria-label="On this page" className="relative flex flex-col border-l border-gray-300">
                {doc.sections.map((s, i) => {
                  const on = active === s.id;
                  return (
                    <a key={s.id} href={`#${s.id}`} onClick={(e) => go(e, s.id)}
                      className={`-ml-px flex gap-3 border-l-2 py-2 pl-4 pr-2 text-sm transition-all ${on ? "border-[#a10000] bg-gradient-to-r from-[#a10000]/5 to-transparent font-semibold text-[#a10000]" : "border-transparent text-gray-600 hover:border-gray-400 hover:text-[#282828]"}`}>
                      <span className="w-5 shrink-0 tabular-nums text-xs leading-5 opacity-70">{String(i + 1).padStart(2, "0")}</span>
                      <span>{s.heading}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Also read</p>
                <a href={other.path} className="group mt-2 flex items-center justify-between gap-2 text-sm font-semibold text-[#282828] hover:text-[#a10000] transition-colors">
                  {other.title}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm">
                  <button onClick={() => window.print()} className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-[#a10000]">
                    <Printer className="h-4 w-4" /> Print or save as PDF
                  </button>
                  <a href={`mailto:${LEGAL_EMAIL}`} className="inline-flex items-center gap-2 break-all text-gray-600 transition-colors hover:text-[#a10000]">
                    <Mail className="h-4 w-4 shrink-0" /> {LEGAL_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <article className="min-w-0 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {doc.highlights.map((h, i) => (
                <motion.div key={h.label} initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="legal-card group rounded-3xl bg-gradient-to-br from-[#1c1c1c] via-[#282828] to-[#5a0a0a] p-6 text-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#a10000]/25">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a10000] text-white transition-transform group-hover:rotate-[-6deg]">
                    <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-2xl font-bold uppercase leading-tight" style={display}>{h.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">{h.text}</p>
                </motion.div>
              ))}
            </div>

            {doc.sections.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="legal-card group/card relative scroll-mt-[150px] overflow-hidden rounded-3xl bg-[#f3f4f6] p-6 pt-8 md:p-10 md:pt-12 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)] transition-shadow hover:shadow-[0_22px_48px_-18px_rgba(161,0,0,0.3)]"
              >
                <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 bg-[#a10000] transition-all duration-300 ${active === s.id ? "opacity-100" : "opacity-70 group-hover/card:opacity-100"}`} />

                <div className="relative flex items-center gap-4 md:gap-6">
                  <span className="shrink-0 text-6xl font-bold leading-none text-[#a10000] md:text-8xl" style={display}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl font-bold uppercase leading-[1.05] text-[#282828] md:text-4xl" style={display}>{s.heading}</h2>
                </div>

                <div className="legal-content relative mt-5 text-[15px] leading-[1.8] text-gray-600 md:pl-16 md:text-base">
                  <div className="space-y-4">
                    {s.blocks.map((b, n) =>
                      Array.isArray(b) ? (
                        <ul key={n} className="space-y-2.5">
                          {b.map((line) => (
                            <li key={line} className="flex gap-3">
                              <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#a10000]" />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p key={n}>{b}</p>
                      )
                    )}
                  </div>
                </div>
              </motion.section>
            ))}

            <div className="legal-noprint relative overflow-hidden rounded-2xl bg-[#282828] p-8 text-white md:p-10">
              <div aria-hidden className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full opacity-40 blur-3xl" style={{ background: RED }} />
              <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-3xl font-bold uppercase md:text-4xl" style={display}>Questions about this document?</h3>
                  <p className="mt-2 text-sm text-gray-300 md:text-base">{doc.closing}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
                  <a href={`mailto:${LEGAL_EMAIL}`} className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded bg-[#a10000] px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-transform hover:-translate-y-0.5 hover:bg-red-700">
                    <Mail className="h-4 w-4" /> Contact us
                  </a>
                  <a href={other.path} className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-white/10">
                    {other.title} <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <div className="legal-noprint"><LogisticsFooter /></div>
    </div>
  );
};

export default LogisticsLegal;
