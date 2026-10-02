/**
 * Single source of truth for public page SEO: titles, descriptions, sitemap
 * entries and the list of routes scripts/prerender.mjs renders to static HTML.
 * Plain JS (no JSX, no aliases) so Node can import it at build time.
 *
 * Titles get " | TelexPH" appended; keep them under 50 characters.
 */
import { SERVICE_PAGES } from "./service-pages.js";

export const SITE_URL = "https://www.telexph.com";

export const SEO_PAGES = [
  {
    path: "/",
    title: "GoHighLevel VAs & Offshore Staffing Philippines",
    description:
      "Hire GoHighLevel VAs, customer support and offshore staff from the Philippines. Serving agencies in the US, UK, AU, CA and NZ since 2017.",
  },
  {
    path: "/about",
    title: "About TelexPH: Philippine BPO Since 2017",
    description:
      "TelexPH is a Philippine BPO founded in 2017 in Guimba, Nueva Ecija. Meet the team behind our offshore staffing, GoHighLevel and support services.",
  },
  {
    path: "/services",
    title: "Virtual Assistant & BPO Services Philippines",
    description:
      "Offshore staffing, virtual assistants, customer support, GoHighLevel admin, automation, web and creative services from our team in the Philippines.",
  },
  {
    path: "/contact",
    title: "Contact Us: Get a Custom Staffing Quote",
    description:
      "Tell us what you need and get a custom quote for offshore staff, virtual assistants or GoHighLevel support. Book a discovery call with TelexPH.",
  },
  {
    path: "/location",
    title: "Our Office in Guimba, Nueva Ecija, Philippines",
    description:
      "Visit or contact the TelexPH office in Guimba, Nueva Ecija, Philippines, home of our offshore staffing and customer support teams.",
  },
  {
    path: "/platform",
    title: "Our Expertise: Tools and Platforms We Use",
    description:
      "See the platforms our offshore teams work in every day, including GoHighLevel, CRMs, automation tools and project management software.",
  },
  {
    path: "/careers",
    title: "Careers: Virtual Assistant Jobs at TelexPH",
    description:
      "Join TelexPH as a virtual assistant or offshore team member. Browse open roles and grow your career with a Philippine BPO serving global clients.",
  },
  {
    path: "/careers/job-details",
    title: "Virtual Assistant Roles and Hiring Details",
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
    title: "Logistics Customer Support Team Philippines",
    description:
      "A managed customer support team in the Philippines for logistics businesses: shipment enquiries, customer follow-ups and delivery exceptions within your processes.",
  },
  {
    path: "/logistics/landing",
    title: "Logistics Customer Support Philippines",
    description:
      "Managed customer support team in the Philippines for logistics businesses: shipment enquiries, customer follow-ups and delivery exceptions within your processes.",
  },
  ...SERVICE_PAGES.map(({ path, title, description }) => ({ path, title, description })),
];

/** Lookup by lowercase path, ignoring a trailing slash. */
export const findSeoPage = (pathname) => {
  const key = pathname.toLowerCase().replace(/(.)\/$/, "$1");
  return SEO_PAGES.find((p) => p.path === key);
};
