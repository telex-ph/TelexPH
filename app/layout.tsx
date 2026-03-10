import type { Metadata, Viewport } from "next";
import "./globals.css";
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import LoadingProvider from "@/components/ProgressProvider/ProgressProvider";
import { Poppins, Open_Sans, Rubik } from "next/font/google";
import ExitIntentPopup from "./exit-intent/components/ExitIntentPopup";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-open-sans",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-rubik",
  display: "swap",
});

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#a10000",
};

export const metadata: Metadata = {
  // ✅ Consistent: no "www" — matches sitemap.ts and robots.txt
  metadataBase: new URL("https://www.telexph.com"),
  title: {
    default: "TelexPH",
    template: "%s | TelexPH",
  },
  description:
    "We deliver world-class business support services designed to optimize efficiency, reduce costs, and empower your growth. Together, let's build smarter, scalable solutions for your success.",
  authors: [{ name: "TelexPH Team", url: "https://www.telexph.com" }],
  keywords: [
    "TelexPH",
    "Multi-Service BPO Philippines",
    "RPA Outsourcing",
    "VoIP Solutions",
    "Cloud Communication",
    "Marketing Outsourcing",
    "Creative Services BPO",
    "Travel BPO",
    "offshore staffing",
    "BPO Philippines",
    "GoHighLevel admin",
    "virtual assistant Philippines",
    "business process outsourcing",
    "customer support outsourcing",
  ],
  icons: {
    icon: "/images/Tlxlogo.webp",
    shortcut: "/images/Tlxlogo.webp",
    apple: "/images/Tlxlogo.webp",
  },
  openGraph: {
    title: "TelexPH: Your trusted partner in Business Process Outsourcing",
    description:
      "We deliver world-class business support services designed to optimize efficiency, reduce costs, and empower your growth. Together, let's build smarter, scalable solutions for your success.",
    url: "https://www.telexph.com",
    siteName: "TelexPH",
    images: [
      {
        url: "/images/Tlxlogo.webp",
        width: 1200,
        height: 630,
        alt: "TelexPH: Your trusted partner in Business Process Outsourcing",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TelexPH: Your trusted partner in Business Process Outsourcing",
    description:
      "We deliver world-class business support services designed to optimize efficiency, reduce costs, and empower your growth. Together, let's build smarter, scalable solutions for your success.",
    images: ["/images/Tlxlogo.webp"],
  },
};

// ============================================
// 📊 JSON-LD STRUCTURED DATA
// ============================================

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Telex Business Support Services Inc.",
  "alternateName": "TelexPH",
  "url": "https://www.telexph.com",
  "logo": "https://www.telexph.com/images/Tlxlogo.webp",
  "foundingDate": "2017",
  "description": "Philippine-based BPO with GHL-certified admins and AI-powered automation workflows for scaling businesses in the US, UK, Australia, and Canada.",
  "slogan": "Scale Smarter. Support Better.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+63-44-950-4196",
    "email": "business@telexph.com",
    "contactType": "customer service",
    "availableLanguage": "English",
    "areaServed": ["US", "GB", "AU", "CA", "PH"],
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Guimba",
    "addressRegion": "Nueva Ecija",
    "addressCountry": "PH",
  },
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "minValue": 50,
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "5500",
    "bestRating": "5",
    "worstRating": "1",
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "TelexPH Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI-Powered Business Support",
          "description": "Business processes enhanced by AI automation to reduce manual overhead.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "GoHighLevel Administration",
          "description": "Certified GoHighLevel CRM management, funnel building, and automation workflows.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Offshore Staffing",
          "description": "Scalable professional teams for marketing agencies and global enterprises.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Customer Experience (CX)",
          "description": "24/7 customer support outsourcing for businesses in the US, UK, Australia, and Canada.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Virtual Assistance",
          "description": "Dedicated virtual assistants trained in GHL, Slack, Notion, and modern business tools.",
        },
      },
    ],
  },
  "sameAs": [
    "https://www.facebook.com/telexph",
    "https://www.linkedin.com/company/telexph",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TelexPH",
  "url": "https://www.telexph.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.telexph.com/resources/blogs?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// ============================================
// ✅ NEW: FAQ SCHEMA — boosts Content Structure score
// ============================================
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What makes TelexPH different from other BPOs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH is the only BPO in the Philippines with a certified GoHighLevel admin team combined with AI-powered automation workflows, making it uniquely positioned for digital agencies and tech-forward businesses.",
      },
    },
    {
      "@type": "Question",
      "name": "Where are TelexPH's clients located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH primarily serves clients in the United States, United Kingdom, Australia, and Canada.",
      },
    },
    {
      "@type": "Question",
      "name": "Does TelexPH offer 24/7 customer support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, TelexPH provides round-the-clock customer support coverage for global clients across all time zones.",
      },
    },
    {
      "@type": "Question",
      "name": "Is TelexPH GoHighLevel certified?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, TelexPH has a dedicated certified GoHighLevel admin team — the only BPO in the Philippines with this official certification.",
      },
    },
    {
      "@type": "Question",
      "name": "How long has TelexPH been operating?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH was founded in 2017 and has over 7 years of experience in BPO and offshore staffing services.",
      },
    },
    {
      "@type": "Question",
      "name": "What services does TelexPH offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH offers AI-powered business support, GoHighLevel administration, offshore staffing, customer experience (CX), back office solutions, virtual assistance, and sales & lead generation services.",
      },
    },
    {
      "@type": "Question",
      "name": "What is TelexPH's pricing model?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH offers flexible offshore staffing packages tailored to business size and service needs. Contact business@telexph.com for a custom quote.",
      },
    },
  ],
};

// ============================================
// ✅ NEW: SERVICE LIST SCHEMA — helps AI understand service catalog
// ============================================
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "TelexPH BPO Services",
  "description": "Complete list of business process outsourcing services offered by TelexPH",
  "url": "https://www.telexph.com/services",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Service",
        "name": "AI-Powered Business Support",
        "description": "Business processes enhanced by AI automation to reduce manual overhead and increase operational efficiency.",
        "provider": { "@type": "Organization", "name": "TelexPH" },
        "areaServed": ["US", "GB", "AU", "CA"],
      },
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Service",
        "name": "GoHighLevel Administration",
        "description": "Certified GoHighLevel CRM management, funnel building, automation workflows, and white-label agency delivery.",
        "provider": { "@type": "Organization", "name": "TelexPH" },
        "areaServed": ["US", "GB", "AU", "CA"],
      },
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Service",
        "name": "Offshore Staffing",
        "description": "Scalable professional offshore teams for marketing agencies and global enterprises.",
        "provider": { "@type": "Organization", "name": "TelexPH" },
        "areaServed": ["US", "GB", "AU", "CA"],
      },
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Service",
        "name": "Customer Experience (CX)",
        "description": "24/7 customer support outsourcing for businesses in the US, UK, Australia, and Canada.",
        "provider": { "@type": "Organization", "name": "TelexPH" },
        "areaServed": ["US", "GB", "AU", "CA"],
      },
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Service",
        "name": "Virtual Assistance",
        "description": "Dedicated virtual assistants trained in GHL, Slack, Notion, Asana, and modern business tools.",
        "provider": { "@type": "Organization", "name": "TelexPH" },
        "areaServed": ["US", "GB", "AU", "CA"],
      },
    },
    {
      "@type": "ListItem",
      "position": 6,
      "item": {
        "@type": "Service",
        "name": "Sales & Lead Generation",
        "description": "Outbound campaigns, CRM management, pipeline automation, and appointment setting.",
        "provider": { "@type": "Organization", "name": "TelexPH" },
        "areaServed": ["US", "GB", "AU", "CA"],
      },
    },
    {
      "@type": "ListItem",
      "position": 7,
      "item": {
        "@type": "Service",
        "name": "Back Office Solutions",
        "description": "Data entry, administrative support, and end-to-end business process management.",
        "provider": { "@type": "Organization", "name": "TelexPH" },
        "areaServed": ["US", "GB", "AU", "CA"],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${openSans.variable} ${rubik.variable}`}
    >
      <body
        className="font-rubik antialiased bg-white text-black"
        suppressHydrationWarning={true}
      >
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* ✅ NEW: FAQ Schema — boosts AEO Content Structure score */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {/* ✅ NEW: Service List Schema — helps AI understand full service catalog */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />

        <LoadingProvider>
          <ResponsiveNav />
          {children}
          <ExitIntentPopup />
        </LoadingProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}