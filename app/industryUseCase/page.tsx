"use client";

import React, { useState } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import UseCaseOverview from "./components/UseCaseOverview";
import UseCaseChallenges from "./components/UseCaseChallenges";
import UseCaseSolution from "./components/UseCaseSolution";
import UseCaseScenario from "./components/UseCaseScenario";
import UseCaseToolsAndTechnology from "./components/UseCaseToolsAndTechnology";
import UseCaseWhy from "./components/UseCaseWhy";
import UseCaseHero from "./components/UseCaseHero";

import { COLORS } from "@/constant/styles";

export default function IndustryUseCasePage() {
  const [showNav, setShowNav] = useState(false);

  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />

      <main className="bg-white"> 
        <section id="hero">
          <UseCaseHero />
        </section>
        
        <section id="overview">
          <UseCaseOverview />
        </section>
        
        <section id="challenges">
          <UseCaseChallenges />
        </section>
        
        <section id="solutions">
          <UseCaseSolution />
        </section>
        
        <section id="scenarios">
          <UseCaseScenario />
        </section>
        
        <section id="tools">
          <UseCaseToolsAndTechnology />
        </section>
        
        <section id="why-telex">
          <UseCaseWhy />
        </section>
      </main>

      <Footer />
    </div>
  );
}