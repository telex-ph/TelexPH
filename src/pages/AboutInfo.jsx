import { useState } from "react";
import { useLocation } from "react-router-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Cpu, Wifi, ScrollText, FileCheck2, Lock, HelpCircle, Workflow, Gauge, Building2, Armchair, ShieldCheck, Check } from "lucide-react";
import TitleHero from "@/components/About/TitleHero";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import NotFound from "@/pages/NotFound";
import { ABOUT_SCENES, FirewallVisual } from "@/components/About/AboutScenes";
import { ABOUT_PAGES, findAboutPage } from "@/data/about-pages";
import { COLORS, FONTS } from "@/constant/styles";

const RED = COLORS.primary;
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };
const ICONS = { zap: Zap, cpu: Cpu, wifi: Wifi, scroll: ScrollText, file: FileCheck2, lock: Lock, help: HelpCircle, workflow: Workflow, gauge: Gauge, building: Building2, seats: Armchair, shield: ShieldCheck };

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, delay },
});

/** About > Hardware & Infrastructure / Compliance & Security / Operations. Content lives in data/about-pages.js. */
function AboutInfoPage() {
  const [showNav, setShowNav] = useState(false);
  const { pathname } = useLocation();
  const page = findAboutPage(pathname);
  if (!page) return <NotFound />;
  const others = ABOUT_PAGES.filter((p) => p.path !== page.path);
  const Scene = ABOUT_SCENES[page.scene];
  // two cards per row; a wide card takes a whole row, and a card left alone on the last row stretches across it
  const spans = [];
  let col = 0;
  page.sections.forEach((s, i) => {
    if (s.wide) { spans.push(true); col = 0; return; }
    const alone = col === 0 && i === page.sections.length - 1;
    spans.push(alone);
    col = (col + 1) % 2;
  });

  return <div className="min-h-screen bg-white">
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <main>
        {/* ---------- title + illustration ---------- */}
        <TitleHero
          ghost={page.ghost}
          title={page.title}
          intro={page.intro}
          crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: page.label }]}
        >
          <motion.div className="relative w-full max-w-[860px]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div aria-hidden className="absolute inset-6 rounded-full blur-3xl opacity-25" style={{ background: RED }} />
            <div className="relative overflow-hidden rounded-3xl p-4 shadow-2xl shadow-black/25 md:p-6" style={{ background: "linear-gradient(135deg,#1a1a1a 0%,#282828 55%,#4d0a0a 100%)" }}>
              <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)" }} />
              <div className="relative mx-auto max-w-[640px]"><Scene /></div>
            </div>
          </motion.div>
        </TitleHero>

        {/* ---------- stats / highlights, overlapping the hero ---------- */}
        {(page.stats || page.highlights) && <section className="relative z-10 bg-white px-4 pb-14 pt-2">
          <div className="mx-auto max-w-[1200px] space-y-5">
            {page.statsTitle && <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">{page.statsTitle}</p>}
            {page.stats && (
              <div className="grid grid-cols-2 gap-3 md:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ "--n": page.stats.length }}>
                {page.stats.map((st, i) => (
                  <motion.div key={st.label} {...rise(i * 0.07)} className="rounded-2xl border border-white/10 bg-[#1f1f1f] px-5 py-5 text-center shadow-xl shadow-black/20">
                    <p className="text-4xl md:text-5xl font-bold leading-none text-white" style={display}>{st.value}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e25555]">{st.label}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {page.highlights && <div className="grid gap-4 md:grid-cols-3">
              {page.highlights.map((h, i) => (
                <motion.div key={h.title} {...rise(i * 0.08)}
                  className="group rounded-3xl p-6 text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-[#a10000]/25"
                  style={{ background: "linear-gradient(135deg,#1c1c1c,#282828 55%,#5a0a0a)" }}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition-transform group-hover:rotate-[-6deg]" style={{ background: RED }}>
                    <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold uppercase leading-tight" style={display}>{h.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300" style={{ fontFamily: FONTS.rubik }}>{h.text}</p>
                </motion.div>
              ))}
            </div>}
          </div>
        </section>}

        {/* ---------- global partners (Operations) ---------- */}
        {page.partners && (
          <section id={page.partners.id} className="scroll-mt-28 px-4 pt-20 md:pt-24">
            <motion.div {...rise()} className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl p-8 text-white md:p-14" style={{ background: "linear-gradient(135deg,#1c1c1c 0%,#282828 55%,#5a0a0a 100%)" }}>
              <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)" }} />
              <div aria-hidden className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full blur-3xl opacity-30" style={{ background: RED }} />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
                <div>
                  <p aria-hidden className="mb-1 text-lg font-bold italic leading-none tracking-[0.2em]" style={{ color: RED, ...display }}>///</p>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase leading-[1.02]" style={display}>{page.partners.heading}</h2>
                  <div className="mt-4 h-1 w-14" style={{ background: RED }} />
                  <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-300" style={{ fontFamily: FONTS.rubik }}>
                    {page.partners.paragraphs.map((t) => <p key={t}>{t}</p>)}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Marketplaces and regions</p>
                    <div className="flex flex-wrap gap-2.5">
                      {page.partners.marketplaces.map((m, i) => (
                        <span key={m} className={`rounded-full px-5 py-2.5 text-lg font-bold uppercase tracking-wide ${i < 3 ? "text-white" : "border border-white/20 text-gray-200"}`} style={{ ...display, ...(i < 3 ? { background: RED } : {}) }}>{m}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">End-to-end marketplace operations</p>
                    <ul className="grid gap-2.5">
                      {page.partners.services.map((t) => (
                        <li key={t} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm" style={{ fontFamily: FONTS.rubik }}>
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: RED }}><Check className="h-3 w-3" strokeWidth={3} /></span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* ---------- seating and headcount (Operations) ---------- */}
        {page.seating && (
          <section id={page.seating.id} className="scroll-mt-28 px-4 pt-10 md:pt-12">
            <motion.div {...rise()} className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl bg-[#f3f4f6] p-8 pt-10 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)] md:p-14 md:pt-16">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: RED }} />
              <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
                <div>
                  <p aria-hidden className="mb-1 text-lg font-bold italic leading-none tracking-[0.2em]" style={{ color: RED, ...display }}>///</p>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase leading-[1.02] text-[#282828]" style={display}>{page.seating.heading}</h2>
                  <div className="mt-4 h-1 w-14" style={{ background: RED }} />
                  <p className="mt-6 flex items-center gap-3 text-base font-bold text-[#282828] md:text-lg" style={{ fontFamily: FONTS.rubik }}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white" style={{ background: RED }}><Check className="h-4 w-4" strokeWidth={3} /></span>
                    {page.seating.subheading}
                  </p>
                  <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-gray-600 md:text-base" style={{ fontFamily: FONTS.rubik }}>
                    {page.seating.paragraphs.map((t) => (
                      <p key={t}>{t.split(/(\*\*[^*]+\*\*)/g).map((part, k) => part.startsWith("**") ? <strong key={k} className="font-semibold text-[#282828]">{part.slice(2, -2)}</strong> : part)}</p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {page.seating.figures.map((f, i) => (
                    <motion.div key={f.label} {...rise(0.1 + i * 0.1)} className="relative overflow-hidden rounded-2xl px-4 py-8 text-center text-white shadow-xl" style={{ background: "linear-gradient(135deg,#1c1c1c,#282828 55%,#5a0a0a)" }}>
                      <div aria-hidden className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full opacity-40 blur-2xl" style={{ background: RED }} />
                      <p className="relative text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">{f.qualifier}</p>
                      <p className="relative mt-1 text-6xl font-bold leading-none md:text-7xl" style={display}>{f.value}</p>
                      <p className="relative mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#e25555]">{f.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* ---------- sections ---------- */}
        <section className="relative px-4 py-20 md:py-24" style={{ backgroundImage: "repeating-linear-gradient(90deg,rgba(0,0,0,.03) 0,rgba(0,0,0,.03) 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,rgba(0,0,0,.03) 0,rgba(0,0,0,.03) 1px,transparent 1px,transparent 56px)" }}>
          <div className="mx-auto max-w-[1200px]">
            <motion.div {...rise()} className="mb-12 text-center">
              <p aria-hidden className="mb-1 text-lg font-bold italic leading-none tracking-[0.2em]" style={{ color: RED, ...display }}>///</p>
              <h2 className="text-4xl md:text-6xl font-bold uppercase leading-[1.02]" style={{ ...display, color: COLORS.dark }}>What's behind it</h2>
              <div className="mx-auto mt-4 h-1 w-14" style={{ background: RED }} />
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {page.sections.map((s, i) => {
                const Icon = ICONS[s.icon] || ShieldCheck;
                return (
                  <motion.article key={s.heading} id={s.id} {...rise((i % 2) * 0.08)}
                    className={`group relative scroll-mt-28 overflow-hidden rounded-3xl bg-[#f3f4f6] p-7 pt-9 md:p-10 md:pt-12 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-18px_rgba(161,0,0,0.3)] ${spans[i] ? "md:col-span-2" : ""}`}>
                    <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: RED }} />
                    <span aria-hidden className="pointer-events-none absolute -right-3 -top-8 select-none text-[10rem] font-bold leading-none text-black/[0.04]" style={display}>{String(i + 1).padStart(2, "0")}</span>

                    <div className="relative flex items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-[#a10000]/30 transition-transform group-hover:rotate-[-6deg]" style={{ background: RED }}>
                        <Icon className="h-7 w-7" strokeWidth={1.7} />
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold uppercase leading-[1.02]" style={{ ...display, color: COLORS.dark }}>{s.heading}</h3>
                    </div>

                    {s.subheading && <p className="relative mt-5 text-base font-bold text-[#282828]" style={{ fontFamily: FONTS.rubik }}>{s.subheading}</p>}
                    <p className={`relative whitespace-pre-line ${s.subheading ? "mt-1" : "mt-5"} text-[15px] md:text-base leading-relaxed text-gray-600`} style={{ fontFamily: FONTS.rubik }}>{s.text.split(/(\*\*[^*]+\*\*)/g).map((part, k) => part.startsWith("**") ? <strong key={k} className="font-semibold text-[#282828]">{part.slice(2, -2)}</strong> : part)}</p>
                    {s.chips && (
                      <div className="relative mt-4 flex flex-wrap gap-2.5">
                        {s.chips.map((c) => <span key={c} className="rounded-full px-5 py-2 text-lg font-bold uppercase tracking-wide text-white" style={{ ...display, background: RED }}>{c}</span>)}
                      </div>
                    )}
                    {s.metrics && (
                      <div className="relative mt-6 grid grid-cols-3 gap-3">
                        {s.metrics.map((m) => (
                          <div key={m.label} className="rounded-2xl border-2 border-[#a10000] bg-white px-3 py-4 text-center">
                            <p className="text-4xl md:text-5xl font-bold leading-none text-[#a10000]" style={display}>{m.value}</p>
                            <p className="mt-2 text-xs md:text-sm text-gray-600" style={{ fontFamily: FONTS.rubik }}>{m.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={s.visual ? "relative mt-6 grid items-stretch gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" : "relative"}>
                    {s.visual === "firewall" && <div className="flex items-center justify-center rounded-2xl bg-[#1f1f1f] p-6 shadow-inner"><div className="w-full"><FirewallVisual /></div></div>}
                    {s.points && <ul className={`relative grid min-w-0 content-start gap-2.5 ${s.visual ? "" : "mt-5"} ${s.wide && !s.visual ? "sm:grid-cols-2" : ""}`}>
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 text-sm text-gray-700 shadow-sm" style={{ fontFamily: FONTS.rubik }}>
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: RED }}><Check className="h-3 w-3" strokeWidth={3} /></span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>}
                    </div>
                    {s.link && (
                      <Link href={s.link.href} className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: RED }}>
                        {s.link.label} <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- related ---------- */}
        <section className="px-4 pb-24">
          <div className="mx-auto max-w-[1200px]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">More about TelexPH</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {others.map((o) => {
                const OScene = ABOUT_SCENES[o.scene];
                return (
                  <Link key={o.path} href={o.path} className="group relative flex items-center justify-between overflow-hidden rounded-3xl p-6 text-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#a10000]/25" style={{ background: "linear-gradient(135deg,#1c1c1c,#282828 55%,#5a0a0a)" }}>
                    <div aria-hidden className="pointer-events-none absolute -right-6 top-1/2 hidden w-44 -translate-y-1/2 opacity-30 transition-opacity group-hover:opacity-60 sm:block"><OScene /></div>
                    <span className="relative text-2xl font-bold uppercase leading-tight" style={display}>{o.label}</span>
                    <span aria-hidden className="relative text-xl transition-transform group-hover:translate-x-1" style={{ color: "#e25555" }}>→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}
export {
  AboutInfoPage as default
};
