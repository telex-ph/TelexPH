import { useState } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import ContactHero from "./Contact/ContactHero";
import ContactInfo from "./Contact/ContactInfo";
import ContactForm from "./Contact/ContactForm";
import ContactSection from "./Contact/ContactSection";
import OfficeLocationHeader from "./Contact/OfficeLocationHeader";
const COLORS = {
  white: "#ffffff"
};
const FONTS = {
  rubik: "system-ui, -apple-system, sans-serif"
};
const ContactPage = () => {
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

      <ContactHero />

      <ContactSection />

      <section className="py-16" style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <ContactInfo />

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-30px_rgba(40,16,16,.45)] ring-1 ring-black/5">
            {/* photo panel */}
            <div className="relative hidden min-h-[520px] lg:block">
              <img src="/images/about1.webp" alt="The TelexPH team" loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 35%" }} />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.05) 30%, rgba(40,8,8,.92) 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-10 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#e0c08a" }}>Let's talk</p>
                <p className="mt-3 text-3xl font-bold leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Tell us what you need. We'll handle the rest.</p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ backgroundColor: COLORS.white }}>
        <OfficeLocationHeader />
      </section>
      
      <Footer />
    </div>;
};
var stdin_default = ContactPage;
export {
  stdin_default as default
};
