import React from "react";
import Hero from "./Hero/Hero"; 
import Choose from "@/components/Choose/Choose";
import Footer from "@/components/Footer/Footer";
import Partners from "../Partners/Partners";
import AboutUs from "../AboutUs/AboutUs";
import PartnerLogos from "../PartnerLogos/PartnerLogos";
import ServicesGrid from "../Services/Services";
import ContactSupport from "../ContactSupport/ContactSupport";

const Home = () => {
  return (
    <div className="overflow-hidden">
      
      {/* 1. Hero Section - ID: home */}
      <div id="home">
        <Hero />
      </div>
      
      {/* 2. Partners Section - ID: partners (Moved right after Hero) */}
      <div id="partners">
        <Partners />
      </div>
      
      {/* 3. About Section - ID: about (Moved before Footer) */}
      <div id="about">
        <AboutUs />
      </div>

      {/* 4. Choose Section - ID: choose (Commented out as requested) */}
      <div id="choose">
        <Choose />
      </div>

      {/* 5. PartnerLogos Section - ID: partnerlogos (Commented out as requested) */}
      <div id="partnerlogos">
        <PartnerLogos />
      </div>

      {/* 6. Services Section - ID: services (Commented out as requested) */}
      <div id="services">
        <ServicesGrid />
      </div>
      
      {/* 6. ContactSupport Section - ID: contactsupport (Commented out as requested) */}
      <div id="contactsupport">
        <ContactSupport />
      </div>

      <Footer />
    </div>
  );
};

export default Home;