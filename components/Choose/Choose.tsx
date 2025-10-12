import React from "react";
import ChooseContent from "./ChooseContent";
const DEFAULT_MAX_WIDTH_CLASS = "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8";

const Choose = () => {
  return (
    <div id="choose" className="pt-12 pb-12 lg:pt-20 lg:pb-20 relative overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/choosebg.jpg')" }}
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