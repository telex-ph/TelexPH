import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import CompanyDetails from "./CompanyDetails";

const About = () => {
  return (
    <div id="about" className="pt-20 pb-20 bg-[#f8f8f8] relative overflow-hidden scroll-mt-[120px]">
      <div
        className="absolute bottom-[-10%] left-[-5%] right-0 text-[10rem] md:text-[14rem] lg:text-[18rem] 
                   text-red-500 opacity-10 font-extrabold select-none pointer-events-none 
                   leading-none z-0"
      >
        <span className="text-fill-transparent text-outline-red-thin">
          GROW WITH TELEXPH
        </span>
      </div>

      <div className="w-[85%] mx-auto relative z-10">
        <div className="flex justify-between items-start mb-12"></div>

        {/* Content Section */}
        <CompanyDetails />
      </div>
    </div>
  );
};

export default About;