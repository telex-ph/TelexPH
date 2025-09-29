import React from "react";
import Hero from "./Hero/Hero";
import Hotel from "@/components/Hotel/Hotel";
import Footer from "@/components/Footer/Footer";
import About from "../About/About";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <About />
      <Hotel />
      <Footer />
    </div>
  );
};

export default Home;
