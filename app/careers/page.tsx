"use client";

import React, { useState } from "react";

import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import CareerHero from "./components/CareerHero";
import CareerCards from "./components/CareerCards";
import FrequentlyAsk from "./components/FrequentlyAsk";
import StatsSection from "./components/StatsSection";


export default function CareersHomePage() {
  const [showNav, setShowNav] = useState(false);

  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />

      <main>
        <CareerHero />
        <div>
          <StatsSection />        
        </div>
        <div className="min-h-screen bg-gray-50">
          <CareerCards />
        </div>
        <div>
          <FrequentlyAsk />        
        </div>
      </main>
      
      <Footer />
    </div>
  );
}