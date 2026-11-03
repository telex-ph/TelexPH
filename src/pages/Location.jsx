
import { useState } from "react";
import Image from "next/image";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import LocationHero from "./Location/LocationHero";
import LocationMap from "./Location/LocationMap";
import Footer from "@/components/Footer/Footer";
import { LOGISTICS_CTA_URL } from "@/constant/links";
import { COLORS, FONTS, TYPOGRAPHY, getColorWithOpacity } from "@/constant/styles";
const headingStyle = { fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: COLORS.dark };
const bodyStyle = { fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.75) };
const linkStyle = { color: COLORS.primary };
const OFFICE_PHOTOS = [
  { src: "/images/office-outside.jpg", caption: "Our office building", alt: "TelexPH Philippines office building in Guimba, Nueva Ecija" },
  { src: "/images/office-frontDesk.jpg", caption: "Front desk", alt: "TelexPH front desk with the Telex logo wall, workstations and staff lockers" },
  { src: "/images/office-production.jpg", caption: "Production floor", alt: "TelexPH support agents at their workstations on the Guimba production floor" }
];
const LocationPage = () => {
  const [showNav, setShowNav] = useState(false);
  return <div
    className="min-h-screen"
    style={{
      backgroundColor: COLORS.white,
      fontFamily: FONTS.rubik
    }}
  >
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      {
    /* Hero Section */
  }
      <LocationHero />

      {
    /* Office Details */
  }
      <section className="pt-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="mb-8 text-base md:text-lg leading-relaxed" style={bodyStyle}>
            Our office is in Guimba, Nueva Ecija, Philippines, about an hour from Clark. TelexPH builds and manages dedicated customer support teams for growing businesses. Team leads, QA and monthly reporting are included, and we've been operating since 2018.
          </p>

          <h2 className="text-2xl md:text-3xl mb-4" style={headingStyle}>Already in the Philippines?</h2>
          <p className="mb-4" style={bodyStyle}>
            If your business is based here or you're visiting, you're welcome to see our office and meet the team. Our office runs 24/7, and visits are available Monday to Friday by appointment.
          </p>
          <p className="mb-8" style={bodyStyle}>
            <a href="mailto:business@telexph.com?subject=Office%20visit%20request" className="underline" style={linkStyle}>Schedule an office visit</a>
            <span className="mx-2">·</span>
            <a href={LOGISTICS_CTA_URL} target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>Book a discovery call</a>
          </p>

          <address className="not-italic space-y-1" style={bodyStyle}>
            <p><strong>Address:</strong> Brgy. Cawayan Bugtong, Guimba, Nueva Ecija 3115, Philippines</p>
            <p><strong>Phone:</strong> <a href="tel:+63443252836" className="underline" style={linkStyle}>+63-44-325-2836</a></p>
            <p><strong>Email:</strong> <a href="mailto:business@telexph.com" className="underline" style={linkStyle}>business@telexph.com</a></p>
          </address>
        </div>

        <div className="max-w-6xl mx-auto mt-12 grid gap-6 sm:grid-cols-3">
          {OFFICE_PHOTOS.map((photo) => <figure key={photo.src}>
              <Image src={photo.src} alt={photo.alt} width={1280} height={853} sizes="(min-width: 640px) 33vw, 100vw" className="w-full h-auto aspect-[3/2] object-cover rounded-2xl" />
              <figcaption className="mt-2 text-sm text-center" style={bodyStyle}>{photo.caption}</figcaption>
            </figure>)}
        </div>
      </section>

      {
    /* Map Section - Full Width Bottom */
  }
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <LocationMap />
        </div>
      </section>

      {
    /* Footer */
  }
      <Footer />
    </div>;
};
var stdin_default = LocationPage;
export {
  stdin_default as default
};
