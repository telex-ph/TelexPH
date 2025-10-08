import type { Metadata } from "next";
import "./globals.css";
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import ProgressProvider from "@/components/ProgressProvider/ProgressProvider";
import { Poppins, Open_Sans, Rubik } from "next/font/google";

// ✅ Font setup
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

// ✅ Page metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://telexph.com"),
  title: {
    default: "TelexPH",
    template: "%s | TelexPH",
  },
  description: "TelexPH: Your trusted partner for modern communication solutions.",
  icons: {
    icon: "/images/telexlogo.png",
    shortcut: "/images/telexlogo.png",
    apple: "/images/telexlogo.png",
  },
  openGraph: {
    title: "TelexPH",
    description: "TelexPH: Your trusted partner for modern communication solutions.",
    url: "/",
    siteName: "TelexPH",
    images: [
      {
        url: "/images/telexlogo.png",
        width: 1200,
        height: 630,
        alt: "TelexPH Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TelexPH",
    description: "TelexPH: Your trusted partner for modern communication solutions.",
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
        <ProgressProvider>
          <ResponsiveNav />
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
