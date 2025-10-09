import type { Metadata, Viewport } from "next";
import "./globals.css";
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import LoadingProvider from "@/components/ProgressProvider/ProgressProvider";
import { Poppins, Open_Sans, Rubik } from "next/font/google";

// ✅ Font setup (Keeping this as is)
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
  width: 'device-width',
  initialScale: 1,
  themeColor: '#a10000', 
};

export const metadata: Metadata = {
  // --- Basic SEO & Configuration ---
  metadataBase: new URL("https://telexph.com"),
  title: {
    default: "TelexPH",
    template: "%s | TelexPH",
  },
  description: "TelexPH offers comprehensive Multi-Service BPO Solutions, including VoIP, Cloud Communication, RPA Automation, Marketing, and Creative Services in the Philippines.",
  
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
    icon: "/images/telexlogo.png",
    shortcut: "/images/telexlogo.png",
    apple: "/images/telexlogo.png",
  },
  
  openGraph: {
    title: "TelexPH: Multi-Service BPO and Digital Solutions Provider",
    description: "Get end-to-end BPO, Automation, and Creative Services from TelexPH in the Philippines. The future of outsourced business support.",
    url: "https://telexph.com", 
    siteName: "TelexPH",
    images: [
      {
        url: "/images/telexlogo.png",
        width: 1200,
        height: 630,
        alt: "TelexPH Official Logo - BPO, Tech, and Automation Solutions",
        type: "image/png", 
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "TelexPH: BPO, Automation, and Digital Services Expert",
    description: "Multi-Service BPO solutions including RPA, Marketing, and Cloud Communications.",
    images: ["/images/telexlogo.png"],
  },
};

// ✅ Root Layout
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${openSans.variable} ${rubik.variable}`}
    >
      <body className="font-rubik antialiased bg-white text-black">
          <ResponsiveNav />
          {children}
      </body>
    </html>
  );
}