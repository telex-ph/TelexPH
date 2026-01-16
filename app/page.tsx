import React from "react";
import Home from "@/components/Home/Home";
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import ExitIntentPopup from "./exit-intent/components/ExitIntentPopup";

const HomePage = () => {
  return (
    <div>
      <ResponsiveNav />
      <Home />
      <ExitIntentPopup />
    </div>
  );
};

export default HomePage;
