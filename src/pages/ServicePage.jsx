import { useState } from "react";
import { useLocation } from "react-router-dom";
import Link from "next/link";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import NotFound from "@/pages/NotFound";
import { SERVICE_PAGES } from "@/data/service-pages";
import { SITE_URL } from "@/data/seo-pages";
import { COLORS, TYPOGRAPHY, FONTS, getColorWithOpacity } from "@/constant/styles";

const headingStyle = { fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: COLORS.dark };
const bodyStyle = { fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.75) };

const jsonLd = (page) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: page.h1,
      description: page.answer,
      url: SITE_URL + page.path,
      provider: { "@id": `${SITE_URL}/#org` },
      areaServed: ["US", "GB", "AU", "CA", "NZ"],
    },
    {
      "@type": "FAQPage",
      mainEntity: page.faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        { "@type": "ListItem", position: 3, name: page.h1 },
      ],
    },
  ],
});

/** Keyword-targeted service landing page; content lives in data/service-pages.js. */
function ServicePage() {
  const [showNav, setShowNav] = useState(false);
  const { pathname } = useLocation();
  const page = SERVICE_PAGES.find((p) => p.path === pathname.toLowerCase().replace(/(.)\/$/, "$1"));
  if (!page) return <NotFound />;
  const related = SERVICE_PAGES.filter((p) => p.path !== page.path);

  return <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(page)).replace(/</g, "\\u003c") }} />
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <main>
        <section className="pt-40 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest mb-3" style={{ fontFamily: FONTS.openSans, color: COLORS.primary }}>
              {page.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl mb-6 tracking-tight" style={headingStyle}>{page.h1}</h1>
            <p className="text-base md:text-lg leading-relaxed" style={bodyStyle}>{page.answer}</p>
            <div className="text-sm mt-6" style={bodyStyle}>
              <Link href="/">Home</Link>
              <span className="mx-2">&gt;&gt;</span>
              <Link href="/services">Services</Link>
              <span className="mx-2">&gt;&gt;</span>
              <span style={{ color: COLORS.primary }}>{page.h1}</span>
            </div>
          </div>
        </section>

        <section className="py-12 px-4" style={{ backgroundColor: COLORS.primaryLight }}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl md:text-3xl mb-4" style={headingStyle}>What's included</h2>
              <ul className="space-y-2 list-disc pl-5" style={bodyStyle}>
                {page.included.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl mb-4" style={headingStyle}>Who it's for</h2>
              <ul className="space-y-2 list-disc pl-5" style={bodyStyle}>
                {page.audience.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl mb-8 text-center" style={headingStyle}>How it works</h2>
            <ol className="grid md:grid-cols-4 gap-6">
              {page.steps.map((step, i) => <li key={step.title} className="rounded-xl border p-5" style={{ borderColor: COLORS.primaryLightBorder }}>
                  <span className="text-3xl" style={{ ...headingStyle, color: COLORS.primary }}>{i + 1}</span>
                  <h3 className="text-lg mt-2 mb-2" style={{ ...headingStyle, fontWeight: TYPOGRAPHY.subheading.fontWeight }}>{step.title}</h3>
                  <p className="text-sm" style={bodyStyle}>{step.text}</p>
                </li>)}
            </ol>
          </div>
        </section>

        <section className="py-12 px-4" style={{ backgroundColor: COLORS.primaryLight }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl mb-4" style={headingStyle}>Why TelexPH</h2>
            {page.why.map((text) => <p key={text} className="mb-3" style={bodyStyle}>{text}</p>)}
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl mb-6" style={headingStyle}>Frequently asked questions</h2>
            {page.faqs.map(({ q, a }) => <div key={q} className="mb-6">
                <h3 className="text-lg mb-2" style={{ ...headingStyle, fontWeight: TYPOGRAPHY.subheading.fontWeight }}>{q}</h3>
                <p style={bodyStyle}>{a}</p>
              </div>)}
          </div>
        </section>

        <section className="py-12 px-4 text-center" style={{ backgroundColor: COLORS.dark }}>
          <h2 className="text-2xl md:text-3xl mb-4" style={{ ...headingStyle, color: COLORS.white }}>Ready to get started?</h2>
          <p className="mb-6" style={{ ...bodyStyle, color: getColorWithOpacity("white", 0.8) }}>Book a discovery call and get a custom quote for your team.</p>
          <Link href="/contact" className="inline-block rounded-full px-8 py-3 text-white" style={{ backgroundColor: COLORS.primary }}>Contact us</Link>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl md:text-2xl mb-4" style={headingStyle}>Related services</h2>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {related.map((p) => <li key={p.path}>
                  <Link href={p.path} className="underline" style={{ color: COLORS.primary }}>{p.h1}</Link>
                </li>)}
            </ul>
            <p className="mt-6 text-sm" style={bodyStyle}>
              TelexPH is a <a href="https://www.gohighlevel.com/" target="_blank" rel="noopener noreferrer" className="underline">GoHighLevel</a> service provider based in the Philippines.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}

export default ServicePage;
