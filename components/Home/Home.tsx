import React from "react";
import Hero from "./Hero/Hero";
import Choose from "@/components/Choose/Choose";
import Footer from "@/components/Footer/Footer";
import About from "../About/About";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <About />
      <Choose />
      <Footer />
    </div>
  );
};

export default Home;