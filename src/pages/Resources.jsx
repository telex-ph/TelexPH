
import { useState } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import CaseStudiesHero from "./Resources/CaseStudiesHero";
import CaseStudies from "./Resources/CaseStudies";
import CaseStudiesFilter from "./Resources/CaseStudiesFilter";
function ResourcesPage() {
  const [showNav, setShowNav] = useState(false);
  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);
  return <div className="min-h-screen bg-white">
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />

      <main>
        <CaseStudiesHero />
        <CaseStudiesFilter />
        <CaseStudies />
      </main>

      <Footer />
    </div>;
}
export {
  ResourcesPage as default
};
