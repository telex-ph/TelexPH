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
        suppressHydrationWarning={true}  // This line suppresses the hydration mismatch warning
      >
        <ResponsiveNav />
        {children}
        <ExitIntentPopup />
        <div id="modal-root" />
      </body>
    </html>
  );
}