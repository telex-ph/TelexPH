import React from "react";
import ChooseContent from "./ChooseContent";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout"; 

const Choose = () => {
  const backgroundImageStyle = { 
    backgroundImage: "url('/images/choosebg.jpg')" 
  };
  
  return (
    <div id="choose" className="pt-20 pb-20 relative overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={backgroundImageStyle}
      ></div>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-white/90"></div>
      <div className={DEFAULT_MAX_WIDTH_CLASS + " relative z-10"}>
        <ChooseContent />
      </div>
    </div>
  );
};

export default Choose;