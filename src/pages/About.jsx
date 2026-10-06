
import { useState } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import Partners from "@/components/Partners/Partners";
import Choose from "@/components/Choose/Choose";
import PartnerLogos from "@/components/PartnerLogos/PartnerLogos";
import AboutHero from "./About/AboutHero";
import { ABOUT_SCENES } from "@/components/About/AboutScenes";
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

        <section className="bg-white px-4 pb-10">
          <div className="relative mx-auto w-full max-w-[860px]">
            <div aria-hidden className="absolute inset-6 rounded-full opacity-25 blur-3xl" style={{ background: "#a10000" }} />
            <div className="relative overflow-hidden rounded-3xl p-4 shadow-2xl shadow-black/25 md:p-6" style={{ background: "linear-gradient(135deg,#1a1a1a 0%,#282828 55%,#4d0a0a 100%)" }}>
              <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)" }} />
              <div className="relative mx-auto max-w-[640px]"><ABOUT_SCENES.about /></div>
            </div>
          </div>
        </section>

        <section id="overview">
          <Partners imageSrc="/images/about1.webp" backgroundColor="bg-white" /> 
          <CompanyOverview />
        </section>

        <section id="mtp">
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
