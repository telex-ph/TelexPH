"use client";

import React, { useState } from "react";
// Reusable layout components (assuming these are in your global components folder)
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";

// Page-specific section components (from the new local 'components' folder)
import AboutHero from "./components/AboutHero";
import CompanyOverview from "./components/CompanyOverview";
import MissionVision from "./components/MissionVision";
import CoreValues from "./components/CoreValues";


export default function AboutPage() {
  const [showNav, setShowNav] = useState(false);
  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />

      {/* Main Content Sections (Clean and Composed) */}
      <main>
          <AboutHero />
          <CompanyOverview />
          <MissionVision />
          <CoreValues />
      </main>

      <Footer />
    </div>
  );
}