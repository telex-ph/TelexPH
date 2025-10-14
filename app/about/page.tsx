"use client";

import React, { useState } from "react";

// ✅ Reusable layout components
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import Partners from "@/components/Partners/Partners";

// ✅ Page-specific section components
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
      {/* ✅ Navigation */}
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />

      {/* ✅ Main Page Sections */}
      <main>
        <AboutHero />

        {/* ✅ Partners with custom image */}
        <Partners imageSrc="/images/about1.jpg" />

        <CompanyOverview />
        <MissionVision />
        <CoreValues />
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
