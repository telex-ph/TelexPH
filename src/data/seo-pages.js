/**
 * Single source of truth for public page SEO: titles, descriptions, sitemap
 * entries and the list of routes scripts/prerender.mjs renders to static HTML.
 * Plain JS (no JSX, no aliases) so Node can import it at build time.
 *
 * Titles get " | TelexPH" appended; keep them under 50 characters.
 * A title that already starts with the brand people search ("Telex Philippines") is used as is.
 */
import { SERVICE_PAGES } from "./service-pages.js";
import { ABOUT_PAGES } from "./about-pages.js";

export const SITE_URL = "https://www.telexph.com";

export const BRAND = "TelexPH";

export const fullTitle = (title) => (title.startsWith(BRAND) ? title : `${title} | TelexPH`);

/** One blog post: /resources/blogs/<slug>. Head tags come from the post, not from SEO_PAGES. */
export const BLOG_POST_PATH = /^\/resources\/blogs\/[^/]+\/?$/i;

export const SEO_PAGES = [
  {
    path: "/",
    title: "TelexPH",
    description:
      "To become a globally trusted operations and automation partner powered by Filipino talents.",
  },
  {
    path: "/about",
    title: "About TelexPH",
    description:
      "TelexPH is a Philippine BPO founded in 2021 in Guimba, Nueva Ecija. Meet the team behind our offshore staffing, GoHighLevel and support services.",
  },
  {
    path: "/services",
    title: "TelexPH Services",
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
    title: "Our Office in the Philippines",
    description:
      "Visit or contact the TelexPH office in Guimba, Nueva Ecija, Philippines, home of our offshore staffing and customer support teams.",
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
    title: "Job Details | TelexPH Careers",
    description:
      "Details on TelexPH virtual assistant roles for applicants and for businesses looking to hire a VA from the Philippines.",
    keepQuery: true,
    sitemap: false,
  },
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
    path: "/resources/industryusecase",
    title: "Industry Use Cases for Offshore Teams",
    description:
      "How businesses in different industries use TelexPH offshore teams: common challenges, the solutions applied, and the results.",
  },
  {
    path: "/resources/casestudiescarddetails",
    title: "Case Study",
    description: "A TelexPH case study on offshore staffing, GoHighLevel support or business automation results.",
    keepQuery: true, // one page per ?id= until detail pages get slug URLs
    sitemap: false,
    prerender: false,
  },
  {
    path: "/logistics",
    title: "Logistics Customer Support Philippines",
    description:
      "Managed customer support team in the Philippines for logistics businesses: shipment enquiries, customer follow-ups and delivery exceptions within your processes.",
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
