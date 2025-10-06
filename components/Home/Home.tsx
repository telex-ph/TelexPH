// Home.tsx (assuming this is app/page.tsx or pages/index.tsx)

import React from "react";
// Assuming these are the paths to your components
import Hero from "./Hero/Hero"; 
import Choose from "@/components/Choose/Choose";
import Footer from "@/components/Footer/Footer";
// Make sure the path to your About component is correct. 
import Partners from "../Partners/Partners";
import AboutUs from "../AboutUs/AboutUs";
import PartnerLogos from "../PartnerLogos/PartnerLogos";
import ServicesGrid from "../Services/Services";

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
      
      <Footer />
    </div>
  );
};

export default Home;