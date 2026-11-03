import { useState } from "react";
import { Rocket, Headset, Users, ShieldCheck, MapPin, Plus, Minus } from "lucide-react";
import TitleHero from "@/components/About/TitleHero";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import { FAQ_GROUPS } from "@/data/faq";
import { LOGISTICS_CTA_URL } from "@/constant/links";
import { COLORS, FONTS } from "@/constant/styles";

const RED = COLORS.primary;
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };
const GRID = { backgroundImage: "repeating-linear-gradient(90deg,rgba(0,0,0,.03) 0,rgba(0,0,0,.03) 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,rgba(0,0,0,.03) 0,rgba(0,0,0,.03) 1px,transparent 1px,transparent 56px)" };
const ICONS = { "Getting started": Rocket, "Coverage and channels": Headset, "Managing the team": Users, Security: ShieldCheck, Location: MapPin };
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const pad = (n) => String(n).padStart(2, "0");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap((group) => group.items).map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

/** Same words as the JSON-LD; only the "book a discovery call" phrase becomes a link. */
const withBookingLink = (text) => text.split(/(book a discovery call)/i).map((part, i) => (i % 2
  ? <a key={i} href={LOGISTICS_CTA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: RED }}>{part}</a>
  : part));

/** Native <details> accordion: answers stay in the prerendered HTML even when closed, and work without JS.
    The shared name="faq" lets only one answer be open at a time (older browsers just allow several). */
function Faq() {
  const [showNav, setShowNav] = useState(false);

  return <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <main>
        <TitleHero
          ghost="FAQ"
          title="Frequently Asked Questions"
          intro="Answers on getting started, coverage, training, team management and data security for TelexPH managed customer support teams."
          crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        />

        <section className="relative px-4 pb-20 pt-6 md:pb-24" style={GRID}>
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
            {/* topics: chips on mobile, sticky list on desktop */}
            <nav aria-label="FAQ topics" className="self-start lg:sticky lg:top-36">
              <p className="mb-3 hidden text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 lg:block">Topics</p>
              <ul className="flex flex-wrap gap-2 lg:flex-col">
                {FAQ_GROUPS.map((group) => {
                  const Icon = ICONS[group.title];
                  return <li key={group.title}>
                      <a href={`#${slug(group.title)}`} className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#282828] shadow-sm transition-colors hover:border-[#a10000] hover:text-[#a10000] lg:rounded-2xl lg:py-3" style={{ fontFamily: FONTS.rubik }}>
                        <Icon className="h-4 w-4 shrink-0" style={{ color: RED }} strokeWidth={2} />
                        <span className="flex-1">{group.title}</span>
                        <span className="text-xs text-gray-400">{group.items.length}</span>
                      </a>
                    </li>;
                })}
              </ul>
            </nav>

            <div className="space-y-16">
              {FAQ_GROUPS.map((group, gi) => {
                const Icon = ICONS[group.title];
                return <section key={group.title} id={slug(group.title)} className="relative scroll-mt-36">
                    <span aria-hidden className="pointer-events-none absolute -top-10 right-0 select-none text-[8rem] font-bold leading-none text-black/[0.04] md:text-[10rem]" style={display}>{pad(gi + 1)}</span>
                    <div className="relative flex items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-[#a10000]/30" style={{ background: RED }}>
                        <Icon className="h-7 w-7" strokeWidth={1.7} />
                      </span>
                      <div>
                        <p aria-hidden className="text-lg font-bold italic leading-none tracking-[0.2em]" style={{ color: RED, ...display }}>/// {pad(gi + 1)}</p>
                        <h2 className="text-4xl font-bold uppercase leading-[1.02] md:text-5xl" style={{ ...display, color: COLORS.dark }}>{group.title}</h2>
                      </div>
                    </div>
                    <div className="mt-4 h-1 w-14" style={{ background: RED }} />

                    <div className="relative mt-8 space-y-4">
                      {group.items.map(({ q, a }, i) => <details key={q} name="faq" className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow open:border-[#a10000] open:shadow-[0_12px_32px_rgba(161,0,0,.14)]">
                          <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 origin-top scale-y-0 transition-transform duration-300 group-open:scale-y-100" style={{ background: RED }} />
                          <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 md:px-6 [&::-webkit-details-marker]:hidden">
                            <span className="w-8 shrink-0 text-2xl font-bold leading-none text-gray-300 tabular-nums transition-colors group-open:text-[#a10000]" style={display}>{pad(i + 1)}</span>
                            <h3 className="flex-1 text-base font-semibold text-[#282828] md:text-lg" style={{ fontFamily: FONTS.rubik }}>{q}</h3>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[#282828] transition-colors duration-300 group-open:bg-[#a10000] group-open:text-white">
                              <Plus className="h-5 w-5 group-open:hidden" />
                              <Minus className="hidden h-5 w-5 group-open:block" />
                            </span>
                          </summary>
                          <p className="pb-6 pl-5 pr-5 leading-relaxed text-gray-600 md:pl-[4.75rem] md:pr-6" style={{ fontFamily: FONTS.rubik }}>{withBookingLink(a)}</p>
                        </details>)}
                    </div>
                  </section>;
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}

export default Faq;
