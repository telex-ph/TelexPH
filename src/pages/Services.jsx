
import { useState } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import WhatWeOfferHero from "./Services/WhatWeOfferHero";
import ServiceFeatures from "./Services/ServiceFeatures";
import ServiceProcess from "./Services/ServiceProcess";
import ServiceTestimonials from "./Services/ServiceTestimonials";
import ContactSupport from "@/components/ContactSupport/ContactSupport";
function WhatWeOfferPage() {
  const [showNav, setShowNav] = useState(false);
  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);
  return <div className="min-h-screen bg-gray-50">
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />

      <main>
        <WhatWeOfferHero /> 
        
        <div id="our-services" className="bg-white">
          <ServiceFeatures />
        </div>

        <div id="contact" className="mt-5">
          <ContactSupport />        
        </div>
        
        <div id="our-works">
          <ServiceProcess /> 
        </div>
        
        <div id="testimonials">
          <ServiceTestimonials />
        </div>
      </main>
      
      <Footer />
    </div>;
}
export {
  WhatWeOfferPage as default
};
