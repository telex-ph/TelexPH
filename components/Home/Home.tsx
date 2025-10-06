// Home.tsx (assuming this is app/page.tsx or pages/index.tsx)

import React from "react";
// Assuming these are the paths to your components
import Hero from "./Hero/Hero"; 
import Choose from "@/components/Choose/Choose";
import Footer from "@/components/Footer/Footer";
// Make sure the path to your About component is correct. 
import Partners from "../Partners/Partners";
import AboutUs from "../AboutUs/AboutUs";

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
      
      {/* 3. Choose Section - ID: choose (Commented out as requested) */}
      {/* <div id="choose">
        <Choose />
      </div> */}
      
      {/* 4. About Section - ID: about (Moved before Footer) */}
      <div id="about">
        <AboutUs />
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;