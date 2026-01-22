"use client";

import React, { useState } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";

// **MGA COMPONENTS PARA SA HOME PAGE**
import CareerHero from "./components/CareerHero";
import CareerCards from "./components/CareerCards";
import CareerButton from "./components/CareerButton";

export default function CareersHomePage() {
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-poppins">
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <main className="pt-[140px] pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <CareerHero />
          <div>
          </div>
          <CareerCards />
        </div>
        <CareerButton />
      </main>

      <Footer />
    </div>
  );
}