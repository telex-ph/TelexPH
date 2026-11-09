/**
 * Single source of truth for public page SEO: titles, descriptions, sitemap
 * entries and the list of routes scripts/prerender.mjs renders to static HTML.
 * Plain JS (no JSX, no aliases) so Node can import it at build time.
 *
 * Titles get " | TelexPH" appended; keep them under 60 characters.
 * A title that already names the brand ("Telex Philippines", "About TelexPH | ...") is used as is.
 */
import { SERVICE_PAGES } from "./service-pages.js";
import { ABOUT_PAGES } from "./about-pages.js";

export const SITE_URL = "https://www.telexph.com";

export const BRAND = "TelexPH";

// The " | TelexPH" suffix is dropped when it would push the title past 60 characters (a 60-char meta title stays 60).
export const fullTitle = (title) => {
  const withBrand = `${title} | ${BRAND}`;
  return title.startsWith("Telex") || title.includes(BRAND) || withBrand.length > 60 ? title : withBrand;
};

/** One blog post: /resources/blogs/<slug>. Head tags come from the post, not from SEO_PAGES. */
export const BLOG_POST_PATH = /^\/resources\/blogs\/[^/]+\/?$/i;

/** One case study: /resources/case-studies/<slug>. Head tags come from the case study (pages/CaseStudyDetails.jsx). */
export const CASE_STUDY_PATH = /^\/resources\/case-studies\/[^/]+\/?$/i;

/** Public URL of a case study; the old ?id= URL only when a record has no slug. */
export const caseStudyPath = (c) => (c.slug ? `/resources/case-studies/${c.slug}` : `/resources/casestudiescarddetails?id=${c.id ?? c._id}`);

/**
 * Sitemap <lastmod> for the pages below. Google only trusts lastmod when it moves with real content
 * changes, so this is NOT the build date. When you change a page's content, give that entry its own
 * `lastmod: "YYYY-MM-DD"` (or bump this date if the change affects every page).
 * /resources/blogs and /resources use their newest post's date instead (scripts/prerender.mjs).
 */
export const PAGES_LASTMOD = "2026-11-09";

export const SEO_PAGES = [
  {
    path: "/",
    title: "Managed Offshore Support Teams in the Philippines",
    description:
      "Managed offshore customer support teams for growing businesses, run from 2 Philippine delivery centers. Team leads, QA and monthly reporting included.",
  },
  {
    path: "/about",
    title: "About TelexPH | Offshore Support Teams Since 2018",
    description:
      "TelexPH is a Philippine BPO founded in 2018 and based in Guimba, Nueva Ecija. Meet the team behind our offshore staffing, GoHighLevel and support services.",
  },
  {
    path: "/services",
    title: "Customer Support & Back-Office Services",
    description:
      "TelexPH delivers smart, secure and scalable outsourcing that integrates process and technology, with customizable workflows and advanced data security.",
  },
  {
    path: "/contact",
    title: "Contact Us",
    description:
      "Tell us what you need and get a custom quote for offshore staff, virtual assistants or GoHighLevel support. Book a discovery call with TelexPH.",
  },
  {
    path: "/location",
    title: "Our Office in Guimba, Nueva Ecija, Philippines",
    description:
      "Visit the TelexPH office in Guimba, Nueva Ecija, about an hour from Clark. Managed customer support teams for growing businesses. Visits by appointment.",
  },
  {
    path: "/faq",
    title: "FAQ: Managed Offshore Support Teams",
    description:
      "Answers on getting started, coverage, training, team management and data security for TelexPH managed customer support teams.",
  },
  {
    path: "/platform",
    title: "Our Expertise",
    description:
      "See the platforms our offshore teams work in every day, including GoHighLevel, CRMs, automation tools and project management software.",
  },
  {
    path: "/careers",
    title: "TelexPH Careers",
    description:
      "Join TelexPH as a virtual assistant or offshore team member. Browse open roles and grow your career with a Philippine BPO serving global clients.",
  },
  {
    path: "/careers/job-details",
    title: "Remote Virtual Assistant Job Openings",
    description:
      "Details on TelexPH virtual assistant roles for applicants and for businesses looking to hire a VA from the Philippines.",
    sitemap: false,
  },
  // One page per role; keys match JOB_KEYS in pages/JobDetails/JobDetails.jsx.
  ...[
    ["virtual-executive-assistant", "Remote Virtual Executive Assistant Job", "Virtual Executive Assistant role at TelexPH: manage executive calendars, email, travel and reports for global clients, fully remote from the Philippines."],
    ["social-media-manager", "Remote Social Media Manager Job", "Social Media Manager role at TelexPH: plan, create and schedule content, grow engagement and report on results for global brands, fully remote."],
    ["customer-support-specialist", "Remote Customer Support Specialist Job", "Customer Support Specialist role at TelexPH: resolve customer inquiries by email, chat and tickets for global clients, fully remote from the Philippines."],
    ["digital-marketing-specialist", "Remote Digital Marketing Specialist Job", "Digital Marketing Specialist role at TelexPH: run SEO, paid ads, email and campaign reporting for global clients, fully remote from the Philippines."],
    ["bookkeeping-specialist", "Remote Bookkeeping Specialist Job", "Bookkeeping Specialist role at TelexPH: record transactions, reconcile accounts and prepare financial reports for global clients, fully remote."],
    ["content-writer", "Remote Content Writer Job", "Content Writer role at TelexPH: write SEO-friendly blogs, web copy and marketing content for clients across industries, fully remote from the Philippines."],
  ].map(([key, title, description]) => ({ path: `/careers/job-details/${key}`, title, description })),
  {
    path: "/apply",
    title: "Apply to TelexPH: Job Application Form",
    description:
      "Apply for a role at TelexPH. Fill in the application form to join our offshore staffing and virtual assistant teams in the Philippines.",
  },
  {
    path: "/resources",
    title: "Case Studies: Offshore Staffing Results",
    description:
      "Read TelexPH case studies showing how offshore teams, GoHighLevel support and automation helped businesses scale.",
  },
  {
    path: "/resources/blogs",
    title: "Blog: GoHighLevel, VA and Outsourcing Guides",
    description:
      "Guides and articles on GoHighLevel, virtual assistants, offshore staffing and business automation from the TelexPH team.",
  },
  {
    path: "/resources/newsletter",
    title: "Newsletter: TelexPH News and Updates",
    description:
      "Read the TelexPH newsletter and subscribe for news, tips and updates on offshore staffing, virtual assistants and automation.",
  },
  {
    path: "/resources/industryusecase",
    title: "Industry Use Cases for Offshore Teams",
    description:
      "How businesses in different industries use TelexPH offshore teams: common challenges, the solutions applied, and the results.",
  },
  {
    path: "/resources/casestudiescarddetails",
    title: "Case Study",
    description: "A TelexPH case study on offshore staffing, GoHighLevel support or business automation results.",
    keepQuery: true, // old ?id= links; the page redirects to /resources/case-studies/<slug>
    sitemap: false,
    prerender: false,
  },
  {
    path: "/logistics",
    title: "Logistics Customer Support Philippines",
    description:
      "Managed customer support in the Philippines for logistics businesses: shipment enquiries, follow-ups and delivery exceptions within your processes.",
  },
  {
    path: "/logistics/privacy-policy",
    title: "Privacy Policy for Logistics Support",
    description:
      "How TelexPH collects, uses, stores and protects personal information provided through the TelexPH Logistics website and related services.",
  },
  {
    path: "/logistics/terms-and-conditions",
    title: "Terms and Conditions for Logistics Support",
    description:
      "Terms governing access to and use of the TelexPH Logistics website and related services.",
  },
  ...ABOUT_PAGES.map(({ path, seoTitle, description }) => ({ path, title: seoTitle, description })),
  ...SERVICE_PAGES.map(({ path, title, description }) => ({ path, title, description })),
];

/** Lookup by lowercase path, ignoring a trailing slash. */
export const findSeoPage = (pathname) => {
  const key = pathname.toLowerCase().replace(/(.)\/$/, "$1");
  return SEO_PAGES.find((p) => p.path === key);
};
