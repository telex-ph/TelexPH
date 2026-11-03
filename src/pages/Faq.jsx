import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import { FAQ_GROUPS } from "@/data/faq";
import { LOGISTICS_CTA_URL } from "@/constant/links";
import { COLORS, TYPOGRAPHY, FONTS, getColorWithOpacity } from "@/constant/styles";

const headingStyle = { fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: COLORS.dark };
const bodyStyle = { fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.75) };

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
  ? <a key={i} href={LOGISTICS_CTA_URL} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: COLORS.primary }}>{part}</a>
  : part));

/** Plain headings and paragraphs, no accordion: every answer stays in the prerendered HTML. */
function Faq() {
  const [showNav, setShowNav] = useState(false);

  return <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <main>
        <section className="pt-40 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl mb-6 tracking-tight" style={headingStyle}>Frequently Asked Questions</h1>
            <div className="text-sm" style={bodyStyle}>
              <Link href="/">Home</Link>
              <span className="mx-2">&gt;&gt;</span>
              <span style={{ color: COLORS.primary }}>FAQ</span>
            </div>
          </div>
        </section>

        {FAQ_GROUPS.map((group, i) => <section key={group.title} className="py-12 px-4" style={{ backgroundColor: i % 2 ? COLORS.white : COLORS.primaryLight }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl mb-6" style={headingStyle}>{group.title}</h2>
              {group.items.map(({ q, a }) => <div key={q} className="mb-6">
                  <h3 className="text-lg mb-2" style={{ ...headingStyle, fontWeight: TYPOGRAPHY.subheading.fontWeight }}>{q}</h3>
                  <p style={bodyStyle}>{withBookingLink(a)}</p>
                </div>)}
            </div>
          </section>)}
      </main>

      <Footer />
    </div>;
}

export default Faq;
