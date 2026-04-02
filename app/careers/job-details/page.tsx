"use client";

import React, { useState, Suspense } from "react";
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
        <div className="max-w-full mx-auto flex flex-col gap-5">
          <div className="w-full">
            <Suspense fallback={<div>Loading...</div>}>
              <DetailsHero />
            </Suspense>
          </div>
          <div className="max-w-7xl mx-auto px-6 w-full flex flex-col gap-5">
            <Suspense fallback={<div>Loading...</div>}>
              <JobDetails />
            </Suspense>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}