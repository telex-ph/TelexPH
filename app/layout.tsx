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
  metadataBase: new URL("https://telexph.com"),
  title: {
    default: "TelexPH",
    template: "%s | TelexPH",
  },
  description:
    "We deliver world-class business support services designed to optimize efficiency, reduce costs, and empower your growth. Together, let's build smarter, scalable solutions for your success.",
  authors: [{ name: "TelexPH Team", url: "https://telexph.com" }],
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
    url: "https://telexph.com",
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
  "url": "https://telexph.com",
  "logo": "https://telexph.com/images/Tlxlogo.webp",
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
  "url": "https://telexph.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://telexph.com/resources/blogs?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
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

        {children}
        <div id="modal-root" />
      </body>
    </html>
  );
}