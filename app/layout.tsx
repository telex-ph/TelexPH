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
  metadataBase: new URL("https://www.telexph.com"),
  title: {
    default: "TelexPH — AI-Powered BPO & Certified GoHighLevel Administration in the Philippines",
    template: "%s | TelexPH",
  },
  description:
    "TelexPH (Telex Business Support Services Inc.) is a Philippine-based BPO specializing in AI-powered business support, certified GoHighLevel administration, and offshore staffing for marketing agencies in the US, UK, Australia, and Canada. Founded 2017 in Guimba, Nueva Ecija.",
  authors: [{ name: "TelexPH Team", url: "https://www.telexph.com" }],
  keywords: [
    "TelexPH",
    "Telex Business Support Services Inc",
    "BPO Philippines",
    "GoHighLevel certified admin",
    "GoHighLevel BPO",
    "GHL administration Philippines",
    "AI-powered BPO",
    "offshore staffing Philippines",
    "virtual assistant Philippines",
    "customer support outsourcing",
    "business process outsourcing",
    "marketing agency BPO",
    "CRM management outsourcing",
    "funnel building BPO",
    "offshore team Philippines",
  ],
  icons: {
    icon: "/images/Tlxlogo.webp",
    shortcut: "/images/Tlxlogo.webp",
    apple: "/images/Tlxlogo.webp",
  },
  openGraph: {
    title: "TelexPH — AI-Powered BPO & Certified GoHighLevel Administration",
    description:
      "Philippine-based BPO with certified GoHighLevel admins and AI-powered automation for marketing agencies. Offshore staffing, CX, virtual assistance, and sales support for businesses in the US, UK, Australia, and Canada.",
    url: "https://www.telexph.com",
    siteName: "TelexPH",
    images: [
      {
        url: "/images/Tlxlogo.webp",
        width: 1200,
        height: 630,
        alt: "TelexPH — AI-Powered BPO & Certified GoHighLevel Administration in the Philippines",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TelexPH — AI-Powered BPO & Certified GoHighLevel Administration",
    description:
      "Philippine-based BPO with certified GoHighLevel admins and AI-powered automation for marketing agencies. Serving US, UK, AU, CA clients since 2017.",
    images: ["/images/Tlxlogo.webp"],
  },
};

// ============================================
// 📊 JSON-LD STRUCTURED DATA — AEO OPTIMIZED
// ============================================

// ✅ 1. Organization Schema — primary entity
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.telexph.com/#organization",
  "name": "Telex Business Support Services Inc.",
  "alternateName": ["TelexPH", "Telex BPO", "Telex Business Support"],
  "url": "https://www.telexph.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.telexph.com/images/Tlxlogo.webp",
    "width": 512,
    "height": 512,
  },
  "foundingDate": "2017",
  "description":
    "Philippine-based BPO company specializing in AI-integrated business support, certified GoHighLevel (GHL) administration, and offshore staffing for global marketing agencies. The only BPO in the Philippines with a certified GoHighLevel admin team.",
  "slogan": "Scale Smarter. Support Better.",
  "knowsAbout": [
    "Business Process Outsourcing",
    "GoHighLevel CRM Administration",
    "AI-Powered Automation",
    "Offshore Staffing",
    "Customer Experience Outsourcing",
    "Virtual Assistance",
    "Sales and Lead Generation",
    "Funnel Building",
    "CRM Management",
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+63-44-950-4196",
      "email": "business@telexph.com",
      "contactType": "customer service",
      "availableLanguage": ["English", "Filipino"],
      "areaServed": ["US", "GB", "AU", "CA", "PH"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        "opens": "00:00",
        "closes": "23:59",
      },
    },
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Guimba",
    "addressLocality": "Guimba",
    "addressRegion": "Nueva Ecija",
    "addressCountry": "PH",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 15.6645,
    "longitude": 120.7703,
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
    "name": "TelexPH BPO Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI-Powered Business Support",
          "description":
            "Business processes enhanced by AI automation to reduce manual overhead and increase operational efficiency.",
          "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
          "areaServed": ["US", "GB", "AU", "CA"],
          "serviceType": "AI Automation",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "GoHighLevel Administration",
          "description":
            "Certified GoHighLevel CRM management, funnel building, automation workflows, and white-label agency delivery. The only Philippine BPO with official GHL certification.",
          "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
          "areaServed": ["US", "GB", "AU", "CA"],
          "serviceType": "CRM Administration",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Offshore Staffing",
          "description":
            "Scalable professional offshore teams for marketing agencies and global enterprises, trained in systems thinking and modern business tools.",
          "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
          "areaServed": ["US", "GB", "AU", "CA"],
          "serviceType": "Offshore Staffing",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Customer Experience (CX)",
          "description":
            "24/7 customer support outsourcing across phone, email, chat, and social media for businesses in the US, UK, Australia, and Canada.",
          "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
          "areaServed": ["US", "GB", "AU", "CA"],
          "serviceType": "Customer Support",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Virtual Assistance",
          "description":
            "Dedicated virtual assistants trained in GHL, Slack, Notion, Asana, and modern business tools for administrative and project support.",
          "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
          "areaServed": ["US", "GB", "AU", "CA"],
          "serviceType": "Virtual Assistance",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Sales & Lead Generation",
          "description":
            "Outbound campaigns, CRM management, pipeline automation, and appointment setting to fill your sales pipeline with qualified leads.",
          "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
          "areaServed": ["US", "GB", "AU", "CA"],
          "serviceType": "Lead Generation",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Back Office Solutions",
          "description":
            "Data entry, administrative support, document processing, and end-to-end business process management.",
          "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
          "areaServed": ["US", "GB", "AU", "CA"],
          "serviceType": "Back Office Support",
        },
      },
    ],
  },
  "sameAs": [
    "https://www.facebook.com/telexph",
    "https://www.linkedin.com/company/telexph",
  ],
};

// ✅ 2. LocalBusiness Schema — for geographic entity resolution
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.telexph.com/#localbusiness",
  "name": "TelexPH",
  "legalName": "Telex Business Support Services Inc.",
  "image": "https://www.telexph.com/images/Tlxlogo.webp",
  "url": "https://www.telexph.com",
  "telephone": "+63-44-950-4196",
  "email": "business@telexph.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Guimba",
    "addressLocality": "Guimba",
    "addressRegion": "Nueva Ecija",
    "postalCode": "3115",
    "addressCountry": "PH",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 15.6645,
    "longitude": 120.7703,
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59",
  },
  "areaServed": [
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "United Kingdom" },
    { "@type": "Country", "name": "Australia" },
    { "@type": "Country", "name": "Canada" },
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "5500",
    "bestRating": "5",
    "worstRating": "1",
  },
};

// ✅ 3. WebSite Schema — with search action
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.telexph.com/#website",
  "name": "TelexPH",
  "url": "https://www.telexph.com",
  "publisher": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate":
        "https://www.telexph.com/resources/blogs?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// ✅ 4. FAQ Schema — expanded with 10 questions for AEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://www.telexph.com/#faqpage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is TelexPH?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH (Telex Business Support Services Inc.) is a Philippine-based BPO company founded in 2017, specializing in AI-powered business support, certified GoHighLevel administration, and offshore staffing for global marketing agencies.",
      },
    },
    {
      "@type": "Question",
      "name": "What makes TelexPH different from other BPOs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH is the only BPO in the Philippines with a certified GoHighLevel admin team combined with AI-powered automation workflows. This unique combination makes it ideal for digital marketing agencies and tech-forward businesses.",
      },
    },
    {
      "@type": "Question",
      "name": "Where is TelexPH located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH is headquartered in Guimba, Nueva Ecija, Philippines. The company serves clients primarily in the United States, United Kingdom, Australia, and Canada.",
      },
    },
    {
      "@type": "Question",
      "name": "Is TelexPH GoHighLevel certified?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. TelexPH has a dedicated certified GoHighLevel admin team — the only BPO in the Philippines with this official certification. Services include CRM management, funnel building, automation workflows, and white-label agency delivery.",
      },
    },
    {
      "@type": "Question",
      "name": "Does TelexPH offer 24/7 customer support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. TelexPH provides round-the-clock customer support coverage across phone, email, live chat, and social media for global clients across all time zones.",
      },
    },
    {
      "@type": "Question",
      "name": "What services does TelexPH offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH offers seven core services: AI-Powered Business Support, GoHighLevel Administration, Offshore Staffing, Customer Experience (CX), Virtual Assistance, Sales & Lead Generation, and Back Office Solutions.",
      },
    },
    {
      "@type": "Question",
      "name": "How does TelexPH use AI in its BPO services?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH automates repetitive tasks within GoHighLevel and CRM environments using AI. This includes workflow automation, AI-assisted email triage, automated reporting, intelligent task routing, and CRM data enrichment.",
      },
    },
    {
      "@type": "Question",
      "name": "How long has TelexPH been operating?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH was founded in 2017 and has over 8 years of experience in BPO and offshore staffing services, serving clients across four countries.",
      },
    },
    {
      "@type": "Question",
      "name": "What is TelexPH's pricing model?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TelexPH offers flexible offshore staffing packages tailored to business size and service needs. Pricing varies by service type and team size. Contact business@telexph.com for a custom quote.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I get started with TelexPH?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit https://www.telexph.com/contact to submit a consultation request, or email business@telexph.com. The TelexPH team will schedule a discovery call to understand your needs and recommend the right service package.",
      },
    },
  ],
};

// ✅ 5. Service List Schema — complete catalog
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": "https://www.telexph.com/#servicelist",
  "name": "TelexPH BPO Services",
  "description":
    "Complete list of business process outsourcing services offered by TelexPH, including AI automation, GoHighLevel administration, offshore staffing, and customer support.",
  "url": "https://www.telexph.com/services",
  "numberOfItems": 7,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Service",
        "name": "AI-Powered Business Support",
        "description":
          "Business processes enhanced by AI automation to reduce manual overhead and increase operational efficiency.",
        "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
        "areaServed": ["US", "GB", "AU", "CA"],
        "serviceType": "AI Automation",
        "url": "https://www.telexph.com/services",
      },
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Service",
        "name": "GoHighLevel Administration",
        "description":
          "Certified GoHighLevel CRM management, funnel building, automation workflows, and white-label agency delivery.",
        "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
        "areaServed": ["US", "GB", "AU", "CA"],
        "serviceType": "CRM Administration",
        "url": "https://www.telexph.com/services",
      },
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Service",
        "name": "Offshore Staffing",
        "description":
          "Scalable professional offshore teams for marketing agencies and global enterprises.",
        "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
        "areaServed": ["US", "GB", "AU", "CA"],
        "serviceType": "Offshore Staffing",
        "url": "https://www.telexph.com/services",
      },
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Service",
        "name": "Customer Experience (CX)",
        "description":
          "24/7 customer support outsourcing across phone, email, chat, and social media.",
        "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
        "areaServed": ["US", "GB", "AU", "CA"],
        "serviceType": "Customer Support",
        "url": "https://www.telexph.com/services",
      },
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Service",
        "name": "Virtual Assistance",
        "description":
          "Dedicated virtual assistants trained in GHL, Slack, Notion, Asana, and modern business tools.",
        "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
        "areaServed": ["US", "GB", "AU", "CA"],
        "serviceType": "Virtual Assistance",
        "url": "https://www.telexph.com/services",
      },
    },
    {
      "@type": "ListItem",
      "position": 6,
      "item": {
        "@type": "Service",
        "name": "Sales & Lead Generation",
        "description":
          "Outbound campaigns, CRM management, pipeline automation, and appointment setting.",
        "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
        "areaServed": ["US", "GB", "AU", "CA"],
        "serviceType": "Lead Generation",
        "url": "https://www.telexph.com/services",
      },
    },
    {
      "@type": "ListItem",
      "position": 7,
      "item": {
        "@type": "Service",
        "name": "Back Office Solutions",
        "description":
          "Data entry, administrative support, document processing, and end-to-end business process management.",
        "provider": { "@type": "Organization", "@id": "https://www.telexph.com/#organization" },
        "areaServed": ["US", "GB", "AU", "CA"],
        "serviceType": "Back Office Support",
        "url": "https://www.telexph.com/services",
      },
    },
  ],
};

// ✅ 6. BreadcrumbList Schema — site navigation for AI crawlers
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.telexph.com",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://www.telexph.com/services",
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "About",
      "item": "https://www.telexph.com/about",
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Contact",
      "item": "https://www.telexph.com/contact",
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Case Studies",
      "item": "https://www.telexph.com/case-studies",
    },
    {
      "@type": "ListItem",
      "position": 6,
      "name": "Blog",
      "item": "https://www.telexph.com/resources/blogs",
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
      <head>
        {/* ✅ Canonical llms.txt reference for AI crawlers */}
        <link rel="alternate" type="text/plain" href="https://www.telexph.com/llms.txt" title="LLMs.txt" />
      </head>
      <body
        className="font-rubik antialiased bg-white text-black"
        suppressHydrationWarning={true}
      >
        {/* ✅ JSON-LD Structured Data — 6 schemas for maximum AEO coverage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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