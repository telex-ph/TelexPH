"use client";

import React, { useState } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import DetailsHero from "./components/DetailsHero";
import JobDetails from "./components/JobDetails";

export default function JobDetailsPage() {
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-poppins">
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <main className="pt-[100px] pb-12 w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-5">
          <DetailsHero />
          <JobDetails />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}