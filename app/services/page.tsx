"use client";

import React, { useState } from "react";

import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import WhatWeOfferHero from "./components/WhatWeOfferHero";
import ServiceFeatures from "./components/ServiceFeatures";
import ServiceProcess from "./components/ServiceProcess";
import ServiceTestimonials from "./components/ServiceTestimonials";
import ContactSupport from "@/components/ContactSupport/ContactSupport";

export default function WhatWeOfferPage() {
  const [showNav, setShowNav] = useState(false);

  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);

  return (
    <div className="min-h-screen bg-gray-50">
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
    </div>
  );
}