import React from "react";
import Hero from "./Hero/Hero";
import Choose from "@/components/Choose/Choose";
import Footer from "@/components/Footer/Footer";
import About from "../About/About";

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* 1. Hero Section - ID: home */}
      <div id="home">
        <Hero />
      </div>
      
      {/* 2. About Section - ID: about */}
      <div id="about">
        <About />
      </div>
      
      {/* 3. Choose Section - ID: choose */}
      <div id="choose">
        <Choose />
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;