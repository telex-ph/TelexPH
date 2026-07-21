
import { useState } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import Partners from "@/components/Partners/Partners";
import Choose from "@/components/Choose/Choose";
import PartnerLogos from "@/components/PartnerLogos/PartnerLogos";
import AboutHero from "./About/AboutHero";
import CompanyOverview from "./About/CompanyOverview";
import MissionVision from "./About/MissionVision";
import Team from "./About/Team";
function AboutPage() {
  const [showNav, setShowNav] = useState(false);
  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);
  return <div className="min-h-screen bg-white">
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />

      <main>
        <AboutHero />

        <section id="overview">
          <Partners imageSrc="/images/about1.webp" backgroundColor="bg-white" /> 
          <CompanyOverview />
        </section>

        <section id="mission-vision">
          <MissionVision />
        </section>

        <section id="choose-us">
          <Choose />
        </section>

        <PartnerLogos />

        <section id="our-team">
          <Team />
        </section>
      </main>

      <Footer />
    </div>;
}
export {
  AboutPage as default
};
